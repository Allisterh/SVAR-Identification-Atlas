import { createRotationControl } from './controls.js?v=20260519-cockpit3';
import { candidates, methodObjectives, setupData } from './data/identification-atlas-data.js';
import {
  IRF_SPECS,
  allIrfBaseline,
  irfDomains,
  irfSpecWithMeta,
  methodList,
  selectedHighlight,
  selectedOrAcceptedIndex,
} from './data-utils.js';
import { matrixHtml, mathHtml } from './formulas.js?v=20260719-source-gate2';
import {
  drawIrfCloud,
  drawLineChart,
  drawObjectiveChart,
  drawScatterChart,
  rgba,
  theme,
  zScores,
} from './plotting.js';
import methodContentById from './methods/index.js?v=20260719-source-gate2';
import { renderMethodCardShell } from './methods/card-shell.js?v=20260719-source-gate2';

const methodStates = new Map();
const controls = new Map();
const hovers = new Map();

function candidateAngles() {
  return candidates.map((candidate) => Number(candidate.angleDegrees));
}

function angleLabels() {
  return candidates.map((candidate) => `${Number(candidate.angleDegrees).toFixed(1)} deg`);
}

function stateFor(methodId) {
  if (!methodStates.has(methodId)) {
    methodStates.set(methodId, {
      index: selectedOrAcceptedIndex(methodId),
      mode: 'all',
      initialized: false,
    });
  }
  return methodStates.get(methodId);
}

function hoverFor(key) {
  if (!hovers.has(key)) {
    hovers.set(key, { index: null });
  }
  return hovers.get(key);
}

function methodCardId(methodId) {
  return `method-card-${methodId}`;
}

function canvasId(methodId, name) {
  return `method-${methodId}-${name}`;
}

function criterionMetricLabel(method) {
  if (method.selectionMode === 'set') {
    return 'Violation count';
  }
  if (method.id === 'max-share') {
    return 'Loss (1 - share)';
  }
  return 'Criterion value';
}

function objectiveDirectionHtml(method, objective) {
  if (method.selectionMode === 'set') {
    return '<p class="objective-direction"><strong>Rule:</strong> filter rotations; zero loss is accepted and positive loss is a violation.</p>';
  }

  if (method.id === 'max-share') {
    return '<p class="objective-direction"><strong>Direction:</strong> minimize <span class="math-token">1 - FEVD share</span>, equivalently maximize the FEVD share.</p>';
  }

  const direction = objective.direction === 'maximize' ? 'maximize' : 'minimize';
  return `<p class="objective-direction"><strong>Direction:</strong> ${direction} this criterion over the 100-candidate grid.</p>`;
}

function criterionFocus(methodId) {
  const focus = {
    recursive: {
      cells: [[0, 1]],
      label: `${mathHtml('b<sub>12</sub>(&theta;)')}: stock shock impact on the interest-rate residual`,
    },
    sign: {
      cells: [[1, 0]],
      label: `${mathHtml('b<sub>21</sub>(&theta;)')}: policy shock impact on the S&P 500 residual`,
    },
    'long-run': {
      cells: [[0, 0], [1, 0]],
      label: 'Policy-shock column: the long-run restriction is imposed on dynamic responses to this shock.',
    },
    proxy: {
      cells: [[0, 0], [1, 0]],
      label: 'Policy-shock column: the proxy is treated as information about this target shock.',
    },
    'max-share': {
      cells: [[0, 0]],
      label: `${mathHtml('b<sub>11</sub>(&theta;)')}: the impact starting point for the rate response to a policy shock.`,
    },
  };
  return focus[methodId] ?? {
    cells: [],
    label: 'No single impact entry identifies this method; the full recovered-shock diagnostic matters.',
  };
}

function criterionMatrixHtml(methodId, index) {
  if (methodId !== 'recursive' && methodId !== 'sign') {
    return '';
  }
  const focus = criterionFocus(methodId);
  const focused = new Set(focus.cells.map(([row, col]) => `${row}-${col}`));
  const candidate = candidates[index];
  const rows = candidate.impactMatrix
    .map(
      (row, rowIndex) => `
        <tr>
          ${row
            .map((value, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const className = focused.has(key)
                ? 'criterion-matrix__cell criterion-matrix__cell--focus'
                : focus.cells.length
                  ? 'criterion-matrix__cell criterion-matrix__cell--dim'
                  : 'criterion-matrix__cell';
              return `<td class="${className}">${Number(value).toFixed(3)}</td>`;
            })
            .join('')}
        </tr>`
    )
    .join('');

  return `
    <div class="criterion-matrix-card">
      <span class="criterion-matrix-card__label">Current ${mathHtml('B(&theta;)')}</span>
      <div class="criterion-matrix-card__body">
        <span class="criterion-matrix-card__lhs">${mathHtml('B(&theta;)')} =</span>
        <span class="matrix-shell criterion-matrix" role="img" aria-label="Current impact matrix">
          <span class="matrix-shell__bracket matrix-shell__bracket--left" aria-hidden="true"></span>
          <table aria-hidden="true"><tbody>${rows}</tbody></table>
          <span class="matrix-shell__bracket matrix-shell__bracket--right" aria-hidden="true"></span>
        </span>
      </div>
      <p>${focus.label}</p>
    </div>`;
}

function objectiveStatusHtml(methodId, index) {
  const method = methodList.find((item) => item.id === methodId);
  const objective = methodObjectives[methodId];
  const accepted = objective.accepted?.[index];
  const currentValue = Number(objective.values[index]).toPrecision(4);
  const metricLabel = method.selectionMode === 'set' ? 'Violation loss at current rotation' : 'L(&theta;) at current rotation';
  const parts = [
    `<span><strong>${metricLabel}:</strong> <span class="math-token">${currentValue}</span></span>`,
  ];

  if (accepted !== null && accepted !== undefined) {
    const acceptedCount = objective.accepted?.filter(Boolean).length ?? 0;
    parts.push(`<span><strong>Status:</strong> ${accepted ? 'accepted, zero violation' : 'rejected, positive violation'}</span>`);
    parts.push(`<span><strong>Accepted rotations:</strong> ${acceptedCount} of ${objective.values.length}</span>`);
  } else if (Number.isInteger(objective.selectedIndex)) {
    parts.push(
      `<span><strong>Grid optimum:</strong> ${
        index === objective.selectedIndex
          ? 'this is the chosen candidate'
          : `Candidate ${String(objective.selectedIndex).padStart(2, '0')}`
      }</span>`
    );
  }

  if (methodId === 'narrative') {
    const shock = objective.october2008Shocks?.[index] ?? [NaN, NaN];
    parts.push(
      `<span class="objective-status__stack">
        <strong>October 2008 recovered shocks:</strong>
        <span>${mathHtml('e<sub>policy, Oct 2008</sub>(&theta;)')} = ${Number(shock[0]).toFixed(3)}</span>
        <span>${mathHtml('e<sub>stock, Oct 2008</sub>(&theta;)')} = ${Number(shock[1]).toFixed(3)}</span>
      </span>`
    );
  }

  return `
    <div class="objective-status objective-status--summary">
      ${parts.join('')}
    </div>`;
}

function updateObjectiveStatus(method, state) {
  const mount = document.getElementById(canvasId(method.id, 'objective-status'));
  if (mount) {
    mount.innerHTML = objectiveStatusHtml(method.id, state.index);
  }
  const matrixMount = document.getElementById(canvasId(method.id, 'criterion-matrix'));
  if (matrixMount) {
    matrixMount.innerHTML = criterionMatrixHtml(method.id, state.index);
  }
}

export function renderMethodLinks(mountId, options = {}) {
  const mount = typeof mountId === 'string' ? document.getElementById(mountId) : mountId;
  if (!mount) {
    return;
  }
  const links = methodList
    .map((method, index) => {
      const href = options.useMethodPages ? `method.html?method=${method.id}` : `#${methodCardId(method.id)}`;
      const label = options.numbered ? `<span class="method-link-list__index">${index + 1}</span>${method.label}` : method.label;
      return `<a href="${href}">${label}</a>`;
    })
    .join('');
  mount.innerHTML = `<nav class="${options.className ?? 'method-link-list'}" aria-label="${options.label ?? 'Identification methods'}">${links}</nav>`;
  mount.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (options.useMethodPages) {
        return;
      }
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) {
        return;
      }
      event.preventDefault();
      const method = methodList.find((item) => methodCardId(item.id) === id);
      if (method) {
        initializeCard(method);
        target.classList.add('is-visible');
      }
      const offset = Math.min(96, window.innerHeight * 0.12);
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
  });
}

function renderCards(mount) {
  mount.innerHTML = methodList
    .map((method) => {
      const content = methodContentById[method.id];
      const state = stateFor(method.id);
      return renderMethodCardShell({
        method,
        content,
        state,
        cardId: methodCardId(method.id),
        objectiveDirectionHtml: objectiveDirectionHtml(method, methodObjectives[method.id]),
        objectiveStatusHtml: objectiveStatusHtml(method.id, state.index),
        controlId: canvasId(method.id, 'control'),
        objectiveCanvasId: canvasId(method.id, 'objective'),
        extraCanvasId: canvasId(method.id, 'extra'),
        objectiveStatusId: canvasId(method.id, 'objective-status'),
        criterionMatrixId: canvasId(method.id, 'criterion-matrix'),
        criterionMatrixHtml: criterionMatrixHtml(method.id, state.index),
        irfSpecs: IRF_SPECS,
        canvasId: (name) => canvasId(method.id, name),
      });
    })
    .join('');
}

function currentShockPoints(index, color = null) {
  return setupData.rotationCandidates[index].recoveredShocks.map((row, rowIndex) => ({
    x: row[0],
    y: row[1],
    label: setupData.reducedFormShocks[rowIndex]?.date,
    color,
  }));
}

function drawExtraPlot(methodId, index) {
  const candidate = candidates[index];
  const dates = setupData.reducedFormShocks.map((row) => row.date);
  const content = methodContentById[methodId];

  if (methodId === 'recursive' || methodId === 'sign') {
    const key = methodId === 'recursive' ? [0, 1] : [1, 0];
    drawLineChart(canvasId(methodId, 'extra'), {
      title: content.extra,
      subtitle: methodId === 'recursive' ? 'The forbidden impact entry is minimized.' : 'Negative impact responses satisfy the sign restriction.',
      xLabel: 'Rotation angle',
      yLabel: 'Impact entry',
      labels: angleLabels(),
      currentIndex: index,
      currentLabel: 'current rotation',
      series: [
        {
          label: methodId === 'recursive' ? 'b12 entry' : 'b21 entry',
          values: candidates.map((item) => item.impactMatrix[key[0]][key[1]]),
          color: theme('--accent-strong', '#0369a1'),
          width: 2.2,
        },
      ],
    }, hoverFor(`${methodId}-extra`));
    return;
  }

  if (methodId === 'narrative') {
    const shocks = setupData.rotationCandidates[index].recoveredShocks;
    const narrativeIndex = setupData.varSummary.narrativeIndex;
    drawLineChart(canvasId(methodId, 'extra'), {
      title: 'Recovered candidate shocks around the narrative date',
      subtitle: 'October 2008 is marked while the recovered shock paths change with the rotation.',
      xLabel: 'Date',
      yLabel: 'Shock value',
      labels: dates,
      markers: [
        {
          index: narrativeIndex,
          label: 'October 2008',
          color: theme('--accent-warm', '#f97316'),
          width: 2.2,
        },
      ],
      series: [
        { label: 'Candidate policy shock', values: shocks.map((row) => row[0]), color: theme('--accent-strong', '#0369a1'), width: 1.8 },
        { label: 'Candidate stock shock', values: shocks.map((row) => row[1]), color: theme('--accent-warm', '#f97316'), width: 1.8 },
      ],
    }, hoverFor(`${methodId}-extra`));
    return;
  }

  if (methodId === 'long-run') {
    drawLineChart(canvasId(methodId, 'extra'), {
      title: 'Cumulative S&P 500 response',
      subtitle: 'The objective uses the final cumulative value over the displayed 24 horizons.',
      xLabel: 'Horizon',
      yLabel: 'Cumulative response',
      labels: candidate.helpers.cumulativeSp500OnRate.map((_, horizon) => String(horizon)),
      includeZero: true,
      forceZeroLine: true,
      series: [
        {
          label: 'Cumulative response',
          values: candidate.helpers.cumulativeSp500OnRate,
          color: theme('--accent-strong', '#0369a1'),
          width: 2.4,
        },
      ],
    }, hoverFor(`${methodId}-extra`));
    return;
  }

  if (methodId === 'proxy') {
    const overlap = setupData.proxyOverlap;
    const shocks = setupData.rotationCandidates[index].recoveredShocks;
    drawLineChart(canvasId(methodId, 'extra'), {
      title: 'Proxy overlap sample',
      subtitle: 'The objective compares the proxy with the non-target recovered shock.',
      xLabel: 'Date',
      yLabel: 'Standardized value',
      labels: overlap.map((row) => row.date),
      series: [
        {
          label: 'Proxy series',
          values: zScores(overlap.map((row) => row.proxy)),
          rawValues: overlap.map((row) => row.proxy),
          color: theme('--accent-warm', '#f97316'),
          width: 2,
        },
        {
          label: 'Candidate non-target shock',
          values: zScores(overlap.map((row) => shocks[row.residualIndex][1])),
          rawValues: overlap.map((row) => shocks[row.residualIndex][1]),
          color: theme('--accent-strong', '#0369a1'),
          width: 2,
        },
      ],
    }, hoverFor(`${methodId}-extra`));
    return;
  }

  if (methodId === 'max-share') {
    drawLineChart(canvasId(methodId, 'extra'), {
      title: 'Rate FEVD share',
      subtitle: 'Higher is better, so the displayed loss is 1 minus this share.',
      xLabel: 'Rotation angle',
      yLabel: 'Share',
      labels: angleLabels(),
      currentIndex: index,
      currentLabel: 'current rotation',
      series: [
        {
          label: 'FEVD share',
          values: candidates.map((item) => item.diagnostics.rateFevdShare),
          color: theme('--success', '#14b8a6'),
          width: 2.2,
        },
      ],
    }, hoverFor(`${methodId}-extra`));
    return;
  }

  if (methodId === 'heteroskedasticity') {
    const midpoint = Math.floor(setupData.reducedFormShocks.length / 2);
    drawScatterChart(canvasId(methodId, 'extra'), {
      title: 'Recovered shocks by regime',
      subtitle: 'Blue: early sample. Orange: late sample.',
      xLabel: 'Candidate policy shock',
      yLabel: 'Candidate stock shock',
      points: currentShockPoints(index).map((point, pointIndex) => ({
        ...point,
        color: pointIndex < midpoint ? rgba(theme('--accent-strong', '#0369a1'), 0.42) : rgba(theme('--accent-warm', '#f97316'), 0.46),
      })),
      radius: 2.1,
    }, hoverFor(`${methodId}-extra`));
    return;
  }

  drawScatterChart(canvasId(methodId, 'extra'), {
    title: 'Recovered-shock scatter',
    subtitle: 'Independence asks for more than zero correlation.',
    xLabel: 'Candidate policy shock',
    yLabel: 'Candidate stock shock',
    points: currentShockPoints(index, rgba(theme('--accent-strong', '#0369a1'), 0.34)),
    radius: 2.1,
  }, hoverFor(`${methodId}-extra`));
}

function drawMethod(method) {
  const state = stateFor(method.id);
  const objective = methodObjectives[method.id];
  const content = methodContentById[method.id];

  updateObjectiveStatus(method, state);
  drawObjectiveChart(canvasId(method.id, 'objective'), {
    title: content.plotTitle,
    subtitle: objective.description,
    yLabel: criterionMetricLabel(method),
    values: objective.values,
    accepted: objective.accepted,
    min: objective.min,
    max: objective.max,
    selectedIndex: objective.selectedIndex,
    currentIndex: state.index,
    currentLabel: 'current rotation',
    labels: angleLabels(),
  }, hoverFor(`${method.id}-objective`));

  drawExtraPlot(method.id, state.index);

  IRF_SPECS.forEach((spec) => {
    const fullSpec = irfSpecWithMeta(spec);
    drawIrfCloud(canvasId(method.id, spec.canvasSuffix), fullSpec, {
      yDomain: irfDomains[spec.key],
      subtitle: state.mode === 'all' ? 'Loss-colored rotations, current rotation highlighted.' : 'Filtered or chosen display.',
      baseline: allIrfBaseline(method.id, state.mode).map((item) => ({
        series: item.candidate.irfs[spec.key],
        color: item.color,
        width: item.width,
      })),
      highlight: selectedHighlight(method.id, state.index).map((item) => ({
        series: item.candidate.irfs[spec.key],
        color: item.color,
        width: item.width,
      })),
    });
  });
}

function initializeCard(method) {
  const state = stateFor(method.id);
  if (!controls.has(method.id)) {
    const control = createRotationControl(canvasId(method.id, 'control'), {
      label: `${method.label}: rotate the admissible solution`,
      count: candidates.length,
      angles: candidateAngles(),
      initialIndex: state.index,
      renderDetails: (index) =>
        matrixHtml(candidates[index].impactMatrix, candidates[index].label, {
          labelHtml: candidates[index].label,
        }),
      onChange: (index) => {
        state.index = index;
        drawMethod(method);
      },
    });
    controls.set(method.id, control);
  }
  state.initialized = true;
  drawMethod(method);
}

function bindModeButtons(mount) {
  mount.addEventListener('click', (event) => {
    const button = event.target.closest('[data-irf-mode]');
    if (!button) {
      return;
    }
    const method = methodList.find((item) => item.id === button.dataset.methodId);
    if (!method) {
      return;
    }
    const state = stateFor(method.id);
    state.mode = button.dataset.irfMode;
    button.parentElement
      ?.querySelectorAll('[data-irf-mode]')
      .forEach((sibling) => {
        const isActive = sibling === button;
        sibling.classList.toggle('is-active', isActive);
        sibling.setAttribute('aria-pressed', String(isActive));
      });
    initializeCard(method);
  });
}

function renderCardForMethod(mount, method) {
  const content = methodContentById[method.id];
  const state = stateFor(method.id);
  mount.innerHTML = renderMethodCardShell({
    method,
    content,
    state,
    cardId: methodCardId(method.id),
    objectiveDirectionHtml: objectiveDirectionHtml(method, methodObjectives[method.id]),
    objectiveStatusHtml: objectiveStatusHtml(method.id, state.index),
    controlId: canvasId(method.id, 'control'),
    objectiveCanvasId: canvasId(method.id, 'objective'),
    extraCanvasId: canvasId(method.id, 'extra'),
    objectiveStatusId: canvasId(method.id, 'objective-status'),
    criterionMatrixId: canvasId(method.id, 'criterion-matrix'),
    criterionMatrixHtml: criterionMatrixHtml(method.id, state.index),
    irfSpecs: IRF_SPECS,
    canvasId: (name) => canvasId(method.id, name),
  });
}

function initializeAllCards() {
  methodList.forEach(initializeCard);
}

export function renderMethodCards(jumpMountId, cardsMountId) {
  const jumpMount = document.getElementById(jumpMountId);
  const cardsMount = document.getElementById(cardsMountId);
  if (!jumpMount || !cardsMount) {
    return;
  }
  renderMethodLinks(jumpMount, { className: 'method-link-list method-link-list--section', label: 'Method sections' });
  renderCards(cardsMount);
  bindModeButtons(cardsMount);
  initializeAllCards();
}

export function renderSingleMethodPage(mountId, methodId) {
  const mount = document.getElementById(mountId);
  const method = methodList.find((item) => item.id === methodId) ?? methodList[0];
  if (!mount || !method) {
    return null;
  }
  renderCardForMethod(mount, method);
  bindModeButtons(mount);
  initializeCard(method);
  return method;
}

export function redrawInitializedMethodCards() {
  methodList.forEach((method) => {
    if (stateFor(method.id).initialized) {
      drawMethod(method);
    }
  });
}
