import { SONG_SCORE_ANNOTATION_TYPE, SONG_SCORE_SCHEMA_VERSION, SONG_SCORE_SECTION_TYPE, SONG_SCORE_TRACK_ROLE } from '../songscore/model.ts';

export const testDemo1SongScore = {
  schemaVersion: SONG_SCORE_SCHEMA_VERSION,
  meta: {
    title: '测试demo1',
    composer: 'A58',
    tempoBpm: 90,
    timeSignature: '4/4',
    key: 'C',
    unitNoteLength: '1/4',
    genre: 'Demo',
    mood: 'Neutral',
    tags: ['test', 'demo', 'import'],
  },
  sections: [
    {
      id: 'verse1',
      label: '主段',
      startBar: 1,
      barCount: 4,
      type: SONG_SCORE_SECTION_TYPE.VERSE,
      description: '四小节最小导入示例',
      energyLevel: 2,
      hookFocus: false,
    },
  ],
  tracks: [
    {
      id: 'melody',
      name: 'Melody',
      role: SONG_SCORE_TRACK_ROLE.MELODY,
      instrumentHint: 'piano',
      color: '#8ccfff',
    },
  ],
  chords: [
    { bar: 1, beat: 1, symbol: 'C', durationBeats: 4, sectionId: 'verse1' },
    { bar: 2, beat: 1, symbol: 'Am', durationBeats: 4, sectionId: 'verse1' },
    { bar: 3, beat: 1, symbol: 'F', durationBeats: 4, sectionId: 'verse1' },
    { bar: 4, beat: 1, symbol: 'G', durationBeats: 4, sectionId: 'verse1' },
  ],
  notes: [
    { pitch: 'E4', midi: 64, startBeat: 0, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 90, accent: 'light' },
    { pitch: 'G4', midi: 67, startBeat: 1, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 92, accent: 'medium' },
    { pitch: 'A4', midi: 69, startBeat: 2, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 94, accent: 'medium' },
    { pitch: 'G4', midi: 67, startBeat: 3, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 90, accent: 'light' },

    { pitch: 'C5', midi: 72, startBeat: 4, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 95, accent: 'medium' },
    { pitch: 'B4', midi: 71, startBeat: 5, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 88, accent: 'light' },
    { pitch: 'A4', midi: 69, startBeat: 6, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 86, accent: 'light' },
    { pitch: 'G4', midi: 67, startBeat: 7, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 84, accent: 'light' },

    { pitch: 'A4', midi: 69, startBeat: 8, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 90, accent: 'medium' },
    { pitch: 'A4', midi: 69, startBeat: 9, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 90, accent: 'medium' },
    { pitch: 'G4', midi: 67, startBeat: 10, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 86, accent: 'light' },
    { pitch: 'E4', midi: 64, startBeat: 11, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 84, accent: 'light' },

    { pitch: 'D4', midi: 62, startBeat: 12, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 88, accent: 'light' },
    { pitch: 'F4', midi: 65, startBeat: 13, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 90, accent: 'medium' },
    { pitch: 'G4', midi: 67, startBeat: 14, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 92, accent: 'medium' },
    { pitch: 'C5', midi: 72, startBeat: 15, durationBeats: 1, trackId: 'melody', sectionId: 'verse1', velocity: 96, accent: 'strong' },
  ],
  annotations: [
    {
      type: SONG_SCORE_ANNOTATION_TYPE.SECTION_DESCRIPTION,
      targetSectionId: 'verse1',
      text: '四小节上行后回落的测试旋律',
    },
  ],
  renderHints: {
    defaultInstruments: {
      melody: 'realistic-piano',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.1,
  },
  sourceFormat: 'json',
  sourceText: 'Manual demo import: 测试demo1',
};
