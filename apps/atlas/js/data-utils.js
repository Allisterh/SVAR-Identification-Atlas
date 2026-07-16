import { candidates, methodObjectives, methods, runMeta } from './data/identification-atlas-data.js';
import { finiteDomain, objectiveColor, rgba, theme } from './plotting.js';

export const METHOD_IDS = [
  'recursive',
  'sign',
  'narrative',
  'long-run',
  'proxy',
  'max-share',
  'independent-shocks',
  'heteroskedasticity',
];

export const IRF_SPECS = [
  { key: 'rateOnRate', title: 'Rate response to monetary policy shock', yLabel: 'Rate response', canvasSuffix: 'rate-rate' },
  { key: 'sp500OnRate', title: 'S&P 500 response to monetary policy shock', yLabel: 'S&P 500 response', canvasSuffix: 'sp500-rate' },
  { key: 'rateOnSp500', title: 'Rate response to stock market shock', yLabel: 'Rate response', canvasSuffix: 'rate-sp500' },
  { key: 'sp500OnSp500', title: 'S&P 500 response to stock market shock', yLabel: 'S&P 500 response', canvasSuffix: 'sp500-sp500' },
];

export const METHOD_MAP = new Map(methods.map((method) => [method.id, method]));

export const methodList = METHOD_IDS.map((id) => METHOD_MAP.get(id)).filter(Boolean);

export const irfDomains = Object.fromEntries(
  IRF_SPECS.map((spec) => [spec.key, finiteDomain(candidates.map((candidate) => candidate.irfs[spec.key]), 0.16)])
);

export function selectedOrAcceptedIndex(methodId) {
  const objective = methodObjectives[methodId];
  if (!objective) {
    return 0;
  }
  if (Number.isInteger(objective.selectedIndex)) {
    return objective.selectedIndex;
  }
  const acceptedIndex = objective.accepted?.findIndex(Boolean);
  return acceptedIndex >= 0 ? acceptedIndex : 0;
}

export function candidateLabel(index) {
  return `Candidate ${String(index).padStart(2, '0')}`;
}

export function methodColor(methodId, index, mode = 'all') {
  const objective = methodObjectives[methodId];
  if (!objective) {
    return rgba(theme('--text', '#11233d'), 0.1);
  }
  if (mode === 'selected') {
    return index === objective.selectedIndex || objective.accepted?.[index]
      ? theme('--success', '#14b8a6')
      : rgba(theme('--text', '#11233d'), 0.04);
  }
  return objectiveColor(objective.values[index], objective.min, objective.max, objective.accepted?.[index]);
}

export function allIrfBaseline(methodId, mode) {
  const objective = methodObjectives[methodId];
  return candidates.map((candidate) => {
    const allowed =
      mode === 'all' ||
      candidate.index === objective?.selectedIndex ||
      objective?.accepted?.[candidate.index] === true;
    return {
      index: candidate.index,
      color: allowed ? methodColor(methodId, candidate.index, mode) : rgba(theme('--text', '#11233d'), 0.035),
      width: allowed ? 0.95 : 0.55,
      candidate,
    };
  });
}

export function selectedHighlight(methodId, currentIndex) {
  const objective = methodObjectives[methodId];
  const selected = Number.isInteger(objective?.selectedIndex) ? objective.selectedIndex : currentIndex;
  return [...new Set([selected, currentIndex])].map((index) => ({
    index,
    color: index === currentIndex ? theme('--accent-warm', '#f97316') : theme('--success', '#14b8a6'),
    width: index === currentIndex ? 3.2 : 2.6,
    candidate: candidates[index],
  }));
}

export function methodTableRows() {
  return methodList
    .map(
      (method) => `
        <tr>
          <td><strong>${method.label}</strong></td>
          <td>${method.variation}</td>
          <td>${method.restriction}</td>
          <td>${method.selectorType}</td>
          <td>${method.comparisonOutput}</td>
        </tr>`
    )
    .join('');
}

export function irfSpecWithMeta(spec) {
  return {
    ...spec,
    horizons: runMeta.horizons,
  };
}
