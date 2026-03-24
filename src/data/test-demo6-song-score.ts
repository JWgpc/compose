import { SONG_SCORE_ANNOTATION_TYPE, SONG_SCORE_SCHEMA_VERSION, SONG_SCORE_SECTION_TYPE, SONG_SCORE_TRACK_ROLE } from '../songscore/model.ts';

const sections = [
  {
    id: 'intro',
    label: '朔风起',
    startBar: 1,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.INTRO,
    description: '冷风先到，边塞空旷，像箫声从远处吹来。',
    energyLevel: 1,
    hookFocus: false,
  },
  {
    id: 'march',
    label: '列阵',
    startBar: 5,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.VERSE,
    description: '军阵推进，步伐沉稳，杀气被压在甲胄之下。',
    energyLevel: 3,
    hookFocus: false,
  },
  {
    id: 'battle',
    label: '交锋',
    startBar: 13,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.CHORUS,
    description: '短兵相接，金石并作，但仍保持庄严克制。',
    energyLevel: 5,
    hookFocus: true,
  },
  {
    id: 'elegy',
    label: '残照',
    startBar: 21,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.INTERLUDE,
    description: '战后风过旌旗，天地辽阔，悲意慢慢浮上来。',
    energyLevel: 2,
    hookFocus: false,
  },
  {
    id: 'finale',
    label: '肃穆归阵',
    startBar: 25,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.OUTRO,
    description: '不写喧闹凯旋，只写战意未散、军魂未灭。',
    energyLevel: 4,
    hookFocus: true,
  },
];

const chordPlan = [
  ['intro', ['Dm', 'Bb', 'Gm', 'Dm']],
  ['march', ['Dm', 'C', 'Bb', 'A', 'Dm', 'C', 'Gm', 'A']],
  ['battle', ['Dm', 'Gm', 'Bb', 'A', 'Dm', 'C', 'Bb', 'A']],
  ['elegy', ['Gm', 'Dm', 'Bb', 'A']],
  ['finale', ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'C', 'Bb', 'Dm']],
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

function pushNote(trackId, sectionId, pitch, midi, startBeat, durationBeats, velocity, accent = 'light') {
  notes.push({
    pitch,
    midi,
    startBeat,
    durationBeats,
    trackId,
    sectionId,
    velocity,
    accent,
  });
}

function addLeftHandBar(sectionId, bar, rootMidi, upperMidi, velocityBase = 64) {
  const startBeat = (bar - 1) * 4;
  pushNote('leftHand', sectionId, midiToPitch(rootMidi), rootMidi, startBeat, 1, velocityBase + 6, 'medium');
  pushNote('leftHand', sectionId, midiToPitch(upperMidi), upperMidi, startBeat + 1, 1, velocityBase, 'light');
  pushNote('leftHand', sectionId, midiToPitch(rootMidi + 12), rootMidi + 12, startBeat + 2, 1, velocityBase + 2, 'light');
  pushNote('leftHand', sectionId, midiToPitch(upperMidi + 12), upperMidi + 12, startBeat + 3, 1, velocityBase, 'light');
}

function addMelodyPhrase(sectionId, bar, pattern) {
  const startBeat = (bar - 1) * 4;
  pattern.forEach((note) => {
    pushNote(
      'rightHand',
      sectionId,
      midiToPitch(note.midi),
      note.midi,
      startBeat + note.offset,
      note.duration,
      note.velocity,
      note.accent,
    );
  });
}

function midiToPitch(midi) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[midi % 12]}${octave}`;
}

[
  [1, 'intro', 38, 45, 52],
  [2, 'intro', 34, 41, 50],
  [3, 'intro', 43, 50, 54],
  [4, 'intro', 38, 45, 52],
  [5, 'march', 38, 45, 60],
  [6, 'march', 36, 43, 60],
  [7, 'march', 34, 41, 62],
  [8, 'march', 33, 40, 64],
  [9, 'march', 38, 45, 62],
  [10, 'march', 36, 43, 62],
  [11, 'march', 43, 50, 64],
  [12, 'march', 33, 40, 66],
  [13, 'battle', 38, 45, 70],
  [14, 'battle', 43, 50, 72],
  [15, 'battle', 34, 41, 72],
  [16, 'battle', 33, 40, 74],
  [17, 'battle', 38, 45, 72],
  [18, 'battle', 36, 43, 70],
  [19, 'battle', 34, 41, 72],
  [20, 'battle', 33, 40, 76],
  [21, 'elegy', 43, 50, 56],
  [22, 'elegy', 38, 45, 54],
  [23, 'elegy', 34, 41, 54],
  [24, 'elegy', 33, 40, 58],
  [25, 'finale', 38, 45, 64],
  [26, 'finale', 34, 41, 64],
  [27, 'finale', 43, 50, 66],
  [28, 'finale', 33, 40, 68],
  [29, 'finale', 38, 45, 68],
  [30, 'finale', 36, 43, 66],
  [31, 'finale', 34, 41, 64],
  [32, 'finale', 38, 45, 60],
].forEach(([bar, sectionId, rootMidi, upperMidi, velocityBase]) => {
  addLeftHandBar(sectionId, bar, rootMidi, upperMidi, velocityBase);
});

const introPhrases = [
  [
    { offset: 0, midi: 69, duration: 1.5, velocity: 72, accent: 'light' },
    { offset: 1.5, midi: 74, duration: 1, velocity: 78, accent: 'medium' },
    { offset: 2.5, midi: 77, duration: 1, velocity: 74, accent: 'light' },
  ],
  [
    { offset: 0, midi: 74, duration: 2, velocity: 74, accent: 'light' },
    { offset: 2, midi: 72, duration: 1, velocity: 70, accent: 'light' },
    { offset: 3, midi: 69, duration: 1, velocity: 68, accent: 'light' },
  ],
  [
    { offset: 0, midi: 70, duration: 1, velocity: 74, accent: 'light' },
    { offset: 1, midi: 74, duration: 1, velocity: 78, accent: 'medium' },
    { offset: 2, midi: 79, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 3, midi: 77, duration: 1, velocity: 76, accent: 'light' },
  ],
  [
    { offset: 0, midi: 74, duration: 3, velocity: 72, accent: 'light' },
    { offset: 3, midi: 69, duration: 1, velocity: 66, accent: 'light' },
  ],
];

introPhrases.forEach((pattern, index) => addMelodyPhrase('intro', index + 1, pattern));

const marchMotifA = [
  { offset: 0, midi: 74, duration: 1, velocity: 82, accent: 'medium' },
  { offset: 1, midi: 77, duration: 1, velocity: 86, accent: 'medium' },
  { offset: 2, midi: 81, duration: 1, velocity: 88, accent: 'medium' },
  { offset: 3, midi: 77, duration: 1, velocity: 82, accent: 'light' },
];
const marchMotifB = [
  { offset: 0, midi: 76, duration: 1, velocity: 80, accent: 'medium' },
  { offset: 1, midi: 79, duration: 1, velocity: 84, accent: 'medium' },
  { offset: 2, midi: 81, duration: 1, velocity: 86, accent: 'medium' },
  { offset: 3, midi: 79, duration: 1, velocity: 80, accent: 'light' },
];
const marchMotifC = [
  { offset: 0, midi: 77, duration: 2, velocity: 80, accent: 'medium' },
  { offset: 2, midi: 74, duration: 1, velocity: 76, accent: 'light' },
  { offset: 3, midi: 72, duration: 1, velocity: 72, accent: 'light' },
];
const marchMotifD = [
  { offset: 0, midi: 76, duration: 1, velocity: 84, accent: 'medium' },
  { offset: 1, midi: 81, duration: 2, velocity: 92, accent: 'strong' },
  { offset: 3, midi: 79, duration: 1, velocity: 84, accent: 'medium' },
];
[ marchMotifA, marchMotifB, marchMotifC, marchMotifD, marchMotifA, marchMotifB, marchMotifC, marchMotifD ].forEach((pattern, idx) => {
  addMelodyPhrase('march', idx + 5, pattern);
});

const battlePatterns = [
  [
    { offset: 0, midi: 81, duration: 0.5, velocity: 96, accent: 'strong' },
    { offset: 0.5, midi: 77, duration: 0.5, velocity: 90, accent: 'medium' },
    { offset: 1, midi: 74, duration: 1, velocity: 86, accent: 'medium' },
    { offset: 2, midi: 79, duration: 1, velocity: 92, accent: 'strong' },
    { offset: 3, midi: 82, duration: 1, velocity: 94, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 86, duration: 1, velocity: 98, accent: 'strong' },
    { offset: 1, midi: 82, duration: 1, velocity: 92, accent: 'medium' },
    { offset: 2, midi: 81, duration: 2, velocity: 96, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 77, duration: 1, velocity: 86, accent: 'medium' },
    { offset: 1, midi: 81, duration: 1, velocity: 90, accent: 'strong' },
    { offset: 2, midi: 79, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 3, midi: 76, duration: 1, velocity: 80, accent: 'light' },
  ],
  [
    { offset: 0, midi: 77, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 1, midi: 74, duration: 1, velocity: 80, accent: 'medium' },
    { offset: 2, midi: 73, duration: 1, velocity: 86, accent: 'strong' },
    { offset: 3, midi: 69, duration: 1, velocity: 72, accent: 'light' },
  ],
  [
    { offset: 0, midi: 81, duration: 1, velocity: 94, accent: 'strong' },
    { offset: 1, midi: 84, duration: 1, velocity: 98, accent: 'strong' },
    { offset: 2, midi: 86, duration: 1, velocity: 100, accent: 'strong' },
    { offset: 3, midi: 84, duration: 1, velocity: 92, accent: 'medium' },
  ],
  [
    { offset: 0, midi: 79, duration: 1, velocity: 88, accent: 'medium' },
    { offset: 1, midi: 84, duration: 1, velocity: 92, accent: 'strong' },
    { offset: 2, midi: 81, duration: 1, velocity: 88, accent: 'medium' },
    { offset: 3, midi: 77, duration: 1, velocity: 82, accent: 'light' },
  ],
  [
    { offset: 0, midi: 77, duration: 1, velocity: 86, accent: 'medium' },
    { offset: 1, midi: 74, duration: 1, velocity: 82, accent: 'medium' },
    { offset: 2, midi: 81, duration: 1, velocity: 90, accent: 'strong' },
    { offset: 3, midi: 82, duration: 1, velocity: 92, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 86, duration: 1, velocity: 96, accent: 'strong' },
    { offset: 1, midi: 82, duration: 1, velocity: 90, accent: 'medium' },
    { offset: 2, midi: 81, duration: 2, velocity: 94, accent: 'strong' },
  ],
];

battlePatterns.forEach((pattern, idx) => addMelodyPhrase('battle', idx + 13, pattern));

[
  [21, [{ offset: 0, midi: 70, duration: 2, velocity: 68, accent: 'light' }, { offset: 2, midi: 74, duration: 2, velocity: 72, accent: 'light' }]],
  [22, [{ offset: 0, midi: 69, duration: 3, velocity: 62, accent: 'light' }, { offset: 3, midi: 65, duration: 1, velocity: 58, accent: 'light' }]],
  [23, [{ offset: 0, midi: 74, duration: 1, velocity: 60, accent: 'light' }, { offset: 1, midi: 72, duration: 1, velocity: 58, accent: 'light' }, { offset: 2, midi: 69, duration: 2, velocity: 56, accent: 'light' }]],
  [24, [{ offset: 0, midi: 74, duration: 4, velocity: 54, accent: 'light' }]],
].forEach(([bar, pattern]) => addMelodyPhrase('elegy', bar, pattern));

const finalePatterns = [
  [
    { offset: 0, midi: 74, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 1, midi: 77, duration: 1, velocity: 88, accent: 'medium' },
    { offset: 2, midi: 81, duration: 1, velocity: 90, accent: 'strong' },
    { offset: 3, midi: 84, duration: 1, velocity: 92, accent: 'strong' },
  ],
  [
    { offset: 0, midi: 82, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 1, midi: 79, duration: 1, velocity: 80, accent: 'medium' },
    { offset: 2, midi: 77, duration: 1, velocity: 78, accent: 'light' },
    { offset: 3, midi: 74, duration: 1, velocity: 76, accent: 'light' },
  ],
  [
    { offset: 0, midi: 79, duration: 1, velocity: 82, accent: 'medium' },
    { offset: 1, midi: 82, duration: 1, velocity: 86, accent: 'medium' },
    { offset: 2, midi: 86, duration: 1, velocity: 92, accent: 'strong' },
    { offset: 3, midi: 82, duration: 1, velocity: 84, accent: 'medium' },
  ],
  [
    { offset: 0, midi: 81, duration: 1, velocity: 86, accent: 'strong' },
    { offset: 1, midi: 84, duration: 1, velocity: 90, accent: 'strong' },
    { offset: 2, midi: 81, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 3, midi: 77, duration: 1, velocity: 80, accent: 'light' },
  ],
  [
    { offset: 0, midi: 86, duration: 1, velocity: 94, accent: 'strong' },
    { offset: 1, midi: 84, duration: 1, velocity: 90, accent: 'strong' },
    { offset: 2, midi: 81, duration: 1, velocity: 86, accent: 'medium' },
    { offset: 3, midi: 77, duration: 1, velocity: 82, accent: 'medium' },
  ],
  [
    { offset: 0, midi: 79, duration: 1, velocity: 82, accent: 'medium' },
    { offset: 1, midi: 84, duration: 1, velocity: 88, accent: 'strong' },
    { offset: 2, midi: 81, duration: 1, velocity: 84, accent: 'medium' },
    { offset: 3, midi: 76, duration: 1, velocity: 78, accent: 'light' },
  ],
  [
    { offset: 0, midi: 77, duration: 2, velocity: 76, accent: 'medium' },
    { offset: 2, midi: 74, duration: 1, velocity: 72, accent: 'light' },
    { offset: 3, midi: 69, duration: 1, velocity: 68, accent: 'light' },
  ],
  [
    { offset: 0, midi: 74, duration: 4, velocity: 66, accent: 'medium' },
  ],
];
finalePatterns.forEach((pattern, idx) => addMelodyPhrase('finale', idx + 25, pattern));

export const testDemo6SongScore = {
  schemaVersion: SONG_SCORE_SCHEMA_VERSION,
  meta: {
    title: '朔风战歌',
    composer: 'OpenClaw',
    tempoBpm: 72,
    timeSignature: '4/4',
    key: 'D minor',
    unitNoteLength: '1/8',
    genre: 'War Elegy / Cinematic Chinese',
    mood: '肃杀 / 庄严 / 冷峻',
    tags: ['war', 'xiao-inspired', 'solemn', 'cinematic', 'instrumental'],
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
      instrumentHint: 'low piano / war drum feel',
      color: '#ffd38c',
    },
  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'intro',
      text: '开头故意留白，让右手像箫一样从寒风里浮现。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'march',
      text: '左手稳定四拍推进，像压低声势的行军鼓点。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'battle',
      text: '高潮不是狂躁，而是肃杀、紧绷、带威压感。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'elegy',
      text: '战后段落需要明显退开，让空旷感和余寒出来。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'finale',
      text: '尾段重新聚拢军魂，最后落回 D 小调，不写欢呼，只写余威。',
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      leftHand: 'realistic-piano',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.1,
  },
  sourceFormat: 'story',
  sourceText: '战争主题器乐曲：箫杀肃穆。32 小节，偏国风肃杀感，用钢琴模拟箫与战鼓的气质。',
};
