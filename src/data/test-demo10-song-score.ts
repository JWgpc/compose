import { testDemo7SongScore } from './test-demo7-song-score.ts';

export const testDemo10SongScore = {
  ...testDemo7SongScore,
  meta: {
    ...testDemo7SongScore.meta,
    title: 'VPO试音版',
    genre: 'VPO Audition Demo',
    mood: '明显听出 cello / flute 的测试版',
    tags: ['vpo', 'audition', 'cello', 'flute', 'test', 'instrumental'],
  },
  annotations: [
    {
      type: 'section_description',
      targetSectionId: 'intro',
      text: '这版不是最终编曲，只是为了让你一耳朵听出 VPO 已经进来：钢琴主线保留，大提琴托底，长笛在高处回应。',
    },
    ...testDemo7SongScore.annotations,
  ],
  renderHints: {
    ...testDemo7SongScore.renderHints,
    defaultInstruments: {
      rightHand: 'realistic-piano',
      leftHand: 'vpo-cello-solo-sustain',
      warLayer: 'vpo-flute-solo-sustain',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.08,
  },
  sourceText: '用于明确试听 VPO 是否已接入的测试版：钢琴继续做主线，大提琴负责托底，长笛负责高处回应。重点不是最终好不好听，而是让 cello / flute 的存在非常明显。',
};
