export function renderMethodCardShell({
  method,
  content,
  state,
  cardId,
  objectiveDirectionHtml,
  objectiveStatusHtml,
  controlId,
  objectiveCanvasId,
  extraCanvasId,
  objectiveStatusId,
  criterionMatrixId,
  criterionMatrixHtml,
  irfSpecs,
  canvasId,
}) {
  const selectedModeLabel = method.selectionMode === 'set' ? 'Accepted rotations only' : 'Chosen candidate only';
  const methodOutputKind = method.selectionMode === 'set' ? 'accepted rotations' : 'chosen candidate';
  const summaryItems = [
    ['Assumption', content.assumptionSummary],
    ['Atlas rule', content.atlasRuleSummary],
    ['Output', content.outputSummary],
  ].filter(([, value]) => Boolean(value));
  const intuitionHtml =
    content.intuitionAssumption || content.intuitionTranslation
      ? `
        <div class="method-copy__grid">
          ${content.intuitionAssumption ? `<div><strong>Assumption</strong><p>${content.intuitionAssumption}</p></div>` : ''}
          ${content.intuitionTranslation ? `<div><strong>Atlas translation</strong><p>${content.intuitionTranslation}</p></div>` : ''}
        </div>`
      : `<p>${content.intuition}</p>`;
  const criterionIntro =
    content.criterionIntro ??
    `This section translates the identifying idea into the rotation-grid criterion used in the Atlas. The formula gives the rule, the status line evaluates the current rotation, and the two plots show how that rule changes as ${method.selectionMode === 'set' ? 'candidate rotations are accepted or rejected' : 'the rotation angle moves across the grid'}.`;
  const objectivePlotNote =
    content.objectivePlotNote ??
    `This plot traces the Atlas criterion over the sampled rotation angles. The vertical marker is the current rotation, and the highlighted point shows how the current dial setting scores under the rule.`;
  const extraPlotNote =
    content.extraPlotNote ??
    `This companion plot shows the object behind the criterion: the impact entry, shock path, proxy moment, FEVD share, or diagnostic that the rule is trying to discipline.`;
  const irfIntro =
    content.irfIntro ??
    `These four IRFs show what the same rotation rule implies dynamically. Use all-rotations mode to compare the full admissible cloud under this method's loss coloring, or switch to ${selectedModeLabel.toLowerCase()} to focus on the ${methodOutputKind}.`;
  const hasCriterionMatrix = Boolean(criterionMatrixHtml);
  const priorityKeys = Array.isArray(content.priorityIrfKeys) ? new Set(content.priorityIrfKeys) : new Set();
  const priorityIrfSpecs = priorityKeys.size ? irfSpecs.filter((spec) => priorityKeys.has(spec.key)) : irfSpecs.slice(0, 2);
  const secondaryIrfSpecs = irfSpecs.filter((spec) => !priorityIrfSpecs.includes(spec));
  const renderIrfPanels = (specs, priority = false) => specs
    .map(
      (spec) => `
        <div class="plot-card method-irf-panel ${priority ? 'method-irf-panel--priority' : ''}">
          <canvas id="${canvasId(spec.canvasSuffix)}" aria-label="${method.label}: ${spec.title}"></canvas>
        </div>`
    )
    .join('');

  return `
    <article id="${cardId}" class="method-card method-lab method-card--irfs-all" data-method-card="${method.id}" data-reveal>
      <div class="method-card__header">
        <div>
          <span class="section-eyebrow">Interactive method lab &middot; ${method.selectorType}</span>
          <h2>Test the identifying claim against the shared rotation cloud.</h2>
        </div>
      </div>

      ${
        summaryItems.length
          ? `<div class="method-summary-strip">
              ${summaryItems
                .map(
                  ([label, value]) => `
                    <div>
                      <span>${label}</span>
                      <strong>${value}</strong>
                    </div>`
                )
                .join('')}
            </div>`
          : ''
      }

      <div class="method-card__intro">
        <div class="method-copy">
          <span class="guide-block__label">Economic intuition</span>
          ${intuitionHtml}
        </div>
      </div>

      <section class="method-section method-section--criterion">
        <div class="method-section__header">
          <span class="guide-block__label">Rotation criterion</span>
          <h3>${content.criterionHeadline ?? 'Translate the identifying idea into a score over rotations.'}</h3>
          <p>${criterionIntro}</p>
        </div>

        <div class="criterion-dashboard ${hasCriterionMatrix ? '' : 'criterion-dashboard--rule-only'}">
          <div class="criterion-rule-card">
            <span class="criterion-rule-card__label">Criterion rule</span>
            <div class="criterion-rule-card__formula">${content.objective}</div>
            <div class="criterion-rule-card__note">
              ${objectiveDirectionHtml}
              ${content.detail ? `<div class="criterion-rule-card__detail">${content.detail}</div>` : ''}
            </div>
            <div id="${objectiveStatusId}">${objectiveStatusHtml}</div>
          </div>
          ${hasCriterionMatrix ? `<div id="${criterionMatrixId}">${criterionMatrixHtml}</div>` : ''}
        </div>

        ${content.chartTakeaway ? `<p class="method-chart-takeaway">${content.chartTakeaway}</p>` : ''}

        <div class="method-card__plot-grid">
          <div class="plot-card plot-card--wide">
            <canvas id="${objectiveCanvasId}" aria-label="${method.label} objective over rotation"></canvas>
            <p class="plot-card__note">${objectivePlotNote}</p>
          </div>
          <div class="plot-card plot-card--wide">
            <canvas id="${extraCanvasId}" aria-label="${content.extra}"></canvas>
            <p class="plot-card__note">${extraPlotNote}</p>
          </div>
        </div>
      </section>

      <div class="method-card__control" id="${controlId}"></div>

      <section class="method-section method-section--irfs">
        <div class="method-section__header">
          <span class="guide-block__label">Impulse responses</span>
          <h3>Read the dynamic implications of the selected rotations.</h3>
          <p>${irfIntro}</p>
        </div>

        <div class="method-card__toolbar">
          <span class="guide-block__label">IRF display</span>
          <button class="segmented-control__button ${state.mode === 'all' ? 'is-active' : ''}" type="button" aria-pressed="${state.mode === 'all'}" data-irf-mode="all" data-method-id="${method.id}">
            All rotations, loss-colored
          </button>
          <button class="segmented-control__button ${state.mode === 'selected' ? 'is-active' : ''}" type="button" aria-pressed="${state.mode === 'selected'}" data-irf-mode="selected" data-method-id="${method.id}">
            ${selectedModeLabel}
          </button>
        </div>

        <div class="setup-irf-grid method-irf-grid">
          ${renderIrfPanels(priorityIrfSpecs, true)}
        </div>
        ${secondaryIrfSpecs.length ? `
          <details class="method-secondary-irfs">
            <summary>Show two companion responses</summary>
            <div class="setup-irf-grid method-irf-grid method-irf-grid--secondary">
              ${renderIrfPanels(secondaryIrfSpecs)}
            </div>
          </details>` : ''}
      </section>
    </article>`;
}
