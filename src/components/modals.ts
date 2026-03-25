import { MODAL } from '../types.ts';
import { localizeValue, t } from '../i18n.ts';
import { getProjectSection, getProjectSections } from '../songscore/adapters.ts';
import { escapeHtml } from '../utils.ts';

export function renderModal(state) {
  if (state.activeModal === MODAL.NONE) {
    return '';
  }

  const lang = state.language;
  const sections = getProjectSections(state.project);
  const selectedSection = getProjectSection(state.project, state.selectedSectionId) || sections[0];

  if (state.activeModal === MODAL.REGENERATE) {
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <span class="eyebrow">${escapeHtml(t(lang, 'regenerateModalEyebrow'))}</span>
              <h3>${escapeHtml(localizeValue(lang, selectedSection.label))}</h3>
            </div>
            <button class="icon-button" data-action="close-modal">✕</button>
          </div>
          <p class="modal-copy">${escapeHtml(t(lang, 'regenerateModalCopy'))}</p>
          <div class="chip-row">
            <button class="chip chip-button chip-accent">${escapeHtml(t(lang, 'keepChords'))}</button>
            <button class="chip chip-button">${escapeHtml(t(lang, 'pushHigherRegister'))}</button>
            <button class="chip chip-button">${escapeHtml(t(lang, 'tighterMotifReuse'))}</button>
            <button class="chip chip-button">${escapeHtml(t(lang, 'moreRhythmicLift'))}</button>
          </div>
          <div class="modal-grid">
            <label class="field">
              <span>${escapeHtml(t(lang, 'variationAmount'))}</span>
              <input type="range" min="0" max="100" value="64" />
            </label>
            <label class="field">
              <span>${escapeHtml(t(lang, 'chordStrictness'))}</span>
              <select>
                <option selected>${escapeHtml(t(lang, 'followCurrentLoop'))}</option>
                <option>${escapeHtml(t(lang, 'allowPassingTones'))}</option>
                <option>${escapeHtml(t(lang, 'suggestAlternateLoop'))}</option>
              </select>
            </label>
            <label class="field field--full">
              <span>${escapeHtml(t(lang, 'directionPrompt'))}</span>
              <input type="text" value="${escapeHtml(t(lang, 'regeneratePromptValue'))}" />
            </label>
          </div>
          <div class="modal-footer">
            <button class="secondary-button" data-action="close-modal">${escapeHtml(t(lang, 'cancel'))}</button>
            <button class="primary-button" data-action="apply-regenerate">${escapeHtml(t(lang, 'regeneratePreview'))}</button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(t(lang, 'exportModalEyebrow'))}</span>
            <h3>${escapeHtml(state.project.title)}</h3>
          </div>
          <button class="icon-button" data-action="close-modal">✕</button>
        </div>
        <p class="modal-copy">${escapeHtml(t(lang, 'exportModalCopy'))}</p>
        <div class="export-options">
          <label class="export-option export-option--active">
            <input type="radio" checked />
            <div>
              <strong>${escapeHtml(t(lang, 'wavExport'))}</strong>
              <span>${escapeHtml(t(lang, 'wavExportDescription'))}</span>
            </div>
          </label>
        </div>
        <div class="modal-grid">
          <label class="field field--full">
            <span>${escapeHtml(t(lang, 'filename'))}</span>
            <input type="text" value="${escapeHtml(state.project.title.replaceAll(' ', '_').toLowerCase())}.wav" readonly />
          </label>
          <label class="field field--full">
            <span>${escapeHtml(t(lang, 'instrument'))}</span>
            <input type="text" value="${escapeHtml(t(lang, 'exportUsesCurrentInstrument'))}" readonly />
          </label>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" data-action="close-modal">${escapeHtml(t(lang, 'cancel'))}</button>
          <button class="primary-button" data-action="apply-export">${escapeHtml(t(lang, 'exportFile'))}</button>
        </div>
      </div>
    </div>
  `;
}
