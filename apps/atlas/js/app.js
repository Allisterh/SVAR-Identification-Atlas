import './overview-research.js?v=20260719-source-gate2';
import { bootPage } from './bootstrap.js';
import { setupData } from './data/identification-atlas-data.js';
import { applyAtlasFeatureVisibility, isAtlasFeatureEnabled } from './feature-flags.js?v=20260715-matlab-flag1';
import { createAtlasLoader } from './loader.js?v=20260831-figure-system2';
import { renderMethodLinks } from './method-cards.js?v=20260831-figure-system2';
import { initSetup, redrawSetup } from './setup.js?v=20260831-figure-system2';
import { renderAtlasNextCard, renderAtlasTimeline } from './timeline.js?v=20260715-editorial-layout1';

const skipLoader = new URLSearchParams(window.location.search).has('skipLoader');
const atlasLoader = skipLoader ? null : createAtlasLoader(setupData.timeSeries, { minimumMs: 3000 });
const matlabReplicationEnabled = isAtlasFeatureEnabled('matlabReplication');

applyAtlasFeatureVisibility();

if (skipLoader) {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.hidden = true;
    loadingScreen.style.display = 'none';
  }
}

function initRevealAnimations() {
  const items = document.querySelectorAll('[data-reveal]');
  // Keep section reveal deterministic across mobile browsers: all sections become visible
  // while the loader is still active instead of relying on scroll-time observers.
  items.forEach((item) => item.classList.add('is-visible'));
}

function bindResize() {
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      redrawSetup();
      atlasLoader?.resize?.();
    }, 140);
  });
}

async function initSharedMatlabPanel() {
  const mount = document.getElementById('matlab-setup-panel');
  if (!mount) {
    return;
  }
  const {
    bindCodeCopy,
    loadSharedMatlabSetup,
    loadMatlabSourceByKey,
    renderCodePanel,
  } = await import('./matlab-code.js?v=20260715-matlab-flag1');
  const [
    runnerCode,
    setupCode,
    allIrfHelperCode,
    selectedIrfHelperCode,
    matrixHelperCode,
    quantileHelperCode,
    colorHelperCode,
    standardizeHelperCode,
  ] = await Promise.all([
    loadMatlabSourceByKey('runner'),
    loadSharedMatlabSetup(),
    loadMatlabSourceByKey('allIrfHelper'),
    loadMatlabSourceByKey('selectedIrfHelper'),
    loadMatlabSourceByKey('matrixHelper'),
    loadMatlabSourceByKey('quantileHelper'),
    loadMatlabSourceByKey('colorHelper'),
    loadMatlabSourceByKey('standardizeHelper'),
  ]);
  mount.innerHTML = [
    renderCodePanel({
      title: 'Run every Matlab method page',
      code: runnerCode,
      note: 'This runner executes all method-page demos and exports diagnostics, all-rotation IRFs, and accepted/selected-rotation IRFs for every method.',
      sourcePath: 'apps/atlas/source/matlab/atlas_run_all_method_demos.m',
      showFullButton: false,
      downloadAll: true,
      downloadButtonLabel: 'Download full MATLAB ZIP',
    }),
    renderCodePanel({
      title: 'Shared simulated bivariate SVAR setup',
      code: setupCode,
      note: 'This checked-in .m file simulates the illustrative data, builds the rotation grid, computes recovered shocks, and stores IRFs for every method page.',
      sourcePath: 'apps/atlas/source/matlab/atlas_setup.m',
      showFullButton: false,
    }),
    renderCodePanel({
      title: 'Shared Matlab all-rotation IRF plotter',
      code: allIrfHelperCode,
      note: 'Reusable plotting utility for the four IRF clouds. The identification loss is computed in each method script.',
      sourcePath: 'apps/atlas/source/matlab/atlas_plot_all_irfs.m',
      showFullButton: false,
    }),
    renderCodePanel({
      title: 'Shared Matlab selected-rotation IRF plotter',
      code: selectedIrfHelperCode,
      note: 'Reusable plotting utility for accepted or near-selected rotations. The accepted set is computed in each method script.',
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
  bindCodeCopy(mount);
}

bootPage(async () => {
  renderAtlasTimeline('atlas-timeline', 'setup');
  renderAtlasNextCard('atlas-next-card', 'setup');
  initSetup();
  renderMethodLinks('hero-method-links', { className: 'method-link-list method-link-list--hero', label: 'Open identification method page', useMethodPages: true, numbered: true });
  renderMethodLinks('method-jump-list', { className: 'method-link-list method-link-list--section', label: 'Method pages', useMethodPages: true, numbered: true });
  if (matlabReplicationEnabled) {
    await initSharedMatlabPanel();
  }
  bindResize();
  initRevealAnimations();
}, skipLoader ? { loader: null, bootTimeoutMs: 1500, loaderFinishTimeoutMs: 0 } : { loader: atlasLoader });
