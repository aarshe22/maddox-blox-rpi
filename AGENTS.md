# Maddox Blox

Brick-toy Three.js sandbox. No build step. Work only in this repo: `/Users/localuser/CODE/maddox-blox-rpi`.

Git remote: `https://github.com/aarshe22/maddox-blox-rpi.git`, branch `main`. Live site: `https://blox.badlandscloud.com`. Do not commit, push, or SSH unless the user asks. Current handoff state is in `PLAN.md`.

## Run

- `npm run dev` serves `http://127.0.0.1:8016`, or any static server from the repo root.
- `index.html` import map must exist before the module script. Primary Three path is `./node_modules/three/build/three.module.js` and `./node_modules/three/examples/jsm/`. jsDelivr `three@0.186.0` is only the fallback when the local file is missing.
- `node_modules` is gitignored and must stay on the Pi. The kiosk serves `/storage/games/maddox-blox/`. Python's directory index is `index.html`, not `index.php`.
- `window.GAME` is the running game. `Runtime.evaluate` must be an IIFE. `THREE` and `WEAPONS` are not page globals.
- Kill preview servers when finished. Do not launch the kiosk Chromium just to play.

## Cache

Safari and the live nginx cache unchanged URLs. Bump the query string, and never set a version backward. An unversioned `import` stays stale: version it inside the parent module and bump the parent's query in `index.html`. The stylesheet is `src/styles.css`, not a repo-root file.

Current queries: `src/styles.css?v=18`, `src/main.js?v=56`, and inside `main.js`: `options.js?v=18`, `weaponry.js?v=16`, `sfx.js?v=14`, `voice.js?v=1`, `life.js?v=4`, `weather.js?v=1`.

## Deploy

A push does not update the Pi. The Pi overlay is `/storage/git-pull.sh` (not in this repo). It downloads the GitHub `main` tarball onto `/storage/games/maddox-blox` and leaves `node_modules` in place. Run it only when asked. The public site is also not instant. iOS home-screen icons update only after the shortcut is removed and added again.

Pi kiosk: LibreELEC on a Raspberry Pi 4, hostname `libreelec-munro`. Do not SSH unless asked. Escape stays explore. Never bind Escape to exit the kiosk.

## Options and the Pi 4 lock

`src/options.js`. Persistence key `maddox-blox-options-pi2`.

Map sizes are real half-extents: Tiny 44, Small 60, Large 96, Huge 144, hard cap 160. Each `SIZES` entry has its own `counts`. Picking a size replaces `opts.counts` and `opts.enabled`. `World.count()` returns that slider value clamped 0..900. There is no hidden tree or flower multiplier. Reset restores Tiny counts, size, and resolution. It does not reset sound, birds, debug, or the controller map. The mapped Options button (top L, default LB) opens Options. The mapped Regenerate button (top R, default RB) saves, clears that world's damage, and reloads the page with a fresh cache. Scroll and pinch still zoom.

Resolution: Low 640×360 (default), Medium 1280×720, High 1920×1080. `resize()` uses `resolutionSize` and `setSize(w, h, false)`.

`looksLikePi4()` is the only Pi 4 detector. It rejects Android, iPhone, iPad, Windows, Mac, and ChromeOS user agents first, then accepts a WebGL renderer of V3D 4.x or VideoCore VI. Pi 5 is V3D 7 and stays unlocked. Touch, a coarse pointer, and a generic `aarch64` user agent are not a Pi. If the renderer cannot be read, fail open so phones, tablets, and desktops keep every option. Do not store a lock bit that another browser would honor.

On a detected Pi 4, `applyPiLock()` forces Tiny and Low. The first visit replaces counts with `piObjectCounts()` (half of the Tiny defaults) and sets `piHalf: 1`. Later visits keep the saved sliders. `halfCount`: 0 stays 0; a positive count uses `Math.round(n / 2)` and becomes 1 if that would fall below 1. Size and resolution buttons other than Tiny and Low are disabled. Reset and both bumpers return to that halved Tiny profile.

## Inhabitants

`src/life.js`. People and animals spawn through `clearSpot()` / `feetY()`. `feetY` ignores solids whose top is above 1.55 or below -1.5, so roofs are not ground. Cars, police, and fire still use `ground()` so they can use the bridge. Do not paint a tree or barn parent group. Paint meshes only. Never paint or hide the world bucket.

Hair (`unleashHair`) stretches every 2 seconds and follows footsteps. Jack-o'-lantern `clearHair()` and regenerate cancel it. Water, frost, flood, UFO, and Barnyard do not.

Barnyard is weather id `herd`. `Life.herdAll()` turns each person, animal, bird, and nested rider into a cow, chicken, or sheep. Walking creatures take that animal's size. Riders keep their local size. Birds land and use the ground walker. `Player.setCow(true)` hides the human meshes and adds a cow on the existing two-leg walk. Any other weather calls `clearHerd()`, which puts the stashed meshes back and disposes only the farm-animal materials. Shared `BR` / `CY` / `SP` geometries stay.

## Weapons, weather, and strips

Damage and flow live in `Game` (`src/main.js`). `src/weather.js` is the condition table plus particles, sky, funnel, and wave.

UFO and tornado are toggles. Selecting either again sends it away. Selecting it while it is leaving starts a fresh one. Hurricane is not a toggle. `F` (`KeyF`) fires the equipped weapon in explore mode when the player is outdoors. It is not a movement key. Scenarios are not `armedWeapon()`, so `F` does not launch them.

`closeCommandStrip()` returns to explore without clearing the equipped weapon or the active weather. A click, a tap, a number key, Enter, Space, and gamepad A all do this while a strip is open. Arrows and the stick only move the highlight. The confirming press does not fire. After that, A, F, and a still click or hold on the world fire a shootable weapon. A drag past 18px is a look, not a shot. Enter in build mode places a brick at the center of the view, the same as the controller place button. The controller's top L button (LB) opens Options. Top R (RB) regenerates the world and reloads the page with a fresh cache, the same as the Regenerate & refresh button. In Options the stick moves, A selects a setting, left and right change it, and A saves and closes.

## Materials

`mkMat()` always returns a new material. Replacing `mesh.material` with one is safe. Never mutate a shared material in place. Do not dispose shared `BR` / `CY` / `SP` / `CO`, shared hair materials, or chunk textures when swapping one mesh.

## Gotchas

- `mergeGeometries` needs non-indexed geometry with normals deleted before merging (`bake()`). Empty part lists must short-circuit.
- three r186: `PCFSoftShadowMap` is gone. Use `PCFShadowMap`.
- Colliders that must never support building (trees, bridge pieces, ground) are `noSupport`.
- No LEGO trademarks, logos, set names, or minifigure designs in UI or assets.
- Verify UI changes in the browser, then stop the server. `node --check` each edited module.
