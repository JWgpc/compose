# Song Generator Specification v1

This specification defines a practical, constrained format for generating mainstream song drafts from extracted songwriting patterns.

Its goal is **not** to generate arbitrary MIDI noise.
Its goal is to generate songs that already resemble familiar pop-writing behavior.

---

## 1. Product goal

The generator should produce a **structured song plan** before producing note-level output.

Generation should happen in layers:

1. style selection
2. tempo / meter / key selection
3. section-form selection
4. hook strategy selection
5. chord plan generation
6. melodic strategy generation
7. note-level phrase generation
8. arrangement/export handoff

### Core principle
Do **not** generate notes first.
Generate:
- song strategy
- harmonic plan
- melodic constraints
- hook plan
- then notes

---

## 2. Scope for v1

### Included
- mainstream pop song sketch generation
- melody + chord draft generation
- fixed song sections
- phrase-based generation
- piano-roll-compatible note output
- support for instrumental hooks and vocal hooks

### Excluded for v1
- full professional mixing
- advanced humanized performance rendering
- realistic singing synthesis
- dense jazz harmony
- highly experimental song forms
- multi-key modulations as default behavior

---

## 3. Generation pipeline

## Stage 1: Song Strategy
The system must first generate a `SongStrategy` object.

### Required fields
- `style`
- `mood`
- `reference_family`
- `tempo_bpm`
- `time_signature`
- `key`
- `mode`
- `section_form`
- `hook_type`
- `phrase_length_bars`
- `motif_repetition_level`
- `chorus_lift_type`
- `strong_beat_policy`

### Example
```json
{
  "style": "mainstream_pop",
  "mood": "uplifting",
  "reference_family": ["title_hook", "anthem_pop"],
  "tempo_bpm": 118,
  "time_signature": "4/4",
  "key": "G",
  "mode": "major",
  "section_form": ["verse", "pre_chorus", "chorus", "verse", "pre_chorus", "chorus", "bridge", "final_chorus"],
  "phrase_length_bars": 4,
  "hook_type": "title_hook",
  "motif_repetition_level": "high",
  "chorus_lift_type": "higher_register",
  "strong_beat_policy": "prefer_chord_tones"
}
```

---

## 4. Allowed parameter sets

## 4.1 style
Allowed v1 values:
- `mainstream_pop`
- `pop_ballad`
- `dance_pop`
- `synth_pop`
- `funk_pop`
- `pop_rock`
- `rnb_pop`
- `mandopop_ballad`
- `mandopop_mainstream`

## 4.2 mood
Allowed v1 values:
- `uplifting`
- `romantic`
- `sad`
- `nostalgic`
- `anthemic`
- `cool`
- `confident`
- `dreamy`
- `heartbroken`
- `hopeful`

## 4.3 hook_type
Allowed v1 values:
- `title_hook`
- `riff_hook`
- `melodic_hook`
- `rhythmic_hook`
- `post_chorus_hook`
- `chant_hook`
- `hybrid_hook`

## 4.4 motif_repetition_level
Allowed values:
- `low`
- `medium`
- `high`
- `very_high`

## 4.5 chorus_lift_type
Allowed values:
- `higher_register`
- `longer_notes`
- `more_repetition`
- `denser_rhythm`
- `bigger_arrangement`
- `delayed_title_payoff`
- `mixed`

## 4.6 strong_beat_policy
Allowed values:
- `prefer_chord_tones`
- `mostly_chord_tones`
- `balanced`

---

## 5. Section form templates

The generator should not invent section forms arbitrarily in v1.
It should pick from a constrained template library.

### Template A: mainstream pop
```json
["verse", "pre_chorus", "chorus", "verse", "pre_chorus", "chorus", "bridge", "final_chorus"]
```

### Template B: compact pop
```json
["verse", "chorus", "verse", "chorus", "bridge", "final_chorus"]
```

### Template C: ballad
```json
["verse", "pre_chorus", "chorus", "verse", "pre_chorus", "chorus", "bridge", "chorus"]
```

### Template D: AABA / classic
```json
["verse_a", "verse_a", "bridge_b", "verse_a"]
```

### Template E: chant-coda anthem
```json
["verse", "verse", "bridge", "verse", "coda_hook"]
```

### Template F: post-chorus pop
```json
["verse", "pre_chorus", "chorus", "post_chorus", "verse", "pre_chorus", "chorus", "post_chorus", "bridge", "final_chorus"]
```

### Template G: riff-first track
```json
["intro_riff", "verse", "pre_chorus", "chorus", "verse", "pre_chorus", "chorus", "bridge", "chorus_out"]
```

---

## 6. Harmonic generation rules

## 6.1 Harmonic philosophy
Version 1 should favor:
- repeatable loops
- familiar tonal centers
- section-to-section consistency
- contrast through section function rather than constant chord novelty

## 6.2 Allowed harmonic families

### Major pop family
Examples:
- `I-V-vi-IV`
- `I-vi-IV-V`
- `vi-IV-I-V`
- `I-V-IV-I`

### Minor pop family
Examples:
- `i-VI-III-VII`
- `i-III-VI-VII`
- `i-vii-VI-VII`
- `i-iv-VI-V`

### Ballad family
Examples:
- `I-V-vi-IV`
- `I-iii-IV-V`
- `vi-IV-I-V`
- `I-V-IV-I`

### Groove/riff vamp family
Examples:
- short 1–4 chord loops
- static tonic-minor vamp
- repeating riff-centric movement

## 6.3 Harmonic constraints
- default loop length: 4 bars
- verse harmony may equal chorus harmony in v1
- chorus differentiation may come from melody and arrangement, not mandatory new chords
- bridge should be the main place for harmonic contrast
- avoid random one-bar harmonic drift unless style explicitly needs it

## 6.4 Harmonic output structure
The generator should produce per-section chord plans.

Example:
```json
{
  "verse": ["G", "D", "Em", "C"],
  "pre_chorus": ["Em", "C", "G", "D"],
  "chorus": ["G", "D", "Em", "C"],
  "bridge": ["Bm", "Em", "C", "D"]
}
```

---

## 7. Melody generation rules

## 7.1 Melody defaults
Default v1 behavior:
- phrase length = 4 bars
- section length = 8 bars unless otherwise specified
- melody range = narrow / medium by default
- strong beats prefer chord tones
- weak beats may use passing or neighbor tones
- motif reuse is encouraged

## 7.2 Melody range categories
- `narrow`: within about a 5th to 6th
- `medium`: within about an octave
- `wide`: larger than an octave or with notable leap targets

## 7.3 Motion categories
- `mostly_stepwise`
- `mixed`
- `leap_heavy`

## 7.4 Phrase logic
Each phrase should have:
- a start gesture
- a contour target
- a cadence target

Each 4-bar phrase should feel like:
- bars 1–2: establish motif
- bar 3: vary or rise
- bar 4: cadence or suspend

## 7.5 Strong-beat rule
If `strong_beat_policy = prefer_chord_tones`:
- beat 1 and beat 3 should strongly prefer root, 3rd, or 5th
- beats 2 and 4 may include more motion
- offbeats may carry passing tones and syncopation

## 7.6 Motif reuse rule
Do not generate each bar independently.
Every section must define at least one motif cell.

Possible motif cell lengths:
- 1 beat
- 2 beats
- 1 bar
- 2 bars

Repetition strategy:
- verse: motif reuse with mild variation
- pre-chorus: same rhythm, rising contour or increased tension
- chorus: strongest motif, highest repetition density

---

## 8. Hook generation rules

## 8.1 title_hook
Requirements:
- title length should ideally be 1–5 words
- title appears in chorus
- title should sit on stable, memorable rhythm/melody
- title should repeat at least twice in chorus or final chorus

## 8.2 riff_hook
Requirements:
- define a 1–2 bar instrumental motif before or alongside vocal entry
- vocal rhythm must leave space for riff recognition
- harmonic complexity should remain moderate

## 8.3 melodic_hook
Requirements:
- define a unique contour signature
- include at least one memorable interval feature
- ensure chorus contour differs clearly from verse contour

## 8.4 rhythmic_hook
Requirements:
- use narrow pitch palette
- use repeated rhythmic cells
- avoid overcomplicating harmony

## 8.5 post_chorus_hook
Requirements:
- chorus must already resolve
- post-chorus should simplify language
- post-chorus should increase repetition
- melodic shape may simplify relative to chorus

## 8.6 chant_hook
Requirements:
- short repeated text
- low lyric density
- strong pulse clarity
- group-singable contour

---

## 9. Chorus-lift rules

Every generated song must explicitly define a chorus lift plan.

## 9.1 Allowed lift mechanics
- `higher_register`
- `longer_notes`
- `more_repetition`
- `denser_rhythm`
- `bigger_arrangement`
- `delayed_title_payoff`
- `mixed`

## 9.2 Implementation rules

### higher_register
- chorus average pitch center must be above verse

### longer_notes
- chorus note durations should be longer on average than verse

### more_repetition
- chorus motif reuse should exceed verse motif reuse

### denser_rhythm
- chorus may use more repeated subdivisions or stronger pulse emphasis

### bigger_arrangement
- same melody may be allowed, but support tracks should expand

### delayed_title_payoff
- title phrase should be withheld from verse and introduced as chorus payoff

---

## 10. Lyric-ready support (optional in v1)

Even before full lyric generation, the system should prepare lyric-compatible structure.

Required placeholders:
- syllable slots per phrase
- stressed syllable targets on strong beats
- title placement markers

Example:
```json
{
  "chorus_lyric_plan": {
    "title_position": [2, 4],
    "syllables_per_bar": [6, 6, 8, 5],
    "stress_pattern": ["strong", "weak", "medium", "strong"]
  }
}
```

---

## 11. Data model

## 11.1 SongStrategy
```json
{
  "style": "mainstream_pop",
  "mood": "romantic",
  "tempo_bpm": 96,
  "time_signature": "4/4",
  "key": "C",
  "mode": "major",
  "section_form": ["verse", "pre_chorus", "chorus", "verse", "pre_chorus", "chorus", "bridge", "final_chorus"],
  "hook_type": "title_hook",
  "phrase_length_bars": 4,
  "motif_repetition_level": "high",
  "chorus_lift_type": "mixed",
  "strong_beat_policy": "prefer_chord_tones"
}
```

## 11.2 ChordPlan
```json
{
  "intro": ["C", "G", "Am", "F"],
  "verse": ["C", "G", "Am", "F"],
  "pre_chorus": ["Am", "F", "C", "G"],
  "chorus": ["C", "G", "Am", "F"],
  "bridge": ["Dm", "Am", "F", "G"]
}
```

## 11.3 MelodyPlan
```json
{
  "range": "medium",
  "motion": "mostly_stepwise",
  "motif_cells": [
    {
      "id": "m1",
      "length_beats": 2,
      "reuse_level": "high"
    }
  ],
  "chorus_behavior": {
    "pitch_center_shift": "up",
    "duration_bias": "longer",
    "title_emphasis": true
  }
}
```

## 11.4 NoteSequence
Each note event should be exportable into piano-roll format.

```json
{
  "tracks": [
    {
      "name": "melody",
      "instrument": "lead",
      "notes": [
        {"pitch": "E4", "start": 0.0, "duration": 0.5, "velocity": 92},
        {"pitch": "G4", "start": 0.5, "duration": 0.5, "velocity": 95},
        {"pitch": "A4", "start": 1.0, "duration": 1.0, "velocity": 98}
      ]
    }
  ]
}
```

---

## 12. Validation rules

A generated song should fail validation if:
- it has no clear hook plan
- it has no defined chorus lift
- phrase lengths are chaotic without stylistic reason
- strong beats contain too many unstable tones
- chorus is not meaningfully differentiated from verse
- note density is too high for the chosen style
- harmonic changes are too random for v1 constraints

### Minimum pass conditions
A song draft is valid if:
- section form is from template library
- hook type is defined
- chord plan exists for all main sections
- phrase length is defined
- chorus lift exists
- melody plan exists
- note sequence aligns with chord plan

---

## 13. UI / editor implications

The composition UI should expose these controls directly:
- style
- mood
- BPM
- key
- hook type
- section form
- phrase length
- chorus lift type
- regenerate verse / chorus / bridge independently

The editor should show:
- section boundaries
- chord labels
- melody notes
- hook zone highlights
- title phrase markers

---

## 14. Recommended v1 presets

## Preset A: Mainstream Title-Hook Pop
- style: `mainstream_pop`
- BPM: 96–124
- hook_type: `title_hook`
- phrase length: 4 bars
- chorus lift: `mixed`

## Preset B: Ballad
- style: `pop_ballad`
- BPM: 68–96
- hook_type: `title_hook` or `melodic_hook`
- chorus lift: `longer_notes` + `higher_register`

## Preset C: Synth-pop Riff Song
- style: `synth_pop`
- BPM: 110–172
- hook_type: `riff_hook`
- chorus lift: `bigger_arrangement` or `denser_rhythm`

## Preset D: Dance-pop Post-Chorus Song
- style: `dance_pop`
- BPM: 116–130
- hook_type: `post_chorus_hook`
- chorus lift: `more_repetition` + `bigger_arrangement`

## Preset E: Mandopop Ballad
- style: `mandopop_ballad`
- BPM: 68–92
- hook_type: `title_hook` or `melodic_hook`
- phrase length: 4 bars
- chorus lift: `higher_register` + `longer_notes`

---

## 15. Recommended implementation order

### Phase 1
Implement:
- strategy generation
- section templates
- chord loop generator
- melody-plan generator

### Phase 2
Implement:
- note-level melody generator
- motif reuse logic
- chorus lift control

### Phase 3
Implement:
- lyric slot planning
- bass/drum support generation
- MIDI export

### Phase 4
Implement:
- multi-track arrangement generation
- lyric generation
- vocal synthesis handoff

---

## 16. Summary

The v1 generator should behave like a disciplined pop co-writer.
It should:
- choose a song strategy
- choose a hook strategy
- use constrained section forms
- generate familiar harmonic plans
- keep melodies singable
- make the chorus clearly lift
- output structured note data for editing and playback

That is enough to build a useful first-generation music creator.
