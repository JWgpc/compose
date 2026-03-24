import { SONG_SCORE_ANNOTATION_TYPE, SONG_SCORE_SCHEMA_VERSION, SONG_SCORE_SECTION_TYPE, SONG_SCORE_TRACK_ROLE } from '../songscore/model.ts';

const sections = [
  {
    id: 'intro',
    label: '朔风起',
    startBar: 1,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.INTRO,
    description: '边塞长风、寒沙古道，角声未起，只有箫意和空旷。',
    energyLevel: 1,
    hookFocus: false,
  },
  {
    id: 'march',
    label: '列阵出塞',
    startBar: 9,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.VERSE,
    description: '鼓声低催，旌旗渐起，军阵在黄沙与寒气里缓缓铺开。',
    energyLevel: 3,
    hookFocus: false,
  },
  {
    id: 'horn',
    label: '角声动地',
    startBar: 17,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.BRIDGE,
    description: '号角横出，回应边关；不是西式铜管，更像古战场上传令的长角。',
    energyLevel: 4,
    hookFocus: true,
  },
  {
    id: 'battle',
    label: '铁骑交锋',
    startBar: 25,
    barCount: 12,
    type: SONG_SCORE_SECTION_TYPE.CHORUS,
    description: '鼓、角、骑阵同时推进，战场宽阔，不止近身厮杀，而是千军横展开来。',
    energyLevel: 5,
    hookFocus: true,
  },
  {
    id: 'elegy',
    label: '残照旌影',
    startBar: 37,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.INTERLUDE,
    description: '战后不写欢呼，只写残照、风沙、斜旌与未散的铁意。',
    energyLevel: 2,
    hookFocus: false,
  },
  {
    id: 'finale',
    label: '边关长歌',
    startBar: 41,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.OUTRO,
    description: '尾段像古战歌回响在塞外：军魂未灭，角声渐远，仍立在风中。',
    energyLevel: 4,
    hookFocus: true,
  },
];

const chordPlan = [
  ['intro', ['Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'A', 'Dm']],
  ['march', ['Dm', 'C', 'Bb', 'A', 'Dm', 'C', 'Gm', 'A']],
  ['horn', ['Dm', 'Dm', 'Gm', 'A', 'Bb', 'A', 'Gm', 'A']],
  ['battle', ['Dm', 'Gm', 'Bb', 'A', 'Dm', 'C', 'Bb', 'A', 'Dm', 'Gm', 'A', 'Dm']],
  ['elegy', ['Gm', 'Dm', 'Bb', 'A']],
  ['finale', ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'A', 'Bb', 'Dm']],
];

const sectionBarLookup = Object.fromEntries(sections.map((section) => [section.id, section.startBar]));
const chords = [];
chordPlan.forEach(([sectionId, symbols]) => {
  const startBar = sectionBarLookup[sectionId];
  symbols.forEach((symbol, index) => {
    chords.push({
      bar: startBar + index,
      beat: 1,
      symbol,
      durationBeats: 4,
      sectionId,
    });
  });
});

const notes = [];

function midiToPitch(midi) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[midi % 12]}${octave}`;
}

function pushNote(trackId, sectionId, midi, startBeat, durationBeats, velocity, accent = 'light') {
  notes.push({
    pitch: midiToPitch(midi),
    midi,
    startBeat,
    durationBeats,
    trackId,
    sectionId,
    velocity,
    accent,
  });
}

function addPattern(trackId, sectionId, bar, pattern) {
  const startBeat = (bar - 1) * 4;
  pattern.forEach((note) => {
    pushNote(trackId, sectionId, note.midi, startBeat + note.offset, note.duration, note.velocity, note.accent);
  });
}

function addDrumBar(sectionId, bar, rootMidi, upperMidi, velocityBase = 64, dense = false) {
  const startBeat = (bar - 1) * 4;
  if (dense) {
    [
      [0, rootMidi - 12, velocityBase + 18, 'strong'],
      [0, rootMidi, velocityBase + 12, 'strong'],
      [0.5, rootMidi + 12, velocityBase + 7, 'medium'],
      [1, upperMidi, velocityBase + 10, 'strong'],
      [1.5, rootMidi, velocityBase + 8, 'medium'],
      [2, rootMidi - 12, velocityBase + 16, 'strong'],
      [2, rootMidi, velocityBase + 10, 'strong'],
      [2.5, rootMidi + 12, velocityBase + 7, 'medium'],
      [3, upperMidi + 12, velocityBase + 10, 'strong'],
      [3.5, rootMidi, velocityBase + 8, 'medium'],
    ].forEach(([offset, midi, velocity, accent]) => {
      pushNote('leftHand', sectionId, midi, startBeat + offset, 0.5, velocity, accent);
    });
    return;
  }

  [
    [0, rootMidi, velocityBase + 6, 'medium'],
    [1, upperMidi, velocityBase, 'light'],
    [2, rootMidi + 12, velocityBase + 2, 'light'],
    [3, upperMidi + 12, velocityBase, 'light'],
  ].forEach(([offset, midi, velocity, accent]) => {
    pushNote('leftHand', sectionId, midi, startBeat + offset, 1, velocity, accent);
  });
}

[
  [1, 'intro', 38, 45, 48, false],
  [2, 'intro', 38, 45, 48, false],
  [3, 'intro', 34, 41, 50, false],
  [4, 'intro', 34, 41, 50, false],
  [5, 'intro', 43, 50, 54, false],
  [6, 'intro', 43, 50, 54, false],
  [7, 'intro', 33, 40, 56, false],
  [8, 'intro', 38, 45, 54, false],
  [9, 'march', 38, 45, 60, false],
  [10, 'march', 36, 43, 60, false],
  [11, 'march', 34, 41, 62, false],
  [12, 'march', 33, 40, 64, false],
  [13, 'march', 38, 45, 62, false],
  [14, 'march', 36, 43, 62, false],
  [15, 'march', 43, 50, 64, false],
  [16, 'march', 33, 40, 66, false],
  [17, 'horn', 38, 45, 64, false],
  [18, 'horn', 38, 45, 64, false],
  [19, 'horn', 43, 50, 66, false],
  [20, 'horn', 33, 40, 68, false],
  [21, 'horn', 34, 41, 66, false],
  [22, 'horn', 33, 40, 68, false],
  [23, 'horn', 43, 50, 66, false],
  [24, 'horn', 33, 40, 68, false],
  [25, 'battle', 38, 45, 72, true],
  [26, 'battle', 43, 50, 74, true],
  [27, 'battle', 34, 41, 74, true],
  [28, 'battle', 33, 40, 76, true],
  [29, 'battle', 38, 45, 74, true],
  [30, 'battle', 36, 43, 72, true],
  [31, 'battle', 34, 41, 74, true],
  [32, 'battle', 33, 40, 76, true],
  [33, 'battle', 38, 45, 76, true],
  [34, 'battle', 43, 50, 78, true],
  [35, 'battle', 33, 40, 80, true],
  [36, 'battle', 38, 45, 78, true],
  [37, 'elegy', 43, 50, 56, false],
  [38, 'elegy', 38, 45, 54, false],
  [39, 'elegy', 34, 41, 54, false],
  [40, 'elegy', 33, 40, 56, false],
  [41, 'finale', 38, 45, 68, true],
  [42, 'finale', 34, 41, 68, true],
  [43, 'finale', 43, 50, 70, true],
  [44, 'finale', 33, 40, 72, true],
  [45, 'finale', 38, 45, 72, true],
  [46, 'finale', 33, 40, 74, true],
  [47, 'finale', 34, 41, 72, true],
  [48, 'finale', 38, 45, 68, true],
].forEach(([bar, sectionId, rootMidi, upperMidi, velocityBase, dense]) => {
  addDrumBar(sectionId, bar, rootMidi, upperMidi, velocityBase, dense);
});

const introPatterns = [
  [{ offset: 0, midi: 69, duration: 2, velocity: 66 }, { offset: 2, midi: 74, duration: 2, velocity: 72, accent: 'medium' }],
  [{ offset: 0, midi: 77, duration: 3, velocity: 70 }, { offset: 3, midi: 74, duration: 1, velocity: 66 }],
  [{ offset: 0, midi: 70, duration: 1, velocity: 68 }, { offset: 1, midi: 74, duration: 1, velocity: 72 }, { offset: 2, midi: 77, duration: 2, velocity: 74 }],
  [{ offset: 0, midi: 74, duration: 4, velocity: 68 }],
  [{ offset: 0, midi: 77, duration: 2, velocity: 72 }, { offset: 2, midi: 79, duration: 2, velocity: 76 }],
  [{ offset: 0, midi: 77, duration: 1, velocity: 72 }, { offset: 1, midi: 74, duration: 1, velocity: 68 }, { offset: 2, midi: 70, duration: 2, velocity: 66 }],
  [{ offset: 0, midi: 76, duration: 1, velocity: 72 }, { offset: 1, midi: 81, duration: 2, velocity: 80, accent: 'medium' }, { offset: 3, midi: 79, duration: 1, velocity: 74 }],
  [{ offset: 0, midi: 74, duration: 4, velocity: 70 }],
];
introPatterns.forEach((pattern, i) => addPattern('rightHand', 'intro', i + 1, pattern));

const marchPatterns = [
  [{ offset: 0, midi: 74, duration: 1, velocity: 80 }, { offset: 1, midi: 77, duration: 1, velocity: 84 }, { offset: 2, midi: 81, duration: 1, velocity: 86 }, { offset: 3, midi: 77, duration: 1, velocity: 80 }],
  [{ offset: 0, midi: 76, duration: 1, velocity: 80 }, { offset: 1, midi: 79, duration: 1, velocity: 84 }, { offset: 2, midi: 81, duration: 1, velocity: 86 }, { offset: 3, midi: 79, duration: 1, velocity: 80 }],
  [{ offset: 0, midi: 77, duration: 2, velocity: 80 }, { offset: 2, midi: 74, duration: 1, velocity: 76 }, { offset: 3, midi: 72, duration: 1, velocity: 72 }],
  [{ offset: 0, midi: 76, duration: 1, velocity: 82 }, { offset: 1, midi: 81, duration: 2, velocity: 90, accent: 'strong' }, { offset: 3, midi: 79, duration: 1, velocity: 82 }],
  [{ offset: 0, midi: 74, duration: 1, velocity: 82 }, { offset: 1, midi: 77, duration: 1, velocity: 86 }, { offset: 2, midi: 81, duration: 1, velocity: 88 }, { offset: 3, midi: 84, duration: 1, velocity: 90, accent: 'medium' }],
  [{ offset: 0, midi: 79, duration: 1, velocity: 82 }, { offset: 1, midi: 77, duration: 1, velocity: 78 }, { offset: 2, midi: 76, duration: 1, velocity: 76 }, { offset: 3, midi: 74, duration: 1, velocity: 74 }],
  [{ offset: 0, midi: 77, duration: 2, velocity: 82 }, { offset: 2, midi: 81, duration: 1, velocity: 88 }, { offset: 3, midi: 84, duration: 1, velocity: 90 }],
  [{ offset: 0, midi: 81, duration: 3, velocity: 90, accent: 'strong' }, { offset: 3, midi: 79, duration: 1, velocity: 82 }],
];
marchPatterns.forEach((pattern, i) => addPattern('rightHand', 'march', i + 9, pattern));

const hornPatterns = [
  [{ offset: 0, midi: 74, duration: 2, velocity: 82 }, { offset: 2, midi: 77, duration: 2, velocity: 84 }],
  [{ offset: 0, midi: 81, duration: 4, velocity: 86, accent: 'medium' }],
  [{ offset: 0, midi: 79, duration: 2, velocity: 84 }, { offset: 2, midi: 82, duration: 2, velocity: 88, accent: 'medium' }],
  [{ offset: 0, midi: 84, duration: 4, velocity: 90, accent: 'strong' }],
  [{ offset: 0, midi: 82, duration: 2, velocity: 86 }, { offset: 2, midi: 79, duration: 2, velocity: 82 }],
  [{ offset: 0, midi: 77, duration: 1, velocity: 82 }, { offset: 1, midi: 81, duration: 1, velocity: 88 }, { offset: 2, midi: 84, duration: 2, velocity: 92, accent: 'strong' }],
  [{ offset: 0, midi: 82, duration: 2, velocity: 88 }, { offset: 2, midi: 79, duration: 1, velocity: 82 }, { offset: 3, midi: 77, duration: 1, velocity: 80 }],
  [{ offset: 0, midi: 81, duration: 4, velocity: 90, accent: 'strong' }],
];
hornPatterns.forEach((pattern, i) => addPattern('rightHand', 'horn', i + 17, pattern));

const battlePatterns = [
  [{ offset: 0, midi: 81, duration: 0.5, velocity: 100, accent: 'strong' }, { offset: 0.5, midi: 77, duration: 0.5, velocity: 94, accent: 'strong' }, { offset: 1, midi: 74, duration: 0.5, velocity: 90 }, { offset: 1.5, midi: 79, duration: 0.5, velocity: 96, accent: 'strong' }, { offset: 2, midi: 82, duration: 1, velocity: 100, accent: 'strong' }, { offset: 3, midi: 86, duration: 1, velocity: 102, accent: 'strong' }],
  [{ offset: 0, midi: 89, duration: 1, velocity: 104, accent: 'strong' }, { offset: 1, midi: 86, duration: 1, velocity: 98, accent: 'strong' }, { offset: 2, midi: 84, duration: 1, velocity: 96, accent: 'strong' }, { offset: 3, midi: 81, duration: 1, velocity: 92 }],
  [{ offset: 0, midi: 82, duration: 0.5, velocity: 96, accent: 'strong' }, { offset: 0.5, midi: 79, duration: 0.5, velocity: 92 }, { offset: 1, midi: 77, duration: 1, velocity: 90 }, { offset: 2, midi: 81, duration: 1, velocity: 96, accent: 'strong' }, { offset: 3, midi: 84, duration: 1, velocity: 100, accent: 'strong' }],
  [{ offset: 0, midi: 81, duration: 0.5, velocity: 94, accent: 'strong' }, { offset: 0.5, midi: 77, duration: 0.5, velocity: 90 }, { offset: 1, midi: 74, duration: 0.5, velocity: 88 }, { offset: 1.5, midi: 73, duration: 0.5, velocity: 92, accent: 'strong' }, { offset: 2, midi: 76, duration: 1, velocity: 90 }, { offset: 3, midi: 81, duration: 1, velocity: 98, accent: 'strong' }],
  [{ offset: 0, midi: 86, duration: 1, velocity: 104, accent: 'strong' }, { offset: 1, midi: 89, duration: 1, velocity: 108, accent: 'strong' }, { offset: 2, midi: 91, duration: 1, velocity: 110, accent: 'strong' }, { offset: 3, midi: 89, duration: 1, velocity: 102, accent: 'strong' }],
  [{ offset: 0, midi: 84, duration: 0.5, velocity: 98, accent: 'strong' }, { offset: 0.5, midi: 81, duration: 0.5, velocity: 94, accent: 'strong' }, { offset: 1, midi: 79, duration: 1, velocity: 92 }, { offset: 2, midi: 84, duration: 1, velocity: 98, accent: 'strong' }, { offset: 3, midi: 86, duration: 1, velocity: 102, accent: 'strong' }],
  [{ offset: 0, midi: 82, duration: 0.5, velocity: 96, accent: 'strong' }, { offset: 0.5, midi: 79, duration: 0.5, velocity: 92 }, { offset: 1, midi: 77, duration: 0.5, velocity: 90 }, { offset: 1.5, midi: 81, duration: 0.5, velocity: 96, accent: 'strong' }, { offset: 2, midi: 84, duration: 1, velocity: 100, accent: 'strong' }, { offset: 3, midi: 86, duration: 1, velocity: 104, accent: 'strong' }],
  [{ offset: 0, midi: 89, duration: 1, velocity: 108, accent: 'strong' }, { offset: 1, midi: 86, duration: 1, velocity: 102, accent: 'strong' }, { offset: 2, midi: 84, duration: 1, velocity: 100, accent: 'strong' }, { offset: 3, midi: 81, duration: 1, velocity: 96 }],
  [{ offset: 0, midi: 86, duration: 1, velocity: 104, accent: 'strong' }, { offset: 1, midi: 89, duration: 1, velocity: 108, accent: 'strong' }, { offset: 2, midi: 93, duration: 1, velocity: 112, accent: 'strong' }, { offset: 3, midi: 89, duration: 1, velocity: 104, accent: 'strong' }],
  [{ offset: 0, midi: 84, duration: 1, velocity: 98, accent: 'strong' }, { offset: 1, midi: 86, duration: 1, velocity: 102, accent: 'strong' }, { offset: 2, midi: 89, duration: 1, velocity: 106, accent: 'strong' }, { offset: 3, midi: 91, duration: 1, velocity: 108, accent: 'strong' }],
  [{ offset: 0, midi: 89, duration: 1, velocity: 108, accent: 'strong' }, { offset: 1, midi: 86, duration: 1, velocity: 102, accent: 'strong' }, { offset: 2, midi: 84, duration: 1, velocity: 98 }, { offset: 3, midi: 81, duration: 1, velocity: 94 }],
  [{ offset: 0, midi: 86, duration: 4, velocity: 100, accent: 'strong' }],
];
battlePatterns.forEach((pattern, i) => addPattern('rightHand', 'battle', i + 25, pattern));

const elegyPatterns = [
  [{ offset: 0, midi: 70, duration: 2, velocity: 66 }, { offset: 2, midi: 74, duration: 2, velocity: 70 }],
  [{ offset: 0, midi: 69, duration: 3, velocity: 60 }, { offset: 3, midi: 65, duration: 1, velocity: 56 }],
  [{ offset: 0, midi: 74, duration: 1, velocity: 58 }, { offset: 1, midi: 72, duration: 1, velocity: 56 }, { offset: 2, midi: 69, duration: 2, velocity: 54 }],
  [{ offset: 0, midi: 74, duration: 4, velocity: 52 }],
];
elegyPatterns.forEach((pattern, i) => addPattern('rightHand', 'elegy', i + 37, pattern));

const finalePatterns = [
  [{ offset: 0, midi: 77, duration: 1, velocity: 90, accent: 'strong' }, { offset: 1, midi: 81, duration: 1, velocity: 94, accent: 'strong' }, { offset: 2, midi: 86, duration: 1, velocity: 100, accent: 'strong' }, { offset: 3, midi: 89, duration: 1, velocity: 104, accent: 'strong' }],
  [{ offset: 0, midi: 86, duration: 1, velocity: 92, accent: 'strong' }, { offset: 1, midi: 84, duration: 1, velocity: 88 }, { offset: 2, midi: 82, duration: 1, velocity: 86 }, { offset: 3, midi: 79, duration: 1, velocity: 82 }],
  [{ offset: 0, midi: 82, duration: 1, velocity: 92, accent: 'strong' }, { offset: 1, midi: 86, duration: 1, velocity: 98, accent: 'strong' }, { offset: 2, midi: 89, duration: 1, velocity: 102, accent: 'strong' }, { offset: 3, midi: 86, duration: 1, velocity: 94, accent: 'strong' }],
  [{ offset: 0, midi: 84, duration: 1, velocity: 94, accent: 'strong' }, { offset: 1, midi: 89, duration: 1, velocity: 100, accent: 'strong' }, { offset: 2, midi: 86, duration: 1, velocity: 96, accent: 'strong' }, { offset: 3, midi: 81, duration: 1, velocity: 90 }],
  [{ offset: 0, midi: 91, duration: 1, velocity: 108, accent: 'strong' }, { offset: 1, midi: 89, duration: 1, velocity: 104, accent: 'strong' }, { offset: 2, midi: 86, duration: 1, velocity: 100, accent: 'strong' }, { offset: 3, midi: 84, duration: 1, velocity: 96, accent: 'strong' }],
  [{ offset: 0, midi: 86, duration: 0.5, velocity: 98, accent: 'strong' }, { offset: 0.5, midi: 84, duration: 0.5, velocity: 94, accent: 'strong' }, { offset: 1, midi: 81, duration: 1, velocity: 90 }, { offset: 2, midi: 86, duration: 1, velocity: 96, accent: 'strong' }, { offset: 3, midi: 82, duration: 1, velocity: 88 }],
  [{ offset: 0, midi: 81, duration: 1, velocity: 84 }, { offset: 1, midi: 77, duration: 1, velocity: 80 }, { offset: 2, midi: 74, duration: 1, velocity: 76 }, { offset: 3, midi: 69, duration: 1, velocity: 72 }],
  [{ offset: 0, midi: 74, duration: 4, velocity: 68, accent: 'medium' }],
];
finalePatterns.forEach((pattern, i) => addPattern('rightHand', 'finale', i + 41, pattern));

const warLayerEvents = [
  [9, 'march', [{ offset: 0, midi: 62, duration: 2, velocity: 68 }, { offset: 2, midi: 65, duration: 2, velocity: 70 }]],
  [10, 'march', [{ offset: 0, midi: 64, duration: 2, velocity: 68 }, { offset: 2, midi: 67, duration: 2, velocity: 70 }]],
  [11, 'march', [{ offset: 0, midi: 65, duration: 4, velocity: 72, accent: 'medium' }]],
  [12, 'march', [{ offset: 0, midi: 69, duration: 4, velocity: 74, accent: 'medium' }]],
  [13, 'march', [{ offset: 0, midi: 62, duration: 2, velocity: 70 }, { offset: 2, midi: 65, duration: 2, velocity: 72 }]],
  [14, 'march', [{ offset: 0, midi: 64, duration: 2, velocity: 70 }, { offset: 2, midi: 67, duration: 2, velocity: 72 }]],
  [15, 'march', [{ offset: 0, midi: 70, duration: 4, velocity: 76, accent: 'medium' }]],
  [16, 'march', [{ offset: 0, midi: 69, duration: 4, velocity: 78, accent: 'medium' }]],
  [17, 'horn', [{ offset: 0, midi: 69, duration: 4, velocity: 78, accent: 'medium' }]],
  [18, 'horn', [{ offset: 0, midi: 72, duration: 4, velocity: 80, accent: 'medium' }]],
  [19, 'horn', [{ offset: 0, midi: 74, duration: 2, velocity: 82, accent: 'medium' }, { offset: 2, midi: 77, duration: 2, velocity: 84, accent: 'medium' }]],
  [20, 'horn', [{ offset: 0, midi: 79, duration: 4, velocity: 86, accent: 'strong' }]],
  [21, 'horn', [{ offset: 0, midi: 77, duration: 2, velocity: 82 }, { offset: 2, midi: 74, duration: 2, velocity: 80 }]],
  [22, 'horn', [{ offset: 0, midi: 76, duration: 4, velocity: 84, accent: 'medium' }]],
  [23, 'horn', [{ offset: 0, midi: 74, duration: 2, velocity: 82 }, { offset: 2, midi: 77, duration: 2, velocity: 84 }]],
  [24, 'horn', [{ offset: 0, midi: 81, duration: 4, velocity: 88, accent: 'strong' }]],
  [25, 'battle', [{ offset: 0, midi: 74, duration: 2, velocity: 84 }, { offset: 2, midi: 77, duration: 2, velocity: 86 }]],
  [26, 'battle', [{ offset: 0, midi: 79, duration: 4, velocity: 88, accent: 'strong' }]],
  [27, 'battle', [{ offset: 0, midi: 77, duration: 2, velocity: 86 }, { offset: 2, midi: 81, duration: 2, velocity: 90, accent: 'strong' }]],
  [28, 'battle', [{ offset: 0, midi: 81, duration: 4, velocity: 92, accent: 'strong' }]],
  [29, 'battle', [{ offset: 0, midi: 74, duration: 2, velocity: 84 }, { offset: 2, midi: 77, duration: 2, velocity: 86 }]],
  [30, 'battle', [{ offset: 0, midi: 76, duration: 2, velocity: 84 }, { offset: 2, midi: 79, duration: 2, velocity: 88, accent: 'strong' }]],
  [31, 'battle', [{ offset: 0, midi: 77, duration: 2, velocity: 86, accent: 'strong' }, { offset: 2, midi: 81, duration: 2, velocity: 90, accent: 'strong' }]],
  [32, 'battle', [{ offset: 0, midi: 81, duration: 4, velocity: 92, accent: 'strong' }]],
  [33, 'battle', [{ offset: 0, midi: 86, duration: 2, velocity: 94, accent: 'strong' }, { offset: 2, midi: 89, duration: 2, velocity: 96, accent: 'strong' }]],
  [34, 'battle', [{ offset: 0, midi: 88, duration: 2, velocity: 96, accent: 'strong' }, { offset: 2, midi: 91, duration: 2, velocity: 100, accent: 'strong' }]],
  [35, 'battle', [{ offset: 0, midi: 89, duration: 4, velocity: 102, accent: 'strong' }]],
  [36, 'battle', [{ offset: 0, midi: 86, duration: 4, velocity: 96, accent: 'strong' }]],
  [41, 'finale', [{ offset: 0, midi: 74, duration: 2, velocity: 82 }, { offset: 2, midi: 77, duration: 2, velocity: 84 }]],
  [42, 'finale', [{ offset: 0, midi: 79, duration: 4, velocity: 86, accent: 'strong' }]],
  [43, 'finale', [{ offset: 0, midi: 77, duration: 2, velocity: 84 }, { offset: 2, midi: 81, duration: 2, velocity: 88, accent: 'strong' }]],
  [44, 'finale', [{ offset: 0, midi: 81, duration: 4, velocity: 90, accent: 'strong' }]],
  [45, 'finale', [{ offset: 0, midi: 86, duration: 2, velocity: 92, accent: 'strong' }, { offset: 2, midi: 89, duration: 2, velocity: 94, accent: 'strong' }]],
  [46, 'finale', [{ offset: 0, midi: 84, duration: 2, velocity: 90, accent: 'strong' }, { offset: 2, midi: 86, duration: 2, velocity: 92, accent: 'strong' }]],
  [47, 'finale', [{ offset: 0, midi: 81, duration: 2, velocity: 86 }, { offset: 2, midi: 77, duration: 2, velocity: 82 }]],
  [48, 'finale', [{ offset: 0, midi: 74, duration: 4, velocity: 80, accent: 'medium' }]],
];
warLayerEvents.forEach(([bar, sectionId, pattern]) => addPattern('warLayer', sectionId, bar, pattern));

export const testDemo6SongScore = {
  schemaVersion: SONG_SCORE_SCHEMA_VERSION,
  meta: {
    title: '朔风战歌',
    composer: 'OpenClaw',
    tempoBpm: 76,
    timeSignature: '4/4',
    key: 'D minor',
    unitNoteLength: '1/8',
    genre: 'Ancient Frontier War Song',
    mood: '边塞 / 角鼓 / 肃杀 / 壮烈',
    tags: ['war', 'frontier', 'xiao-inspired', 'ancient-china', 'horn-calls', 'war-drums', 'instrumental'],
  },
  sections,
  tracks: [
    {
      id: 'rightHand',
      name: 'Right Hand',
      role: SONG_SCORE_TRACK_ROLE.MELODY,
      instrumentHint: 'xiao-like lead on piano',
      color: '#8ccfff',
    },
    {
      id: 'leftHand',
      name: 'Left Hand',
      role: SONG_SCORE_TRACK_ROLE.CHORDS,
      instrumentHint: 'war drum / low frame drum feel',
      color: '#ffd38c',
    },
    {
      id: 'warLayer',
      name: 'War Layer',
      role: SONG_SCORE_TRACK_ROLE.COUNTERMELODY,
      instrumentHint: 'ancient horn / open-field calls / banner wind',
      color: '#ff9fb3',
    },
  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'intro',
      text: '开头像边关风沙中的独箫与空城轮廓，先把天地立起来。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'march',
      text: '不要像西式铜管齐奏，要更像低鼓催行、军旗展开、长阵出塞。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'horn',
      text: '这一段的核心是角声：粗粝、辽远、带命令感，不要太抒情。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'battle',
      text: '高潮是古战场横向展开：鼓点压地、角声穿空、铁骑并进，不是西式大片和声堆叠。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'elegy',
      text: '战后只留残照、斜旌、风沙，像人退去后战意还挂在天边。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'finale',
      text: '尾段要像边关长歌：不炫胜利，而是把军魂和苍凉一起写进去。',
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      leftHand: 'realistic-piano',
      warLayer: 'realistic-piano',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.1,
  },
  sourceFormat: 'story',
  sourceText: '战争主题器乐曲：更偏古中国战场的角、鼓、旌旗、边塞风沙语汇，并扩写为 48 小节的完整段落。',
};
