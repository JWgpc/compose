import { formatCount, localizeValue, t } from '../i18n.ts';
import { getProjectSections } from '../songscore/adapters.ts';
import { escapeHtml, formatBarRange, sectionColor } from '../utils.ts';
import { BAR_WIDTH, getMusicalGridWidth, getWorkstationContentWidth } from './workstationGrid.ts';

export function renderTimeline(state) {
  const lang = state.language;
  const totalBars = state.project.totalBars;
  const contentWidth = getWorkstationContentWidth(totalBars);
  const musicalWidth = getMusicalGridWidth(totalBars);
  const sectionBlocks = getProjectSections(state.project)
    .map((section) => {
      const width = section.bars * BAR_WIDTH;
      return `
        <button
          class="timeline-block ${state.selectedSectionId === section.id ? 'timeline-block--active' : ''}"
          data-action="select-section"
          data-section-id="${section.id}"
          style="width:${width}px; --section-accent:${sectionColor(section.kind)}"
        >
          <span class="timeline-block__title">${escapeHtml(localizeValue(lang, section.label))}</span>
          <span class="timeline-block__meta">${escapeHtml(formatCount(lang, section.bars, 'barsUnit'))} · ${escapeHtml(section.chords.join(' / '))}</span>
          <span class="timeline-block__range">${formatBarRange(section.startBar, section.bars)}</span>
          ${section.hasHook ? `<span class="hook-pill">${escapeHtml(t(lang, 'mainHook'))}</span>` : ''}
        </button>
      `;
    })
    .join('');

  return `
    <section class="center-panel glass-panel timeline-panel">
      <div class="center-panel__header">
        <div>
          <span class="eyebrow">${escapeHtml(t(lang, 'sectionTimeline'))}</span>
          <h3>${escapeHtml(t(lang, 'arrangementMap'))}</h3>
        </div>
        <div class="panel-actions">
          <button class="secondary-button" data-action="open-regenerate">${escapeHtml(t(lang, 'regenerateShort'))}</button>
          <button class="secondary-button" data-action="open-export">${escapeHtml(t(lang, 'exportShort'))}</button>
        </div>
      </div>
      <p class="helper-text helper-text--tight">${escapeHtml(t(lang, 'arrangementHint'))}</p>
      <div class="workstation-lane-scroll" data-arrangement-scroll>
        <div class="workstation-lane-content" style="width:${contentWidth}px">
          <div class="workstation-lane-gutter" aria-hidden="true"></div>
          <div class="timeline-row" style="width:${musicalWidth}px">${sectionBlocks}</div>
        </div>
      </div>
    </section>
  `;
}
