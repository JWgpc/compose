# Song Creator Wireframes v1

This document defines the page information architecture and low-fidelity wireframes for the Song Creator product.

---

## 1. Screen map

Version 1 should have a very small screen map.

### Core screens
1. Landing / New Project
2. Main Composer Workspace
3. Export / Save Dialog

### Optional light overlays
- Regenerate Section Modal
- Project Settings Modal
- Preset Picker Modal

Keep the app shallow.
Do not fragment the experience across too many screens.

---

## 2. Screen 1 — Landing / New Project

## Purpose
Help the user start fast.

## User goals
- understand what this product does
- start from a preset
- start from scratch
- continue a recent project

## Content blocks
- top brand / product title
- short subtitle
- 3–5 quick-start preset cards
- `Start from Scratch` action
- recent projects list

## Suggested copy
### Title
`Song Creator`

### Subtitle
`Build a song plan first, then shape the melody.`

### Preset cards
- Generate a Pop Chorus
- Make a Sad Ballad
- Build a Dance-Pop Hook
- Start a Mandopop Love Song

---

## Landing page wireframe

```text
+--------------------------------------------------------------------------------+
| Song Creator                                                                   |
| Build a song plan first, then shape the melody.                                |
|--------------------------------------------------------------------------------|
| Quick Starts                                                                   |
|                                                                                |
|  [ Pop Chorus ]   [ Sad Ballad ]   [ Dance-Pop Hook ]   [ Mandopop Love Song ]|
|                                                                                |
|  [ Start from Scratch ]                                                        |
|                                                                                |
|--------------------------------------------------------------------------------|
| Recent Projects                                                                |
|  - Untitled Song 01                                                            |
|  - Summer Chorus Sketch                                                        |
|  - Ballad Draft                                                                |
+--------------------------------------------------------------------------------+
```

---

## 3. Screen 2 — Main Composer Workspace

## Purpose
This is the main product.
The user should be able to:
- control generation
- view structure
- inspect chords
- edit notes
- play and regenerate sections

## Layout overview
Use a 3-column layout plus bottom transport.

### Left sidebar
Generation controls and presets

### Center canvas
Section timeline + chord lane + piano roll

### Right sidebar
Inspector / selected section controls

### Bottom bar
Playback transport

---

## 4. Main workspace information architecture

## Left sidebar contents
### Block A: project summary
- project name
- style
- mood
- BPM
- key

### Block B: strategy controls
- Style dropdown
- Mood dropdown
- BPM input
- Key dropdown
- Mode dropdown
- Hook Type dropdown
- Section Template dropdown
- Phrase Length selector
- Chorus Lift Type dropdown

### Block C: actions
- Generate Song
- Regenerate Whole Song
- Save Project
- Export

### Block D: presets
- Mainstream Pop
- Ballad
- Dance Pop
- Riff Song
- Mandopop Ballad

---

## Center canvas contents
### Top strip: section timeline
Each section displayed as a colored block.
Show:
- section label
- bar count
- hook marker if applicable

### Middle strip: chord lane
Display per-bar chords aligned with timeline.
Allow click-to-edit.

### Main area: piano roll
Display:
- pitch grid
- bar lines
- section boundaries
- melody notes
- optional ghost notes or chord tones

### Optional small top toolbar above piano roll
- snap value
- zoom in/out
- loop current section
- view mode toggle

---

## Right sidebar contents
### If nothing selected
Show song summary:
- hook type
- chorus lift type
- section count
- total bars

### If a section is selected
Show:
- section name
- section bars
- section chord loop
- melody summary
- regenerate section button
- duplicate section button
- delete section button

### If a note is selected
Show:
- pitch
- start
- duration
- velocity

---

## Bottom transport contents
- Play
- Pause
- Stop
- Loop toggle
- Current position
- BPM display
- bar/beat indicator

---

## Main workspace wireframe

```text
+------------------------------------------------------------------------------------------------------+
| Song Creator | Project: Untitled Song | Save | Export                                                 |
|------------------------------------------------------------------------------------------------------|
| LEFT SIDEBAR               | CENTER WORKSPACE                                      | RIGHT SIDEBAR    |
|---------------------------|--------------------------------------------------------|------------------|
| Project Summary           | Section Timeline                                       | Inspector        |
| Style: Mainstream Pop     | [Intro][Verse][Pre][Chorus][Verse][Pre][Chorus][Bridge]| Song Summary /   |
| Mood: Uplifting           |                                                        | Selection Info   |
| BPM: 118                  | Chord Lane                                             |                  |
| Key: G major              | G     D     Em    C    | Em   C   G   D ...            | Hook Type        |
|                           |--------------------------------------------------------| title_hook       |
| Strategy Controls         | Piano Roll                                             | Chorus Lift      |
| Style [v]                 |                                                        | higher_register  |
| Mood [v]                  |  C5  |----|                                            |                  |
| BPM [118]                 |  B4     |--|   |--|                                    | If section sel:  |
| Key [G]                   |  A4  |--|     |----|                                   | - bars           |
| Mode [major]              |  G4        |--|                                        | - chords         |
| Hook [title_hook]         |  F4                                                | | - regenerate    |
| Template [mainstream]     |  E4  |------|                                          | - duplicate      |
| Phrase [4 bars]           |                                                        | - delete         |
| Lift [mixed]              |                                                        |                  |
|                           |                                                        | If note sel:     |
| Actions                   |                                                        | - pitch          |
| [Generate Song]           |                                                        | - start          |
| [Regenerate Whole Song]   |                                                        | - duration       |
| [Save Project]            |                                                        | - velocity       |
| [Export]                  |                                                        |                  |
|                           |                                                        |                  |
| Presets                   |                                                        |                  |
| [Pop] [Ballad] [Dance]    |                                                        |                  |
+------------------------------------------------------------------------------------------------------+
| Play | Pause | Stop | Loop | 01:02 | Bar 9 | BPM 118                                                   |
+------------------------------------------------------------------------------------------------------+
```

---

## 5. Screen behavior details

## 5.1 On first generation
When user clicks `Generate Song`:
1. strategy card updates
2. timeline appears
3. chord lane populates
4. piano roll populates
5. first playback preview becomes available

The experience should feel like:
- plan first
- music second

---

## 5.2 Section selection behavior
When user clicks a section block:
- highlight section in timeline
- highlight corresponding bars in piano roll
- inspector changes to section mode
- regenerate controls target only that section

This is important because section-level iteration is core to the product.

---

## 5.3 Hook visibility behavior
The main hook should be visually marked.

### Possible visual treatments
- small star icon on hook section
- subtle color accent on hook bars
- label like `MAIN HOOK`
- title phrase note highlight

### Why this matters
The UI should teach users why the song works.
It should not hide the hook logic.

---

## 5.4 Regenerate Section modal

## Purpose
Let users regenerate only part of a song without destroying everything.

## Controls
- target section name
- keep chords? yes/no
- keep rhythm? yes/no
- keep contour? yes/no
- variation strength: low / medium / high
- preview before replace

## Wireframe
```text
+--------------------------------------------------+
| Regenerate Chorus                                |
|--------------------------------------------------|
| Keep chords?        [x]                          |
| Keep rhythm?        [ ]                          |
| Keep contour shape? [ ]                          |
| Variation strength  [ Medium v ]                 |
|                                                  |
| [ Preview New Version ]   [ Replace Current ]    |
| [ Cancel ]                                       |
+--------------------------------------------------+
```

---

## 5.5 Export dialog

## Purpose
Help user take the sketch elsewhere.

## Options
- Export MIDI
- Export JSON Project
- Export melody only
- Export with chords

## Wireframe
```text
+--------------------------------------------------+
| Export Project                                   |
|--------------------------------------------------|
| Format                                           |
|  ( ) MIDI                                        |
|  ( ) JSON Project                                |
|                                                  |
| Include                                           |
|  [x] Melody                                       |
|  [x] Chords                                       |
|  [ ] Section markers                              |
|                                                  |
| [ Export ]   [ Cancel ]                          |
+--------------------------------------------------+
```

---

## 6. Screen 3 — Project Settings Modal

## Contents
- project name
- default instrument sound
- default quantization
- default export format
- metronome on/off

This should be lightweight, not a giant settings page.

---

## 7. Mobile stance for v1

Do **not** optimize full editing for mobile first.

### Mobile recommendation
For v1 mobile should support:
- viewing projects
- playback
- simple preset generation

But the full piano roll editing experience should be desktop-first.

---

## 8. UX priorities in wireframe form

### Priority 1
The user should always know:
- where they are in the song
- what section is selected
- where the hook is

### Priority 2
The user should always have a visible path to:
- play
- regenerate
- export

### Priority 3
The UI should avoid DAW intimidation.
Use:
- plain labels
- blocks
- obvious section colors
- minimal controls up front

---

## 9. Recommended component list from the wireframe

### Layout components
- `AppShell`
- `LeftSidebar`
- `WorkspaceCenter`
- `RightInspector`
- `BottomTransport`

### Generation components
- `StrategyForm`
- `PresetList`
- `GenerateButton`
- `RegenerateSongButton`

### Composer components
- `SectionTimeline`
- `SectionBlock`
- `ChordLane`
- `PianoRoll`
- `HookMarker`

### Inspector components
- `SongSummaryCard`
- `SectionInspector`
- `NoteInspector`

### Modal components
- `RegenerateSectionModal`
- `ExportDialog`
- `ProjectSettingsDialog`

---

## 10. MVP wireframe summary

If we collapse all of this into the simplest possible MVP, the product needs just:
- landing page with presets
- one main composer workspace
- one regenerate section modal
- one export dialog

That is enough to make the product feel real.

---

## 11. Next useful design artifact

After this wireframe doc, the most useful next step is:
- turning these wireframes into a **component spec + interaction checklist**

That would allow direct implementation.
