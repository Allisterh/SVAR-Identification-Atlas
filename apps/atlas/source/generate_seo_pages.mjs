import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { methods } from '../js/data/identification-atlas-data.js';

const ATLAS_URL = 'https://saschakew.github.io/SVAR-Identification-Atlas';
const METHOD_IDS = [
  'recursive',
  'sign',
  'narrative',
  'long-run',
  'proxy',
  'max-share',
  'independent-shocks',
  'heteroskedasticity',
];
const IMAGE_DIMENSIONS = {
  recursive: [890, 678],
  sign: [890, 678],
  narrative: [895, 678],
  'long-run': [893, 678],
  proxy: [895, 678],
  'max-share': [895, 678],
  'independent-shocks': [896, 678],
  heteroskedasticity: [895, 678],
};

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const atlasDirectory = path.resolve(sourceDirectory, '..');
const checkOnly = process.argv.includes('--check');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function structuredData(method, canonicalUrl, imageUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${canonicalUrl}#learning-resource`,
        url: canonicalUrl,
        name: `${method.label} SVAR Identification`,
        description: method.summary,
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

function seoBlock(method) {
  const title = `${method.label} SVAR Identification | SVAR Identification Atlas`;
  const canonicalUrl = `${ATLAS_URL}/methods/${method.id}/`;
  const imageUrl = `${ATLAS_URL}/source/matlab/generated/${method.id}.png`;
  const imageAlt = `${method.label} identification diagnostic in the SVAR Identification Atlas`;
  const [imageWidth, imageHeight] = IMAGE_DIMENSIONS[method.id];

  return `  <!-- SEO:START -->
  <base href="../../">
  <meta id="seo-author" name="author" content="Sascha Keweloh">
  <meta id="seo-robots" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#f5f1e8">
  <link id="seo-canonical" rel="canonical" href="${canonicalUrl}">

  <meta property="og:site_name" content="SVAR Identification Atlas">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_US">
  <meta id="seo-og-title" property="og:title" content="${escapeHtml(title)}">
  <meta id="seo-og-description" property="og:description" content="${escapeHtml(method.summary)}">
  <meta id="seo-og-url" property="og:url" content="${canonicalUrl}">
  <meta id="seo-og-image" property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="${imageWidth}">
  <meta property="og:image:height" content="${imageHeight}">
  <meta id="seo-og-image-alt" property="og:image:alt" content="${escapeHtml(imageAlt)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta id="seo-twitter-title" name="twitter:title" content="${escapeHtml(title)}">
  <meta id="seo-twitter-description" name="twitter:description" content="${escapeHtml(method.summary)}">
  <meta id="seo-twitter-image" name="twitter:image" content="${imageUrl}">
  <meta id="seo-twitter-image-alt" name="twitter:image:alt" content="${escapeHtml(imageAlt)}">
  <script id="seo-structured-data" type="application/ld+json">
${JSON.stringify(structuredData(method, canonicalUrl, imageUrl), null, 2)
  .replaceAll('<', '\\u003c')
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}
  </script>
  <!-- SEO:END -->`;
}

function renderMethodPage(template, method) {
  const title = `${method.label} SVAR Identification | SVAR Identification Atlas`;
  const descriptionBlock = `  <meta
    name="description"
    content="${escapeHtml(method.summary)}"
  >`;

  return template
    .replace('<!DOCTYPE html>', `<!DOCTYPE html>
<!-- Generated by source/generate_seo_pages.mjs; edit method.html or the generator. -->`)
    .replace('<title>SVAR Identification Method</title>', `<title>${escapeHtml(title)}</title>`)
    .replace(
      /  <meta\s+name="description"\s+content="A visual SVAR identification method guide with an interactive rotation criterion, interpretation steps, literature history, variants, applications, and caveats."\s+>/,
      descriptionBlock
    )
    .replace(/  <!-- SEO:START -->[\s\S]*?  <!-- SEO:END -->/, seoBlock(method))
    .replace(
      '<h1 id="method-page-title">SVAR identification</h1>',
      `<h1 id="method-page-title">${escapeHtml(method.label)}</h1>`
    )
    .replace(
      '<p id="method-page-summary" class="hero__lede"></p>',
      `<p id="method-page-summary" class="hero__lede">${escapeHtml(method.summary)}</p>`
    );
}

async function writeOrCheck(targetPath, content) {
  if (checkOnly) {
    const current = await readFile(targetPath, 'utf8').catch(() => null);
    if (current !== content) {
      throw new Error(`Generated SEO file is stale: ${path.relative(atlasDirectory, targetPath)}`);
    }
    return;
  }
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, content, 'utf8');
}

const template = await readFile(path.join(atlasDirectory, 'method.html'), 'utf8');
const publishedMethods = METHOD_IDS.map((id) => methods.find((method) => method.id === id));

if (publishedMethods.some((method) => !method)) {
  throw new Error('The SEO method registry is out of sync with the Atlas data.');
}

await Promise.all(
  publishedMethods.map((method) =>
    writeOrCheck(
      path.join(atlasDirectory, 'methods', method.id, 'index.html'),
      renderMethodPage(template, method)
    )
  )
);

const sitemapUrls = [
  `${ATLAS_URL}/`,
  ...publishedMethods.map((method) => `${ATLAS_URL}/methods/${method.id}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

await writeOrCheck(path.join(atlasDirectory, 'sitemap.xml'), sitemap);

console.log(checkOnly ? 'SEO files are current.' : 'Generated method pages and sitemap.xml.');
