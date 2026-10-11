# Plan

Read `AGENTS.md` first. Do not commit, push, or SSH unless the user asks.

## Git

`origin/main` is `4876697` ("Let UFO and tornado be sent away and called back, and fire the equipped weapon with F."). That commit is pushed. The working tree is dirty and must not be amended onto it.

Uncommitted files:

- `AGENTS.md`, `PLAN.md` — handoff for the next agent
- `index.html` — `styles.css?v=17`, `main.js?v=52`
- `src/options.js` — Pi 4 lock
- `src/main.js` — Pi reset, Barnyard player cow, strip close
- `src/life.js` — sheep mesh, herd transform and restore
- `src/weather.js` — Barnyard entry and sky
- `src/styles.css` — disabled size and resolution buttons

## Shipped on origin/main

- Hair stretches every 2 seconds. Chin mesh and trail update in place until regenerate or jack-o'-lantern.
- Each map size has its own object counts. The slider number is the number built. People and animals stand on open ground, not roofs.
- UFO and tornado can be sent away and called back. Hurricane cannot.
- `F` fires the equipped weapon in explore mode.

## Uncommitted, already implemented

### Pi 4 light world

`looksLikePi4()` in `src/options.js`. On a Pi 4 only: lock Tiny, lock 360p, and use half of the Tiny counts (0 stays off, 1 stays 1, 3 becomes 2). Sliders stay editable after the first save (`piHalf: 1`). iPhone, iPad, Android, and desktop stay fully unlocked. Both bumpers on a Pi rebuild that light world instead of Small.

If the kiosk reports `llvmpipe` or some other renderer string, detection fails open and the Pi is not locked. Adjust `looksLikePi4()` only with a renderer string that phones and desktops do not use. Do not treat touch or `Linux aarch64` as a Pi.

### Barnyard weather

Weather id `herd`, cow icon, placed after Night and before Rain so it is not a disaster. It turns inhabitants into cows, chickens, or sheep and turns the player into a cow on two legs. Another weather restores both. Clicking Barnyard again shuffles the animals.

### Strip close

Gamepad A, and a touch tap, select the weapon or weather, hide the strip, and return to explore. The weapon stays equipped and the weather stays active. A shootable weapon fires on the next A, F, or screen tap. A desktop mouse click still leaves the strip open.

Checked locally: Pi detection matrix, halved counts, desktop sizes and resolutions stay free, Barnyard forms and the two-leg walk, restore on Clear, machine-gun shot after the strip closes, touch tap closes, mouse click stays.

## When the user asks to ship

1. Review the dirty diff. Do not commit secrets.
2. Commit on `main` with a message about why, then push. Do not amend `4876697`.
3. The Pi stays on the old files until someone runs `/storage/git-pull.sh`. Do that only if asked. `node_modules` on the Pi must remain.
4. Bump cache queries forward if any JS or CSS changed after `v=52`.

## Leave alone unless asked

- Escape exits explore mode only. It does not leave the kiosk.
- Do not dispose shared geometries or shared materials.
- Do not paint or hide the world bucket. Paint tree and barn meshes, not their parent groups.
- Towns, rural sites, and farms still add settlements beyond the house slider. Tiny has none, and the Pi lock uses Tiny, so that extra set is already zero there.
