// Commands and the operations of the Liber.
window.L = window.L || {};
(function () {
  const G = L.G;
  const M = L.Magic = {};
  const P = L.PLANETS;
  const S = () => G.S;

  const RECIPES = {
    moon: [{ need: ['shoes', 'silver'], out: 'img_moon', how: 'You write the Moon’s characters on the shoes and paint the face of the Moon, with a triangle, on both sides (§33).' }],
    mercury: [{ need: ['parchment', 'quicksilver'], out: 'img_mercury', how: 'You dust the parchment with quicksilver and inscribe Mercury’s characters.' }],
    venus: [{ need: ['myrtle', 'copper'], out: 'img_venus', how: 'You bind the myrtle with a copper wire engraved with the characters of Venus.' }],
    sun: [
      { need: ['peony'], out: 'img_peony', how: 'With the needle you write the name and the characters of the Sun around the root (§29).' },
      { need: ['mirror', 'gold'], out: 'img_sun', how: 'You gild the mirror’s rim and cut the Sun’s characters into it.' },
    ],
    mars: [{ need: ['iron'], out: 'img_mars', how: 'You engrave the characters of Mars into the iron plate (§27).' }],
    jupiter: [{ need: ['tin'], out: 'img_jupiter', how: 'You engrave a mild figure of Jupiter on the tin with his characters.' }],
    saturn: [{ need: ['lead'], out: 'img_saturn', how: 'You cast the lead and inscribe it with Saturn’s characters, and pierce it for a cord (§24).' }],
  };
  const VIVID = { img_moon: 'lunar_shoes', img_mercury: 'mercury_tablet', img_venus: 'venus_charm', img_sun: 'apollo_mirror', img_peony: 'peony_vivid', img_mars: 'mars_ward', img_jupiter: 'jupiter_image', img_saturn: 'saturn_amulet' };

  const MIRROR_LINES = {
    moon: 'The spirit settles into the leather like a foot into a shoe. You feel how snug a body is, and how easy it is to forget you ever walked without one.',
    mercury: 'The spirit enters the letters and your own tongue loosens at once. It obeys without objection, as your soul obeys the instrument of the body.',
    venus: 'The spirit coils into the myrtle, warm and willing. You recognise that willingness: it is how your soul fell into its body, delighting in the machine (§42).',
    sun: 'The spirit is too large for the matter. It enters the gold as a word enters a sentence too small for it, the way you are too large for yourself.',
    mars: 'The spirit goes into the iron violently, as it goes into everything. The prison is a real prison. You know that feeling.',
    jupiter: 'The spirit enters the tin as if returning home. Neither reward nor punishment: it is fulfilling its use (§39). You wonder whether your body might be that for you.',
    saturn: 'The spirit sinks into the lead slowly, heavy with the weight of the fallen bulk. Your own weight answers it.',
  };

  // ------------------------------------------------------------ dispatcher
  M.command = function (k, fromClick) {
    const s = S();
    if (s.layer !== 'hermit' && ['i', 'c', 'v', 'x'].includes(k)) {
      G.log(s.layer === 'monk' ? 'Thomas reads about such things; he does not do them. Not with Tempier’s notice on the chapter-house wall.' : 'Dee does not work that way. He prays, and a scryer looks.');
      return true;
    }
    if (s.layer === 'monk' && k === 'm') { L.Story.copy(); return true; }
    if (s.layer === 'dee' && k === 'm') { G.log('Not yet. The annotating comes at the end of the book.'); return true; }
    switch (k) {
      case 'l': G.askDir('Look', (x, y) => G.look(x, y), true); return true;
      case 't': G.askDir('Talk', (x, y) => { const e = G.entAt(x, y, e => e.kind === 'npc' || e.kind === 'spirit'); if (e) G.talk(e); else G.log('No one there.'); }); return true;
      case 'g': G.askDir('Get', M.get, true); return true;
      case 'r': M.read(); return true;
      case 'u': M.useMenu(); return true;
      case 'w': M.wearMenu(); return true;
      case 'd': M.dropMenu(); return true;
      case 'e': return M.enter(fromClick);
      case 'p': M.pray(); return true;
      case 'f': M.fast(); return true;
      case 'h': M.rest(); return true;
      case 'i': M.invoke(false); return true;
      case 'c': M.invoke(true); return true;
      case 'm': M.make(); return true;
      case 'v': M.vivifyMenu(); return true;
      case 'x': M.exorcise(); return true;
      case 's': M.search(); return true;
      case 'j': L.Story.codex(); return true;
      case 'z': M.stats(); return true;
      case 'b': L.Story.book(); return true;
      case 'q': G.save(); return true;
      case 'o': G.log('Doors here open to a touch. Walk through.'); return true;
      case 'a': G.log('This is not that kind of book. The Liber has no swords; it has characters and hours. (X to exorcise.)'); return true;
      case '?': M.help(); return true;
      case ' ': case '.': G.log('You wait.'); G.pass(5); return true;
      case 'n': G.muted = !G.muted; G.log(G.muted ? 'Sound off.' : 'Sound on.'); return true;
    }
    return false;
  };

  M.defaultAction = function (e) {
    if (e.kind === 'npc' || e.kind === 'spirit') return G.talk(e);
    if (e.kind === 'item') return M.get(e.x, e.y);
    if (e.read || e.doctrine) return M.readFeature(e);
    if (e.element) return L.Story.shrine(e);
    G.look(e.x, e.y);
  };

  // ------------------------------------------------------------ get / read / search
  M.get = function (x, y) {
    const s = S();
    const e = G.entAt(x, y, e => e.kind === 'item');
    if (e) {
      G.give(e.item, e.n || 1);
      G.removeEnt(e);
      G.log(`You take ${G.entName(e)}.`);
      G.sfx('coin');
      return;
    }
    const t = G.terrainAt(x, y);
    if (!t) return;
    if (t.T.palm) {
      if (G.flag('barren') && s.map === 'desert') { G.log('The palm is dead. Mars made this region barren.'); return; }
      const k = 'palm' + x + ',' + y;
      if (s.flags[k] === G.day()) { G.log('You have picked this palm clean today.'); return; }
      s.flags[k] = G.day(); G.give('dates', 2); G.log('You pick dates.'); return;
    }
    if (t.T.well) { G.give('water', 1); G.log('You fill a water skin.'); return; }
    if (t.T.peony) {
      if (G.hourRuler() !== 'sun') { G.log('Not now. The peony must be taken in the hour of the Sun (§29). Check the sky; H lets you wait for an hour.', 'bad'); G.sfx('fail'); return; }
      if (G.has('peony') || G.has('img_peony') || G.has('peony_vivid')) { G.log('One root is enough. Take no more than the work needs.'); return; }
      G.give('peony', 1); G.log('In the hour of the Sun you lift a peony root, earth still on it.', 'good'); G.sfx('magic'); return;
    }
    if (x === s.x && y === s.y) { G.log('Nothing here to take.'); return; }
    G.log('Nothing there to take.');
  };

  M.read = function () {
    const s = S();
    // adjacent feature first
    const adj = G.ents().find(e => (e.read || e.doctrine) && G.visible(e) && Math.abs(e.x - s.x) <= 1 && Math.abs(e.y - s.y) <= 1);
    if (adj) return M.readFeature(adj);
    const books = s.inv.filter(e => ['ms125', 'de_universo', 'catalogue', 'book_apuleius'].includes(e.id));
    if (books.length) { G.choose('Read what?', books.map(b => ({ label: L.ITEMS[b.id].name, value: b })), M.readItem); return; }
    G.log('Nothing to read here. Stand next to a book or a shelf.');
  };
  M.readItem = function (b) {
    const s = S();
    if (b.id === 'catalogue') return L.Story.catalogue();
    if (b.id === 'book_apuleius') {
      if (!s.doctrines.apuleius) {
        s.doctrines.apuleius = 'borrowed';
        G.pass(60);
        G.story(['<p class="big">☊ Apuleius, <i>De deo Socratis</i></p><p>Daimones are in their nature animals, in genus rational, in mind passible, in body aerial, in time eternal. Because they feel, they can hear us.</p><p class="good">Doctrine gained, on loan: you can Talk with spirits, but only while Thomas holds this book. Copy it at your carrel (M) to keep it.</p>'], () => G.redraw(), 'Reading');
      } else G.log('You have read it.' + (s.doctrines.apuleius === 'borrowed' ? ' (It is yours only while you hold it. M at your carrel copies it.)' : ''));
      return;
    }
    G.log(L.ITEMS[b.id].desc);
  };
  M.readFeature = function (e) {
    if (e.doctrine) return L.Story.readDoctrine(e);
    if (e.read) return L.Story[e.read](e);
  };
  M.search = function () {
    const s = S();
    G.pass(15);
    const t = G.terrainAt(s.x, s.y);
    if (s.map === 'desert' && t.T.refuse) { G.log('Among the bones, cold patches in the air. Saturn’s spirits leap around the refuse of dead things (§45).'); return; }
    const near = G.ents().filter(e => e.hidden === 'light' && Math.abs(e.x - s.x) < 5 && Math.abs(e.y - s.y) < 5);
    if (near.length && !G.wearing('apollo_mirror')) { G.log('The light around you is thicker than light should be. Someone lives in it whom you cannot see.'); return; }
    G.log('You search and find only the world.');
  };

  // ------------------------------------------------------------ body and soul
  M.pray = function () {
    const s = S();
    const altar = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => { const t = G.terrainAt(s.x + dx, s.y + dy); return t && t.T.altar; });
    const k = 'pray' + Math.floor(s.min / 60);
    if (s.flags[k]) { G.log('Your words fall on stone. It is too soon to pray again; wait for the next hour.'); G.pass(15); return; }
    s.flags[k] = true;
    if (s.layer === 'monk') {
      const o = L.Story.office && L.Story.office();
      if (o && s.x >= 22 && s.y <= 10) { G.stat('prior', -10); G.stat('purity', 2); G.log(`You sing ${o} with the brothers in choir. The prior marks that you came. (Prior −10)`, 'good'); G.pass(40); return; }
      G.log(o ? `The brothers are at ${o} in the church. You pray alone.` : 'A stillness answers.'); G.pass(15); return;
    }
    if (altar) { G.stat('purity', 2); G.stat('remembrance', 1); G.suspect(-3); G.log('A stillness answers. You pray at the altar to the First Essence, which changes and is not changed (§7). (Purity +2)', 'good'); G.pass(30); }
    else { G.stat('purity', 1); G.suspect(-1); G.log('A stillness answers. You pray where you stand. (Purity +1)'); G.pass(15); }
  };
  M.fast = function () {
    const s = S();
    if (s.layer !== 'hermit') { G.log('The brothers fast by the calendar, not by whim.'); return; }
    if (s.map === 'seville') { G.log('The smell of roast meat from every door makes fasting impossible here.'); return; }
    if (s.stats.flesh < 15) { G.log('You are too weak to fast longer.', 'bad'); return; }
    G.pass(60, true);
    G.stat('flesh', -7);
    G.stat('remembrance', 2);
    if (G.S.min % 180 < 60) G.stat('purity', 1);
    G.log('You fast for an hour. The body’s voice grows thinner, and something older speaks under it.');
  };
  M.eat = function (e) {
    const d = L.ITEMS[e.id];
    G.take(e.id, 1);
    if (e.id === 'wine') { G.stat('flesh', 12); G.stat('remembrance', -4); G.stat('purity', -2); G.log('The wine is good. Something slips away with it. (Remembrance −4)', 'bad'); return; }
    G.stat('flesh', d.food);
    G.log(`You eat the ${d.name}. (Flesh +${d.food})`);
    if (S().map === 'seville') G.stat('remembrance', -1, true);
  };
  M.rest = function () {
    const s = S();
    const t = G.terrainAt(s.x, s.y);
    if (s.map === 'seville' && t.T.bed) { L.Story.vision(); return; }
    if (s.map === 'prison') { L.Story.waitPrison(); return; }
    const opts = [
      { label: 'one hour', value: 60 },
      { label: 'three hours', value: 180 },
      { label: G.night() ? 'until dawn' : 'until dusk', value: 'turn' },
    ];
    if (s.layer === 'monk' && G.day() < 3) opts.push({ label: 'until Lent begins (Wednesday, after Prime)', value: 'lent' });
    L.CHALDEAN.forEach(p => opts.push({ label: `until the hour of ${P[p].g} ${P[p].name}${G.retro(p) && p !== 'sun' && p !== 'moon' ? ' (℞ now)' : ''}`, value: p }));
    G.choose('Rest how long?', opts, v => {
      let mins;
      if (typeof v === 'number') mins = v;
      else if (v === 'lent') mins = (3 * 1440 + 7 * 60) - s.min;
      else if (v === 'turn') { const h = G.hour(); const target = G.night() ? 6 : 19; mins = ((target - h + 24) % 24) * 60 - (s.min % 60); if (mins <= 0) mins += 1440; }
      else { mins = 0; for (let m = 60 - (s.min % 60); m <= 24 * 60; m += 60) if (G.hourRuler(s.min + m) === v) { mins = m; break; } }
      if (s.layer === 'hermit' && s.stats.flesh - mins / 30 < 5) { G.log(`You are too hungry to wait ${Math.round(mins / 60)} hours; you would faint and miss the hour. Eat first.`, 'bad'); return; }
      G.pass(mins, true);
      G.log(`You rest. It is now ${G.clock()}, the hour of ${P[G.hourRuler()].name} ${P[G.hourRuler()].g}.`, 'sky');
      G.redraw();
    });
  };

  // ------------------------------------------------------------ enter / ascend
  M.enter = function (fromClick) {
    const s = S();
    const t = G.terrainAt(s.x, s.y);
    if (t.T.light) { L.Story.ascend(); return true; }
    if (t.T.up) { L.Story.climb(); return true; }
    if (t.T.down) { L.Story.descend(); return true; }
    if (fromClick) return false;
    const seat = [[0, -1], [0, 1], [1, 0], [-1, 0]].some(([dx, dy]) => { const q = G.terrainAt(s.x + dx, s.y + dy); return q && q.T.seat; });
    if (seat) { L.Story.seat(); return true; }
    G.log('Nothing to enter here.');
    return true;
  };

  // ------------------------------------------------------------ invoke and conjure (§23)
  M.invoke = function (violent) {
    const s = S();
    if (s.layer !== 'hermit') { G.log(s.layer === 'monk' ? 'In the abbey? With the Tempier list on the chapter house wall?' : 'Not yet, Doctor. Not with this stone.'); return; }
    if (P[s.map] || G.map().sphere) { G.log('Here, in the sphere itself, the spirits are already around you.'); return; }
    const list = L.CHALDEAN.map(p => ({ label: `${P[p].g} ${P[p].name}${violent && !s.chars[p] ? ' (characters unknown)' : ''}`, value: p }));
    G.choose(violent ? 'Conjure which order? (violent conjuration, with characters)' : 'Invoke which ruler? (flattering incitement, with incense)', list, p => (violent ? conjure : invoke)(p),
      violent ? '<p class="small">Violent conjuration works at any hour but brings unwilling spirits who slip away. It needs the planet’s characters, and Jupiter’s spirits are conscious of no conjurations.</p>'
        : '<p class="small">A ruler is never called down itself; it delegates (§23). Invocation needs incense and the planet’s own day or hour.</p>');
  };
  function invoke(p) {
    const s = S();
    if (!G.has('incense')) { G.log('You have no incense for the offering. (The market, the caravan, the hermitage.)', 'bad'); return; }
    if (G.dayRuler() !== p && G.hourRuler() !== p) { G.log(`The ruler of ${P[p].name} is not at leisure. Invoke it on its day or in its hour. (H to rest until the hour of ${P[p].g}.)`, 'bad'); G.sfx('fail'); return; }
    G.take('incense', 1);
    G.pass(20);
    G.log(`You burn incense and address the ruler of ${P[p].name} ${P[p].g} with flattering words.`);
    G.log(`It does not come. Rulers are not called down from their blessedness by anyone’s incantation. But it delegates (§23).`, 'sky');
    const pure = p === 'jupiter' || (s.stats.purity || 0) >= 4;
    const e = L.Spirits.spawnNear(p, { attending: true, willing: pure, ttl: pure ? 12 * 12 : 30, known: true });
    if (!e) { G.log('There is no room here for anything to arrive.'); return; }
    s.known = s.known || {}; s.known[p] = true;
    G.log(`${L.Spirits.name(e)} descends and attends you.`, 'good');
    if (!pure) G.log('It comes grudgingly: the ruler delegates little to one who comes impure. It will not stay long, and will not teach. (Purity 4: pray at an altar, fast.)', 'bad');
    G.sfx('magic');
    if (s.map === 'seville') G.suspect(10, 'the neighbours smelled incense and heard names that were not saints’');
    else if (p !== 'jupiter') G.suspect(1, `he called on the ruler of ${P[p].name}`);
  }
  function conjure(p) {
    const s = S();
    if (p === 'jupiter') { G.log('Nothing comes. The worshippers of the sweetness of Jupiter sit conscious of no conjurations (§45). Offer to them instead (I).', 'bad'); G.sfx('fail'); return; }
    if (!s.chars[p]) { G.log(`You do not know the characters of ${P[p].name}. A spirit of that order could teach you (Talk, CHARACTERS). First invoke.`, 'bad'); return; }
    G.pass(15);
    G.log(`You draw the characters of ${P[p].name} and conjure violently.`);
    const tablet = G.wearing('mercury_tablet') || p === 'mercury';
    const e = L.Spirits.spawnNear(p, { attending: true, willing: tablet, ttl: tablet ? 12 * 12 : 24, known: true });
    if (!e) return;
    s.known = s.known || {}; s.known[p] = true;
    G.stat('purity', -1);
    G.log(`${L.Spirits.name(e)} is dragged down, ${tablet ? 'and obeys without objection (§32).' : 'unwilling. It will not stay long.'}`, 'good');
    G.sfx('magic');
    G.stat('remembrance', -1, true);
    G.suspect(p === 'mercury' ? 2 : 5, `he compelled a spirit of ${P[p].name} with characters`, p === 'mercury' ? 0 : 1);
    if (s.map === 'seville') G.suspect(10, 'in the city itself');
  }

  // ------------------------------------------------------------ make (harmonious matter)
  M.make = function () {
    const s = S();
    if (s.layer !== 'hermit') { G.log('Not here, not now.'); return; }
    if (!G.has('stylus')) { G.log('You need a stylus or needle to write characters. (Your steward left yours on the side table in Seville; the caravan sells them.)', 'bad'); return; }
    const opts = [];
    for (const p of L.CHALDEAN) for (const r of RECIPES[p]) {
      const haveMat = r.need.every(n => G.has(n));
      opts.push({ label: `${P[p].g} ${L.ITEMS[r.out].name} — ${r.need.map(n => L.ITEMS[n].name).join(' + ')}${s.chars[p] ? '' : ' (characters unknown)'}${haveMat ? '' : ' (lacking matter)'}`, value: [p, r] });
    }
    G.choose('Make an image (harmonious matter)', opts, ([p, r]) => {
      if (!s.chars[p]) { G.log(`You do not know the characters of ${P[p].name}. Talk to one of its spirits and ask for CHARACTERS.`, 'bad'); return; }
      const lack = r.need.filter(n => !G.has(n));
      if (lack.length) { G.log(`You lack: ${lack.map(n => L.ITEMS[n].name).join(', ')}.`, 'bad'); return; }
      r.need.forEach(n => G.take(n, 1));
      G.give(r.out, 1);
      G.pass(60);
      G.log(r.how);
      G.log(`You have ${L.ITEMS[r.out].name}: matter prepared, not yet inhabited. (V to vivify, in the hour of ${P[p].g}, with a spirit of ${P[p].name} attending.)`, 'good');
      if (L.Spirits.attendant(p) && G.hourRuler() !== p) G.log(`The hour of ${P[p].name} has passed while you worked. Your spirit will attend for some hours yet; rest (H) until its hour comes round again.`, 'sky');
    }, '<p class="small">Each image needs matter fitting its planet, the planet’s characters, and a stylus. The metals are RECON (traditional correspondences). The shoes, peony and mirror are the Liber’s own.</p>');
  };

  // ------------------------------------------------------------ vivify (§37)
  M.vivifyMenu = function () {
    const s = S();
    const imgs = s.inv.filter(e => L.ITEMS[e.id].image);
    if (!imgs.length) { G.log('You have no prepared image to ensoul. (M to make one.)'); return; }
    G.choose('Vivify which image?', imgs.map(e => ({ label: `${L.ITEMS[e.id].g} ${L.ITEMS[e.id].name}`, value: e })), M.vivify);
  };
  M.vivify = function (img) {
    const s = S();
    const def = L.ITEMS[img.id];
    const p = def.image;
    if (!G.doctrine('asclepius')) { G.log('You hold the matter and do not know how to give it a soul. The monk has not read the Asclepius. (B closes the book; the Asclepius is on the library shelf.)', 'bad'); return; }
    G.pass(30);
    const spirit = L.Spirits.attendant(p);
    const hourOK = G.hourRuler() === p;
    G.log(`Three things are needed: harmonious matter ✓, an obedient spirit ${spirit ? '✓' : '✗'}, helping symmetry ${hourOK ? '✓' : '✗'} (§37).`, 'sky');
    if (!spirit) { G.log(`No spirit of ${P[p].name} attends you. The matter stays dead. (${p === 'moon' ? 'Lunar spirits come to anyone at night; stand beside one.' : 'Invoke its ruler first.'})`, 'bad'); G.sfx('fail'); return; }
    if (!hourOK) {
      G.sfx('fail');
      const npc = G.ents().find(e => e.kind === 'npc' && !e.possessed && Math.abs(e.x - s.x) + Math.abs(e.y - s.y) < 9);
      L.Spirits.remove(spirit);
      if (npc && Math.random() < 0.5) {
        npc.possessed = p;
        G.log(`With no symmetry to hold it, the spirit cannot be enclosed. It enters ${npc.name} instead, enveloped in a body allotted to another (§38).`, 'bad');
        G.suspect(8, 'a possession followed his work', 5);
      } else {
        G.effect(spirit.x, spirit.y, P[p].g, P[p].color, -1, 1600);
        G.log('Finding no symmetry, the spirit returns at once to the heavens. (It is not the hour of ' + P[p].name + '.)', 'bad');
      }
      return;
    }
    const firm = G.retro(p);
    L.Spirits.remove(spirit);
    G.effect(s.x, s.y, P[p].g, P[p].color, 0.2, 1400);
    G.sfx('rise');
    G.removeEntry(img);
    const out = VIVID[img.id];
    const e = G.give(out, 1, { firm, ch: firm ? Infinity : 3 });
    s.fellowship[p] = true;
    s.known = s.known || {}; s.known[p] = true;
    s.orders[p] = P[p].tag;
    G.log(`The spirit is completed and imprisoned in the matter (perficere, incarcerare). You hold ${L.ITEMS[out].name}${firm ? ', firmly bound: the ruler is retrograde (§36)' : ''}.`, 'good');
    G.log(MIRROR_LINES[p], 'mirror');
    G.stat('remembrance', firm ? 12 : 8);
    if (p === 'venus') G.suspect(8, 'he bound a spirit of lust into a herb');
    if (def.peony) G.suspect(3, 'he allied the Creator with the spirits of Apollo');
    G.redraw();
  };

  // ------------------------------------------------------------ use / wear / drop
  M.itemMenu = function (e) {
    if (G.modalOpen()) return;
    const d = L.ITEMS[e.id];
    const opts = [];
    if (d.food || e.id === 'wine') opts.push({ label: 'eat / drink', fn: () => M.eat(e) });
    if (d.use) opts.push({ label: 'use', fn: () => M.use(e) });
    if (d.wear) opts.push({ label: Object.values(G.S.worn).includes(e.uid) ? 'remove' : `wear (${d.wear})`, fn: () => M.wear(e) });
    if (d.image) opts.push({ label: 'vivify', fn: () => M.vivify(e) });
    if (['ms125', 'de_universo', 'catalogue', 'book_apuleius'].includes(e.id)) opts.push({ label: 'read', fn: () => M.readItem(e) });
    opts.push({ label: 'look', fn: () => G.log(`${L.ITEMS[e.id].name}. ${d.desc || ''}${e.firm ? ' Firmly bound.' : ''}`) });
    opts.push({ label: 'drop', fn: () => M.drop(e) });
    G.modal({ title: `${d.g || ''} ${G.itemName(e)}`, html: `<p>${d.desc || ''}</p>`, options: opts });
  };
  M.useMenu = function () {
    const items = G.S.inv.filter(e => { const d = L.ITEMS[e.id]; return d.use || d.food || e.id === 'wine' || d.image || d.wear; });
    G.choose('Use what?', items.map(e => ({ label: `${L.ITEMS[e.id].g || ''} ${G.itemName(e)}`, value: e })), e => {
      const d = L.ITEMS[e.id];
      if (d.food || e.id === 'wine') return M.eat(e);
      if (d.image) return M.vivify(e);
      if (d.use) return M.use(e);
      if (d.wear) return M.wear(e);
    });
  };
  M.wearMenu = function () {
    const items = G.S.inv.filter(e => L.ITEMS[e.id].wear);
    if (!items.length) { G.log('Nothing to wear. (Vivified shoes, amulets, mirrors and tablets can be worn or held.)'); return; }
    G.choose('Wear or remove what?', items.map(e => ({ label: `${L.ITEMS[e.id].g} ${L.ITEMS[e.id].name} (${L.ITEMS[e.id].wear})${Object.values(G.S.worn).includes(e.uid) ? ' — worn' : ''}`, value: e })), M.wear);
  };
  M.wear = function (e) {
    const s = G.S, d = L.ITEMS[e.id];
    if (s.worn[d.wear] === e.uid) { s.worn[d.wear] = null; G.log(`You take off the ${d.name}.`); return; }
    s.worn[d.wear] = e.uid;
    G.log(`You ${d.wear === 'hand' ? 'hold' : 'put on'} the ${d.name}. ${d.desc || ''}`, 'good');
    if (e.id === 'apollo_mirror') G.log('The light thickens into people. You are living with those living in the light (§29).', 'sky');
  };
  M.dropMenu = function () {
    G.choose('Drop what?', G.S.inv.map(e => ({ label: G.itemName(e), value: e })), M.drop);
  };
  M.drop = function (e) {
    const s = G.S;
    if (e.id === 'dinar') { G.log('You keep your money.'); return; }
    G.removeEntry(e);
    G.addEnt({ kind: 'item', item: e.id, n: e.n, x: s.x, y: s.y });
    G.log(`You drop ${L.ITEMS[e.id].name}.`);
  };
  function spend(e) { if (e.ch !== Infinity && e.ch !== undefined) { e.ch--; if (e.ch <= 0) { G.removeEntry(e); G.log(`The spirit in the ${L.ITEMS[e.id].name} is spent and rises home.`, 'sky'); G.effect(G.S.x, G.S.y, L.ITEMS[e.id].g, '#fff'); } } }
  M.use = function (e) {
    const s = G.S, d = L.ITEMS[e.id];
    if (d.use === 'transmit') return L.Story.transmit();
    if (d.use === 'venus') {
      G.askDir('Use the charm on whom', (x, y) => {
        const n = G.entAt(x, y, e => e.kind === 'npc');
        if (!n) { G.log('The charm needs a person.'); return; }
        n.charmed = true; n.wander = 0;
        spend(e);
        G.log(`${n.name} looks at you, and then cannot stop looking. The spirits of Venus press on the bond of marriage and bring in illicit couplings (§31).`, 'bad');
        G.suspect(25, 'he used love magic on a living soul', 15);
        G.stat('remembrance', -5); G.stat('purity', -5);
      });
      return;
    }
    if (d.use === 'jupiter') {
      G.askDir('Show the image to whom', (x, y) => {
        const n = G.entAt(x, y, e => e.kind === 'npc');
        if (!n) { G.log('Jupiter pleases the hearts of the powerful. Show it to someone.'); return; }
        const powerful = ['reader', 'gaoler', 'prior', 'steward', 'gatekeeper', 'merchant', 'caravaneer'].includes(n.id);
        if (!powerful) { G.log(`${n.name} smiles pleasantly, but has no power to please.`); return; }
        spend(e);
        if (n.id === 'gaoler') { G.log('The gaoler’s heart is pleased by a wonderful pleasantness of utility (§26). The door opens.', 'good'); L.Story.release(); return; }
        G.suspect(-30, null, -20); G.log(`${n.name}’s heart is pleased beyond reason. The kings of the earth have always been Jupiter’s (§26). (Suspicion −30, and its floor −20: only the powerful can lower the floor.)`, 'good');
      });
      return;
    }
    if (d.use === 'mars') {
      if (s.map === 'desert' && Math.abs(s.x - 30) < 12 && Math.abs(s.y - 35) < 10) {
        G.choose('Turn the characters of Mars upon the oasis?', [{ label: 'Yes: make the region barren', value: 1 }, { label: 'No', value: 0 }], v => {
          if (!v) return;
          G.set('barren'); spend(e);
          G.log('The palms go grey. The pre-elect of Mars are patrons of barrenness introduced into regions (§27). What the common crowd calls evils descend.', 'bad');
          G.suspect(30, 'he blighted a region with a Martian image', 20);
          G.stat('remembrance', -8);
        });
      } else G.log('Worn (W), the characters of Mars frustrate violent spirits. Turned on a fertile region, they bring barrenness; there is none nearby.');
      return;
    }
    if (d.use === 'peony') {
      if (s.map === 'prison') { spend(e); G.log('The peony helps above all in escaping deadly spots (§29). The bars are only iron.', 'good'); L.Story.release(true); return; }
      G.askDir('Use the peony toward', (x, y) => {
        const t = G.entAt(x, y);
        if (t && (t.possessed || t.kind === 'spirit')) { exorciseEnt(t, e); return; }
        if (t && t.kind === 'npc') { spend(e); G.suspect(-10); G.log(`${t.name} finds you suddenly worth hearing. The peony incites the favour of important men (§29).`, 'good'); return; }
        G.log('Nothing there for the peony.');
      });
    }
  };

  // ------------------------------------------------------------ exorcise
  M.exorcise = function () {
    const peony = G.S.inv.find(e => e.id === 'peony_vivid');
    const ward = G.wearing('mars_ward');
    G.askDir('Exorcise', (x, y) => {
      const t = G.entAt(x, y);
      if (!t || (!t.possessed && t.kind !== 'spirit')) { G.log('Nothing there to expel.'); return; }
      if (t.kind === 'spirit' && t.attending) { L.Spirits.remove(t); G.effect(t.x, t.y, L.Spirits.glyph(t), '#fff'); G.log('You release the attending spirit. It returns to its sphere.'); return; }
      if (peony) return exorciseEnt(t, peony);
      if (ward && t.kind === 'spirit' && t.planet === 'mars') { L.Spirits.remove(t); G.log('The characters of Mars frustrate the Martian. It is violently removed, as they so often are (§27).', 'good'); return; }
      G.log('You have nothing that expels. (The peony of Apollo expels demons; the characters of Mars frustrate Martians.)', 'bad');
    });
  };
  function exorciseEnt(t, peony) {
    spend(peony);
    if (t.possessed) {
      const p = t.possessed; t.possessed = null;
      G.effect(t.x, t.y, L.PLANETS[p].g, L.PLANETS[p].color);
      G.log(`With the peony you draw the ${L.PLANETS[p].name} spirit out of ${t.name}. It rises.`, 'good');
      G.stat('remembrance', 3); G.suspect(-5);
      return;
    }
    L.Spirits.remove(t);
    G.effect(t.x, t.y, L.Spirits.glyph(t), '#fff');
    G.log(`The peony expels the ${L.Spirits.name(t)}.`, 'good');
  }

  // ------------------------------------------------------------ self, stats, help
  M.lookSelf = function () {
    const s = G.S;
    if (s.layer === 'hermit' && G.night() && !G.map().indoor && !G.map().sphere) {
      const k = 'gaze' + G.day();
      if (G.doctrine('macrobius') && !s.flags[k]) {
        s.flags[k] = true; G.pass(30);
        G.log('You look up. Macrobius: the soul came down through these very spheres, taking something from each. You remember a little of the way back.', 'sky');
        G.stat('remembrance', 3); return;
      }
      G.log('The stars. ' + (G.doctrine('macrobius') ? 'You have already gazed tonight.' : 'Beautiful, and mute to you. (The monk has not read Macrobius.)'));
      return;
    }
    G.log(`You are ${ { dee: 'John Dee, in your library at Mortlake', monk: 'Thomas, monk of St Augustine’s', hermit: 'the man from Seville' }[s.layer]}.`);
  };
  M.stats = function () {
    const s = G.S;
    const rows = L.CHALDEAN.slice().reverse().map(p => `<tr><td style="color:${P[p].color}">${P[p].g} ${P[p].name}</td><td>${s.chars[p] ? '✓' : '·'}</td><td>${s.fellowship[p] ? '✓' : '·'}</td><td>${s.passed[p] ? '✓' : '·'}</td><td>${G.retro(p) && p !== 'sun' && p !== 'moon' ? '℞' : ''}</td></tr>`).join('');
    G.modal({
      title: 'Z — the state of the soul', wide: true,
      html: `<p>Flesh ${s.stats.flesh} · Remembrance ${s.stats.remembrance} · Suspicion ${s.stats.suspicion} · Eloquence ${G.eloquence()} · Purity ${s.stats.purity}</p>
      <table class="tbl"><tr><th>order</th><th>characters</th><th>fellowship (image)</th><th>sphere passed</th><th>now</th></tr>${rows}</table>
      <p class="small">Doctrines: ${Object.keys(s.doctrines).map(d => L.DOCTRINES[d].name).join('; ') || 'none'}.</p>`,
      options: [{ label: 'close', fn: () => { } }],
    });
  };
  M.help = function () {
    G.modal({
      title: 'Commands', wide: true,
      html: `<div class="cols">
      <p><kbd>↑↓←→</kbd>/numpad move · <b>click</b> walk / act · <b>right-click</b> look</p>
      <p><kbd>L</kbd>ook · <kbd>T</kbd>alk · <kbd>G</kbd>et · <kbd>R</kbd>ead · <kbd>S</kbd>earch · <kbd>E</kbd>nter / ascend</p>
      <p><kbd>I</kbd>nvoke a ruler (incense, its day or hour) · <kbd>C</kbd>onjure (violent, needs characters)</p>
      <p><kbd>M</kbd>ake an image (matter + stylus + characters) · <kbd>V</kbd>ivify it (spirit attending + planet’s hour)</p>
      <p><kbd>U</kbd>se · <kbd>W</kbd>ear/hold · <kbd>D</kbd>rop · <kbd>X</kbd> exorcise</p>
      <p><kbd>P</kbd>ray · <kbd>F</kbd>ast · <kbd>H</kbd>old up / rest until an hour</p>
      <p><kbd>J</kbd> codex of the twelve orders · <kbd>Z</kbd> state of the soul · <kbd>B</kbd> close/open the book · <kbd>Q</kbd> save · <kbd>N</kbd> sound · <kbd>space</kbd> wait</p>
      </div><p class="small">In a direction prompt, press an arrow, or <kbd>.</kbd> for yourself. In conversation, type a word or click a highlighted one. NAME, JOB and BYE always work.</p>`,
      options: [{ label: 'close', fn: () => { } }],
    });
  };
})();
