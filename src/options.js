/* World options: data-driven object types, size presets, persistence, settings panel. */

export const OBJECT_TYPES = [
  { id: 'house', label: 'Houses', icon: '🏠', def: 4, max: 20 },
  { id: 'school', label: 'School', icon: '🏫', def: 1, max: 3 },
  { id: 'church', label: 'Churches', icon: '⛪', def: 1, max: 4 },
  { id: 'store', label: 'Convenience stores', icon: '🏪', def: 1, max: 4 },
  { id: 'playground', label: 'Playgrounds', icon: '🛝', def: 1, max: 6 },
  { id: 'mountain', label: 'Mountains', icon: '⛰️', def: 1, max: 8 },
  { id: 'volcano', label: 'Volcanoes', icon: '🌋', def: 0, max: 3 },
  { id: 'tree', label: 'Trees', icon: '🌳', def: 6, max: 60 },
  { id: 'flower', label: 'Flowers', icon: '🌸', def: 8, max: 200 },
  { id: 'deco', label: 'Arch & well', icon: '⛲', def: 0, max: 1 }
];

/* Each preset changes the real playable half-extent (half) AND the generation
   capacity multipliers: towns (extra villages), rural hamlets, farms,
   collectible spots, trees. `zones` = distinct terrain zones the world carves.
   The 400% expansion: every step of the ladder doubled its linear extent
   (4x the classic playable area), applied evenly across Tiny..Huge. Capacity
   fields scale with the new land so distribution improves, not dilutes:
   trees/flowers are absolute count multipliers, spots scale the collectible
   budget (40 * spots). */
export const SIZES = [
  { id: 'tiny', label: 'Tiny', half: 44, towns: 0, rural: 0, farms: 0, spots: 0.9, trees: 0.6, flowers: 1.2, zones: 1, train: 0 },
  { id: 'small', label: 'Small', half: 60, towns: 2, rural: 2, farms: 3, spots: 1.8, trees: 2.0, flowers: 2.5, zones: 3, train: 0 },
  { id: 'large', label: 'Large', half: 96, towns: 5, rural: 5, farms: 7, spots: 3.0, trees: 4.0, flowers: 4.2, zones: 5, train: 1 },
  { id: 'huge', label: 'Huge', half: 144, towns: 10, rural: 8, farms: 12, spots: 4.4, trees: 7.0, flowers: 6.5, zones: 6, train: 1 }
];
const MAX_HALF = 160; // hard cap: runaway-memory guard for map size

/* Drawing size of the canvas. Low is the default so a Pi stays responsive. */
export const RESOLUTIONS = [
  { id: 'low', label: 'Low', detail: '360p', w: 640, h: 360 },
  { id: 'medium', label: 'Medium', detail: '720p', w: 1280, h: 720 },
  { id: 'high', label: 'High', detail: '1080p', w: 1920, h: 1080 }
];

export function resolutionSize(id) {
  return RESOLUTIONS.find((r) => r.id === id) || RESOLUTIONS[0];
}

const LS_KEY = 'maddox-blox-options-pi2';

export function sizeHalf(id) {
  const s = SIZES.find((x) => x.id === id) || SIZES[1];
  return Math.min(s.half, MAX_HALF);
}

export function sizePreset(id) {
  return SIZES.find((x) => x.id === id) || SIZES[1];
}

export function defaultOptions() {
  const counts = {}, enabled = {};
  for (const t of OBJECT_TYPES) { counts[t.id] = t.def; enabled[t.id] = t.def > 0; }
  return {
    size: 'tiny',
    counts,
    enabled,
    sound: true,
    debug: false,
    resolution: 'low',
    life: { animals: true, birds: false, balloons: false },
    lifeRev: 2
  };
}

export function loadOptions() {
  const o = defaultOptions();
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!raw || !raw.counts) return o;
    if (SIZES.some((s) => s.id === raw.size)) o.size = raw.size;
    if (typeof raw.sound === 'boolean') o.sound = raw.sound;
    if (typeof raw.debug === 'boolean') o.debug = raw.debug;
    if (RESOLUTIONS.some((r) => r.id === raw.resolution)) o.resolution = raw.resolution;
    const keepLife = raw.lifeRev === 2;
    if (raw.life && typeof raw.life === 'object') {
      for (const k of ['animals', 'birds', 'balloons']) {
        if (k === 'birds' && !keepLife) continue;
        if (typeof raw.life[k] === 'boolean') o.life[k] = raw.life[k];
      }
    }
    for (const t of OBJECT_TYPES) {
      const c = raw.counts[t.id];
      if (typeof c === 'number' && isFinite(c)) o.counts[t.id] = Math.max(0, Math.min(t.max, Math.round(c)));
      if (typeof raw.enabled[t.id] === 'boolean') o.enabled[t.id] = raw.enabled[t.id];
    }
    if (!keepLife) saveOptions(o);
  } catch (e) { /* corrupted storage: defaults */ }
  return o;
}

export function saveOptions(o) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch (e) { /* private mode */ }
}

/* Each step of the mapper asks for one of these. Sticks stay analog. */
export const PAD_ACTIONS = [
  { id: 'confirm', label: 'Jump, select, or fire' },
  { id: 'back', label: 'Back' },
  { id: 'weapons', label: 'Weapons' },
  { id: 'weather', label: 'Weather' },
  { id: 'zoomOut', label: 'Zoom out' },
  { id: 'zoomIn', label: 'Zoom in' },
  { id: 'use', label: 'Place a brick' },
  { id: 'forward', label: 'Move forward' },
  { id: 'backMove', label: 'Move back' },
  { id: 'left', label: 'Move left' },
  { id: 'right', label: 'Move right' }
];

export const DEFAULT_PAD = {
  confirm: 0, back: 1, weapons: 2, weather: 3,
  zoomOut: 4, zoomIn: 5, use: 7,
  forward: 12, backMove: 13, left: 14, right: 15
};

const PAD_NAMES = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right'];
const PAD_COOKIE = 'maddox_pad';
const PAD_AGE = 60 * 60 * 24 * 365 * 10;

export function padButtonName(i) {
  return PAD_NAMES[i] || ('Btn ' + i);
}

function cleanPad(map) {
  const out = { ...DEFAULT_PAD };
  if (!map) return out;
  for (const a of PAD_ACTIONS) {
    const n = Number(map[a.id]);
    if (Number.isInteger(n) && n >= 0 && n < 32) out[a.id] = n;
  }
  return out;
}

/* A long-lived cookie, not session storage, so a reboot or a fresh tab keeps it. */
export function savePadMap(map) {
  const clean = cleanPad(map);
  const body = encodeURIComponent(PAD_ACTIONS.map((a) => a.id + ':' + clean[a.id]).join('.'));
  const expires = new Date(Date.now() + PAD_AGE * 1000).toUTCString();
  document.cookie = PAD_COOKIE + '=' + body + '; expires=' + expires + '; max-age=' + PAD_AGE + '; path=/; SameSite=Lax';
  return clean;
}

export function loadPadMap() {
  try {
    const parts = ('; ' + document.cookie).split('; ' + PAD_COOKIE + '=');
    if (parts.length < 2) return { ...DEFAULT_PAD };
    const raw = decodeURIComponent(parts.pop().split(';')[0]);
    const map = {};
    for (const pair of raw.split('.')) {
      const cut = pair.indexOf(':');
      if (cut < 1) continue;
      map[pair.slice(0, cut)] = Number(pair.slice(cut + 1));
    }
    return cleanPad(map);
  } catch (e) {
    return { ...DEFAULT_PAD };
  }
}

export function padSummary(map) {
  const m = cleanPad(map);
  return PAD_ACTIONS.map((a) => padButtonName(m[a.id]) + ' ' + a.label).join(' · ');
}

// Builds the modal DOM. `opts` is mutated live; hooks = { onOpen, onRegen }.
export function buildOptionsPanel(opts, hooks = {}) {
  const el = document.createElement('div');
  el.id = 'options';
  el.innerHTML = `
    <div class="o-card">
      <div class="o-head"><b>World options</b><button class="o-x" title="Close">✕</button></div>
      <div class="o-fit">
        <div>
          <label class="o-sec">Resolution</label>
          <div class="o-seg o-res">${RESOLUTIONS.map((r) => `<button data-res="${r.id}">${r.label}<br>${r.detail}</button>`).join('')}</div>
          <label class="o-sec">Map size</label>
          <div class="o-seg o-size">${SIZES.map((s) => `<button data-size="${s.id}">${s.label}</button>`).join('')}</div>
          <label class="o-sec">Birds</label>
          <div class="o-row o-toggles">
            <button class="o-toggle o-birds" title="Birds are off until you turn them on. Applies when the world regenerates."></button>
          </div>
          <label class="o-sec">Sound &amp; voice</label>
          <div class="o-row o-toggles">
            <button class="o-toggle o-snd" title="Read aloud weapon, block and weather selections; click to mute everything"></button>
          </div>
          <label class="o-sec">Developer</label>
          <div class="o-row o-toggles">
            <button class="o-toggle o-dbg" title="Logs player physics frames to find fall-through bugs"></button>
            <button class="o-copy" title="Copy all captured debug rows to the clipboard">📋 Copy debug log</button>
          </div>
          <label class="o-sec">Controller</label>
          <div class="o-pad">
            <div class="o-pad-actions">
              <button type="button" class="o-pad-go">Map controller</button>
              <button type="button" class="o-pad-std">Standard buttons</button>
            </div>
            <p class="o-pad-step" aria-live="polite"></p>
          </div>
          <div class="o-note">Resolution applies right away. Map and object changes apply when you regenerate.</div>
          <div class="o-actions"><button class="o-regen">♻️ Regenerate world</button></div>
        </div>
        <div>
          <label class="o-sec">Objects — count &amp; on/off</label>
          <div class="o-rows"></div>
        </div>
      </div>
    </div>`;

  const rowsWrap = el.querySelector('.o-rows');
  const syncers = [];
  for (const t of OBJECT_TYPES) {
    const row = document.createElement('div');
    row.className = 'o-row';
    row.innerHTML = `<span class="o-name"><span class="o-icon">${t.icon}</span><span class="o-label">${t.label}</span></span>
      <input type="range" min="0" max="${t.max}" step="1" aria-label="${t.label} count" />
      <b class="o-val"></b>
      <span class="o-sw"><input type="checkbox" aria-label="${t.label} enabled" /></span>`;
    const range = row.querySelector('input[type=range]');
    const chk = row.querySelector('input[type=checkbox]');
    const val = row.querySelector('.o-val');
    const sync = () => {
      range.value = opts.counts[t.id];
      val.textContent = String(opts.counts[t.id]);
      chk.checked = opts.enabled[t.id];
      row.classList.toggle('off', !opts.enabled[t.id]);
    };
    range.addEventListener('input', () => {
      opts.counts[t.id] = +range.value;
      val.textContent = range.value;
      if (opts.enabled[t.id] && +range.value === 0) { opts.enabled[t.id] = false; }
      else if (+range.value > 0 && !opts.enabled[t.id]) { opts.enabled[t.id] = true; }
      row.classList.toggle('off', !opts.enabled[t.id]);
      chk.checked = opts.enabled[t.id];
    });
    chk.addEventListener('change', () => {
      opts.enabled[t.id] = chk.checked;
      row.classList.toggle('off', !chk.checked);
    });
    rowsWrap.appendChild(row);
    syncers.push(sync);
    sync();
  }

  const segs = [...el.querySelectorAll('.o-size button')];
  const syncSegs = () => segs.forEach((b) => b.classList.toggle('active', b.dataset.size === opts.size));
  for (const b of segs) b.addEventListener('click', () => { opts.size = b.dataset.size; syncSegs(); });

  const resBtns = [...el.querySelectorAll('.o-res button')];
  const syncRes = () => resBtns.forEach((b) => b.classList.toggle('active', b.dataset.res === (opts.resolution || 'low')));
  for (const b of resBtns) b.addEventListener('click', () => {
    opts.resolution = b.dataset.res;
    syncRes();
    saveOptions(opts);
    if (hooks.onResolution) hooks.onResolution(opts.resolution);
  });
  syncRes();

  /* Sound/voice + fall-debug toggles take effect immediately (no regen), and
     persist with the rest of the options. */
  const birdsBtn = el.querySelector('.o-birds');
  const syncBirds = () => {
    const on = !!opts.life.birds;
    birdsBtn.classList.toggle('on', on);
    birdsBtn.textContent = on ? '🐦 Birds: on' : '🐦 Birds: off';
  };
  birdsBtn.addEventListener('click', () => {
    if (!opts.life) opts.life = { animals: true, birds: false, balloons: false };
    opts.life.birds = !opts.life.birds;
    syncBirds();
    saveOptions(opts);
  });
  syncBirds();

  const sndBtn = el.querySelector('.o-snd');
  const dbgBtn = el.querySelector('.o-dbg');
  const copyBtn = el.querySelector('.o-copy');
  const syncSound = () => {
    sndBtn.classList.toggle('on', !!opts.sound);
    sndBtn.textContent = opts.sound ? '🔊 Sound & voice: on' : '🔇 Sound & voice: muted';
  };
  const syncDebug = () => {
    dbgBtn.classList.toggle('on', !!opts.debug);
    dbgBtn.textContent = opts.debug ? '🐞 Fall-debug logging: ON' : '🐞 Fall-debug logging: off';
  };
  sndBtn.addEventListener('click', () => {
    opts.sound = !opts.sound;
    syncSound();
    saveOptions(opts);
    if (hooks.onSound) hooks.onSound(opts.sound);
  });
  dbgBtn.addEventListener('click', () => {
    opts.debug = !opts.debug;
    syncDebug();
    saveOptions(opts);
    if (hooks.onDebug) hooks.onDebug(opts.debug);
  });
  copyBtn.addEventListener('click', () => {
    const msg = window.DBG ? window.DBG.dump() : 'no logger';
    copyBtn.textContent = '✅ copied!';
    setTimeout(() => { copyBtn.textContent = '📋 Copy debug log'; }, 2000);
    if (console && console.log) console.log(`[dbg] ${msg}`);
  });
  syncSound();
  syncDebug();

  const stepEl = el.querySelector('.o-pad-step');
  const padGo = el.querySelector('.o-pad-go');
  let padDraft = loadPadMap();
  let padStep = 0;

  const showPad = (text) => { stepEl.textContent = text; };
  const showSaved = (map) => {
    showPad(padSummary(map));
  };
  showSaved(padDraft);

  function fitCard() {
    const card = el.querySelector('.o-card');
    card.style.transform = 'translate(-50%, -50%)';
    if (!card.offsetHeight || !card.offsetWidth) return;
    const availH = window.innerHeight - 12;
    const availW = window.innerWidth - 12;
    const s = Math.min(1, availH / card.offsetHeight, availW / card.offsetWidth);
    card.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  function beginPadMap() {
    padDraft = loadPadMap();
    padStep = 0;
    api.mapping = true;
    padGo.textContent = 'Mapping…';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    askPad();
    requestAnimationFrame(fitCard);
  }

  function askPad() {
    const action = PAD_ACTIONS[padStep];
    showPad(`Press a button for: ${action.label} (${padStep + 1} of ${PAD_ACTIONS.length}). Sticks stay on move and look.`);
  }

  function finishPad(map) {
    api.mapping = false;
    padDraft = map;
    padGo.textContent = 'Map controller';
    showSaved(map);
    if (hooks.onPad) hooks.onPad(map);
    requestAnimationFrame(fitCard);
  }

  padGo.addEventListener('click', (e) => {
    e.preventDefault();
    beginPadMap();
  });
  el.querySelector('.o-pad-std').addEventListener('click', (e) => {
    e.preventDefault();
    finishPad(savePadMap(DEFAULT_PAD));
  });

  const api = {
    el,
    isOpen: false,
    mapping: false,
    open() {
      api.refresh();
      el.classList.add('open');
      api.isOpen = true;
      if (hooks.onOpen) hooks.onOpen();
      requestAnimationFrame(fitCard);
    },
    close() {
      api.mapping = false;
      padGo.textContent = 'Map controller';
      showSaved(loadPadMap());
      el.classList.remove('open');
      api.isOpen = false;
      saveOptions(opts);
    },
    toggle() { if (api.isOpen) api.close(); else api.open(); },
    refresh() { syncSegs(); syncRes(); for (const s of syncers) s(); syncBirds(); syncSound(); syncDebug(); if (!api.mapping) showSaved(loadPadMap()); },
    syncDebug() { syncDebug(); },
    fit: fitCard,
    captureButton(button) {
      if (!api.mapping) return;
      const action = PAD_ACTIONS[padStep];
      if (!action) return;
      const previous = padDraft[action.id];
      for (const other of PAD_ACTIONS) {
        if (other.id !== action.id && padDraft[other.id] === button) padDraft[other.id] = previous;
      }
      padDraft[action.id] = button;
      padStep += 1;
      if (padStep >= PAD_ACTIONS.length) finishPad(savePadMap(padDraft));
      else askPad();
    }
  };

  el.querySelector('.o-x').addEventListener('click', () => api.close());
  window.addEventListener('resize', () => { if (api.isOpen) fitCard(); });
  el.querySelector('.o-regen').addEventListener('click', () => {
    saveOptions(opts);
    if (hooks.onRegen) hooks.onRegen();
    api.close();
  });
  el.addEventListener('pointerdown', (e) => { if (e.target === el) api.close(); });

  return api;
}
