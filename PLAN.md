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
