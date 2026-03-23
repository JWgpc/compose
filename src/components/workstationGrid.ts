export const BEATS_PER_BAR = 4;
export const BEAT_WIDTH = 28;
export const BAR_WIDTH = BEAT_WIDTH * BEATS_PER_BAR;
export const TRACK_GUTTER = 64;

export function getMusicalGridWidth(totalBars: number) {
  return totalBars * BAR_WIDTH;
}

export function getWorkstationContentWidth(totalBars: number) {
  return TRACK_GUTTER + getMusicalGridWidth(totalBars);
}

export function getBarOffset(barIndex: number) {
  return TRACK_GUTTER + barIndex * BAR_WIDTH;
}

export function getBeatOffset(beat: number) {
  return TRACK_GUTTER + beat * BEAT_WIDTH;
}
