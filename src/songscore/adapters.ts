import { noteName } from '../utils.ts';
import { SONG_SCORE_ACCENT } from './model.ts';

const sectionTypeToKind = {
  intro: 'intro',
  verse: 'verse',
  pre_chorus: 'pre',
  chorus: 'chorus',
  bridge: 'bridge',
  outro: 'outro',
  interlude: 'post',
  drop: 'post',
  custom: 'verse',
};

const defaultEnergyByKind = {
  intro: 'Foundation',
  verse: 'Foundation',
  pre: 'Lift',
  chorus: 'Peak',
  bridge: 'Contrast',
  post: 'Lift',
  outro: 'Foundation',
};

const accentToEmphasis = {
  [SONG_SCORE_ACCENT.STRONG]: 'hook',
  [SONG_SCORE_ACCENT.MEDIUM]: 'contrast',
  [SONG_SCORE_ACCENT.LIGHT]: 'normal',
  [SONG_SCORE_ACCENT.NONE]: 'normal',
};

function getSongScore(project) {
  return project.songScore;
}

function getTotalBeats(project) {
  return getTotalBarsFromSongScore(getSongScore(project)) * 4;
}

function inferSectionId(songScore, startBeat) {
  return songScore.sections.find((section) => {
    const sectionStartBeat = Math.max(section.startBar - 1, 0) * 4;
    const sectionEndBeat = sectionStartBeat + section.barCount * 4;
    return startBeat >= sectionStartBeat && startBeat < sectionEndBeat;
  })?.id;
}

function getPitchMidi(note) {
  if (Number.isFinite(note?.midi)) {
    return note.midi;
  }

  if (!note?.pitch) {
    return null;
  }

  const match = /^([A-G])([#b]?)(-?\d+)$/.exec(note.pitch);
  if (!match) {
    return null;
  }

  const [, letter, accidental, octaveText] = match;
  const base = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  }[letter];
  const accidentalOffset = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  const octave = Number(octaveText);
  return (octave + 1) * 12 + base + accidentalOffset;
}

function getSectionAnnotations(songScore) {
  const descriptionBySectionId = new Map();
  const hookHintBySectionId = new Map();

  (songScore.annotations || []).forEach((annotation) => {
    if (!annotation.targetSectionId) {
      return;
    }

    if (annotation.type === 'section_description') {
      descriptionBySectionId.set(annotation.targetSectionId, annotation.text);
    }

    if (annotation.type === 'hook_hint') {
      hookHintBySectionId.set(annotation.targetSectionId, annotation.text);
    }
  });

  return { descriptionBySectionId, hookHintBySectionId };
}

export function getTotalBarsFromSongScore(songScore) {
  return songScore.sections.reduce((maxBars, section) => Math.max(maxBars, section.startBar - 1 + section.barCount), 0);
}

export function getProjectSections(project) {
  const songScore = getSongScore(project);
  const { descriptionBySectionId, hookHintBySectionId } = getSectionAnnotations(songScore);
  const chordsBySectionId = new Map();

  songScore.chords.forEach((chord) => {
    if (!chord.sectionId) {
      return;
    }

    if (!chordsBySectionId.has(chord.sectionId)) {
      chordsBySectionId.set(chord.sectionId, []);
    }

    chordsBySectionId.get(chord.sectionId).push(chord.symbol);
  });

  return songScore.sections.map((section) => {
    const kind = sectionTypeToKind[section.type] || 'verse';
    const chords = chordsBySectionId.get(section.id) || [];
    const motif = section.hookFocus ? 'Main hook' : kind === 'pre' ? 'Tension build' : 'Support phrase';

    return {
      id: section.id,
      label: section.label,
      kind,
      bars: section.barCount,
      startBar: Math.max(section.startBar - 1, 0),
      hasHook: Boolean(section.hookFocus),
      chords,
      loopLabel: chords.join(' · '),
      energy: defaultEnergyByKind[kind] || 'Foundation',
      motif,
      description: section.description || descriptionBySectionId.get(section.id) || motif,
      regenerateHint:
        hookHintBySectionId.get(section.id) ||
        (section.hookFocus ? 'Push the hook higher and clearer' : 'Keep the contour stable and lyric-friendly'),
    };
  });
}

export function getProjectSection(project, sectionId) {
  return getProjectSections(project).find((section) => section.id === sectionId) || null;
}

export function getProjectChordBars(project) {
  const songScore = getSongScore(project);
  const totalBars = getTotalBarsFromSongScore(songScore);
  const bars = Array.from({ length: totalBars }, (_, index) => ({
    id: `bar-${index}`,
    barIndex: index,
    sectionId: inferSectionId(songScore, index * 4),
    chord: '—',
  }));

  [...songScore.chords]
    .sort((left, right) => (left.bar - right.bar) || (left.beat - right.beat))
    .forEach((chord) => {
      const barIndex = Math.max(chord.bar - 1, 0);
      const bar = bars[barIndex];
      if (!bar) {
        return;
      }

      bar.sectionId = chord.sectionId || bar.sectionId;
      bar.chord = bar.chord === '—' ? chord.symbol : `${bar.chord} · ${chord.symbol}`;
    });

  let lastChord = '—';
  return bars.map((bar) => {
    if (bar.chord === '—') {
      return {
        ...bar,
        chord: lastChord,
      };
    }

    lastChord = bar.chord;
    return bar;
  });
}

export function getProjectNotes(project) {
  const songScore = getSongScore(project);
  const sections = getProjectSections(project);
  const sectionById = Object.fromEntries(sections.map((section) => [section.id, section]));

  return songScore.notes
    .map((note, index) => {
      if (note.isRest) {
        return null;
      }

      const pitch = getPitchMidi(note);
      if (!Number.isFinite(pitch)) {
        return null;
      }

      const sectionId = note.sectionId || inferSectionId(songScore, note.startBeat);
      const section = sectionById[sectionId] || null;

      return {
        id: `note-${index}`,
        sectionId,
        trackId: note.trackId,
        startBeat: note.startBeat,
        duration: note.durationBeats,
        pitch,
        pitchLabel: note.pitch || noteName(pitch),
        emphasis:
          accentToEmphasis[note.accent] ||
          (section?.hasHook ? 'hook' : section?.kind === 'bridge' ? 'contrast' : 'normal'),
        lyric: note.lyricSyllable || '',
        velocity: note.velocity || 84,
      };
    })
    .filter(Boolean);
}

export function getProjectNote(project, noteId) {
  return getProjectNotes(project).find((note) => note.id === noteId) || null;
}

export function getProjectLyricNotes(project) {
  return getProjectNotes(project).filter((note) => Boolean(note.lyric));
}

export function getPlayableNotes(project, options = {}) {
  const sourceNotes = options.lyricsOnly ? getProjectLyricNotes(project) : getProjectNotes(project);
  return sourceNotes.map((note) => ({
    pitch: note.pitch,
    startBeat: note.startBeat,
    duration: note.duration,
    emphasis: note.emphasis,
    velocity: note.velocity,
    lyric: note.lyric,
    trackId: note.trackId,
  }));
}

export function getPreferredPreviewInstrument(project) {
  return getSongScore(project).renderHints?.preferredPreviewInstrument || 'piano';
}

export function getTempoBpm(project) {
  return Number(getSongScore(project).meta.tempoBpm || project.settings?.bpm || 120);
}

export function getSongScoreSummary(project) {
  return {
    totalBars: getTotalBarsFromSongScore(getSongScore(project)),
    totalBeats: getTotalBeats(project),
  };
}
