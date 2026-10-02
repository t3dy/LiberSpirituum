// Scripted playthrough: paste into the page console (or inject) on a fresh load.
// Drives the real UI: modal buttons by label, conversation by typed keywords.
// Materials and time are given where walking would be tedious; every rule check still runs.
(async function () {
  const G = L.G, errs = [], log = [];
  try {
  window.addEventListener('error', e => errs.push(e.message));
  const wait = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  const modal = () => document.getElementById('modal');
  const closeAll = async () => { for (let i = 0; i < 12 && modal().classList.contains('show'); i++) { const b = modal().querySelector('.mopts button'); if (b && /continue|begin/.test(b.textContent)) b.click(); else G.closeModal(); await wait(20); } };
  const pick = async re => { let b; for (const t0 = Date.now(); Date.now() - t0 < 4000 && !b;) { b = [...modal().querySelectorAll('.mopts button')].find(b => re.test(b.textContent)); if (!b) await wait(20); } if (!b) throw new Error('no option ' + re + ' in: ' + modal().textContent.slice(0, 200)); b.click(); await wait(5); };
  const say = async w => { const f = modal().querySelector('form'); f.querySelector('input').value = w; f.requestSubmit(); await wait(20); return modal().querySelector('.talk').lastElementChild.textContent; };
  const cmd = async k => { L.Magic.command(k); await wait(20); };
  const lastLog = n => G.S.logs.slice(-(n || 1)).map(l => l[0]).join(' | ');
  const ent = f => G.ents().find(f);
  const toHour = async p => { G.S.stats.flesh = 100; await cmd('h'); await pick(new RegExp('hour of .*' + p, 'i')); };
  const check = (c, m) => { log.push((c ? 'PASS ' : 'FAIL ') + m); };

  document.getElementById('t-new') && document.getElementById('t-new').click();
  await wait(50); await closeAll();
  check(G.S.map === 'mortlake', 'starts at Mortlake');
  // Dee reads the manuscript -> monk
  G.S.x = 5; G.S.y = 5; await cmd('r'); await closeAll();
  check(G.S.layer === 'monk' && G.S.map === 'canterbury', 'Dee opens MS 125 -> Canterbury');
  // hermit before doctrines (should warn)
  G.S.x = 5; G.S.y = 5; await cmd('r'); await closeAll();
  check(G.S.map === 'seville', 'monk opens the Liber -> Seville');
  await cmd('b'); await wait(20);
  check(G.S.map === 'canterbury', 'B closes the book');
  // --- the abbey: catalogue, horarium, circator, loan and copy
  G.talk(ent(e => e.id === 'armarius')); await say('CATALOGUE'); G.closeModal();
  check(G.has('catalogue'), 'armarius hands over the catalogue');
  L.Magic.readItem(G.S.inv.find(i => i.id === 'catalogue')); await wait();
  check(/press X/.test(modal().textContent) && /master of novices/.test(modal().textContent), 'catalogue lists presses and books kept elsewhere');
  G.closeModal();
  // Lent: rest until the book-day, take one book for the year from the chapter house
  try { localStorage.removeItem('liber_bones'); } catch (e) { }
  await cmd('h'); await pick(/until Lent/);
  check(L.Story.lentOpen() && G.visible(ent(e => e.id === 'lent_books')), 'Lent: the collection is laid out in the chapter house (day ' + G.day() + ')');
  G.S.x = 15; G.S.y = 5; await cmd('r'); await pick(/Commentary on the Timaeus/);
  check(G.S.doctrines.calcidius === 'allotted' && G.doctrine('calcidius'), 'Lent book-day: Calcidius allotted for the year');
  // Vespers: brothers go to choir
  while (G.hour() !== 18) G.pass(60, true);
  G.pass(5, true);
  const arm = ent(e => e.id === 'armarius');
  check(arm.x === arm.office[0] && arm.y === arm.office[1] && /Vespers/.test(L.Story.hourName()), 'horarium: at Vespers the armarius is in choir (' + L.Story.hourName() + ')');
  // lectio: prior walks the library; reading press X under his eye costs his regard
  while (!L.Story.lectio()) G.pass(60, true);
  G.pass(5, true);
  const pr0 = G.S.stats.prior || 0;
  G.S.x = 10; G.S.y = 2; L.Story.readDoctrine(ent(e => e.doctrine === 'asclepius')); await closeAll();
  check((G.S.stats.prior || 0) >= pr0 + 30, 'reading the collectiones during lectio: the circator sees (prior ' + G.S.stats.prior + ')');
  for (const d of ['timaeus', 'martianus', 'macrobius']) { L.Story.readDoctrine(ent(e => e.doctrine === d)); await closeAll(); }
  // Apuleius on loan from the master of novices
  G.talk(ent(e => e.id === 'novicemaster')); await say('APULEIUS'); G.closeModal();
  L.Magic.readItem(G.S.inv.find(i => i.id === 'book_apuleius')); await closeAll();
  check(G.doctrine('apuleius') === 'borrowed', 'Apuleius read on loan');
  G.S.x = 5; G.S.y = 5; await cmd('m');
  check(G.S.doctrines.apuleius === 'copied', 'copied at the carrel: libri de acquisicione sua');
  G.talk(ent(e => e.id === 'novicemaster')); await say('RETURN'); G.closeModal();
  check(!G.has('book_apuleius') && G.doctrine('apuleius'), 'book returned, doctrine kept');
  check(Object.keys(L.DOCTRINES).every(d => G.doctrine(d)), 'all six doctrines held');
  await cmd('i');
  check(/Thomas reads about such things/.test(lastLog()), 'the monk has no Invoke verb');
  await cmd('b'); await closeAll();
  check(G.S.map === 'seville', 'B reopens at Seville');
  check(!G.has('catalogue'), 'each reader has their own things: the catalogue stayed in the abbey');
  // Seville: take stylus/dinars, buy, vision
  G.give('stylus'); G.give('dinar', 60);
  const merch = ent(e => e.id === 'merchant');
  G.talk(merch); await say('BUY'); await wait(60);
  await pick(/silver/); await pick(/lead/); await pick(/tin/); await pick(/iron/); await pick(/gold/); await pick(/copper/); await pick(/quicksilver/); G.closeModal();
  check(G.has('silver') && G.has('lead') && G.has('quicksilver'), 'bought metals through the shop');
  G.S.x = 38; G.S.y = 11; G.step(1, 0);
  check(G.S.map === 'seville', 'east gate refuses before the vision: ' + lastLog());
  G.S.x = 3; G.S.y = 3; await cmd('h'); await closeAll();
  check(G.flag('vision'), 'sleeping in bed gives the vision');
  G.S.x = 38; G.S.y = 11; G.step(1, 0); await closeAll();
  check(G.S.map === 'desert', 'out through the east gate to the desert');
  ['shoes', 'parchment', 'myrtle', 'mirror', 'incense', 'incense', 'incense', 'incense', 'incense', 'incense', 'incense', 'incense', 'incense', 'incense', 'incense', 'bread', 'bread'].forEach(i => G.give(i));
  // Moon: night, a lunar spirit, characters, make, vivify in Moon's hour
  G.S.x = 30; G.S.y = 21;
  while (!G.night()) G.pass(60, true);
  for (let i = 0; i < 40 && !ent(e => e.planet === 'moon'); i++) G.pass(5, true);
  const moon = ent(e => e.planet === 'moon');
  check(!!moon, 'a lunar spirit comes at night');
  G.talk(moon); const r = await say('CHARACTERS'); G.closeModal();
  check(G.S.chars.moon, 'lunar spirit teaches characters: ' + r.slice(0, 50));
  await cmd('m'); await pick(/inscribed shoes/);
  check(G.has('img_moon'), 'made inscribed shoes');
  while (G.night()) G.pass(60, true); while (!G.night()) G.pass(60, true);
  await toHour('Moon');
  // put a lunar spirit adjacent
  // a lunar spirit beside you (nocturnal ones leave at dawn, so pin one here for the test)
  const spot = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [G.S.x + dx, G.S.y + dy]).find(([x, y]) => G.passable(x, y));
  G.addEnt({ kind: 'spirit', planet: 'moon', rank: 'legion', x: spot[0], y: spot[1], hx: spot[0], hy: spot[1], frozenForTest: true });
  await cmd('v'); await pick(/inscribed shoes/);
  check(G.has('lunar_shoes'), 'vivified the lunar shoes: ' + lastLog(2));
  // wrong hour test on Saturn later. Mercury via invoke on its hour
  // purity: an impure invoker gets a grudging spirit
  G.S.stats.purity = 0; await toHour('Mercury'); await cmd('i'); await pick(/Mercury/);
  const grudging = L.Spirits.attendant('mercury');
  check(grudging && !grudging.willing, 'impure invocation: the delegated spirit comes unwilling');
  L.Spirits.remove(grudging); G.S.stats.purity = 10;
  // discernment: an unknown saturnine spirit at the bone field
  G.goto('desert', 9, 23); await closeAll();
  for (let i = 0; i < 5 && !ent(e => e.planet === 'saturn' && !L.Spirits.isKnown(e)); i++) G.pass(5, true);
  const sat = ent(e => e.planet === 'saturn' && e.rank === 'legion');
  check(sat && !L.Spirits.isKnown(sat) && L.Spirits.name(sat) === 'an unknown spirit', 'bone-field spirit starts unknown');
  G.look(sat.x, sat.y); await pick(/Mars/);
  check(!L.Spirits.isKnown(sat), 'wrong name: still unknown (' + lastLog().slice(0, 40) + ')');
  G.look(sat.x, sat.y); await wait();
  check(!/Jupiter/.test(modal().textContent), 'no second guess in the same hour'); G.closeModal();
  G.pass(60, true); G.look(sat.x, sat.y); await pick(/Saturn/);
  check(G.S.known.saturn && L.Spirits.isKnown(sat), 'discerned by behaviour: all saturnines now known');
  G.goto('desert', 30, 21); await closeAll();
  async function planet(p, name, imgRe) {
    G.S.stats.purity = 10;
    await toHour(name);
    await cmd('i'); await pick(new RegExp(name));
    const sp = L.Spirits.attendant(p);
    check(!!sp, `invoked ${name}: a delegated spirit attends (${lastLog(1).slice(0, 60)})`);
    G.talk(sp); await say('CHARACTERS'); G.closeModal();
    await cmd('m'); await pick(imgRe);
    G.S.stats.flesh = 100;
    if (G.hourRuler() !== p) await toHour(name);
    await cmd('v'); await pick(imgRe);
    check(G.S.fellowship[p], `fellowship with ${name}: ${lastLog(1).slice(0, 80)}`);
  }
  await planet('mercury', 'Mercury', /inscribed parchment/);
  await planet('venus', 'Venus', /inscribed myrtle/);
  // Sun: peony must be taken in the Sun's hour
  G.goto('desert', 55, 32);
  await toHour('Mars'); L.Magic.get(55, 32);
  check(!G.has('peony'), 'peony refused outside the Sun’s hour');
  await planet('sun', 'Sun', /gilt mirror/);
  await toHour('Sun'); L.Magic.get(55, 32);
  check(G.has('peony'), 'peony taken in the hour of the Sun');
  // Jupiter cannot be conjured
  await cmd('c'); await pick(/Jupiter/);
  check(/conscious of no conjurations/.test(lastLog()), 'Jupiter refuses conjuration');
  await planet('mars', 'Mars', /engraved iron/);
  await planet('jupiter', 'Jupiter', /engraved tin/);
  // Saturn: vivify at the wrong hour -> the spirit returns
  await toHour('Saturn'); await cmd('i'); await pick(/Saturn/);
  G.talk(L.Spirits.attendant('saturn')); await say('CHARACTERS'); G.closeModal();
  await cmd('m'); await pick(/cast lead/);
  await toHour('Venus');
  await cmd('v'); await pick(/cast lead/);
  check(!G.S.fellowship.saturn && !L.Spirits.attendant('saturn'), 'wrong hour: spirit leaves, no image: ' + lastLog(1).slice(0, 70));
  await planet('saturn', 'Saturn', /cast lead/);
  check(Object.keys(G.S.fellowship).length === 7, 'seven images ensouled');
  // wear things
  for (const id of ['lunar_shoes', 'saturn_amulet', 'apollo_mirror']) L.Magic.wear(G.S.inv.find(e => e.id === id));
  check(G.wearing('lunar_shoes') && G.wearing('apollo_mirror'), 'wearing shoes and holding the mirror');
  // William's floor: blighting the oasis ratchets it; prayer cannot go beneath; Jupiter lowers it
  G.S.stats.suspicion = 10;
  G.goto('desert', 33, 37); await closeAll();
  L.Magic.use(G.S.inv.find(e => e.id === 'mars_ward')); await pick(/barren/);
  const fl = G.S.stats.floor;
  check(fl >= 20 && G.flag('barren'), 'barrenness raises the floor of suspicion to ' + fl);
  for (let i = 0; i < 12; i++) { G.pass(60, true); L.Magic.pray(); }
  check(G.S.stats.suspicion >= fl, 'prayer cannot go beneath the floor (' + G.S.stats.suspicion + ' >= ' + fl + ')');
  const rdw = ent(e => e.id === 'reader');
  check(rdw.y > 12, 'the Reader walked from his camp toward the blighted oasis (now at ' + rdw.x + ',' + rdw.y + ')');
  G.goto('desert', 33, 8); await closeAll();
  const rd = ent(e => e.id === 'reader'); G.S.x = rd.x; G.S.y = rd.y + 1;
  L.Magic.use(G.S.inv.find(e => e.id === 'jupiter_image'));
  await wait();
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp' })); await wait();  // answer the direction prompt: north, at the Reader
  check(G.S.stats.floor < fl, 'the image of Jupiter lowers the floor (' + fl + ' -> ' + G.S.stats.floor + ')');
  G.S.stats.suspicion = 20; G.S.stats.floor = 0;
  // William, the elements
  G.goto('desert', 33, 8); await closeAll();
  G.talk(ent(e => e.id === 'reader')); await say('STONES'); const arg = await say('CALCIDIUS'); G.closeModal();
  check(G.flag('william_twelve'), 'the Reader tells of the twelve orders; Calcidius: ' + arg.slice(0, 40));
  for (const el of ['earth', 'water', 'fire', 'air']) { L.Story.shrine(ent(e => e.element === el)); await closeAll(); }
  check(['earth', 'water', 'fire', 'air'].every(e => G.S.orders[e] === 'WILLIAM'), 'four elemental orders known, tagged WILLIAM');
  // Ascent
  G.S.stats.remembrance = 100;
  G.goto('desert', 30, 20); await cmd('e'); await closeAll();
  for (const p of L.ASCENT) {
    check(G.S.map === 'sphere_' + p, 'in sphere ' + p);
    const ruler = ent(e => e.rank === 'ruler');
    G.talk(ruler); const q = await say('PASS'); const a = await say(L.PLANETS[p].answer[0]); G.closeModal();
    check(G.S.passed[p], `${p}: Q "${q.slice(0, 40)}" -> ${a.slice(0, 40)}`);
    if (p === 'urania') break;
    G.S.x = 12; G.S.y = 1; await cmd('e'); await closeAll();
  }
  G.S.x = 12; G.S.y = 2; await cmd('e'); await closeAll();
  check(G.flag('written') && G.has('liber_written'), 'the seat: the book is written, and must be carried down (§6)');
  for (let i = 0; i < 8; i++) { G.S.x = 12; G.S.y = 23; await cmd('e'); await closeAll(); }
  check(G.S.map === 'desert', 'carried the book down through all eight spheres');
  const rdEnd = ent(e => e.id === 'reader');
  check(rdEnd.x === 31 && rdEnd.y === 24, 'the Reader waits at the foot of the hermitage');
  G.S.x = 30; G.S.y = 23;
  L.Magic.use(G.S.inv.find(e => e.id === 'liber_written')); await pick(/Reader/);
  for (let i = 0; i < 4; i++) { await pick(/continue|begin/); }
  check(G.S.map === 'mortlake', 'Explicit: to Mortlake');
  await pick(/§23/); await pick(/mirror of Apollo/); await pick(/§37/);
  check(/Dee wrote/.test(modal().textContent) && (modal().textContent.match(/✎ Dee/g) || []).length === 3, 'marginalia: your underlining set beside Dee’s');
  await pick(/continue/);
  await pick(/day and the hour/); await pick(/E.K. said/); await pick(/blank/);
  let pages = 0; while (modal().classList.contains('show') && pages < 10) { pages++; modal().querySelector('.mopts button').click(); await wait(20); }
  check(G.flag('ended') && document.getElementById('title').style.display === 'flex', `ending played, back to title`);
  const bones = JSON.parse(localStorage.getItem('liber_bones') || '[]');
  check(bones.length === 1 && bones[0].choice === 'reader' && bones[0].underlined.length === 3, 'the reading is saved as a gloss for the next reader');
  // a new game: Thomas finds the previous reading's gloss in the margin
  document.getElementById('t-new').click(); await wait(); await closeAll();
  G.S.x = 5; G.S.y = 4; await cmd('r'); await closeAll();
  G.S.x = 5; G.S.y = 5; await cmd('r'); await wait();
  check(/In the margin of fol. 169r/.test(modal().textContent), 'next run: the gloss is in the margin of fol. 169r');
  await closeAll();
  console.log(log.join('\n')); console.log('ERRORS', errs);
  window.__result = { log, errs };
} catch (ex) { window.__result = { log, errs, thrown: String(ex), where: L.G.S.logs.slice(-4).map(l => l[0]) }; } })();
