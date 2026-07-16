import { typeset } from './bootstrap.js';

function resolveElement(target) {
  return typeof target === 'string' ? document.getElementById(target) : target;
}

async function setRenderedHtml(target, html) {
  const element = resolveElement(target);
  if (!element) {
    return null;
  }

  element.innerHTML = html;
  await typeset(element);
  return element;
}

export async function renderLatex(target, latex, displayMode = true) {
  const element = resolveElement(target);
  if (!element) {
    return;
  }

  element.innerHTML = displayMode ? `$$${latex}$$` : `\\(${latex}\\)`;
  await typeset(element);
}

export async function renderGuideBlock(target, config) {
  const { summary, items = [], focus = '' } = config;

  const html = `
    <div class="guide-block">
      <p class="guide-block__summary">${summary}</p>
      ${
        items.length === 0
          ? ''
          : `<div class="guide-block__grid">
              ${items
                .map(
                  (item) => `
                    <div class="guide-block__item">
                      <span class="guide-block__label">${item.label}</span>
                      <p>${item.text}</p>
                    </div>`
                )
                .join('')}
            </div>`
      }
      ${focus ? `<p class="guide-block__focus"><strong>Look for:</strong> ${focus}</p>` : ''}
    </div>`;

  await setRenderedHtml(target, html);
}

export async function renderScalarMetrics(target, title, items) {
  const element = resolveElement(target);
  if (!element) {
    return;
  }

  element.innerHTML = `
    <div class="metric-card metric-card--stack">
      <div class="metric-card__header">
        <h4>${title}</h4>
      </div>
      <div class="stat-grid">
        ${items
          .map(
            (item) => `
              <div class="stat-chip">
                <span class="stat-chip__label">${item.label}</span>
                <strong class="stat-chip__value">${item.value}</strong>
              </div>`
          )
          .join('')}
      </div>
    </div>`;
}
