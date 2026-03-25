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
    id: 'rain',
    label: '雨丝初醒',
    startBar: 1,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.INTRO,
    description: '春雨轻轻落下，屋檐、泥土和新叶先被一点点叫醒。',
    energyLevel: 1,
    hookFocus: false,
  },
  {
    id: 'sprout',
    label: '新芽探头',
    startBar: 5,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.VERSE,
    description: '孩子蹲在门槛边看雨，看见泥土里一点点冒出来的嫩绿。',
    energyLevel: 2,
    hookFocus: false,
  },
  {
    id: 'running',
    label: '踩着水光跑',
    startBar: 13,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.BRIDGE,
    description: '雨停后踩着湿石板往外跑，风、鸟鸣、草和小河都开始有了动静。',
    energyLevel: 4,
    hookFocus: false,
  },
  {
    id: 'bloom',
    label: '万物都在长',
    startBar: 21,
    barCount: 8,
    type: SONG_SCORE_SECTION_TYPE.CHORUS,
    description: '孩子第一次模糊地感觉到：万物正在长大，自己也在长大。',
    energyLevel: 5,
    hookFocus: true,
  },
  {
    id: 'glow',
    label: '昕光回家',
    startBar: 29,
    barCount: 4,
    type: SONG_SCORE_SECTION_TYPE.OUTRO,
    description: '傍晚的金光带着潮气落下来，袖口微湿，心里却亮亮的。',
    energyLevel: 2,
    hookFocus: false,
  },
];

const chords = [
  { bar: 1, beat: 1, symbol: 'Dmaj7', durationBeats: 4, sectionId: 'rain' },
  { bar: 2, beat: 1, symbol: 'Aadd9', durationBeats: 4, sectionId: 'rain' },
  { bar: 3, beat: 1, symbol: 'Bm7', durationBeats: 4, sectionId: 'rain' },
  { bar: 4, beat: 1, symbol: 'Gmaj7', durationBeats: 4, sectionId: 'rain' },

  { bar: 5, beat: 1, symbol: 'D', durationBeats: 4, sectionId: 'sprout' },
  { bar: 6, beat: 1, symbol: 'A/C#', durationBeats: 4, sectionId: 'sprout' },
  { bar: 7, beat: 1, symbol: 'Bm7', durationBeats: 4, sectionId: 'sprout' },
  { bar: 8, beat: 1, symbol: 'Gmaj7', durationBeats: 4, sectionId: 'sprout' },
  { bar: 9, beat: 1, symbol: 'D/F#', durationBeats: 4, sectionId: 'sprout' },
  { bar: 10, beat: 1, symbol: 'Em7', durationBeats: 4, sectionId: 'sprout' },
  { bar: 11, beat: 1, symbol: 'A', durationBeats: 4, sectionId: 'sprout' },
  { bar: 12, beat: 1, symbol: 'Dmaj7', durationBeats: 4, sectionId: 'sprout' },

  { bar: 13, beat: 1, symbol: 'Gmaj7', durationBeats: 4, sectionId: 'running' },
  { bar: 14, beat: 1, symbol: 'A', durationBeats: 4, sectionId: 'running' },
  { bar: 15, beat: 1, symbol: 'F#m7', durationBeats: 4, sectionId: 'running' },
  { bar: 16, beat: 1, symbol: 'Bm7', durationBeats: 4, sectionId: 'running' },
  { bar: 17, beat: 1, symbol: 'Gmaj7', durationBeats: 4, sectionId: 'running' },
  { bar: 18, beat: 1, symbol: 'A', durationBeats: 4, sectionId: 'running' },
  { bar: 19, beat: 1, symbol: 'Dmaj7', durationBeats: 4, sectionId: 'running' },
  { bar: 20, beat: 1, symbol: 'Aadd9', durationBeats: 4, sectionId: 'running' },

  { bar: 21, beat: 1, symbol: 'D', durationBeats: 4, sectionId: 'bloom' },
  { bar: 22, beat: 1, symbol: 'A/C#', durationBeats: 4, sectionId: 'bloom' },
  { bar: 23, beat: 1, symbol: 'Bm7', durationBeats: 4, sectionId: 'bloom' },
  { bar: 24, beat: 1, symbol: 'Gmaj7', durationBeats: 4, sectionId: 'bloom' },
  { bar: 25, beat: 1, symbol: 'D/F#', durationBeats: 4, sectionId: 'bloom' },
  { bar: 26, beat: 1, symbol: 'Em7', durationBeats: 4, sectionId: 'bloom' },
  { bar: 27, beat: 1, symbol: 'A', durationBeats: 4, sectionId: 'bloom' },
  { bar: 28, beat: 1, symbol: 'Dmaj9', durationBeats: 4, sectionId: 'bloom' },

  { bar: 29, beat: 1, symbol: 'Bm7', durationBeats: 4, sectionId: 'glow' },
  { bar: 30, beat: 1, symbol: 'Gmaj7', durationBeats: 4, sectionId: 'glow' },
  { bar: 31, beat: 1, symbol: 'Aadd9', durationBeats: 4, sectionId: 'glow' },
  { bar: 32, beat: 1, symbol: 'Dmaj9', durationBeats: 4, sectionId: 'glow' },
];

const leftHandPatterns = [
  [{ offset: 0, midi: 50, duration: 4, velocity: 50 }],
  [{ offset: 0, midi: 49, duration: 4, velocity: 50 }],
  [{ offset: 0, midi: 47, duration: 4, velocity: 48 }],
  [{ offset: 0, midi: 43, duration: 4, velocity: 48 }],

  [{ offset: 0, midi: 50, duration: 2, velocity: 54 }, { offset: 2, midi: 57, duration: 2, velocity: 52 }],
  [{ offset: 0, midi: 49, duration: 2, velocity: 54 }, { offset: 2, midi: 56, duration: 2, velocity: 52 }],
  [{ offset: 0, midi: 47, duration: 2, velocity: 52 }, { offset: 2, midi: 54, duration: 2, velocity: 50 }],
  [{ offset: 0, midi: 43, duration: 4, velocity: 50 }],
  [{ offset: 0, midi: 54, duration: 2, velocity: 54 }, { offset: 2, midi: 61, duration: 2, velocity: 52 }],
  [{ offset: 0, midi: 52, duration: 2, velocity: 52 }, { offset: 2, midi: 59, duration: 2, velocity: 50 }],
  [{ offset: 0, midi: 45, duration: 2, velocity: 54 }, { offset: 2, midi: 52, duration: 2, velocity: 52 }],
  [{ offset: 0, midi: 50, duration: 4, velocity: 54, accent: 'medium' }],

  [{ offset: 0, midi: 43, duration: 2, velocity: 56 }, { offset: 2, midi: 50, duration: 2, velocity: 54 }],
  [{ offset: 0, midi: 45, duration: 2, velocity: 56 }, { offset: 2, midi: 52, duration: 2, velocity: 54 }],
  [{ offset: 0, midi: 42, duration: 2, velocity: 56 }, { offset: 2, midi: 49, duration: 2, velocity: 54 }],
  [{ offset: 0, midi: 47, duration: 2, velocity: 58 }, { offset: 2, midi: 54, duration: 2, velocity: 56 }],
  [{ offset: 0, midi: 43, duration: 2, velocity: 56 }, { offset: 2, midi: 50, duration: 2, velocity: 54 }],
  [{ offset: 0, midi: 45, duration: 2, velocity: 56 }, { offset: 2, midi: 52, duration: 2, velocity: 54 }],
  [{ offset: 0, midi: 45, duration: 2, velocity: 58 }, { offset: 2, midi: 52, duration: 2, velocity: 56 }],
  [{ offset: 0, midi: 50, duration: 4, velocity: 58, accent: 'medium' }],

  [{ offset: 0, midi: 47, duration: 4, velocity: 52 }],
  [{ offset: 0, midi: 43, duration: 4, velocity: 50 }],
  [{ offset: 0, midi: 45, duration: 4, velocity: 50 }],
  [{ offset: 0, midi: 50, duration: 4, velocity: 52, accent: 'medium' }],
];

const melodyPatterns = [
  [{ offset: 0, midi: 74, duration: 0.5, velocity: 70 }, { offset: 0.5, midi: 78, duration: 0.5, velocity: 74 }, { offset: 1, midi: 81, duration: 1.5, velocity: 78 }, { offset: 2.5, midi: 78, duration: 0.5, velocity: 72 }, { offset: 3, midi: 76, duration: 1, velocity: 70 }],
  [{ offset: 0, midi: 73, duration: 0.5, velocity: 70 }, { offset: 0.5, midi: 76, duration: 0.5, velocity: 72 }, { offset: 1, midi: 81, duration: 1.5, velocity: 78 }, { offset: 2.5, midi: 78, duration: 0.5, velocity: 72 }, { offset: 3, midi: 76, duration: 1, velocity: 70 }],
  [{ offset: 0, midi: 74, duration: 0.5, velocity: 70 }, { offset: 0.5, midi: 78, duration: 0.5, velocity: 72 }, { offset: 1, midi: 81, duration: 1, velocity: 76 }, { offset: 2, midi: 83, duration: 1, velocity: 80 }, { offset: 3, midi: 81, duration: 1, velocity: 74 }],
  [{ offset: 0, midi: 79, duration: 1, velocity: 72 }, { offset: 1, midi: 78, duration: 1, velocity: 70 }, { offset: 2, midi: 76, duration: 1, velocity: 68 }, { offset: 3, midi: 74, duration: 1, velocity: 66 }],

  [{ offset: 0, midi: 74, duration: 0.5, velocity: 78 }, { offset: 0.5, midi: 78, duration: 0.5, velocity: 82 }, { offset: 1, midi: 81, duration: 1, velocity: 86 }, { offset: 2, midi: 83, duration: 1, velocity: 88 }, { offset: 3, midi: 81, duration: 1, velocity: 82 }],
  [{ offset: 0, midi: 76, duration: 0.5, velocity: 78 }, { offset: 0.5, midi: 78, duration: 0.5, velocity: 82 }, { offset: 1, midi: 81, duration: 1, velocity: 86 }, { offset: 2, midi: 85, duration: 1, velocity: 90 }, { offset: 3, midi: 83, duration: 1, velocity: 84 }],
  [{ offset: 0, midi: 78, duration: 0.5, velocity: 80 }, { offset: 0.5, midi: 81, duration: 0.5, velocity: 84 }, { offset: 1, midi: 83, duration: 1, velocity: 88 }, { offset: 2, midi: 86, duration: 1, velocity: 90 }, { offset: 3, midi: 83, duration: 1, velocity: 84 }],
  [{ offset: 0, midi: 81, duration: 1, velocity: 82 }, { offset: 1, midi: 78, duration: 1, velocity: 76 }, { offset: 2, midi: 76, duration: 1, velocity: 74 }, { offset: 3, midi: 74, duration: 1, velocity: 72 }],
  [{ offset: 0, midi: 78, duration: 0.5, velocity: 80 }, { offset: 0.5, midi: 81, duration: 0.5, velocity: 84 }, { offset: 1, midi: 85, duration: 1, velocity: 88 }, { offset: 2, midi: 88, duration: 1, velocity: 92 }, { offset: 3, midi: 85, duration: 1, velocity: 86 }],
  [{ offset: 0, midi: 76, duration: 0.5, velocity: 80 }, { offset: 0.5, midi: 79, duration: 0.5, velocity: 84 }, { offset: 1, midi: 83, duration: 1, velocity: 88 }, { offset: 2, midi: 86, duration: 1, velocity: 90 }, { offset: 3, midi: 83, duration: 1, velocity: 84 }],
  [{ offset: 0, midi: 74, duration: 0.5, velocity: 80 }, { offset: 0.5, midi: 78, duration: 0.5, velocity: 84 }, { offset: 1, midi: 81, duration: 1, velocity: 88 }, { offset: 2, midi: 85, duration: 1, velocity: 90 }, { offset: 3, midi: 83, duration: 1, velocity: 84 }],
  [{ offset: 0, midi: 86, duration: 1, velocity: 92, accent: 'strong' }, { offset: 1, midi: 83, duration: 1, velocity: 86 }, { offset: 2, midi: 81, duration: 1, velocity: 82 }, { offset: 3, midi: 78, duration: 1, velocity: 78 }],

  [{ offset: 0, midi: 78, duration: 0.5, velocity: 86 }, { offset: 0.5, midi: 81, duration: 0.5, velocity: 90 }, { offset: 1, midi: 85, duration: 1, velocity: 94 }, { offset: 2, midi: 88, duration: 1, velocity: 98 }, { offset: 3, midi: 90, duration: 1, velocity: 102, accent: 'strong' }],
  [{ offset: 0, midi: 81, duration: 0.5, velocity: 88 }, { offset: 0.5, midi: 85, duration: 0.5, velocity: 92 }, { offset: 1, midi: 88, duration: 1, velocity: 96 }, { offset: 2, midi: 90, duration: 1, velocity: 100 }, { offset: 3, midi: 88, duration: 1, velocity: 94 }],
  [{ offset: 0, midi: 78, duration: 0.5, velocity: 88 }, { offset: 0.5, midi: 81, duration: 0.5, velocity: 92 }, { offset: 1, midi: 85, duration: 1, velocity: 96 }, { offset: 2, midi: 88, duration: 1, velocity: 100 }, { offset: 3, midi: 86, duration: 1, velocity: 94 }],
  [{ offset: 0, midi: 83, duration: 0.5, velocity: 90 }, { offset: 0.5, midi: 86, duration: 0.5, velocity: 94 }, { offset: 1, midi: 90, duration: 1, velocity: 100 }, { offset: 2, midi: 93, duration: 1, velocity: 104, accent: 'strong' }, { offset: 3, midi: 90, duration: 1, velocity: 98 }],
  [{ offset: 0, midi: 81, duration: 0.5, velocity: 88 }, { offset: 0.5, midi: 85, duration: 0.5, velocity: 92 }, { offset: 1, midi: 88, duration: 1, velocity: 96 }, { offset: 2, midi: 90, duration: 1, velocity: 100 }, { offset: 3, midi: 88, duration: 1, velocity: 94 }],
  [{ offset: 0, midi: 78, duration: 0.5, velocity: 86 }, { offset: 0.5, midi: 81, duration: 0.5, velocity: 90 }, { offset: 1, midi: 85, duration: 1, velocity: 94 }, { offset: 2, midi: 88, duration: 1, velocity: 96 }, { offset: 3, midi: 86, duration: 1, velocity: 90 }],
  [{ offset: 0, midi: 81, duration: 0.5, velocity: 88 }, { offset: 0.5, midi: 85, duration: 0.5, velocity: 92 }, { offset: 1, midi: 88, duration: 1, velocity: 96 }, { offset: 2, midi: 90, duration: 1, velocity: 100 }, { offset: 3, midi: 93, duration: 1, velocity: 104, accent: 'strong' }],
  [{ offset: 0, midi: 90, duration: 1, velocity: 96 }, { offset: 1, midi: 86, duration: 1, velocity: 90 }, { offset: 2, midi: 83, duration: 1, velocity: 86 }, { offset: 3, midi: 78, duration: 1, velocity: 80 }],

  [{ offset: 0, midi: 83, duration: 2, velocity: 76 }, { offset: 2, midi: 81, duration: 2, velocity: 72 }],
  [{ offset: 0, midi: 78, duration: 2, velocity: 72 }, { offset: 2, midi: 76, duration: 2, velocity: 68 }],
  [{ offset: 0, midi: 81, duration: 2, velocity: 74 }, { offset: 2, midi: 78, duration: 2, velocity: 70 }],
  [{ offset: 0, midi: 74, duration: 4, velocity: 66 }],
];

const flutePatterns = [
  [],
  [{ offset: 3.5, midi: 71, duration: 0.5, velocity: 18 }],
  [],
  [{ offset: 3.5, midi: 69, duration: 0.5, velocity: 16 }],

  [],
  [{ offset: 3, midi: 74, duration: 0.5, velocity: 20 }, { offset: 3.5, midi: 76, duration: 0.5, velocity: 18 }],
  [],
  [],
  [{ offset: 3.5, midi: 76, duration: 0.5, velocity: 20 }],
  [],
  [],
  [{ offset: 3, midi: 73, duration: 0.5, velocity: 18 }, { offset: 3.5, midi: 74, duration: 0.5, velocity: 16 }],

  [],
  [{ offset: 3, midi: 78, duration: 0.5, velocity: 22 }, { offset: 3.5, midi: 79, duration: 0.5, velocity: 20 }],
  [],
  [{ offset: 3.5, midi: 81, duration: 0.5, velocity: 22 }],
  [],
  [{ offset: 3, midi: 78, duration: 0.5, velocity: 20 }, { offset: 3.5, midi: 79, duration: 0.5, velocity: 18 }],
  [],
  [{ offset: 3.5, midi: 81, duration: 0.5, velocity: 18 }],

  [],
  [{ offset: 3.5, midi: 74, duration: 0.5, velocity: 16 }],
  [],
  [{ offset: 3.5, midi: 71, duration: 0.5, velocity: 14 }],
];

let bar = 1;
leftHandPatterns.slice(0, 4).forEach((pattern) => addPattern('leftHand', 'rain', bar++, pattern));
leftHandPatterns.slice(4, 12).forEach((pattern) => addPattern('leftHand', 'sprout', bar++, pattern));
leftHandPatterns.slice(12, 20).forEach((pattern) => addPattern('leftHand', 'running', bar++, pattern));
leftHandPatterns.slice(12, 20).forEach((pattern, index) => addPattern('leftHand', 'bloom', 21 + index, pattern));
leftHandPatterns.slice(20).forEach((pattern, index) => addPattern('leftHand', 'glow', 29 + index, pattern));

bar = 1;
melodyPatterns.slice(0, 4).forEach((pattern) => addPattern('rightHand', 'rain', bar++, pattern));
melodyPatterns.slice(4, 12).forEach((pattern) => addPattern('rightHand', 'sprout', bar++, pattern));
melodyPatterns.slice(12, 20).forEach((pattern) => addPattern('rightHand', 'running', bar++, pattern));
melodyPatterns.slice(12, 20).forEach((pattern, index) => addPattern('rightHand', 'bloom', 21 + index, pattern));
melodyPatterns.slice(20).forEach((pattern, index) => addPattern('rightHand', 'glow', 29 + index, pattern));

bar = 1;
flutePatterns.slice(0, 4).forEach((pattern) => addPattern('springLayer', 'rain', bar++, pattern));
flutePatterns.slice(4, 12).forEach((pattern) => addPattern('springLayer', 'sprout', bar++, pattern));
flutePatterns.slice(12, 20).forEach((pattern) => addPattern('springLayer', 'running', bar++, pattern));
flutePatterns.slice(12, 20).forEach((pattern, index) => addPattern('springLayer', 'bloom', 21 + index, pattern));
flutePatterns.slice(20).forEach((pattern, index) => addPattern('springLayer', 'glow', 29 + index, pattern));

export const testDemo8SongScore = {
  schemaVersion: SONG_SCORE_SCHEMA_VERSION,
  meta: {
    title: '灵昕',
    composer: 'OpenClaw',
    tempoBpm: 108,
    timeSignature: '4/4',
    key: 'D major',
    unitNoteLength: '1/8',
    genre: 'Childhood Spring Piano',
    mood: '童年 / 春雨 / 新生 / 喜悦 / 晨光',
    tags: ['spring', 'childhood', 'rain', 'growth', 'piano-led', 'flute', 'cello', 'instrumental'],
  },
  sections,
  tracks: [
    {
      id: 'rightHand',
      name: 'Right Hand',
      role: SONG_SCORE_TRACK_ROLE.MELODY,
      instrumentHint: 'spring piano lead',
      color: '#8ccfff',
    },
    {
      id: 'leftHand',
      name: 'Left Hand',
      role: SONG_SCORE_TRACK_ROLE.CHORDS,
      instrumentHint: 'warm cello foundation',
      color: '#ffd38c',
    },
    {
      id: 'springLayer',
      name: 'Spring Layer',
      role: SONG_SCORE_TRACK_ROLE.COUNTERMELODY,
      instrumentHint: 'flute / bird / spring air',
      color: '#a9f0c3',
    },
  ],
  chords,
  notes,
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'rain',
      text: '开头像春雨还没有完全停，只是把屋檐、泥土和新叶慢慢点亮。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'sprout',
      text: '主角就是钢琴本身。不要明显大提琴；长笛如果出现，只能是极少量、很轻、很短促的闪点，像雨后叶尖上的一点亮光。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'running',
      text: '这一段的轻快完全靠钢琴自己完成，不靠外层配器热闹。像踩着湿石板路往前跑，脚步轻，心也亮。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.HOOK_HINT,
      targetSectionId: 'bloom',
      text: '高潮不是喊出来，而是像天光忽然更开：万物在长，自己也在长，喜悦是舒展开的。',
    },
    {
      type: SONG_SCORE_ANNOTATION_TYPE.ARRANGEMENT_HINT,
      targetSectionId: 'glow',
      text: '尾声带着潮湿空气和傍晚金光，最后要温暖、轻亮、心里发光。',
    },
  ],
  renderHints: {
    defaultInstruments: {
      rightHand: 'realistic-piano',
      leftHand: 'realistic-piano',
      springLayer: 'philharmonia-flute',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.08,
  },
  sourceFormat: 'story',
  sourceText: '童年、春天、春雨与新生：一个孩子在春雨初歇的日子里，看见万物苏醒，也第一次隐约感觉到自己在长大。',
};