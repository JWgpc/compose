import './styles.css';
import { createInitialState, renderApp } from './app.ts';
import { createAudioPlayer, exportProjectToWav, resolveInstrumentId } from './audio/webAudioPlayer.ts';
import { createProject } from './data/songFactory.ts';
import { persistLanguage, syncDocumentLanguage, t } from './i18n.ts';
import {
  getPreferredPreviewInstrument,
  getProjectLyricNotes,
  getProjectSections,
  getSongScoreSummary,
} from './songscore/adapters.ts';
import { TRACK_GUTTER, getBeatOffset } from './components/workstationGrid.ts';
import { MODAL, SCREEN } from './types.ts';

const root = document.querySelector('#app');
if (!root) {
  throw new Error('my_compose: #app container not found');
}
const state = createInitialState();
let toastTimer = null;
let scrollSyncLocked = false;
const uiState = {
  arrangementScrollLeft: 0,
  pianoScrollTop: 0,
  sidebarScrollTop: 0,
  inspectorScrollTop: 0,
  activeResize: null,
};
const player = createAudioPlayer({
  onPosition: (beat) => syncPlaybackPosition(beat),
  onEnded: (reason) => {
    if (reason === 'paused' || reason === 'replaced') {
      return;
    }

    state.isPlaying = false;
    if (reason === 'ended') {
      setPlaybackBeat(0, false);
    }
    rerender();
  },
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTotalBeats() {
  return getSongScoreSummary(state.project).totalBeats;
}

function getDisplayBarFromBeat(beat) {
  const maxBar = Math.max(state.project.totalBars - 1, 0);
  if (maxBar === 0) {
    return 0;
  }
  const safeBeat = clamp(beat, 0, Math.max(getTotalBeats() - 0.001, 0));
  return clamp(Math.floor(safeBeat / 4), 0, maxBar);
}

function syncPlaybackUI() {
  root.querySelectorAll('[data-playhead]').forEach((playhead) => {
    playhead.style.left = `${getBeatOffset(state.playheadBeat)}px`;
  });

  const slider = root.querySelector('[data-transport-slider]');
  if (slider) {
    slider.value = String(Math.min(state.playheadBeat / 4, Math.max(state.project.totalBars - 1, 0)));
  }

  const barReadout = root.querySelector('[data-current-bar-readout]');
  if (barReadout) {
    barReadout.textContent = String(state.currentBar + 1);
  }

  syncArrangementViewport();
}

function setArrangementScrollLeft(nextScrollLeft) {
  const containers = root.querySelectorAll('[data-arrangement-scroll]');
  if (!containers.length) {
    uiState.arrangementScrollLeft = nextScrollLeft;
    return;
  }

  scrollSyncLocked = true;
  uiState.arrangementScrollLeft = nextScrollLeft;
  containers.forEach((container) => {
    container.scrollLeft = nextScrollLeft;
  });
  scrollSyncLocked = false;
}

function syncArrangementViewport() {
  const pianoScroll = root.querySelector('[data-piano-scroll]');
  if (!pianoScroll) {
    return;
  }

  const playheadOffset = getBeatOffset(state.playheadBeat);
  const viewportLeft = pianoScroll.scrollLeft;
  const viewportRight = viewportLeft + pianoScroll.clientWidth;
  const margin = Math.max(TRACK_GUTTER, Math.floor(pianoScroll.clientWidth * 0.2));

  if (playheadOffset >= viewportLeft + margin && playheadOffset <= viewportRight - margin) {
    return;
  }

  const maxScrollLeft = Math.max(pianoScroll.scrollWidth - pianoScroll.clientWidth, 0);
  const nextScrollLeft = clamp(playheadOffset - Math.floor(pianoScroll.clientWidth * 0.35), 0, maxScrollLeft);
  setArrangementScrollLeft(nextScrollLeft);
}

function captureScrollPositions() {
  const arrangementScroll = root.querySelector('[data-arrangement-scroll]');
  if (arrangementScroll) {
    uiState.arrangementScrollLeft = arrangementScroll.scrollLeft;
  }

  const pianoScroll = root.querySelector('[data-piano-scroll]');
  if (pianoScroll) {
    uiState.arrangementScrollLeft = pianoScroll.scrollLeft;
    uiState.pianoScrollTop = pianoScroll.scrollTop;
  }

  const sidebarScroll = root.querySelector('[data-sidebar-scroll]');
  if (sidebarScroll) {
    uiState.sidebarScrollTop = sidebarScroll.scrollTop;
  }

  const inspectorScroll = root.querySelector('[data-inspector-scroll]');
  if (inspectorScroll) {
    uiState.inspectorScrollTop = inspectorScroll.scrollTop;
  }
}

function restoreScrollPositions() {
  setArrangementScrollLeft(uiState.arrangementScrollLeft);

  const pianoScroll = root.querySelector('[data-piano-scroll]');
  if (pianoScroll) {
    pianoScroll.scrollTop = uiState.pianoScrollTop;
  }

  const sidebarScroll = root.querySelector('[data-sidebar-scroll]');
  if (sidebarScroll) {
    sidebarScroll.scrollTop = uiState.sidebarScrollTop;
  }

  const inspectorScroll = root.querySelector('[data-inspector-scroll]');
  if (inspectorScroll) {
    inspectorScroll.scrollTop = uiState.inspectorScrollTop;
  }
}

function setPlaybackBeat(beat, shouldRender = true) {
  state.playheadBeat = clamp(beat, 0, getTotalBeats());
  state.currentBar = getDisplayBarFromBeat(state.playheadBeat);

  if (shouldRender) {
    rerender();
    return;
  }

  syncPlaybackUI();
}

function setPlaybackBar(bar, shouldRender = true) {
  const targetBar = clamp(bar, 0, Math.max(state.project.totalBars - 1, 0));
  setPlaybackBeat(targetBar * 4, shouldRender);
}

function syncPlaybackPosition(beat) {
  const nextBar = getDisplayBarFromBeat(beat);
  state.playheadBeat = clamp(beat, 0, getTotalBeats());

  if (nextBar !== state.currentBar) {
    state.currentBar = nextBar;
    rerender();
    return;
  }

  syncPlaybackUI();
}

function syncSideColumnHeights() {
  return;
}

function rerender() {
  captureScrollPositions();
  syncDocumentLanguage(state.language, state.screen, state.project.title);
  root.innerHTML = renderApp(state);
  bindEvents();
  syncSideColumnHeights();
  restoreScrollPositions();
  syncPlaybackUI();
}

function showToast(message) {
  state.toast = message;
  clearTimeout(toastTimer);
  rerender();
  toastTimer = setTimeout(() => {
    state.toast = '';
    rerender();
  }, 2200);
}

function stopPlayback(resetBar = null) {
  state.isPlaying = false;
  player.stop();
  if (typeof resetBar === 'number') {
    setPlaybackBar(resetBar, false);
  }
}

async function startPlayback() {
  try {
    player.setInstrument(state.selectedInstrumentId);
    const started = await player.play(state.project, {
      loopEnabled: state.loopEnabled,
      selectedSectionId: state.selectedSectionId,
      startBeat: state.playheadBeat,
      lyricsOnly: state.lyricPlaybackMode === 'solo',
    });

    if (!started) {
      showToast(t(state.language, 'audioUnavailable'));
      return;
    }

    state.isPlaying = true;
    rerender();
  } catch (_error) {
    state.isPlaying = false;
    showToast(t(state.language, 'audioStartError'));
    rerender();
  }
}

function pausePlayback() {
  const beat = player.pause();
  state.isPlaying = false;
  setPlaybackBeat(beat, false);
}

async function restartPlaybackIfNeeded() {
  if (!state.isPlaying) {
    rerender();
    return;
  }

  await startPlayback();
}

function rebuildProject(presetId) {
  state.project = createProject(presetId || state.project.presetId, state.project.settings);
  state.selectedSectionId = getProjectSections(state.project)[0].id;
  state.selectedNoteId = '';
  state.playheadBeat = 0;
  state.currentBar = 0;
  state.selectedInstrumentId = resolveInstrumentId(getPreferredPreviewInstrument(state.project), state.selectedInstrumentId);
  state.hasLyrics = getProjectLyricNotes(state.project).length > 0;
  state.lyricRollEnabled = state.hasLyrics;
  state.lyricPlaybackMode = 'mix';
  stopPlayback();
}

function applyPreset(presetId) {
  state.project = createProject(presetId);
  state.selectedSectionId = getProjectSections(state.project)[0].id;
  state.selectedNoteId = '';
  state.playheadBeat = 0;
  state.currentBar = 0;
  state.selectedInstrumentId = resolveInstrumentId(getPreferredPreviewInstrument(state.project), state.selectedInstrumentId);
  state.hasLyrics = getProjectLyricNotes(state.project).length > 0;
  state.lyricRollEnabled = state.hasLyrics;
  state.lyricPlaybackMode = 'mix';
  stopPlayback();
}

function duplicateSelectedSection() {
  const sectionIndex = getProjectSections(state.project).findIndex((section) => section.id === state.selectedSectionId);
  if (sectionIndex < 0) {
    return;
  }
  showToast(t(state.language, 'duplicateToast'));
}

function applyRegeneratePreview() {
  state.activeModal = MODAL.NONE;
  showToast(t(state.language, 'regenerateToast'));
  rerender();
}

async function applyExport() {
  state.activeModal = MODAL.NONE;
  showToast(t(state.language, 'exportPreparingToast'));
  rerender();

  try {
    const wavBlob = await exportProjectToWav(state.project, state.selectedInstrumentId);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.project.title || 'song-sketch'}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t(state.language, 'exportReadyToast'));
  } catch (error) {
    console.error('Export failed:', error);
    showToast(t(state.language, 'exportFailedToast'));
  }
}

function updateSetting(name, value) {
  const numericFields = new Set(['bpm', 'phraseLength']);
  state.project.settings[name] = numericFields.has(name) ? Number(value) : value;
  if (name === 'title') {
    state.project.title = value;
    state.project.songScore.meta.title = value;
  }
  if (name === 'bpm') {
    state.project.songScore.meta.tempoBpm = Number(value);
  }
  if (name === 'key') {
    state.project.songScore.meta.key = value;
  }
  if (name === 'mood') {
    state.project.songScore.meta.mood = value;
  }
  if (name === 'style') {
    state.project.songScore.meta.genre = value;
  }
}

function getActionName(source) {
  if (!source || !source.getAttribute) {
    return '';
  }
  return source.dataset.action || source.getAttribute('data-action') || '';
}

async function handleAction(action, source) {
  if (action === 'go-home') {
    stopPlayback();
    state.screen = SCREEN.LANDING;
    state.activeModal = MODAL.NONE;
    rerender();
    return;
  }

  if (action === 'start-scratch') {
    applyPreset('mainstream-pop');
    state.project.title = t(state.language, 'untitledSong');
    state.project.settings.title = t(state.language, 'untitledSong');
    state.project.songScore.meta.title = t(state.language, 'untitledSong');
    state.screen = SCREEN.WORKSPACE;
    rerender();
    return;
  }

  if (action === 'set-language') {
    state.language = source.dataset.language;
    persistLanguage(state.language);
    rerender();
    return;
  }

  if (action === 'open-preset' || action === 'apply-preset') {
    applyPreset(source.dataset.presetId);
    state.screen = SCREEN.WORKSPACE;
    rerender();
    return;
  }

  if (action === 'generate-song') {
    rebuildProject(state.project.presetId);
    state.screen = SCREEN.WORKSPACE;
    showToast(t(state.language, 'generateToast'));
    rerender();
    return;
  }

  if (action === 'select-section') {
    state.selectedSectionId = source.dataset.sectionId;
    state.selectedNoteId = '';
    const section = getProjectSections(state.project).find((item) => item.id === state.selectedSectionId);
    if (section) {
      setPlaybackBar(section.startBar, false);
    }
    await restartPlaybackIfNeeded();
    return;
  }

  if (action === 'select-note') {
    state.selectedNoteId = source.dataset.noteId;
    rerender();
    return;
  }

  if (action === 'toggle-play') {
    if (state.isPlaying) {
      pausePlayback();
      rerender();
    } else {
      await startPlayback();
    }
    return;
  }

  if (action === 'stop-playback') {
    stopPlayback(0);
    rerender();
    return;
  }

  if (action === 'toggle-loop') {
    state.loopEnabled = !state.loopEnabled;
    await restartPlaybackIfNeeded();
    if (!state.isPlaying) {
      rerender();
    }
    return;
  }

  if (action === 'toggle-lyric-roll') {
    state.lyricRollEnabled = !state.lyricRollEnabled;
    rerender();
    return;
  }

  if (action === 'toggle-lyrics-solo') {
    state.lyricPlaybackMode = state.lyricPlaybackMode === 'solo' ? 'mix' : 'solo';
    await restartPlaybackIfNeeded();
    if (!state.isPlaying) {
      rerender();
    }
    return;
  }

  if (action === 'select-instrument') {
    state.selectedInstrumentId = source.value;
    state.project.songScore.renderHints = state.project.songScore.renderHints || {};
    state.project.songScore.renderHints.preferredPreviewInstrument = state.selectedInstrumentId;
    player.setInstrument(state.selectedInstrumentId);
    await restartPlaybackIfNeeded();
    if (!state.isPlaying) {
      rerender();
    }
    return;
  }

  if (action === 'select-track-instrument') {
    const trackId = source.dataset.trackId;
    if (!trackId) {
      return;
    }

    state.project.songScore.renderHints = state.project.songScore.renderHints || {};
    state.project.songScore.renderHints.defaultInstruments = state.project.songScore.renderHints.defaultInstruments || {};

    if (source.value) {
      state.project.songScore.renderHints.defaultInstruments[trackId] = source.value;
    } else {
      delete state.project.songScore.renderHints.defaultInstruments[trackId];
    }

    await restartPlaybackIfNeeded();
    if (!state.isPlaying) {
      rerender();
    }
    return;
  }

  if (action === 'open-regenerate') {
    state.activeModal = MODAL.REGENERATE;
    rerender();
    return;
  }

  if (action === 'open-export') {
    state.activeModal = MODAL.EXPORT;
    rerender();
    return;
  }

  if (action === 'close-modal') {
    state.activeModal = MODAL.NONE;
    rerender();
    return;
  }

  if (action === 'apply-regenerate') {
    applyRegeneratePreview();
    return;
  }

  if (action === 'apply-export') {
    await applyExport();
    return;
  }

  if (action === 'duplicate-section') {
    duplicateSelectedSection();
    return;
  }

  if (action === 'jump-bar') {
    setPlaybackBar(Number(source.dataset.barIndex || 0), false);
    await restartPlaybackIfNeeded();
    if (!state.isPlaying) {
      rerender();
    }
  }
}

function getLaneResizeHeight(target, nextHeight) {
  const limits = {
    timeline: { min: 120, max: 320 },
    chords: { min: 72, max: 220 },
    lyrics: { min: 92, max: 260 },
    piano: { min: 240, max: 900 },
  };

  const range = limits[target];
  if (!range) {
    return null;
  }

  return clamp(Math.round(nextHeight), range.min, range.max);
}

function applyLaneResize(target, nextHeight, { live = false } = {}) {
  const resolvedHeight = getLaneResizeHeight(target, nextHeight);
  if (resolvedHeight == null) {
    return;
  }

  state.laneHeights[target] = resolvedHeight;

  if (live) {
    const panel = root.querySelector(`[data-panel-target="${target}"]`);
    if (panel) {
      panel.style.setProperty('--panel-height', `${resolvedHeight}px`);
    }
    syncSideColumnHeights();
    return;
  }

  rerender();
}

function bindResizeHandles() {
  root.querySelectorAll('[data-resize-target]').forEach((handle) => {
    handle.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const target = event.currentTarget.dataset.resizeTarget;
      uiState.activeResize = {
        target,
        startY: event.clientY,
        startHeight: state.laneHeights[target],
      };
      event.currentTarget.classList.add('panel-edge-resizer--active');
    });
  });

  if (!window.__songCreatorResizeBound) {
    const stopResize = () => {
      uiState.activeResize = null;
      root.querySelectorAll('.panel-edge-resizer--active').forEach((element) => {
        element.classList.remove('panel-edge-resizer--active');
      });
    };

    window.addEventListener('mousemove', (event) => {
      if (!uiState.activeResize) {
        return;
      }
      const delta = event.clientY - uiState.activeResize.startY;
      applyLaneResize(uiState.activeResize.target, uiState.activeResize.startHeight + delta, { live: true });
    });

    window.addEventListener('mouseup', stopResize);
    window.addEventListener('mouseleave', stopResize);
    window.__songCreatorResizeBound = true;
  }
}

function bindEvents() {
  bindResizeHandles();

  const arrangementScrolls = [...root.querySelectorAll('[data-arrangement-scroll]')];
  arrangementScrolls.forEach((element) => {
    element.addEventListener(
      'scroll',
      (event) => {
        const source = event.currentTarget;
        if (scrollSyncLocked) {
          return;
        }

        scrollSyncLocked = true;
        uiState.arrangementScrollLeft = source.scrollLeft;
        arrangementScrolls.forEach((target) => {
          if (target !== source && target.scrollLeft !== source.scrollLeft) {
            target.scrollLeft = source.scrollLeft;
          }
        });

        if (source.matches('[data-piano-scroll]')) {
          uiState.pianoScrollTop = source.scrollTop;
        }

        scrollSyncLocked = false;
      },
      { passive: true },
    );
  });

  const sidebarScroll = root.querySelector('[data-sidebar-scroll]');
  if (sidebarScroll) {
    sidebarScroll.addEventListener(
      'scroll',
      (event) => {
        uiState.sidebarScrollTop = event.currentTarget.scrollTop;
      },
      { passive: true },
    );
  }

  const inspectorScroll = root.querySelector('[data-inspector-scroll]');
  if (inspectorScroll) {
    inspectorScroll.addEventListener(
      'scroll',
      (event) => {
        uiState.inspectorScrollTop = event.currentTarget.scrollTop;
      },
      { passive: true },
    );
  }

  if (!root.dataset.actionDelegateBound) {
    root.dataset.actionDelegateBound = '1';
    root.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const actionable = target.closest('[data-action]');
      if (!actionable || !root.contains(actionable)) {
        return;
      }
      if (actionable.tagName === 'SELECT') {
        return;
      }
      if (actionable.matches('input[type="range"]')) {
        return;
      }
      if (
        actionable.classList.contains('modal-backdrop') &&
        target !== actionable &&
        target.closest('.modal-card')
      ) {
        return;
      }
      const action = getActionName(actionable);
      if (!action) {
        return;
      }
      void handleAction(action, actionable).catch((err) => {
        console.error('handleAction', action, err);
        showToast(t(state.language, 'audioStartError'));
      });
    });
  }

  root.querySelectorAll('select[data-action]').forEach((element) => {
    element.addEventListener('change', (event) => {
      const source = event.currentTarget;
      handleAction(source.dataset.action, source);
    });
  });

  root.querySelectorAll('[data-setting]').forEach((element) => {
    element.addEventListener('input', (event) => {
      const source = event.currentTarget;
      updateSetting(source.dataset.setting, source.value);
    });
    element.addEventListener('change', (event) => {
      const source = event.currentTarget;
      updateSetting(source.dataset.setting, source.value);
    });
  });

  const slider = root.querySelector('[data-action="scrub"]');
  if (slider) {
    slider.addEventListener('input', (event) => {
      const wasPlaying = state.isPlaying;
      if (state.isPlaying) {
        pausePlayback();
      }
      setPlaybackBar(Number(event.currentTarget.value), false);
      if (wasPlaying) {
        rerender();
        return;
      }
      syncPlaybackUI();
    });
    slider.addEventListener('change', () => {
      rerender();
    });
  }
}

window.addEventListener('beforeunload', () => {
  stopPlayback();
  player.dispose();
});

rerender();
