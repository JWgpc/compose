# Songwriting Patterns Extracted from `deep_song_analysis.csv`

This document summarizes reusable songwriting patterns distilled from the current deep-song analysis set.

## 1. Core structural patterns

### Most common mainstream structure
The dominant pop form is:

- Verse
- Pre-Chorus
- Chorus
- Verse
- Pre-Chorus
- Chorus
- Bridge
- Final Chorus

This appears across a large portion of modern pop because it balances:
- narrative setup in the verse
- tension increase in the pre-chorus
- payoff in the chorus
- contrast/reset in the bridge

### Important alternate structures
Use these as special templates:

#### AABA / compact classic form
Examples: `Yesterday`
- Verse
- Verse
- Bridge
- Verse

Useful for:
- concise melodic songs
- retro / classic ballads
- songs where melodic identity matters more than sectional variety

#### Extended coda / communal ending
Examples: `Hey Jude`
- Verse / bridge material first
- then a very long repetitive coda

Useful for:
- anthem songs
- participatory singalong design
- emotional escalation through repetition rather than new harmony

#### Post-chorus driven structure
Examples: `Bad Romance`, `Poker Face`
- Chorus is important
- but the most memorable cell may come immediately after it

Useful for:
- dance-pop
- short-form social-media-friendly songs
- chant/syllabic hooks

#### Riff-first structure
Examples: `Billie Jean`, `Blinding Lights`, `Uptown Funk`
The track may use standard sections, but identity comes from a repeating instrumental figure rather than a large harmonic storyline.

Useful for:
- groove-heavy songs
- synth-pop
- funk-pop
- tracks where the instrumental hook does as much work as the vocal melody

---

## 2. Hook design patterns

The current dataset suggests at least five high-value hook families.

### A. Title hook
Examples:
- `Let It Be`
- `Someone Like You`
- `Call Me Maybe`
- `Firework`
- `Halo`
- `I Want It That Way`

Characteristics:
- the song title is delayed or spotlighted
- appears on stable, memorable melody notes
- often lands in the chorus
- usually repeated with longer durations or stronger harmony

Best used when:
- you want maximum singalong value
- the title phrase is emotionally strong and simple
- the song needs broad mainstream accessibility

Rule of thumb:
- title should be short
- title phrase should sit on easy-to-sing notes
- title often works best after tension buildup, not too early

### B. Riff hook
Examples:
- `Billie Jean`
- `Blinding Lights`
- `Uptown Funk`

Characteristics:
- recurring bass/synth/guitar motif is the main memory trigger
- vocals may be rhythmically simpler because the riff carries identity
- harmony often loops instead of evolving much

Best used when:
- groove matters more than lyrical complexity
- you want immediate recognizability from the first seconds
- production is part of the composition, not just decoration

Rule of thumb:
- build a short 1–2 bar riff
- make it repeat enough to brand the song
- keep vocal phrases compatible with the riff instead of fighting it

### C. Melodic hook
Examples:
- `Yesterday`
- `Take on Me`
- `My Heart Will Go On`

Characteristics:
- melody contour itself is unforgettable
- recognizable even without lyrics
- often uses a distinct interval shape or contour arc

Best used when:
- the vocal line should carry the song alone
- the song is a ballad, classic pop, or soaring anthem

Rule of thumb:
- give the chorus a unique contour, not just new words on old rhythm
- use a memorable leap or opening shape
- keep strong-beat notes harmonically clear so the melody remains singable

### D. Rhythmic hook
Examples:
- `Shape of You`

Characteristics:
- narrow pitch range
- repeated rhythmic cells
- identity comes from pattern, pulse, and placement

Best used when:
- you want modern minimalist pop
- melody should feel casual, sticky, and loopable

Rule of thumb:
- don't overcomplicate pitch
- make rhythm do the work
- repeated small cells can outperform a “beautiful” but vague melody

### E. Post-chorus / chant hook
Examples:
- `Bad Romance`
- `Poker Face`
- `Hey Jude` (extended chant-coda version)

Characteristics:
- memory peak comes after or beyond the main chorus
- often built from syllables, slogans, or repeated fragments
- can be musically simpler than the chorus itself

Best used when:
- you want viral repeatability
- you want audience participation
- you want a second payoff after the chorus

Rule of thumb:
- keep it simpler than the chorus
- use repetition aggressively
- reduce lyrical complexity and increase rhythmic clarity

---

## 3. Harmonic patterns

### The most common harmonic principle
Many mainstream songs rely on a limited number of loop-based chord families.

Common behaviors in the current dataset:
- I–V–vi–IV family
- vi / minor-pop loop variants
- tonic-centered loops with limited sectional variation
- riff-vamps where harmony changes little but groove changes perception

### What this means for the generator
The generator does **not** need thousands of chord systems for version 1.
It should first master:

1. major emotional-pop loop
2. minor emotional-pop loop
3. ballad loop
4. riff-vamp loop
5. anthem/bridge contrast loop

### Practical harmonic rules

#### Rule 1: verses can stay harmonically conservative
In many songs, the verse does not need harmonic novelty.
Its job is:
- support lyrics
- establish groove
- create expectation

#### Rule 2: chorus payoff often comes from presentation, not brand-new harmony
A lot of hits do **not** switch to wildly new chords in the chorus.
Instead they change:
- register
- repetition
- note length
- arrangement density
- title emphasis

#### Rule 3: bridge is the safest place for contrast
If you want a fresh harmonic move, put it in the bridge.
That gives variety without destabilizing the song's central identity.

#### Rule 4: repetitive harmony is not weakness
Songs like `Shape of You`, `Billie Jean`, `Blinding Lights`, `Uptown Funk` show that repeated harmony can still produce huge hits if:
- the riff is strong
- rhythm is sticky
- the hook is clear

---

## 4. Melody-writing patterns

### A. Most mainstream melodies are more controlled than people think
Common traits across the dataset:
- medium range is most common
- 4-bar phrases are extremely common
- strong beats often land on chord tones
- repetition is usually high

So the generator should avoid writing every melody like a virtuosic solo.
Good pop melodies are often:
- simpler
- more repetitive
- more phrase-balanced
- more harmonically anchored

### B. Strong beats matter a lot
Across the dataset, strong beats often land on:
- root
- third
- fifth
- other stable chord-related tones

This suggests a strong generation rule:
- prioritize chord tones on strong beats
- use passing or color tones on weak beats / pickups

### C. 4-bar organization is a major default
Many analyzed songs naturally organize into:
- 4-bar phrases
- 8-bar grouped sections

This is a strong baseline for AI generation.
If the system writes irregular phrases too often, the result may feel less “song-like.”

### D. Repetition beats novelty in pop
High-performing songs repeatedly reuse:
- contour
- rhythm cell
- title phrase
- riff fragment

So melody generation should include explicit motif reuse.
Do not generate every bar independently.

### E. There are two major chorus-melody strategies

#### Strategy 1: chorus gets higher
Examples:
- `Take on Me`
- `Halo`
- `My Heart Will Go On`
- `Dancing Queen`

#### Strategy 2: chorus gets broader/longer, not necessarily much higher
Examples:
- `Let It Be`
- `Someone Like You`
- `Firework`

This means the system should support at least two chorus-lift modes:
- `register_lift`
- `duration_and_density_lift`

---

## 5. Chorus lift patterns

From the current set, chorus lift usually comes from one or more of these:

1. **Higher tessitura**
   - chorus sits higher than verse
2. **Longer note values**
   - verse may be more speech-like; chorus becomes broader
3. **More repetition**
   - title or hook repeats more often
4. **Denser arrangement**
   - even if melody is similar, production gets bigger
5. **Stronger rhythmic insistence**
   - repeated rhythmic hooks become more forceful
6. **Delayed payoff**
   - title appears later, making chorus more satisfying

### Generator takeaway
The chorus should not just be “another section.”
It needs at least one explicit lift mechanism.

Recommended controllable parameter:
- `chorus_lift_type`
  - `higher_register`
  - `longer_notes`
  - `more_repetition`
  - `denser_rhythm`
  - `bigger_arrangement`
  - `delayed_title_payoff`
  - `mixed`

---

## 6. Genre-specific observations

### Ballads
Examples:
- `Someone Like You`
- `Perfect`
- `Halo`
- `My Heart Will Go On`

Typical traits:
- moderate or slow BPM
- longer notes
- stable harmony
- emotional title payoff
- chorus lift often comes from register and sustain

### Dance-pop / synth-pop
Examples:
- `Bad Romance`
- `Poker Face`
- `Blinding Lights`
- `Take on Me`

Typical traits:
- loop-based harmony
- extremely clear hook architecture
- strong post-chorus or riff material
- repetition is very high

### Groove-first pop / funk-pop
Examples:
- `Billie Jean`
- `Uptown Funk`

Typical traits:
- instrumental groove carries identity
- short vocal cells are enough
- harmony can be static if rhythm is strong

### Classic singalong pop
Examples:
- `Let It Be`
- `Hey Jude`
- `Yesterday`

Typical traits:
- strong melodic clarity
- compact phrase logic
- communal or hymn-like stability
- fewer unnecessary notes

---

## 7. Concrete rules for a version-1 song generator

### Recommended defaults
- Time signature: `4/4`
- Phrase length: `4 bars`
- Section size: `8 bars` by default
- Strong beats: prefer chord tones
- Melody range: default `medium`
- Repetition: default `high`

### Recommended generation order
1. pick style
2. pick BPM range
3. pick key / mode
4. choose hook family
5. generate section structure
6. generate chord loop by section
7. generate chorus first
8. derive verse from chorus DNA
9. add bridge contrast
10. add riff / post-chorus if needed

### Recommended hook-first templates

#### Template A: mainstream title-hook pop
- Verse: restrained, mid-range
- Pre-Chorus: rising tension
- Chorus: title repeated on stable tones

#### Template B: riff-first pop
- Build a 1–2 bar riff first
- Keep vocal melody simpler
- Use repeated harmony

#### Template C: ballad
- Stable harmony
- broader note values
- title on long chorus notes
- moderate range expansion

#### Template D: dance-pop with post-chorus
- compact chorus
- even simpler post-chorus slogan
- high repetition

---

## 8. What to avoid

Based on these patterns, version 1 should avoid:
- overly random chords every bar
- very wide melody range by default
- irregular phrase lengths everywhere
- too many non-chord tones on strong beats
- chorus sections that do not clearly lift from verses
- lyrics/hooks that are too long to repeat easily

---

## 9. Most useful product implication

The generator should not just output “notes.”
It should output a **song strategy**.

Minimum useful strategy fields:
- `hook_type`
- `section_form`
- `chord_loop_by_section`
- `phrase_length`
- `melody_range`
- `chorus_lift_type`
- `motif_repetition_level`
- `strong_beat_policy`

That will make the generated music feel closer to real popular songwriting patterns instead of arbitrary MIDI.
