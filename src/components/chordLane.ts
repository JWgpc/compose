import { formatBarLabel, t } from '../i18n.ts';
import { getProjectChordBars, getProjectSections } from '../songscore/adapters.ts';
import { sectionColor } from '../utils.ts';
import { BAR_WIDTH, getMusicalGridWidth, getWorkstationContentWidth } from './workstationGrid.ts';

export function renderChordLane(state) {
  const lang = state.language;
  const totalBars = state.project.totalBars;
  const sectionById = Object.fromEntries(getProjectSections(state.project).map((section) => [section.id, section]));
  const contentWidth = getWorkstationContentWidth(totalBars);
  const musicalWidth = getMusicalGridWidth(totalBars);
  const bars = getProjectChordBars(state.project)
    .map((bar) => {
      const section = sectionById[bar.sectionId] || getProjectSections(state.project)[0];
      const active = state.currentBar === bar.barIndex;
      return `
        <button
          class="chord-cell ${active ? 'chord-cell--active' : ''}"
          data-action="jump-bar"
          data-bar-index="${bar.barIndex}"
          style="width:${BAR_WIDTH}px;--section-accent:${sectionColor(section.kind)}"
        >
          <span>${bar.chord}</span>
          <small>${formatBarLabel(lang, bar.barIndex)}</small>
        </button>
      `;
    })
    .join('');

  return `
    <section class="center-panel glass-panel center-panel--compact chord-panel">
      <div class="center-panel__header compact-header">
        <div>
          <span class="eyebrow">${t(lang, 'chordLane')}</span>
          <h3>${t(lang, 'harmonicPlan')}</h3>
        </div>
        <span class="chip chip-muted">${t(lang, 'editableMockLane')}</span>
      </div>
      <p class="helper-text helper-text--tight">${t(lang, 'chordLaneHint')}</p>
      <div class="workstation-lane-scroll" data-arrangement-scroll>
        <div class="workstation-lane-content" style="width:${contentWidth}px">
          <div class="workstation-lane-gutter" aria-hidden="true"></div>
          <div class="chord-lane" style="width:${musicalWidth}px">${bars}</div>
        </div>
      </div>
    </section>
  `;
}
