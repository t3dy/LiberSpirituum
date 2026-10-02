// Correspondences, items, doctrines, the twelve orders.
// Provenance tags: MS | MS-ages | WILLIAM | RECON (see research/SOURCES.md).
window.L = window.L || {};

// Kenney 1-bit packed sheet: 49 columns, 16px. t(col,row) -> index.
L.t = (c, r) => r * 49 + c;

L.CHALDEAN = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];
L.DAY_RULER = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']; // Sunday first
L.WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
L.ASCENT = ['moon', 'mercury', 'venus', 'sun', 'mars', 'jupiter', 'saturn', 'urania'];

// VS15 forces text presentation so the planets don't turn into coloured emoji.
const vs = s => s + '︎';

L.PLANETS = {
  moon: {
    g: vs('☽'), name: 'Moon', color: '#cfd8ee', metal: 'silver', tag: 'MS-ages', remember: 20,
    legion: 'the rotators of the sphere of the Moon',
    gift: 'They help without distinction, whoever asks. Their gift is movement: a lighter step.',
    op: 'Write the characters of the Moon on your shoes; paint the face of the Moon on both sides with a triangular figure (§33).',
    age: 'In the last age, the age of the Moon, small men of indifferent mind will rise, bound in the rope of the crowd, and give all things over to common use (§33).',
    immissio: null,
    retro: null, // firm at the dark of the moon (RECON)
    question: 'Whom do my rotators help?', answer: ['ANYONE', 'EVERYONE', 'ALL', 'WITHOUT DISTINCTION'],
    image: 'lunar_shoes', matter: 'shoes',
  },
  mercury: {
    g: vs('☿'), name: 'Mercury', color: '#9fe0c8', metal: 'quicksilver', tag: 'MS-ages', remember: 30,
    legion: 'the turners of the sphere of Mercury',
    gift: 'Drawn by the sweet taste of profound eloquence, and bound by characters or exorcisms, they obey without objection (§32).',
    op: 'Inscribe the characters of Mercury on parchment dusted with quicksilver (the matter is RECON).',
    age: null, immissio: null,
    retro: [7, 2, 3],
    question: 'What draws my turners down?', answer: ['ELOQUENCE', 'SPEECH', 'WORDS'],
    image: 'mercury_tablet', matter: 'parchment',
  },
  venus: {
    g: vs('♀'), name: 'Venus', color: '#f0a0c0', metal: 'copper', tag: 'MS-ages', remember: 40,
    legion: 'the spirits of the orb of Venus',
    gift: 'Descending, they press on marriage and bring in certain illicit couplings. Invoked, they perfect bodily joining (§31).',
    op: 'Herbs grown from their own seed, with the characters, draw to love whomever the bearer chooses (§31). The herb is not named; we use myrtle (RECON).',
    age: null, immissio: null,
    retro: [9, 2, 5],
    question: 'What do my spirits press upon, below?', answer: ['MARRIAGE', 'LOVE', 'COUPLING', 'COUPLINGS', 'DESIRE'],
    image: 'venus_charm', matter: 'myrtle',
  },
  sun: {
    g: vs('☉'), name: 'Sun', color: '#ffd24a', metal: 'gold', tag: 'MS-ages', remember: 50,
    legion: 'the spirits delegated to Apollo',
    gift: 'The Sun’s descent put powerful beings on the earth; its spirit could not be imprisoned in a little bodily shadow (§30).',
    op: 'Take the peony in the hour of the Sun, write the Sun’s name and characters around it, and address it as friend of Apollo. A mirror of Apollo lets you live with those living in the light (§29).',
    age: 'The fourth age: a conspicuous virility that changed the passible world (§30).',
    immissio: null,
    retro: null,
    question: 'With whom does the mirror let you live?', answer: ['LIGHT', 'THOSE LIVING IN THE LIGHT', 'THE LIGHT', 'LIGHT-DWELLERS'],
    image: 'apollo_mirror', matter: 'mirror',
  },
  mars: {
    g: vs('♂'), name: 'Mars', color: '#ff6a4a', metal: 'iron', tag: 'MS-ages', remember: 60,
    legion: 'the pre-elect of the orb of Mars',
    gift: 'Summoned, they favour the dissolution of the human bond and are patrons of barrenness in regions. In their age they made war on one another (§27).',
    op: 'The engraved characters of Mars frustrate the spirits deputed to their duties (§27): a ward. Or the same work, turned outward, makes a region barren.',
    age: 'The third age: spirits sent down as masters, desiring ungentleness, at war with each other (§27).',
    immissio: null,
    retro: [8, 2, 1],
    question: 'What do my pre-elect do to one another?', answer: ['WAR', 'FIGHT', 'THEY FIGHT', 'MAKE WAR'],
    image: 'mars_ward', matter: 'iron',
  },
  jupiter: {
    g: vs('♃'), name: 'Jupiter', color: '#8fb8ff', metal: 'tin', tag: 'MS', remember: 70,
    legion: 'the worshippers of the sweetness of Jupiter',
    gift: 'Spirits of kindness who please the hearts of kings and the powerful (§26).',
    op: 'An image of tin, propitiated by a lighter offering. They sit conscious of no conjurations (§45): offer, never compel.',
    age: 'The second age: spirits who despised transitory things and put all to one common use (§26).',
    immissio: 'They descend not estranged from him but returning into him. They harm no one; with a light motion they run back to their roots; they do not leap around the refuse of dead things as the saturnine do. Like farmers at harvest they sit conscious of no conjurations (§45, paraphrased).',
    retro: [6, 2, 2],
    question: 'Why do my worshippers not come when conjured?', answer: ['KINDNESS', 'OFFERING', 'THEY ARE CONSCIOUS OF NO CONJURATIONS', 'NO CONJURATIONS', 'OFFER', 'GENTLENESS'],
    image: 'jupiter_image', matter: 'tin',
  },
  saturn: {
    g: vs('♄'), name: 'Saturn', color: '#b09a78', metal: 'lead', tag: 'MS', remember: 80,
    legion: 'the inhabitants of the saturnine sphere',
    gift: 'Its image, inscribed with its characters and hung on the neck, helps those who seek a preferred relation in the world (§24).',
    op: 'Cast the image in lead; inscribe the characters; suspend it on the neck (§24).',
    age: 'The first age: souls drawn down were slowed by the weight of the fallen bulk, and gave long life to images (§25).',
    immissio: 'Adjured, it descends gloomy, divided in an earthy cloud, shaving like a blunt razor under the cloak of passible things, subjecting its neighbours to continuous idleness. It rules under a dusky face and inhabits a realm of shadows (§44, paraphrased).',
    retro: [5, 2, 0],
    question: 'What does my spirit bring upon its neighbours?', answer: ['IDLENESS', 'CONTINUOUS IDLENESS', 'SLOTH', 'SHADOW', 'SHADOWS'],
    image: 'saturn_amulet', matter: 'lead',
  },
};
L.PLANETS.urania = {
  g: '✶', name: 'Urania', color: '#ffffff', tag: 'MS', remember: 95,
  legion: 'the order of Urania',
  gift: 'The most eminent ruler, untouched by the contagion of inferior things, a guardian of eternity who keeps his spirits from being sent down until the ages rest in a perfect rotation (§19).',
  question: 'Why are my spirits not sent down?', answer: ['ETERNITY', 'ROTATION', 'THE ROTATION IS NOT COMPLETE', 'UNTIL THE ROTATION', 'THE AGES'],
};

L.ELEMENTS = {
  earth: { g: '🜃', name: 'Earth', color: '#9c7a4a', tag: 'WILLIAM' },
  water: { g: '🜄', name: 'Water', color: '#4aa0e0', tag: 'WILLIAM' },
  air: { g: '🜁', name: 'Air', color: '#d8e8f8', tag: 'WILLIAM' },
  fire: { g: '🜂', name: 'Fire', color: '#ff8030', tag: 'WILLIAM' },
};

// The twelve orders, as William reports the full book had them.
L.ORDERS = ['earth', 'water', 'air', 'fire', 'moon', 'mercury', 'venus', 'sun', 'mars', 'jupiter', 'saturn', 'urania'];

// ---------------------------------------------------------------- items
// tile: sheet index; g: glyph overlay; price in dinars (Seville/caravan).
L.ITEMS = {
  dinar: { name: 'dinars', tile: L.t(40, 3), stack: true },
  bread: { name: 'flat bread', tile: L.t(35, 18), stack: true, food: 25, price: 1 },
  dates: { name: 'dates', tile: L.t(34, 18), stack: true, food: 15, price: 1 },
  wine: { name: 'wine', tile: L.t(33, 19), stack: true, price: 2, desc: 'The kingdom of the flesh, bottled.' },
  water: { name: 'water skin', tile: L.t(46, 6), stack: true, food: 5, price: 1 },
  incense: { name: 'incense', tile: L.t(4, 14), stack: true, price: 2, desc: 'A lighter offering. Burned in an invocation. (Which fumes suit which planet is RECON; the Liber does not say.)' },
  stylus: { name: 'bronze stylus', tile: L.t(35, 2), price: 3, desc: 'A needle for writing characters. The peony rite calls for a needle (§29).' },
  silver: { name: 'silver', tile: L.t(40, 3), g: '☽', stack: true, price: 4, planet: 'moon', matterOf: 'moon' },
  quicksilver: { name: 'quicksilver', tile: L.t(33, 13), g: '☿', stack: true, price: 4, planet: 'mercury' },
  copper: { name: 'copper', tile: L.t(40, 3), g: '♀', stack: true, price: 3, planet: 'venus' },
  gold: { name: 'gold leaf', tile: L.t(40, 3), g: '☉', stack: true, price: 8, planet: 'sun' },
  iron: { name: 'iron plate', tile: L.t(40, 3), g: '♂', stack: true, price: 2, planet: 'mars', matterOf: 'mars' },
  tin: { name: 'tin disc', tile: L.t(40, 3), g: '♃', stack: true, price: 3, planet: 'jupiter', matterOf: 'jupiter' },
  lead: { name: 'lead', tile: L.t(40, 3), g: '♄', stack: true, price: 2, planet: 'saturn', matterOf: 'saturn' },
  shoes: { name: 'plain shoes', tile: L.t(39, 1), price: 3, matterOf: 'moon', desc: 'Leather shoes, awaiting the Moon.' },
  parchment: { name: 'parchment', tile: L.t(33, 15), stack: true, price: 2, matterOf: 'mercury', desc: 'Needs quicksilver to take Mercury’s characters (RECON).' },
  myrtle: { name: 'myrtle sprig', tile: L.t(15, 6), stack: true, price: 3, matterOf: 'venus', desc: 'Grown from its own seed. The Liber names no herb; myrtle is RECON.' },
  mirror: { name: 'steel mirror', tile: L.t(39, 2), price: 10, matterOf: 'sun', desc: 'Polished steel. Needs gold and the Sun’s characters to become a mirror of Apollo.' },
  peony: { name: 'peony root', tile: L.t(14, 6), g: '☉', desc: 'Taken in the hour of the Sun. Now write the Sun’s name and characters around it (M) and address it (V).' },
  // Unvivified images
  img_moon: { name: 'inscribed shoes', tile: L.t(39, 1), g: '☽', image: 'moon', desc: 'The Moon’s characters, the face, the triangle. Not yet inhabited.' },
  img_mercury: { name: 'inscribed parchment', tile: L.t(33, 15), g: '☿', image: 'mercury' },
  img_venus: { name: 'inscribed myrtle', tile: L.t(15, 6), g: '♀', image: 'venus' },
  img_sun: { name: 'gilt mirror', tile: L.t(39, 2), g: '☉', image: 'sun' },
  img_peony: { name: 'inscribed peony', tile: L.t(14, 6), g: '☉', image: 'sun', peony: true },
  img_mars: { name: 'engraved iron', tile: L.t(37, 3), g: '♂', image: 'mars' },
  img_jupiter: { name: 'engraved tin', tile: L.t(43, 6), g: '♃', image: 'jupiter' },
  img_saturn: { name: 'cast lead image', tile: L.t(43, 7), g: '♄', image: 'saturn' },
  // Vivified images: ensouled matter
  lunar_shoes: { name: 'lunar shoes', tile: L.t(39, 1), g: '☽', wear: 'feet', vivid: 'moon', desc: 'A lighter step: travel costs half the time, and the dune sea will bear you.' },
  mercury_tablet: { name: 'tablet of Mercury', tile: L.t(33, 15), g: '☿', wear: 'hand', vivid: 'mercury', desc: 'Held, it lends eloquence. Conjured spirits obey without objection and do not slip away.' },
  venus_charm: { name: 'charm of Venus', tile: L.t(15, 6), g: '♀', vivid: 'venus', use: 'venus', desc: 'Used upon a person, it draws them to love the bearer. (§31)' },
  apollo_mirror: { name: 'mirror of Apollo', tile: L.t(39, 2), g: '☉', wear: 'hand', vivid: 'sun', desc: 'Held, you see those living in the light, and little is hidden from you (§29).' },
  peony_vivid: { name: 'peony of Apollo', tile: L.t(14, 6), g: '☉', vivid: 'sun', use: 'peony', desc: 'Expels demons; wins the favour of important men; lets you escape deadly places (§29).' },
  mars_ward: { name: 'characters of Mars', tile: L.t(37, 3), g: '♂', wear: 'neck', vivid: 'mars', use: 'mars', desc: 'Worn: violent spirits are frustrated. Used upon the land: barrenness (§27).' },
  jupiter_image: { name: 'image of Jupiter', tile: L.t(43, 6), g: '♃', use: 'jupiter', vivid: 'jupiter', desc: 'Pleases the hearts of the powerful (§26). Show it to one with power.' },
  saturn_amulet: { name: 'saturnine amulet', tile: L.t(43, 7), g: '♄', wear: 'neck', vivid: 'saturn', desc: 'Hung on the neck, it helps those who seek a preferred relation (§24). Saturn’s idleness does not take its wearer.' },
  // Books and folios
  ms125: { name: 'CCC MS 125', tile: L.t(45, 5), desc: 'A thick miscellany: medicine, astronomy, image magic. At fol. 169r begins the Book of the Essence of Spirits.' },
  de_universo: { name: 'De universo (a quire)', tile: L.t(46, 5), desc: 'William of Auvergne, bishop of Paris, 1231–36. Hostile. Complete where your book is not.' },
  key: { name: 'iron key', tile: L.t(32, 11) },
  liber_written: { name: 'the book you have written', tile: L.t(45, 5), g: '✶', use: 'transmit', desc: 'The essence of the spirits and their double embodying. For the worthy (§6). Use it where you would give it away.' },
  catalogue: { name: 'the library catalogue', tile: L.t(34, 15), desc: 'Press by press (distinctio) and shelf by shelf (gradus). R to read.' },
  book_apuleius: { name: 'Apuleius (on loan)', tile: L.t(46, 5), g: '☊', desc: 'Lent by the master of novices. Its doctrine is yours while you hold it; copy it at your carrel (M) to keep it. Return it by Compline.' },
};

// ---------------------------------------------------------------- doctrines (monk layer)
L.DOCTRINES = {
  timaeus: { name: 'Plato, Timaeus (Calcidius’ Latin)', short: 'Timaeus', effect: 'You know the order of the spheres. You can find the way up.', g: '✶' },
  calcidius: { name: 'Calcidius, Commentary on the Timaeus', short: 'Calcidius', effect: 'You can read intermediary spirits kindly. Suspicion rises a quarter slower, and you have an argument against the Reader.', g: '⚖' },
  apuleius: { name: 'Apuleius, De deo Socratis', short: 'Apuleius', effect: 'Daimones are passible and sympathetic. You can Talk with spirits.', g: '☊' },
  asclepius: { name: 'Asclepius', short: 'Asclepius', effect: 'Statues ensouled and filled with spirit. You can Vivify an image.', g: '⚱' },
  macrobius: { name: 'Macrobius, Commentary on the Dream of Scipio', short: 'Macrobius', effect: 'The soul came down through the spheres. Gazing at the night sky (L on yourself) restores Remembrance.', g: '☄' },
  martianus: { name: 'Martianus Capella, The Marriage of Philology and Mercury', short: 'Martianus', effect: 'Eloquence +15. Mercury’s ruler takes to you.', g: '✒' },
};

// ---------------------------------------------------------------- codex entries (J)
L.CODEX_INTRO = [
  ['The book', 'The Liber de essentia spirituum survives in one incomplete copy: Oxford, Corpus Christi College MS 125, fols. 169r–173r. It is anonymous and probably late twelfth-century. It was in circulation by the 1230s, when William of Auvergne attacked it. Page edited it (2006) and translated it (2013).', 'MS'],
  ['Passibility', 'The highest spirits cannot be acted on. The planetary rulers are passible but incorruptible. Lower spirits are more passible, and so more reachable. Humans cannot escape the bond of corruption. The lower the spirit, the more your art can touch it (§14, §17–18).', 'MS'],
  ['Delegation', 'Rulers are never called down from their blessedness by anyone’s incantation. Conjured, they delegate lower spirits by their legions and gifts, whether through flattering incitements or violent conjurations (§23; Dee underlined this).', 'MS'],
  ['The three needs', 'To draw down a spirit you need harmonious matter, an obedient spirit, and helping symmetry (§37). Symmetry means the planet’s own hour. If a ruler is retrograde (℞), its spirits fall more readily and are bound firmly (§36).', 'MS'],
  ['Neither reward nor punishment', 'Is incorporation a reward or a punishment? Neither. Everything merits its own use by the Creator’s goodwill. The spirits do not stray from the paths set for them (§39).', 'MS'],
  ['The prison of the soul', 'Entering its prison, the soul is clouded by a sleep of blindness. It comes to think it could not exist without a body, and serves the body as if poisoned by a flawed fountain (§40–42). You are a spirit in matter too.', 'MS'],
  ['Where the text stops', 'The planetary ages (§24–33) cover all seven planets. The detailed descent of each spirit when adjured (§43–) survives only for Saturn and Jupiter, and then the manuscript breaks off. The elemental orders and the full twelve are known only from William of Auvergne.', 'MS'],
  ['The Reader from Paris', 'William of Auvergne was bishop of Paris. He read this book between 1231 and 1236 and called its spirits demons. In this game he walks the hermit’s desert, which is impossible. He is here because the monk who reads the book already knows what Paris thinks of it.', 'RECON'],
  ['Seville', 'The author places himself in Seville. The city shown here, with Christians, Jews and Muslims in one market, is a stylization and not a reconstruction.', 'RECON'],
];
L.ORDER_TEXT = {
  earth: 'William: spirits that dwell in caves and the earth’s hollows and answer magicians’ prayers. He calls them demons that hide from the light. The Liber’s own account is lost.',
  water: 'William: spirits of waters and springs, sorted by element as if they were natural kinds. He calls this idolatry of the creature. The Liber’s own account is lost.',
  air: 'William: spirits of the air. He grants that the air teems with them, but only with the fallen. The Liber’s own account is lost.',
  fire: 'William: spirits of fire. He reads in them the smoke of the pit. The Liber’s own account is lost.',
};
