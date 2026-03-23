import { getFlowSteps, localizeRecentProject, localizeValue, t } from '../i18n.ts';
import { escapeHtml } from '../utils.ts';

function renderLanguageToggle(state) {
  const lang = state.language;
  return `
    <div class="language-toggle" aria-label="${escapeHtml(t(lang, 'languageLabel'))}">
      <button class="language-toggle__button ${lang === 'cn' ? 'language-toggle__button--active' : ''}" data-action="set-language" data-language="cn">CN</button>
      <button class="language-toggle__button ${lang === 'en' ? 'language-toggle__button--active' : ''}" data-action="set-language" data-language="en">EN</button>
    </div>
  `;
}

export function renderLanding(state) {
  const lang = state.language;
  const presetCards = state.presets
    .slice(0, 4)
    .map(
      (preset) => `
        <button class="preset-card" data-action="open-preset" data-preset-id="${preset.id}">
          <span class="preset-card__badge">${escapeHtml(localizeValue(lang, preset.style))}</span>
          <strong>${escapeHtml(localizeValue(lang, preset.label))}</strong>
          <span>${escapeHtml(localizeValue(lang, preset.hookSummary))}</span>
          <div class="preset-card__meta">
            <span>${escapeHtml(String(preset.bpm))} BPM</span>
            <span>${escapeHtml(preset.key)} ${escapeHtml(localizeValue(lang, preset.mode))}</span>
          </div>
        </button>
      `,
    )
    .join('');

  const recentCards = state.recentProjects
    .map((project) => {
      const localizedProject = localizeRecentProject(lang, project);
      return `
        <button class="recent-project" data-action="open-preset" data-preset-id="${project.presetId}">
          <strong>${escapeHtml(localizedProject.title)}</strong>
          <span>${escapeHtml(localizedProject.subtitle)}</span>
        </button>
      `;
    })
    .join('');

  const steps = getFlowSteps(lang)
    .map((step) => `<div class="step-card">${escapeHtml(step)}</div>`)
    .join('');

  return `
    <div class="landing-shell">
      <header class="landing-topbar glass-panel">
        <div class="topbar-brand">
          <span class="eyebrow">${escapeHtml(t(lang, 'landingEyebrow'))}</span>
          <strong>${escapeHtml(t(lang, 'appName'))}</strong>
        </div>
        <div class="topbar-meta">
          <span class="topbar-copy">${escapeHtml(t(lang, 'languageLabel'))}</span>
          ${renderLanguageToggle(state)}
        </div>
      </header>

      <section class="hero-panel glass-panel">
        <div class="hero-copy">
          <span class="eyebrow">${escapeHtml(t(lang, 'landingEyebrow'))}</span>
          <h1>${escapeHtml(t(lang, 'landingTitle'))}</h1>
          <p>${escapeHtml(t(lang, 'landingDescription'))}</p>
          <p class="helper-text">${escapeHtml(t(lang, 'landingHelper'))}</p>
          <div class="hero-actions">
            <button class="primary-button" data-action="start-scratch">${escapeHtml(t(lang, 'startScratch'))}</button>
            <button class="secondary-button" data-action="open-preset" data-preset-id="mainstream-pop">${escapeHtml(t(lang, 'openFeaturedPreset'))}</button>
          </div>
        </div>
        <div class="hero-preview">
          <div class="mini-window">
            <div class="mini-window__bar"></div>
            <div class="mini-window__timeline">
              <span>${escapeHtml(localizeValue(lang, 'Intro'))}</span><span>${escapeHtml(localizeValue(lang, 'Verse 1'))}</span><span>${escapeHtml(localizeValue(lang, 'Pre-Chorus'))}</span><span>${escapeHtml(localizeValue(lang, 'Chorus'))}</span>
            </div>
            <div class="mini-window__grid"></div>
          </div>
        </div>
      </section>

      <section class="guide-panel glass-panel">
        <div class="section-panel__header">
          <div>
            <span class="eyebrow">${escapeHtml(t(lang, 'guideEyebrow'))}</span>
            <h2>${escapeHtml(t(lang, 'guideTitle'))}</h2>
          </div>
        </div>
        <p class="guide-copy">${escapeHtml(t(lang, 'guideDescription'))}</p>
        <div class="step-list">${steps}</div>
        <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'flowTip'))}</p>
      </section>

      <section class="landing-grid">
        <div class="glass-panel section-panel">
          <div class="section-panel__header">
            <div>
              <span class="eyebrow">${escapeHtml(t(lang, 'quickStarts'))}</span>
              <h2>${escapeHtml(t(lang, 'presetDirections'))}</h2>
            </div>
            <span class="chip chip-accent">${escapeHtml(t(lang, 'strategyFirst'))}</span>
          </div>
          <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'presetHint'))}</p>
          <div class="preset-grid">${presetCards}</div>
        </div>

        <div class="glass-panel section-panel">
          <div class="section-panel__header">
            <div>
              <span class="eyebrow">${escapeHtml(t(lang, 'resumeWork'))}</span>
              <h2>${escapeHtml(t(lang, 'recentProjects'))}</h2>
            </div>
          </div>
          <div class="recent-list">${recentCards}</div>
        </div>
      </section>
    </div>
  `;
}
