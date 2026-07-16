const MATLAB_SOURCE_ROOT = '../source/matlab/';
const MATLAB_HELPER_KEYS = [
  'quantileHelper',
  'colorHelper',
  'allIrfHelper',
  'selectedIrfHelper',
  'matrixHelper',
  'standardizeHelper',
];
const MATLAB_METHOD_KEYS = [
  'recursive',
  'sign',
  'narrative',
  'long-run',
  'proxy',
  'max-share',
  'independent-shocks',
  'heteroskedasticity',
];

export const MATLAB_SOURCE_FILES = {
  setup: 'atlas_setup.m',
  runner: 'atlas_run_all_method_demos.m',
  quantileHelper: 'atlas_quantile.m',
  colorHelper: 'atlas_loss_colors.m',
  allIrfHelper: 'atlas_plot_all_irfs.m',
  selectedIrfHelper: 'atlas_plot_selected_irfs.m',
  matrixHelper: 'atlas_plot_selected_matrix.m',
  standardizeHelper: 'atlas_standardize.m',
  recursive: 'atlas_recursive_demo.m',
  sign: 'atlas_sign_demo.m',
  narrative: 'atlas_narrative_demo.m',
  'long-run': 'atlas_long_run_demo.m',
  proxy: 'atlas_proxy_demo.m',
  'max-share': 'atlas_max_share_demo.m',
  'independent-shocks': 'atlas_independent_shocks_demo.m',
  heteroskedasticity: 'atlas_heteroskedasticity_demo.m',
};

export const SHARED_MATLAB_SETUP = `% Canonical MATLAB setup is loaded from:
% apps/atlas/source/matlab/atlas_setup.m
%
% Serve the Atlas app over HTTP so the browser can load the checked-in .m file.
% Direct MATLAB run:
%   cd webillustration/apps/atlas/source/matlab
%   atlas_setup`;

export const MATLAB_METHOD_BLOCKS = Object.fromEntries(
  Object.entries(MATLAB_SOURCE_FILES)
    .filter(([methodId]) => methodId !== 'setup')
    .map(([methodId, fileName]) => [
      methodId,
      `% Canonical MATLAB method code is loaded from:
% apps/atlas/source/matlab/${fileName}
%
% Direct MATLAB run:
%   cd webillustration/apps/atlas/source/matlab
%   ${fileName.replace(/\.m$/, '')}`,
    ])
);

const codeCache = new Map();

export async function loadSharedMatlabSetup() {
  return loadMatlabSource(MATLAB_SOURCE_FILES.setup);
}

export async function loadMatlabSourceByKey(key) {
  const fileName = MATLAB_SOURCE_FILES[key];
  if (!fileName) {
    throw new Error(`Unknown MATLAB source key: ${key}`);
  }
  return loadMatlabSource(fileName);
}

export async function loadMatlabMethodCode(methodId) {
  const fileName = MATLAB_SOURCE_FILES[methodId] ?? MATLAB_SOURCE_FILES.recursive;
  return loadMatlabSource(fileName);
}

export async function loadMatlabCodeBundle(methodId) {
  const [shared, method] = await Promise.all([
    loadSharedMatlabSetup(),
    loadMatlabMethodCode(methodId),
  ]);
  const fileName = MATLAB_SOURCE_FILES[methodId] ?? MATLAB_SOURCE_FILES.recursive;
  const scriptName = fileName.replace(/\.m$/, '');
  return {
    shared,
    method,
    runScript: `% Run the canonical Atlas MATLAB method-page demo from this folder:
%   webillustration/apps/atlas/source/matlab

addpath(pwd);
${scriptName};`,
  };
}

export async function loadMatlabDownloadBundle(methodId) {
  const methodFileName = MATLAB_SOURCE_FILES[methodId] ?? MATLAB_SOURCE_FILES.recursive;
  const methodScriptName = methodFileName.replace(/\.m$/, '');
  const folderName = `atlas-${methodId}-matlab`.replace(/[^a-z0-9_-]/gi, '-');
  const sourceKeys = ['setup', methodId, ...MATLAB_HELPER_KEYS];
  const sourceEntries = await Promise.all(
    sourceKeys.map(async (key) => ({
      path: `${folderName}/${MATLAB_SOURCE_FILES[key]}`,
      content: await loadMatlabSourceByKey(key),
    }))
  );

  return {
    fileName: `${folderName}.zip`,
    entries: [
      {
        path: `${folderName}/README.txt`,
        content: [
          `SVAR Identification Atlas MATLAB demo: ${methodId}`,
          '',
          'How to run:',
          '1. Unzip this folder.',
          '2. Open MATLAB in the unzipped folder.',
          `3. Run ${methodScriptName}.`,
          '',
          'The method script contains the identification loss, selection rule, accepted set, and diagnostics.',
          'The other .m files are shared setup and plotting utilities used by the method script.',
          '',
          'To export all figures for this method from MATLAB:',
          `  ${methodScriptName}`,
        ].join('\n'),
      },
      {
        path: `${folderName}/run_this_method.m`,
        content: `addpath(pwd);\n${methodScriptName};\n`,
      },
      ...sourceEntries,
    ],
  };
}

export async function loadMatlabFullDownloadBundle() {
  const folderName = 'atlas-all-methods-matlab';
  const sourceKeys = ['runner', 'setup', ...MATLAB_METHOD_KEYS, ...MATLAB_HELPER_KEYS];
  const sourceEntries = await Promise.all(
    sourceKeys.map(async (key) => ({
      path: `${folderName}/${MATLAB_SOURCE_FILES[key]}`,
      content: await loadMatlabSourceByKey(key),
    }))
  );

  return {
    fileName: `${folderName}.zip`,
    entries: [
      {
        path: `${folderName}/README.txt`,
        content: [
          'SVAR Identification Atlas MATLAB demos',
          '',
          'How to run:',
          '1. Unzip this folder.',
          '2. Open MATLAB in the unzipped folder.',
          '3. Run atlas_run_all_method_demos to recreate all method figure sets.',
          '',
          'You can also run an individual method script, for example:',
          '  atlas_recursive_demo',
          '  atlas_sign_demo',
          '  atlas_proxy_demo',
          '',
          'Each method script contains its own identification loss, selection rule, accepted set, and diagnostics.',
          'The helper .m files provide shared setup and generic plotting utilities.',
        ].join('\n'),
      },
      {
        path: `${folderName}/run_all_methods.m`,
        content: 'addpath(pwd);\natlas_run_all_method_demos;\n',
      },
      ...sourceEntries,
    ],
  };
}

export async function matlabFullScript(methodId) {
  const bundle = await loadMatlabCodeBundle(methodId);
  return bundle.runScript;
}

async function loadMatlabSource(fileName) {
  if (codeCache.has(fileName)) {
    return codeCache.get(fileName);
  }

  const sourceUrl = new URL(`${MATLAB_SOURCE_ROOT}${fileName}`, import.meta.url);
  try {
    const response = await fetch(sourceUrl, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    codeCache.set(fileName, text);
    return text;
  } catch (error) {
    const fallback = fallbackCode(fileName, error);
    codeCache.set(fileName, fallback);
    return fallback;
  }
}

function fallbackCode(fileName, error) {
  const scriptName = fileName.replace(/\.m$/, '');
  return `% Unable to load apps/atlas/source/matlab/${fileName}
% ${error?.message ?? 'Unknown loading error'}
%
% Run the canonical MATLAB file directly:
%   cd webillustration/apps/atlas/source/matlab
%   ${scriptName}`;
}

export function renderCodePanel({
  title,
  code,
  fullCode = code,
  note = '',
  sourcePath = '',
  fullButtonLabel = 'Copy run command',
  showFullButton = true,
  downloadMethodId = '',
  downloadAll = false,
  downloadButtonLabel = 'Download method ZIP',
}) {
  const encodedCode = encodeURIComponent(code);
  const encodedFullCode = encodeURIComponent(fullCode);
  return `
    <article class="code-panel" data-code-panel>
      <div class="code-panel__header">
        <div>
          <span class="section-eyebrow">Matlab code</span>
          <h3>${title}</h3>
          ${note ? `<p>${note}</p>` : ''}
          ${sourcePath ? `<p class="code-panel__source">${sourcePath}</p>` : ''}
        </div>
        <div class="code-panel__actions">
          <button class="button button--secondary" type="button" data-copy-code="${encodedCode}">Copy</button>
          ${showFullButton ? `<button class="button button--primary" type="button" data-copy-code="${encodedFullCode}">${fullButtonLabel}</button>` : ''}
          ${downloadMethodId ? `<button class="button button--primary" type="button" data-download-method="${downloadMethodId}">${downloadButtonLabel}</button>` : ''}
          ${downloadAll ? `<button class="button button--primary" type="button" data-download-all-matlab>${downloadButtonLabel}</button>` : ''}
        </div>
      </div>
      <pre><code>${escapeHtml(code)}</code></pre>
      <p class="code-panel__status" aria-live="polite"></p>
    </article>`;
}

export function bindCodeCopy(root = document) {
  root.addEventListener('click', async (event) => {
    const downloadAllButton = event.target.closest('[data-download-all-matlab]');
    if (downloadAllButton) {
      const panel = downloadAllButton.closest('[data-code-panel]');
      const status = panel?.querySelector('.code-panel__status');
      try {
        const bundle = await loadMatlabFullDownloadBundle();
        const zipBlob = createStoredZipBlob(bundle.entries);
        triggerZipDownload(zipBlob, bundle.fileName);
        if (status) {
          status.textContent = `Downloaded ${bundle.fileName}.`;
        }
      } catch (error) {
        if (status) {
          status.textContent = `Download unavailable: ${error?.message ?? 'unknown error'}.`;
        }
      }
      return;
    }

    const downloadButton = event.target.closest('[data-download-method]');
    if (downloadButton) {
      const panel = downloadButton.closest('[data-code-panel]');
      const status = panel?.querySelector('.code-panel__status');
      const methodId = downloadButton.dataset.downloadMethod;
      try {
        const bundle = await loadMatlabDownloadBundle(methodId);
        const zipBlob = createStoredZipBlob(bundle.entries);
        triggerZipDownload(zipBlob, bundle.fileName);
        if (status) {
          status.textContent = `Downloaded ${bundle.fileName}.`;
        }
      } catch (error) {
        if (status) {
          status.textContent = `Download unavailable: ${error?.message ?? 'unknown error'}.`;
        }
      }
      return;
    }

    const button = event.target.closest('[data-copy-code]');
    if (!button) {
      return;
    }
    const panel = button.closest('[data-code-panel]');
    const status = panel?.querySelector('.code-panel__status');
    const code = decodeURIComponent(button.dataset.copyCode ?? '');
    try {
      await navigator.clipboard.writeText(code);
      if (status) {
        status.textContent = 'Copied to clipboard.';
      }
    } catch {
      if (status) {
        status.textContent = 'Clipboard unavailable. Select the code block and copy it manually.';
      }
      panel?.querySelector('code')?.parentElement?.focus?.();
    }
  });
}

function triggerZipDownload(zipBlob, fileName) {
  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function createStoredZipBlob(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.path.replace(/\\/g, '/'));
    const dataBytes = encoder.encode(entry.content);
    const crc = crc32(dataBytes);
    const { dosTime, dosDate } = dosTimestamp(new Date());

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, dataBytes.length, true);
    localView.setUint32(22, dataBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, dataBytes.length, true);
    centralView.setUint32(24, dataBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endHeader = new Uint8Array(22);
  const endView = new DataView(endHeader.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);

  return new Blob([...localParts, ...centralParts, endHeader], { type: 'application/zip' });
}

function dosTimestamp(date) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  return { dosDate, dosTime };
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
