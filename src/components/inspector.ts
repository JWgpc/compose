import { formatBeats, localizeValue, t } from '../i18n.ts';
import { getProjectNote, getProjectSection } from '../songscore/adapters.ts';
import { escapeHtml, formatBarRange, noteName } from '../utils.ts';

export function renderInspector(state) {
  const lang = state.language;
  const selectedSection = getProjectSection(state.project, state.selectedSectionId);
  const selectedNote = getProjectNote(state.project, state.selectedNoteId);

  let content = `
    <div class="inspector-card">
      <span class="eyebrow">${escapeHtml(t(lang, 'nothingSelected'))}</span>
      <h3>${escapeHtml(t(lang, 'songPlan'))}</h3>
      <ul class="inspector-list">
        <li><span>${escapeHtml(t(lang, 'hookSummary'))}</span><strong>${escapeHtml(localizeValue(lang, state.project.strategy.hookSummary))}</strong></li>
        <li><span>${escapeHtml(t(lang, 'melodyRule'))}</span><strong>${escapeHtml(localizeValue(lang, state.project.strategy.melodyRule))}</strong></li>
        <li><span>${escapeHtml(t(lang, 'harmonyRule'))}</span><strong>${escapeHtml(localizeValue(lang, state.project.strategy.harmonyRule))}</strong></li>
        <li><span>${escapeHtml(t(lang, 'reference'))}</span><strong>${escapeHtml(localizeValue(lang, state.project.strategy.referenceDirection))}</strong></li>
      </ul>
    </div>
  `;

  if (selectedSection) {
    content = `
      <div class="inspector-card">
        <span class="eyebrow">${escapeHtml(t(lang, 'sectionSelected'))}</span>
        <h3>${escapeHtml(localizeValue(lang, selectedSection.label))}</h3>
        <ul class="inspector-list">
          <li><span>${escapeHtml(t(lang, 'bars'))}</span><strong>${formatBarRange(selectedSection.startBar, selectedSection.bars)}</strong></li>
          <li><span>${escapeHtml(t(lang, 'chordLoop'))}</span><strong>${escapeHtml(selectedSection.loopLabel)}</strong></li>
          <li><span>${escapeHtml(t(lang, 'hookRole'))}</span><strong>${escapeHtml(t(lang, selectedSection.hasHook ? 'hookRoleMain' : 'hookRoleSupport'))}</strong></li>
          <li><span>${escapeHtml(t(lang, 'energy'))}</span><strong>${escapeHtml(localizeValue(lang, selectedSection.energy))}</strong></li>
        </ul>
        <p class="inspector-copy">${escapeHtml(localizeValue(lang, selectedSection.regenerateHint))}</p>
        <div class="action-stack">
          <button class="primary-button" data-action="open-regenerate">${escapeHtml(t(lang, 'regenerateSection'))}</button>
          <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'helperRegenerateInline'))}</p>
          <button class="secondary-button" data-action="duplicate-section">${escapeHtml(t(lang, 'duplicateSection'))}</button>
          <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'duplicateHint'))}</p>
        </div>
      </div>
    `;
  }

  if (selectedNote) {
    content += `
      <div class="inspector-card inspector-card--note">
        <span class="eyebrow">${escapeHtml(t(lang, 'noteSelected'))}</span>
        <h3>${noteName(selectedNote.pitch)}</h3>
        <ul class="inspector-list">
          <li><span>${escapeHtml(t(lang, 'startBeat'))}</span><strong>${selectedNote.startBeat.toFixed(1)}</strong></li>
          <li><span>${escapeHtml(t(lang, 'duration'))}</span><strong>${escapeHtml(formatBeats(lang, selectedNote.duration))}</strong></li>
          <li><span>${escapeHtml(t(lang, 'emphasis'))}</span><strong>${escapeHtml(localizeValue(lang, selectedNote.emphasis))}</strong></li>
          <li><span>${escapeHtml(t(lang, 'lyricTag'))}</span><strong>${escapeHtml(selectedNote.lyric || '—')}</strong></li>
        </ul>
      </div>
    `;
  }

  return `
    <aside class="workspace-inspector glass-panel">
      <div class="workspace-inspector__header">
        <span class="eyebrow">${escapeHtml(t(lang, 'inspector'))}</span>
        <h2>${escapeHtml(t(lang, 'details'))}</h2>
        <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'inspectorHint'))}</p>
      </div>
      <div class="workspace-inspector__scroll" data-inspector-scroll>${content}</div>
    </aside>
  `;
}
