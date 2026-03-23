import { localizeValue, t } from '../i18n.ts';
import { getAvailableInstruments } from '../audio/webAudioPlayer.ts';

const instruments = getAvailableInstruments();

export function renderTransport(state) {
  const lang = state.language;
  const sliderValue = Math.min(state.playheadBeat / 4, Math.max(state.project.totalBars - 1, 0));
  const instrumentOptions = instruments
    .map(
      (instrument) =>
        `<option value="${instrument.id}" ${state.selectedInstrumentId === instrument.id ? 'selected' : ''}>${t(lang, instrument.labelKey)}</option>`,
    )
    .join('');

  return `
    <section class="transport-bar glass-panel" aria-label="transport dock">
      <div class="transport-stack">
        <div class="transport-controls">
          <button class="transport-button" data-action="toggle-play">${state.isPlaying ? t(lang, 'pause') : t(lang, 'play')}</button>
          <button class="transport-button" data-action="stop-playback">${t(lang, 'stop')}</button>
          <button class="transport-button ${state.loopEnabled ? 'transport-button--active' : ''}" data-action="toggle-loop">${t(lang, 'loopSection')}</button>
        </div>
        <label class="transport-select-group">
          <span>${t(lang, 'instrument')}</span>
          <select class="transport-select" data-action="select-instrument">
            ${instrumentOptions}
          </select>
        </label>
        <p class="helper-text helper-text--tight">${t(lang, 'helperPlayInline')}</p>
      </div>
      <div class="transport-stack">
        <div class="transport-readout">
          <span>${t(lang, 'tempo')} <strong>${state.project.settings.bpm} BPM</strong></span>
          <span>${t(lang, 'bar')} <strong data-current-bar-readout>${state.currentBar + 1}</strong> / ${state.project.totalBars}</span>
          <span>${t(lang, 'modeReadout')} <strong>${state.project.settings.key} ${localizeValue(lang, state.project.settings.mode)}</strong></span>
        </div>
        <p class="helper-text helper-text--tight">${t(lang, 'transportHint')}</p>
      </div>
      <input class="transport-slider" type="range" min="0" max="${Math.max(state.project.totalBars - 1, 0)}" step="0.01" value="${sliderValue}" data-action="scrub" data-transport-slider />
    </section>
  `;
}
