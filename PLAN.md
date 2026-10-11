# Plan

Read `AGENTS.md` first. Do not commit, push, or SSH unless the user asks.

## Git

`origin/main` includes the shared controls, controller Options, and the no-cache regenerate reload. Do not amend that commit after it is pushed.

The working tree should be clean.

## Shipped on origin/main

- Hair stretches every 2 seconds. Chin mesh and trail update in place until regenerate or jack-o'-lantern.
- Each map size has its own object counts. The slider number is the number built. People and animals stand on open ground, not roofs.
- UFO and tornado can be sent away and called back. Hurricane cannot.
- `F` fires the equipped weapon in explore mode.
- A Pi 4 locks to Tiny, 360p, and half the Tiny object counts. Other devices stay unlocked.
- Barnyard (`herd`) turns inhabitants into cows, chickens, or sheep, and the player into a cow on two legs.
- A click, tap, number key, Enter, Space, or gamepad A selects a weapon or weather, hides the strip, and returns to explore. A still click or hold fires. A drag looks around.
- Mapped top L opens Options. The stick moves, A selects, left and right change the setting, and A saves and closes.
- Mapped top R, and Regenerate & refresh, save options, clear that world's damage, and reload the page with a fresh cache.

## When the user asks to ship

1. Review the dirty diff. Do not commit secrets.
2. Commit on `main` with a message about why, then push. Do not amend a pushed commit.
3. The Pi stays on the old files until someone runs `/storage/git-pull.sh`. Do that only if asked. `node_modules` on the Pi must remain.
4. Bump cache queries forward if any JS or CSS changed after `v=56`.

## Leave alone unless asked

- Escape exits explore mode only. It does not leave the kiosk.
- Do not dispose shared geometries or shared materials.
- Do not paint or hide the world bucket. Paint tree and barn meshes, not their parent groups.
- Towns, rural sites, and farms still add settlements beyond the house slider. Tiny has none, and the Pi lock uses Tiny, so that extra set is already zero there.

## Future: Safari 15 / iPadOS 15 compatibility migration

The live game still shows a blank play area on an iPad running iPadOS 15.8.8. The first compatibility attempt added an ES Module Shims fallback for browsers without native import-map support, but that did not make the game start reliably. The long-term fix is to stop depending on runtime import maps for production.

Planned work:

1. Add Vite as the build system while keeping Three.js 0.186.x unless a separate upgrade is justified.
2. Bundle Three.js, addons, and local game modules into browser-ready static assets; remove production reliance on bare imports, runtime import maps, and CDN fallback loading.
3. Configure the production build for Safari 15 / iPadOS 15 compatibility, including legacy/transpilation support where necessary.
4. Preserve the existing Raspberry Pi performance choices and current game behavior rather than reducing world complexity as a first-line compatibility fix.
5. Add an on-screen startup/fatal-error display so failures are visible without Safari remote debugging.
6. Detect required WebGL/browser capabilities and provide graceful fallbacks or a useful error instead of a blank canvas.
7. Test the generated production build on current desktop/mobile browsers and the iPadOS 15.8.8 target before replacing the live loader.
8. Update Plesk deployment to serve the compiled output. Prefer a workflow that can still be deployed with a simple pull; consider committing build output or adding GitHub Actions only after the build layout is proven.

This is future work, not part of the currently shipped implementation.
