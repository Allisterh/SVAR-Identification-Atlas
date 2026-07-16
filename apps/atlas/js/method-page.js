import { bootPage } from './bootstrap.js';
import { methodList } from './data-utils.js';
import { applyAtlasFeatureVisibility, isAtlasFeatureEnabled } from './feature-flags.js?v=20260715-matlab-flag1';
import { renderSingleMethodPage, redrawInitializedMethodCards } from './method-cards.js?v=20260716-source-gate1';
import { methodLiteratureHtml, methodReadingGuideHtml } from './methods/detail-panel.js?v=20260716-source-gate1';
import methodContentById from './methods/index.js?v=20260716-source-gate1';
import { renderAtlasNextCard, renderAtlasTimeline } from './timeline.js?v=20260715-editorial-layout1';

const params = new URLSearchParams(window.location.search);
const requestedMethodId = params.get('method') ?? 'recursive';
const matlabReplicationEnabled = isAtlasFeatureEnabled('matlabReplication');

applyAtlasFeatureVisibility();

const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  loadingScreen.hidden = true;
  loadingScreen.style.display = 'none';
}

function validMethodId(methodId) {
  return methodList.some((method) => method.id === methodId) ? methodId : 'recursive';
}

function decorateMethodPage(method) {
  const content = methodContentById[method.id];
  document.title = `${method.label} - SVAR Identification Atlas`;
  document.getElementById('method-page-title').textContent = method.label;
  document.getElementById('method-page-summary').innerHTML =
    content.cardIntro ||
    content.outputSummary ||
    method.summary ||
    'One identification method applied to the shared Atlas rotation grid.';
  document.getElementById('method-page-meta').innerHTML = `
    <div class="hero-meta__stat">
      <span class="hero-meta__label">Information used</span>
      <span class="hero-meta__value">${method.variation}</span>
    </div>
    <div class="hero-meta__stat">
      <span class="hero-meta__label">Treatment of cloud</span>
      <span class="hero-meta__value">${method.selectorType}</span>
    </div>
    <div class="hero-meta__stat">
      <span class="hero-meta__label">Result</span>
      <span class="hero-meta__value">${method.comparisonOutput}</span>
    </div>`;
}

function renderMethodEditorialSections(method) {
  const content = methodContentById[method.id];
  const readingMount = document.getElementById('method-reading-root');
  const literatureMount = document.getElementById('method-literature-root');
  if (readingMount) {
    readingMount.innerHTML = methodReadingGuideHtml(method, content);
  }
  if (literatureMount) {
    literatureMount.innerHTML = methodLiteratureHtml(method, content);
  }
}

function assignMethodAnchors() {
  const assignments = [
    ['.method-card__header', 'method-overview'],
    ['.method-summary-strip', 'method-rule'],
    ['.method-card__control', 'method-rotation'],
    ['.method-section--criterion', 'method-objective'],
    ['.method-section--irfs', 'method-irfs'],
  ];
  assignments.forEach(([selector, id]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.id = id;
    }
  });
}

function initMobileRotationToggle() {
  const control = document.querySelector('.method-card__control');
  if (!control) {
    return;
  }
  const rotationControl = control.querySelector('.rotation-control');
  if (rotationControl) {
    rotationControl.id = 'method-rotation-control';
  }
  control.classList.add('has-mobile-toggle');
  control.insertAdjacentHTML(
    'afterbegin',
    `<button class="mobile-rotation-toggle" type="button" aria-expanded="false" aria-controls="method-rotation-control">
      <span>Rotation cockpit</span>
      <strong>Show</strong>
    </button>`
  );
  const toggle = document.querySelector('.mobile-rotation-toggle');
  toggle?.addEventListener('click', () => {
    const isOpen = control.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.querySelector('strong').textContent = isOpen ? 'Hide' : 'Show';
  });
}

function bindSecondaryIrfDisclosure() {
  document.querySelector('.method-secondary-irfs')?.addEventListener('toggle', (event) => {
    if (event.currentTarget.open) {
      window.requestAnimationFrame(() => redrawInitializedMethodCards());
    }
  });
}

function moveRotationCockpit() {
  const cockpit = document.querySelector('#single-method-root .method-card__control');
  const mount = document.getElementById('method-cockpit-root');
  if (!cockpit || !mount) {
    return;
  }
  mount.append(cockpit);
}

async function renderMethodCode(method) {
  const mount = document.getElementById('method-code-panel');
  const sharedMount = document.getElementById('method-shared-code-panel');
  const helpersMount = document.getElementById('method-helper-code-panels');
  const {
    bindCodeCopy,
    loadMatlabCodeBundle,
    loadMatlabSourceByKey,
    MATLAB_SOURCE_FILES,
    renderCodePanel,
  } = await import('./matlab-code.js?v=20260715-matlab-flag1');
  const [
    codeBundle,
    allIrfHelperCode,
    selectedIrfHelperCode,
    matrixHelperCode,
    quantileHelperCode,
    colorHelperCode,
    standardizeHelperCode,
  ] = await Promise.all([
    loadMatlabCodeBundle(method.id),
    loadMatlabSourceByKey('allIrfHelper'),
    loadMatlabSourceByKey('selectedIrfHelper'),
    loadMatlabSourceByKey('matrixHelper'),
    loadMatlabSourceByKey('quantileHelper'),
    loadMatlabSourceByKey('colorHelper'),
    loadMatlabSourceByKey('standardizeHelper'),
  ]);
  if (sharedMount) {
    sharedMount.innerHTML = renderCodePanel({
      title: 'Shared simulated bivariate SVAR setup',
      code: codeBundle.shared,
      fullCode: codeBundle.shared,
      note: 'This checked-in .m file is the common setup used by every method page.',
      sourcePath: 'apps/atlas/source/matlab/atlas_setup.m',
      showFullButton: false,
    });
    bindCodeCopy(sharedMount);
  }
  if (mount) {
    const fileName = MATLAB_SOURCE_FILES[method.id] ?? MATLAB_SOURCE_FILES.recursive;
    mount.innerHTML = renderCodePanel({
      title: `${method.label} Matlab entry script`,
      code: codeBundle.method,
      showFullButton: false,
      downloadMethodId: method.id,
      note: 'This script contains the method logic: define the loss, select or accept rotations, then create diagnostics and IRF plots using the small shared plotting helpers below.',
      sourcePath: `apps/atlas/source/matlab/${fileName}`,
    });
    bindCodeCopy(mount);
  }
  if (helpersMount) {
    helpersMount.innerHTML = [
      renderCodePanel({
        title: 'Shared Matlab all-rotation IRF plotter',
        code: allIrfHelperCode,
        note: 'Reusable plotting utility for the four IRF clouds. The identification loss is computed in the method script above.',
        sourcePath: 'apps/atlas/source/matlab/atlas_plot_all_irfs.m',
        showFullButton: false,
      }),
      renderCodePanel({
        title: 'Shared Matlab selected-rotation IRF plotter',
        code: selectedIrfHelperCode,
        note: 'Reusable plotting utility for accepted or near-selected rotations. The accepted set is computed in the method script above.',
        sourcePath: 'apps/atlas/source/matlab/atlas_plot_selected_irfs.m',
        showFullButton: false,
      }),
      renderCodePanel({
        title: 'Shared Matlab selected-matrix plotter',
        code: matrixHelperCode,
        note: 'Reusable helper for labeling the selected impact matrix.',
        sourcePath: 'apps/atlas/source/matlab/atlas_plot_selected_matrix.m',
        showFullButton: false,
      }),
      renderCodePanel({
        title: 'Shared Matlab utility helpers',
        code: [quantileHelperCode, colorHelperCode, standardizeHelperCode].join('\n\n'),
        note: 'Small utilities used by the method scripts and IRF plotters.',
        sourcePath: 'apps/atlas/source/matlab/atlas_quantile.m, atlas_loss_colors.m, atlas_standardize.m',
        showFullButton: false,
      }),
    ].join('');
    bindCodeCopy(helpersMount);
  }
}

function initRevealAnimations() {
  document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
}

function bindResize() {
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      redrawInitializedMethodCards();
    }, 140);
  });
}

bootPage(async () => {
  const methodId = validMethodId(requestedMethodId);
  if (methodId !== requestedMethodId) {
    history.replaceState(null, '', `method.html?method=${methodId}`);
  }
  renderAtlasTimeline('atlas-timeline', methodId);
  renderAtlasNextCard('atlas-next-card', methodId);
  const method = renderSingleMethodPage('single-method-root', methodId);
  if (!method) {
    return;
  }
  moveRotationCockpit();
  decorateMethodPage(method);
  renderMethodEditorialSections(method);
  assignMethodAnchors();
  initMobileRotationToggle();
  bindSecondaryIrfDisclosure();
  if (matlabReplicationEnabled) {
    await renderMethodCode(method);
  }
  bindResize();
  initRevealAnimations();
}, { loader: null, bootTimeoutMs: 1500, loaderFinishTimeoutMs: 0 });
