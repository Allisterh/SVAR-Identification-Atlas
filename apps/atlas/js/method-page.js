import { bootPage } from './bootstrap.js';
import { methodList } from './data-utils.js?v=20260831-figure-system3';
import { applyAtlasFeatureVisibility, isAtlasFeatureEnabled } from './feature-flags.js?v=20260715-matlab-flag1';
import { renderSingleMethodPage, redrawInitializedMethodCards } from './method-cards.js?v=20260831-figure-system3';
import { methodLiteratureHtml, methodReadingGuideHtml } from './methods/detail-panel.js?v=20260719-source-gate2';
import methodContentById from './methods/index.js?v=20260719-source-gate2';
import { renderAtlasNextCard, renderAtlasTimeline } from './timeline.js?v=20260715-editorial-layout1';

const params = new URLSearchParams(window.location.search);
const methodPathMatch = window.location.pathname.match(/\/methods\/([^/]+)(?:\/index\.html)?\/?$/);
const requestedMethodId = params.get('method') ?? methodPathMatch?.[1] ?? 'recursive';
const matlabReplicationEnabled = isAtlasFeatureEnabled('matlabReplication');
const ATLAS_URL = 'https://saschakew.github.io/SVAR-Identification-Atlas';

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
  const title = `${method.label} SVAR Identification | SVAR Identification Atlas`;
  const description = method.summary;
  const canonicalUrl = `${ATLAS_URL}/methods/${method.id}/`;
  const imageUrl = `${ATLAS_URL}/source/matlab/generated/${method.id}.png`;
  const imageAlt = `${method.label} identification diagnostic in the SVAR Identification Atlas`;

  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  let canonical = document.getElementById('seo-canonical');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.id = 'seo-canonical';
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
  document.getElementById('seo-og-title')?.setAttribute('content', title);
  document.getElementById('seo-og-description')?.setAttribute('content', description);
  document.getElementById('seo-og-url')?.setAttribute('content', canonicalUrl);
  document.getElementById('seo-og-image')?.setAttribute('content', imageUrl);
  document.getElementById('seo-og-image-alt')?.setAttribute('content', imageAlt);
  document.getElementById('seo-twitter-title')?.setAttribute('content', title);
  document.getElementById('seo-twitter-description')?.setAttribute('content', description);
  document.getElementById('seo-twitter-image')?.setAttribute('content', imageUrl);
  document.getElementById('seo-twitter-image-alt')?.setAttribute('content', imageAlt);
  const structuredData = document.getElementById('seo-structured-data');
  if (structuredData) {
    structuredData.textContent = JSON.stringify(methodStructuredData(method, description, canonicalUrl, imageUrl));
  }
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

function methodStructuredData(method, description, canonicalUrl, imageUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${canonicalUrl}#learning-resource`,
        url: canonicalUrl,
        name: `${method.label} SVAR Identification`,
        description,
        learningResourceType: 'Interactive visualization',
        educationalUse: ['Instruction', 'Research'],
        about: [
          { '@type': 'Thing', name: `${method.label} identification` },
          { '@type': 'Thing', name: 'Structural vector autoregression' },
        ],
        isAccessibleForFree: true,
        inLanguage: 'en',
        image: imageUrl,
        author: {
          '@type': 'Person',
          '@id': 'https://sascha-keweloh.com/#person',
          name: 'Sascha Keweloh',
          url: 'https://sascha-keweloh.com/',
        },
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${ATLAS_URL}/#website`,
          name: 'SVAR Identification Atlas',
          url: `${ATLAS_URL}/`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'SVAR Identification Atlas',
            item: `${ATLAS_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${method.label} identification`,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
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
    history.replaceState(null, '', `methods/${methodId}/`);
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
