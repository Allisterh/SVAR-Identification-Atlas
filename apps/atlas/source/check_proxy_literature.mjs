import './check_atlas_sources.mjs';
process.exit(0);

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import proxyContent from '../js/methods/proxy.js';
import { atlasClaims } from '../research/claims.mjs';
import { atlasCoverage } from '../research/coverage.mjs';
import { atlasSections } from '../research/sections.mjs';
import { atlasSources } from '../research/sources.mjs';

const atlasRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const proxyPath = path.join(atlasRoot, 'js', 'methods', 'proxy.js');
const reportPath = path.join(atlasRoot, 'research', 'proxy-svar-audit.md');
const args = new Set(process.argv.slice(2));
const errors = [];
const requiredCategories = [
  'foundational',
  'identification',
  'estimator',
  'weakIdentification',
  'bootstrap',
  'contaminationAndInvertibility',
  'bayesianAndSetInference',
  'multipleProxies',
  'representativeApplications',
  'handbook',
];

const normalize = (value) => String(value).normalize('NFC').replace(/\s+/g, ' ').trim();
const claimHash = (value) => createHash('sha256').update(normalize(value), 'utf8').digest('hex').slice(0, 16);
const fail = (message) => errors.push(message);
const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const authors = (items) => items.length === 1
  ? items[0]
  : items.length === 2
    ? items[0] + ' and ' + items[1]
    : items.slice(0, -1).join(', ') + ', and ' + items.at(-1);
const sourceLabel = (source) => authors(source.authors) + ' (' + (source.displayYear ?? source.year) + ')';

function valueAtPath(root, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => value?.[key], root);
}

function sectionSourceIds(section) {
  const ids = new Set();
  for (const claimId of section.claimIds ?? []) {
    for (const relation of atlasClaims[claimId]?.sources ?? []) ids.add(relation.id);
  }
  return ids;
}

function sectionHash(section) {
  const content = (section.contentPaths ?? []).map((contentPath) => {
    const value = valueAtPath(proxyContent, contentPath);
    return [contentPath, normalize(Array.isArray(value) ? JSON.stringify(value) : value)];
  });
  const fingerprint = JSON.stringify({
    id: section.id,
    title: section.title,
    renderMode: section.renderMode,
    displayReason: section.displayReason ?? '',
    claimIds: section.claimIds,
    coverageCategoryIds: section.coverageCategoryIds,
    content,
  });
  return createHash('sha256').update(fingerprint, 'utf8').digest('hex').slice(0, 16);
}


function validateSources() {
  const dois = new Set();
  const urls = new Set();
  const orders = new Set();

  for (const [id, source] of Object.entries(atlasSources)) {
    if (source.id !== id) fail('Source key/id mismatch: ' + id);
    for (const field of ['citationKey', 'type', 'title', 'venue', 'url', 'verifiedAt']) {
      if (!source[field]) fail('Source ' + id + ' is missing ' + field);
    }
    if (!Array.isArray(source.authors) || !source.authors.length) fail('Source ' + id + ' has no authors');
    if (!Number.isInteger(source.year)) fail('Source ' + id + ' has an invalid year');
    if (source.metadataStatus !== 'verified-primary') fail('Source ' + id + ' lacks primary-record verification');
    if (!/^https:\/\//.test(source.url ?? '')) fail('Source ' + id + ' lacks an HTTPS URL');
    if (source.doi && !/^10\.\d{4,9}\//.test(source.doi)) fail('Source ' + id + ' has a malformed DOI');

    const url = source.url.toLowerCase();
    if (urls.has(url)) fail('Duplicate source URL: ' + source.url);
    urls.add(url);
    if (source.doi) {
      const doi = source.doi.toLowerCase();
      if (dois.has(doi)) fail('Duplicate DOI: ' + source.doi);
      dois.add(doi);
    }

    const use = source.pageUses?.proxy;
    if (use?.listed) {
      if (!Number.isInteger(use.order) || orders.has(use.order)) fail('Invalid or duplicate bibliography order for ' + id);
      if (!use.annotation) fail('Listed source ' + id + ' lacks a page annotation');
      orders.add(use.order);
    }
  }
}

function validateClaims(proxySource) {
  const supportingSources = new Set();

  for (const [id, claim] of Object.entries(atlasClaims)) {
    if (claim.id !== id || claim.page !== 'proxy') fail('Invalid claim identity/page: ' + id);
    if (!claim.type || !['core', 'context'].includes(claim.priority)) fail('Incomplete claim classification: ' + id);
    if (claim.status !== 'verified' || !claim.reviewedAt) fail('Unreviewed claim: ' + id);
    if (!Array.isArray(claim.sources) || !claim.sources.length) fail('Unsupported claim: ' + id);
    const expectedHash = claimHash(claim.text);
    if (claim.reviewedHash !== expectedHash) fail('Claim changed since review: ' + id + ' needs hash ' + expectedHash);

    for (const relation of claim.sources ?? []) {
      if (!atlasSources[relation.id]) fail('Unknown source ' + relation.id + ' in claim ' + id);
      if (!relation.locator) fail('Missing locator in claim ' + id);
      if (!['supports', 'qualifies', 'contrasts'].includes(relation.relation)) fail('Invalid relation in claim ' + id);
      supportingSources.add(relation.id);
    }
  }

  for (const [id, source] of Object.entries(atlasSources)) {
    if (source.pageUses?.proxy?.listed && !supportingSources.has(id)) fail('Listed source supports no registered claim: ' + id);
  }

  const rawCitations = proxySource.match(
    /\b[A-Z][A-Za-z'-]+(?:\s+(?:and\s+)?[A-Z][A-Za-z'-]+){0,5}\s+\((?:19|20)\d{2}/g,
  );
  if (rawCitations?.length) fail('Raw author-year prose remains outside the registry: ' + rawCitations.join('; '));
}

function validateSections(proxySource) {
  const coverage = atlasCoverage.proxy;
  const requiredIds = coverage.sectionPolicy?.requiredSectionIds ?? [];
  const registeredIds = Object.keys(atlasSections);
  const calls = Array.from(
    proxySource.matchAll(/\b(paperSection|sectionCitations)\(['"]([^'"]+)['"]\)/g),
    (match) => ({ kind: match[1], id: match[2] }),
  );
  const callCounts = new Map();
  const claimAssignments = new Map();
  const categoryAssignments = new Set();
  const contentAssignments = new Set();

  if (coverage.sectionPolicy?.status !== 'complete-for-declared-scope') {
    fail('Section review policy is not complete for the declared scope');
  }
  const displayPolicy = coverage.sectionPolicy?.citationDisplayPolicy;
  if (!displayPolicy?.inline || !displayPolicy?.auditOnly) {
    fail('Section citation-display policy is incomplete');
  }
  if (JSON.stringify([...requiredIds].sort()) !== JSON.stringify([...registeredIds].sort())) {
    fail('Required and registered reviewed-section IDs differ');
  }
  for (const item of coverage.sectionPolicy?.excludedSurfaces ?? []) {
    if (!item.surface || !item.reason) fail('Excluded page surface lacks a reason');
  }

  for (const call of calls) {
    if (!atlasSections[call.id]) fail('Page renders unknown citation section ' + call.id);
    const key = call.kind + ':' + call.id;
    callCounts.set(key, (callCounts.get(key) ?? 0) + 1);
  }

  for (const [id, section] of Object.entries(atlasSections)) {
    if (section.id !== id || section.page !== 'proxy') fail('Invalid section identity/page: ' + id);
    if (!section.title || !['claim-text', 'citations-only', 'audit-only'].includes(section.renderMode)) {
      fail('Incomplete section classification: ' + id);
    }
    if (section.renderMode === 'audit-only' && !section.displayReason) {
      fail('Audit-only section lacks a display reason: ' + id);
    }
    if (section.citationStatus !== 'verified' || section.completenessStatus !== 'complete-for-declared-scope') {
      fail('Unreviewed or incomplete page section: ' + id);
    }
    if (!section.reviewedAt || !section.claimIds?.length || !section.coverageCategoryIds?.length) {
      fail('Section lacks review, claims, or coverage requirements: ' + id);
    }

    const expectedHash = sectionHash(section);
    if (section.reviewedHash !== expectedHash) {
      fail('Section changed since review: ' + id + ' needs hash ' + expectedHash);
    }

    if (section.renderMode === 'audit-only') {
      for (const kind of ['paperSection', 'sectionCitations']) {
        const renderedCount = callCounts.get(kind + ':' + id) ?? 0;
        if (renderedCount !== 0) {
          fail('Audit-only section ' + id + ' unexpectedly renders with ' + kind);
        }
      }
    } else {
      const expectedCall = (section.renderMode === 'claim-text' ? 'paperSection:' : 'sectionCitations:') + id;
      if ((callCounts.get(expectedCall) ?? 0) !== 1) {
        fail('Section ' + id + ' is not rendered exactly once with ' + expectedCall.split(':')[0]);
      }
    }

    const sources = sectionSourceIds(section);
    for (const claimId of section.claimIds) {
      if (!atlasClaims[claimId]) fail('Section ' + id + ' references unknown claim ' + claimId);
      const assignments = claimAssignments.get(claimId) ?? [];
      assignments.push(id);
      claimAssignments.set(claimId, assignments);
    }

    for (const categoryId of section.coverageCategoryIds) {
      const category = coverage.categories?.[categoryId];
      if (!category) {
        fail('Section ' + id + ' requires unknown coverage category ' + categoryId);
        continue;
      }
      categoryAssignments.add(categoryId);
      if (!category.sourceIds.some((sourceId) => sources.has(sourceId))) {
        fail('Section ' + id + ' has no supporting source covering category ' + categoryId);
      }
    }

    for (const contentPath of section.contentPaths ?? []) {
      const value = valueAtPath(proxyContent, contentPath);
      if (value === undefined || value === null || normalize(value) === '') {
        fail('Section ' + id + ' has an empty or unknown content path ' + contentPath);
      }
      if (contentAssignments.has(contentPath)) fail('Content path is assigned to multiple sections: ' + contentPath);
      contentAssignments.add(contentPath);
    }
  }

  for (const claimId of Object.keys(atlasClaims)) {
    if (!claimAssignments.has(claimId)) fail('Registered claim belongs to no reviewed section: ' + claimId);
  }
  for (const categoryId of requiredCategories) {
    if (!categoryAssignments.has(categoryId)) fail('Coverage category belongs to no reviewed section: ' + categoryId);
  }
}

function validateCoverage() {
  const coverage = atlasCoverage.proxy;
  if (!coverage) return fail('Proxy-SVAR coverage declaration is missing');
  if (coverage.status !== 'audited-selected-guide') fail('Coverage status is not audited');
  if (coverage.saturation !== 'achieved-for-declared-scope') fail('Declared saturation is incomplete');
  if (!coverage.literatureCutoff || !coverage.reviewedAt) fail('Coverage date is incomplete');
  if (!Array.isArray(coverage.searchPasses) || coverage.searchPasses.length < 2) fail('Two search passes are required');

  for (const id of requiredCategories) {
    const category = coverage.categories?.[id];
    if (!category) {
      fail('Missing coverage category: ' + id);
      continue;
    }
    if (category.status !== 'covered' || !category.sourceIds?.length) fail('Uncovered category: ' + id);
    for (const sourceId of category.sourceIds ?? []) {
      if (!atlasSources[sourceId]) fail('Unknown source ' + sourceId + ' in coverage category ' + id);
    }
  }
  for (const item of coverage.candidateDecisions ?? []) {
    if (!item.candidate || !item.decision || !item.reason) fail('Incomplete candidate decision');
  }
}

function buildReport() {
  const coverage = atlasCoverage.proxy;
  const claims = Object.values(atlasClaims).sort((a, b) => a.id.localeCompare(b.id));
  const sections = Object.values(atlasSections).sort((a, b) => a.id.localeCompare(b.id));
  const inlineSectionCount = sections.filter((section) => section.renderMode !== 'audit-only').length;
  const auditOnlySectionCount = sections.length - inlineSectionCount;
  const sources = Object.values(atlasSources)
    .filter((source) => source.pageUses?.proxy?.listed)
    .sort((a, b) => a.pageUses.proxy.order - b.pageUses.proxy.order);
  const claimsBySource = new Map();
  for (const claim of claims) {
    for (const relation of claim.sources) {
      const ids = claimsBySource.get(relation.id) ?? [];
      ids.push(claim.id);
      claimsBySource.set(relation.id, ids);
    }
  }

  const lines = [
    '# Proxy-SVAR literature audit',
    '',
    '> Generated from the Atlas section, claim, source, and coverage registries. Edit the registries, not this report.',
    '',
    '## Audit boundary',
    '',
    coverage.scope,
    '',
    '- Review date: ' + coverage.reviewedAt,
    '- Literature cutoff: ' + coverage.literatureCutoffLabel,
    '- Status: ' + coverage.status,
    '- Saturation: ' + coverage.saturation,
    '- Inline citation rule: ' + coverage.sectionPolicy.citationDisplayPolicy.inline,
    '- Audit-only rule: ' + coverage.sectionPolicy.citationDisplayPolicy.auditOnly,
    '- Registered reviewed sections: ' + sections.length,
    '- Inline-cited sections: ' + inlineSectionCount,
    '- Audit-only sections: ' + auditOnlySectionCount,
    '- Registered claims: ' + claims.length,
    '- Publicly listed sources: ' + sources.length,
    '',
    'This is an audited selected guide for the teaching page, not a systematic review or a claim that every Proxy-SVAR publication is listed.',
    '',
    '## Section review and citation matrix',
    '',
    '| Section ID | Section | Citation display | Display reason | Claims | Required branches | Supporting sources | Status |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const section of sections) {
    const supportingSources = Array.from(sectionSourceIds(section), (id) => sourceLabel(atlasSources[id])).join('; ');
    const branches = section.coverageCategoryIds.map((id) => coverage.categories[id].label).join('; ');
    const status = section.citationStatus + ' / ' + section.completenessStatus;
    const displayMode = section.renderMode === 'audit-only' ? 'audit only' : 'inline citations';
    const displayReason = section.displayReason ?? 'Paper-specific claim or research-practice comparison.';
    lines.push('| ' + [
      section.id,
      section.title,
      displayMode,
      displayReason,
      section.claimIds.join('; '),
      branches,
      supportingSources,
      status,
    ].map(cell).join(' | ') + ' |');
  }

  lines.push(
    '',
    '## Claim-to-source matrix',
    '',
    '| Claim ID | Type | Priority | Status | Evidence and locator |',
    '| --- | --- | --- | --- | --- |',
  );

  for (const claim of claims) {
    const evidence = claim.sources.map((item) =>
      sourceLabel(atlasSources[item.id]) + ' - ' + item.locator + ' [' + item.relation + ']').join('; ');
    lines.push('| ' + [claim.id, claim.type, claim.priority, claim.status, evidence].map(cell).join(' | ') + ' |');
  }

  lines.push('', '## Coverage matrix', '', '| Category | Importance | Status | Sources |', '| --- | --- | --- | --- |');
  for (const category of Object.values(coverage.categories)) {
    const labels = category.sourceIds.map((id) => sourceLabel(atlasSources[id])).join('; ');
    lines.push('| ' + [category.label, category.importance, category.status, labels].map(cell).join(' | ') + ' |');
  }

  lines.push('', '## Deliberately non-citation surfaces', '', '| Surface | Reason |', '| --- | --- |');
  for (const item of coverage.sectionPolicy.excludedSurfaces) {
    lines.push('| ' + [item.surface, item.reason].map(cell).join(' | ') + ' |');
  }


  lines.push('', '## Public source registry', '', '| # | Source | Primary record | Claims supported |', '| ---: | --- | --- | --- |');
  for (const source of sources) {
    const year = source.displayYear ?? source.year;
    const publication = source.venue +
      (source.volume ? ' ' + source.volume + (source.issue ? '(' + source.issue + ')' : '') : '') +
      (source.pages ? ': ' + source.pages : source.articleNumber ? ', article ' + source.articleNumber : '');
    const citation = authors(source.authors) + ' (' + year + '), ' + source.title + '. ' + publication;
    const link = source.doi ? 'doi:' + source.doi : 'official page';
    lines.push('| ' + source.pageUses.proxy.order + ' | ' + cell(citation) + ' | [' + link + '](' + source.url + ') | ' +
      cell((claimsBySource.get(source.id) ?? []).join('; ')) + ' |');
  }

  lines.push('', '## Search and completeness record', '');
  for (const pass of coverage.searchPasses) {
    lines.push('### ' + pass.id, '', '- Completed: ' + pass.completedAt, '- Method: ' + pass.method, '- Result: ' + pass.result, '');
  }
  lines.push('## Candidate decisions', '', '| Candidate | Decision | Reason |', '| --- | --- | --- |');
  for (const item of coverage.candidateDecisions) {
    lines.push('| ' + [item.candidate, item.decision, item.reason].map(cell).join(' | ') + ' |');
  }
  lines.push(
    '',
    '## Reproduction',
    '',
    '- Check registries and report: node source/check_proxy_literature.mjs',
    '- Refresh after an intentional review: node source/check_proxy_literature.mjs --write-report',
    '',
  );
  return lines.join('\n');
}

if (args.has('--print-section-hashes')) {
  for (const section of Object.values(atlasSections).sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(section.id + ' ' + sectionHash(section));
  }
  process.exit(0);
}

if (args.has('--print-hashes')) {
  for (const claim of Object.values(atlasClaims).sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(claim.id + ' ' + claimHash(claim.text));
  }
  process.exit(0);
}

const proxySource = readFileSync(proxyPath, 'utf8');
validateSources();
validateClaims(proxySource);
validateSections(proxySource);
validateCoverage();
const report = buildReport();

if (args.has('--write-report')) writeFileSync(reportPath, report, 'utf8');
else if (!existsSync(reportPath)) fail('Generated report is missing; run with --write-report');
else if (readFileSync(reportPath, 'utf8') !== report) fail('Generated report is stale; run with --write-report after review');

if (errors.length) {
  console.error('Proxy-SVAR literature audit failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

const reviewedSections = Object.values(atlasSections);
const inlineCitedSections = reviewedSections.filter((section) => section.renderMode !== 'audit-only').length;
const listedSources = Object.values(atlasSources).filter((source) => source.pageUses?.proxy?.listed).length;
console.log('Proxy-SVAR literature audit passed: ' + Object.keys(atlasClaims).length + ' claims, ' +
  reviewedSections.length + ' reviewed sections (' + inlineCitedSections + ' inline-cited), ' +
  listedSources + ' listed sources, ' +
  requiredCategories.length + ' coverage categories.');

