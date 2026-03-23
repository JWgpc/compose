# Song Score Schema v1

This document defines the core score model for the Song Creator system.

The goal is **not** to lock into one notation format.
The goal is to define the **musical elements that must exist** in a complete, usable song score.

Formats such as ABC, JSON, MIDI, or future MusicXML are only input/output containers.
The schema below defines the actual information model the system should preserve.

---

## 1. Design principle

A useful song score must preserve at least these layers:

1. **Meta** — title, tempo, key, meter
2. **Structure** — intro, verse, chorus, bridge, etc.
3. **Harmony** — chord progression / chord events
4. **Melody** — note-level pitch and duration events
5. **Performance / intent** — descriptive annotations and section intent
6. **Track roles** — melody, chords, bass, strings, drums, etc.

If one of these is missing, the score may still be playable, but it becomes less useful as a songwriting object.

---

## 2. Scope of v1

Version 1 should support:
- song-level metadata
- section structure
- chord symbols
- melody notes
- optional multiple tracks
- annotations / descriptive comments
- enough precision for playback, editing, and export

Version 1 does **not** require:
- fully engraved notation layout rules
- advanced articulations everywhere
- complete orchestral expression modeling
- DAW-level automation lanes

---

## 3. Required score layers

## 3.1 Meta layer

Every score should contain a metadata block.

### Required fields
- `title`
- `composer`
- `tempoBpm`
- `timeSignature`
- `key`

### Optional but recommended
- `subtitle`
- `arranger`
- `genre`
- `mood`
- `unitNoteLength`
- `swing`
- `tags`

### Example
```json
{
  "title": "初霁",
  "composer": "AI Composer",
  "tempoBpm": 72,
  "timeSignature": "4/4",
  "key": "C",
  "unitNoteLength": "1/8",
  "genre": "piano_ballad",
  "mood": "gentle"
}
```

---

## 3.2 Structure layer

A song is not just a note stream.
It needs sections.

### Required section fields
- `id`
- `label`
- `startBar`
- `barCount`

### Recommended fields
- `type` (`intro`, `verse`, `pre_chorus`, `chorus`, `bridge`, `outro`, `custom`)
- `description`
- `energyLevel`
- `hookFocus`

### Example
```json
[
  {
    "id": "intro",
    "label": "前奏",
    "type": "intro",
    "startBar": 1,
    "barCount": 4,
    "description": "模仿雨滴",
    "energyLevel": 1,
    "hookFocus": false
  },
  {
    "id": "climax",
    "label": "高潮",
    "type": "chorus",
    "startBar": 13,
    "barCount": 4,
    "description": "阳光普照",
    "energyLevel": 5,
    "hookFocus": true
  }
]
```

---

## 3.3 Harmony layer

Harmony must be represented explicitly.
This is required for:
- chord lane display
- bass generation
- accompaniment
- harmonic analysis
- lyric and melody fit

### Minimum chord event fields
- `bar`
- `beat`
- `symbol`

### Recommended fields
- `durationBeats`
- `sectionId`
- `romanNumeral`
- `function`
- `voicingHint`

### Example
```json
[
  { "bar": 1, "beat": 1, "symbol": "Csus2", "durationBeats": 4, "sectionId": "intro" },
  { "bar": 2, "beat": 1, "symbol": "C", "durationBeats": 4, "sectionId": "intro" },
  { "bar": 5, "beat": 1, "symbol": "CG/B", "durationBeats": 4, "sectionId": "themeA" },
  { "bar": 6, "beat": 1, "symbol": "Am7", "durationBeats": 4, "sectionId": "themeA" }
]
```

### Supported chord symbol complexity in v1
Should support at least:
- major / minor
- slash chords
- sus chords
- dominant 7
- major 7
- minor 7
- dim / aug optional

Examples:
- `C`
- `Am`
- `G/B`
- `Gsus4`
- `Fmaj7`
- `Dm7`
- `G7`

---

## 3.4 Melody / note-event layer

This is the core performance layer.
It should be independent from notation text formats.

### Required note fields
- `pitch`
- `startBeat`
- `durationBeats`
- `trackId`

### Recommended fields
- `velocity`
- `sectionId`
- `tieStart`
- `tieEnd`
- `isRest`
- `lyricSyllable`
- `accent`

### Pitch format recommendation
Use one of:
- scientific pitch notation (`C4`, `D#5`)
- MIDI note number

For readability, prefer storing both when practical.

### Example
```json
[
  { "pitch": "E5", "midi": 76, "startBeat": 6.0, "durationBeats": 1.0, "trackId": "melody", "sectionId": "intro" },
  { "pitch": "G5", "midi": 79, "startBeat": 10.0, "durationBeats": 1.0, "trackId": "melody", "sectionId": "intro" },
  { "isRest": true, "startBeat": 12.0, "durationBeats": 2.0, "trackId": "melody", "sectionId": "intro" }
]
```

### Note timing rule
The canonical timing grid for v1 should use **beats**.
This makes conversion easier between:
- piano roll
- ABC
- chord lanes
- MIDI timeline

---

## 3.5 Track layer

Even if version 1 plays only melody, the schema should support multiple roles.

### Minimum track fields
- `id`
- `name`
- `role`

### Recommended fields
- `instrumentHint`
- `mute`
- `solo`
- `color`

### Suggested track roles
- `melody`
- `chords`
- `bass`
- `arp`
- `strings`
- `pad`
- `drums`
- `countermelody`

### Example
```json
[
  { "id": "melody", "name": "Melody", "role": "melody", "instrumentHint": "piano" },
  { "id": "chords", "name": "Harmony", "role": "chords", "instrumentHint": "strings" }
]
```

---

## 3.6 Annotation / intent layer

The score should preserve human-meaningful annotations.
This is important for AI generation and arrangement.

### Recommended annotation fields
- `type`
- `text`
- `targetSectionId`
- `bar`

### Suggested annotation types
- `section_description`
- `arrangement_hint`
- `performance_hint`
- `mood_hint`
- `hook_hint`

### Example
```json
[
  { "type": "section_description", "targetSectionId": "intro", "text": "模仿雨滴" },
  { "type": "section_description", "targetSectionId": "themeA", "text": "左手流动，右手旋律" },
  { "type": "section_description", "targetSectionId": "climax", "text": "阳光普照" }
]
```

---

## 4. Canonical score object

The full score object for v1 should look like this:

```json
{
  "schemaVersion": 1,
  "meta": {},
  "sections": [],
  "tracks": [],
  "chords": [],
  "notes": [],
  "annotations": []
}
```

### Required top-level fields
- `schemaVersion`
- `meta`
- `sections`
- `tracks`
- `chords`
- `notes`

### Optional top-level fields
- `annotations`
- `lyricPlan`
- `renderHints`
- `sourceFormat`
- `sourceText`

---

## 5. Recommended v1 validation rules

A score is valid if:
- `meta.tempoBpm` exists
- `meta.timeSignature` exists
- `meta.key` exists
- at least one section exists
- at least one track exists
- at least one chord event exists
- at least one note event exists

### Additional recommended rules
- every note belongs to a valid `trackId`
- every section has non-overlapping bar ranges
- chord symbols are parseable
- note durations are positive
- note starts are non-negative

---

## 6. ABC compatibility mapping

ABC notation should be treated as one compatible external format.

### ABC fields that map cleanly
- `T:` → `meta.title`
- `C:` → `meta.composer`
- `M:` → `meta.timeSignature`
- `L:` → `meta.unitNoteLength`
- `Q:` → `meta.tempoBpm`
- `K:` → `meta.key`
- chord strings like `"Am7"` → `chords[].symbol`
- note tokens → `notes[]`
- `% comments` → `annotations[]`

### Important rule
The system should preserve the **musical content**, not necessarily the exact original text formatting.

---

## 7. Why JSON should remain the internal format

Even if AI often generates ABC-like text, the internal format should still be JSON-like because the system needs to:
- edit single notes
- drag notes in piano roll
- regenerate one section only
- assign tracks and instruments
- export multiple formats

So the architecture should be:

### External formats
- ABC
- MIDI
- future MusicXML
- future plain-text score prompt

### Internal canonical format
- `SongScore v1` JSON object

---

## 8. AI generation requirements

When AI generates a score, the output should always contain enough information to populate the schema.

### Minimum required AI output content
- title or temporary title
- tempo
- meter
- key
- section structure
- chord progression
- melody note events

### Strongly recommended AI output content
- section descriptions
- hook description
- instrument hints
- lyric-ready syllable plan (later)

### Bad AI output
- “just some notes”
- no key
- no tempo
- no section structure
- no chord symbols

### Good AI output
- a coherent score model that can be rendered in piano roll, chord lane, and later staff notation

---

## 9. Example score derived from the user's sample

```json
{
  "schemaVersion": 1,
  "meta": {
    "title": "初霁 (First Light)",
    "composer": "AI Composer",
    "tempoBpm": 72,
    "timeSignature": "4/4",
    "key": "C",
    "unitNoteLength": "1/8"
  },
  "sections": [
    { "id": "intro", "label": "前奏", "type": "intro", "startBar": 1, "barCount": 4, "description": "模仿雨滴" },
    { "id": "themeA", "label": "主题 A", "type": "verse", "startBar": 5, "barCount": 8, "description": "左手流动，右手旋律" },
    { "id": "transition", "label": "过渡", "type": "bridge", "startBar": 13, "barCount": 4, "description": "色彩变化" },
    { "id": "climax", "label": "高潮", "type": "chorus", "startBar": 17, "barCount": 4, "description": "阳光普照" },
    { "id": "outro", "label": "尾声", "type": "outro", "startBar": 21, "barCount": 5, "description": "回归宁静" }
  ],
  "tracks": [
    { "id": "melody", "name": "Melody", "role": "melody", "instrumentHint": "piano" },
    { "id": "harmony", "name": "Harmony", "role": "chords", "instrumentHint": "left_hand_piano" }
  ],
  "chords": [
    { "bar": 1, "beat": 1, "symbol": "Csus2", "durationBeats": 4, "sectionId": "intro" },
    { "bar": 2, "beat": 1, "symbol": "C", "durationBeats": 4, "sectionId": "intro" },
    { "bar": 3, "beat": 1, "symbol": "Am", "durationBeats": 4, "sectionId": "intro" }
  ],
  "notes": [],
  "annotations": [
    { "type": "section_description", "targetSectionId": "intro", "text": "模仿雨滴" },
    { "type": "section_description", "targetSectionId": "climax", "text": "阳光普照" }
  ]
}
```

---

## 10. Product implication

The Song Creator system should be built around this rule:

> A song score is complete only when it includes meta, structure, harmony, and note-level events.

This makes the system compatible with:
- AI score generation
- piano-roll editing
- chord-lane display
- sample playback
- later notation export

---

## 11. Recommended next step

After this schema, the next useful artifact is:
- a machine-readable JSON schema
or
- an ABC-to-SongScore conversion spec

Either one would make implementation much easier.
