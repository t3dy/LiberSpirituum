// Keyword conversations, Ultima style. A value is a string or fn(G) -> string.
// Words in a reply that match one of the speaker's keywords are highlighted and clickable.
window.L = window.L || {};

L.NPCS = {
  // ------------------------------------------------------------ Mortlake
  kelley: {
    greet: 'A young man in a close cap waits at the door and says he has heard you seek a SKRYER.',
    NAME: 'He gives a name, Talbot, and you will learn later that it is not quite his.',
    JOB: 'He says he sees in stones what others cannot, and asks whether you have a STONE.',
    SKRYER: 'He says spirits will not speak to a learned man directly, and that he could be your eyes.',
    STONE: 'He glances at the smoky crystal on your table: “That one, or a MIRROR. The old books say a mirror of Apollo.”',
    MIRROR: G => { G.set('dee_mirror'); return 'He says he has not read it himself, but that there is an old monkish BOOK that speaks of such a mirror.'; },
    BOOK: 'He nods at the thick manuscript on your desk: “That one came from Canterbury, did it not? READ it, Doctor.”',
    READ: 'Stand by the desk and press R, or click the book.',
    BYE: 'He says he will come back in March.',
  },

  // ------------------------------------------------------------ Canterbury
  armarius: {
    greet: 'The keeper of books looks up from his register. “Brother Thomas. You are after the new miscellany again.”',
    NAME: '“I keep the armarium. You are Thomas, and some call you SPROT and some Willesborough, as if you were two men.”',
    SPROT: '“One man, two names. The catalogue will not care.”',
    JOB: '“I keep the BOOKS and I keep them in order. The IMAGES I keep in a separate press.”',
    BOOKS: '“Eighteen hundred volumes, Brother, and we keep them in presses by subject. You want the Platonists before you read that new QUIRE. Ask me for the CATALOGUE; I am not walking you round the room. Or wait for LENT.”',
    CATALOGUE: G => { if (!G.has('catalogue')) { G.give('catalogue'); G.redraw(); return '“Here: the catalogue, press by press and shelf by shelf. Read it (R). Some books are not in this room at all.” (You have the catalogue.)'; } return '“You have it already. Read it.”'; },
    TIMAEUS: '“The world as a living creature, with a soul stretched through the spheres. Without it you will not know which way is UP.”',
    UP: '“Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, then the fixed sphere. Every schoolboy knows it and forgets it.”',
    CALCIDIUS: '“He is kinder to the airy spirits than the Fathers are, kinder than AUGUSTINE.”',
    AUGUSTINE: '“Augustine says the demons’ passions prove them wicked. Calcidius and Apuleius say their passions make them go-betweens. Choose your authority carefully in this house.”',
    APULEIUS: '“The De deo Socratis. It says daimones feel as we do and so can hear us. The master of novices keeps our only copy; he teaches the boys Latin from the De Platone. Ask him.”',
    ASCLEPIUS: '“Hermes on statues ensouled, conscious and filled with spirit. It is in press ten, with the collectiones, where the books of images live. The prior walks this room during the reading hours; read what you like, but not under his nose.”',
    MACROBIUS: '“The soul falling through the planets. It is on the refectory lectern; it is read to us at meals, God help us.”',
    MARTIANUS: '“Philology marries Mercury. It is pretty Latin and good for your tongue.”',
    IMAGES: '“Sixteen distinct works on images, twenty more copies, spread among several brothers. We are a curious house.”',
    QUIRE: '“The Book of the Essence of Spirits. It is on your carrel. A man from SEVILLE claims thirty years of fellowship with spirits.” He lowers his voice. “Mind the TEMPIER list.”',
    LENT: G => G.day() < 3 ? '“Lent begins on Wednesday. Then the whole collection comes into the chapter house and each brother takes one book for the year. No circator, no questions.”' : (G.day() <= 5 ? '“The books are in the chapter house now. Take one before Friday is out.”' : '“Lent has begun, and the books have gone back to their presses. Next year.”'),
    HOURS: '“We read in the hours of lectio: after Prime and after Terce and after dinner. At the Office every brother is in choir, and the library is empty.”',
    SEVILLE: '“Where the Arabs, Jews and Christians trade books like figs. The word nīranj is in it, which is an Arabic word for a talisman.”',
    TEMPIER: '“The bishop of Paris, in seventy-seven. Books of necromancy and sorcery condemned. Paris cannot touch us: this house answers to Rome, not to any bishop. But the prior can, and someone has copied the notice into the back of that very manuscript.”',
    BYE: '“Put things back where you found them.”',
  },
  prior: {
    greet: 'The prior regards you steadily.',
    NAME: '“You know my name, Thomas.”',
    JOB: '“I keep this house in order while the abbot is at court, and that includes its READING.”',
    READING: '“In the hours of lectio I walk the library as circator; it is my office to see that brothers read and do not sleep, or read what they should not. Read what you like, for the love of God, but know what you are reading. The NOTICE in the chapter house is not decoration.”',
    OFFICE: '“Come to choir when the bell rings. A brother who sings the Hours has less to explain.”',
    NOTICE: '“Tempier’s condemnation. Paris has decided some books are sorcery. Paris will one day decide something about you.”',
    SPIRITS: '“Angels or demons, Thomas. There is no third thing. Whoever tells you there is has made a religion of his own.”',
    BYE: '“Go with God.”',
  },
  novice: {
    greet: 'A novice is sweeping the walk, and mostly moving the dust around.',
    NAME: '“Brother Wulfric, brother.”',
    JOB: '“Sweeping. The cellarer says there is BREAD in the refectory if you missed dinner.”',
    BREAD: '“On the long table, south side.”',
    BYE: '“God keep you.”',
  },
  novicemaster: {
    greet: 'The master of novices has a Latin grammar under one arm and a switch under the other.',
    NAME: '“Brother John. I keep the boys, God help me, and some of the books.”',
    JOB: '“I teach Latin to the novices. The BOOKS in my keeping are the ones I teach from.”',
    BOOKS: '“Donatus, Priscian, and a donor’s APULEIUS: De Platone for the boys, and some other things in the back of it that are not for boys.”',
    APULEIUS: G => {
      if (G.doctrine('apuleius') === 'copied') return '“You have your own copy now. Good.”';
      if (G.has('book_apuleius')) return '“You have it. Bring it back by Compline; I will want it for the morning lesson. Or COPY what you need.”';
      G.give('book_apuleius'); G.redraw();
      return '“Borrow it, then, and bring it back by Compline. A book lent is a book half lost.” (You have the Apuleius, on loan: its doctrine is yours only while you hold it, unless you copy it at your carrel with M.)';
    },
    COPY: '“Copy what you need at your carrel. What a brother copies with his own hand is his, until he dies and the precentor writes his name in it.”',
    RETURN: G => { if (G.has('book_apuleius')) { G.take('book_apuleius'); G.redraw(); return '“Thank you, Brother. Not a page bent.”'; } return '“You have nothing of mine.”'; },
    BYE: '“Go on. Walk, do not run.”',
  },
  cellarer: {
    greet: 'The cellarer counts loaves.',
    NAME: '“Brother cellarer, and that is enough name for anyone.”',
    JOB: '“Bread, beer and accounts. Take what is on the table.”',
    BYE: '“Close the door, the flies.”',
  },

  // ------------------------------------------------------------ Seville
  steward: {
    greet: 'Your steward bows. The house smells of roast meat and rosewater.',
    NAME: '“Your servant, lord, as ever.”',
    JOB: '“I keep your KINGDOM, lord: the house, the table, the purse. There are DINARS in the chest by the bed and your STYLUS is on the side table.”',
    KINGDOM: '“A little kingdom, but a warm one. You reign here as the flesh reigns in a body.”',
    DINARS: '“Thirty, lord. Enough for the MARKET.”',
    STYLUS: '“The bronze one you write your accounts with.”',
    MARKET: '“South of the palace garden: metals, herbs, everything.”',
    VISION: G => G.flag('vision') ? '“You have been strange since that night, lord. You talk of the DESERT.”' : '“A vision, lord? Sleep in your own bed tonight and see.”',
    DESERT: '“East gate. God preserve you, it is nothing but sand and holy madmen.”',
    BYE: '“Lord.”',
  },
  vintner: {
    greet: 'The tavern keeper wipes a cup with his sleeve.',
    NAME: '“Everyone calls me the keeper. I keep the WINE.”',
    JOB: '“Wine, song, dice, a soft bench. What else is a city FOR?”',
    WINE: G => { if (G.buy('wine', 2)) { return '“Two dinars. Drink it here or carry it off.”'; } return '“Two dinars, friend, and you have not got them.”'; },
    FOR: '“For forgetting, my lord. Everyone here has something they would rather not remember.”',
    BYE: '“Come back thirsty.”',
  },
  reveller: {
    greet: 'A reveller throws an arm around you. “Friend! Drink! Tomorrow we are dust!”',
    NAME: '“Names! Who needs them after the third cup?”',
    JOB: '“My job is PLEASURE, friend. It pays in the moment.”',
    PLEASURE: G => { G.stat('flesh', 10); G.stat('remembrance', -3); return 'You laugh together and something slips away. (Remembrance −3)'; },
    BYE: '“Stay! No? Dust, then!”',
  },
  merchant: {
    greet: 'The metal-seller has ingots on a blanket: grey, red, white, and a jar of quivering silver.',
    NAME: '“Ibn Yaḥyā. My father sold metals and so will my son.”',
    JOB: '“Metals for smiths and for the other kind of CUSTOMER. Say BUY.”',
    CUSTOMER: '“Every metal has its star, the image-makers say: lead for Saturn, tin for Jupiter, iron for Mars, gold for the Sun, copper for Venus, quicksilver for Mercury, silver for the Moon. I only sell by weight.”',
    BUY: G => { G.shop('metals'); return '“Look, then.”'; },
    BYE: '“Peace upon you.”',
  },
  herbwoman: {
    greet: 'The herb-seller has bunches drying on a line: rue, myrtle, mandrake roots with suspicious faces.',
    NAME: '“Names are for people who owe money.”',
    JOB: '“Herbs for sickness, herbs for love, INCENSE for the mosque and the church, both. Say BUY.”',
    LOVE: '“Myrtle. Grown from its own seed, mind. Cuttings are no good for that work.”',
    PEONY: '“Peony is for the falling sickness and for lunatics. Mine are dried. For your purpose you want it fresh, taken in the right HOUR.”',
    HOUR: '“The hour of the Sun, the old women say. There is a rock out in the desert where peonies grow wild.”',
    INCENSE: '“Frankincense, mastic, a little aloes.”',
    BUY: G => { G.shop('herbs'); return '“Look, then, but do not squeeze.”'; },
    BYE: '“Go on.”',
  },
  translator: {
    greet: 'A man surrounded by Arabic books and Latin drafts looks up, ink on his nose.',
    NAME: '“A translator. We are all nameless; the books go out under Hermes’ name, or Aristotle’s.”',
    JOB: '“I put Arabic into Latin: stars, IMAGES, spirits. Our patrons in Toledo and beyond want the whole sky.”',
    IMAGES: '“The Arabic books teach how to draw down the spirituality of a planet into a talisman, a NĪRANJ. There is a corpus, the Kitāb al-Isṭamāṭīs and its many names, where much of that comes from.”',
    'NĪRANJ': '“A Persian word. It means a working, a charm, or the object that holds the working. You will not find it in Cicero.”',
    NIRANJ: '“A Persian word. It means a working, a charm, or the object that holds the working. You will not find it in Cicero.”',
    SPIRITS: '“The Arabs say every planet has spiritual beings who can be persuaded to descend, if the matter is fitting and the hour is right. I translate; I do not conjure.” He thinks. “Not often.”',
    HERMES: '“There are Hermeses and Hermeses. The Greek one and the Arabic ones are cousins who never met.”',
    BYE: '“Close the shutter as you go, the draught eats the pages.”',
  },
  imam: {
    greet: 'In the shade of the mosque court a scholar is reading.',
    NAME: '“A reader of books, like you.”',
    JOB: '“I teach the sciences of the tongue, and sometimes the stars, when no one is listening.”',
    STARS: '“God made the planets instruments, not masters. Those who forget that end up bowing to Saturn.”',
    DESERT: '“Many have gone out there to find God. Some find something else and give it God’s name.”',
    BYE: '“Peace.”',
  },
  gardener: {
    greet: 'The palace gardener is tying up roses.',
    NAME: '“Only the gardener. The palace has kings; the garden has me.”',
    JOB: '“I tend the garden for a KING who never looks at it.”',
    KING: '“A form of a kingdom, as if a kingdom were a rose.” He shrugs. “It will fall like one.”',
    BYE: '“Mind the thorns.”',
  },
  gatekeeper: {
    greet: 'The gatekeeper leans on his spear.',
    NAME: '“Gatekeeper. Only that.”',
    JOB: G => G.flag('vision') ? '“The east gate stands open for you, my lord, though God knows why you want the DESERT.”' : '“No one goes out to the DESERT without a reason, my lord, and you have a warm house and a full table.”',
    DESERT: '“Sand, rock, and hermits who talk to the air. Thirty years, some of them.”',
    BYE: '“My lord.”',
  },
  child: {
    greet: 'A child stares at your fine clothes.',
    NAME: '“I’m not telling.”',
    JOB: '“I’m a child. That is my whole job.”',
    MOON: '“My grandmother says the Moon helps anyone. Even me.”',
    BYE: 'The child runs off.',
  },

  // ------------------------------------------------------------ desert
  caravaneer: {
    greet: 'A caravan merchant squats in the shade of his tent, eating dates.',
    NAME: '“My name would only mean a debt to you.”',
    JOB: '“I carry everything a HERMIT might want and a few things he should not. Say BUY.”',
    HERMIT: '“You holy men are my best customers. Lead, tin, incense, parchment. What do you do with it all out here?”',
    BUY: G => { G.shop('caravan'); return '“Look, then.”'; },
    OASIS: G => G.flag('barren') ? '“Something killed the palms. Something no fire could do. I will not stay long.”' : '“The water is sweet. The palms bear. May it last.”',
    BYE: '“Peace on the road.”',
  },
  reader: {
    greet: G => { G.set('met_reader'); return 'A black-robed cleric stands at a lectern in the sand, which makes no sense. He looks at you as if he has already read how you end. “So you are the one from SEVILLE.”'; },
    NAME: '“I am a reader from PARIS. In a few years I will be its bishop. You will have been dead for decades. We do not keep to the same time, you and I, but we are in the same BOOK.”',
    PARIS: '“The schools. A bishop can see a heresy coming the way a sailor sees weather.”',
    SEVILLE: '“You claim thirty years in the desert with spirits. The fathers went into the desert to FIGHT such beings, not to befriend them.”',
    JOB: '“I am writing a book on the universe. I am rebutting yours, chapter by chapter.”',
    BOOK: '“Your book is incomplete. Mine is not. On my lectern you will find what your book said of the TWELVE ORDERS before it was cut short.”',
    TWELVE: '“Four elemental, seven planetary, and one for Urania. Twelve orders of spirits, arranged like beasts in a bestiary.”',
    ORDERS: '“Four elemental, seven planetary, and one for Urania. You will find the elemental ones by their STONES, now that you know to look.”',
    STONES: G => { G.set('william_twelve'); return '“Earth in a cave to the southwest. Water in a spring to the east. Fire among the vents to the south. Air on a high rock past the dunes. Go and read them, and see how much they resemble demons.”'; },
    FIGHT: '“They inhabit deserts. They descend. They answer magicians’ prayers. They have no ANGELIC names. What else would you call them?”',
    ANGELIC: '“Michael, Gabriel, Raphael. Yours are called ‘the rotators of the sphere of the Moon’. Rotators!”',
    DEMONS: '“Call them what they are. Planetary IDOLATRY, dressed up in Plato’s cloak.”',
    DEMON: '“Call them what they are. Planetary IDOLATRY, dressed up in Plato’s cloak.”',
    IDOLATRY: '“You say they are created continually out of God’s generosity and sent down into natural things, where a clever man can pick them up like coins. That is Saturn wearing a halo.”',
    WATCH: '“I go where the smoke is. Burn less incense.”',
    FOLLOW: '“I go where the smoke is. Burn less incense.”',
    SCHOOL: '“You will gather disciples. They will form schools of necromancy. I am certain of it.”',
    CALCIDIUS: G => {
      if (!G.doctrine('calcidius')) return '“You have not read him. Do not quote what you have not read.”';
      if (G.flag('argued_calcidius')) return '“We have had this argument already.”';
      G.set('argued_calcidius'); G.suspect(-15, null, -10);
      return 'You answer that Calcidius makes the airy beings go-betweens, neither angels nor demons, bound by passibility. He is silent for a long moment. “Clever. Cleverness is not innocence.” (Suspicion −15, floor −10)';
    },
    APULEIUS: '“A pagan novelist who turned a man into an ass. That is your authority?”',
    SPIRITS: G => G.stat('suspicion') >= 50 ? '“Demons. I have watched you. Demons in lead and copper.”' : '“You believe they are neither angels nor demons. There is no third thing.”',
    BYE: '“We will meet again. I will be the one holding the pen.”',
  },
  gaoler: {
    greet: 'The gaoler watches you through the bars with no interest at all.',
    NAME: '“Doesn’t matter.”',
    JOB: '“Keeping you. Paris wants you kept until it decides what you are.”',
    OUT: '“Not by asking. Some say a man with powerful friends walks out. Others say there are herbs that open deadly places.”',
    BYE: 'He does not answer.',
  },
};

// Shop inventories
L.SHOPS = {
  metals: ['silver', 'quicksilver', 'copper', 'gold', 'iron', 'tin', 'lead', 'stylus', 'mirror'],
  herbs: ['myrtle', 'incense', 'bread', 'dates', 'parchment', 'shoes'],
  caravan: ['silver', 'quicksilver', 'copper', 'gold', 'iron', 'tin', 'lead', 'incense', 'parchment', 'shoes', 'myrtle', 'mirror', 'bread', 'stylus', 'water'],
};

// ------------------------------------------------------------ spirit conversation (needs Apuleius)
// Built per planet at talk time; see engine talkSpirit().
L.SPIRIT_TALK = {
  greet: p => ({
    moon: 'A pale spirit turns toward you. Its rotation is quick and generous. It will help you without asking who you are.',
    mercury: 'A quick spirit flickers at the edge of sight, waiting for a well-turned sentence.',
    venus: 'A warm spirit leans close, and your pulse answers before you do.',
    sun: 'A bright presence stands before you, too large for its place, like a word too big for a sentence.',
    mars: 'A spirit with a blighted look measures you as it would an enemy.',
    jupiter: 'A mild spirit greets you as if it had known you once.',
    saturn: 'A gloomy spirit hangs in an earthy cloud. Near it, even your thoughts go idle.',
  }[p]),
};
