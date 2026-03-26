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
    description: '先站一下，风从门前吹过，心里慢慢松开。',
    energyLevel: 1,
    hookFocus: false,
  },
  {
    id: 'lane',
    label: '巷口慢走',
    startBar: 5,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.VERSE,
    description: '沿着熟悉的小路走，脚步不急，光也不急。',
    energyLevel: 2,
    hookFocus: false,
  },
  {
    id: 'light',
    label: '灯一盏盏亮',
    startBar: 9,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.CHORUS,
    description: '不是爆发，是整条路和心一起亮一点。',
    energyLevel: 3,
    hookFocus: true,
  },
  {
    id: 'home',
    label: '抱着余温回家',
    startBar: 13,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.OUTRO,
    description: '最后只剩一点木质余温和一句说完的话。',
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
  { bar: 6, beat: 1, symbol: 'Dadd2', durationBeats: 4, sectionId: 'lane' },
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
    { offset: 0.5, midi: 67, duration: 1.5, velocity: 68 },
    { offset: 2.5, midi: 71, duration: 1.0, velocity: 64 },
  ],
  [
    { offset: 0.5, midi: 69, duration: 1.5, velocity: 66 },
    { offset: 2.5, midi: 74, duration: 1.0, velocity: 64 },
  ],
  [
    { offset: 0.5, midi: 71, duration: 1.5, velocity: 68 },
    { offset: 2.5, midi: 76, duration: 1.0, velocity: 66 },
  ],
  [
    { offset: 0.5, midi: 72, duration: 1.5, velocity: 66 },
    { offset: 2.5, midi: 67, duration: 1.5, velocity: 62 },
  ],

  [
    { offset: 0, midi: 71, duration: 1.0, velocity: 74 },
    { offset: 1.5, midi: 74, duration: 0.5, velocity: 70 },
    { offset: 2, midi: 76, duration: 1.0, velocity: 76 },
    { offset: 3.5, midi: 74, duration: 0.5, velocity: 70 },
  ],
  [
    { offset: 0, midi: 74, duration: 1.0, velocity: 74 },
    { offset: 1.5, midi: 76, duration: 0.5, velocity: 70 },
    { offset: 2, midi: 78, duration: 1.0, velocity: 76 },
    { offset: 3.5, midi: 74, duration: 0.5, velocity: 70 },
  ],
  [
    { offset: 0, midi: 76, duration: 1.0, velocity: 76 },
    { offset: 1.5, midi: 79, duration: 0.5, velocity: 72 },
    { offset: 2, midi: 83, duration: 1.0, velocity: 80 },
    { offset: 3.5, midi: 79, duration: 0.5, velocity: 72 },
  ],
  [
    { offset: 0, midi: 79, duration: 1.0, velocity: 74 },
    { offset: 1.5, midi: 76, duration: 0.5, velocity: 68 },
    { offset: 2, midi: 74, duration: 1.5, velocity: 70 },
  ],

  [
    { offset: 0, midi: 74, duration: 1.0, velocity: 82 },
    { offset: 1, midi: 79, duration: 1.0, velocity: 86 },
    { offset: 2, midi: 83, duration: 1.0, velocity: 90, accent: 'strong' },
    { offset: 3, midi: 79, duration: 1.0, velocity: 84 },
  ],
  [
    { offset: 0, midi: 74, duration: 1.0, velocity: 80 },
    { offset: 1, midi: 78, duration: 1.0, velocity: 84 },
    { offset: 2, midi: 81, duration: 1.0, velocity: 88 },
    { offset: 3, midi: 78, duration: 1.0, velocity: 82 },
  ],
  [
    { offset: 0, midi: 76, duration: 1.0, velocity: 82 },
    { offset: 1, midi: 79, duration: 1.0, velocity: 86 },
    { offset: 2, midi: 83, duration: 1.0, velocity: 90 },
    { offset: 3, midi: 88, duration: 1.0, velocity: 94, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 79, duration: 1.0, velocity: 80 },
    { offset: 1, midi: 76, duration: 1.0, velocity: 76 },
    { offset: 2, midi: 74, duration: 2.0, velocity: 74 },
  ],

  [
    { offset: 0.5, midi: 74, duration: 1.5, velocity: 66 },
    { offset: 2.5, midi: 71, duration: 1.0, velocity: 62 },
  ],
  [
    { offset: 0.5, midi: 74, duration: 1.5, velocity: 64 },
    { offset: 2.5, midi: 69, duration: 1.0, velocity: 60 },
  ],
  [
    { offset: 0.5, midi: 72, duration: 1.5, velocity: 62 },
    { offset: 2.5, midi: 67, duration: 1.5, velocity: 58 },
  ],
  [
    { offset: 0.5, midi: 67, duration: 3.0, velocity: 56 },
  ],
];

const guitarBedPatterns = [
  [
    { offset: 0, midi: 55, duration: 3.8, velocity: 88 },
  ],
  [
    { offset: 0, midi: 62, duration: 3.7, velocity: 84 },
  ],
  [
    { offset: 0, midi: 64, duration: 3.8, velocity: 86 },
  ],
  [
    { offset: 0, midi: 60, duration: 3.9, velocity: 82 },
  ],

  [
    { offset: 0, midi: 55, duration: 3.2, velocity: 92 },
  ],
  [
    { offset: 0, midi: 62, duration: 3.1, velocity: 88 },
  ],
  [
    { offset: 0, midi: 64, duration: 3.2, velocity: 90 },
  ],
  [
    { offset: 0, midi: 48, duration: 3.1, velocity: 86 },
  ],

  [
    { offset: 0, midi: 55, duration: 2.8, velocity: 98, accent: 'strong' },
    { offset: 2.9, midi: 67, duration: 1.0, velocity: 76 },
  ],
  [
    { offset: 0, midi: 62, duration: 2.8, velocity: 94 },
    { offset: 2.9, midi: 50, duration: 1.0, velocity: 74 },
  ],
  [
    { offset: 0, midi: 64, duration: 2.8, velocity: 96 },
    { offset: 2.9, midi: 52, duration: 1.0, velocity: 76 },
  ],
  [
    { offset: 0, midi: 60, duration: 2.8, velocity: 92 },
    { offset: 2.9, midi: 48, duration: 1.0, velocity: 72 },
  ],

  [
    { offset: 0, midi: 55, duration: 3.0, velocity: 74 },
  ],
  [
    { offset: 0, midi: 50, duration: 3.0, velocity: 70 },
  ],
  [
    { offset: 0, midi: 60, duration: 3.2, velocity: 68 },
  ],
  [
    { offset: 0, midi: 55, duration: 3.9, velocity: 64 },
  ],
];

for (let bar = 1; bar <= 16; bar += 1) {
  const sectionId = bar <= 4 ? 'porch' : bar <= 8 ? 'lane' : bar <= 12 ? 'light' : 'home';
  addPattern('rightHand', sectionId, bar, pianoLeadPatterns[bar - 1]);
  addPattern('guitarBed', sectionId, bar, guitarBedPatterns[bar - 1]);
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
    genre: 'Evening Piano & Nylon Chords',
    mood: '傍晚 / 温柔 / 放松 / 回家路上',
    tags: ['piano', 'nylon-guitar', 'evening', 'homecoming', 'arrangement'],
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
      id: 'guitarBed',
      name: 'Guitar Bed',
      role: SONG_SCORE_TRACK_ROLE.CHORDS,
      instrumentHint: 'full nylon chord swells provide the main warm harmonic bed',
      color: '#ffd38c',
    },

  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'porch',
      text: '先让 full 和弦整段把尾韵放出来，不要急着截断；短回摆只在需要时轻轻提醒一下。'
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'lane',
      text: '钢琴负责叙事；guitarBed 负责把长样本尾音铺开，整首先只保留这一层完整和弦。'
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'light',
      text: '副歌把较长和弦层真正挂住，让尾韵叠起来；accent 只做很轻的推进，不再打断主和弦。'
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'home',
      text: '尾声基本收掉 accent，只让较长和弦自然拖尾，最后把空间留给钢琴收句。'
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      guitarBed: 'speedy-nylon-open-chords',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.06,
  },
  sourceFormat: 'story',
  sourceText: '傍晚沿着熟悉的小路慢慢回家。钢琴负责把心里的话说出来；吉他只保留完整的 full chord 层，让和弦尾韵自然铺开，不再混入额外的短促装饰。',
};
