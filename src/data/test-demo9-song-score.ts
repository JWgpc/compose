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
    label: '门前停一下',
    startBar: 1,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.INTRO,
    description: '人先停在门前，听一听风，再往前走。',
    energyLevel: 1,
    hookFocus: false,
  },
  {
    id: 'lane',
    label: '沿着小路走',
    startBar: 5,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.VERSE,
    description: '脚步有规律，但不着急，像心里慢慢松下来。',
    energyLevel: 2,
    hookFocus: false,
  },
  {
    id: 'light',
    label: '灯慢慢亮起来',
    startBar: 9,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.CHORUS,
    description: '不是爆发，而是视线和心一起亮一点。',
    energyLevel: 3,
    hookFocus: true,
  },
  {
    id: 'home',
    label: '带着余温回家',
    startBar: 13,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.OUTRO,
    description: '最后把话收小，只留一点亮和一点暖。',
    energyLevel: 2,
    hookFocus: false,
  },
];

const chords = [
  { bar: 1, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'porch' },
  { bar: 2, beat: 1, symbol: 'Dadd2', durationBeats: 4, sectionId: 'porch' },
  { bar: 3, beat: 1, symbol: 'Em7', durationBeats: 4, sectionId: 'porch' },
  { bar: 4, beat: 1, symbol: 'Cmaj7', durationBeats: 4, sectionId: 'porch' },

  { bar: 5, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'lane' },
  { bar: 6, beat: 1, symbol: 'D', durationBeats: 4, sectionId: 'lane' },
  { bar: 7, beat: 1, symbol: 'Em', durationBeats: 4, sectionId: 'lane' },
  { bar: 8, beat: 1, symbol: 'Cadd9', durationBeats: 4, sectionId: 'lane' },

  { bar: 9, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'light' },
  { bar: 10, beat: 1, symbol: 'Dadd2', durationBeats: 4, sectionId: 'light' },
  { bar: 11, beat: 1, symbol: 'Em', durationBeats: 4, sectionId: 'light' },
  { bar: 12, beat: 1, symbol: 'Cmaj7', durationBeats: 4, sectionId: 'light' },

  { bar: 13, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'home' },
  { bar: 14, beat: 1, symbol: 'D', durationBeats: 4, sectionId: 'home' },
  { bar: 15, beat: 1, symbol: 'Cmaj7', durationBeats: 4, sectionId: 'home' },
  { bar: 16, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'home' },
];

const pianoLeadPatterns = [
  [
    { offset: 0.5, midi: 67, duration: 1.5, velocity: 70 },
    { offset: 2.5, midi: 71, duration: 1, velocity: 66 },
  ],
  [
    { offset: 0.5, midi: 69, duration: 1.5, velocity: 68 },
    { offset: 2.5, midi: 74, duration: 1, velocity: 66 },
  ],
  [
    { offset: 0.5, midi: 71, duration: 1.5, velocity: 70 },
    { offset: 2.5, midi: 76, duration: 1, velocity: 68 },
  ],
  [
    { offset: 0.5, midi: 72, duration: 1.5, velocity: 68 },
    { offset: 2.5, midi: 67, duration: 1.5, velocity: 64 },
  ],

  [
    { offset: 0, midi: 71, duration: 1, velocity: 74 },
    { offset: 1.5, midi: 74, duration: 0.5, velocity: 72 },
    { offset: 2, midi: 76, duration: 1, velocity: 76 },
    { offset: 3.5, midi: 74, duration: 0.5, velocity: 70 },
  ],
  [
    { offset: 0, midi: 74, duration: 1, velocity: 74 },
    { offset: 1.5, midi: 76, duration: 0.5, velocity: 72 },
    { offset: 2, midi: 78, duration: 1, velocity: 76 },
    { offset: 3.5, midi: 74, duration: 0.5, velocity: 70 },
  ],
  [
    { offset: 0, midi: 76, duration: 1, velocity: 76 },
    { offset: 1.5, midi: 79, duration: 0.5, velocity: 74 },
    { offset: 2, midi: 83, duration: 1, velocity: 78 },
    { offset: 3.5, midi: 79, duration: 0.5, velocity: 72 },
  ],
  [
    { offset: 0, midi: 79, duration: 1, velocity: 74 },
    { offset: 1.5, midi: 76, duration: 0.5, velocity: 70 },
    { offset: 2, midi: 74, duration: 1.5, velocity: 72 },
  ],

  [
    { offset: 0, midi: 74, duration: 1, velocity: 82 },
    { offset: 1, midi: 79, duration: 1, velocity: 86 },
    { offset: 2, midi: 83, duration: 1, velocity: 90, accent: 'strong' },
    { offset: 3, midi: 79, duration: 1, velocity: 84 },
  ],
  [
    { offset: 0, midi: 74, duration: 1, velocity: 80 },
    { offset: 1, midi: 78, duration: 1, velocity: 84 },
    { offset: 2, midi: 81, duration: 1, velocity: 88 },
    { offset: 3, midi: 78, duration: 1, velocity: 82 },
  ],
  [
    { offset: 0, midi: 76, duration: 1, velocity: 82 },
    { offset: 1, midi: 79, duration: 1, velocity: 86 },
    { offset: 2, midi: 83, duration: 1, velocity: 90 },
    { offset: 3, midi: 88, duration: 1, velocity: 94, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 79, duration: 1, velocity: 80 },
    { offset: 1, midi: 76, duration: 1, velocity: 76 },
    { offset: 2, midi: 74, duration: 2, velocity: 74 },
  ],

  [
    { offset: 0.5, midi: 74, duration: 1.5, velocity: 68 },
    { offset: 2.5, midi: 71, duration: 1, velocity: 64 },
  ],
  [
    { offset: 0.5, midi: 74, duration: 1.5, velocity: 66 },
    { offset: 2.5, midi: 69, duration: 1, velocity: 62 },
  ],
  [
    { offset: 0.5, midi: 72, duration: 1.5, velocity: 64 },
    { offset: 2.5, midi: 67, duration: 1.5, velocity: 60 },
  ],
  [
    { offset: 0.5, midi: 67, duration: 3, velocity: 58 },
  ],
];

const chordPulsePatterns = [
  [
    { offset: 0, midi: 55, duration: 0.4, velocity: 88 },
    { offset: 2, midi: 55, duration: 0.35, velocity: 74 },
  ],
  [
    { offset: 0, midi: 62, duration: 0.4, velocity: 84 },
    { offset: 2, midi: 62, duration: 0.35, velocity: 72 },
  ],
  [
    { offset: 0, midi: 64, duration: 0.4, velocity: 86 },
    { offset: 2, midi: 64, duration: 0.35, velocity: 74 },
  ],
  [
    { offset: 0, midi: 60, duration: 0.4, velocity: 82 },
    { offset: 2, midi: 60, duration: 0.35, velocity: 70 },
  ],

  [
    { offset: 0, midi: 55, duration: 0.35, velocity: 92 },
    { offset: 1.5, midi: 55, duration: 0.25, velocity: 76 },
    { offset: 3, midi: 55, duration: 0.3, velocity: 72 },
  ],
  [
    { offset: 0, midi: 50, duration: 0.35, velocity: 88 },
    { offset: 1.5, midi: 50, duration: 0.25, velocity: 74 },
    { offset: 3, midi: 50, duration: 0.3, velocity: 70 },
  ],
  [
    { offset: 0, midi: 64, duration: 0.35, velocity: 90 },
    { offset: 1.5, midi: 64, duration: 0.25, velocity: 76 },
    { offset: 3, midi: 64, duration: 0.3, velocity: 72 },
  ],
  [
    { offset: 0, midi: 48, duration: 0.35, velocity: 86 },
    { offset: 1.5, midi: 48, duration: 0.25, velocity: 72 },
    { offset: 3, midi: 48, duration: 0.3, velocity: 68 },
  ],

  [
    { offset: 0, midi: 55, duration: 0.35, velocity: 98, accent: 'strong' },
    { offset: 1, midi: 67, duration: 0.28, velocity: 82 },
    { offset: 2, midi: 55, duration: 0.32, velocity: 86 },
    { offset: 3, midi: 67, duration: 0.28, velocity: 80 },
  ],
  [
    { offset: 0, midi: 62, duration: 0.35, velocity: 94 },
    { offset: 1, midi: 50, duration: 0.28, velocity: 80 },
    { offset: 2, midi: 62, duration: 0.32, velocity: 84 },
    { offset: 3, midi: 50, duration: 0.28, velocity: 78 },
  ],
  [
    { offset: 0, midi: 64, duration: 0.35, velocity: 96 },
    { offset: 1, midi: 52, duration: 0.28, velocity: 82 },
    { offset: 2, midi: 64, duration: 0.32, velocity: 86 },
    { offset: 3, midi: 52, duration: 0.28, velocity: 80 },
  ],
  [
    { offset: 0, midi: 60, duration: 0.35, velocity: 92 },
    { offset: 1, midi: 48, duration: 0.28, velocity: 78 },
    { offset: 2, midi: 60, duration: 0.32, velocity: 82 },
    { offset: 3, midi: 48, duration: 0.28, velocity: 76 },
  ],

  [
    { offset: 0, midi: 55, duration: 0.28, velocity: 74 },
    { offset: 2, midi: 55, duration: 0.24, velocity: 62 },
  ],
  [
    { offset: 0, midi: 50, duration: 0.28, velocity: 70 },
    { offset: 2, midi: 50, duration: 0.24, velocity: 60 },
  ],
  [
    { offset: 0, midi: 60, duration: 0.28, velocity: 68 },
    { offset: 2, midi: 60, duration: 0.24, velocity: 58 },
  ],
  [
    { offset: 0, midi: 55, duration: 0.28, velocity: 64 },
  ],
];

for (let bar = 1; bar <= 16; bar += 1) {
  const sectionId = bar <= 4 ? 'porch' : bar <= 8 ? 'lane' : bar <= 12 ? 'light' : 'home';
  addPattern('rightHand', sectionId, bar, pianoLeadPatterns[bar - 1]);
  addPattern('guitarPulse', sectionId, bar, chordPulsePatterns[bar - 1]);
}

export const testDemo9SongScore = {
  schemaVersion: SONG_SCORE_SCHEMA_VERSION,
  meta: {
    title: '晚风走回家',
    composer: 'OpenClaw',
    tempoBpm: 88,
    timeSignature: '4/4',
    key: 'G major',
    unitNoteLength: '1/8',
    genre: 'Evening Piano & Chord Guitar Sketch',
    mood: '傍晚 / 松弛 / 微亮 / 回家路上',
    tags: ['piano', 'nylon-guitar', 'evening', 'homecoming', 'short-strum'],
  },
  sections,
  tracks: [
    {
      id: 'rightHand',
      name: 'Right Hand',
      role: SONG_SCORE_TRACK_ROLE.MELODY,
      instrumentHint: 'piano carries the main line and emotional contour',
      color: '#8ccfff',
    },
    {
      id: 'guitarPulse',
      name: 'Guitar Pulse',
      role: SONG_SCORE_TRACK_ROLE.CHORDS,
      instrumentHint: 'short nylon chord hits mark the walking pulse and warm light',
      color: '#ffd38c',
    },
  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'porch',
      text: '接受吉他是短的：它只轻轻点亮拍子，不负责唱长句。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'lane',
      text: '钢琴负责叙事线；吉他像脚步和门口路灯，一下一下给出存在感。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'light',
      text: '副歌不是把吉他拉长，而是让短促和弦更规律、更明亮，像灯逐盏点开。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'home',
      text: '尾声把节奏收松，吉他只剩几下轻点，钢琴把最后一句说完。',
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      guitarPulse: 'speedy-nylon-open-chords',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.06,
  },
  sourceFormat: 'story',
  sourceText: '傍晚沿着熟悉的小路慢慢回家。钢琴负责把心里的话说出来，短促的尼龙弦和弦像脚步、路灯和偶尔吹过来的风，只是一下一下地点亮气氛。',
};
