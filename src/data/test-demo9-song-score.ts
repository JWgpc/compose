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
    { offset: 0.5, midi: 67, duration: 2.0, velocity: 72 },
    { offset: 2.75, midi: 71, duration: 1.0, velocity: 66 },
  ],
  [
    { offset: 0.5, midi: 69, duration: 2.0, velocity: 70 },
    { offset: 2.75, midi: 74, duration: 1.0, velocity: 66 },
  ],
  [
    { offset: 0.25, midi: 71, duration: 2.0, velocity: 72 },
    { offset: 2.5, midi: 76, duration: 1.25, velocity: 68 },
  ],
  [
    { offset: 0.5, midi: 72, duration: 2.0, velocity: 70 },
    { offset: 2.75, midi: 67, duration: 1.25, velocity: 64 },
  ],

  [
    { offset: 0, midi: 71, duration: 1.25, velocity: 78 },
    { offset: 1.5, midi: 74, duration: 0.75, velocity: 74 },
    { offset: 2.25, midi: 76, duration: 1.25, velocity: 80 },
  ],
  [
    { offset: 0, midi: 74, duration: 1.25, velocity: 78 },
    { offset: 1.5, midi: 76, duration: 0.75, velocity: 74 },
    { offset: 2.25, midi: 78, duration: 1.25, velocity: 80 },
  ],
  [
    { offset: 0, midi: 76, duration: 1.25, velocity: 80 },
    { offset: 1.5, midi: 79, duration: 0.75, velocity: 76 },
    { offset: 2.25, midi: 83, duration: 1.25, velocity: 84 },
  ],
  [
    { offset: 0, midi: 79, duration: 1.25, velocity: 78 },
    { offset: 1.5, midi: 76, duration: 0.75, velocity: 72 },
    { offset: 2.25, midi: 74, duration: 1.75, velocity: 74 },
  ],

  [
    { offset: 0, midi: 74, duration: 1.0, velocity: 86 },
    { offset: 1, midi: 79, duration: 1.0, velocity: 90 },
    { offset: 2, midi: 83, duration: 1.0, velocity: 94, accent: 'strong' },
    { offset: 3, midi: 79, duration: 1.0, velocity: 88 },
  ],
  [
    { offset: 0, midi: 74, duration: 1.0, velocity: 84 },
    { offset: 1, midi: 78, duration: 1.0, velocity: 88 },
    { offset: 2, midi: 81, duration: 1.0, velocity: 92 },
    { offset: 3, midi: 78, duration: 1.0, velocity: 86 },
  ],
  [
    { offset: 0, midi: 76, duration: 1.0, velocity: 86 },
    { offset: 1, midi: 79, duration: 1.0, velocity: 90 },
    { offset: 2, midi: 83, duration: 1.0, velocity: 94 },
    { offset: 3, midi: 88, duration: 1.0, velocity: 98, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 79, duration: 1.0, velocity: 84 },
    { offset: 1, midi: 76, duration: 1.0, velocity: 80 },
    { offset: 2, midi: 74, duration: 2.0, velocity: 78 },
  ],

  [
    { offset: 0.5, midi: 74, duration: 2.0, velocity: 68 },
    { offset: 2.75, midi: 71, duration: 1.0, velocity: 62 },
  ],
  [
    { offset: 0.75, midi: 74, duration: 1.75, velocity: 66 },
    { offset: 2.75, midi: 69, duration: 1.0, velocity: 60 },
  ],
  [
    { offset: 0.5, midi: 72, duration: 2.0, velocity: 64 },
    { offset: 2.75, midi: 67, duration: 1.25, velocity: 58 },
  ],
  [
    { offset: 0.5, midi: 67, duration: 3.25, velocity: 58 },
  ],
];

for (let bar = 1; bar <= 16; bar += 1) {
  const sectionId = bar <= 4 ? 'porch' : bar <= 8 ? 'lane' : bar <= 12 ? 'light' : 'home';
  addPattern('rightHand', sectionId, bar, pianoLeadPatterns[bar - 1]);
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
    genre: 'Evening Solo Piano',
    mood: '傍晚 / 温柔 / 放松 / 回家路上',
    tags: ['piano', 'evening', 'homecoming', 'solo-piano'],
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
      text: '钢琴始终在前面说话；guitarBed 只是补和声和木质温度，不要和钢琴抢句子。'
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'light',
      text: '副歌用两次 full chord 触发把和声抬起来：前一下立住，后一下轻推，不要整小节只有一整块。'
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'home',
      text: '尾声把句子收小，让最后的余温完全留在钢琴里。'
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.06,
  },
  sourceFormat: 'story',
  sourceText: '傍晚沿着熟悉的小路慢慢回家。先不再勉强加别的乐器，只让钢琴把心里的话完整说出来，让旋律、呼吸和回家感都由钢琴自己成立。',
};
