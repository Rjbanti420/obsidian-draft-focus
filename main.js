const { Plugin } = require("obsidian");

module.exports = class DraftFocus extends Plugin {
  async onload() {
    this.active = false;
    this.addCommand({
      id: "toggle",
      name: "Toggle draft mode",
      callback: () => this.setActive(!this.active),
    });
    this.addRibbonIcon("feather", "Draft mode", () => this.setActive(!this.active));
    this.registerDomEvent(document, "keydown", (e) => this.handleKey(e), true);
  }

  onunload() {
    this.setActive(false);
  }

  setActive(on) {
    if (on === this.active) return;
    this.active = on;
    document.body.classList.toggle("draft-focus", on);
    if (on) {
      this.pill = createDiv({ cls: "draft-focus-pill", text: "Drafting · Esc to exit" });
      this.pill.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        this.setActive(false);
      });
      document.body.appendChild(this.pill);
      setTimeout(() => this.app.workspace.activeEditor?.editor?.focus(), 30);
    } else {
      this.pill?.remove();
      this.pill = null;
    }
  }

  handleKey(e) {
    if (!this.active || !e.target?.closest?.(".cm-editor")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this.setActive(false);
      return;
    }
    const blocked =
      e.key === "Backspace" ||
      e.key === "Delete" ||
      ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z");
    if (!blocked) return;
    e.preventDefault();
    e.stopPropagation();
    this.flash();
  }

  flash() {
    if (!this.pill) return;
    this.pill.classList.add("is-blocked");
    setTimeout(() => this.pill?.classList.remove("is-blocked"), 180);
  }
};
