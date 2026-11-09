// Smoke test: stub obsidian + DOM, exercise the key blocking decisions.
const assert = require("node:assert");
const Module = require("node:module");

class Plugin {
  constructor(app) { this.app = app; }
  addCommand() {} addRibbonIcon() {} registerDomEvent() {}
}
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (req, ...rest) {
  if (req === "obsidian") return "obsidian";
  return origResolve.call(this, req, ...rest);
};
require.cache["obsidian"] = { id: "obsidian", loaded: true, exports: { Plugin } };

global.createDiv = () => fakeEl();
global.document = {
  body: {
    classList: { toggle: (c, on) => { global.__cls = on; } },
    appendChild: () => {},
  },
};

function fakeEl() {
  const el = {
    cls: new Set(),
    removed: false,
    addEventListener() {},
    remove() { el.removed = true; },
  };
  el.classList = {
    add: (c) => el.cls.add(c),
    remove: (c) => el.cls.delete(c),
    contains: (c) => el.cls.has(c),
  };
  return el;
}

const DraftFocus = require("./main.js");
const plugin = new DraftFocus({ workspace: { activeEditor: undefined } });

function key(k, opts = {}) {
  const ev = {
    key: k,
    ctrlKey: !!opts.ctrl,
    metaKey: !!opts.meta,
    target: opts.inEditor === false ? { closest: () => null } : { closest: (s) => (s === ".cm-editor" ? {} : null) },
    prevented: false,
    stopped: false,
    preventDefault() { this.prevented = true; },
    stopPropagation() { this.stopped = true; },
  };
  plugin.handleKey(ev);
  return ev;
}

plugin.setActive(true);
assert.equal(global.__cls, true, "body class added");
assert.equal(key("Backspace").prevented, true, "backspace blocked in editor");
assert.equal(key("Delete", { meta: true }).prevented, true, "delete blocked");
assert.equal(key("z", { ctrl: true }).prevented, true, "undo blocked");
assert.equal(key("z", { ctrl: true, inEditor: false }).prevented, false, "undo works outside editor");
assert.equal(key("b", { ctrl: true }).prevented, false, "normal typing passes");
assert.equal(key("Backspace").stopped, true, "event does not reach editor");

const esc = key("Escape");
assert.equal(esc.prevented, true, "escape handled");
assert.equal(plugin.active, false, "escape exits draft mode");
assert.equal(global.__cls, false, "body class removed");

plugin.setActive(true);
key("Backspace"); // blocked while active
plugin.setActive(false);
assert.equal(key("Backspace").prevented, false, "backspace works again after exit");

console.log("all checks passed");
