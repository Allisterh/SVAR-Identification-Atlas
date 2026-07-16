import { methodList } from './data-utils.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function atlasSteps() {
  const shortLabels = {
    'independent-shocks': 'Indep. shocks',
    heteroskedasticity: 'Heterosked.',
  };
  return [
    { id: 'setup', label: 'Setup', href: 'index.html' },
    ...methodList.map((method) => ({
      id: method.id,
      label: method.label,
      shortLabel: shortLabels[method.id] ?? method.label,
      href: `method.html?method=${method.id}`,
    })),
  ];
}

export function stepIndex(stepId) {
  const steps = atlasSteps();
  const index = steps.findIndex((step) => step.id === stepId);
  return index >= 0 ? index : 0;
}

export function adjacentAtlasSteps(stepId) {
  const steps = atlasSteps();
  const index = stepIndex(stepId);
  return {
    index,
    total: steps.length,
    current: steps[index],
    prev: steps[index - 1] ?? null,
    next: steps[index + 1] ?? null,
  };
}

export function renderAtlasTimeline(mountId, currentStepId) {
  const mount = document.getElementById(mountId);
  if (!mount) {
    return;
  }
  const steps = atlasSteps();
  const currentIndex = stepIndex(currentStepId);
  const current = steps[currentIndex];
  const next = steps[currentIndex + 1] ?? null;
  const listId = `${mountId}-list`;
  mount.innerHTML = `
    <button class="atlas-timeline__toggle" type="button" aria-expanded="false" aria-controls="${escapeHtml(listId)}">
      <span>Atlas sequence</span>
      <strong>${escapeHtml(current.label)}</strong>
      ${next ? `<em>Next: ${escapeHtml(next.label)}</em>` : '<em>End of sequence</em>'}
    </button>
    <ol id="${escapeHtml(listId)}" class="atlas-timeline__list">
      ${steps
        .map((step, index) => {
          const distance = Math.abs(index - currentIndex);
          const classes = [
            'atlas-timeline__step',
            index === currentIndex ? 'is-active' : '',
            index === currentIndex - 1 ? 'is-prev' : '',
            index === currentIndex + 1 ? 'is-next' : '',
            distance > 1 ? 'is-dimmed' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return `
            <li>
              <a class="${classes}" href="${escapeHtml(step.href)}" aria-label="Step ${index + 1}: ${escapeHtml(step.label)}" ${index === currentIndex ? 'aria-current="page"' : ''}>
                <span class="atlas-timeline__number">${index + 1}</span>
                <span class="atlas-timeline__label" aria-hidden="true">${escapeHtml(step.shortLabel ?? step.label)}</span>
              </a>
            </li>`;
        })
        .join('')}
    </ol>`;
  const toggle = mount.querySelector('.atlas-timeline__toggle');
  toggle?.addEventListener('click', () => {
    const isOpen = mount.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  mount.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mount.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

export function renderAtlasNextCard(mountId, currentStepId) {
  const mount = document.getElementById(mountId);
  if (!mount) {
    return;
  }
  const { index, total, current, next } = adjacentAtlasSteps(currentStepId);
  if (!next) {
    mount.innerHTML = `
      <div class="atlas-next-card__content">
        <span class="section-eyebrow">Sequence complete</span>
        <h2>End of the Atlas sequence.</h2>
        <p>You have reached the last identification page in the one-dimensional menu. Return to the setup page to restart the sequence or compare methods from the overview.</p>
      </div>
      <a class="button button--secondary" href="index.html">Back to setup</a>`;
    return;
  }
  const nextMethod = methodList.find((method) => method.id === next.id);
  const summary =
    nextMethod?.summary ??
    (next.id === 'setup'
      ? 'Start with the data, reduced-form VAR, rotation grid, and shared Matlab setup.'
      : 'Continue through the next Atlas page.');
  mount.innerHTML = `
    <div class="atlas-next-card__content">
      <span class="section-eyebrow">Next page</span>
      <h2>${escapeHtml(next.label)}</h2>
      <p>${escapeHtml(summary)}</p>
      <small>Step ${index + 2} of ${total}, after ${escapeHtml(current.label)}.</small>
    </div>
    <a class="button button--primary" href="${escapeHtml(next.href)}">Open next page</a>`;
}
