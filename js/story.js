// The three readers, the vision, the ascent, arrest, the codex, the endings.
window.L = window.L || {};
(function () {
  const G = L.G, P = L.PLANETS;
  const St = L.Story = {};
  const S = () => G.S;
  const tag = t => `<span class="tag tag-${t}">${t}</span>`;

  // ------------------------------------------------------------ the frame
  St.intro = function () {
    G.story([
      `<p class="big">Liber de essentia spirituum</p><p class="c">The Book of the Essence of Spirits</p>
       <p>One copy survives, and it is incomplete: Oxford, Corpus Christi College MS 125, fols. 169r–173r. It is anonymous and probably twelfth-century. The author says he lived thirty years in deserted places in the fellowship of spirits.</p>
       <p class="small">Three people read this book, and you will be each of them in turn.</p>`,
      `<p><b>Mortlake, 1582.</b> You are <b>John Dee</b>. On your desk lies a thick manuscript that once belonged to St Augustine’s Abbey, Canterbury. It came to you after the monasteries were dissolved.</p>
       <p>Somewhere in it, a monk marked a book about spirits. You mean to find out why.</p>
       <p class="small">Arrows move. Click to walk. Stand by the desk and press <kbd>R</kbd>, or click the book. <kbd>?</kbd> lists every command.</p>`,
    ], () => G.redraw(), 'Prologue');
  };
  St.enterMonk = function () {
    G.story([
      `<p>Fol. 169r. The hand is late thirteenth-century and small. In the margin, in ink three hundred years fresher, you will one day write <i>Duodecim ordines spirituum</i>, “twelve orders of spirits.”</p>
       <p>For now you read the first line, and the book reads you back to the house it was written in.</p>`,
      `<p><b>St Augustine’s, Canterbury, c.1315.</b> You are <b>Thomas Sprot</b>, also called Thomas of Willesborough, a monk of this house, and lately an envoy of the abbey to the archbishop.</p>
       <p>The new miscellany is on your carrel in the library. Before you open it, the armarius would tell you to read what it assumes: the Platonic books on the shelves. Each one you read will go with you into the book.</p>
       <p>You have compiled a volume of your own: medicine, animals, and fourteen quires of images and spirits. At fol. 169 it holds the Book of the Essence of Spirits.</p><p class="small">The library keeps its books in numbered presses. Ask the armarius for the CATALOGUE; not every book is in the library room. The brothers keep the Hours: at the Office they are in choir, and in the hours of lectio the prior walks the library. <kbd>R</kbd> reads a shelf you stand beside. The Liber is on your carrel.</p>`,
    ], () => { G.goto('canterbury', 5, 5); G.set('monk'); }, 'The first reader');
  };
  St.readDoctrine = function (e) {
    const s = S(), d = L.DOCTRINES[e.doctrine];
    if (G.doctrine(e.doctrine) && s.doctrines[e.doctrine] !== 'borrowed') { G.log(`You have read ${d.short}.`); return; }
    if (e.restricted) {
      const prior = G.ents().find(n => n.id === 'prior');
      if (prior && prior.x <= 11 && prior.y <= 7) {
        G.stat('prior', 30);
        G.log('The prior, walking the library as circator, sees which press you have opened. He says nothing, which is worse. (Prior +30)', 'bad');
      } else G.log('The library is empty. No one sees which press you open.', 'good');
    }
    s.doctrines[e.doctrine] = true;
    G.pass(60);
    if (e.doctrine === 'macrobius') G.stat('remembrance', 5);
    const blurbs = {
      timaeus: 'The world is a living creature with a soul stretched through it, and the heavens are its visible order: the Moon lowest, then Mercury, Venus, the Sun, Mars, Jupiter, Saturn, and the fixed sphere above them.',
      calcidius: 'Between God and us there are beings of ether and air. They are not devils, but ministers, and their natures are fitted to their places.',
      apuleius: 'Daimones are in their nature animals, in genus rational, in mind passible, in body aerial, in time eternal. Because they feel, they can hear us.',
      asclepius: 'Hermes tells Asclepius that men once learned to make gods: statues ensouled, conscious and filled with spirit, drawing down the souls of daimones into images.',
      macrobius: 'The soul descends from the Milky Way through the gate of Cancer and through each planet in turn, drinking forgetfulness as it falls.',
      martianus: 'Philology is raised to heaven to marry Mercury, the god of speech, and all the arts come to the wedding.',
    };
    G.story([`<p class="big">${d.g} ${d.name}</p><p>${blurbs[e.doctrine]}</p><p class="good">Doctrine gained: ${d.effect}</p>`], () => G.redraw(), 'Reading');
  };
  St.enterHermit = function () {
    const s = S();
    if (s.flags.inBook && s.hermitPos) {
      G.log('You open the quire again where you left it.', 'sky');
      G.goto(s.hermitPos.map, s.hermitPos.x, s.hermitPos.y);
      return;
    }
    const missing = ['asclepius', 'apuleius', 'timaeus'].filter(d => !G.doctrine(d)).map(d => L.DOCTRINES[d].short);
    G.story([
      `<p class="c small">Incipit liber de essentia spirituum</p>
       <p>“…reigning in the kingdom of the flesh in Seville,” the book begins, and a form of a kingdom appears to its author (§1).</p>
       ${St.glossHtml()}
       <p>Thomas reads on, and the carrel falls away.</p>`,
      `<p><b>Seville.</b> You are the one who will write this book, though you do not know it yet. You have a warm house, a full table, a steward, and money.</p>
       <p>People around you are held in the <i>yoke of mixed slavery</i>, spending their days in passing pleasures and dragged far from true blessedness (§2). So are you.</p>
       ${missing.length ? `<p class="bad small">Thomas has not read: ${missing.join(', ')}. You will feel the lack. Press <kbd>B</kbd> at any time to close the book and return to the library.</p>` : ''}
       <p class="small">Your stylus and your dinars are in this room. The market is south of the palace garden. Sleep in your bed (<kbd>H</kbd> on it) when you are ready.</p>`,
    ], () => { s.flags.inBook = true; G.goto('seville', 3, 3); }, 'The second reader');
  };
  St.book = function () {
    const s = S();
    if (s.layer === 'dee') { G.log('You have not opened it yet. The manuscript is on the desk.'); return; }
    if (s.layer === 'hermit') {
      if (s.map === 'prison') { G.log('The book will not close on a prisoner. Escape first.'); return; }
      s.hermitPos = { map: s.map, x: s.x, y: s.y };
      G.log('Thomas closes the quire and blinks at the candle. The Sevillan waits between the leaves.', 'sky');
      G.goto('canterbury', 5, 5);
      return;
    }
    if (s.layer === 'monk') {
      if (!s.flags.inBook) { G.log('Open the Liber at your carrel first.'); return; }
      St.enterHermit();
    }
  };
  St.exitRefusal = function (need) {
    if (need === 'vision') return 'The gatekeeper: “No one goes out to the desert without a reason, my lord.” You have had no vision yet. Sleep in your own bed.';
    return 'You cannot go that way yet.';
  };
  St.vision = function () {
    const s = S();
    if (s.flags.vision) { G.log('You sleep in comfort, and dream of sand.'); G.pass(360, true); G.stat('flesh', 10); return; }
    G.set('vision');
    const h = G.hour(); const mins = ((6 - h + 24) % 24 || 24) * 60 - (s.min % 60);
    G.story([
      `<p>You sleep, and a form of a kingdom appears to you. It shows that what seemed to exist had existed, and no longer does (§1).</p>
       <p>Behind the city, the house and the table you glimpse something that is not changed by anything. Beside it, everything you own is a shadow.</p>`,
      `<p>You wake knowing you fell from somewhere, and that there are “numbers of the resolution to be completed” before you can return to it (§5).</p>
       <p>You will go to <b>places deserted of every inhabitant</b> (§6). The east gate will open for you.</p>
       <p class="small">Buy what the work will need before you go: shoes and silver for the Moon, lead, tin, iron, incense. The caravan in the desert sells the same things, at the same prices.</p>`,
    ], () => { G.pass(mins, true); G.log('It is morning. The east gate stands open.', 'sky'); G.redraw(); }, 'The vision');
  };
  St.onEnter = function (mapId) {
    const s = S();
    if (mapId === 'desert' && !s.flags.desert) {
      s.flags.desert = true;
      G.story([
        `<p>Deserted places. You will be here for thirty years, and your companions will be spirits (§6).</p>
         <p>Your hermitage is a cave to the east of the road. There is an altar in it, and a place where the light stands upright: <b>the image of true light</b>. It will not bear you up yet.</p>`,
        `<p><b>How the work goes.</b></p>
         <p>1. By night the <b>rotators of the Moon</b> ☽ come to anyone. <b>T</b>alk to one and ask for its CHARACTERS.</p>
         <p>2. <b>M</b>ake an image: its matter, its characters, and your stylus.</p>
         <p>3. <b>V</b>ivify it in the planet’s own hour, with a spirit of its order beside you. You need harmonious matter, an obedient spirit, and helping symmetry (§37). <b>H</b> rests until any hour you name.</p>
         <p>4. For the other planets, <b>I</b>nvoke the ruler with incense on its day or hour. It will not come itself, but it delegates a spirit to you (§23).</p>
         <p>5. Then climb. Stand on the light and press <b>E</b>.</p>
         <p class="small"><kbd>J</kbd> is the codex. It keeps everything you have learned, with where it comes from.</p>`,
      ], () => G.redraw(), 'The deserted places');
    }
    const sp = L.MAPS[mapId] && L.MAPS[mapId].sphere;
    if (sp) { s.known = s.known || {}; s.known[sp] = true; }
    if (sp && !s.flags['seen_' + sp]) {
      s.flags['seen_' + sp] = true;
      const PP = P[sp];
      G.story([`<p class="big">${PP.g} ${L.MAPS[mapId].name}</p><p>${PP.gift}</p>
        ${L.MAPS[mapId].provenance === 'MS' ? '' : `<p class="small torn">The manuscript’s account of how this order descends is lost. This sphere is built from the planetary ages (§24–33) and marked as reconstruction.</p>`}
        ${sp === 'sun' ? '<p class="small">The ruler here lives in light. Without the mirror of Apollo you will see only the sphere.</p>' : ''}
        ${sp === 'mars' ? '<p class="small">The pre-elect make war on each other, and on you, unless you wear their characters.</p>' : ''}
        ${sp === 'saturn' ? '<p class="small">Near a saturnine spirit, time runs out through your fingers, unless you wear Saturn’s own amulet.</p>' : ''}
        <p class="small">The ruler waits at the centre. Talk to it and say PASS.</p>`], () => G.redraw(), 'Ascent');
    }
  };

  // ------------------------------------------------------------ the ascent
  function canEnter(p) {
    const s = S(), PP = P[p];
    if (s.stats.remembrance < PP.remember) { G.log(`You cannot rise to ${PP.name}. Your soul remembers too little of where it came from (Remembrance ${s.stats.remembrance}/${PP.remember}). Fast, pray, gaze at the stars, ensoul images.`, 'bad'); return false; }
    return true;
  }
  St.ascend = function () {
    const s = S();
    if (!G.doctrine('timaeus')) { G.log('You stand in the light and do not know which way is up. (Thomas has not read the Timaeus.)', 'bad'); return; }
    const target = s.highest || 'moon';
    if (!canEnter(target)) return;
    G.sfx('rise');
    G.log('The image of true light takes you up.', 'sky');
    G.goto('sphere_' + target, 12, 22);
    G.pass(60, true);
  };
  St.climb = function () {
    const s = S(), cur = G.map().sphere;
    if (!s.passed[cur]) { G.log('The way up is closed. Speak with the ruler (T, then PASS).', 'bad'); return; }
    const next = L.ASCENT[L.ASCENT.indexOf(cur) + 1];
    if (!next || !canEnter(next)) return;
    s.highest = next;
    G.sfx('rise');
    G.goto('sphere_' + next, 12, 22);
  };

  // ------------------------------------------------------------ William and the elements
  St.williamBook = function () {
    const s = S();
    G.set('william_twelve');
    G.story([
      `<p class="big">De universo</p><p class="small">William of Auvergne, bishop of Paris. The quire is from a work that will be written between 1231 and 1236.</p>
       <p>He knows your book, and he has read more of it than has survived. He reports that it sets out <b>twelve orders</b> of spirits: <b>four elemental</b>, <b>seven planetary</b>, and <b>one for Urania</b>.</p>
       <p>He objects that these beings live in deserts, come down, answer magical prayers, have no angelic names, and are sorted by planet and element. He calls it idolatry of the planets and says its author founded schools of necromancy.</p>`,
      `<p>So the part of your cosmos that your own book lost, you now hold only through its enemy.</p>
       <p class="small">The elemental stones can now be read. There is earth in a cave to the southwest, water in a spring to the east, fire among the vents to the south, and air on the high rock beyond the dune sea. Each is marked ${tag('WILLIAM')} in the codex.</p>`,
    ], () => G.redraw(), 'The Reader’s quire');
  };
  St.shrine = function (e) {
    const s = S(), el = e.element, E = L.ELEMENTS[el];
    if (!s.flags.william_twelve) { G.log('An old standing stone. Something moves here that your book does not name. (The Liber’s account of the elemental orders is lost. Someone else may have read it.)'); return; }
    if (s.orders[el]) { G.log(`The stone of ${E.name} ${E.g}. You know its order, as William knew it.`); return; }
    s.orders[el] = 'WILLIAM';
    G.pass(30); G.stat('remembrance', 3);
    G.story([`<p class="big">${E.g} The order of ${E.name}</p><p>${L.ORDER_TEXT[el]}</p><p class="small">${tag('WILLIAM')} Known only from William’s hostile testimony.</p>`], () => G.redraw(), 'One of the twelve');
  };

  // ------------------------------------------------------------ arrest
  St.arrest = function () {
    const s = S();
    if (s.map === 'prison' || !s.flags.inBook || s.layer !== 'hermit') return;
    s.stats.suspicion = 100;
    G.story([`<p>Men come in the night with a letter from Paris that has not been written yet. Your images are named demons, your hermitage a school of necromancy.</p>
      <p>They take you to the tower of the condemned.</p>
      <p class="small">Ways out: the peony of Apollo escapes deadly places (§29). The image of Jupiter pleases the hearts of the powerful (§26). Or wait (<kbd>H</kbd>), and lose years.</p>`],
      () => { G.goto('prison', 4, 2); G.redraw(); }, 'Arrest');
  };
  St.release = function (peony) {
    const s = S();
    s.stats.suspicion = peony ? 60 : 50;
    G.log(peony ? 'You walk out through a door no one remembers opening.' : 'The gaoler lets you out and does not look back.', 'good');
    G.goto('desert', 8, 8);
  };
  St.waitPrison = function () {
    const s = S();
    G.pass(3 * 1440, true);
    G.stat('remembrance', -10);
    s.stats.flesh = 40;
    G.log('Three days of bread and water. Paris cannot decide what you are, and in the end it forgets you.', 'bad');
    St.release(true);
  };

  // ------------------------------------------------------------ the horarium (St Augustine's)
  const OFFICES = [[2, 'Matins'], [5, 'Lauds'], [6, 'Prime'], [9, 'Terce'], [12, 'Sext'], [15, 'None'], [18, 'Vespers'], [20, 'Compline']];
  const LECTIO = [7, 8, 10, 11, 13, 14];
  St.office = () => { const h = G.hour(), m = S().min % 60; const o = OFFICES.find(o => o[0] === h); return o && m < 45 ? o[1] : null; };
  St.lectio = () => !St.office() && LECTIO.includes(G.hour());
  St.hourName = () => {
    const o = St.office(); if (o) return `♪ ${o}: the brothers are in choir`;
    if (St.lectio()) return '📖 lectio divina: the prior walks the library';
    const h = G.hour(); return (h >= 21 || h < 2) ? '… the great silence' : 'work and meals';
  };
  St.horarium = function () {
    const s = S();
    const o = St.office(), lec = St.lectio();
    const phase = o || (lec ? 'lectio' : 'free');
    if (s.flags.hphase !== phase) {
      if (o) G.log(`The bell rings for ${o}.`, 'sky');
      else if (lec) G.log('The hours of lectio. The prior begins his round of the library.', 'sky');
      if (o === 'Compline' && G.has('book_apuleius')) { G.stat('prior', 10); G.log('At Compline the master of novices looks for his Apuleius, and then at you. (Prior +10. Talk to him: RETURN.)', 'bad'); }
      s.flags.hphase = phase;
    }
    const lent = G.ents().find(e => e.id === 'lent_books'); if (lent) lent.hidden = !St.lentOpen();
    if (St.lentOpen() && !s.flags.lentAnnounced) { s.flags.lentAnnounced = true; G.log('The beginning of Lent: the library’s books are laid out in the chapter house.', 'sky'); }
    for (const n of G.ents().filter(n => n.kind === 'npc')) {
      const tgt = o && n.office ? n.office : (lec && n.lectio ? n.lectio : [n.hx, n.hy]);
      if ((n.x !== tgt[0] || n.y !== tgt[1]) && !(s.x === tgt[0] && s.y === tgt[1])) { n.x = tgt[0]; n.y = tgt[1]; }
    }
    if ((s.stats.prior || 0) >= 100 && !s.flags.confining) St.confine();
  };
  St.confine = function () {
    const s = S(); s.flags.confining = true;
    G.story(['<p>The prior has seen enough. He takes the quire from your carrel "for safekeeping" and sets you a day of silence in the dormitory.</p><p class="small">St Augustine’s answers to no bishop, so Paris cannot touch you. The prior can.</p>'], () => {
      G.goto('canterbury', 14, 21); G.pass(1440, true); s.stats.prior = 40; s.flags.confining = false; G.log('A day of silence. The quire is back on your carrel.', 'sky'); G.redraw();
    }, 'Confined');
  };
  St.catalogue = function () {
    const row = (a, b) => `<tr><td>${a}</td><td>${b}</td></tr>`;
    G.modal({
      title: 'The catalogue of St Augustine’s', wide: true,
      html: `<p class="small">Presses (<i>distinctiones</i>) are numbered along the north wall of the library; each has shelves (<i>gradus</i>). Books of magic are shelved with the sciences, not hidden (Page).</p>
      <table class="tbl">${row('Plato, <i>Timaeus</i>, in Calcidius’ Latin', 'press IV')}${row('Calcidius, <i>Commentary on the Timaeus</i>', 'press V')}${row('Martianus Capella, <i>De nuptiis</i>', 'press VII')}${row('<i>Asclepius</i>, with the books of images', 'press X, the <i>collectiones</i>')}${row('Macrobius, <i>Commentary on the Dream of Scipio</i>', 'not in the library: <b>the refectory lectern</b>, read at meals')}${row('Apuleius, <i>De Platone, De deo Socratis, De mundo</i>', 'not in the library: <b>in the keeping of the master of novices</b>')}${row('Thomas of Willesborough, his volume (medicine; animals; images; <i>Liber de essentia spirituum</i> at fol. 169)', 'your carrel. At your death it goes to the precentor, who writes your name in it.')}</table>`,
      options: [{ label: 'close', fn: () => { } }],
    });
  };
  St.copy = function () {
    const s = S();
    const carrel = G.ents().find(e => e.carrel);
    if (!carrel || Math.max(Math.abs(carrel.x - s.x), Math.abs(carrel.y - s.y)) > 1) { G.log('Copying is done at your carrel.'); return; }
    const loans = Object.keys(s.doctrines).filter(k => s.doctrines[k] === 'borrowed' && G.has('book_' + k));
    if (!loans.length) { G.log('You have no borrowed book to copy. (What you read on the shelves stays with you; a borrowed book is yours only while you hold it.)'); return; }
    for (const k of loans) {
      s.doctrines[k] = 'copied';
      G.pass(180, true);
      G.log(`You copy what you need of ${L.DOCTRINES[k].short} into your own quire. What a brother copies with his own hand is his (libri de acquisicione sua). Now return the book.`, 'good');
    }
  };

  // ------------------------------------------------------------ the codex
  St.codex = function (tab) {
    const s = S();
    tab = tab || 'orders';
    let html = '';
    if (tab === 'orders') {
      html = `<p class="small">Twelve orders: four elemental, seven planetary, and Urania (§16; the full scheme per William). Dee wrote <i>Duodecim ordines spirituum</i> beside it.</p><table class="tbl">` +
        L.ORDERS.map(o => {
          const X = P[o] || L.ELEMENTS[o], known = s.orders[o];
          const src = known || (L.ELEMENTS[o] ? 'WILLIAM' : (['jupiter', 'saturn', 'urania'].includes(o) ? 'MS' : 'MS-ages'));
          const text = L.ELEMENTS[o] ? L.ORDER_TEXT[o] : X.gift;
          return `<tr class="${known ? '' : 'dim'}"><td style="color:${X.color}">${X.g} ${X.name}</td><td>${known ? '✓' : '·'}</td><td>${tag(src)}</td><td class="small">${known ? text : '—'}</td></tr>`;
        }).join('') + '</table>';
    } else if (tab === 'planets') {
      html = `<table class="tbl"><tr><th></th><th>day</th><th>matter</th><th>the operation</th></tr>` +
        L.CHALDEAN.map(p => { const PP = P[p]; const day = L.WEEKDAY[L.DAY_RULER.indexOf(p)]; return `<tr><td style="color:${PP.color}">${PP.g} ${PP.name}</td><td>${day}</td><td>${PP.metal} ${tag('RECON')}</td><td class="small">${PP.op}${s.chars[p] ? ' <b>Characters known.</b>' : ''}${s.fellowship[p] ? ' <b>Fellowship.</b>' : ''}</td></tr>`; }).join('') +
        `</table><p class="small">Planetary hours follow the Chaldean order ♄♃♂☉♀☿☽. The first hour after sunrise (06:00) belongs to the ruler of the day. ℞ means retrograde: its spirits fall readily and bind firmly (§36).</p>`;
    } else if (tab === 'discern') {
      html = `<p class="small">The discernment of spirits. The Liber teaches that each order is known by how it descends and behaves; William answers that all of them are demons. Look (L, or right-click) at an unknown spirit and name its order.</p><table class="tbl">` +
        L.CHALDEAN.map(p => `<tr class="${(s.known || {})[p] ? '' : 'dim'}"><td style="color:${P[p].color}">${P[p].g} ${P[p].name}</td><td>${(s.known || {})[p] ? '✓' : '·'}</td><td class="small">${L.Spirits.CLUES[p][0]} (${L.Spirits.CLUES[p][1]})</td></tr>`).join('') + '</table>';
    } else if (tab === 'notes') {
      html = L.CODEX_INTRO.map(([h, t, g]) => `<h3>${h} ${tag(g)}</h3><p>${t}</p>`).join('');
    } else {
      html = Object.keys(L.DOCTRINES).map(d => `<p class="${s.doctrines[d] ? '' : 'dim'}">${L.DOCTRINES[d].g} <b>${L.DOCTRINES[d].name}</b>${s.doctrines[d] ? ': ' + L.DOCTRINES[d].effect : ' (unread)'}</p>`).join('');
    }
    G.modal({
      title: 'J — Codex', wide: true, html,
      options: [
        { label: 'the twelve orders', fn: () => St.codex('orders') },
        { label: 'planets & operations', fn: () => St.codex('planets') },
        { label: 'discernment of spirits', fn: () => St.codex('discern') },
        { label: 'notes on the text', fn: () => St.codex('notes') },
        { label: 'doctrines', fn: () => St.codex('doctrines') },
      ],
    });
  };

  // ------------------------------------------------------------ the end
  // ------------------------------------------------------------ the seat, and the return (§6)
  St.seat = function () {
    const s = S();
    if (!s.passed.urania) { G.log('An empty seat. Your companions have not yet invited you to it. (Talk to the ruler of Urania; say PASS.)'); return; }
    if (s.flags.written) { G.log('You have sat, and written. Now carry the book down, as the author did, to the worthy (§6). (Take the way down, south.)'); return; }
    G.story([
      `<p>Your companions, who have become companions of your blessedness, invite you to your empty seat (§6).</p>
       <p>You sit. Below you the spheres turn, and inside each one a legion delegated by its ruler goes down into lead, tin, shoes and peonies, the way your own soul once went down into a body.</p>`,
      `<p>You write it down, so that in the shadow of darkness a small light may shine (§6). You write about the essence of the spirits and their double embodying. You write about the saturnine, who descend gloomy in an earthy cloud. You write about the worshippers of Jupiter, who run back lightly to their roots…</p>
       <p>And then, as the author did, you get up again. The book is not for the seat. It is for “their common survival”, to be given to whoever is worthy (§6). You were made, he says, a shoot benefiting others.</p>
       <p class="small">Carry the book down through the spheres. Each legion attends you on the way. At the bottom, decide who receives it.</p>`,
    ], () => { s.flags.written = true; G.give('liber_written'); G.log('You carry the book you have written. Go down (the way south), sphere by sphere.', 'sky'); G.redraw(); }, 'The seat');
  };
  // Going down with the book: each D leads to the sphere below; the Moon's leads to the desert.
  St.descend = function () {
    const s = S(), cur = G.map().sphere;
    if (s.flags.written && cur) {
      const i = L.ASCENT.indexOf(cur);
      if (i > 0) { G.log(`You come down into the sphere of ${P[L.ASCENT[i - 1]].name}, and its legion comes to meet you.`, 'sky'); G.goto('sphere_' + L.ASCENT[i - 1], 12, 2); return; }
      G.log('You come down into the deserted places, with the book.', 'sky');
      G.goto('desert', 30, 20);
      const r = G.ents('desert').find(e => e.id === 'reader');
      if (r) { r.x = 31; r.y = 24; }
      G.log('At the foot of the hermitage, the Reader from Paris is waiting. Of course he is.', 'william');
      return;
    }
    G.log('You come down, the way the spirits do.', 'sky'); G.goto('desert', 30, 20);
  };
  // Using the written book: who receives it
  St.transmit = function () {
    const s = S();
    const near = id => G.ents().find(e => e.id === id && Math.max(Math.abs(e.x - s.x), Math.abs(e.y - s.y)) <= 2);
    const opts = [];
    if (s.map === 'desert' && near('caravaneer')) opts.push({ label: 'Give it to the caravan, to carry west to the translators and the worthy', value: 'caravan' });
    if (s.map === 'desert' && near('reader')) opts.push({ label: 'Surrender it to the Reader from Paris', value: 'reader' });
    const t = G.terrainAt(s.x, s.y);
    if (s.map === 'desert' && Math.abs(s.x - 30) <= 4 && s.y >= 17 && s.y <= 21) opts.push({ label: 'Seal it in the hermitage wall, for no one', value: 'hidden' });
    if (!opts.length) { G.log('Who is worthy? Bring the book to the caravan at the oasis, or to the Reader, or back to your hermitage.'); return; }
    G.choose('Who receives the book?', opts, St.finale, '<p class="small">The author wrote for the worthy alone (§6). We know the book today because a copy reached Canterbury, and because William of Auvergne read it closely enough to attack it.</p>');
  };
  const TRANSMISSION = {
    caravan: '<p>The caravan carries the book west. It is copied in a city of translators, and copied again. One copy crosses the sea and ends up in a monk’s personal volume at Canterbury, between a treatise on poisons and a book of animal properties.</p>',
    reader: '<p>The Reader takes it without thanks. He will rebut it chapter by chapter in his <i>De universo</i>, and in rebutting it he preserves its shape: the twelve orders survive in his pages when the book’s own last leaves are lost. The critic becomes the book’s best witness.</p>',
    hidden: '<p>You seal the book in the hermitage wall. It is found, much later, by someone who could not have been looking for it, and copied by someone who did not understand it. It reaches Canterbury anyway. Books do.</p>',
  };
  const GLOSS = {
    theurgy: 'Here is a true vision of the spirits, and of the soul’s return.',
    necromancy: 'Caveat lector: this book made a school of necromancy.',
  };
  // The manuscript remembers earlier readings (after NetHack's bones: a later game finds what an earlier one left)
  St.bones = function () { try { return JSON.parse(localStorage.getItem('liber_bones') || '[]'); } catch (e) { return []; } };
  St.saveBones = function (b) { try { const all = St.bones(); all.push(b); localStorage.setItem('liber_bones', JSON.stringify(all.slice(-5))); } catch (e) { } };
  St.glossHtml = function () {
    const b = St.bones(); if (!b.length) return '';
    const last = b[b.length - 1];
    return `<p class="torn">In the margin of fol. 169r, in a hand that is not yours: <i>${GLOSS[last.ending]}</i></p>`;
  };

  const PASSAGES = [
    ['§6', 'Thirty years in deserted places; companions invite him to his empty seat.', false],
    ['§16', 'Everything that moves has spirits assigned to it. There are twelve orders.', true],
    ['§19', 'The ruler of Urania keeps his spirits from descending until the rotation is complete.', false],
    ['§23', 'Rulers are not called down by incantation; conjured, they delegate lower spirits by their legions.', true],
    ['§29a', 'The peony, taken in the hour of the Sun and addressed as friend of Apollo.', false],
    ['§29b', 'If a mirror of Apollo is made, you will live with those living in the light.', true],
    ['§37', 'Three things are needed: harmonious matter, an obedient spirit, helping symmetry.', false],
    ['§44', 'The saturnine spirit descends gloomy, divided in an earthy cloud.', false],
  ];
  const KELLEY = [
    ['A golden veil covers the whole stone. Then a woman appears, like an old maid in a red petticoat.', 'after the diary, 14 June'],
    ['A tall man with a great golden sceptre, his body all red, beams of light shooting from his head.', 'after the diary, 15 March 1582'],
    ['Kelley comes down from his prayers: Uriel says something is amiss in the table you worked on today.', 'after the diary, 19 March 1582'],
  ];
  St.finale = function (choice) {
    const s = S();
    G.take('liber_written');
    const ending = s.stats.suspicion < 50 ? 'theurgy' : 'necromancy';
    const bones = St.bones();
    G.story([
      TRANSMISSION[choice],
      `<p class="torn">…and in every copy the text stops at the same place: on fol. 173r, among Jupiter’s spirits swimming in the waters of the Lord, the page ends.</p>`,
      `<p><b>Canterbury.</b> Thomas turns the leaf. There is nothing after it: the scribe stopped, or his exemplar did.</p>
       ${St.glossHtml()}
       <p>Elsewhere in the same volume, a later hand begs whoever finds these words, through Christ, to reveal them only to a good and benevolent man, on peril of the finder’s soul and not the writer’s. Thomas understands why.</p>
       <p class="small">When Thomas dies, the precentor will write his name in the volume and shelve it in press X, with the collectiones.</p>`,
      `<p><b>Mortlake, 1582.</b> Dee has read to the end of fol. 173r. He dips his pen.</p><p class="small">Choose three passages to underline. Afterwards you will see what Dee himself marked.</p>`,
    ], () => { G.goto('mortlake', 6, 5); St.marginalia([], choice, ending); }, 'Explicit');
  };
  St.marginalia = function (picked, choice, ending) {
    if (picked.length < 3) {
      const left = PASSAGES.filter(p => !picked.includes(p[0]));
      G.choose(`Underline a passage (${picked.length + 1} of 3)`, left.map(p => ({ label: `${p[0].replace(/[ab]$/, '')} ${p[1]}`, value: p[0] })), k => St.marginalia(picked.concat([k]), choice, ending));
      return;
    }
    const s = S();
    s.flags.underlined = picked;
    const rows = PASSAGES.map(p => `<tr><td>${p[0].replace(/[ab]$/, '')}</td><td class="small">${p[1]}</td><td>${picked.includes(p[0]) ? '✎ you' : ''}</td><td>${p[2] ? '✎ Dee' : ''}</td></tr>`).join('');
    const prior = St.bones().filter(b => b.underlined).slice(-1)[0];
    G.modal({
      title: 'Your marginalia and Dee’s', wide: true,
      html: `<p>Dee wrote <i>Duodecim ordines spirituum</i> in the margin of fol. 170r, and noted that individual things have individual spirits (§16). He underlined the delegation of spirits (§23) and the mirror of Apollo (§29) (Page, retained in her transcription).</p>
      <table class="tbl plain"><tr><th></th><th></th><th>you</th><th>Dee</th></tr>${rows}</table>
      ${prior ? `<p class="small">A previous reading underlined: ${prior.underlined.map(x => x.replace(/[ab]$/, '')).join(', ')}.</p>` : ''}
      <p class="small">There is no score. Dee was reading for a mirror.</p>`,
      options: [{ label: 'continue', fn: () => St.record(0, 0, choice, ending) }],
    });
  };
  St.record = function (i, kept, choice, ending) {
    if (i < KELLEY.length) {
      const [rep, src] = KELLEY[i];
      G.choose('The action: Kelley at the stone', [
        { label: 'Write it down, with the day and the hour', value: 2 },
        { label: 'Write it down as “E.K. said”, and no more', value: 1 },
        { label: 'Leave the page blank', value: 0 },
      ], v => St.record(i + 1, kept + v, choice, ending), `<p>“${rep}”</p><p class="small">(${src}; you do not see the stone yourself. Dee never scried; Kelley did.)</p>`);
      return;
    }
    const s = S();
    const verdict = kept >= 5 ? 'You record it all, hour by hour. Within a year the record fills books, the Mysteriorum libri.' :
      kept >= 2 ? 'You write, and you hedge. Whether Kelley saw anything, the scholarship still cannot say; neither can you.' :
        'You leave the pages blank. Jane Dee, for one, is relieved.';
    St.saveBones({ ending, choice, underlined: s.flags.underlined, date: new Date().toISOString().slice(0, 10) });
    G.story([
      `<p>${verdict}</p><p>Then he looks for a long time at the smoky stone on his table.</p>`,
      ending === 'theurgy'
        ? `<p class="big">A record of a theurgic vision</p><p>You read the Liber as its author wished: spirits as ministers in a hierarchy that descends from the First Essence, with no need of a bishop between. Page calls the book a record of a theurgic vision rather than a manual. You have lived the record.</p>`
        : `<p class="big">A school of necromancy</p><p>You reached the seat, but you went by way of love charms, blight and compulsion, and William’s reading has stuck to you. In Paris, the book will be remembered as he described it: planetary idolatry, the founding text of a school of necromancy.</p>`,
      `<p class="c">Years in the desert: 30 · Orders known: ${Object.keys(s.orders).length}/12 · Images ensouled: ${Object.keys(s.fellowship).length}/7 · Remembrance: ${s.stats.remembrance} · Suspicion: ${s.stats.suspicion}</p>
       <p class="c small">After the seven planets have finished their rule, their circlings will be released and they will roll back toward the heavenly wheel (§34).</p>
       <p class="c small">The next reader of this manuscript will find your gloss in its margin.</p><p class="c">Finis. The manuscript breaks off.</p>`,
    ], () => { G.set('ended'); try { localStorage.removeItem('liber_save'); } catch (e) { } L.Main.title(); }, 'Mortlake');
  };

  // ------------------------------------------------------------ Lent: the book-day in the chapter house
  // Page: each monk was given a book at the beginning of Lent, when the collection was brought into the chapter house.
  // The game begins on the Sunday before Lent; the book-day falls on days 3–5 (Ash Wednesday to Friday), 06:00–18:00.
  St.lentOpen = () => G.day() >= 3 && G.day() <= 5 && G.hour() >= 6 && G.hour() < 18;
  St.lentBooks = function () {
    const s = S();
    if (!St.lentOpen()) { G.log('The chapter house floor. At the beginning of Lent the whole collection is laid out here.'); return; }
    if (s.flags.lentTaken) { G.log('You have your book for the year.'); return; }
    const opts = Object.keys(L.DOCTRINES).filter(k => !G.doctrine(k) || s.doctrines[k] === 'borrowed').map(k => ({ label: `${L.DOCTRINES[k].g} ${L.DOCTRINES[k].name}`, value: k }));
    if (!opts.length) { G.log('You have read everything they have laid out that you wanted.'); return; }
    G.choose('The Lent book-day: take one book for the year', opts, k => {
      s.doctrines[k] = 'allotted'; s.flags.lentTaken = true;
      G.pass(30);
      G.log(`The armarius writes your name against ${L.DOCTRINES[k].short} for the year. No press, no circator: it is yours until next Lent.`, 'good');
      G.log('The abbot commends the souls of the living donors and absolves the dead (from c.1307–8, Abbot Findon’s practice).', 'sky');
    }, '<p class="small">The collection is laid out in the chapter house. Each brother takes one book to read for the year (Page).</p>');
  };
})();
