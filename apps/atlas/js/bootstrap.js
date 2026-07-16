export const ASSET_VERSION = '20260331-01';

const DEFAULT_BOOT_TIMEOUT_MS = 6000;
const DEFAULT_LOADER_FINISH_TIMEOUT_MS = 1400;

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function timeout(ms, label) {
  return new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
}

export function domReady() {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', resolve, { once: true });
  });
}

export async function typeset(elements = [document.body]) {
  return Promise.resolve(elements);
}

export async function revealPage() {
  const loader = document.getElementById('loading-screen');

  document.documentElement.classList.remove('ui-preinit');
  document.body?.classList.add('page-handoff');

  await nextFrame();
  await nextFrame();
  document.body?.classList.add('page-ready');

  if (!loader || loader.hidden) {
    if (loader) {
      loader.style.display = 'none';
    }
    document.body?.classList.remove('page-handoff');
    return;
  }

  await new Promise((resolve) => window.setTimeout(resolve, 80));
  loader.classList.add('fade-out');
  await new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, 620);
    loader.addEventListener(
      'transitionend',
      () => {
        window.clearTimeout(timeout);
        resolve();
      },
      { once: true }
    );
  });
  loader.style.display = 'none';
  document.body?.classList.remove('page-handoff');
}

export async function bootPage(onReady, options = {}) {
  await domReady();
  options.loader?.start?.();

  const bootTask = (async () => {
    await onReady();
    await nextFrame();
    await nextFrame();
    await typeset();
  })();

  try {
    await Promise.race([bootTask, timeout(options.bootTimeoutMs ?? DEFAULT_BOOT_TIMEOUT_MS, 'Atlas initialization')]);
  } catch (error) {
    console.error('Atlas initialization did not complete before reveal.', error);
  }

  bootTask.catch((error) => {
    console.error('Atlas initialization failed after page reveal.', error);
  });

  try {
    await Promise.race([
      options.loader?.finish?.() ?? Promise.resolve(),
      delay(options.loaderFinishTimeoutMs ?? DEFAULT_LOADER_FINISH_TIMEOUT_MS),
    ]);
  } catch (error) {
    console.error('Atlas loader finish did not complete before reveal.', error);
  }

  await revealPage();
  options.loader?.destroy?.();
}
