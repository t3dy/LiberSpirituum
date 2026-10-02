# RPG structures mapped onto the Liber's readers

EXTRACTOR document: design-book structures → the historical places and procedures of our four
figures → candidate mechanics. It draws on four notes files in `C:\Dev\research-artifacts\`:

| key | file |
|---|---|
| **RL** | `roguelike-structures.notes.md` (Harris, Craddock, Wolverson, Garzia) |
| **RPG** | `rpg-adventure-structures.notes.md` (Adams, Perez, Tyers, Serpa, Montfort, *Story Mode*) |
| **HT** | `historical-thematic-design.notes.md` (Suckling's *Paper Time Machines*, Shipp, Fullerton) |
| **PP** | `liber-readers-places-procedures.notes.md` (Page's St Augustine's, the Dee docs) |

Every row has to pass the workspace gate: **a player can recover the symbolism from the
behaviour without being told** (`PIPELINE.md`). That is the "legible?" column.

## What the design corpus lacks, and why it matters

None of the design books models religious or magical practice, reagents, calendars or planetary
hours, a keyword parser, virtues, or a suspicion track (RPG gaps table; HT "coverage caveat").
Those are the parts the Liber and Page supply. The design books contribute the **skeleton**: the
roguelike altar, the identification game, the knowledge gate, the index track, asymmetric verbs.
The sources contribute the **procedures** hung on that skeleton. The design books are never the
authority on what magic *is*.

## The mapping

### A. The identification game → identifying spirits by their behaviour
- **Structure.** Items look alike until identified. Identification comes by use, by a scroll, or by
  indirect evidence such as price, altar tests or watching monsters. Harris's rules are no cyanide,
  masquerade, situational advantage, and a two-sided coin (RL §3).
- **Historical procedure.** The Liber's whole claim is that each order is known by *how it
  descends and behaves*:
  - Saturnine spirits go gloomy and idle among the refuse (§44).
  - Jovials run lightly back to their roots (§45).
  - Martians war on each other (§27).
  - Lunars help without distinction (§33).

  William's rival claim is that they are all demons. Dee's actions turned on the same problem,
  whether the figure in the stone was who it said it was, and Kelley's sincerity is still disputed
  (PP §2).
- **Mechanic.**
  - Free spirits in the desert appear as **an unknown spirit** (a grey `?`) until identified.
  - **Watching** identifies one: Look at a spirit while it performs its characteristic act and its
    order is revealed, with the § quoted.
  - **Talking** identifies one if Apuleius has been read.
  - The codex entries on behaviour are the field guide.
  - **Two-sided coin:** an unknown spirit can still be talked to or exorcised.
  - **Masquerade:** Moon and Mercury spirits both move constantly. You tell them apart only by
    whether they come to you (the Moon's do) or ignore you (Mercury's).
  - **No cyanide:** nothing unidentified can kill you. Martians sting before they are known.
- **Legible?** Yes. This is the gate in its purest form: the player learns the Liber's taxonomy
  *by watching it happen*.
- **Build: NOW.**

### B. Altar, prayer timeout and luck → the Hours and purity
- **Structure.** NetHack prayer fixes troubles on a hidden timeout, gives graded messages, and
  works better at a co-aligned altar. Sacrifice lowers the timeout. Luck is a hidden conduct meter
  (RL §5).
- **Historical procedure.** The Benedictine horarium (PP §1). Northgate's belief that disciplined
  asceticism is prerequisite to safe invocation (Page L171–175). The Liber's "worthy" (§6). Dee
  opened every action with prayer (PP §2).
- **Mechanic.**
  - Prayer gets a hidden **cooldown** with graded replies: "your words fall on stone" means too
    soon; "a stillness answers" means ready.
  - Prayer at an altar during a canonical Hour (Lauds, Vespers, Compline…) lowers Suspicion more
    and raises Purity.
  - **Purity gates invocation.** The rulers delegate less willingly to the impure: below a purity
    threshold the delegated spirit arrives unwilling.
- **Legible?** Partly. The graded messages must carry it. Harris's warning about unreadable
  timeouts applies (RL §5).
- **Build: NEXT.** A small version (graded messages, purity → willingness) is in this slice.

### C. Time clocks and calendar effects → planetary hours, the horarium, Lent
- **Structure.** Food clocks force progress (Rule 7). NetHack reads the real date: moon phase,
  Friday the 13th, midnight. Harris warns that a game changing "every hour" puts a calendar in the
  spoilers (RL §6). Adams handles schedules as placement conditioned on time (RPG §9).
- **Historical procedure.** Planetary hours (the Liber §37 "helping symmetry"). The monastic
  horarium with fixed lectio divina hours. **Each monk received one book at the beginning of
  Lent, when the collection was brought into the chapter house** (PP §1).
- **Mechanic.**
  - The hermit's planetary hours are already built. Harris's warning is answered by making them
    **the** subject, and by always showing the sky bar and the "rest until the hour of…" command.
  - **Abbey horarium.** The monks keep the Hours: they are in the church at Hours and in the
    cloister or library during lectio. Reading magic outside lectio, or while the prior is in the
    library, raises the abbey's suspicion.
  - **Lent.** On the Lent book-day the collection is brought to the chapter house, and the armarius
    lets you take any one book. That is how the restricted Asclepius is reached without borrowing
    it.
- **Legible?** Yes. The schedule is visible in where people stand.
- **Build: horarium NOW** (NPC placement by hour and a lectio rule). **Lent: LATER.**

### D. Descent and ascent; the return trip → the spheres and the author's return
- **Structure.** Depth sets difficulty. Rule 8 is a "race you can't win". In NetHack the rules
  change on the return trip with the Amulet (RL §7).
- **Historical procedure.** The ascent through the spheres. §6: the author returns from his
  companions to transmit what he learned to the worthy, "a shoot benefiting others".
- **Mechanic.** The ascent is already built. **Return trip:** after the seat, you descend carrying
  the book you have written, and every sphere's legions now attend you. The Reader from Paris waits
  at the bottom.
- **Legible?** Yes.
- **Build: LATER.** It needs a second ending pass.

### E. The knowledge gate (instrument + text + place) → the library by shelfmark
- **Structure.** Perez's Compass plus treasure notes: an instrument, a text that must be read, and
  an act at the right place (RPG §5). Library gates: a bookcase yields a book once (RPG §5).
- **Historical procedure.** St Augustine's shelfmarks give **distinctio** (press) and **gradus**
  (shelf), and books are arranged by subject. Magic sits among astronomy, astrology and medicine,
  not hidden. Books also lived **elsewhere**:
  - on the high altar;
  - in a cloister cupboard;
  - in the dormitory chapel;
  - in the refectory;
  - in the custody of the cantor, sacristan and master of novices.

  (PP §1.) CCC 125 carried *two* conflicting shelfmarks in distinctio 10.
- **Mechanic.**
  - The armarius hands you the **catalogue** (an item). It lists each doctrine as a shelfmark, such
    as "Asclepius — D.10 gr.3 (collectiones)".
  - The presses are **numbered on the map**, so you find a book by reading its shelfmark.
  - Some books are elsewhere in the abbey:
    - The Macrobius is read aloud at meals in the refectory.
    - The Timaeus is with the cantor.
    - The Apuleius is in the novice-master's keeping.
  - The catalogue says where. Getting a book from a custodian means *asking* for it by keyword.
- **Legible?** Yes. It teaches how a medieval library actually worked.
- **Build: NOW.**

### F. The index track as argument → William, with a ratchet
- **Structure.** *Crisis: 1914*: one act earns Prestige and Tension, and Belligerence raises a
  Tension **floor** that never falls. *Peace 1905*: winning too hard. HT §5 warns against belief
  as weather, meaning a critic who only rolls dice (HT §15, §5).
- **Historical procedure.** William objected to the *philosophical justification* as much as to
  the practice (Essay §17). Parry: reputation is manufactured, as in Murphyn's slanders (PP §2).
  St Augustine's was **exempt from episcopal control** (PP §1).
- **Mechanic.**
  - **Suspicion floor.** The gravest acts raise a floor that prayer cannot lower: using the love
    charm, blighting the oasis, possession by a spirit. Only the Jupiter image (the favour of the
    powerful) or the Calcidius argument can lower it.
  - **Paired reward.** Violent conjuration gives a spirit *now* and raises the floor a little.
  - **The Reader is not weather.** He moves toward the site of your latest suspect act, which you
    can see, and his quire answers your arguments.
  - **Exemption.** In the abbey, William's suspicion cannot rise (the house is exempt). The
    *prior's* opinion is local and separate.
- **Legible?** Yes. The floor is drawn as a dark segment on the bar.
- **Build: floor NOW.** Reader movement LATER.

### G. Asymmetric verbs → three readers, three verb sets
- **Structure.** In the COIN games, action names state each faction's worldview: the Raj Sweeps,
  Congress practises Satyagraha. Viewpoint comes from restricting knowledge and control (HT §4).
- **Historical procedure.**
  - The hermit: *invoke, conjure, make, vivify*.
  - Thomas: *read, copy, compile, borrow, donate*. The customary's two categories of book, library
    books and his own acquisitions, both go to the precentor at death (PP §1).
  - Dee: *acquire, annotate, record, petition*. Dee never scried himself; Kelley did (PP §2).
- **Mechanic.**
  - The command bar relabels per layer.
  - Thomas's `M` becomes **Copy**: copying a doctrine into your own quire makes it yours even
    after the book goes back.
  - Dee's `V` becomes **Record**: in the Dee epilogue you do not see spirits. Kelley reports them
    and you choose which report to write down.
- **Legible?** Yes. The verbs *are* the argument.
- **Build: relabelling NOW.** Dee's Record scene LATER.

### H. Fragmentary sources → the lacuna and player-assembled readings
- **Structure.** *Endurance* shows through absence. *Obra Dinn* and *Her Story* have a fixed past
  and a reading the player assembles. Miller's "rational basis-of-estimate" for known unknowns.
  Mark speculation as speculation (HT §17). *Her Story*'s search interface as conversation
  (RPG §8).
- **Historical procedure.** The MS breaks off at §45. The elemental orders survive only through
  William. Dee underlined §23 and the mirror (PP; Essay).
- **Mechanic.**
  - The diegetic lacuna is already built, with provenance tags.
  - **Dee's marginalia:** in the epilogue the player underlines three passages from the codex, and
    the game compares them with what Dee actually underlined. There is no score, only the
    comparison.
- **Legible?** Yes.
- **Build: LATER** (with G's Dee scene).

### I. Bones (world carry-over) → transmission of the manuscript
- **Structure.** NetHack's bones: a later game finds your ghost and your cursed goods (RL §19).
- **Historical procedure.** CCC 125's later life. A late-fourteenth-century monk recopied its
  faded words. Clement Canterbury added contents lists. Dee acquired and annotated it (PP §1–2).
- **Mechanic.** A finished run's ending (theurgy or necromancy) is written as a gloss into the
  next run's manuscript. The next Thomas finds the previous hermit's warning in the margin, and
  the Glossulae warning quotes it.
- **Legible?** Yes. Harris's caution against meta-progression doesn't bite, because this gives
  text, not power.
- **Build: LATER.** Small.

### J. Vaults → the restricted press and the tower
- **Structure.** Out-of-depth danger with matching reward (RL §9).
- **Historical procedure.** Distinctio 10 and the *collectiones*, where the magic volumes sat.
  Tempier's list.
- **Mechanic.** Reading in distinctio 10 when the prior is present raises the prior's opinion
  sharply. That press also holds the best book (the Asclepius).
- **Build: folded into E.**

### K. Riddle → the rulers' questions
Montfort holds that solving means *explaining*, that the contract must be fair, and that neck
riddles are bad (RPG §6). Every ruler's answer is recoverable from the codex text for that order.
This already exists. The rule going forward: an answer must never require knowledge the game has
not shown.

### L. Ask/tell with memory → keyword talk
In *Galatea*, topics are remembered and mood is tracked (RPG §8). Nelson's bill of rights asks for
synonyms (RPG §6). The keyword system already exists and matches on 4-letter prefixes. **Add:**
topics already covered are shown dimmed in the keyword bar.

### Rejected
- **Permadeath.** It conflicts with a 30-year arc and a nested frame. The run *is* the manuscript.
- **XP levels.** Harris and Brogue: exploration *is* advancement (RL §15). Remembrance already does
  this.
- **Random overworld.** Harris: none has worked (RL §11). The desert stays fixed and seeded.

## Build slice (this pass): BUILT 2026-09-28, verified by `tools/playthrough.js` (68/68)

1. **A.** Spirit identification by behaviour.
2. **E.** The catalogue and shelfmarks; books placed around the abbey; asking custodians.
3. **C.** The abbey horarium: NPC placement by hour, and lectio.
4. **F.** The suspicion floor (ratchet), and exemption in the abbey.
5. **G.** Per-layer verb labels.
6. **B, small version.** Graded prayer messages; purity affects the willingness of delegated
   spirits.
7. The monk's date corrected to c.1315 (PP §1: CCC 125 was compiled after c.1305–7).

## Second pass (2026-09-28): D, F (Reader movement), G/H (Dee's Record and marginalia), I, and C (Lent) BUILT. Verified 78/78.
