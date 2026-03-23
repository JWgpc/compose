import { formatCount, localizeValue, t } from '../i18n.ts';
import { getProjectNotes, getProjectSections } from '../songscore/adapters.ts';
import { noteName, sectionColor } from '../utils.ts';
import { BAR_WIDTH, BEAT_WIDTH, TRACK_GUTTER, getBeatOffset, getWorkstationContentWidth } from './workstationGrid.ts';

const pitches = [76, 74, 72, 71, 69, 67, 65, 64, 62, 60, 59, 57, 55, 53, 52, 50, 48];
const rowHeight = 26;

export function renderPianoRoll(state) {
  const lang = state.language;
  const width = getWorkstationContentWidth(state.project.totalBars);
  const sections = getProjectSections(state.project);
  const projectNotes = getProjectNotes(state.project);
  const selectedSection = sections.find((section) => section.id === state.selectedSectionId);

  const sectionBands = sections
    .map((section) => {
      const left = section.startBar * BAR_WIDTH;
      const bandWidth = section.bars * 4 * BEAT_WIDTH;
      return `
        <div class="section-band ${selectedSection && selectedSection.id === section.id ? 'section-band--active' : ''}"
          style="left:${left}px;width:${bandWidth}px;--section-accent:${sectionColor(section.kind)}">
          <span>${localizeValue(lang, section.label)}</span>
        </div>
      `;
    })
    .join('');

  const rows = pitches
    .map((pitch, index) => {
      const top = index * rowHeight;
      return `
        <div class="pitch-row" style="top:${top}px;height:${rowHeight}px">
          <span class="pitch-label">${noteName(pitch)}</span>
        </div>
      `;
    })
    .join('');

  const notes = projectNotes
    .map((note) => {
      const row = pitches.indexOf(note.pitch);
      const top = (row === -1 ? pitches.length - 1 : row) * rowHeight + 3;
      const left = getBeatOffset(note.startBeat);
      const widthValue = Math.max(note.duration * BEAT_WIDTH - 4, 12);
      const section = sections.find((entry) => entry.id === note.sectionId) || selectedSection || sections[0];
      const active = state.selectedNoteId === note.id;
      return `
        <button
          class="note-block note-block--${note.emphasis} ${active ? 'note-block--active' : ''}"
          data-action="select-note"
          data-note-id="${note.id}"
          style="left:${left}px;top:${top}px;width:${widthValue}px;--section-accent:${sectionColor(section.kind)}"
          title="${noteName(note.pitch)}"
        >
          <span>${note.lyric || noteName(note.pitch)}</span>
        </button>
      `;
    })
    .join('');

  const playheadLeft = getBeatOffset(state.playheadBeat);
  const selectionCaption = selectedSection
    ? `${localizeValue(lang, selectedSection.label)} · ${localizeValue(lang, selectedSection.energy)} · ${localizeValue(lang, selectedSection.motif)}`
    : t(lang, 'selectionSummaryFallback');

  return `
    <section class="center-panel glass-panel piano-panel">
      <div class="center-panel__header compact-header">
        <div>
          <span class="eyebrow">${t(lang, 'pianoRoll')}</span>
          <h3>${t(lang, 'melodySketch')}</h3>
        </div>
        <div class="toolbar-pills">
          <span class="chip">${formatCount(lang, projectNotes.length, 'notesUnit')}</span>
          <span class="chip">${formatCount(lang, state.project.totalBars, 'barsUnit')}</span>
          <span class="chip chip-accent">${t(lang, 'hookVisible')}</span>
        </div>
      </div>
      <p class="helper-text helper-text--tight">${t(lang, 'melodyHint')}</p>
      <div class="piano-scroll" data-arrangement-scroll data-piano-scroll>
        <div class="piano-grid" style="width:${width}px;height:${pitches.length * rowHeight}px;--beat-width:${BEAT_WIDTH}px;--row-height:${rowHeight}px;--track-gutter:${TRACK_GUTTER}px">
          ${rows}
          <div class="section-bands">${sectionBands}</div>
          <div class="grid-overlay"></div>
          <div class="playhead" data-playhead style="left:${playheadLeft}px"></div>
          <div class="note-layer">${notes}</div>
        </div>
      </div>
      <div class="selection-caption">${selectionCaption}</div>
    </section>
  `;
}
