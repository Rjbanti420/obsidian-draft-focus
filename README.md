# Draft Focus

An Obsidian plugin for first drafts. It hides the app and blocks the edit keys, so you keep writing instead of rewriting the sentence you just typed.

## What it does

- Hides the ribbon, sidebars, tab headers, title bar and status bar.
- Blocks **Backspace**, **Delete** and **Ctrl/Cmd+Z** inside the editor.
- Adds a faint pill at the bottom that flashes when a key is blocked.
- **Esc** exits, or click the pill. Your layout comes back exactly as it was.

## Install

### Community plugins

Search for **Draft Focus** in Settings → Community plugins → Browse.

### Manual

1. Download `main.js`, `manifest.json` and `styles.css` from the [latest release](../../releases/latest).
2. Put them in `<vault>/.obsidian/plugins/draft-focus/`.
3. Reload Obsidian and enable **Draft Focus** in Settings → Community plugins.

### BRAT

Add the repo URL in [BRAT](https://github.com/TfTHacker/obsidian42-brat).

## Use

Run **Toggle draft mode** from the command palette, or bind a hotkey in Settings → Hotkeys. The ribbon feather does the same.

## Notes

- This is a speed bump, not a lock: typing over selected text and formatting shortcuts still work. It is meant to stop the reflex, not to trap you.
- Desktop only, because escaping the mode needs a keyboard.

## Development

No build step. `main.js` is the source.

```sh
node test.js
```
