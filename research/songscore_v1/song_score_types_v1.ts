export type SongScoreSourceFormat = 'json' | 'abc' | 'midi' | 'musicxml' | 'text' | 'unknown';

export type SectionType =
  | 'intro'
  | 'verse'
  | 'pre_chorus'
  | 'chorus'
  | 'bridge'
  | 'outro'
  | 'interlude'
  | 'drop'
  | 'custom';

export type TrackRole =
  | 'melody'
  | 'chords'
  | 'bass'
  | 'arp'
  | 'strings'
  | 'pad'
  | 'drums'
  | 'countermelody'
  | 'custom';

export type AnnotationType =
  | 'section_description'
  | 'arrangement_hint'
  | 'performance_hint'
  | 'mood_hint'
  | 'hook_hint'
  | 'custom';

export type AccentLevel = 'none' | 'light' | 'medium' | 'strong';
export type StressLevel = 'weak' | 'medium' | 'strong';

export interface SongScoreMetaV1 {
  title: string;
  composer: string;
  tempoBpm: number;
  timeSignature: `${number}/${number}`;
  key: string;
  subtitle?: string;
  arranger?: string;
  unitNoteLength?: `${number}/${number}`;
  genre?: string;
  mood?: string;
  swing?: number;
  tags?: string[];
}

export interface SongScoreSectionV1 {
  id: string;
  label: string;
  startBar: number;
  barCount: number;
  type?: SectionType;
  description?: string;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  hookFocus?: boolean;
}

export interface SongScoreTrackV1 {
  id: string;
  name: string;
  role: TrackRole;
  instrumentHint?: string;
  mute?: boolean;
  solo?: boolean;
  color?: `#${string}`;
}

export interface SongScoreChordEventV1 {
  bar: number;
  beat: number;
  symbol: string;
  durationBeats?: number;
  sectionId?: string;
  romanNumeral?: string;
  function?: string;
  voicingHint?: string;
}

interface SongScoreNoteBaseV1 {
  startBeat: number;
  durationBeats: number;
  trackId: string;
  sectionId?: string;
  velocity?: number;
  tieStart?: boolean;
  tieEnd?: boolean;
  lyricSyllable?: string;
  accent?: AccentLevel;
}

export interface SongScoreRestEventV1 extends SongScoreNoteBaseV1 {
  isRest: true;
  pitch?: never;
  midi?: never;
}

export interface SongScorePitchedNoteEventV1 extends SongScoreNoteBaseV1 {
  isRest?: false;
  pitch?: `${'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'}${'' | '#' | 'b'}${number}`;
  midi?: number;
}

export type SongScoreNoteEventV1 = SongScoreRestEventV1 | SongScorePitchedNoteEventV1;

export interface SongScoreAnnotationV1 {
  type: AnnotationType;
  text: string;
  targetSectionId?: string;
  bar?: number;
}

export interface SongScoreLyricPlanSectionV1 {
  sectionId: string;
  titlePositionBeats?: number[];
  syllablesPerBar?: number[];
  stressPattern?: StressLevel[];
}

export interface SongScoreLyricPlanV1 {
  language?: string;
  sections?: SongScoreLyricPlanSectionV1[];
}

export interface SongScoreRenderHintsV1 {
  defaultInstruments?: Record<string, string>;
  preferredPreviewInstrument?: string;
  swingFeel?: number;
  humanizeAmount?: number;
}

export interface SongScoreV1 {
  schemaVersion: 1;
  meta: SongScoreMetaV1;
  sections: SongScoreSectionV1[];
  tracks: SongScoreTrackV1[];
  chords: SongScoreChordEventV1[];
  notes: SongScoreNoteEventV1[];
  annotations?: SongScoreAnnotationV1[];
  lyricPlan?: SongScoreLyricPlanV1;
  renderHints?: SongScoreRenderHintsV1;
  sourceFormat?: SongScoreSourceFormat;
  sourceText?: string;
}
