import { testDemo10SongScore } from './test-demo10-song-score.ts';

export const testDemo11SongScore = {
  ...testDemo10SongScore,
  meta: {
    ...testDemo10SongScore.meta,
    title: 'VPO小提琴低音提琴试音版',
    genre: 'VPO Violin + Bass Audition Demo',
    mood: '明显听出 violin / bass 的测试版',
    tags: ['vpo', 'audition', 'violin', 'bass', 'test', 'instrumental'],
  },
  annotations: [
    {
      type: 'section_description',
      targetSectionId: 'intro',
      text: '这版专门听 violin 和 bass：钢琴继续负责把轮廓弹清楚，低音提琴先把地基坐稳，小提琴在上方把线条拉出来。',
    },
    {
      type: 'arrangement_hint',
      targetSectionId: 'battle',
      text: '高潮段重点听三个层次：bass 顶住下盘，钢琴保留颗粒感，小提琴把前景拉亮。不是求真实乐队，而是先确认新音色是否值得留。',
    },
    ...testDemo10SongScore.annotations.filter(
      (annotation) =>
        !(annotation.type === 'section_description' && annotation.targetSectionId === 'intro') &&
        !(annotation.type === 'arrangement_hint' && annotation.targetSectionId === 'battle')
    ),
  ],
  renderHints: {
    ...testDemo10SongScore.renderHints,
    defaultInstruments: {
      rightHand: 'realistic-piano',
      leftHand: 'vpo-bass-solo-sustain',
      warLayer: 'vpo-violin-solo-sustain',
      battlePulse: 'realistic-piano',
    },
    preferredPreviewInstrument: 'realistic-piano',
    humanizeAmount: 0.05,
  },
  sourceText: '用于明确试听 VPO violin 和 bass 是否已接入的测试版：钢琴继续做主线，低音提琴负责托底，小提琴负责高处拉线和回应。战斗段保留短促钢琴脉冲，重点是让 violin / bass 的存在足够明显，同时继续检查它们与钢琴是否打架。',
};
