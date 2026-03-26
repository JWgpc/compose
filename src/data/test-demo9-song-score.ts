import { SONG_SCORE_ANNOTATION_TYPE, SONG_SCORE_SCHEMA_VERSION, SONG_SCORE_SECTION_TYPE, SONG_SCORE_TRACK_ROLE } from '../songscore/model.ts';

function midiToPitch(midi) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[midi % 12]}${octave}`;
}

const notes = [];

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

const sections = [
  {
    id: 'porch',
    label: '门前晚风',
    startBar: 1,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.INTRO,
    description: '天还没黑透，门前的风先把一天吹松下来。',
    energyLevel: 1,
    hookFocus: false,
  },
  {
    id: 'lane',
    label: '巷口慢走',
    startBar: 5,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.VERSE,
    description: '脚步不快，只是沿着熟悉的小路慢慢往前。',
    energyLevel: 2,
    hookFocus: false,
  },
  {
    id: 'light',
    label: '灯一盏盏亮',
    startBar: 9,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.CHORUS,
    description: '街边的灯和心里的亮意一起升起来。',
    energyLevel: 4,
    hookFocus: true,
  },
  {
    id: 'home',
    label: '抱着余温回家',
    startBar: 13,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.OUTRO,
    description: '不张扬，只带着一点余温回到屋里。',
    energyLevel: 2,
    hookFocus: false,
  },
];

const chords = [
  { bar: 1, beat: 1, symbol: 'Gadd9', durationBeats: 4, sectionId: 'porch' },
  { bar: 2, beat: 1, symbol: 'D/F#', durationBeats: 4, sectionId: 'porch' },
  { bar: 3, beat: 1, symbol: 'Em7', durationBeats: 4, sectionId: 'porch' },
  { bar: 4, beat: 1, symbol: 'Cmaj7', durationBeats: 4, sectionId: 'porch' },

  { bar: 5, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'lane' },
  { bar: 6, beat: 1, symbol: 'D', durationBeats: 4, sectionId: 'lane' },
  { bar: 7, beat: 1, symbol: 'Em7', durationBeats: 4, sectionId: 'lane' },
  { bar: 8, beat: 1, symbol: 'Cadd9', durationBeats: 4, sectionId: 'lane' },

  { bar: 9, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'light' },
  { bar: 10, beat: 1, symbol: 'D/F#', durationBeats: 4, sectionId: 'light' },
  { bar: 11, beat: 1, symbol: 'Em7', durationBeats: 4, sectionId: 'light' },
  { bar: 12, beat: 1, symbol: 'Cmaj9', durationBeats: 4, sectionId: 'light' },

  { bar: 13, beat: 1, symbol: 'G/B', durationBeats: 4, sectionId: 'home' },
  { bar: 14, beat: 1, symbol: 'D', durationBeats: 4, sectionId: 'home' },
  { bar: 15, beat: 1, symbol: 'Cmaj7', durationBeats: 4, sectionId: 'home' },
  { bar: 16, beat: 1, symbol: 'Gadd9', durationBeats: 4, sectionId: 'home' },
];

const guitarPatterns = [
  [
    { offset: 0, midi: 67, duration: 1, velocity: 74 },
    { offset: 1, midi: 71, duration: 1, velocity: 70 },
    { offset: 2, midi: 74, duration: 1.5, velocity: 76 },
    { offset: 3.5, midi: 71, duration: 0.5, velocity: 68 },
  ],
  [
    { offset: 0, midi: 66, duration: 1, velocity: 72 },
    { offset: 1, midi: 69, duration: 1, velocity: 68 },
    { offset: 2, midi: 74, duration: 1.5, velocity: 74 },
    { offset: 3.5, midi: 69, duration: 0.5, velocity: 66 },
  ],
  [
    { offset: 0, midi: 67, duration: 1, velocity: 74 },
    { offset: 1, midi: 71, duration: 1, velocity: 70 },
    { offset: 2, midi: 76, duration: 1, velocity: 78 },
    { offset: 3, midi: 79, duration: 1, velocity: 80 },
  ],
  [
    { offset: 0, midi: 74, duration: 1, velocity: 70 },
    { offset: 1, midi: 72, duration: 1, velocity: 68 },
    { offset: 2, midi: 71, duration: 1, velocity: 66 },
    { offset: 3, midi: 67, duration: 1, velocity: 64 },
  ],

  [
    { offset: 0, midi: 71, duration: 0.5, velocity: 78 },
    { offset: 0.5, midi: 74, duration: 0.5, velocity: 80 },
    { offset: 1, midi: 79, duration: 1, velocity: 84 },
    { offset: 2, midi: 76, duration: 1, velocity: 80 },
    { offset: 3, midi: 74, duration: 1, velocity: 76 },
  ],
  [
    { offset: 0, midi: 69, duration: 0.5, velocity: 76 },
    { offset: 0.5, midi: 74, duration: 0.5, velocity: 80 },
    { offset: 1, midi: 78, duration: 1, velocity: 84 },
    { offset: 2, midi: 74, duration: 1, velocity: 78 },
    { offset: 3, midi: 71, duration: 1, velocity: 74 },
  ],
  [
    { offset: 0, midi: 67, duration: 0.5, velocity: 76 },
    { offset: 0.5, midi: 71, duration: 0.5, velocity: 80 },
    { offset: 1, midi: 76, duration: 1, velocity: 84 },
    { offset: 2, midi: 79, duration: 1, velocity: 88 },
    { offset: 3, midi: 76, duration: 1, velocity: 82 },
  ],
  [
    { offset: 0, midi: 74, duration: 1, velocity: 78 },
    { offset: 1, midi: 72, duration: 1, velocity: 74 },
    { offset: 2, midi: 71, duration: 1, velocity: 72 },
    { offset: 3, midi: 67, duration: 1, velocity: 68 },
  ],

  [
    { offset: 0, midi: 74, duration: 0.5, velocity: 84 },
    { offset: 0.5, midi: 79, duration: 0.5, velocity: 88 },
    { offset: 1, midi: 83, duration: 1, velocity: 94, accent: 'strong' },
    { offset: 2, midi: 79, duration: 1, velocity: 88 },
    { offset: 3, midi: 76, duration: 1, velocity: 84 },
  ],
  [
    { offset: 0, midi: 74, duration: 0.5, velocity: 84 },
    { offset: 0.5, midi: 78, duration: 0.5, velocity: 88 },
    { offset: 1, midi: 81, duration: 1, velocity: 92 },
    { offset: 2, midi: 78, duration: 1, velocity: 86 },
    { offset: 3, midi: 74, duration: 1, velocity: 82 },
  ],
  [
    { offset: 0, midi: 76, duration: 0.5, velocity: 84 },
    { offset: 0.5, midi: 79, duration: 0.5, velocity: 88 },
    { offset: 1, midi: 83, duration: 1, velocity: 94 },
    { offset: 2, midi: 88, duration: 1, velocity: 98, accent: 'strong' },
    { offset: 3, midi: 83, duration: 1, velocity: 90 },
  ],
  [
    { offset: 0, midi: 79, duration: 1, velocity: 86 },
    { offset: 1, midi: 76, duration: 1, velocity: 82 },
    { offset: 2, midi: 74, duration: 1, velocity: 78 },
    { offset: 3, midi: 71, duration: 1, velocity: 74 },
  ],

  [
    { offset: 0, midi: 71, duration: 1, velocity: 70 },
    { offset: 1, midi: 74, duration: 1, velocity: 68 },
    { offset: 2, midi: 79, duration: 1, velocity: 72 },
    { offset: 3, midi: 74, duration: 1, velocity: 66 },
  ],
  [
    { offset: 0, midi: 69, duration: 1, velocity: 68 },
    { offset: 1, midi: 74, duration: 1, velocity: 66 },
    { offset: 2, midi: 78, duration: 1, velocity: 70 },
    { offset: 3, midi: 74, duration: 1, velocity: 64 },
  ],
  [
    { offset: 0, midi: 67, duration: 2, velocity: 66 },
    { offset: 2, midi: 71, duration: 2, velocity: 64 },
  ],
  [
    { offset: 0, midi: 67, duration: 4, velocity: 62 },
  ],
];

const guitarBedPatterns = [
  [{ offset: 0, midi: 55, duration: 1, velocity: 38 }, { offset: 2, midi: 62, duration: 2, velocity: 40 }],
  [{ offset: 0, midi: 54, duration: 1, velocity: 38 }, { offset: 2, midi: 62, duration: 2, velocity: 40 }],
  [{ offset: 0, midi: 52, duration: 1, velocity: 36 }, { offset: 2, midi: 59, duration: 2, velocity: 38 }],
  [{ offset: 0, midi: 52, duration: 1, velocity: 36 }, { offset: 2, midi: 59, duration: 2, velocity: 38 }],

  [{ offset: 0, midi: 55, duration: 0.75, velocity: 42 }, { offset: 1.5, midi: 62, duration: 0.75, velocity: 40 }, { offset: 3, midi: 67, duration: 1, velocity: 42 }],
  [{ offset: 0, midi: 54, duration: 0.75, velocity: 42 }, { offset: 1.5, midi: 62, duration: 0.75, velocity: 40 }, { offset: 3, midi: 66, duration: 1, velocity: 42 }],
  [{ offset: 0, midi: 52, duration: 0.75, velocity: 40 }, { offset: 1.5, midi: 59, duration: 0.75, velocity: 38 }, { offset: 3, midi: 62, duration: 1, velocity: 40 }],
  [{ offset: 0, midi: 52, duration: 0.75, velocity: 40 }, { offset: 1.5, midi: 60, duration: 0.75, velocity: 38 }, { offset: 3, midi: 64, duration: 1, velocity: 40 }],

  [{ offset: 0, midi: 55, duration: 0.75, velocity: 44 }, { offset: 1.5, midi: 62, duration: 0.75, velocity: 42 }, { offset: 3, midi: 67, duration: 1, velocity: 44 }],
  [{ offset: 0, midi: 54, duration: 0.75, velocity: 44 }, { offset: 1.5, midi: 62, duration: 0.75, velocity: 42 }, { offset: 3, midi: 66, duration: 1, velocity: 44 }],
  [{ offset: 0, midi: 52, duration: 0.75, velocity: 44 }, { offset: 1.5, midi: 59, duration: 0.75, velocity: 42 }, { offset: 3, midi: 62, duration: 1, velocity: 44 }],
  [{ offset: 0, midi: 52, duration: 0.75, velocity: 44 }, { offset: 1.5, midi: 59, duration: 0.75, velocity: 42 }, { offset: 3, midi: 64, duration: 1, velocity: 44 }],

  [{ offset: 0, midi: 59, duration: 1, velocity: 36 }, { offset: 2, midi: 67, duration: 2, velocity: 38 }],
  [{ offset: 0, midi: 54, duration: 1, velocity: 36 }, { offset: 2, midi: 62, duration: 2, velocity: 38 }],
  [{ offset: 0, midi: 52, duration: 1, velocity: 34 }, { offset: 2, midi: 59, duration: 2, velocity: 36 }],
  [{ offset: 0, midi: 55, duration: 4, velocity: 34 }],
];

for (let bar = 1; bar <= 4; bar += 1) {
  addPattern('rightHand', 'porch', bar, guitarPatterns[bar - 1]);
  addPattern('guitarBed', 'porch', bar, guitarBedPatterns[bar - 1]);
}
for (let bar = 5; bar <= 8; bar += 1) {
  addPattern('rightHand', 'lane', bar, guitarPatterns[bar - 1]);
  addPattern('guitarBed', 'lane', bar, guitarBedPatterns[bar - 1]);
}
for (let bar = 9; bar <= 12; bar += 1) {
  addPattern('rightHand', 'light', bar, guitarPatterns[bar - 1]);
  addPattern('guitarBed', 'light', bar, guitarBedPatterns[bar - 1]);
}
for (let bar = 13; bar <= 16; bar += 1) {
  addPattern('rightHand', 'home', bar, guitarPatterns[bar - 1]);
  addPattern('guitarBed', 'home', bar, guitarBedPatterns[bar - 1]);
}

export const testDemo9SongScore = {
  schemaVersion: SONG_SCORE_SCHEMA_VERSION,
  meta: {
    title: '晚风抱着尼龙弦',
    composer: 'OpenClaw',
    tempoBpm: 92,
    timeSignature: '4/4',
    key: 'G major',
    unitNoteLength: '1/8',
    genre: 'Nylon Guitar Sketch',
    mood: '晚风 / 温柔 / 归家 / 小路灯光',
    tags: ['nylon-guitar', 'instrumental', 'evening', 'warm', 'homecoming'],
  },
  sections,
  tracks: [
    {
      id: 'rightHand',
      name: 'Right Hand',
      role: SONG_SCORE_TRACK_ROLE.MELODY,
      instrumentHint: 'piano lead carries the tune clearly and sings the hook',
      color: '#8ccfff',
    },
    {
      id: 'guitarBed',
      name: 'Guitar Bed',
      role: SONG_SCORE_TRACK_ROLE.CHORDS,
      instrumentHint: 'nylon guitar arpeggios provide warm harmonic motion under the piano',
      color: '#ffd38c',
    },
  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'porch',
      text: '先让吉他把和声空气拨开，钢琴再慢半步说出第一句。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'lane',
      text: '主角改成钢琴旋律；吉他只负责更稀、更轻的温暖分解和弦与步伐感，不抢中高音线条。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'light',
      text: '高潮把钢琴旋律抬亮一点就够了；吉他仍旧低密度托底，像路灯一盏盏亮起来。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'home',
      text: '尾声先收钢琴，再让吉他留一点木质余温结束。',
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      guitarBed: 'kyster-nylon-guitar',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.07,
  },
  sourceFormat: 'story',
  sourceText: '傍晚、巷口、小路、灯慢慢亮起来。主角改为钢琴主旋律，尼龙弦吉他只做温暖的分解和弦底色与步伐。',
};
