// Core: state, time and the heavens, world, rendering, input, UI.
window.L = window.L || {};
(function () {
  const TS = 48, VW = 15, VH = 11;
  const G = L.G = {};
  let S = null;              // the game state (saved)
  let sheet = null, sheetOK = false;
  const tintCache = {};
  let effects = [];
  let mode = null;           // null | {type:'dir', cb} | {type:'modal'} | {type:'talk'}
  let autoPath = [];
  let hover = null;

  // ------------------------------------------------------------ state
  G.newState = function () {
    S = {
      v: 1, layer: 'dee', map: 'mortlake', x: 6, y: 5,
      min: 20 * 60, // day 0 (a Sunday), 20:00
      stats: { flesh: 80, remembrance: 5, suspicion: 0, eloquence: 5, purity: 0 },
      inv: [], worn: { neck: null, hand: null, feet: null },
      doctrines: {}, chars: {}, orders: {}, fellowship: {}, passed: {}, flags: {},
      world: {}, uid: 1, hermitPos: null, highest: 'moon', logs: [],
    };
    G.S = S;
    return S;
  };
  G.load = function (st) { S = G.S = st; };

  // ------------------------------------------------------------ time and the heavens
  G.day = () => Math.floor(S.min / 1440);
  G.hour = () => Math.floor(S.min / 60) % 24;
  G.night = () => { const h = G.hour(); return h >= 19 || h < 6; };
  G.pday = () => Math.floor((S.min - 360) / 1440);            // planetary day starts at sunrise, 06:00
  G.weekday = () => ((G.pday() % 7) + 7) % 7;
  G.dayRuler = () => L.DAY_RULER[G.weekday()];
  G.hourRuler = function (atMin) {
    const m = atMin === undefined ? S.min : atMin;
    const pd = Math.floor((m - 360) / 1440), wd = ((pd % 7) + 7) % 7;
    const idx = ((Math.floor(m / 60) - 6) % 24 + 24) % 24;
    return L.CHALDEAN[(L.CHALDEAN.indexOf(L.DAY_RULER[wd]) + idx) % 7];
  };
  G.moonPhase = () => (G.day() % 28);
  G.moonIcon = () => ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][Math.floor(G.moonPhase() / 3.5) % 8];
  G.retro = function (p) {
    const P = L.PLANETS[p];
    if (!P || !P.retro) return (p === 'moon' || p === 'sun') && G.moonPhase() < 2; // dark of the moon (RECON)
    const [per, len, off] = P.retro;
    return ((G.day() + off) % per) < len;
  };
  G.clock = function () {
    const h = G.hour(), m = S.min % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  };

  // pass time; ticks world once per 5 minutes
  G.pass = function (minutes, quiet) {
    const steps = Math.max(1, Math.round(minutes / 5));
    const beforeHour = G.hourRuler();
    for (let i = 0; i < steps; i++) {
      S.min += 5;
      if (S.layer === 'hermit' && S.map !== 'prison' && S.min % 30 === 0) G.stat('flesh', -1, true);
      if (S.map === 'canterbury' && L.Story.horarium) L.Story.horarium();
      else if (L.Spirits) L.Spirits.tick();
      if (S.stats.flesh <= 0 && S.layer === 'hermit') { G.faint(); break; }
    }
    const after = G.hourRuler();
    if (!quiet && after !== beforeHour && S.layer === 'hermit') {
      const P = L.PLANETS[after];
      G.log(`The hour of ${P.name} ${P.g} begins.`, 'sky');
    }
  };
  G.faint = function () {
    G.log('Your body fails you. You wake hours later, the flesh reasserting its kingdom.', 'bad');
    S.stats.flesh = 25; G.stat('remembrance', -2);
    S.min += 180;
  };

  // ------------------------------------------------------------ stats, flags
  G.stat = function (k, d, quiet) {
    if (d === undefined) return S.stats[k] || 0;
    const before = S.stats[k] || 0;
    const lo = k === 'suspicion' ? (S.stats.floor || 0) : 0;
    S.stats[k] = Math.max(lo, Math.min(100, before + d));
    if (k === 'remembrance' && d > 0 && !quiet && S.stats[k] !== before) G.log(`(Remembrance +${S.stats[k] - before})`, 'good');
    return S.stats[k];
  };
  // William's reading. floorUp ratchets a floor that prayer cannot lower (after Crisis: 1914's Tension floor).
  G.suspect = function (d, why, floorUp) {
    if (S.layer !== 'hermit') return; // St Augustine's was exempt from episcopal control (Page)
    if (d > 0 && G.doctrine('calcidius')) d = Math.ceil(d * 0.75);
    const before = S.stats.suspicion;
    if (floorUp) {
      S.stats.floor = Math.max(0, Math.min(100, (S.stats.floor || 0) + floorUp));
      if (floorUp > 0) G.log(`William will not forget this. (The floor of his suspicion rises to ${S.stats.floor}; prayer cannot go beneath it.)`, 'william');
      else G.log(`The floor of William's suspicion falls to ${S.stats.floor}.`, 'good');
    }
    G.stat('suspicion', d);
    if (d > 0 && S.map === 'desert') {
      if (!S.flags.suspectAt) G.log('Far off, at his lectern, a black-robed figure lifts his head.', 'william');
      S.flags.suspectAt = [S.x, S.y];
    }
    if (d > 0) G.log(`William would write: ${why}. (Suspicion +${d})`, 'william');
    if (before < 50 && S.stats.suspicion >= 50) G.log('Your spirits begin to look, to you, the way they would look to Paris: horned and hungry.', 'william');
    if (S.stats.suspicion >= 100 && S.layer === 'hermit' && S.map !== 'prison') setTimeout(() => L.Story.arrest(), 50);
  };
  G.flag = k => !!S.flags[k];
  G.set = (k, v) => { S.flags[k] = v === undefined ? true : v; };
  // true / 'copied' = permanent; 'borrowed' = only while the monk still holds the book.
  G.doctrine = k => {
    const v = S.doctrines[k];
    if (v !== 'borrowed') return v || false;
    const monkInv = S.layer === 'monk' ? S.inv : ((S.invs && S.invs.monk) || []);
    return monkInv.some(i => i.id === 'book_' + k) ? 'borrowed' : false;
  };

  // ------------------------------------------------------------ inventory
  G.give = function (id, n = 1, extra) {
    const def = L.ITEMS[id];
    if (!def) return;
    if (def.stack) {
      const e = S.inv.find(i => i.id === id);
      if (e) { e.n += n; return e; }
    }
    const e = Object.assign({ uid: S.uid++, id, n }, extra || {});
    S.inv.push(e);
    return e;
  };
  G.count = id => S.inv.filter(i => i.id === id).reduce((a, i) => a + i.n, 0);
  G.has = (id, n = 1) => G.count(id) >= n;
  G.take = function (id, n = 1) {
    for (const e of S.inv.filter(i => i.id === id)) {
      const k = Math.min(n, e.n); e.n -= k; n -= k;
      if (e.n <= 0) G.removeEntry(e);
      if (n <= 0) break;
    }
  };
  G.removeEntry = function (e) {
    S.inv = S.inv.filter(i => i !== e);
    for (const s in S.worn) if (S.worn[s] === e.uid) S.worn[s] = null;
  };
  G.wornItem = slot => { const u = S.worn[slot]; return u ? S.inv.find(i => i.uid === u) : null; };
  G.wearing = id => Object.values(S.worn).some(u => u && S.inv.find(i => i.uid === u && i.id === id));
  G.itemName = e => { const d = L.ITEMS[e.id]; let s = d.name; if (d.stack && e.n > 1) s = `${e.n} ${s}`; if (e.firm) s += ' ℞'; else if (e.ch !== undefined && e.ch !== Infinity) s += ` (${e.ch})`; return s; };
  G.buy = function (id, price) {
    if (!G.has('dinar', price)) return false;
    G.take('dinar', price); G.give(id, 1); G.sfx('coin'); return true;
  };

  // ------------------------------------------------------------ world
  G.map = () => L.MAPS[S.map];
  G.ents = function (mapId) {
    mapId = mapId || S.map;
    if (!S.world[mapId]) {
      const M = L.MAPS[mapId];
      S.world[mapId] = (M.ents || []).map(e => Object.assign({ eid: S.uid++, hx: e.x, hy: e.y }, JSON.parse(JSON.stringify(e))));
    }
    return S.world[mapId];
  };
  G.addEnt = function (e, mapId) { e.eid = S.uid++; G.ents(mapId).push(e); return e; };
  G.removeEnt = function (e, mapId) { const list = G.ents(mapId); const i = list.indexOf(e); if (i >= 0) list.splice(i, 1); };
  G.entAt = function (x, y, filter) {
    return G.ents().find(e => e.x === x && e.y === y && G.visible(e) && (!filter || filter(e)));
  };
  G.visible = function (e) {
    if (e.hidden === 'light') return G.wearing('apollo_mirror');
    if (e.hidden) return false;
    return true;
  };
  G.terrainAt = function (x, y, mapId) {
    const M = L.MAPS[mapId || S.map];
    if (y < 0 || y >= M.rows.length || x < 0 || x >= M.rows[0].length) return null;
    let ch = M.rows[y][x];
    const over = S.world['_t_' + (mapId || S.map)];
    if (over && over[x + ',' + y]) ch = over[x + ',' + y];
    return { ch, T: L.TERRAIN[ch] || L.TERRAIN['.'] };
  };
  G.setTerrain = function (x, y, ch) { const k = '_t_' + S.map; S.world[k] = S.world[k] || {}; S.world[k][x + ',' + y] = ch; };
  G.passable = function (x, y, forPlayer) {
    const t = G.terrainAt(x, y);
    if (!t) return false;
    let p = t.T.pass;
    if (p === 'shoes') p = forPlayer ? G.wearing('lunar_shoes') : false;
    if (!p) return false;
    const e = G.ents().find(e => e.x === x && e.y === y && e.kind !== 'item' && G.visible(e));
    return !e;
  };

  G.goto = function (mapId, x, y) {
    S.map = mapId; S.x = x; S.y = y;
    const M = L.MAPS[mapId];
    if (M.layer && M.layer !== S.layer) {
      // each reader carries their own things
      S.invs = S.invs || {};
      S.invs[S.layer] = S.inv;
      S.inv = S.invs[M.layer] || [];
      S.layer = M.layer;
    }
    autoPath = [];
    G.log(`— ${M.name} —`, 'place');
    if (M.onEnter) M.onEnter();
    if (L.Story && L.Story.onEnter) L.Story.onEnter(mapId);
    G.redraw();
  };

  // ------------------------------------------------------------ movement
  const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], Numpad8: [0, -1], Numpad2: [0, 1], Numpad4: [-1, 0], Numpad6: [1, 0], Numpad7: [-1, -1], Numpad9: [1, -1], Numpad1: [-1, 1], Numpad3: [1, 1] };
  G.step = function (dx, dy) {
    const nx = S.x + dx, ny = S.y + dy;
    const M = G.map();
    const exitKey = nx + ',' + ny;
    const t = G.terrainAt(nx, ny);
    if (!t) { G.log('The world ends there.'); return false; }
    const blocker = G.ents().find(e => e.x === nx && e.y === ny && e.kind !== 'item' && G.visible(e));
    if (blocker) {
      if (blocker.kind === 'npc' || blocker.kind === 'spirit') { G.talk(blocker); return false; }
      G.look(nx, ny); return false;
    }
    if (t.T.pass === 'shoes' && !G.wearing('lunar_shoes')) {
      G.log('The dune sea swallows your feet. You need a lighter step.'); G.sfx('bump'); return false;
    }
    if (!t.T.pass) { G.log(`Blocked: ${t.T.n}.`); G.sfx('bump'); return false; }
    if (M.exits && M.exits[exitKey]) {
      const ex = M.exits[exitKey];
      if (ex.need && !G.flag(ex.need)) { G.log(L.Story.exitRefusal(ex.need)); return false; }
      G.goto(ex.map, ex.x, ex.y); G.pass(30); return true;
    }
    S.x = nx; S.y = ny;
    let cost = 5 * (t.T.cost || 1);
    if (G.wearing('lunar_shoes')) cost = Math.max(2, Math.floor(cost / 2));
    G.pass(cost, false);
    const here = G.ents().filter(e => e.x === S.x && e.y === S.y && e.kind === 'item');
    if (here.length) G.log(`You see ${here.map(e => G.entName(e)).join(', ')} here.`);
    if (t.T.light) G.log('The image of true light. (E to ascend)', 'sky');
    G.sfx('step');
    return true;
  };

  // ------------------------------------------------------------ naming
  G.entName = function (e) {
    if (e.kind === 'item') { const d = L.ITEMS[e.item]; return e.n > 1 && d.stack ? `${e.n} ${d.name}` : d.name; }
    if (e.kind === 'spirit') return L.Spirits.name(e);
    return e.name;
  };

  G.look = function (x, y) {
    if (x === S.x && y === S.y) { L.Magic.lookSelf(); return; }
    const e = G.entAt(x, y);
    const t = G.terrainAt(x, y);
    if (!t) return;
    if (e) {
      if (e.kind === 'spirit') { if (!L.Spirits.isKnown(e)) { L.Spirits.discern(e); return; } G.log(L.Spirits.describe(e)); return; }
      if (e.kind === 'item') { const d = L.ITEMS[e.item]; G.log(`${G.entName(e)}. ${d.desc || ''}`); return; }
      if (e.element) { L.Story.shrine(e); return; }
      if (e.doctrine) { G.log(`${e.name}. ${S.doctrines[e.doctrine] ? '(Read.)' : '(R to read.)'}`); return; }
      G.log(e.look || `${e.name}.`);
      return;
    }
    const T = t.T;
    let s = `You see ${T.n}.`;
    if (T.notice) s = 'A notice, copied fair: Étienne Tempier, bishop of Paris, 7 March 1277, condemns books, rolls and booklets of necromancy, experiments of sorcery, and invocations of demons.';
    if (T.peony) s += G.hourRuler() === 'sun' ? ' It is the hour of the Sun. (G to take one.)' : ' Peonies. (§29: take them in the hour of the Sun.)';
    if (T.altar) s += ' (P to pray here.)';
    if (T.light) s += ' The image of true light. (E to ascend.)';
    if (T.seat) s = 'An empty seat. Your companions have kept it for you (§6).';
    G.log(s);
  };

  // ------------------------------------------------------------ talk
  G.talk = function (e) {
    if (e.kind === 'spirit') return L.Spirits.talk(e);
    const D = L.NPCS[e.id];
    if (!D) { G.log(`${e.name} says nothing.`); return; }
    if (e.charmed) { G.openTalk(e, { greet: `${e.name} gazes at you with a love that is not theirs. The charm of Venus speaks through them.`, BYE: 'They follow you anyway.' }); return; }
    if (e.possessed) { G.openTalk(e, { greet: `${e.name} speaks, but the voice is a ${L.PLANETS[e.possessed].name} spirit’s, enveloped in a body allotted to another (§38). An exorcism would free them.`, BYE: '...' }); return; }
    G.openTalk(e, D);
  };

  // ------------------------------------------------------------ logging and sound
  G.log = function (msg, cls) {
    S && S.logs.push([msg, cls || '']);
    if (S && S.logs.length > 200) S.logs.shift();
    const el = document.getElementById('log');
    const d = document.createElement('div');
    d.className = 'ln ' + (cls || '');
    d.textContent = msg;
    el.appendChild(d);
    while (el.children.length > 120) el.removeChild(el.firstChild);
    el.scrollTop = el.scrollHeight;
  };
  let actx = null;
  G.sfx = function (kind) {
    try {
      if (G.muted) return;
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const tones = { step: [[110, 0.02, 'square', 0.02]], bump: [[70, 0.06, 'square', 0.05]], coin: [[880, 0.05, 'square', 0.05], [1320, 0.08, 'square', 0.05]],
        magic: [[392, 0.1, 'triangle', 0.08], [523, 0.1, 'triangle', 0.08], [784, 0.25, 'triangle', 0.08]],
        fail: [[330, 0.12, 'sawtooth', 0.05], [220, 0.25, 'sawtooth', 0.05]], talk: [[600, 0.03, 'square', 0.03]],
        rise: [[523, 0.1, 'sine', 0.08], [659, 0.1, 'sine', 0.08], [880, 0.1, 'sine', 0.08], [1046, 0.3, 'sine', 0.08]],
        hit: [[90, 0.1, 'sawtooth', 0.08]] }[kind] || [];
      let t0 = actx.currentTime;
      for (const [f, d, type, vol] of tones) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.value = f; g.gain.value = vol;
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
        o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + d); t0 += d * 0.8;
      }
    } catch (e) { /* audio is optional */ }
  };

  // ------------------------------------------------------------ rendering
  const canvas = () => document.getElementById('view');
  G.initRender = function () {
    sheet = new Image();
    sheet.onload = () => { sheetOK = true; };
    sheet.onerror = () => { sheetOK = false; };
    sheet.src = 'assets/kenney-1bit.png';
    requestAnimationFrame(frame);
  };
  function sprite(ctx, idx, x, y, tint) {
    if (!sheetOK || idx === null || idx === undefined) return false;
    const sx = (idx % 49) * 16, sy = Math.floor(idx / 49) * 16;
    if (tint) {
      const key = idx + tint;
      let c = tintCache[key];
      if (!c) {
        c = document.createElement('canvas'); c.width = c.height = 16;
        const cx = c.getContext('2d');
        cx.drawImage(sheet, sx, sy, 16, 16, 0, 0, 16, 16);
        cx.globalCompositeOperation = 'source-in'; cx.fillStyle = tint; cx.fillRect(0, 0, 16, 16);
        tintCache[key] = c;
      }
      ctx.drawImage(c, 0, 0, 16, 16, x, y, TS, TS);
    } else ctx.drawImage(sheet, sx, sy, 16, 16, x, y, TS, TS);
    return true;
  }
  const GLYPH_FONT = '"Noto Sans Symbols 2","Noto Sans Symbols","Segoe UI Symbol","Segoe UI Emoji","DejaVu Sans",serif';
  function glyph(ctx, g, x, y, col, size, glow) {
    ctx.save();
    ctx.font = `${size || 26}px ${GLYPH_FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (glow) { ctx.shadowColor = col; ctx.shadowBlur = glow; }
    ctx.fillStyle = col || '#fff';
    ctx.fillText(g, x, y);
    ctx.restore();
  }
  G.effect = function (x, y, g, col, dy = -1, dur = 1200) { effects.push({ x, y, g, col, dy, dur, t0: performance.now() }); };

  function hash(x, y) { let h = x * 374761393 + y * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!S) return;
    const cv = canvas(); if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const M = G.map();
    const ox = S.x - Math.floor(VW / 2), oy = S.y - Math.floor(VH / 2);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
    const sphere = M.sphere;
    for (let vy = 0; vy < VH; vy++) for (let vx = 0; vx < VW; vx++) {
      const wx = ox + vx, wy = oy + vy, px = vx * TS, py = vy * TS;
      const t = G.terrainAt(wx, wy);
      if (!t) continue;
      const T = t.T;
      let bg = T.bg;
      if (sphere && t.ch === 'r') bg = M.floor || bg;
      ctx.fillStyle = bg; ctx.fillRect(px, py, TS, TS);
      if (T.stars || (sphere && t.ch === 'r')) {
        const n = T.stars ? 3 : 1;
        for (let k = 0; k < n; k++) {
          const h = hash(wx * 7 + k, wy * 13 + k);
          if (h < (T.stars ? 0.5 : 0.25)) {
            const tw = 0.5 + 0.5 * Math.sin(now / 500 + h * 50);
            ctx.fillStyle = `rgba(255,255,240,${0.25 + 0.6 * tw})`;
            ctx.fillRect(px + Math.floor(hash(wx, wy + k) * 44), py + Math.floor(hash(wy, wx + k) * 44), 2, 2);
          }
        }
      }
      if (T.tile !== undefined) {
        let tile = T.tile;
        if (T.palm && G.flag('barren') && S.map === 'desert') tile = L.t(6, 2);
        sprite(ctx, tile, px, py);
      }
      if (T.glyph && !(t.ch === 'U' && M.hideUp && !G.wearing('apollo_mirror'))) glyph(ctx, T.glyph, px + TS / 2, py + TS / 2, T.gcol, 28, T.light ? 12 + 6 * Math.sin(now / 300) : 0);
      if (t.ch === 'U' && M.hideUp && !G.wearing('apollo_mirror')) { ctx.fillStyle = M.floor; ctx.fillRect(px, py, TS, TS); }
    }
    // shelfmark labels (the presses)
    for (const lb of (M.labels || [])) {
      const vx = lb.x - ox, vy = lb.y - oy;
      if (vx < 0 || vy < 0 || vx >= VW || vy >= VH) continue;
      ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(vx * TS + 2, vy * TS + 2, 22, 14);
      ctx.fillStyle = '#e8c860'; ctx.font = '14px VT323, monospace'; ctx.textAlign = 'left';
      ctx.fillText(lb.t, vx * TS + 4, vy * TS + 13);
    }
    // entities
    for (const e of G.ents()) {
      if (!G.visible(e)) continue;
      const vx = e.x - ox, vy = e.y - oy;
      if (vx < 0 || vy < 0 || vx >= VW || vy >= VH) continue;
      const px = vx * TS, py = vy * TS;
      if (e.kind === 'item') {
        const d = L.ITEMS[e.item];
        sprite(ctx, d.tile, px, py);
        if (d.g) glyph(ctx, d.g, px + TS - 10, py + 10, '#fff', 14);
      } else if (e.kind === 'spirit') {
        L.Spirits.draw(ctx, e, px, py, now, sprite, glyph, TS);
      } else {
        if (e.tile !== null && e.tile !== undefined) sprite(ctx, e.tile, px, py, e.charmed ? '#f0a0c0' : (e.possessed ? L.PLANETS[e.possessed].color : null));
        if (e.g) glyph(ctx, e.g, px + TS / 2, py + TS / 2, e.gcol || '#fff', 30, 8);
        if (e.charmed) glyph(ctx, '♥', px + TS - 8, py + 8, '#f0a0c0', 14);
      }
    }
    // the player
    const pvx = S.x - ox, pvy = S.y - oy;
    const ptile = { dee: L.t(26, 9), monk: L.t(24, 1), hermit: L.t(26, 2) }[S.layer];
    sprite(ctx, ptile, pvx * TS, pvy * TS, S.layer === 'hermit' ? '#f4ecd0' : null);
    // night
    if (!M.indoor && !sphere && S.layer === 'hermit' && G.night()) {
      for (let vy = 0; vy < VH; vy++) for (let vx = 0; vx < VW; vx++) {
        const d = Math.hypot(vx - pvx, vy - pvy);
        const a = Math.min(0.72, Math.max(0, (d - 2.5) * 0.14));
        ctx.fillStyle = `rgba(4,6,24,${a})`; ctx.fillRect(vx * TS, vy * TS, TS, TS);
      }
    }
    // hover
    if (hover && !mode) {
      ctx.strokeStyle = 'rgba(255,230,150,0.8)'; ctx.lineWidth = 2;
      ctx.strokeRect((hover.x - ox) * TS + 1, (hover.y - oy) * TS + 1, TS - 2, TS - 2);
    }
    // effects
    effects = effects.filter(f => now - f.t0 < f.dur);
    for (const f of effects) {
      const k = (now - f.t0) / f.dur;
      ctx.globalAlpha = 1 - k;
      glyph(ctx, f.g, (f.x - ox) * TS + TS / 2, (f.y - oy) * TS + TS / 2 + f.dy * k * TS * 2.5, f.col, 30, 14);
      ctx.globalAlpha = 1;
    }
    // lacuna frame for the spheres
    if (sphere) drawVellum(ctx, cv, M, now);
    if (!sheetOK && S) { ctx.fillStyle = '#ff8'; ctx.font = '14px monospace'; ctx.fillText('(tiles not loaded: glyph mode)', 8, 16); }
  }
  function drawVellum(ctx, cv, M, now) {
    const torn = M.provenance !== 'MS';
    ctx.save();
    if (torn) {
      ctx.fillStyle = '#e9dcb8';
      const W = cv.width, H = cv.height;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.moveTo(14, 14);
      for (let x = 14; x < W - 14; x += 9) ctx.lineTo(x, 14 + hash(x, 1) * 12);
      for (let y = 14; y < H - 14; y += 9) ctx.lineTo(W - 14 - hash(2, y) * 12, y);
      for (let x = W - 14; x > 14; x -= 9) ctx.lineTo(x, H - 14 - hash(x, 3) * 12);
      for (let y = H - 14; y > 14; y -= 9) ctx.lineTo(14 + hash(4, y) * 12, y);
      ctx.closePath();
      ctx.fill('evenodd');
    }
    ctx.font = `18px VT323, ${GLYPH_FONT}`; ctx.textAlign = 'center';
    const bw = Math.min(cv.width - 8, ctx.measureText(M.banner).width + 24);
    ctx.fillStyle = torn ? 'rgba(60,40,20,0.9)' : 'rgba(0,0,0,0.6)';
    ctx.fillRect(cv.width / 2 - bw / 2, 4, bw, 22);
    ctx.fillStyle = torn ? '#f3e2b8' : '#e8e0ff';
    ctx.fillText(M.banner, cv.width / 2, 20);
    ctx.restore();
  }

  // ------------------------------------------------------------ panel
  G.redraw = function () {
    if (!S) return;
    const M = G.map();
    const who = { dee: 'John Dee', monk: 'Thomas Sprot, monk', hermit: 'The Sevillan' }[S.layer];
    document.getElementById('who').textContent = who;
    document.getElementById('where').textContent = M.name;
    // sky
    const hr = G.hourRuler(), dr = G.dayRuler();
    const rets = L.CHALDEAN.filter(p => G.retro(p) && p !== 'sun' && p !== 'moon').map(p => L.PLANETS[p].g + '℞').join(' ');
    const sky = document.getElementById('sky');
    sky.innerHTML = '';
    const mk = (html, title) => { const s = document.createElement('span'); s.innerHTML = html; s.title = title; sky.appendChild(s); };
    mk(`<b style="color:${L.PLANETS[dr].color}">${L.PLANETS[dr].g}</b> ${L.WEEKDAY[G.weekday()]}`, `Day of ${L.PLANETS[dr].name}`);
    mk(`hour of <b style="color:${L.PLANETS[hr].color}">${L.PLANETS[hr].g}</b>`, `Planetary hour of ${L.PLANETS[hr].name}. Helping symmetry for its images.`);
    mk(`${G.moonIcon()} ${G.clock()}${G.night() ? ' ☾' : ' ☼'}`, 'Moon phase and time');
    if (S.layer === 'monk' && L.Story.hourName) mk(`<span class="office">${L.Story.hourName()}</span>`, 'The horarium: where the brothers are now');
    if (rets) mk(`<span class="retro">${rets}</span>`, 'Retrograde: these rulers’ spirits fall readily and bind firmly (§36)');
    // each reader's verbs (after the COIN games' asymmetric action names)
    const VERBS = {
      hermit: {}, 
      monk: { i: '—', c: '—', v: '—', x: '—', m: 'Copy', f: 'Fast' },
      dee: { i: '—', c: '—', v: '—', x: '—', m: '—', f: '—', p: 'Pray', e: '—' },
    }[S.layer] || {};
    document.querySelectorAll('#cmds button').forEach(b => {
      if (!b.dataset.orig) b.dataset.orig = b.innerHTML;
      const v = VERBS[b.dataset.k];
      b.innerHTML = v ? (v === '—' ? `<s>${b.dataset.k.toUpperCase()}</s>` : `${b.dataset.k.toUpperCase()}<span>${v.slice(1)}</span>`) : b.dataset.orig;
      b.classList.toggle('off', v === '—');
    });
    // stats
    const st = document.getElementById('stats');
    const bar = (label, v, col, title, floor) => `<div class="stat" title="${title}"><span>${label}</span><div class="bar"><i style="width:${v}%;background:${col}"></i>${floor ? `<b class="floor" style="width:${floor}%"></b>` : ''}</div><em>${v}</em></div>`;
    let h = '';
    if (S.layer === 'hermit') h += bar('Flesh', S.stats.flesh, '#c8643c', 'The kingdom of the flesh. Eat or faint.');
    h += bar('Remembrance', S.stats.remembrance, '#e8d070', 'How much of your blessedness the soul recalls. Needed to rise.');
    if (S.layer === 'monk') h += bar('Prior', S.stats.prior || 0, '#6a5a9a', 'The prior’s eye on you. The abbey is exempt from Paris, not from him. At 100 you are confined.');
    h += bar('William', S.stats.suspicion, '#8a2a3a', 'Suspicion: how the bishop of Paris would read you. The dark part is a floor that prayer cannot lower. At 100 you are taken.', S.stats.floor || 0);
    h += bar('Eloquence', Math.min(100, G.eloquence()), '#6ac0a0', 'Mercury’s gift.');
    const yrs = Math.min(30, Math.round(Object.keys(S.passed).length * 3.75));
    h += `<div class="small">Years in the desert: <b>${S.layer === 'hermit' || S.flags.inBook ? yrs : '—'}</b> of 30 · Dinars: <b>${G.count('dinar')}</b></div>`;
    h += `<div class="small">Orders known: <b>${Object.keys(S.orders).length}</b>/12 · Doctrines: ${Object.keys(S.doctrines).filter(d => G.doctrine(d)).map(d => `<span title="${L.DOCTRINES[d].name}${S.doctrines[d] === 'borrowed' ? ' (on loan)' : ''}" class="${S.doctrines[d] === 'borrowed' ? 'loan' : ''}">${L.DOCTRINES[d].g}</span>`).join(' ') || '—'}</div>`;
    st.innerHTML = h;
    // worn
    const wn = document.getElementById('worn');
    wn.innerHTML = ['neck', 'hand', 'feet'].map(s => { const e = G.wornItem(s); return `<div><span>${s}</span> ${e ? `<b>${L.ITEMS[e.id].g || ''} ${L.ITEMS[e.id].name}</b>` : '<i>—</i>'}</div>`; }).join('');
    // inventory
    const inv = document.getElementById('inv');
    inv.innerHTML = '';
    S.inv.forEach((e, i) => {
      if (e.id === 'dinar') return;
      const d = L.ITEMS[e.id];
      const row = document.createElement('div');
      row.className = 'it' + (Object.values(S.worn).includes(e.uid) ? ' worn' : '') + (d.vivid ? ' vivid' : '') + (d.image ? ' image' : '');
      row.innerHTML = `<span class="g" style="color:${d.vivid ? L.PLANETS[d.vivid].color : '#ccc'}">${d.g || '·'}</span> ${G.itemName(e)}`;
      row.title = d.desc || d.name;
      row.onclick = ev => { ev.stopPropagation(); L.Magic.itemMenu(e); };
      inv.appendChild(row);
    });
    if (!inv.children.length) inv.innerHTML = '<i class="small">nothing</i>';
  };
  G.eloquence = () => S.stats.eloquence + (S.doctrines.martianus ? 15 : 0) + (G.wearing('mercury_tablet') ? 25 : 0);

  // ------------------------------------------------------------ modals
  const modalEl = () => document.getElementById('modal');
  G.modalOpen = () => !!mode && mode.type !== 'dir';
  G.modal = function (opts) {
    // opts: {title, html, options:[{label, key?, fn}], input:{placeholder, onSubmit}, onClose, wide}
    const m = modalEl();
    m.className = 'modal show' + (opts.wide ? ' wide' : '') + (opts.cls ? ' ' + opts.cls : '');
    let h = `<div class="mbox">`;
    if (opts.title) h += `<h2>${opts.title}</h2>`;
    h += `<div class="mbody">${opts.html || ''}</div>`;
    if (opts.options) {
      h += '<div class="mopts">';
      opts.options.forEach((o, i) => { o.key = o.key || 'abcdefghijklmnopqrstuvwxyz'[i]; h += `<button data-i="${i}"><kbd>${o.key}</kbd> ${o.label}</button>`; });
      h += '</div>';
    }
    if (opts.input) h += `<form class="minput"><input autocomplete="off" placeholder="${opts.input.placeholder || ''}"><button>⏎</button></form>`;
    h += `<div class="mfoot">${opts.options ? 'letter or click' : ''}${opts.input ? ' · type a word, Enter' : ''} · Esc to close</div></div>`;
    m.innerHTML = h;
    mode = { type: 'modal', opts };
    m.querySelectorAll('.mopts button').forEach(b => b.onclick = () => G.pick(+b.dataset.i));
    const f = m.querySelector('form');
    if (f) {
      const inp = f.querySelector('input');
      f.onsubmit = ev => { ev.preventDefault(); const v = inp.value.trim(); inp.value = ''; opts.input.onSubmit(v); };
      setTimeout(() => inp.focus(), 20);
    }
    m.querySelectorAll('[data-kw]').forEach(a => a.onclick = () => opts.input && opts.input.onSubmit(a.dataset.kw));
  };
  G.pick = function (i) {
    const o = mode && mode.opts && mode.opts.options && mode.opts.options[i];
    if (!o) return;
    G.closeModal(true);
    o.fn && o.fn();
    G.redraw();
  };
  G.closeModal = function (silent) {
    const m = modalEl(); m.className = 'modal'; m.innerHTML = '';
    const o = mode && mode.opts;
    mode = null;
    if (!silent && o && o.onClose) o.onClose();
    document.getElementById('view').focus();
  };
  G.story = function (pages, then, title) {
    let i = 0;
    const show = () => G.modal({
      title: title || '', wide: true, cls: 'story',
      html: pages[i],
      options: [{ label: i < pages.length - 1 ? 'continue' : 'begin', key: 'enter', fn: () => { i++; if (i < pages.length) show(); else if (then) then(); } }],
      onClose: () => { if (then) then(); },
    });
    show();
  };
  G.choose = function (title, items, fn, html) {
    if (!items.length) { G.log('Nothing to choose.'); return; }
    G.modal({ title, html, options: items.map(it => ({ label: it.label, fn: () => fn(it.value) })) });
  };

  // conversation window
  G.openTalk = function (e, D, portraitHtml) {
    const lines = [];
    const asked = new Set();   // topics covered stay visible but dimmed (after Galatea's remembered topics)
    const keys = Object.keys(D).filter(k => k !== 'greet' && k === k.toUpperCase());
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const hl = s => esc(s).replace(/[A-ZĀ-Ž][A-ZĀ-Ž'-]{1,}/g, w => keys.includes(w) ? `<a data-kw="${w}">${w}</a>` : w);
    const val = v => typeof v === 'function' ? v(G) : v;
    const render = () => {
      G.modal({
        title: `${portraitHtml || ''} ${G.entName(e)}`,
        html: `<div class="talk">${lines.map(l => `<p class="${l[1]}">${l[0]}</p>`).join('')}</div><div class="kws">${keys.filter(k => k !== 'BYE').map(k => `<a data-kw="${k}" class="${asked.has(k) ? 'asked' : ''}">${k}</a>`).join(' ')} <a data-kw="BYE">BYE</a></div>`,
        input: { placeholder: 'Your interest?', onSubmit: say },
        onClose: () => G.redraw(),
      });
      const t = document.querySelector('.talk'); if (t) t.scrollTop = t.scrollHeight;
    };
    const say = function (w) {
      w = (w || '').toUpperCase().trim();
      if (!w) return;
      if (D._answer) { const r = D._answer(w); if (r !== undefined) { lines.push(['“' + esc(w) + '”', 'you']); lines.push([hl(r), '']); render(); return; } }
      lines.push(['“' + esc(w) + '”', 'you']);
      const k = keys.find(k => k === w) || keys.find(k => w.length >= 4 && k.startsWith(w.slice(0, 4)));
      if (w === 'BYE' || w === 'FAREWELL') { lines.push([hl(val(D.BYE || 'Farewell.')), '']); render(); setTimeout(() => G.closeModal(), 700); return; }
      if (k) { asked.add(k); lines.push([hl(val(D[k])), '']); }
      else lines.push([esc(D._default ? val(D._default) : 'That means nothing to me.'), 'dim']);
      G.sfx('talk');
      G.redraw();
      render();
    };
    lines.push([hl(val(D.greet)), '']);
    render();
  };

  // shop
  G.shop = function (id) {
    setTimeout(() => {
      const list = L.SHOPS[id];
      const disc = G.wearing('saturn_amulet') ? 1 : 0;
      const open = () => G.modal({
        title: 'Buy — you have ' + G.count('dinar') + ' dinars',
        html: disc ? '<p class="small">Your saturnine amulet finds you a preferred relation: 1 dinar off everything.</p>' : '',
        options: list.map(it => { const d = L.ITEMS[it]; const p = Math.max(1, d.price - disc); return { label: `${d.g || ''} ${d.name} — ${p}`, fn: () => { if (G.buy(it, p)) G.log(`Bought ${d.name}.`); else G.log('You cannot afford it.'); G.redraw(); open(); } }; }),
      });
      open();
    }, 30);
  };

  // ------------------------------------------------------------ input
  G.askDir = function (prompt, cb, allowSelf) {
    G.log(prompt + ' — direction?', 'prompt');
    mode = { type: 'dir', cb, allowSelf };
  };
  function onKey(ev) {
    if (!S || document.getElementById('title').style.display === 'flex') return;
    const m = mode;
    if (m && m.type === 'modal') {
      if (ev.key === 'Escape') { G.closeModal(); ev.preventDefault(); return; }
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      const o = m.opts.options;
      if (o) {
        const i = o.findIndex(x => x.key === ev.key.toLowerCase() || (x.key === 'enter' && (ev.key === 'Enter' || ev.key === ' ')));
        if (i >= 0) { G.pick(i); ev.preventDefault(); }
      }
      return;
    }
    if (m && m.type === 'dir') {
      ev.preventDefault();
      if (ev.key === 'Escape') { mode = null; G.log('Never mind.'); return; }
      const d = DIRS[ev.code] || DIRS[ev.key];
      if (d) { mode = null; m.cb(S.x + d[0], S.y + d[1]); after(); return; }
      if (m.allowSelf && (ev.key === '.' || ev.key === ' ')) { mode = null; m.cb(S.x, S.y); after(); return; }
      return;
    }
    const d = DIRS[ev.code] || DIRS[ev.key];
    if (d) { ev.preventDefault(); autoPath = []; G.step(d[0], d[1]); after(); return; }
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
    if (L.Magic.command(k)) { ev.preventDefault(); after(); }
  }
  function after() { G.redraw(); }

  function tileFromEvent(ev) {
    const cv = canvas(), r = cv.getBoundingClientRect();
    const sx = (ev.clientX - r.left) * (cv.width / r.width), sy = (ev.clientY - r.top) * (cv.height / r.height);
    const vx = Math.floor(sx / TS), vy = Math.floor(sy / TS);
    return { x: S.x - Math.floor(VW / 2) + vx, y: S.y - Math.floor(VH / 2) + vy };
  }
  function onClick(ev) {
    if (!S || G.modalOpen()) return;
    const p = tileFromEvent(ev);
    if (mode && mode.type === 'dir') {
      const dx = Math.sign(p.x - S.x), dy = Math.sign(p.y - S.y);
      const m = mode; mode = null;
      if (dx === 0 && dy === 0 && !m.allowSelf) return;
      m.cb(S.x + dx, S.y + dy); after(); return;
    }
    const dist = Math.max(Math.abs(p.x - S.x), Math.abs(p.y - S.y));
    const e = G.entAt(p.x, p.y);
    if (p.x === S.x && p.y === S.y) { L.Magic.command('e', true) || G.look(S.x, S.y); after(); return; }
    if (dist === 1 && e) { L.Magic.defaultAction(e); after(); return; }
    if (dist === 1 && Math.abs(p.x - S.x) + Math.abs(p.y - S.y) === 1) { G.step(p.x - S.x, p.y - S.y); after(); return; }
    // path to it (or next to it if blocked)
    const path = G.findPath(p.x, p.y);
    if (path) { autoPath = path; walk(); } else G.log('You see no way there.');
  }
  function walk() {
    if (!autoPath.length || G.modalOpen() || mode) { autoPath = []; return; }
    const [nx, ny] = autoPath.shift();
    const logBefore = S.logs.length;
    const ok = G.step(nx - S.x, ny - S.y);
    G.redraw();
    const loud = S.logs.slice(logBefore).some(l => /bad|william|sky|place/.test(l[1]));
    if (!ok || loud) { autoPath = []; return; }
    setTimeout(walk, 95);
  }
  G.findPath = function (tx, ty) {
    const M = G.map(); const W = M.rows[0].length, H = M.rows.length;
    const target = G.entAt(tx, ty);
    const goalOk = (x, y) => (x === tx && y === ty) || (target && Math.abs(x - tx) + Math.abs(y - ty) === 1);
    const q = [[S.x, S.y]], prev = {};
    prev[S.x + ',' + S.y] = null;
    let found = null, n = 0;
    while (q.length && n++ < 6000) {
      const [x, y] = q.shift();
      if (goalOk(x, y) && !(x === S.x && y === S.y)) { found = [x, y]; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || k in prev) continue;
        if (!G.passable(nx, ny, true) && !(nx === tx && ny === ty && G.passable(nx, ny, true))) continue;
        prev[k] = [x, y]; q.push([nx, ny]);
      }
    }
    if (!found) return null;
    const path = []; let c = found;
    while (c && !(c[0] === S.x && c[1] === S.y)) { path.unshift(c); c = prev[c[0] + ',' + c[1]]; }
    return path;
  };
  function onMove(ev) {
    if (!S) return;
    const p = tileFromEvent(ev);
    hover = p;
    const tip = document.getElementById('tip');
    const e = G.entAt(p.x, p.y);
    const t = G.terrainAt(p.x, p.y);
    let s = '';
    if (p.x === S.x && p.y === S.y) s = 'you';
    else if (e) s = G.entName(e);
    else if (t) s = (t.ch === 'U' && G.map().hideUp && !G.wearing('apollo_mirror')) ? 'the sphere' : t.T.n;
    tip.textContent = s;
    tip.style.left = (ev.clientX + 14) + 'px'; tip.style.top = (ev.clientY + 14) + 'px';
    tip.style.display = s ? 'block' : 'none';
  }
  G.initInput = function () {
    window.addEventListener('keydown', onKey);
    const cv = canvas();
    cv.addEventListener('click', onClick);
    cv.addEventListener('contextmenu', ev => { ev.preventDefault(); if (!S || G.modalOpen()) return; const p = tileFromEvent(ev); G.look(p.x, p.y); G.redraw(); });
    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', () => { hover = null; document.getElementById('tip').style.display = 'none'; });
    document.querySelectorAll('#cmds button').forEach(b => b.onclick = () => { if (!G.modalOpen()) { L.Magic.command(b.dataset.k); G.redraw(); } });
  };

  // ------------------------------------------------------------ save
  G.save = function () {
    try { localStorage.setItem('liber_save', JSON.stringify(S)); G.log('The page is marked. (Saved.)', 'good'); }
    catch (e) { G.log('Could not save in this browser.', 'bad'); }
  };
  G.loadSaved = function () {
    try { const s = localStorage.getItem('liber_save'); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  };
  G.replayLog = function () { document.getElementById('log').innerHTML = ''; (S.logs || []).slice(-40).forEach(([m, c]) => { const d = document.createElement('div'); d.className = 'ln ' + c; d.textContent = m; document.getElementById('log').appendChild(d); }); };
})();
