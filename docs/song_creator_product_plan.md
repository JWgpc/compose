# Song Creator Product Plan v1

This document translates the songwriting spec into an actual product plan.

---

## 1. Product positioning

### Working product name
- `Song Creator`
- alt names:
  - `HookLab`
  - `Melody Forge`
  - `AI Song Sketcher`

### Product definition
A lightweight AI-assisted song composition tool that helps users:
- choose a style and mood
- generate a song structure
- generate chords and melody strategy
- visualize the result in a piano-roll-like editor
- edit sections manually
- preview and export the song sketch

### What it is **not** in v1
- not a full FL Studio replacement
- not a professional mixing/mastering suite
- not a realistic human vocal production system
- not a full marketplace of plugins

### What it **is** in v1
A smart sketchpad for:
- songwriting
- topline drafting
- chorus ideation
- chord/melody experimentation
- rapid demo creation

---

## 2. Target users

### Primary users
#### A. beginner creators
People who:
- have ideas but cannot fully arrange music yet
- want “generate me a chorus” or “give me a chord progression”
- need structure guidance

#### B. singer-songwriters
People who:
- already write lyrics or melodies
- want harmonic suggestions
- want alternative chorus ideas
- want a visual tool to test structure

#### C. producers / beatmakers
People who:
- need quick sketch generation
- want inspiration, not full replacement
- may export MIDI to a DAW later

### Secondary users
- content creators needing quick background song ideas
- hobby musicians
- music students studying pop songwriting

---

## 3. User promise

### Core promise
"Give me a song idea that already feels like a real pop song, not random notes."

### Product promise
The product should help the user move from:
- vague idea → clear song plan
- clear song plan → editable structure
- editable structure → playable sketch

---

## 4. Main user flow

## Flow A: idea to song sketch
1. User opens app
2. User selects style / mood / tempo / key preferences
3. User chooses hook type or lets system choose
4. User clicks `Generate Song`
5. System outputs:
   - section structure
   - chord plan
   - melody strategy
   - initial notes
6. User sees piano roll + section timeline
7. User auditions the result
8. User edits or regenerates a section
9. User exports MIDI / JSON project

## Flow B: chorus-first workflow
1. User says: "I want a catchy chorus"
2. System generates chorus strategy first
3. User approves or regenerates chorus
4. System builds verse / pre-chorus around it
5. User edits full song structure

## Flow C: reference-guided workflow
1. User chooses a reference direction like:
   - title-hook pop
   - riff-first synth-pop
   - mandopop ballad
2. System adapts generation strategy to that family
3. User refines manually

---

## 5. v1 feature set

## 5.1 Core input controls
The left panel should include:
- style
- mood
- BPM
- key
- mode (major/minor)
- hook type
- section template
- phrase length
- chorus lift type
- title / theme (optional)

### Suggested v1 controls
#### dropdowns
- Style
- Mood
- Hook Type
- Section Template
- Chorus Lift Type

#### sliders / numeric inputs
- BPM
- Phrase Length (default 4 bars)

#### optional text fields
- Song title
- Theme prompt
- Lyric idea

---

## 5.2 Core output views

### A. Song strategy card
Show:
- selected style
- mood
- BPM
- key
- section form
- hook type
- chorus lift

Purpose:
Make the generated plan legible before the user dives into notes.

### B. Section timeline
A horizontal timeline with blocks like:
- Intro
- Verse
- Pre-Chorus
- Chorus
- Bridge
- Outro

Each block should show:
- section name
- bar count
- chord loop label
- whether it contains main hook

### C. Piano roll / note editor
Main workspace.
Should show:
- bar grid
- pitch lanes
- melody notes
- optional chord blocks / ghost notes
- section boundaries

### D. Chord lane
Above or below piano roll:
- displays per-bar chord names
- editable
- supports regenerate section from updated chords

### E. Hook highlight
A subtle visual highlight showing:
- where main hook occurs
- where title phrase lands
- where post-chorus or riff hook lives

---

## 5.3 Core actions

### Global actions
- Generate Song
- Regenerate Whole Song
- Save Project
- Export MIDI
- Export JSON
- Play / Pause / Loop Section

### Section actions
- Regenerate Verse
- Regenerate Chorus
- Regenerate Bridge
- Duplicate Section
- Delete Section
- Change section bar count

### Note-level actions
- drag note
- resize note
- delete note
- duplicate note pattern
- quantize section

---

## 6. Recommended page layout

## Desktop layout
### Left sidebar: generation controls
Contains:
- song settings
- generation options
- quick presets

### Center: timeline + piano roll
Top:
- section timeline
Bottom:
- piano roll editor

### Right sidebar: inspector
Shows selected:
- section info
- chord plan
- hook details
- regeneration controls

### Bottom transport bar
Contains:
- play
- pause
- stop
- loop
- BPM
- current bar

---

## 7. Key product modules

## 7.1 Strategy Engine
Responsible for generating:
- section form
- hook type
- chorus lift plan
- phrase defaults

## 7.2 Harmony Engine
Responsible for:
- chord loop selection
- per-section chord plan
- bridge contrast

## 7.3 Melody Engine
Responsible for:
- motif creation
- phrase contour
- note generation aligned to harmony

## 7.4 Playback Engine
Responsible for:
- preview playback
- metronome/grid sync
- looping selected sections

## 7.5 Project Model
Responsible for storing:
- strategy
- sections
- chords
- notes
- user edits

---

## 8. v1 UX principles

### Principle 1: Strategy first, notes second
Before the user sees many notes, show the song plan.
That makes generation feel intentional instead of random.

### Principle 2: Regenerate locally, not globally by default
Users should be able to regenerate:
- just the chorus
- just the verse
- just the bridge

This is important because users often like 70% of a generation and only want to fix one part.

### Principle 3: Make hooks visible
The UI should help users understand:
- where the hook is
- whether it is title-based, riff-based, or post-chorus-based
- why the chorus is supposed to work

### Principle 4: Keep the interface lighter than a DAW
Do not overwhelm users with:
- mixer channels
- plugin racks
- routing graphs
- automation lanes

Version 1 should feel more like:
- Figma for song ideas
than like:
- a professional studio control room

---

## 9. Suggested v1 presets

### Preset: Mainstream Pop
- style: mainstream_pop
- hook: title_hook
- section: verse-pre-chorus-chorus-bridge
- phrase length: 4 bars
- lift: mixed

### Preset: Sad Ballad
- style: pop_ballad
- hook: melodic_hook or title_hook
- lift: longer_notes + higher_register
- slower BPM

### Preset: Dance Pop
- style: dance_pop
- hook: post_chorus_hook
- lift: more_repetition + bigger_arrangement

### Preset: Riff Song
- style: synth_pop or funk_pop
- hook: riff_hook
- lift: denser_rhythm or bigger_arrangement

### Preset: Mandopop Love Song
- style: mandopop_ballad
- hook: title_hook
- lift: higher_register + longer_notes

---

## 10. MVP scope

### Must-have
- create project
- choose style/mood/BPM/key
- generate song strategy
- generate section blocks
- generate melody + chords for one lead track
- piano roll display
- playback
- section regeneration
- MIDI export
- JSON export

### Nice-to-have if time allows
- bass track
- drum track
- simple lyric slot placeholders
- multiple presets
- project autosave

### Not in MVP
- full audio effect rack
- vocal synthesis
- advanced orchestration
- collaboration
- cloud sharing
- mobile editor parity

---

## 11. Recommended interaction details

## 11.1 First-run experience
When user opens the app:
- show 3 preset cards
  - Generate a pop chorus
  - Generate a sad ballad
  - Generate a dance-pop hook

This is much better than showing a blank piano roll.

## 11.2 Empty state
Text suggestion:
> Start with a style, mood, and hook type. We’ll build the song plan first, then the notes.

## 11.3 Regeneration UX
When user clicks regenerate chorus:
- keep chord option toggle
- or regenerate both chords + melody
- preview before replacing current chorus

This avoids destructive frustration.

---

## 12. Data model implications for product

A project should store at least:
- project metadata
- song strategy
- section list
- chord plan by section
- melody notes by section
- undoable user edits

Example shape:
```json
{
  "projectName": "Untitled Song",
  "strategy": {},
  "sections": [],
  "tracks": [
    {
      "name": "melody",
      "notes": []
    }
  ],
  "chords": {},
  "version": 1
}
```

---

## 13. Technical product recommendation

### Recommended front-end
- React
- TypeScript
- Tone.js for playback
- canvas/SVG piano roll

### Recommended architecture
- front-end for editing and playback
- generation service for strategy/chords/melody
- shared JSON project format

### Why this is good
- easy to prototype quickly
- browser-based
- export-friendly
- can become desktop later via Electron

---

## 14. Success criteria for v1

The product is successful if a user can:
1. generate a song in under 30 seconds
2. understand the generated structure visually
3. hear a clear difference between verse and chorus
4. identify the main hook
5. edit at least one section easily
6. export the result into another workflow

### Practical quality test
A generated result should pass if the user can say:
- "I get what this song is trying to do"
- "The chorus feels like a chorus"
- "There is a memorable hook"
- "I can actually continue working from this"

---

## 15. Suggested roadmap after MVP

### Phase 2
- multi-track generation
- bass + drums
- lyric slot planning
- more section-level controls

### Phase 3
- lyric generation
- vocal melody alignment tools
- arrangement presets
- audio rendering improvements

### Phase 4
- collaboration
- reference-song mode
- style transfer assistance
- singing synthesis handoff

---

## 16. Recommended next design artifacts

After this product plan, the next useful outputs are:
1. wireframes
2. component list
3. user stories
4. project JSON schema
5. MVP task breakdown

---

## 17. Final product direction

Version 1 should feel like:
- an AI songwriting sketchpad
- with visible structure
- controllable hook strategy
- editable sections
- fast iteration

That gives the user something genuinely useful much earlier than trying to build a full DAW from day one.
