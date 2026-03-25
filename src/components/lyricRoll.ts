import { formatCount, localizeValue, t } from '../i18n.ts';
import { getProjectLyricNotes, getProjectSections } from '../songscore/adapters.ts';
import { sectionColor } from '../utils.ts';
import { BEAT_WIDTH, TRACK_GUTTER, getBeatOffset, getWorkstationContentWidth } from './workstationGrid.ts';

const rowHeight = 44;

export function renderLyricRoll(state) {
  const lang = state.language;
  const width = getWorkstationContentWidth(state.project.totalBars);
  const sections = getProjectSections(state.project);
  const lyricNotes = getProjectLyricNotes(state.project);
  const selectedSection = sections.find((section) => section.id === state.selectedSectionId);

  const sectionBands = sections
    .map((section) => {
      const left = section.startBar * BEAT_WIDTH * 4;
      const bandWidth = section.bars * 4 * BEAT_WIDTH;
      return `
        <div class="section-band ${selectedSection && selectedSection.id === section.id ? 'section-band--active' : ''}"
          style="left:${left}px;width:${bandWidth}px;--section-accent:${sectionColor(section.kind)}">
          <span>${localizeValue(lang, section.label)}</span>
        </div>
      `;
    })
    .join('');

  const blocks = lyricNotes
    .map((note) => {
      const left = getBeatOffset(note.startBeat);
      const widthValue = Math.max(note.duration * BEAT_WIDTH - 4, 28);
      const section = sections.find((entry) => entry.id === note.sectionId) || selectedSection || sections[0];
      return `
        <div
          class="lyric-block lyric-block--${state.lyricPlaybackMode}"
          style="left:${left}px;top:10px;width:${widthValue}px;--section-accent:${sectionColor(section.kind)}"
          title="${note.lyric}"
        >
          <span>${note.lyric}</span>
        </div>
      `;
    })
    .join('');

  const playheadLeft = getBeatOffset(state.playheadBeat);

  return `
    <section class="center-panel glass-panel lyric-panel">
      <div class="center-panel__header compact-header">
        <div>
          <span class="eyebrow">${t(lang, 'lyricRoll')}</span>
          <h3>${t(lang, 'lyricMelodyLane')}</h3>
        </div>
        <div class="toolbar-pills">
          <span class="chip">${formatCount(lang, lyricNotes.length, 'lyricUnits')}</span>
          <span class="chip ${state.lyricPlaybackMode === 'solo' ? 'chip-accent' : ''}">${state.lyricPlaybackMode === 'solo' ? t(lang, 'lyricsSolo') : t(lang, 'lyricsFollowSong')}</span>
        </div>
      </div>
      <p class="helper-text helper-text--tight">${t(lang, 'lyricRollHint')}</p>
      <div class="workstation-lane-scroll" data-arrangement-scroll>
        <div class="lyric-grid" style="width:${width}px;height:${rowHeight + 20}px;--beat-width:${BEAT_WIDTH}px;--row-height:${rowHeight}px;--track-gutter:${TRACK_GUTTER}px">
          <div class="section-bands">${sectionBands}</div>
          <div class="grid-overlay"></div>
          <div class="lyric-row-label">${t(lang, 'lyrics')}</div>
          <div class="playhead" data-playhead style="left:${playheadLeft}px"></div>
          <div class="lyric-layer">${blocks}</div>
        </div>
      </div>
    </section>
  `;
}
