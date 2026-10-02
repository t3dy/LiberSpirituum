// Terrain, hand-drawn maps, and the procedural desert and spheres.
window.L = window.L || {};
(function () {
  const t = L.t;

  // pass: true | false | 'shoes' ; cost multiplies time
  L.TERRAIN = {
    '.': { n: 'flagstones', bg: '#2b2633', pass: true },
    ',': { n: 'grass', bg: '#1d3522', tile: t(5, 0), pass: true },
    ';': { n: 'garden', bg: '#1d3522', tile: t(6, 0), pass: true },
    ':': { n: 'sand', bg: '#4d3f26', pass: true },
    'o': { n: 'dunes', bg: '#5a4a2c', tile: t(2, 0), pass: true, cost: 2 },
    'O': { n: 'the dune sea', bg: '#6b5532', tile: t(3, 0), pass: 'shoes', cost: 1 },
    '~': { n: 'water', bg: '#16354f', tile: t(8, 5), pass: false },
    '#': { n: 'wall', bg: '#39333f', tile: t(10, 17), pass: false },
    'W': { n: 'sandstone wall', bg: '#4a3a2a', tile: t(11, 18), pass: false },
    '+': { n: 'door', bg: '#2b2633', tile: t(4, 9), pass: true },
    'T': { n: 'tree', bg: '#1d3522', tile: t(4, 1), pass: false },
    'P': { n: 'date palm', bg: '#4d3f26', tile: t(5, 1), pass: false, palm: true },
    'c': { n: 'cactus', bg: '#4d3f26', tile: t(6, 1), pass: false },
    '^': { n: 'rock', bg: '#3a2e20', tile: t(22, 0), pass: false },
    '=': { n: 'table', bg: '#2b2633', tile: t(8, 7), pass: false },
    'B': { n: 'bookshelf', bg: '#2b2633', tile: t(3, 7), pass: false },
    'a': { n: 'altar', bg: '#2b2633', tile: t(22, 12), pass: false, altar: true },
    '_': { n: 'carpet', bg: '#4a1c2a', pass: true },
    'x': { n: 'bones', bg: '#4d3f26', tile: t(0, 15), pass: true, refuse: true },
    '|': { n: 'pillar', bg: '#2b2633', tile: t(3, 12), pass: false },
    'k': { n: 'broken column', bg: '#4d3f26', tile: t(3, 13), pass: false },
    'w': { n: 'well', bg: '#2b2633', tile: t(14, 5), pass: false, well: true },
    'f': { n: 'fire vent', bg: '#3a1a10', tile: t(14, 10), pass: false },
    'g': { n: 'grave', bg: '#1d3522', tile: t(0, 14), pass: false },
    'b': { n: 'bed', bg: '#2b2633', tile: t(15, 9), pass: true, bed: true },
    'p': { n: 'peonies', bg: '#1d3522', tile: t(14, 6), pass: true, peony: true },
    'L': { n: 'the image of true light', bg: '#6a6030', pass: true, glyph: '✦', gcol: '#fff6c0', light: true },
    '*': { n: 'the void between spheres', bg: '#07050d', pass: false, stars: true },
    'r': { n: 'the sphere', bg: '#161028', pass: true },
    'U': { n: 'the way up', bg: '#2a2050', pass: true, glyph: '⇑', gcol: '#ffffff', up: true },
    'D': { n: 'the way down', bg: '#2a2050', pass: true, glyph: '⇓', gcol: '#8888aa', down: true },
    'S': { n: 'the empty seat', bg: '#403860', tile: t(1, 8), pass: false, seat: true },
    's': { n: 'market stall', bg: '#2b2633', tile: t(7, 7), pass: false },
    'h': { n: 'house', bg: '#4a3a2a', tile: t(5, 19), pass: false },
    't': { n: 'tent', bg: '#4d3f26', tile: t(6, 20), pass: false },
    'n': { n: 'notice', bg: '#2b2633', tile: t(0, 7), pass: false, notice: true },
    'X': { n: 'iron bars', bg: '#2b2633', tile: t(5, 11), pass: false },
    '>': { n: 'the road', bg: '#4d3f26', pass: true, glyph: '⟶', gcol: '#e0d0a0', exit: true },
    'G': { n: 'city gate', bg: '#4a3a2a', tile: t(21, 11), pass: true, exit: true },
    'm': { n: 'minaret', bg: '#4a3a2a', tile: t(4, 20), pass: false },
    'e': { n: 'standing stone', bg: '#3a2e20', tile: t(12, 12), pass: false, shrine: true },
    'q': { n: 'fountain', bg: '#1d3522', tile: t(14, 5), pass: false, well: true },
  };

  function pad(rows) {
    const w = Math.max(...rows.map(r => r.length));
    return rows.map(r => (r + '#'.repeat(w)).slice(0, w));
  }

  // ---------------------------------------------------------------- Mortlake
  L.MAPS = {};
  L.MAPS.mortlake = {
    name: 'Mortlake — Dee’s library, 1582', layer: 'dee', indoor: true,
    rows: pad([
      '##################',
      '#BBBBBB##BBBBBBBB#',
      '#................#',
      '#..==....___.....#',
      '#..==....___..==.#',
      '#........___..==.#',
      '#|..............|#',
      '#................#',
      '#BBB..........BBB#',
      '#........+.......#',
      '##################',
    ]),
    start: [6, 5],
    ents: [
      { kind: 'feature', id: 'ms125_dee', x: 5, y: 4, tile: t(45, 5), name: 'CCC MS 125, on the desk', read: 'enterMonk' },
      { kind: 'feature', id: 'shewstone', x: 13, y: 4, tile: t(34, 10), name: 'a shew-stone of smoky crystal', look: 'A smoky stone. It is not yet time to use it. (That begins in March 1582 with a young man named Kelley.)' },
      { kind: 'feature', id: 'astrolabe', x: 14, y: 5, tile: t(39, 2), name: 'an astrolabe', look: 'Brass, well used. The rete is set for Mortlake.' },
      { kind: 'npc', id: 'kelley', x: 9, y: 8, tile: t(29, 1), name: 'a young man at the door' },
    ],
  };

  // ---------------------------------------------------------------- Canterbury
  L.MAPS.canterbury = {
    name: 'St Augustine’s Abbey, Canterbury — c.1315', layer: 'monk', indoor: false,
    labels: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map((s, i) => ({ x: i + 1, y: 1, t: s })),
    rows: pad([
      '####################################',
      '#BBBBBBBBBB#.........#.............#',
      '#..........#.=.=.=.=.#..|..|..|..|.#',
      '#.=..=..=..#.........#.............#',
      '#..........#.=.=.=.=.#..|..|..|..|.#',
      '#.=..=..=..#.........#......_......#',
      '#..........#....n....#..|..|_.|..|.#',
      '#BBBBB+BBBB#####+#####......_......#',
      '#,,,,,.,,,,,,,,,.,,,,#..|..|_.|..|.#',
      '#,.................,,#......_......#',
      '#,.;;;;;;;;;;;;;;;.,,#.....aaa.....#',
      '#,.;;;;;;;T;;;;;;;.,,######+########',
      '#,.;;;;;;;;;;;;;;;.,,,,,,,,.,,,,,,,#',
      '#,.;;;;;;;;w;;;;;;.............,,,,#',
      '#,.;;;;T;;;;;;;T;;.,,,,,,,,,,,,,,,,#',
      '#,.;;;;;;;;;;;;;;;.,,,,,,,T,,,,,,,,#',
      '#,..................,,,,,,,,,,,,,,,#',
      '#,,,,,,,,,,.,,,,,,,,,,,,,,,,,.,,,,,#',
      '###########+#################+######',
      '#..........#.........#.............#',
      '#.=======..#..b.b.b..#..g..g..g..g.#',
      '#.=======..#.........#.............#',
      '#..........#..b.b.b..#..g..g..g..g.#',
      '#.....w....#.........#.............#',
      '####################################',
    ]),
    start: [9, 5],
    ents: [
      // Presses (distinctiones) I–X along the north wall; shelfmarks after Page's St Augustine's.
      { kind: 'feature', id: 'shelf_timaeus', x: 4, y: 1, tile: t(45, 5), name: 'Plato, Timaeus — press IV', doctrine: 'timaeus' },
      { kind: 'feature', id: 'shelf_calcidius', x: 5, y: 1, tile: t(45, 5), name: 'Calcidius on the Timaeus — press V', doctrine: 'calcidius' },
      { kind: 'feature', id: 'shelf_martianus', x: 7, y: 1, tile: t(45, 5), name: 'Martianus Capella — press VII', doctrine: 'martianus' },
      { kind: 'feature', id: 'shelf_asclepius', x: 10, y: 1, tile: t(46, 5), name: 'the Asclepius — press X, the collectiones', doctrine: 'asclepius', restricted: true },
      { kind: 'feature', id: 'lectern_macrobius', x: 9, y: 20, tile: t(46, 5), name: 'the refectory lectern (Macrobius, read at meals)', doctrine: 'macrobius' },
      { kind: 'feature', id: 'carrel_ms', x: 5, y: 4, tile: t(45, 5), name: 'your carrel, with the new miscellany (it will be CCC 125)', read: 'enterHermit', carrel: true },
      { kind: 'feature', id: 'lent_books', x: 16, y: 5, tile: t(46, 5), name: 'the collection, laid out for Lent', read: 'lentBooks', hidden: true },
      { kind: 'npc', id: 'armarius', x: 8, y: 3, tile: t(25, 1), name: 'the armarius', office: [23, 3] },
      { kind: 'npc', id: 'prior', x: 16, y: 3, tile: t(28, 0), name: 'the prior', office: [28, 7], lectio: [7, 5] },
      { kind: 'npc', id: 'novice', x: 12, y: 13, tile: t(25, 0), name: 'a novice', office: [32, 3] },
      { kind: 'npc', id: 'novicemaster', x: 6, y: 16, tile: t(27, 1), name: 'the master of novices', office: [26, 3] },
      { kind: 'npc', id: 'cellarer', x: 5, y: 21, tile: t(27, 0), name: 'the cellarer', office: [29, 3] },
      { kind: 'item', item: 'bread', n: 2, x: 8, y: 22 },
    ],
  };

  // ---------------------------------------------------------------- Seville
  L.MAPS.seville = {
    name: 'Seville — the kingdom of the flesh', layer: 'hermit', indoor: false,
    rows: pad([
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'W######....;;;;;;;;;;;;;;....WWWWWmWWWWW',
      'W#____#....;;T;;;q;;;;T;;....W.........W',
      'W#_b__#....;;;;;;;;;;;;;;....W..|...|..W',
      'W#____#....;;T;;;;;;;;T;;....W.........W',
      'W#=__=#....;;;;;;;;;;;;;;....W..|...|..W',
      'W###+##....;;;;;;;+;;;;;;....WWWW+WWWWWW',
      'W..........................,...........W',
      'W...hhh......................hhh.......W',
      'W...hhh.....s..s..s..s.......hhh.......W',
      'W...........................,..........W',
      'W...hhh.....s..s..s..s................G>',
      'W...hhh................................W',
      'W......................................W',
      'W####+###.....hhh.....#####+####.......W',
      'W#......#.....hhh.....#........#..hhh..W',
      'W#.==.=.#.............#..BB..B.#..hhh..W',
      'W#......#.............#........#.......W',
      'W#.=.==.#.....hhh.....#.=......#.......W',
      'W########.....hhh.....##########.......W',
      'W......................................W',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ]),
    start: [3, 3],
    ents: [
      { kind: 'npc', id: 'steward', x: 4, y: 4, tile: t(30, 0), name: 'your steward' },
      { kind: 'npc', id: 'vintner', x: 3, y: 17, tile: t(27, 0), name: 'the tavern keeper' },
      { kind: 'npc', id: 'reveller', x: 6, y: 16, tile: t(26, 1), name: 'a reveller', wander: 2 },
      { kind: 'npc', id: 'merchant', x: 14, y: 10, tile: t(25, 2), name: 'the metal-seller', shop: 'metals' },
      { kind: 'npc', id: 'herbwoman', x: 20, y: 10, tile: t(28, 1), name: 'the herb-seller', shop: 'herbs' },
      { kind: 'npc', id: 'translator', x: 26, y: 17, tile: t(26, 9), name: 'a translator of Arabic books' },
      { kind: 'npc', id: 'imam', x: 34, y: 3, tile: t(27, 1), name: 'a scholar in the mosque court' },
      { kind: 'npc', id: 'gardener', x: 16, y: 3, tile: t(29, 0), name: 'the palace gardener', wander: 3 },
      { kind: 'npc', id: 'gatekeeper', x: 37, y: 10, tile: t(24, 0), name: 'the gatekeeper' },
      { kind: 'npc', id: 'child', x: 22, y: 13, tile: t(30, 2), name: 'a child', wander: 6 },
      { kind: 'item', item: 'dinar', n: 30, x: 5, y: 2 },
      { kind: 'item', item: 'stylus', n: 1, x: 2, y: 5 },
    ],
    exits: { '39,11': { map: 'desert', x: 1, y: 22, need: 'vision' } },
  };

  // ---------------------------------------------------------------- prison
  L.MAPS.prison = {
    name: 'The tower of the condemned', layer: 'hermit', indoor: true,
    rows: pad([
      '#########',
      '#.......#',
      '#.b.....#',
      '#.......#',
      '#XXXX+XX#',
      '#.......#',
      '#########',
    ]),
    start: [4, 2],
    ents: [{ kind: 'npc', id: 'gaoler', x: 4, y: 5, tile: t(24, 0), name: 'the gaoler' }],
  };

  // ---------------------------------------------------------------- the desert (procedural + stamps)
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  L.rng = rng;

  function stamp(g, x0, y0, rows) {
    rows.forEach((r, dy) => [...r].forEach((ch, dx) => { if (ch !== ' ') g[y0 + dy][x0 + dx] = ch; }));
  }

  function buildDesert() {
    const W = 64, H = 48, R = rng(1172);
    const g = [];
    for (let y = 0; y < H; y++) {
      g.push([]);
      for (let x = 0; x < W; x++) {
        let ch = ':';
        const r = R();
        if (r < 0.14) ch = 'o'; else if (r < 0.16) ch = 'c'; else if (r < 0.185) ch = '^';
        if (x >= 47) ch = r < 0.05 ? '^' : 'O';
        if (x === 0 || y === 0 || x === W - 1 || y === H - 1) ch = '^';
        g[y].push(ch);
      }
    }
    // the road from Seville
    for (let x = 0; x < 28; x++) { g[22][x] = ':'; g[21][x] = g[21][x] === '^' ? ':' : g[21][x]; }
    g[22][0] = '>';
    // hermitage
    stamp(g, 25, 17, [
      '^^^^^^^^^^^',
      '^....a....^',
      '^.b.......^',
      '^....L....^',
      '^.........^',
      '^^^^^.^^^^^',
    ]);
    stamp(g, 23, 23, ['P::w::::P', ':::::::::']);
    for (let y = 23; y < 34; y++) g[y][30] = ':';
    // oasis and caravan
    stamp(g, 26, 33, [
      ':P:::::P:::',
      '::~~~~~::t:',
      ':P~~~~~~:::',
      '::~~~~~P:t:',
      ':::P::::::',
    ]);
    // bone field: the refuse of dead things
    for (let y = 24; y < 33; y++) for (let x = 5; x < 15; x++) g[y][x] = R() < 0.45 ? 'x' : ':';
    // Martian ruins
    stamp(g, 18, 38, [
      '::k:::k:::k::',
      ':k:::::::::k:',
      '::::|:::|::::',
      ':k:::::::::k:',
      '::k:::k:::k::',
    ]);
    // Reader's camp
    stamp(g, 30, 4, [
      ':::::::::',
      '::t:::t::',
      ':::::::::',
      '::::::::',
    ]);
    // tower of the condemned
    stamp(g, 6, 4, ['#####', '#...#', '#...#', '##+##']);
    // elemental places
    stamp(g, 3, 40, ['^^^^^', '^...^', '^.e.^', '^^.^^']);       // earth: a cave
    stamp(g, 42, 28, [':::', ':~:', '~e~', ':~:']);             // water: a spring
    stamp(g, 18, 45, ['ffef']);                                // fire: vents
    stamp(g, 56, 6, ['^^^^^', '^...^', '^.e.^', '^...^', '^^.^^']); // air: the high rock, beyond the dunes
    // Apollo's rock and the peony garden, beyond the dunes
    stamp(g, 53, 30, [
      'OOOOOOOOO',
      'O;;;;;;;O',
      'O;ppppp;O',
      'O;p;^;p;O',
      'O;ppppp;O',
      'O;;;;;;;O',
      'OOOO:OOOO',
    ]);
    return g.map(r => r.join(''));
  }

  L.MAPS.desert = {
    name: 'The deserted places', layer: 'hermit', indoor: false, desert: true,
    rows: buildDesert(),
    start: [30, 21],
    ents: [
      { kind: 'feature', id: 'de_universo', x: 34, y: 6, tile: t(46, 5), name: 'a lectern with a quire from Paris', read: 'williamBook' },
      { kind: 'npc', id: 'reader', x: 33, y: 7, tile: t(28, 2), name: 'the Reader from Paris', wander: 2 },
      { kind: 'npc', id: 'caravaneer', x: 34, y: 35, tile: t(25, 2), name: 'a caravan merchant', shop: 'caravan' },
      { kind: 'feature', id: 'shrine_earth', x: 5, y: 42, tile: null, g: '🜃', gcol: '#c09a5a', name: 'a stone in the cave', element: 'earth' },
      { kind: 'feature', id: 'shrine_water', x: 43, y: 30, tile: null, g: '🜄', gcol: '#6ab8ff', name: 'a stone in the spring', element: 'water' },
      { kind: 'feature', id: 'shrine_fire', x: 20, y: 45, tile: null, g: '🜂', gcol: '#ff8a3a', name: 'a stone among the vents', element: 'fire' },
      { kind: 'feature', id: 'shrine_air', x: 58, y: 8, tile: null, g: '🜁', gcol: '#e8f0ff', name: 'a stone on the high rock', element: 'air' },
      { kind: 'feature', id: 'apollo_rock', x: 57, y: 33, tile: null, g: '☉', gcol: '#ffd24a', name: 'Apollo’s rock', look: 'Sun-struck stone. Peonies grow around it, taken only in the hour of the Sun.' },
      { kind: 'item', item: 'bread', n: 3, x: 27, y: 19 },
      { kind: 'item', item: 'incense', n: 3, x: 31, y: 18 },
      { kind: 'item', item: 'water', n: 2, x: 33, y: 19 },
    ],
    exits: { '0,22': { map: 'seville', x: 37, y: 11 } }, // lands just inside the gate (G at 38,11)
  };
})();
