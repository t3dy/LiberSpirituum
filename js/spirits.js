// Spirits: naming, drawing, behaviour by planet, conversation, and the spheres.
window.L = window.L || {};
(function () {
  const G = L.G, P = L.PLANETS;
  const Sp = L.Spirits = {};
  const S = () => G.S;
  const GHOST = L.t(27, 8), DEMON = L.t(26, 5);
  const LEGION_ONE = { moon: 'a rotator of the Moon', mercury: 'a turner of Mercury', venus: 'a spirit of Venus', sun: 'a spirit of Apollo', mars: 'one of the pre-elect of Mars', jupiter: 'a worshipper of Jupiter', saturn: 'a saturnine spirit' };

  // The identification game (Harris), carried by the Liber's own taxonomy: an order is known by how
  // its spirits behave (§27, §30–33, §44–45). Once one spirit of an order is discerned, all are.
  Sp.isKnown = e => e.rank !== 'legion' || e.known || !!(S().known || {})[e.planet];
  Sp.CLUES = {
    saturn: ['It hangs almost motionless over the bones, dim, as if seen through an earthy cloud. Near it nothing moves, and even your thoughts slow.', '§44'],
    jupiter: ['It moves lightly and without haste, and keeps drifting back to the same place, as a thing returns to its root. It harms nothing.', '§45'],
    mars: ['It turns toward you the way an enemy turns, or falls on another of its kind.', '§27'],
    moon: ['It moves quickly and comes toward you, as if you had called it, as if it would help anyone who asked.', '§33'],
    mercury: ['It flickers restlessly from place to place and pays you no attention at all. It seems to be listening for words.', '§32'],
    venus: ['It keeps close beside another like itself. When it nears you, your pulse answers before you do.', '§31'],
    sun: ['It stands nearly still, and it is too bright for the place it stands in: too large for so little room.', '§30'],
  };
  Sp.discern = function (e) {
    const s = S(), p = e.planet;
    let clue = Sp.CLUES[p][0];
    if (p === 'mars' && e.fighting) clue = 'It is locked in a fight with another of its kind.';
    const hourNow = Math.floor(s.min / 60);
    const tried = e.guessed === hourNow;
    G.modal({
      title: `${s.stats.suspicion >= 50 ? 'A nameless demon' : 'An unknown spirit'}`,
      html: `<p>${clue}</p><p class="small">Discern its order by what it does. (The codex, J, has a field guide under <i>discernment</i>.)${tried ? ' <b>You have already guessed wrong this hour; watch it longer.</b>' : ''}</p>`,
      options: (tried ? [] : L.CHALDEAN.map(q => ({ label: `${P[q].g} ${P[q].name}`, fn: () => Sp.guess(e, q) }))).concat([{ label: 'not yet: keep watching', fn: () => { } }]),
    });
  };
  Sp.guess = function (e, q) {
    const s = S();
    G.pass(5);
    if (q === e.planet) {
      s.known = s.known || {};
      const first = !s.known[q];
      s.known[q] = true;
      G.log(`You have discerned ${LEGION_ONE[q]}. Its order is known to you now, wherever you meet it (${Sp.CLUES[q][1]}).`, 'good');
      if (first) G.stat('remembrance', 2);
      G.effect(e.x, e.y, P[q].g, P[q].color, -0.5);
    } else {
      e.guessed = Math.floor(s.min / 60);
      G.log('It does not answer to that name. Watch what it does.', 'bad');
    }
  };
  Sp.glyph = e => e.rank === 'light' ? '✦' : (!Sp.isKnown(e) ? '?' : (P[e.planet] ? P[e.planet].g : '?'));
  Sp.name = function (e) {
    if (e.rank === 'ruler') return `the ruler of ${e.planet === 'urania' ? 'Urania' : 'the sphere of ' + P[e.planet].name}`;
    if (e.rank === 'light') return 'one living in the light';
    if (!Sp.isKnown(e)) return S().stats.suspicion >= 50 ? 'a nameless demon' : 'an unknown spirit';
    const demon = S().stats.suspicion >= 50;
    const base = demon ? `a demon of ${P[e.planet].name}` : LEGION_ONE[e.planet];
    return base + (e.attending ? ' (attending)' : '');
  };
  Sp.describe = function (e) {
    if (e.rank === 'ruler') return `${Sp.name(e)}. ${P[e.planet].gift} It is outside passibility: nothing you do can compel it.`;
    if (e.rank === 'light') return 'A figure made of light, visible only in the mirror of Apollo. Passibility: none that you can find.';
    const pass = { moon: 3, mercury: 2, venus: 3, sun: 1, mars: 3, jupiter: 2, saturn: 3 }[e.planet];
    const w = S().stats.suspicion >= 50 ? ' William would call it a demon, and tonight you almost agree.' : '';
    return `${Sp.name(e)} ${P[e.planet].g}. Passibility ${pass}/3: ${pass >= 2 ? 'it can be acted on' : 'it hardly suffers anything'}. ${e.attending ? (e.willing ? 'It attends you willingly.' : 'It attends you unwillingly and will slip away soon.') : ''}${w}`;
  };

  Sp.draw = function (ctx, e, px, py, now, sprite, glyph, TS) {
    const col = e.rank === 'light' ? '#fff6c0' : P[e.planet].color;
    const bob = Math.sin(now / 400 + e.eid) * 3;
    if (e.rank === 'ruler') {
      ctx.save(); ctx.globalAlpha = 0.35 + 0.15 * Math.sin(now / 500);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px + TS / 2, py + TS / 2, TS * 0.7, 0, 7); ctx.fill(); ctx.restore();
      glyph(ctx, Sp.glyph(e), px + TS / 2, py + TS / 2 + bob, '#fff', 40, 20);
      return;
    }
    if (e.rank === 'light') { glyph(ctx, '✦', px + TS / 2, py + TS / 2 + bob, col, 34, 18); return; }
    const demon = S().stats.suspicion >= 50;
    if (!Sp.isKnown(e)) {
      ctx.save(); ctx.globalAlpha = e.frozen ? 0.5 : 0.85;
      if (!sprite(ctx, demon ? DEMON : GHOST, px, py + bob, demon ? '#a05050' : '#a8a8b8')) glyph(ctx, '👻', px + TS / 2, py + TS / 2, '#aaa', 28);
      ctx.restore();
      glyph(ctx, '?', px + TS - 10, py + 9, '#ddd', 16);
      if (e.fighting) glyph(ctx, '⚔', px + 8, py + 8, '#ff6a4a', 16);
      return;
    }
    ctx.save(); ctx.globalAlpha = e.frozen ? 0.5 : 0.9;
    if (!sprite(ctx, demon ? DEMON : GHOST, px, py + bob, demon ? '#e05050' : col)) glyph(ctx, '👻', px + TS / 2, py + TS / 2, col, 28);
    ctx.restore();
    glyph(ctx, Sp.glyph(e), px + TS - 10, py + 9, col, 16, 6);
    if (e.attending) { ctx.strokeStyle = col; ctx.setLineDash([3, 3]); ctx.strokeRect(px + 2, py + 2, TS - 4, TS - 4); ctx.setLineDash([]); }
    if (e.fighting) glyph(ctx, '⚔', px + 8, py + 8, '#ff6a4a', 16);
  };

  // ------------------------------------------------------------ spawning
  function freeNear(cx, cy, rmin, rmax, pred) {
    for (let tries = 0; tries < 80; tries++) {
      const r = rmin + Math.floor(Math.random() * (rmax - rmin + 1));
      const a = Math.random() * 6.283;
      const x = Math.round(cx + Math.cos(a) * r), y = Math.round(cy + Math.sin(a) * r);
      if ((x !== S().x || y !== S().y) && G.passable(x, y) && (!pred || pred(x, y))) return [x, y];
    }
    return null;
  }
  Sp.spawnNear = function (p, opts) {
    const at = freeNear(S().x, S().y, 1, 2);
    if (!at) return null;
    const e = G.addEnt(Object.assign({ kind: 'spirit', planet: p, rank: 'legion', x: at[0], y: at[1], hx: at[0], hy: at[1] }, opts || {}));
    G.effect(at[0], at[1], P[p].g, P[p].color, 1, 900);
    return e;
  };
  Sp.attendant = function (p) {
    const s = S();
    return G.ents().find(e => e.kind === 'spirit' && e.planet === p && e.rank === 'legion' &&
      (e.attending || (p === 'moon' && Math.abs(e.x - s.x) + Math.abs(e.y - s.y) <= 1)));
  };
  Sp.remove = function (e) { G.removeEnt(e); };

  // ------------------------------------------------------------ behaviour
  let tickN = 0;
  function dist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
  function stepToward(e, tx, ty, away) {
    const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [e.x + dx, e.y + dy])
      .filter(([x, y]) => G.passable(x, y) && !(x === S().x && y === S().y));
    if (!opts.length) return;
    opts.sort((a, b) => { const da = Math.abs(a[0] - tx) + Math.abs(a[1] - ty), db = Math.abs(b[0] - tx) + Math.abs(b[1] - ty); return away ? db - da : da - db; });
    [e.x, e.y] = opts[0];
  }
  function wander(e, radius) {
    const dx = [1, -1, 0, 0][Math.floor(Math.random() * 4)], dy = dx ? 0 : (Math.random() < 0.5 ? 1 : -1);
    const nx = e.x + dx, ny = e.y + dy;
    if (Math.abs(nx - e.hx) + Math.abs(ny - e.hy) > radius) return;
    if (G.passable(nx, ny) && !(nx === S().x && ny === S().y)) { e.x = nx; e.y = ny; }
  }
  function once(key, fn) { const s = S(); const k = key + Math.floor(s.min / 60); if (!s.flags[k]) { s.flags[k] = true; fn(); } }

  Sp.tick = function () {
    const s = S();
    tickN++;
    if (G.map().desert) ensureDesert();
    const ents = G.ents();
    const spirits = ents.filter(e => e.kind === 'spirit');
    const player = { x: s.x, y: s.y };
    // Saturn's idleness (§44): neighbours of a saturnine spirit do nothing
    spirits.forEach(e => { e.frozen = false; e.fighting = false; });
    const saturnines = spirits.filter(e => e.planet === 'saturn' && e.rank === 'legion');
    for (const sat of saturnines) {
      spirits.forEach(o => { if (o !== sat && dist(o, sat) <= 1 && o.rank === 'legion') o.frozen = true; });
      if (!sat.attending && dist(sat, player) <= 1 && !G.wearing('saturn_amulet')) {
        s.min += 5;
        once('idle', () => G.log('An idleness settles on you. Time passes and you do nothing. The saturnine spirit subjects its neighbours to continuous idleness (§44).', 'bad'));
      }
    }
    // The Reader from Paris is not weather: he walks toward your latest suspect act, and home when you are quiet.
    if (G.map().desert && tickN % 3 === 0) {
      const rd = ents.find(e => e.id === 'reader');
      if (rd) {
        const at = s.flags.suspectAt, loud = s.stats.suspicion >= 20;
        const tgt = s.flags.written ? null : (at && loud ? at : [rd.hx, rd.hy]);
        if (tgt && Math.abs(rd.x - tgt[0]) + Math.abs(rd.y - tgt[1]) > (at && loud ? 2 : 0)) stepToward(rd, tgt[0], tgt[1]);
        if (dist(rd, player) <= 3 && loud) once('readerwatch', () => G.log('The Reader from Paris is watching you, and his pen is moving.', 'william'));
      }
    }
    for (const e of spirits) {
      if (e.rank === 'ruler' || e.frozen || e.blocker) continue;
      // carrying the written book down, every legion attends you
      if (s.flags.written && G.map().sphere && e.rank === 'legion') { if (dist(e, player) > 1) stepToward(e, player.x, player.y); continue; }
      if (e.attending) {
        e.ttl--;
        if (e.ttl <= 0) { G.effect(e.x, e.y, Sp.glyph(e), P[e.planet].color); G.removeEnt(e); G.log(`${LEGION_ONE[e.planet]} slips back to its sphere.`, 'sky'); continue; }
        if (dist(e, player) > 1) stepToward(e, player.x, player.y);
        continue;
      }
      const p = e.planet;
      if (e.rank === 'light') { if (tickN % 3 === 0) wander(e, 4); continue; }
      if (p === 'saturn') { if (tickN % 4 === 0) { const before = [e.x, e.y]; wander(e, 4); const t = G.terrainAt(e.x, e.y); if (G.map().desert && t && !t.T.refuse) [e.x, e.y] = before; } continue; }
      if (p === 'jupiter') { if (tickN % 2 === 0) { if (dist(e, { x: e.hx, y: e.hy }) > 2) stepToward(e, e.hx, e.hy); else wander(e, 3); } continue; }
      if (p === 'sun') { if (tickN % 6 === 0) wander(e, 2); continue; }
      if (p === 'venus') { if (tickN % 2 === 0) wander(e, 5); if (dist(e, player) <= 1) once('venus', () => { G.log('Your pulse answers the spirit of Venus before you do.', 'bad'); G.stat('remembrance', -1); }); continue; }
      if (p === 'mercury') { wander(e, 5); continue; }
      // they help without distinction (§33): they come to whoever is near and stay at their side
      if (p === 'moon') { if (dist(e, player) < 8) { if (dist(e, player) > 1) stepToward(e, player.x, player.y); } else wander(e, 6); continue; }
      if (p === 'mars') {
        const foe = spirits.find(o => o !== e && o.planet === 'mars' && !o.attending && o.rank === 'legion' && dist(o, e) <= 1);
        if (foe) {
          e.fighting = foe.fighting = true;
          if (Math.random() < 0.06) { G.effect(foe.x, foe.y, '♂', '#ff6a4a', -1); G.removeEnt(foe); }
          continue;
        }
        const warded = G.wearing('mars_ward');
        if (dist(e, player) <= 1) {
          if (warded) { stepToward(e, player.x, player.y, true); once('ward', () => G.log('The Martian comes at you and is frustrated by the characters you wear (§27).', 'good')); }
          else { G.stat('flesh', -6); if (G.map().sphere) G.stat('remembrance', -2, true); G.sfx('hit'); once('marshit', () => G.log('A Martian spirit strikes at you, desiring ungentleness (§27). (W: wear the characters of Mars.)', 'bad')); }
          continue;
        }
        if (dist(e, player) < 6 && !warded) stepToward(e, player.x, player.y);
        else { const other = spirits.find(o => o !== e && o.planet === 'mars' && !o.attending && dist(o, e) < 6); if (other) stepToward(e, other.x, other.y); else wander(e, 5); }
      }
    }
  };

  function ensureDesert() {
    const s = S();
    const list = G.ents();
    // lunar spirits come by night and help without distinction (§33)
    const moons = list.filter(e => e.kind === 'spirit' && e.planet === 'moon' && e.nocturnal && !e.attending);
    if (G.night()) {
      if (moons.length < 3 && Math.random() < 0.3) {
        const at = freeNear(s.x, s.y, 4, 7);
        if (at) G.addEnt({ kind: 'spirit', planet: 'moon', rank: 'legion', nocturnal: true, x: at[0], y: at[1], hx: at[0], hy: at[1] });
      }
    } else moons.forEach(e => G.removeEnt(e));
    const count = (p, box) => list.filter(e => e.kind === 'spirit' && e.planet === p && !e.attending && e.x >= box[0] && e.x <= box[2] && e.y >= box[1] && e.y <= box[3]).length;
    const boxSpawn = (p, box, want, chance) => {
      if (count(p, box) >= want || Math.random() > chance) return;
      for (let i = 0; i < 30; i++) {
        const x = box[0] + Math.floor(Math.random() * (box[2] - box[0] + 1)), y = box[1] + Math.floor(Math.random() * (box[3] - box[1] + 1));
        if (G.passable(x, y) && !(x === s.x && y === s.y) && (p !== 'saturn' || G.terrainAt(x, y).T.refuse)) { G.addEnt({ kind: 'spirit', planet: p, rank: 'legion', x, y, hx: x, hy: y }); return; }
      }
    };
    boxSpawn('saturn', [5, 24, 14, 32], 3, 1);
    boxSpawn('mercury', [29, 7, 39, 13], 2, 0.05);   // near the Reader's camp, where words are
    boxSpawn('jupiter', [22, 24, 36, 31], 2, 0.05);  // helping the space of the living (§45)
    boxSpawn('sun', [53, 30, 61, 36], 2, 0.05);      // by Apollo's rock, beyond the dunes
    if (count('venus', [24, 30, 38, 39]) < 2 && Math.random() < 0.05) {   // a pair, near the caravan
      for (let i = 0; i < 20; i++) {
        const x = 24 + Math.floor(Math.random() * 14), y = 30 + Math.floor(Math.random() * 9);
        if (G.passable(x, y) && G.passable(x + 1, y) && !(x === s.x && y === s.y) && !(x + 1 === s.x && y === s.y)) {
          G.addEnt({ kind: 'spirit', planet: 'venus', rank: 'legion', x, y, hx: x, hy: y });
          G.addEnt({ kind: 'spirit', planet: 'venus', rank: 'legion', x: x + 1, y, hx: x + 1, hy: y });
          break;
        }
      }
    }
    boxSpawn('mars', [18, 38, 30, 42], 4, list.some(e => e.planet === 'mars') ? 0.02 : 1);
    if (!s.flags.lights) {
      s.flags.lights = true;
      [[29, 15], [36, 22], [55, 29], [52, 36], [24, 21]].forEach(([x, y]) => G.addEnt({ kind: 'spirit', rank: 'light', planet: 'sun', hidden: 'light', x, y, hx: x, hy: y }));
    }
  }

  // ------------------------------------------------------------ conversation
  const LOST = '[Here the manuscript breaks off. The detailed descent of this order is lost; only the ages section (§24–33) speaks of it.]';
  Sp.talk = function (e) {
    const s = S();
    if (e.rank === 'ruler') return rulerTalk(e);
    if (e.rank === 'light') return G.openTalk(e, lightTalk(e));
    const p = e.planet;
    if (p !== 'moon' && !G.doctrine('apuleius')) { G.log('It is there. You feel it. But you have no idea how one speaks with a daimon. (The monk has not read Apuleius. B closes the book.)', 'bad'); return; }
    if (!Sp.isKnown(e)) { s.known = s.known || {}; s.known[p] = true; G.log(`It speaks, and names its order: ${P[p].legion}.`, 'good'); }
    if (e.blocker) {
      if (G.eloquence() >= 20) {
        G.ents().filter(o => o.blocker).forEach((o, i) => { o.blocker = false; o.y += (i % 2 ? 1 : -1); o.hx = o.x; o.hy = o.y; });
        G.log('You speak, and your words have the sweet taste of profound eloquence. The turners of Mercury step aside without objection (§32).', 'good');
        G.sfx('magic');
      } else { G.log('The turners of Mercury hang in a line across the way, waiting for eloquence. (Eloquence 20: Martianus, or Mercury’s tablet held.)', 'bad'); }
      return;
    }
    const teach = () => {
      if (s.chars[p]) return `You already know the characters of ${P[p].name}.`;
      if (p === 'moon' || e.willing || G.eloquence() >= 30 || !e.attending) {
        s.chars[p] = true;
        G.log(`You have learned the characters of ${P[p].name} ${P[p].g}.`, 'good');
        return `It traces the characters of ${P[p].name} on the air, slowly enough for you to copy. Whatever you have learned in such companionship you will write down (§6).`;
      }
      return 'An unwilling spirit gives nothing away. Invoke gently next time, or come with more eloquence.';
    };
    G.openTalk(e, {
      greet: L.SPIRIT_TALK.greet(p) + (s.stats.suspicion >= 50 ? ' (Through William’s eyes it looks horned.)' : ''),
      NAME: 'We have no names you could keep. William will count that against us: no angelic names.',
      JOB: P[p].gift,
      CHARACTERS: teach,
      ORDER: `We are ${P[p].legion}, one of the twelve orders. Everything that moves has spirits assigned to it (§16).`,
      DESCENT: P[p].immissio || LOST,
      AGE: P[p].age || LOST,
      RULER: 'Our ruler never comes down. No incantation calls it from its blessedness. It sends us (§23).',
      PRISON: 'Is being put into matter our reward or our punishment? Neither. Everything merits its own use (§39). And you, in your body?',
      SEAT: 'There is an empty seat. It is kept for you (§6).',
      BYE: e.attending ? 'It stays at your side.' : 'It turns back to its rotation.',
    });
  };
  function lightTalk(e) {
    return {
      greet: 'One who lives in the light turns toward you. You did not know that there was a person inside the light.',
      NAME: 'The lights near the Creator do not need names. They praise.',
      JOB: 'We preside over the corruptions of the rest, like lights, helping through the seconds of the principles (§14).',
      LIGHT: G => { const k = 'light_' + e.eid; if (!G.flag(k)) { G.set(k); G.stat('remembrance', 3); } return 'You once lived here. That is what the soul half-remembers when it is sad for no reason (§2).'; },
      SEAT: 'Your seat is empty. You have been away, reigning in the kingdom of the flesh.',
      BYE: 'It stays, since it does not leave.',
    };
  }
  function rulerTalk(e) {
    const s = S(), p = e.planet, PP = P[p];
    const need = () => {
      if (p === 'urania') { const missing = L.ORDERS.filter(o => o !== 'urania' && !s.orders[o]); return missing.length ? `You do not yet know all twelve orders. Missing: ${missing.map(o => (P[o] || L.ELEMENTS[o]).name).join(', ')}.` : null; }
      return s.fellowship[p] ? null : `You have no fellowship with my order. Come carrying an image of ${PP.name} that you have ensouled yourself.`;
    };
    const D = {
      greet: `${Sp.name(e)} ${PP.g} does not come down to you. You have come up. Say PASS if you would go higher.`,
      NAME: p === 'urania' ? 'The one who rules Urania. It is a place, not a name.' : `Call me by my sphere. The Reader from Paris would say that names are the point, and he would be wrong.`,
      JOB: PP.gift,
      ORDER: `Here are ${PP.legion}.${p === 'urania' ? ' They are not sent down.' : ''}`,
      DESCENT: PP.immissio || (p === 'urania' ? 'My spirits do not descend until the ages rest (§19).' : LOST),
      AGE: PP.age || LOST,
      CHARACTERS: () => { if (p !== 'urania') s.chars[p] = true; return p === 'urania' ? 'There are no characters for this.' : 'The characters glow in the sphere. You know them now.'; },
      PASS: () => {
        const n = need();
        if (n) return n;
        if (s.passed[p]) return 'You have already passed. Go up.';
        D._answer = w => {
          D._answer = null;
          if (PP.answer.some(a => w === a || w.includes(a))) {
            s.passed[p] = true; s.orders[p] = s.orders[p] || PP.tag;
            if (p === 'urania') s.orders.urania = 'MS';
            G.sfx('rise');
            G.log(`The ruler of ${PP.name} lets you pass. (${Math.min(30, Math.round(Object.keys(s.passed).length * 3.75))} years in the desert.)`, 'good');
            G.stat('remembrance', 5);
            return p === 'urania' ? 'Then sit. Your companions have kept your seat empty for thirty years (§6). It is to the north.' : 'Yes. The way north is open. Go up.';
          }
          return 'No. Think on what my order does. (The Codex, J, holds what you have learned.) Say PASS again when you are ready.';
        };
        return PP.question;
      },
      BYE: 'It does not leave. It is where it is.',
    };
    G.openTalk(e, D);
  }

  // ------------------------------------------------------------ the spheres
  const FLOORS = { moon: '#161a2c', mercury: '#10261e', venus: '#2a1422', sun: '#2a220c', mars: '#2a100c', jupiter: '#0e1a30', saturn: '#1e1a14', urania: '#101018' };
  function genSphere(p) {
    const N = 25, C = 12, R = L.rng(p.length * 991 + p.charCodeAt(0));
    const rows = [];
    for (let y = 0; y < N; y++) {
      let r = '';
      for (let x = 0; x < N; x++) {
        const d = Math.hypot(x - C, y - C);
        let ch = d > 11.5 ? '*' : 'r';
        if (ch === 'r' && d > 3 && d < 10.5 && x !== C && y !== C && R() < 0.07) ch = '*';
        if (p === 'mercury' && y === 6 && ch !== '*' && (x < 10 || x > 14)) ch = '*';
        r += ch;
      }
      rows.push(r);
    }
    const setc = (x, y, ch) => { rows[y] = rows[y].slice(0, x) + ch + rows[y].slice(x + 1); };
    setc(C, 1, p === 'urania' ? 'S' : 'U');
    if (p === 'urania') setc(C, 2, 'r');
    setc(C, 23, 'D');
    if (p === 'mercury') for (let x = 10; x <= 14; x++) { setc(x, 6, 'r'); setc(x, 5, 'r'); setc(x, 7, 'r'); }
    const ents = [{ kind: 'spirit', planet: p, rank: 'ruler', x: C, y: C, hidden: p === 'sun' ? 'light' : undefined }];
    if (p === 'mercury') for (let x = 10; x <= 14; x++) ents.push({ kind: 'spirit', planet: p, rank: 'legion', blocker: true, x, y: 6 });
    if (p !== 'urania') {
      let placed = 0, guard = 0;
      while (placed < 6 && guard++ < 400) {
        const x = 2 + Math.floor(R() * 21), y = 2 + Math.floor(R() * 21);
        if (rows[y][x] !== 'r' || (x === C && y === C) || Math.abs(y - 22) < 2 && Math.abs(x - C) < 2 || ents.some(e => e.x === x && e.y === y) || (p === 'mercury' && y === 6)) continue;
        ents.push({ kind: 'spirit', planet: p, rank: 'legion', x, y });
        if (p === 'venus' && rows[y][x + 1] === 'r') { ents.push({ kind: 'spirit', planet: p, rank: 'legion', x: x + 1, y }); placed++; }
        placed++;
      }
    }
    const ms = ['jupiter', 'saturn', 'urania'].includes(p);
    const banner = p === 'urania' ? '✶ Urania · MS §19 · the twelve orders per WILLIAM'
      : ms ? `${P[p].g} The sphere of ${P[p].name} · MS §${p === 'saturn' ? '24–25, 44' : '26, 45'}`
        : `${P[p].g} The sphere of ${P[p].name} · MS-ages only · its descent is lost: reconstructed`;
    L.MAPS['sphere_' + p] = {
      name: p === 'urania' ? 'Urania, the outermost sphere' : `The sphere of ${P[p].name}`,
      layer: 'hermit', sphere: p, indoor: false, rows, ents, start: [C, 22],
      floor: FLOORS[p], provenance: ms ? 'MS' : 'MS-ages', banner, hideUp: p === 'sun',
    };
  }
  L.ASCENT.forEach(genSphere);
})();
