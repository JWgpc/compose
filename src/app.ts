import { renderLanding } from './components/landing.ts';
import { renderComposer } from './components/composer.ts';
import { DEFAULT_INSTRUMENT_ID, resolveInstrumentId } from './audio/webAudioPlayer.ts';
import { quickPresets, recentProjects } from './data/presets.ts';
import { getInitialLanguage } from './i18n.ts';
import { MODAL, SCREEN } from './types.ts';

export function createInitialState() {
  return {
    language: getInitialLanguage(),
    screen: SCREEN.LANDING,
    presets: quickPresets,
    recentProjects,
    project: null,
    selectedSectionId: '',
    selectedNoteId: '',
    activeModal: MODAL.NONE,
    isPlaying: false,
    loopEnabled: false,
    currentBar: 0,
    playheadBeat: 0,
    selectedInstrumentId: resolveInstrumentId(null, DEFAULT_INSTRUMENT_ID),
    hasLyrics: false,
    lyricRollEnabled: false,
    lyricPlaybackMode: 'mix',
    isProjectLoading: false,
    laneHeights: {
      timeline: 170,
      chords: 92,
      lyrics: 138,
      piano: 420,
    },
    toast: '',
  };
}

function renderProjectLoading(state) {
  return `
    <div class="landing-shell">
      <header class="landing-topbar glass-panel">
        <div class="topbar-brand">
          <span class="eyebrow">Song Creator</span>
          <strong>Loading project…</strong>
        </div>
      </header>
      <section class="hero-panel glass-panel">
        <div class="hero-copy">
          <h1>${state.project ? state.project.title : 'Loading project…'}</h1>
          <p>Preparing the selected song detail page.</p>
        </div>
      </section>
    </div>
  `;
}

export function renderApp(state) {
  if (state.screen === SCREEN.LANDING) {
    return renderLanding(state);
  }

  if (!state.project || state.isProjectLoading) {
    return renderProjectLoading(state);
  }

  return renderComposer(state);
}
