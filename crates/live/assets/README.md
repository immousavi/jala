# Live browser assets

Two generated files, both tracked, both rewritten by `cargo xtask bundle`.
Do not hand-edit either one.

`detect-antipatterns-browser.js` is the in-page detector bundle: the rule
core (`crates/core`) compiled to WebAssembly by `crates/wasm`, concatenated
with the page JS in `browser-bundle/` and the module embedded as base64.
`crates/live/src/browser_assets.rs` embeds it with `include_str!` and the
live server hands it to the browser as `/detect.js`, so the binary has to
carry it.

`antipatterns.json` is the rule registry (`crates/foundation/src/registry.rs`)
as `[{ id, name, category, description }]`, the same slice
`cargo xtask bundle` vendors into the extension's `extension/detector/`. It
is tracked because `extension/detector/` is not: a consumer working from a
source checkout or a repo tarball (impeccable.style counts and renders the
rules from it) has no other way to read the registry without a Rust
toolchain.

> **jala fork note:** the engine intentionally stays upstream — the launcher
> downloads `impeccable-<target>` binaries from the original repo's releases,
> whose registry descriptions are English. This file is regenerated from the
> Rust registry by `cargo xtask bundle`, so translating it by hand is both
> ineffective (nothing user-facing reads the tracked copy) and a drift hazard
> (`cargo xtask bundle --check` fails against a hand-edited file). Persian
> rule text lives in the skill layer: `skill/scripts/command-metadata.json`
> and the translated reference files.

```bash
cargo xtask bundle          # rewrites both (and extension/detector/)
cargo xtask bundle --check  # fails when either is stale
```

The other browser scripts the live server serves (`live-browser*.js`,
`modern-screenshot.umd.js`) are not copied here: they are embedded straight
from `skill/scripts/`, the one copy the build also ships to every provider.
