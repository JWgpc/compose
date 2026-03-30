import { quickPresets } from './presets.ts';
import { firstLightSongScore } from './first-light-song-score.ts';
import { testDemo1SongScore } from './test-demo1-song-score.ts';
import { testDemo2SongScore } from './test-demo2-song-score.ts';
import { testDemo3SongScore } from './test-demo3-song-score.ts';
import { testDemo4SongScore } from './test-demo4-song-score.ts';
import { testDemo5SongScore } from './test-demo5-song-score.ts';
import { testDemo6SongScore } from './test-demo6-song-score.ts';
import { testDemo7SongScore } from './test-demo7-song-score.ts';
import { testDemo8SongScore } from './test-demo8-song-score.ts';
import { testDemo9SongScore } from './test-demo9-song-score.ts';
import { testDemo10SongScore } from './test-demo10-song-score.ts';
import { testDemo11SongScore } from './test-demo11-song-score.ts';
import { clamp, noteName, uid } from '../utils.ts';
import {
  SONG_SCORE_ACCENT,
  SONG_SCORE_ANNOTATION_TYPE,
  SONG_SCORE_SCHEMA_VERSION,
  SONG_SCORE_SECTION_TYPE,
  SONG_SCORE_TRACK_ROLE,
} from '../songscore/model.ts';
import { getTotalBarsFromSongScore } from '../songscore/adapters.ts';

const pitchMaps = {
  bright: [62, 64, 67, 69, 71, 74],
  warm: [57, 60, 62, 64, 67, 69],
  minor: [57, 60, 62, 65, 67, 69],
  synth: [52, 55, 57, 60, 64, 67],
};

const sectionTemplates = {
  'Mainstream Pop': [
    ['Intro', 'intro', 4, ['G', 'D', 'Em', 'C'], false],
    ['Verse 1', 'verse', 8, ['G', 'D', 'Em', 'C'], false],
    ['Pre-Chorus', 'pre', 4, ['Em', 'C', 'G', 'D'], false],
    ['Chorus', 'chorus', 8, ['G', 'D', 'Em', 'C'], true],
    ['Post-Chorus', 'post', 4, ['Em', 'C', 'G', 'D'], true],
    ['Verse 2', 'verse', 8, ['G', 'D', 'Em', 'C'], false],
    ['Bridge', 'bridge', 4, ['Bm', 'Em', 'C', 'D'], false],
    ['Final Chorus', 'chorus', 8, ['G', 'D', 'Em', 'C'], true],
    ['Outro', 'outro', 4, ['G', 'D', 'C', 'C'], false],
  ],
  Ballad: [
    ['Intro', 'intro', 4, ['Dm', 'Bb', 'F', 'C'], false],
    ['Verse 1', 'verse', 8, ['Dm', 'Bb', 'F', 'C'], false],
    ['Pre-Chorus', 'pre', 4, ['Bb', 'C', 'Dm', 'C'], false],
    ['Chorus', 'chorus', 8, ['F', 'C', 'Dm', 'Bb'], true],
    ['Verse 2', 'verse', 8, ['Dm', 'Bb', 'F', 'C'], false],
    ['Bridge', 'bridge', 4, ['Gm', 'Bb', 'F', 'C'], false],
    ['Final Chorus', 'chorus', 8, ['F', 'C', 'Dm', 'Bb'], true],
    ['Outro', 'outro', 4, ['Dm', 'Bb', 'F', 'C'], false],
  ],
  'Post-Chorus Pop': [
    ['Intro', 'intro', 4, ['Am', 'F', 'C', 'G'], false],
    ['Verse 1', 'verse', 8, ['Am', 'F', 'C', 'G'], false],
    ['Pre-Chorus', 'pre', 4, ['F', 'G', 'Am', 'G'], false],
    ['Chorus', 'chorus', 8, ['C', 'G', 'Am', 'F'], true],
    ['Post-Chorus', 'post', 4, ['Am', 'F', 'C', 'G'], true],
    ['Verse 2', 'verse', 8, ['Am', 'F', 'C', 'G'], false],
    ['Bridge', 'bridge', 4, ['Dm', 'F', 'G', 'G'], false],
    ['Final Chorus', 'chorus', 8, ['C', 'G', 'Am', 'F'], true],
    ['Post-Chorus 2', 'post', 4, ['Am', 'F', 'C', 'G'], true],
  ],
  'Riff-First Track': [
    ['Intro', 'intro', 4, ['Em', 'Em', 'C', 'D'], true],
    ['Verse 1', 'verse', 8, ['Em', 'Em', 'C', 'D'], true],
    ['Pre-Chorus', 'pre', 4, ['C', 'D', 'Em', 'D'], false],
    ['Chorus', 'chorus', 8, ['Em', 'C', 'G', 'D'], true],
    ['Verse 2', 'verse', 8, ['Em', 'Em', 'C', 'D'], true],
    ['Bridge', 'bridge', 4, ['Am', 'C', 'Em', 'D'], false],
    ['Final Chorus', 'chorus', 8, ['Em', 'C', 'G', 'D'], true],
    ['Outro', 'outro', 4, ['Em', 'Em', 'C', 'D'], true],
  ],
};

function barsToBeats(bars) {
  return bars * 4;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sectionTypeForKind(kind) {
  const map = {
    intro: SONG_SCORE_SECTION_TYPE.INTRO,
    verse: SONG_SCORE_SECTION_TYPE.VERSE,
    pre: SONG_SCORE_SECTION_TYPE.PRE_CHORUS,
    chorus: SONG_SCORE_SECTION_TYPE.CHORUS,
    post: SONG_SCORE_SECTION_TYPE.DROP,
    bridge: SONG_SCORE_SECTION_TYPE.BRIDGE,
    outro: SONG_SCORE_SECTION_TYPE.OUTRO,
  };
  return map[kind] || SONG_SCORE_SECTION_TYPE.CUSTOM;
}

function energyForKind(kind) {
  const map = {
    intro: 1,
    verse: 2,
    pre: 3,
    chorus: 5,
    post: 4,
    bridge: 4,
    outro: 1,
  };
  return map[kind] || 2;
}

function motifForSection(section) {
  return section.hookFocus ? 'Main hook' : section.kind === 'pre' ? 'Tension build' : 'Support phrase';
}

function regenerateHintForSection(section) {
  return section.hookFocus ? 'Push the hook higher and clearer' : 'Keep the contour stable and lyric-friendly';
}

function velocityForAccent(accent) {
  return accent === SONG_SCORE_ACCENT.STRONG ? 104 : accent === SONG_SCORE_ACCENT.MEDIUM ? 90 : 82;
}

function makeScoreSections(template) {
  let startBar = 1;
  return template.map(([label, kind, bars, chords, hasHook], index) => {
    const section = {
      id: `${slugify(label)}-${index + 1}`,
      label,
      kind,
      barCount: bars,
      startBar,
      type: sectionTypeForKind(kind),
      description: hasHook ? 'Main hook' : kind === 'pre' ? 'Tension build' : 'Support phrase',
      energyLevel: energyForKind(kind),
      hookFocus: hasHook,
      chordLoop: chords,
    };
    startBar += bars;
    return section;
  });
}

function createChordEvents(sections) {
  const chords = [];
  sections.forEach((section) => {
    for (let i = 0; i < section.barCount; i += 1) {
      chords.push({
        bar: section.startBar + i,
        beat: 1,
        symbol: section.chordLoop[i % section.chordLoop.length],
        durationBeats: 4,
        sectionId: section.id,
      });
    }
  });
  return chords;
}

function makePattern(section, profile, preset) {
  const notes = [];
  const isChorus = section.kind === 'chorus';
  const isBridge = section.kind === 'bridge';
  const isPre = section.kind === 'pre';
  const isRiff = preset.hookType === 'Riff Hook';
  const isDance = preset.hookType === 'Post Chorus Hook';
  const baseSet = pitchMaps[profile];
  const basePitch = isChorus ? baseSet[3] : baseSet[1];
  const highPitch = isChorus ? baseSet[5] : baseSet[3];
  const bars = section.barCount;
  const titleWords = preset.title.split(' ').filter(Boolean);

  for (let bar = 0; bar < bars; bar += 1) {
    const barStart = barsToBeats(section.startBar - 1 + bar);
    const repetitionBar = bar % 4;
    const hookBar = section.hookFocus && (bar >= Math.max(0, bars - 4) || bar === 1);
    const phrase = [
      { offset: 0, duration: isDance ? 1 : 1.5, pitch: basePitch + (isPre ? 2 : 0) + (repetitionBar === 3 ? 2 : 0) },
      { offset: isDance ? 1 : 1.5, duration: 1, pitch: basePitch + (hookBar ? 5 : 2) },
      { offset: isDance ? 2 : 2.5, duration: isChorus ? 1.5 : 1, pitch: highPitch - (isBridge ? 1 : 0) },
      { offset: isDance ? 3 : 3.5, duration: hookBar ? 1 : 0.5, pitch: hookBar ? highPitch : basePitch + 1 },
    ];

    phrase.forEach((note, noteIndex) => {
      const accent = hookBar && noteIndex > 1 ? SONG_SCORE_ACCENT.STRONG : isBridge ? SONG_SCORE_ACCENT.MEDIUM : SONG_SCORE_ACCENT.LIGHT;
      const midi = clamp(note.pitch + (isRiff ? -5 : 0), 50, 76);
      notes.push({
        sectionId: section.id,
        startBeat: barStart + note.offset,
        durationBeats: note.duration,
        trackId: 'melody',
        pitch: noteName(midi),
        midi,
        velocity: velocityForAccent(accent),
        lyricSyllable: hookBar && isChorus && titleWords.length ? titleWords[noteIndex % titleWords.length] : '',
        accent,
      });
    });

    if (isRiff || section.kind === 'post') {
      const pickupAccent = section.hookFocus ? SONG_SCORE_ACCENT.STRONG : SONG_SCORE_ACCENT.LIGHT;
      const pickupOne = clamp(baseSet[0], 48, 72);
      const pickupTwo = clamp(baseSet[2], 48, 72);
      notes.push({
        sectionId: section.id,
        startBeat: barStart + 0.5,
        durationBeats: 0.5,
        trackId: 'melody',
        pitch: noteName(pickupOne),
        midi: pickupOne,
        velocity: velocityForAccent(pickupAccent),
        lyricSyllable: '',
        accent: pickupAccent,
      });
      notes.push({
        sectionId: section.id,
        startBeat: barStart + 2.5,
        durationBeats: 0.5,
        trackId: 'melody',
        pitch: noteName(pickupTwo),
        midi: pickupTwo,
        velocity: velocityForAccent(pickupAccent),
        lyricSyllable: section.kind === 'post' ? 'oh' : '',
        accent: pickupAccent,
      });
    }
  }

  return notes;
}

function createNotes(sections, preset) {
  const profile =
    preset.style === 'Ballad' || preset.mode === 'Minor'
      ? 'minor'
      : preset.style === 'Synth Pop'
        ? 'synth'
        : preset.style === 'Mandopop'
          ? 'warm'
          : 'bright';

  return sections.flatMap((section) => makePattern(section, profile, preset));
}

function presetById(id) {
  return quickPresets.find((preset) => preset.id === id) || quickPresets[0];
}

export function createSongScore(presetId, overrides = {}) {
  const preset = { ...presetById(presetId), ...overrides };

  if (presetId === 'mainstream-pop' && Object.keys(overrides).length === 0) {
    return structuredClone(firstLightSongScore);
  }

  if (presetId === 'test-demo1' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo1SongScore);
  }

  if (presetId === 'test-demo2' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo2SongScore);
  }

  if (presetId === 'test-demo3' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo3SongScore);
  }

  if (presetId === 'test-demo4' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo4SongScore);
  }

  if (presetId === 'test-demo5' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo5SongScore);
  }

  if (presetId === 'test-demo6' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo6SongScore);
  }

  if (presetId === 'test-demo7' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo7SongScore);
  }

  if (presetId === 'test-demo8' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo8SongScore);
  }

  if (presetId === 'test-demo9' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo9SongScore);
  }

  if (presetId === 'test-demo10' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo10SongScore);
  }

  if (presetId === 'test-demo11' && Object.keys(overrides).length === 0) {
    return structuredClone(testDemo11SongScore);
  }

  const template = sectionTemplates[preset.sectionTemplate] || sectionTemplates['Mainstream Pop'];
  const sections = makeScoreSections(template);
  const notes = createNotes(sections, preset);
  const annotations = sections.flatMap((section) => {
    const motif = motifForSection(section);
    const sectionAnnotations = [
      {
        type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
        targetSectionId: section.id,
        text: section.description || motif,
      },
      {
        type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
        targetSectionId: section.id,
        text: motif,
      },
    ];

    if (section.hookFocus) {
      sectionAnnotations.push({
        type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
        targetSectionId: section.id,
        text: regenerateHintForSection(section),
      });
    }

    return sectionAnnotations;
  });

  return {
    schemaVersion: SONG_SCORE_SCHEMA_VERSION,
    meta: {
      title: preset.title,
      composer: 'Song Creator Prototype',
      tempoBpm: Number(preset.bpm),
      timeSignature: '4/4',
      key: preset.key,
      genre: preset.style,
      mood: preset.mood,
      tags: [preset.hookType, preset.sectionTemplate, preset.mode],
    },
    sections: sections.map(({ id, label, startBar, barCount, type, description, energyLevel, hookFocus }) => ({
      id,
      label,
      startBar,
      barCount,
      type,
      description,
      energyLevel,
      hookFocus,
    })),
    tracks: [
      {
        id: 'melody',
        name: 'Melody',
        role: SONG_SCORE_TRACK_ROLE.MELODY,
        instrumentHint: 'piano',
        color: '#8ccfff',
      },
    ],
    chords: createChordEvents(sections),
    notes,
    annotations,
    renderHints: {
      defaultInstruments: {
        melody: 'realistic-piano',
      },
      preferredPreviewInstrument: 'realistic-piano',
      humanizeAmount: 0.12,
    },
    sourceFormat: 'json',
    sourceText: `Preset: ${preset.label} | Theme: ${preset.theme}`,
  };
}

export function createProject(presetId, overrides = {}) {
  const preset = { ...presetById(presetId), ...overrides };
  const songScore = createSongScore(presetId, overrides);
  const totalBars = getTotalBarsFromSongScore(songScore);

  return {
    id: uid('project'),
    title: songScore.meta.title,
    presetId: preset.id,
    totalBars,
    settings: {
      style: preset.style,
      mood: preset.mood,
      bpm: preset.bpm,
      key: preset.key,
      mode: preset.mode,
      hookType: preset.hookType,
      sectionTemplate: preset.sectionTemplate,
      phraseLength: preset.phraseLength,
      chorusLift: preset.chorusLift,
      title: preset.title,
      theme: preset.theme,
      lyricIdea: preset.lyricIdea,
    },
    strategy: {
      hookSummary: preset.hookSummary,
      melodyRule: preset.hookType === 'Riff Hook' ? 'Keep vocals tight around the riff pocket' : 'Land chorus strong beats on stable tones',
      harmonyRule: preset.mode === 'Minor' ? 'Keep verses conservative and let the chorus widen the register' : 'Use looped harmony and let the hook sell the payoff',
      referenceDirection: preset.sectionTemplate,
    },
    songScore,
  };
}
