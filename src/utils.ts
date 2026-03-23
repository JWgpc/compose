export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function noteName(midi) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[midi % 12]}${octave}`;
}

export function titleCase(value) {
  return value
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatBarRange(startBar, bars) {
  const endBar = startBar + bars - 1;
  return `${startBar + 1}-${endBar + 1}`;
}

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sectionColor(kind) {
  const map = {
    intro: 'var(--section-intro)',
    verse: 'var(--section-verse)',
    pre: 'var(--section-pre)',
    chorus: 'var(--section-chorus)',
    post: 'var(--section-post)',
    bridge: 'var(--section-bridge)',
    outro: 'var(--section-outro)',
  };
  return map[kind] || 'var(--section-verse)';
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

