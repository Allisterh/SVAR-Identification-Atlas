import { createRotationControl } from './controls.js';
import { candidates, setupData } from './data/identification-atlas-data.js';
import { IRF_SPECS, irfDomains, irfSpecWithMeta, methodTableRows } from './data-utils.js';
import { matrixHtml } from './formulas.js?v=20260715-reading-system2';
import { drawIrfCloud, drawLineChart, drawScatterChart, rgba, theme, zScores } from './plotting.js';

const setupState = {
  rotationIndex: 0,
  controls: [],
  hovers: {},
};

const FEVD_HORIZONS = [1, 4, 12, 24];

function rotationPoints(index) {
  return setupData.rotationCandidates[index].recoveredShocks.map((row, pointIndex) => ({
    x: row[0],
    y: row[1],
    label: setupData.reducedFormShocks[pointIndex]?.date,
  }));
}

function reducedShockPoints() {
  return setupData.reducedFormShocks.map((row) => ({
    x: row.uRate,
    y: row.uSp500,
    label: row.date,
  }));
}

function candidateAngles() {
  return candidates.map((candidate) => Number(candidate.angleDegrees));
}

function angleLabels() {
  return candidates.map((candidate) => `${Number(candidate.angleDegrees).toFixed(1)} deg`);
}

function rotationMatrixDetails(index) {
  const candidate = candidates[index];
  return matrixHtml(candidate.impactMatrix, candidate.label, {
    labelHtml: candidate.label,
  });
}

function sumSquares(values, horizon) {
  return values.slice(0, horizon).reduce((sum, value) => sum + value ** 2, 0);
}

function rateFevdShares(candidate, requestedHorizon) {
  const policy = candidate.irfs.rateOnRate;
  const stock = candidate.irfs.rateOnSp500;
  const horizon = Math.min(requestedHorizon, policy.length, stock.length);
  const policySum = sumSquares(policy, horizon);
  const stockSum = sumSquares(stock, horizon);
  const total = policySum + stockSum;
  return {
    horizon,
    policy: total > 0 ? policySum / total : 0,
    stock: total > 0 ? stockSum / total : 0,
  };
}

function formatShare(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function renderMixingDiagram() {
  const mount = document.getElementById('setup-mixing-diagram');
  if (!mount) {
    return;
  }
  const candidate = candidates[setupState.rotationIndex];
  const entries = [
    { id: 'b11', value: candidate.impactMatrix[0][0], row: 'Rate residual', shock: 'policy shock' },
    { id: 'b12', value: candidate.impactMatrix[0][1], row: 'Rate residual', shock: 'stock-market shock' },
    { id: 'b21', value: candidate.impactMatrix[1][0], row: 'S&P 500 residual', shock: 'policy shock' },
    { id: 'b22', value: candidate.impactMatrix[1][1], row: 'S&P 500 residual', shock: 'stock-market shock' },
  ];
  const maxAbs = Math.max(0.001, ...entries.map((entry) => Math.abs(entry.value)));
  const barHtml = entries
    .map((entry) => {
      const width = Math.max(7, (Math.abs(entry.value) / maxAbs) * 100);
      const signClass = entry.value >= 0 ? 'is-positive' : 'is-negative';
      return `
        <div class="mixing-weight ${signClass}">
          <span class="mixing-weight__name">${entry.id}</span>
          <span class="mixing-weight__bar" aria-hidden="true"><i style="width: ${width.toFixed(1)}%"></i></span>
          <strong>${entry.value.toFixed(3)}</strong>
          <small>${entry.row} from ${entry.shock}</small>
        </div>`;
    })
    .join('');

  mount.innerHTML = `
    <div class="mixing-diagram__copy">
      <span class="guide-block__label">Why not an IRF to a reduced-form shock?</span>
      <p>Each reduced-form residual is a mixture of structural shocks, so a response to <span class="math-token">u<sub>rate,t</sub></span> or <span class="math-token">u<sub>S&amp;P,t</sub></span> is not a clean economic shock response.</p>
    </div>
    <div class="mixing-equations">
      <span class="math-token">u<sub>rate,t</sub> = b<sub>11</sub>(&theta;)e<sub>policy,t</sub>(&theta;) + b<sub>12</sub>(&theta;)e<sub>stock,t</sub>(&theta;)</span>
      <span class="math-token">u<sub>S&amp;P,t</sub> = b<sub>21</sub>(&theta;)e<sub>policy,t</sub>(&theta;) + b<sub>22</sub>(&theta;)e<sub>stock,t</sub>(&theta;)</span>
    </div>
    <div class="mixing-weight-grid">${barHtml}</div>`;
}

function drawFevdPlot() {
  const maxHorizon = Math.min(
    candidates[0]?.irfs.rateOnRate.length ?? 24,
    candidates[0]?.irfs.rateOnSp500.length ?? 24
  );
  drawLineChart('setup-fevd-plot', {
    title: 'Rate FEVD share across rotations',
    subtitle: `Policy-shock share of rate forecast-error variance over H = ${maxHorizon}.`,
    xLabel: 'Rotation angle',
    yLabel: 'Share',
    labels: angleLabels(),
    yDomain: { min: 0, max: 1 },
    currentIndex: setupState.rotationIndex,
    currentLabel: 'current rotation',
    series: [
      {
        label: 'Policy shock share',
        values: candidates.map((candidate) => rateFevdShares(candidate, maxHorizon).policy),
        color: theme('--accent-strong', '#0369a1'),
        width: 2.4,
      },
    ],
  }, setupState.hovers.fevd ??= { index: null });
}

function renderFevdTable() {
  const mount = document.getElementById('setup-fevd-table');
  if (!mount) {
    return;
  }
  const candidate = candidates[setupState.rotationIndex];
  const rows = FEVD_HORIZONS.map((requestedHorizon) => {
    const shares = rateFevdShares(candidate, requestedHorizon);
    return `
      <tr data-share-sum="${(shares.policy + shares.stock).toFixed(6)}">
        <td>${shares.horizon}</td>
        <td><span class="stats-table__value">${formatShare(shares.policy)}</span></td>
        <td><span class="stats-table__value">${formatShare(shares.stock)}</span></td>
      </tr>`;
  }).join('');
  mount.innerHTML = `
    <span class="guide-block__label">Current rotation table</span>
    <h4>Rate forecast-error variance shares</h4>
    <table class="stats-table fevd-table">
      <thead>
        <tr>
          <th>Horizon H</th>
          <th>Policy shock</th>
          <th>Stock shock</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="matrix-note context-note"><span class="prose-label">Table note</span>Rows sum to 100% because this bivariate teaching example has two structural shocks.</p>`;
}

function drawStaticCharts() {
  const timeSeries = setupData.timeSeries;
  const residuals = setupData.reducedFormShocks;

  drawLineChart('setup-time-series-chart', {
    title: 'Observed monthly series',
    subtitle: 'Transformed illustrative series on a common visual scale.',
    xLabel: 'Date',
    yLabel: 'Standardized value',
    labels: timeSeries.map((row) => row.date),
    series: [
      {
        label: 'Interest rate',
        values: zScores(timeSeries.map((row) => row.rate)),
        rawValues: timeSeries.map((row) => row.rate),
        color: theme('--accent-strong', '#0369a1'),
        width: 2.3,
      },
      {
        label: 'S&P 500 level',
        values: zScores(timeSeries.map((row) => row.sp500)),
        rawValues: timeSeries.map((row) => row.sp500),
        color: theme('--accent-warm', '#f97316'),
        width: 2.3,
      },
    ],
  }, setupState.hovers.timeSeries ??= { index: null });

  drawLineChart('setup-residual-chart', {
    title: 'Reduced-form VAR(4) shocks',
    subtitle: `${residuals.length} residual observations from the illustrative VAR(4).`,
    xLabel: 'Date',
    yLabel: 'Standardized residual',
    labels: residuals.map((row) => row.date),
    series: [
      {
        label: 'Rate residual',
        values: zScores(residuals.map((row) => row.uRate)),
        rawValues: residuals.map((row) => row.uRate),
        color: theme('--accent-strong', '#0369a1'),
        width: 2.2,
      },
      {
        label: 'S&P 500 residual',
        values: zScores(residuals.map((row) => row.uSp500)),
        rawValues: residuals.map((row) => row.uSp500),
        color: theme('--success', '#14b8a6'),
        width: 2.2,
      },
    ],
  }, setupState.hovers.residuals ??= { index: null });

  drawScatterChart('setup-reduced-scatter', {
    title: 'Reduced-form shocks u_t',
    subtitle: 'Each point is one reduced-form shock pair from the VAR.',
    xLabel: 'Rate residual',
    yLabel: 'S&P 500 residual',
    points: reducedShockPoints(),
    pointColor: rgba(theme('--text', '#11233d'), 0.32),
    radius: 2,
  }, setupState.hovers.reducedScatter ??= { index: null });
}

function drawRotationCharts() {
  const specByKey = Object.fromEntries(IRF_SPECS.map((spec) => [spec.key, irfSpecWithMeta(spec)]));
  const rotation = setupData.rotationCandidates[setupState.rotationIndex];

  drawScatterChart('setup-structural-scatter', {
    title: 'Recovered candidate shocks',
    subtitle: `Current rotation keeps corr(policy, stock) = ${Number(rotation.shockCorrelation).toFixed(6)}.`,
    xLabel: 'Candidate policy shock',
    yLabel: 'Candidate stock shock',
    points: rotationPoints(setupState.rotationIndex),
    pointColor: rgba(theme('--accent-strong', '#0369a1'), 0.34),
    radius: 2,
  }, setupState.hovers.structuralScatter ??= { index: null });

  renderMixingDiagram();

  Object.entries({
    rateOnRate: 'setup-irf-rate-rate',
    sp500OnRate: 'setup-irf-sp500-rate',
    rateOnSp500: 'setup-irf-rate-sp500',
    sp500OnSp500: 'setup-irf-sp500-sp500',
  }).forEach(([key, canvasId]) => {
    drawIrfCloud(canvasId, specByKey[key], {
      yDomain: irfDomains[key],
      baseline: [],
      highlight: [
        {
          series: candidates[setupState.rotationIndex].irfs[key],
          color: theme('--accent-strong', '#0369a1'),
          width: 3,
        },
      ],
    });
  });

  Object.entries({
    rateOnRate: 'setup-cloud-rate-rate',
    sp500OnRate: 'setup-cloud-sp500-rate',
    rateOnSp500: 'setup-cloud-rate-sp500',
    sp500OnSp500: 'setup-cloud-sp500-sp500',
  }).forEach(([key, canvasId]) => {
    drawIrfCloud(canvasId, specByKey[key], {
      yDomain: irfDomains[key],
      subtitle: 'Pale lines: all admissible rotations. Orange: active candidate.',
      baseline: candidates.map((candidate) => ({
        series: candidate.irfs[key],
        color: rgba(theme('--text', '#11233d'), 0.08),
        width: 0.8,
      })),
      highlight: [
        {
          series: candidates[setupState.rotationIndex].irfs[key],
          color: theme('--accent-warm', '#f97316'),
          width: 3,
        },
      ],
    });
  });

  drawFevdPlot();
  renderFevdTable();
}

function setRotation(index) {
  setupState.rotationIndex = index;
  setupState.controls.forEach((control) => {
    if (control.getIndex() !== index) {
      control.setIndex(index, false);
    }
  });
  drawRotationCharts();
}

export function renderIdentificationProblem() {
  const tableMount = document.getElementById('atlas-method-table');
  if (!tableMount) {
    return;
  }
  tableMount.innerHTML = `
    <table class="stats-table atlas-method-table">
      <thead>
        <tr>
          <th>Method</th>
          <th>Information added</th>
          <th>Atlas rule</th>
          <th>How it treats the cloud</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>${methodTableRows()}</tbody>
    </table>`;
}

export function initSetup() {
  setupState.controls = [
    createRotationControl('setup-rotation-control', {
      label: 'Rotate recovered shocks',
      count: candidates.length,
      angles: candidateAngles(),
      initialIndex: setupState.rotationIndex,
      renderDetails: rotationMatrixDetails,
      onChange: setRotation,
    }),
    createRotationControl('setup-irf-control', {
      label: 'Rotate structural IRFs',
      count: candidates.length,
      angles: candidateAngles(),
      initialIndex: setupState.rotationIndex,
      renderDetails: rotationMatrixDetails,
      onChange: setRotation,
    }),
    createRotationControl('setup-cloud-control', {
      label: 'Choose active rotation in the IRF cloud',
      count: candidates.length,
      angles: candidateAngles(),
      initialIndex: setupState.rotationIndex,
      renderDetails: rotationMatrixDetails,
      onChange: setRotation,
    }),
    createRotationControl('setup-fevd-control', {
      label: 'Rotate FEVD shares',
      count: candidates.length,
      angles: candidateAngles(),
      initialIndex: setupState.rotationIndex,
      renderDetails: rotationMatrixDetails,
      onChange: setRotation,
    }),
  ].filter(Boolean);

  drawStaticCharts();
  drawRotationCharts();
  renderIdentificationProblem();
}

export function redrawSetup() {
  drawStaticCharts();
  drawRotationCharts();
}
