import { getFlowSteps, t } from '../i18n.ts';
import { renderSidebar } from './sidebar.ts';
import { renderTimeline } from './timeline.ts';
import { renderChordLane } from './chordLane.ts';
import { renderPianoRoll } from './pianoRoll.ts';
import { renderInspector } from './inspector.ts';
import { renderTransport } from './transport.ts';
import { renderModal } from './modals.ts';
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

export function renderComposer(state) {
  const lang = state.language;
  const steps = getFlowSteps(lang)
    .map((step) => `<div class="step-card step-card--compact">${escapeHtml(step)}</div>`)
    .join('');

  return `
    <div class="workspace-shell">
      <header class="workspace-topbar glass-panel">
        <div>
          <span class="eyebrow">${escapeHtml(t(lang, 'workspaceTopbarEyebrow'))}</span>
          <h1>${escapeHtml(state.project.title)}</h1>
          <p class="topbar-copy">${escapeHtml(t(lang, 'workspaceGuideDescription'))}</p>
        </div>
        <div class="topbar-actions topbar-actions--stacked">
          ${renderLanguageToggle(state)}
          <div class="topbar-actions">
            <button class="secondary-button" data-action="go-home">${escapeHtml(t(lang, 'backHome'))}</button>
            <button class="primary-button" data-action="open-export">${escapeHtml(t(lang, 'exportSketch'))}</button>
          </div>
        </div>
      </header>

      <div class="workspace-layout">
        ${renderSidebar(state)}
        <main class="workspace-center">
          <details class="workspace-guide glass-panel">
            <summary class="workspace-guide__summary">
              <div class="workspace-guide__title">
                <span class="eyebrow">${escapeHtml(t(lang, 'workspaceGuideEyebrow'))}</span>
                <strong>${escapeHtml(t(lang, 'workspaceGuideTitle'))}</strong>
              </div>
              <span class="guide-copy">${escapeHtml(t(lang, 'flowTip'))}</span>
            </summary>
            <div class="workspace-guide__content">
              <div class="step-list step-list--compact">${steps}</div>
            </div>
          </details>
          <div class="panel-stack-item panel-stack-item--fixed" data-panel-target="timeline" style="--panel-height:${state.laneHeights.timeline}px">
            ${renderTimeline(state)}
            <div class="panel-edge-resizer" data-resize-target="timeline" title="Resize timeline panel" aria-label="Resize timeline panel"></div>
          </div>
          <div class="panel-stack-item panel-stack-item--fixed" data-panel-target="chords" style="--panel-height:${state.laneHeights.chords}px">
            ${renderChordLane(state)}
            <div class="panel-edge-resizer" data-resize-target="chords" title="Resize chord panel" aria-label="Resize chord panel"></div>
          </div>
          <div class="panel-stack-item panel-stack-item--fill" data-panel-target="piano" style="--panel-height:${state.laneHeights.piano}px">
            ${renderPianoRoll(state)}
            <div class="panel-edge-resizer" data-resize-target="piano" title="Resize piano roll panel" aria-label="Resize piano roll panel"></div>
          </div>
        </main>
        ${renderInspector(state)}
      </div>

      ${renderTransport(state)}
      ${renderModal(state)}
      ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}
    </div>
  `;
}

