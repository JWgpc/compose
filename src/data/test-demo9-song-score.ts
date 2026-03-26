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
    { offset: 0, midi: 55, duration: 1.6, velocity: 88 },
    { offset: 2, midi: 67, duration: 1.2, velocity: 72 },
  ],
  [
    { offset: 0, midi: 62, duration: 1.5, velocity: 84 },
    { offset: 2, midi: 62, duration: 1.1, velocity: 70 },
  ],
  [
    { offset: 0, midi: 64, duration: 1.6, velocity: 86 },
    { offset: 2, midi: 64, duration: 1.2, velocity: 72 },
  ],
  [
    { offset: 0, midi: 60, duration: 1.6, velocity: 82 },
    { offset: 2, midi: 60, duration: 1.2, velocity: 68 },
  ],

  [
    { offset: 0, midi: 55, duration: 1.2, velocity: 92 },
    { offset: 2, midi: 67, duration: 1.0, velocity: 74 },
  ],
  [
    { offset: 0, midi: 62, duration: 1.2, velocity: 88 },
    { offset: 2, midi: 50, duration: 1.0, velocity: 72 },
  ],
  [
    { offset: 0, midi: 64, duration: 1.2, velocity: 90 },
    { offset: 2, midi: 52, duration: 1.0, velocity: 74 },
  ],
  [
    { offset: 0, midi: 48, duration: 1.2, velocity: 86 },
    { offset: 2, midi: 60, duration: 1.0, velocity: 70 },
  ],

  [
    { offset: 0, midi: 55, duration: 1.2, velocity: 98, accent: 'strong' },
    { offset: 1.5, midi: 67, duration: 0.9, velocity: 80 },
    { offset: 3, midi: 55, duration: 0.8, velocity: 76 },
  ],
  [
    { offset: 0, midi: 62, duration: 1.2, velocity: 94 },
    { offset: 1.5, midi: 50, duration: 0.9, velocity: 78 },
    { offset: 3, midi: 62, duration: 0.8, velocity: 74 },
  ],
  [
    { offset: 0, midi: 64, duration: 1.2, velocity: 96 },
    { offset: 1.5, midi: 52, duration: 0.9, velocity: 80 },
    { offset: 3, midi: 64, duration: 0.8, velocity: 76 },
  ],
  [
    { offset: 0, midi: 60, duration: 1.2, velocity: 92 },
    { offset: 1.5, midi: 48, duration: 0.9, velocity: 78 },
    { offset: 3, midi: 60, duration: 0.8, velocity: 72 },
  ],

  [
    { offset: 0, midi: 55, duration: 1.1, velocity: 74 },
    { offset: 2, midi: 67, duration: 0.8, velocity: 62 },
  ],
  [
    { offset: 0, midi: 50, duration: 1.1, velocity: 70 },
    { offset: 2, midi: 62, duration: 0.8, velocity: 60 },
  ],
  [
    { offset: 0, midi: 60, duration: 1.1, velocity: 68 },
    { offset: 2, midi: 60, duration: 0.8, velocity: 58 },
  ],
  [
    { offset: 0, midi: 55, duration: 2.6, velocity: 64 },
  ],
];

const guitarAccentPatterns = [
  [],
  [{ offset: 3.25, midi: 50, duration: 0.22, velocity: 54 }],
  [],
  [{ offset: 3.25, midi: 48, duration: 0.22, velocity: 52 }],

  [{ offset: 1.5, midi: 55, duration: 0.24, velocity: 60 }, { offset: 3.25, midi: 67, duration: 0.2, velocity: 56 }],
  [{ offset: 1.5, midi: 50, duration: 0.24, velocity: 58 }, { offset: 3.25, midi: 62, duration: 0.2, velocity: 54 }],
  [{ offset: 1.5, midi: 52, duration: 0.24, velocity: 60 }, { offset: 3.25, midi: 64, duration: 0.2, velocity: 56 }],
  [{ offset: 1.5, midi: 48, duration: 0.24, velocity: 58 }, { offset: 3.25, midi: 60, duration: 0.2, velocity: 54 }],

  [{ offset: 1, midi: 67, duration: 0.22, velocity: 66 }, { offset: 2.75, midi: 55, duration: 0.2, velocity: 62 }],
  [{ offset: 1, midi: 50, duration: 0.22, velocity: 64 }, { offset: 2.75, midi: 62, duration: 0.2, velocity: 60 }],
  [{ offset: 1, midi: 52, duration: 0.22, velocity: 66 }, { offset: 2.75, midi: 64, duration: 0.2, velocity: 62 }],
  [{ offset: 1, midi: 48, duration: 0.22, velocity: 62 }, { offset: 2.75, midi: 60, duration: 0.2, velocity: 58 }],

  [{ offset: 2.75, midi: 67, duration: 0.18, velocity: 48 }],
  [{ offset: 2.75, midi: 62, duration: 0.18, velocity: 46 }],
  [{ offset: 2.75, midi: 60, duration: 0.18, velocity: 44 }],
  [],
];

for (let bar = 1; bar <= 16; bar += 1) {
  const sectionId = bar <= 4 ? 'porch' : bar <= 8 ? 'lane' : bar <= 12 ? 'light' : 'home';
  addPattern('rightHand', sectionId, bar, pianoLeadPatterns[bar - 1]);
  addPattern('guitarBed', sectionId, bar, guitarBedPatterns[bar - 1]);
  addPattern('guitarAccent', sectionId, bar, guitarAccentPatterns[bar - 1]);
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
    {
      id: 'guitarAccent',
      name: 'Guitar Accent',
      role: SONG_SCORE_TRACK_ROLE.RHYTHM,
      instrumentHint: 'short nylon accents and returns add motion without stealing focus',
      color: '#ffb36b',
    },
  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'porch',
      text: '先用较长的和弦层把空气铺开，再用很少的短促回摆提醒这是吉他而不是 pad。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'lane',
      text: '钢琴负责叙事；full 和弦负责底色；短 accent 只做脚步感和轻微回摆。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'light',
      text: '副歌把较长和弦层抬起来，accent 变规律一点，但仍旧不要把所有吉他都写成短点。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'home',
      text: '尾声先收掉 accent，只留较长和弦尾韵，再让钢琴把最后一句说完。',
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      guitarBed: 'speedy-nylon-open-chords',
      guitarAccent: 'speedy-nylon-extra-chords',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.06,
  },
  sourceFormat: 'story',
  sourceText: '傍晚沿着熟悉的小路慢慢回家。钢琴负责把心里的话说出来；吉他分成两种功能：较长的和弦层负责温暖铺面，较短的装饰层只在合适的时候回摆、点亮和提醒步伐。',
};
