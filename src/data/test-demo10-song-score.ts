import { SONG_SCORE_TRACK_ROLE } from '../songscore/model.ts';
import { testDemo7SongScore } from './test-demo7-song-score.ts';

const battlePulseNotes = testDemo7SongScore.notes
  .filter((note) => note.trackId === 'leftHand' && note.sectionId === 'battle')
  .map((note) => ({
    ...note,
    trackId: 'battlePulse',
    velocity: Math.min(127, Math.round((note.velocity || 90) + 10)),
  }));

export const testDemo10SongScore = {
  ...testDemo7SongScore,
  meta: {
    ...testDemo7SongScore.meta,
    title: 'VPO试音版',
    genre: 'VPO Audition Demo',
    mood: '明显听出 cello / flute 的测试版',
    tags: ['vpo', 'audition', 'cello', 'flute', 'test', 'instrumental'],
  },
  tracks: [
    ...testDemo7SongScore.tracks,
    {
      id: 'battlePulse',
      name: 'Battle Pulse',
      role: SONG_SCORE_TRACK_ROLE.RHYTHM,
      instrumentHint: 'short piano pulse to restore battle urgency',
      color: '#ffb36b',
    },
  ],
  notes: [...testDemo7SongScore.notes, ...battlePulseNotes],
  annotations: [
    {
      type: 'section_description',
      targetSectionId: 'intro',
      text: '这版不是最终编曲，只是为了让你一耳朵听出 VPO 已经进来：钢琴主线保留，大提琴托底，长笛在高处回应。',
    },
    {
      type: 'arrangement_hint',
      targetSectionId: 'battle',
      text: '战斗段额外补回一层短促钢琴脉冲，只负责紧张推进感；cello 继续托底，但不要盖住钢琴。',
    },
    ...testDemo7SongScore.annotations,
  ],
  renderHints: {
    ...testDemo7SongScore.renderHints,
    defaultInstruments: {
      rightHand: 'realistic-piano',
      leftHand: 'vpo-cello-solo-sustain',
      warLayer: 'vpo-flute-solo-sustain',
      battlePulse: 'realistic-piano',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.05,
  },
  sourceText: '用于明确试听 VPO 是否已接入的测试版：钢琴继续做主线，大提琴负责托底，长笛负责高处回应。中段战斗额外补一层短促钢琴脉冲，把紧张急促感拉回来。重点不是最终好不好听，而是让 cello / flute 的存在非常明显，同时保住钢琴的前景和战斗推进。',
};
