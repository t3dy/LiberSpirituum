# Liber de essentia spirituum: The Twelve Orders

A 1980s-style tile RPG (Ultima V interface: letter commands, direction prompts, keyword
conversation, a scrolling log) built on the anonymous *Liber de essentia spirituum*
(Oxford, Corpus Christi College MS 125, fols. 169r–173r), as edited and translated by
Sophie Page (*Magic in the Cloister*, 2013, ch. 5 and appendix 2) and read by Claire Fanger
(*Invoking Angels*).

Source notes, and the passage-by-passage map from text to mechanic: `research/SOURCES.md`.
Decision ledger: `DECISIONS.md`.

## The frame: three readers, one book

| layer | who | where / when | what you do |
|---|---|---|---|
| 0 | John Dee | Mortlake, 1582 | picks up CCC 125, bought after the Dissolution; opens it at fol. 169r |
| 1 | Thomas Sprot (of Willesborough), monk | St Augustine's, Canterbury, c.1278 | reads the Platonic shelf (each book becomes a **Doctrine** the hermit inherits), sees Tempier's 1277 condemnation posted, opens the Liber at his carrel |
| 2 | the anonymous hermit | Seville, then the desert, then the spheres | the game proper |

You can close the book (`B`) and return to the monk's carrel to read a doctrine you missed.
When the manuscript breaks off, you climb back out through the monk and Dee.

## The gate: behaviour must carry the symbolism

Every mechanic below exists because the text says the cosmos works that way. A player who
plays it should be able to state the Liber's theory without having read it.

| the text says | so in play |
|---|---|
| Rulers are never called down by anyone's incantation; when conjured they **delegate** lower spirits (§23) | `I`nvoke never produces the Ruler. It sends a subordinate who attends you. |
| **Passibility**: the lower the spirit, the more it can be acted on (§14, §17–18) | each spirit has passibility 0–3. `C`onjure fails on 0–1. Rulers (0) can only be petitioned. |
| Three things are needed: **harmonious matter, an obedient spirit, helping symmetry** (§37) | `V`ivify checks all three: the right image, an attending spirit of that planet, and the planet's hour. Missing any one, the spirit "returns at once to the heavens" and you see its glyph rise. |
| Retrograde spirits fall, "less suitable for ruling because of their suffering" (§36) | a planet marked ℞ binds **firmly**: the image never fades. Otherwise it holds a few charges. |
| Jovial spirits "sit conscious of no conjurations" (§45) | Jupiter cannot be conjured. Only offered to. |
| Mercury's spirits, drawn by eloquence and characters, "obey without objection" (§32) | Mercury's image makes conjured spirits stay. |
| The Moon's spirits "help without distinction"; characters on the shoes give a lighter step (§33) | lunar spirits come to anyone at night. The lunar shoes halve travel time and cross the dune sea. |
| Saturnine spirits descend gloomy in an earthy cloud, subject neighbours to **idleness**, and haunt the refuse of dead things (§44–45) | Saturn's spirits gather at the bone field and freeze spirits near them. |
| Martians war on each other; their characters frustrate violent spirits; they bring barrenness to regions (§27) | Martian spirits fight each other and you. Mars characters ward them off, or can blight the oasis, which is the harmful use. |
| Venus spirits pressure marriage and draw in "illicit couplings"; herbs and characters draw love (§31) | the love charm works. Using it is the most suspect thing in the game. |
| Peony: pick it in the hour of the Sun, write the Sun's name and characters around it, address it as Apollo's; it expels demons, wins important men, escapes deadly places (§29) | `G`et refuses outside the Sun's hour. The vivified peony exorcises, persuades, and breaks you out of prison. |
| A mirror of Apollo lets you "live with those living in the light" (§29) | the mirror reveals hidden light-dwellers and the Sun sphere's hidden gate. |
| The Sun's spirit could not be imprisoned in small bulk (§30) | a Sun spirit will not enter a ring. It needs the mirror. |
| The soul is imprisoned like the spirit in the image and forgets (§39–42) | **Remembrance** is your climbing stat. Pleasures of the flesh lower it. Each image you ensoul mirrors your own condition back at you, and raises it. |
| William of Auvergne read the same beings as demons | **Suspicion** is William's reading, laid over the author's. As it rises, spirits are relabelled and redrawn as demons, and NPCs turn. At 100 you are taken. |

## The lacuna is diegetic

The manuscript's planetary-ages section (§24–33) covers all seven planets. Its detailed
section on how each spirit descends when adjured (*immissio*, §43–45) stops after Saturn and
Jupiter. The four elemental orders and Urania's order survive **only in William's hostile
account**.

- Codex entries and sphere maps carry a provenance tag: **MS** (the text), **MS-ages** (the
  ages section only), **WILLIAM** (only his testimony), **RECON** (our reconstruction:
  metals, incense, and the named Venus herb, from general Picatrix-type correspondence and
  not from the Liber).
- Spheres whose descent is lost are drawn with a torn-vellum border.
- The elemental shrines stay unreadable until you have met the Reader from Paris and heard
  William's twelve orders. You learn a third of the cosmos through its enemy.
- The ending is the manuscript breaking off mid-thought.

## Loop

Invoke a Ruler (offering, in its day or hour) → a delegated spirit attends → Talk with it
(needs Apuleius's doctrine of passible daimones) → learn its characters → Make an image
(matter + stylus + characters) → Vivify in the planet's hour (needs the Asclepius) → Wear or
Use it → the image opens the next place → ascend that sphere → the Ruler questions you → go
up.

Ascent order is the medieval one, from the bottom: ☽ ☿ ♀ ☉ ♂ ♃ ♄ then Urania. At the top is
**the empty seat** (§6).

## Interface

- **Keys**: arrows/WASD/numpad move. A letter starts a command, with Ultima-style prompts
  ("Talk — direction?"). `?` lists them all.
- **Mouse**: click a tile to walk there (pathfinding), click an adjacent thing for its
  default action, right-click to Look, hover for a tooltip. The command panel and inventory
  are clickable.
- **Talk**: type keywords (NAME, JOB, BYE…) or click highlighted words.
- **Save**: `Q`, to localStorage. Continue from the title screen.

## Tech

Vanilla JS with no build, classic `<script>` tags under a global `L` namespace (so it also runs
from `file://`), and one canvas. Tiles come from Kenney's CC0 1-Bit Pack
(`assets/kenney-1bit.png`, 16px packed, 49×22). Symbolism uses Unicode planetary, zodiacal,
alchemical and elemental glyphs. Sound is WebAudio blips.
