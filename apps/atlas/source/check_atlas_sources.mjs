import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import recursive from '../js/methods/recursive.js';
import sign from '../js/methods/sign.js';
import narrative from '../js/methods/narrative.js';
import longRun from '../js/methods/long-run.js';
import proxy from '../js/methods/proxy.js';
import maxShare from '../js/methods/max-share.js';
import independentShocks from '../js/methods/independent-shocks.js';
import heteroskedasticity from '../js/methods/heteroskedasticity.js';
import { methodLiteratureHtml, methodReadingGuideHtml } from '../js/methods/detail-panel.js';
import { atlasClaims, atlasCoverage, atlasSections, atlasSources, literatureReferences } from '../research/index.mjs';

const atlasRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(atlasRoot, '..', '..', '..');
const reportPath = path.join(atlasRoot, 'research', 'atlas-source-audit.md');
const overviewPath = path.join(atlasRoot, 'index.html');
const overviewResearchPath = path.join(atlasRoot, 'js', 'overview-research.js');
const args = new Set(process.argv.slice(2));
const errors = [];
const pages = [
  'overview',
  'recursive',
  'sign',
  'narrative',
  'long-run',
  'proxy',
  'max-share',
  'independent-shocks',
  'heteroskedasticity',
];
const methodContent = {
  recursive,
  sign,
  narrative,
  'long-run': longRun,
  proxy,
  'max-share': maxShare,
  'independent-shocks': independentShocks,
  heteroskedasticity,
};
const primaryPages = new Set(Object.values(atlasClaims)
  .filter((claim) => claim.evidenceContract === 'primary-v1')
  .map((claim) => claim.page));

const fail = (message) => errors.push(message);
const normalize = (value) => String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
const hash = (value) => createHash('sha256').update(value, 'utf8').digest('hex').slice(0, 16);
const cell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const stripMarkup = (value) => normalize(String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' '));
const titleKey = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/\\['"^~=ckuvH]\s*\{?([a-z])\}?/g, '$1')
  .replace(/[{}\\]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const sourceLabel = (source) => {
  const family = source.authors.map((author) => {
    const words = author.trim().split(/\s+/);
    return words.at(-1) === 'Olea' ? 'Montiel Olea' : words.at(-1);
  });
  const names = family.length === 1 ? family[0] : family.length === 2 ? family.join(' and ') : family[0] + ' et al.';
  return names + ' (' + (source.displayYear ?? source.year) + ')';
};

function valueAtPath(root, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => value?.[key], root);
}

function extractIdFragment(html, selector) {
  if (!selector.startsWith('#')) return '';
  const id = selector.slice(1);
  const opening = new RegExp(`<([a-z][a-z0-9-]*)\\b[^>]*\\bid=["']${id}["'][^>]*>`, 'i').exec(html);
  if (!opening) return '';
  const start = opening.index;
  const tag = opening[1];
  const closing = new RegExp('</' + tag + '>', 'ig');
  closing.lastIndex = opening.index + opening[0].length;
  const match = closing.exec(html);
  return match ? html.slice(start, match.index + match[0].length) : '';
}

function sectionSourceIds(section) {
  const ids = new Set((section.sources ?? []).map((relation) => typeof relation === 'string' ? relation : relation.id));
  for (const claimId of section.claimIds ?? []) {
    for (const relation of atlasClaims[claimId]?.sources ?? []) ids.add(relation.id);
  }
  return [...ids];
}

function sectionHash(section, overviewHtml) {
  const contentRoot = section.page === 'overview' ? null : methodContent[section.page];
  const content = [
    ...(section.contentPaths ?? []).map((contentPath) => [
      contentPath,
      normalize(Array.isArray(valueAtPath(contentRoot, contentPath))
        ? JSON.stringify(valueAtPath(contentRoot, contentPath))
        : valueAtPath(contentRoot, contentPath)),
    ]),
    ...(section.contentSelectors ?? []).map((selector) => [selector, normalize(extractIdFragment(overviewHtml, selector))]),
  ];
  return hash(JSON.stringify({
    id: section.id,
    title: section.title,
    renderMode: section.renderMode,
    displayReason: section.displayReason ?? '',
    claimIds: section.claimIds,
    ...(section.page === 'proxy' ? {} : { sources: section.sources ?? [] }),
    coverageCategoryIds: section.coverageCategoryIds,
    content,
  }));
}

function claimHash(claim) {
  if (claim.evidenceContract !== 'primary-v1') return hash(normalize(claim.text));
  return hash(JSON.stringify({
    id: claim.id,
    page: claim.page,
    contentPath: claim.contentPath,
    text: normalize(claim.text),
    claimType: claim.claimType,
    sources: (claim.sources ?? []).map((relation) => ({
      id: relation.id,
      relation: relation.relation,
      locator: normalize(relation.locator),
      evidence: normalize(relation.evidence),
      reviewedFrom: relation.reviewedFrom,
      reviewedVersion: normalize(relation.reviewedVersion),
      verdict: relation.verdict,
    })),
  }));
}

function bibField(text, name) {
  const match = new RegExp('^\\s*' + name + '\\s*=\\s*[{"](.+?)[}"]\\s*,?\\s*$', 'im').exec(text);
  return match?.[1]?.trim() ?? '';
}

function validateSourceMetadata() {
  for (const page of pages) {
    const orders = new Set();
    const listed = Object.values(atlasSources).filter((source) => source.pageUses?.[page]?.listed);
    if (!listed.length) fail(page + ': no public sources are listed');
    for (const source of listed) {
      const use = source.pageUses[page];
      if (!Number.isInteger(use.order) || orders.has(use.order)) fail(page + ': duplicate or invalid source order for ' + source.id);
      if (!use.annotation) fail(page + ': source lacks an annotation: ' + source.id);
      orders.add(use.order);
    }
    if (Math.max(...orders) !== listed.length) fail(page + ': bibliography order is not contiguous');
  }

  for (const [id, source] of Object.entries(atlasSources)) {
    if (source.id !== id) fail('Source key/id mismatch: ' + id);
    for (const field of ['citationKey', 'type', 'title', 'venue', 'url', 'metadataStatus', 'verifiedAt']) {
      if (!source[field]) fail('Source ' + id + ' is missing ' + field);
    }
    if (!Array.isArray(source.authors) || !source.authors.length) fail('Source ' + id + ' has no authors');
    if (!Number.isInteger(source.year)) fail('Source ' + id + ' has an invalid year');
    if (!/^https:\/\//.test(source.url ?? '')) fail('Source ' + id + ' lacks an HTTPS public URL');
    if (source.doi && !/^10\.\d{4,9}\//.test(source.doi)) fail('Source ' + id + ' has a malformed DOI');

    if (source.bibtexPath) {
      const bibPath = path.resolve(repoRoot, source.bibtexPath);
      if (!existsSync(bibPath)) {
        fail('Source ' + id + ' points to a missing vault BibTeX file: ' + source.bibtexPath);
        continue;
      }
      const bib = readFileSync(bibPath, 'utf8');
      const key = /@\w+\{([^,]+)/.exec(bib)?.[1];
      if (key !== source.citationKey) fail('Source ' + id + ' citation key differs from the vault record');
      const bibDoi = bibField(bib, 'doi').toLowerCase();
      if (bibDoi && source.doi?.toLowerCase() !== bibDoi && !source.vaultDiscrepancy) fail('Source ' + id + ' DOI differs from the vault record');
      const bibYear = Number(bibField(bib, 'year'));
      if (bibYear && bibYear !== source.year && !source.versionNote) fail('Source ' + id + ' year differs from the vault record without a version note');
      const bibTitle = bibField(bib, 'title');
      if (!bibDoi && bibTitle && titleKey(bibTitle) !== titleKey(source.title)) fail('Source ' + id + ' title differs from its DOI-less vault record');
    } else if (!['verified-primary', 'verified-public-record'].includes(source.metadataStatus)) {
      fail('Source ' + id + ' lacks both a vault record and public-record verification');
    }
  }
}

function validateClaims() {
  const overviewHtml = readFileSync(overviewPath, 'utf8');
  for (const [id, claim] of Object.entries(atlasClaims)) {
    if (claim.id !== id) fail('Claim key/id mismatch: ' + id);
    if (claim.status !== 'verified' || !claim.reviewedAt) fail('Unreviewed claim: ' + id);
    if (!claim.sources?.length) fail('Unsupported claim: ' + id);

    if (claim.evidenceContract === 'primary-v1') {
      if (!pages.includes(claim.page) || claim.claimType !== 'paper-dependent') {
        fail('Invalid primary-claim identity/type: ' + id);
      }
      const content = claim.page === 'overview'
        ? extractIdFragment(overviewHtml, claim.contentPath)
        : valueAtPath(methodContent[claim.page], claim.contentPath);
      if (!claim.contentPath || content === undefined || content === '') {
        fail('Primary claim has an unknown content path: ' + id);
      } else if (!stripMarkup(content).includes(stripMarkup(claim.text))) {
        fail('Primary claim text is not present verbatim in its registered content: ' + id);
      }
      if (claim.reviewedHash !== claimHash(claim)) fail('Primary claim changed since review: ' + id + ' needs hash ' + claimHash(claim));
    } else {
      if (claim.page !== 'proxy') fail('Legacy claim is not scoped to the Proxy page: ' + id);
      if (claim.reviewedHash !== claimHash(claim)) fail('Legacy Proxy claim changed since review: ' + id);
    }

    for (const relation of claim.sources ?? []) {
      if (!atlasSources[relation.id]) fail('Unknown source ' + relation.id + ' in claim ' + id);
      if (!relation.locator || !['supports', 'qualifies', 'contrasts'].includes(relation.relation)) {
        fail('Incomplete evidence relation in claim ' + id);
      }
      if (claim.evidenceContract !== 'primary-v1') continue;

      if (!atlasSources[relation.id]?.pageUses?.[claim.page]?.listed) {
        fail('Primary claim source is not listed on its page: ' + id + ' -> ' + relation.id);
      }
      if (!['supports', 'qualifies', 'contrasts'].includes(relation.verdict)) {
        fail('Primary claim lacks a controlled evidence verdict: ' + id);
      }
      if (relation.verdict !== relation.relation) fail('Primary claim verdict/relation mismatch: ' + id);
      if (normalize(relation.locator).length < 8 || /cited paper contribution/i.test(relation.locator)) {
        fail('Primary claim lacks a concrete locator: ' + id);
      }
      if (normalize(relation.evidence).length < 40) fail('Primary claim lacks an evidence paraphrase: ' + id);
      if (!normalize(relation.reviewedVersion)) fail('Primary claim lacks a reviewed version: ' + id);
      if (/^raw\//.test(relation.reviewedFrom ?? '')) {
        if (!existsSync(path.resolve(repoRoot, relation.reviewedFrom))) {
          fail('Primary claim points to a missing raw paper artifact: ' + id + ' -> ' + relation.reviewedFrom);
        }
      } else if (!/^https:\/\//.test(relation.reviewedFrom ?? '')) {
        fail('Primary claim lacks a raw or public primary artifact: ' + id);
      }
    }
  }
}

function validateSections() {
  const overviewHtml = readFileSync(overviewPath, 'utf8');
  const overviewResearch = readFileSync(overviewResearchPath, 'utf8');

  for (const page of pages) {
    const coverage = atlasCoverage[page];
    const sections = Object.values(atlasSections).filter((section) => section.page === page);
    const hasPrimaryClaims = primaryPages.has(page);
    if (!coverage) {
      fail(page + ': coverage declaration is missing');
      continue;
    }
    if (hasPrimaryClaims) {
      if (coverage.status !== 'primary-claim-audited-selected-guide' || coverage.saturation !== 'achieved-for-declared-scope') {
        fail(page + ': primary-claim coverage audit is incomplete');
      }
    } else if (page === 'proxy') {
      if (coverage.status !== 'audited-selected-guide' || coverage.saturation !== 'achieved-for-declared-scope') {
        fail(page + ': legacy claim coverage audit is incomplete');
      }
    } else if (coverage.status !== 'bibliographic-section-audited' || coverage.saturation !== 'not-assessed-under-primary-contract') {
      fail(page + ': bibliographic audit or migration disclosure is incomplete');
    }
    if (coverage.searchPasses?.length < 2) fail(page + ': two verification passes are required');
    const required = [...(coverage.sectionPolicy?.requiredSectionIds ?? [])].sort();
    const registered = sections.map((section) => section.id).sort();
    if (JSON.stringify(required) !== JSON.stringify(registered)) fail(page + ': required and registered section IDs differ');

    let rendered = '';
    if (page !== 'overview') {
      const method = { id: page, label: page, selectionMode: page === 'sign' || page === 'narrative' ? 'set' : 'point' };
      rendered = methodReadingGuideHtml(method, methodContent[page]) + methodLiteratureHtml(method, methodContent[page]);
    }

    for (const section of sections) {
      if (!section.title || !['claim-text', 'citations-only', 'audit-only'].includes(section.renderMode)) {
        fail('Incomplete section classification: ' + section.id);
      }
      if (section.renderMode === 'audit-only' && !section.displayReason) fail('Audit-only section lacks a reason: ' + section.id);
      if (section.completenessStatus !== 'complete-for-declared-scope') fail('Incomplete section: ' + section.id);
      const expectedCitationStatus = hasPrimaryClaims
        ? section.renderMode === 'audit-only' ? 'not-applicable' : 'derived-from-claims'
        : page === 'proxy'
          ? 'verified'
          : section.renderMode === 'audit-only' ? 'not-applicable' : 'verified';
      if (section.citationStatus !== expectedCitationStatus) {
        fail('Incorrect citation status for ' + section.id + ': expected ' + expectedCitationStatus);
      }
      if (hasPrimaryClaims && section.renderMode === 'audit-only' && section.claimIds?.length) {
        fail('Atlas-authored section carries paper claims: ' + section.id);
      }
      if (hasPrimaryClaims && section.renderMode === 'citations-only' && section.sources?.length) {
        fail('Primary-audited section bypasses atomic claim evidence: ' + section.id);
      }

      for (const contentPath of section.contentPaths ?? []) {
        const value = valueAtPath(methodContent[page], contentPath);
        if (value === undefined || normalize(value) === '') fail(section.id + ': empty or unknown content path ' + contentPath);
      }
      for (const selector of section.contentSelectors ?? []) {
        if (!extractIdFragment(overviewHtml, selector)) fail(section.id + ': empty or unknown overview selector ' + selector);
      }
      for (const relation of section.sources ?? []) {
        if (!atlasSources[relation.id]) fail(section.id + ': unknown source ' + relation.id);
        else if (!atlasSources[relation.id].pageUses?.[page]?.listed) fail(section.id + ': source is not listed for its page: ' + relation.id);
        if (!relation.locator || relation.relation !== 'supports') fail(section.id + ': incomplete section evidence relation');
      }
      for (const claimId of section.claimIds ?? []) {
        if (!atlasClaims[claimId]) fail(section.id + ': unknown claim ' + claimId);
        if (hasPrimaryClaims && atlasClaims[claimId]?.evidenceContract !== 'primary-v1') {
          fail(section.id + ': non-primary claim on a primary-audited page: ' + claimId);
        }
      }
      if (hasPrimaryClaims && section.renderMode === 'citations-only' && !section.claimIds?.length) {
        fail('Primary-audited literature section has no atomic claims: ' + section.id);
      }

      const expectedHash = sectionHash(section, overviewHtml);
      if (section.reviewedHash !== expectedHash) fail('Section changed since review: ' + section.id + ' needs hash ' + expectedHash);

      const marker = 'data-citation-section-id="' + section.id + '"';
      if (page === 'overview') {
        const declared = overviewResearch.includes("'" + section.id + "'");
        if (section.renderMode === 'citations-only' && !declared) fail(section.id + ': overview citation injection is missing');
        if (section.renderMode === 'audit-only' && declared) fail(section.id + ': audit-only overview section injects citations');
      } else {
        const count = rendered.split(marker).length - 1;
        if (section.renderMode === 'audit-only' && count !== 0) fail(section.id + ': audit-only section renders citations');
        if (section.renderMode !== 'audit-only' && count !== 1) fail(section.id + ': inline citation block does not render exactly once');
      }
    }

    for (const [categoryId, category] of Object.entries(coverage.categories ?? {})) {
      if (category.status !== 'covered' || !category.sourceIds?.length) fail(page + ': uncovered category ' + categoryId);
      for (const sourceId of category.sourceIds ?? []) {
        if (!atlasSources[sourceId]) fail(page + ': unknown source in category ' + categoryId + ': ' + sourceId);
      }
    }

    const publicRefs = literatureReferences(page);
    const listedCount = Object.values(atlasSources).filter((source) => source.pageUses?.[page]?.listed).length;
    if (publicRefs.length !== listedCount) fail(page + ': rendered bibliography and source registry counts differ');
    if (hasPrimaryClaims) {
      const primaryClaimIds = Object.values(atlasClaims)
        .filter((claim) => claim.page === page && claim.evidenceContract === 'primary-v1')
        .map((claim) => claim.id)
        .sort();
      const registeredClaimIds = sections.flatMap((section) => section.claimIds ?? []);
      if (new Set(registeredClaimIds).size !== registeredClaimIds.length) fail(page + ': an atomic claim is assigned to more than one section');
      if (JSON.stringify(primaryClaimIds) !== JSON.stringify([...registeredClaimIds].sort())) {
        fail(page + ': primary claims and registered section claims differ');
      }
      const claimSourceIds = [...new Set(primaryClaimIds.flatMap((claimId) => atlasClaims[claimId].sources.map((relation) => relation.id)))].sort();
      const listedSourceIds = Object.values(atlasSources)
        .filter((source) => source.pageUses?.[page]?.listed)
        .map((source) => source.id)
        .sort();
      if (JSON.stringify(claimSourceIds) !== JSON.stringify(listedSourceIds)) fail(page + ': listed sources and verified claim sources differ');
    }
  }
}

function buildReport() {
  const overviewHtml = readFileSync(overviewPath, 'utf8');
  const lines = [
    '# Atlas source-verification audit',
    '',
    '> Generated from the Atlas section, source, claim, and coverage registries. Edit the registries, not this report.',
    '',
    '## Publication gate',
    '',
    'The KnowledgeVault resolves paper identity, version, and provenance. Claim support requires the raw primary paper or a stable public copy with a concrete locator and evidence paraphrase. Public Atlas pages expose DOI, publisher, NBER, or stable scholarly links only.',
    '',
    '| Page | Reviewed sections | Inline-cited | Audit-only | Public sources | Cutoff | Status |',
    '| --- | ---: | ---: | ---: | ---: | --- | --- |',
  ];

  for (const page of pages) {
    const sections = Object.values(atlasSections).filter((section) => section.page === page);
    const inline = sections.filter((section) => section.renderMode !== 'audit-only').length;
    const sources = Object.values(atlasSources).filter((source) => source.pageUses?.[page]?.listed).length;
    const status = primaryPages.has(page)
      ? 'primary atomic claims verified / selected-guide complete'
      : page === 'proxy'
        ? 'legacy claim map / primary-contract migration pending'
        : 'bibliographic and section audit / semantic migration pending';
    lines.push('| ' + [
      page,
      sections.length,
      inline,
      sections.length - inline,
      sources,
      atlasCoverage[page].literatureCutoffLabel,
      status,
    ].map(cell).join(' | ') + ' |');
  }

  const vaultCount = Object.values(atlasSources).filter((source) => source.bibtexPath).length;
  const fallbackCount = Object.values(atlasSources).filter((source) => !source.bibtexPath).length;
  lines.push(
    '',
    '## Verification authority',
    '',
    '- Sources resolved to individual vault BibTeX records: ' + vaultCount,
    '- Sources verified through public primary or stable scholarly records: ' + fallbackCount,
    '- Private vault paths are used only by this development gate and never rendered to readers.',
    '',
  );

  for (const page of pages) {
    const coverage = atlasCoverage[page];
    const sections = Object.values(atlasSections).filter((section) => section.page === page);
    const sources = Object.values(atlasSources)
      .filter((source) => source.pageUses?.[page]?.listed)
      .sort((a, b) => a.pageUses[page].order - b.pageUses[page].order);

    lines.push('## ' + page, '', coverage.scope, '', '### Section review', '',
      '| Section | Display | Evidence | Hash |',
      '| --- | --- | --- | --- |');
    for (const section of sections) {
      const evidenceLabels = sectionSourceIds(section).map((id) => sourceLabel(atlasSources[id])).join('; ');
      lines.push('| ' + [
        section.id,
        section.renderMode === 'audit-only' ? 'audit only' : 'inline citations',
        evidenceLabels || 'Atlas-authored / no paper-specific attribution',
        sectionHash(section, overviewHtml),
      ].map(cell).join(' | ') + ' |');
    }

    if (primaryPages.has(page)) {
      const claims = Object.values(atlasClaims)
        .filter((claim) => claim.page === page && claim.evidenceContract === 'primary-v1')
        .sort((left, right) => left.id.localeCompare(right.id));
      lines.push(
        '',
        '### Atomic primary-source claims',
        '',
        '| Claim | Source | Verdict | Locator | Evidence paraphrase | Reviewed primary artifact |',
        '| --- | --- | --- | --- | --- | --- |',
      );
      for (const claim of claims) {
        for (const relation of claim.sources) {
          lines.push('| ' + [
            claim.id,
            sourceLabel(atlasSources[relation.id]),
            relation.verdict,
            relation.locator,
            relation.evidence,
            relation.reviewedFrom,
          ].map(cell).join(' | ') + ' |');
        }
      }
    }

    lines.push('', '### Public bibliography', '',
      '| # | Source | Public record | Internal verification |',
      '| ---: | --- | --- | --- |');
    for (const source of sources) {
      const publication = source.venue +
        (source.volume ? ' ' + source.volume + (source.issue ? '(' + source.issue + ')' : '') : '') +
        (source.pages ? ': ' + source.pages : source.articleNumber ? ', article ' + source.articleNumber : '');
      const citation = source.authors.join(', ') + ' (' + (source.displayYear ?? source.year) + '), ' + source.title + '. ' + publication;
      const link = source.doi ? 'doi:' + source.doi : 'public source';
      const internal = source.vaultDiscrepancy ? 'vault discrepancy logged; public record verified' : source.bibtexPath ? 'vault BibTeX: ' + source.citationKey : source.metadataStatus;
      lines.push('| ' + source.pageUses[page].order + ' | ' + cell(citation) + ' | [' + link + '](' + source.url + ') | ' + cell(internal) + ' |');
    }
    lines.push('');
  }

  lines.push('## Reproduction', '',
    '- Check all pages: node source/check_atlas_sources.mjs',
    '- Refresh this report after an intentional review: node source/check_atlas_sources.mjs --write-report',
    '- Print reviewed atomic claim hashes: node source/check_atlas_sources.mjs --print-claim-hashes',
    '- Print reviewed section hashes: node source/check_atlas_sources.mjs --print-section-hashes',
    '');
  return lines.join('\n');
}

if (args.has('--print-claim-hashes')) {
  for (const claim of Object.values(atlasClaims).sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(claim.id + ' ' + claimHash(claim));
  }
  process.exit(0);
}

const overviewHtml = readFileSync(overviewPath, 'utf8');
if (args.has('--print-section-hashes')) {
  for (const section of Object.values(atlasSections).sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(section.id + ' ' + sectionHash(section, overviewHtml));
  }
  process.exit(0);
}

validateSourceMetadata();
validateClaims();
validateSections();
const report = buildReport();

if (args.has('--write-report')) writeFileSync(reportPath, report, 'utf8');
else if (!existsSync(reportPath)) fail('Generated report is missing; run with --write-report');
else if (readFileSync(reportPath, 'utf8') !== report) fail('Generated report is stale; run with --write-report after review');

if (errors.length) {
  console.error('Atlas source-verification audit failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

const sectionCount = Object.keys(atlasSections).length;
const sourceCount = Object.values(atlasSources).filter((source) => pages.some((page) => source.pageUses?.[page]?.listed)).length;
const primaryClaimCount = Object.values(atlasClaims).filter((claim) => claim.evidenceContract === 'primary-v1').length;
console.log('Atlas mechanical source-registry gate passed: ' + pages.length + ' pages, ' + sectionCount +
  ' reviewed sections, ' + sourceCount + ' unique public sources. Primary-claim gate passed for ' +
  primaryPages.size + ' pages and ' + primaryClaimCount + ' atomic claims.');
