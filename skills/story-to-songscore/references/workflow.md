# Story → SongScore workflow

Use this workflow when the user provides a theme, scene, synopsis, prose story, emotional arc, or character moment and wants a playable/importable score.

## 1. Extract story signals

Pull out:
- setting / imagery
- emotional arc
- pacing
- relationship dynamics
- key symbols or sound objects
- ending quality (resolved, suspended, tragic, warm, bright)

Good examples:
- rain, clock, music box, old shop
- reunion, hesitation, confession, relief
- memory, fate, time, moonlight

## 2. Map signals to musical decisions

Translate the story into these score-level choices:
- `tempoBpm`
- `key`
- section plan
- chord palette
- texture plan
- melodic contour
- climax placement

Useful heuristics:
- rain / memory / nostalgia → slower tempo, maj7/min7, wider spacing, more rests
- mystery / hesitation → sus chords, delayed cadences, softer openings
- warmth / intimacy → lyrical right hand, broken-chord left hand, moderate register
- revelation / recognition → rising contour, brighter voicing, denser harmony
- gentle happy ending → resolve to tonic or tonic color chord (`C`, `Cmaj7`, etc.)

## 3. Build section structure

Prefer a simple narrative form for piano demos:
- intro: establish space
- verse: first scene or emotional setup
- verse/bridge: development or recognition
- bridge: special event or symbolic object waking up
- chorus: emotional payoff / title theme
- outro: gentle landing

Typical sizes:
- intro 4 bars
- scene sections 4–8 bars
- chorus/payoff 4–8 bars
- outro 4 bars

## 4. Choose track roles

Minimum for expressive piano:
- `rightHand` as melody
- `leftHand` as chords

Default approach:
- left hand = broken chords, roots, fifths, wide spacing
- right hand = melody, occasional doubled intervals on key beats
- default instrument plan = `realistic-piano` only
- optional support plan, when explicitly requested = add `vpo-cello-solo-sustain` and/or `vpo-flute-solo-sustain` without displacing piano from the lead role

## 5. Write chord lane first

Write one chord event per bar unless the story needs faster change.

Reliable palettes:
- nostalgic / warm: `Cmaj7`, `Am7`, `Fmaj7`, `Gsus4`, `Dm7`, `C/E`, `G/B`
- more wistful: add `Em`, `Am`, `Dm7`, occasional suspended harmony
- avoid overcomplication unless the user explicitly wants jazzier harmony

## 6. Write note events by role

### Left hand
Use broad, singable accompaniment:
- bars with breathing room in intros and outros
- denser quarter-note motion in climaxes
- root → fifth/third → upper chord tone is a safe pattern

### Right hand
Write narrative melody:
- leave more space at the beginning
- rise gradually through the middle
- reserve highest notes for payoff sections
- use short high-register figures for music-box / bell / sparkle imagery
- end on stable chord tones

## 7. Add annotations

Use annotations to preserve why the music is shaped this way:
- section_description
- arrangement_hint
- hook_hint

These are useful for later regeneration and editing.

## 8. Produce SongScore JSON

Required top-level fields:
- `schemaVersion`
- `meta`
- `sections`
- `tracks`
- `chords`
- `notes`

Meta minimum:
- `title`
- `composer`
- `tempoBpm`
- `timeSignature`
- `key`

## 9. Import/update in the app

If working in the Song Creator prototype used here:
- update the demo SongScore file under `src/data/`
- wire it into the active preset if needed
- only target currently-supported instruments in this repo: `realistic-piano`, `vpo-cello-solo-sustain`, `vpo-flute-solo-sustain`
- build the app to confirm the score loads
- if browser preview and exported audio disagree, trust the exported render first and debug preview separately before rewriting the arrangement
- commit only the files changed for this score task

## 10. Delivery checklist

Before saying the song is ready, verify:
- at least one section, track, chord, and note exist
- `trackId` values used in notes exist in `tracks`
- climax is audible as a real textural lift, not only a label
- outro actually resolves or intentionally suspends
- build/import path works
