import { controlOptions, quickPresets } from '../data/presets.ts';
import { localizeValue, t } from '../i18n.ts';
import { escapeHtml } from '../utils.ts';

function renderOption(value, current, language) {
  return `<option value="${escapeHtml(value)}" ${value === current ? 'selected' : ''}>${escapeHtml(localizeValue(language, value))}</option>`;
}

function renderField(language, labelKey, name, type, value, options, className = '') {
  const fieldClass = className ? `field ${className}` : 'field';
  if (type === 'select') {
    return `
      <label class="${escapeHtml(fieldClass)}">
        <span>${escapeHtml(t(language, labelKey))}</span>
        <select data-setting="${escapeHtml(name)}">
          ${options.map((option) => renderOption(option, value, language)).join('')}
        </select>
      </label>
    `;
  }

  return `
    <label class="${escapeHtml(fieldClass)}">
      <span>${escapeHtml(t(language, labelKey))}</span>
      <input type="${escapeHtml(type)}" data-setting="${escapeHtml(name)}" value="${escapeHtml(value)}" />
    </label>
  `;
}

export function renderSidebar(state) {
  const { settings } = state.project;
  const lang = state.language;
  const essentialsFields = [
    renderField(lang, 'style', 'style', 'select', settings.style, controlOptions.style),
    renderField(lang, 'mood', 'mood', 'select', settings.mood, controlOptions.mood),
    renderField(lang, 'bpm', 'bpm', 'number', String(settings.bpm)),
    renderField(lang, 'key', 'key', 'select', settings.key, controlOptions.key),
    renderField(lang, 'mode', 'mode', 'select', settings.mode, controlOptions.mode),
  ].join('');
  const structureFields = [
    renderField(lang, 'hookType', 'hookType', 'select', settings.hookType, controlOptions.hookType),
    renderField(lang, 'sectionTemplate', 'sectionTemplate', 'select', settings.sectionTemplate, controlOptions.sectionTemplate),
    renderField(lang, 'phraseLength', 'phraseLength', 'number', String(settings.phraseLength)),
    renderField(lang, 'chorusLift', 'chorusLift', 'select', settings.chorusLift, controlOptions.chorusLift),
  ].join('');
  const identityFields = [
    renderField(lang, 'songTitle', 'title', 'text', settings.title, undefined, 'field--full'),
    renderField(lang, 'themePrompt', 'theme', 'text', settings.theme, undefined, 'field--full'),
    renderField(lang, 'lyricIdea', 'lyricIdea', 'text', settings.lyricIdea, undefined, 'field--full'),
  ].join('');
  const presetButtons = quickPresets
    .map(
      (preset) => `
        <button class="mini-preset ${preset.id === state.project.presetId ? 'mini-preset--active' : ''}" data-action="apply-preset" data-preset-id="${preset.id}">
          <strong>${escapeHtml(localizeValue(lang, preset.label))}</strong>
          <span>${escapeHtml(localizeValue(lang, preset.hookType))}</span>
        </button>
      `,
    )
    .join('');

  return `
    <aside class="workspace-sidebar glass-panel">
      <div class="workspace-sidebar__top">
        <div class="sidebar-block sidebar-block--summary">
          <div class="block-header block-header--compact">
            <div>
              <span class="eyebrow">${escapeHtml(t(lang, 'currentSong'))}</span>
              <h2>${escapeHtml(state.project.title)}</h2>
            </div>
            <span class="chip chip-accent">${escapeHtml(String(settings.bpm))} BPM</span>
          </div>
          <div class="summary-pills">
            <span class="chip">${escapeHtml(localizeValue(lang, settings.style))}</span>
            <span class="chip">${escapeHtml(localizeValue(lang, settings.mood))}</span>
            <span class="chip">${escapeHtml(settings.key)} ${escapeHtml(localizeValue(lang, settings.mode))}</span>
          </div>
        </div>

        <div class="sidebar-block sidebar-block--actions">
          <span class="eyebrow">${escapeHtml(t(lang, 'coreActions'))}</span>
          <div class="sidebar-action-stack">
            <button class="primary-button" data-action="generate-song">${escapeHtml(t(lang, 'generateSong'))}</button>
            <button class="secondary-button" data-action="open-regenerate">${escapeHtml(t(lang, 'regenerateSection'))}</button>
            <button class="secondary-button" data-action="open-export">${escapeHtml(t(lang, 'exportSketch'))}</button>
          </div>
          <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'generateSongHint'))}</p>
        </div>
      </div>

      <div class="workspace-sidebar__scroll" data-sidebar-scroll>
        <section class="sidebar-section sidebar-section--open">
          <div class="sidebar-section__summary sidebar-section__summary--static">
            <span class="sidebar-section__title">${escapeHtml(t(lang, 'songDirection'))}</span>
          </div>
          <div class="sidebar-section__content">
            <div class="strategy-card strategy-card--compact">
              <div class="strategy-card__row"><span>${escapeHtml(t(lang, 'hookLabel'))}</span><strong>${escapeHtml(localizeValue(lang, settings.hookType))}</strong></div>
              <div class="strategy-card__row"><span>${escapeHtml(t(lang, 'formLabel'))}</span><strong>${escapeHtml(localizeValue(lang, settings.sectionTemplate))}</strong></div>
              <div class="strategy-card__row"><span>${escapeHtml(t(lang, 'liftLabel'))}</span><strong>${escapeHtml(localizeValue(lang, settings.chorusLift))}</strong></div>
              <p>${escapeHtml(localizeValue(lang, state.project.strategy.hookSummary))}</p>
            </div>
          </div>
        </section>

        <section class="sidebar-section sidebar-section--open">
          <div class="sidebar-section__summary sidebar-section__summary--static">
            <span class="sidebar-section__title">${escapeHtml(t(lang, 'songSettings'))}</span>
          </div>
          <div class="sidebar-section__content">
            <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'songSettingsHint'))}</p>
            <div class="settings-group">
              <span class="sidebar-subheading">${escapeHtml(t(lang, 'settingsEssentials'))}</span>
              <div class="field-grid field-grid--dense">${essentialsFields}</div>
            </div>
            <div class="settings-group">
              <span class="sidebar-subheading">${escapeHtml(t(lang, 'settingsStructure'))}</span>
              <div class="field-grid field-grid--dense">${structureFields}</div>
            </div>
            <div class="settings-group">
              <span class="sidebar-subheading">${escapeHtml(t(lang, 'settingsIdentity'))}</span>
              <div class="field-grid field-grid--dense">${identityFields}</div>
            </div>
          </div>
        </section>

        <section class="sidebar-section sidebar-section--open">
          <div class="sidebar-section__summary sidebar-section__summary--static">
            <span class="sidebar-section__title">${escapeHtml(t(lang, 'presetDirections'))}</span>
          </div>
          <div class="sidebar-section__content">
            <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'presetHint'))}</p>
            <div class="mini-preset-grid mini-preset-grid--compact">${presetButtons}</div>
          </div>
        </section>
      </div>
    </aside>
  `;
}
