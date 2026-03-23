import { renderLanding } from './components/landing.ts';
import { renderComposer } from './components/composer.ts';
import { DEFAULT_INSTRUMENT_ID } from './audio/webAudioPlayer.ts';
import { quickPresets, recentProjects } from './data/presets.ts';
import { createProject } from './data/songFactory.ts';
import { getInitialLanguage } from './i18n.ts';
import { getPreferredPreviewInstrument, getProjectSections } from './songscore/adapters.ts';
import { MODAL, SCREEN } from './types.ts';

export function createInitialState() {
  const project = createProject('mainstream-pop');
  const sections = getProjectSections(project);
  return {
    language: getInitialLanguage(),
    screen: SCREEN.LANDING,
    presets: quickPresets,
    recentProjects,
    project,
    selectedSectionId: sections[0].id,
    selectedNoteId: '',
    activeModal: MODAL.NONE,
    isPlaying: false,
    loopEnabled: false,
    currentBar: 0,
    playheadBeat: 0,
    selectedInstrumentId: getPreferredPreviewInstrument(project) || DEFAULT_INSTRUMENT_ID,
    laneHeights: {
      timeline: 170,
      chords: 92,
      piano: 420,
    },
    toast: '',
  };
}

export function renderApp(state) {
  return state.screen === SCREEN.LANDING ? renderLanding(state) : renderComposer(state);
}
