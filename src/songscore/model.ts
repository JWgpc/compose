export const SONG_SCORE_SCHEMA_VERSION = 1;

export const SONG_SCORE_SECTION_TYPE = {
  INTRO: 'intro',
  VERSE: 'verse',
  PRE_CHORUS: 'pre_chorus',
  CHORUS: 'chorus',
  BRIDGE: 'bridge',
  OUTRO: 'outro',
  INTERLUDE: 'interlude',
  DROP: 'drop',
  CUSTOM: 'custom',
};

export const SONG_SCORE_TRACK_ROLE = {
  MELODY: 'melody',
  CHORDS: 'chords',
  BASS: 'bass',
  ARP: 'arp',
  STRINGS: 'strings',
  PAD: 'pad',
  DRUMS: 'drums',
  COUNTERMELODY: 'countermelody',
  CUSTOM: 'custom',
};

export const SONG_SCORE_ANNOTATION_TYPE = {
  SECTION_DESCRIPTION: 'section_description',
  ARRANGEMENT_HINT: 'arrangement_hint',
  PERFORMANCE_HINT: 'performance_hint',
  MOOD_HINT: 'mood_hint',
  HOOK_HINT: 'hook_hint',
  CUSTOM: 'custom',
};

export const SONG_SCORE_ACCENT = {
  NONE: 'none',
  LIGHT: 'light',
  MEDIUM: 'medium',
  STRONG: 'strong',
};

export function isRestEvent(note) {
  return Boolean(note?.isRest);
}

export function isPitchedNoteEvent(note) {
  return Boolean(note) && !note.isRest && Number.isFinite(note.midi);
}
