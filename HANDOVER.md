# Handover: current state (2026-09-28)

Read `DESIGN.md`, `DECISIONS.md` and `research/SOURCES.md` first.

## State: playable end to end, local only

- Run it with the launch config `liber-spirituum` (port 7566, `python -m http.server`), or open `index.html` directly (classic scripts, so `file://` works).
- `tools/playthrough.js` is a scripted run from Dee's desk to the empty seat through the real UI. It makes 78 checks. Last run (2026-09-28): 78/78 passed, no exceptions. It clears `liber_bones` in localStorage at the start and leaves one entry behind. To run it, load a fresh page, then:
  `fetch('tools/playthrough.js').then(r=>r.text()).then(eval)`, and read `window.__result`.
  It gives materials and skips walking. Every rule check (hours, delegation, §37, the peony hour, Jupiter's refusal, the wrong-hour failure, ruler questions) runs for real.
- Bump `?v=N` on the script tags in `index.html` after editing JS. The browser caches aggressively.

## Added 2026-09-28 (from `docs/RPG_STRUCTURES.md`, researched from `E:\pdf\game design`)
- **Discernment of spirits:** free spirits start unknown and are identified by their behaviour. Look at one to name its order. The codex has a *discernment* tab as a field guide. Ambient spirits of every order now live in the desert.
- **The abbey:**
  - Redated to c.1315.
  - Presses I–X, with a catalogue from the armarius.
  - The Asclepius is in press X, where the prior patrols as circator during lectio.
  - Macrobius is on the refectory lectern.
  - Apuleius is lent by the master of novices. Copy it at the carrel (M) or lose it. Return it by Compline.
  - The horarium puts the brothers in choir during the Hours.
  - A Prior bar tracks his opinion; the abbey is exempt from William.
- **William's floor:** the gravest acts ratchet a floor that prayer cannot lower. Only Jupiter and Calcidius lower it.
- **Readers' verbs:** each layer has its own verbs and its own inventory.
- **Purity:** an impure invoker gets a grudging spirit. Prayer gives graded messages.
- **Lunar spirits** now come to your side and stay there, as §33 says.
- **Rest refuses** if you would faint before the hour.

## Added 2026-09-28, second pass
- **D, the return:** the seat writes the book (an item). You carry it down sphere by sphere while every legion attends you, and the Reader waits at the bottom. Use the book to give it to the caravan, surrender it to the Reader, or seal it in the hermitage. Each has its own transmission text.
- **F, the Reader walks:** he goes toward the site of your latest suspect act while Suspicion is 20 or more, and goes home when it falls. He answers WATCH/FOLLOW.
- **G/H, Dee's epilogue:** you underline three passages, and the game sets them beside Dee's real marginalia (§16 note, §23, §29 mirror) with no score. Then you Record Kelley's three reports (after the diary: 15 and 19 Mar 1582, 14 June): record with the hour, record as "E.K. said", or leave blank. The verdict states the dispute and does not resolve it.
- **I, bones:** each finished reading is saved to `localStorage['liber_bones']` (last 5). The next run's Thomas finds its gloss in the margin of fol. 169r, and Dee sees the previous underlining.
- **C, Lent:** the game starts on the Sunday before Lent. Days 3–5, 06:00–18:00, the collection is laid out in the chapter house and you take one book for the year with no circator watching (`allotted`). The armarius answers LENT, and the monk's rest menu has "until Lent".

## Files
`js/data.js` correspondences · `js/maps.js` maps · `js/npcs.js` dialogue · `js/engine.js` core, rendering, input · `js/magic.js` operations · `js/spirits.js` behaviour and spheres · `js/story.js` frame, ascent, endings · `js/main.js` title

## Not verified / known gaps
- Nobody has played it by hand at human pace. Pacing (how long Remembrance takes to build, flesh drain) is untuned.
- Narrow layout: the CSS stacks below 900px. Checked at about 740px wide (2026-09-28) and it renders. Phone width has not been checked. The game is keyboard-first anyway.
- All twelve structures in `docs/RPG_STRUCTURES.md` are now built or folded in.
- Mercury blockers step aside by ±1 row and can land on void tiles. Harmless, but untidy.
- Not deployed. Per workspace policy it would go to GitHub Pages. It needs no base-path handling because every path is relative.
