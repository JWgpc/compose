---
name: story-to-songscore
description: Turn a story, theme, scene, synopsis, or emotional prompt into a SongScore JSON arrangement and import-ready piece for the Song Creator prototype. Use when the user wants music generated from prose, narrative beats, atmosphere, characters, or symbolic imagery; when converting story elements into tempo/key/sections/chords/notes; or when creating/updating playable demo scores with piano-led or small-ensemble track assignments.
---

# Story to SongScore

Turn narrative input into an importable score.

Read `references/workflow.md` when you need the full mapping workflow and heuristics.

## Default workflow

1. Extract the story's core signals:
   - setting and imagery
   - emotional arc
   - pacing
   - symbols / sound objects
   - ending quality
2. Convert those signals into musical decisions:
   - tempo
   - key
   - section layout
   - chord color
   - left/right hand texture
   - melodic contour
3. Build the SongScore in this order:
   - `meta`
   - `sections`
   - `tracks`
   - `chords`
   - `notes`
   - `annotations`
4. Import the score into the target app/project.
5. Validate by building or otherwise confirming the score loads.

## Output standard

Unless the user asks otherwise, produce a piano-focused arrangement with:
- `rightHand` melody track
- `leftHand` accompaniment track
- narrative section labels
- annotations that explain the musical intent

Current project rule: use only the instruments that still exist in this repo.
- Default instrument: `realistic-piano`
- Supported extras, when explicitly requested: `vpo-cello-solo-sustain` and `vpo-flute-solo-sustain`
- Do not write toward deleted/legacy sample banks or older guitar/strings libraries.
- If the user does not explicitly ask for support instruments, keep the piece **solo piano only**.
- When support instruments are requested, keep **piano as the clear lead** by default; cello/flute supports should reinforce, answer, or color the piano rather than replace it.
- If an auxiliary instrument does not clearly improve the piano, remove it.

Favor clarity over complexity. A smaller coherent piece is better than an overcomplicated but muddy score.

## Practical heuristics

- Start sparse when the story opens with distance, rain, memory, stillness, or hesitation.
- Use wider left-hand spacing for cinematic or nostalgic scenes.
- Use higher register and thicker right-hand intervals for recognition, revelation, or payoff.
- Use short bright figures for bells, clocks, music boxes, sparkles, or magical objects.
- Let the ending harmony match the story ending: stable for closure, suspended for ambiguity.
- If per-track instruments are available, assign by role rather than novelty: lead on piano first.
- In this project, that effectively means `realistic-piano` first, then optional VPO cello/flute only when needed.
- Prefer solving arrangement problems inside the piano writing before adding any new instrument.
- For gentle themes (spring, childhood, rain, growth, tenderness), keep the piece piano-led.
- If a supporting instrument keeps sounding "too obvious," remove it before trying to tame it.
- Treat auxiliary instruments as repair tools for gaps in the piano, not as co-leads.
- If the user asks for a support-instrument audition/demo, make the extra parts obvious enough to verify, then pull them back so the piano still reads as the protagonist.
- When browser preview sounds slightly worse than exported audio, do not immediately over-edit the source arrangement or sample mapping; verify the exported render first and treat preview artifacts as a separate playback-path problem.

## SongScore minimum

Always ensure the final score has:
- valid `meta.title`, `meta.composer`, `meta.tempoBpm`, `meta.timeSignature`, `meta.key`
- at least one section
- at least one track
- at least one chord event
- at least one note event

## Import/update notes

When working in the local Song Creator prototype:
- update the relevant SongScore file under `src/data/`
- wire it into the active preset/demo entry if needed
- for now, default `renderHints.defaultInstruments` to `realistic-piano` only unless the user explicitly wants an extra instrument test using `vpo-cello-solo-sustain` and/or `vpo-flute-solo-sustain`
- use `preferredPreviewInstrument` as a fallback, not as a substitute for deliberate track roles
- run a build to confirm importability
- commit only the files changed for this score task
