import { atlasClaims } from './claims.mjs';
import { atlasCoverage } from './coverage.mjs';
import { atlasSections } from './sections.mjs';
import { atlasSources } from './sources.mjs';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatAuthors(authors) {
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(', ')}, and ${authors.at(-1)}`;
}

function formatPublication(source) {
  const volumeIssue = source.volume
    ? ` ${source.volume}${source.issue ? `(${source.issue})` : ''}`
    : source.issue
      ? `, ${source.issue}`
      : '';
  const locator = source.pages
    ? `: ${source.pages}`
    : source.articleNumber
      ? `, article ${source.articleNumber}`
      : '';
  return `${source.venue}${volumeIssue}${locator}`;
}

function formatSourceReference(source, pageUse) {
  const authorText = formatAuthors(source.authors);
  const yearText = source.displayYear ?? source.year;
  const titleText = source.type === 'book' ? `<em>${escapeHtml(source.title)}</em>` : `“${escapeHtml(source.title)}”`;
  const linkLabel = source.doi ? `doi:${source.doi}` : 'public source';

  return `<span data-source-id="${escapeHtml(source.id)}">
    ${escapeHtml(authorText)} (${escapeHtml(yearText)}), ${titleText}. ${escapeHtml(formatPublication(source))}.
    <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabel)}</a>
    &mdash; ${escapeHtml(pageUse.annotation)}
  </span>`;
}

export function paperClaim(id) {
  const claim = atlasClaims[id];
  if (!claim) {
    throw new Error(`Unknown Atlas paper claim: ${id}`);
  }
  return `<span class="paper-claim" data-claim-id="${escapeHtml(id)}" data-claim-status="${escapeHtml(claim.status)}">${escapeHtml(claim.text)}</span>`;
}

function familyName(author) {
  const parts = String(author).trim().split(/\s+/);
  if (parts.at(-1) === 'Olea') return 'Montiel Olea';
  return parts.at(-1);
}

function compactSourceLabel(source) {
  const names = source.authors.map(familyName);
  const authorText = names.length === 1
    ? names[0]
    : names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names[0]} et al.`;
  return `${authorText} (${source.displayYear ?? source.year})`;
}

function sectionSources(section) {
  const sourceIds = new Set();
  for (const relation of section.sources ?? []) {
    sourceIds.add(typeof relation === 'string' ? relation : relation.id);
  }
  for (const claimId of section.claimIds) {
    for (const relation of atlasClaims[claimId]?.sources ?? []) sourceIds.add(relation.id);
  }
  return Array.from(sourceIds, (id) => atlasSources[id]);
}

function claimCitations(claim) {
  const links = claim.sources
    .map(({ id }) => atlasSources[id])
    .map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" data-source-id="${escapeHtml(source.id)}">${escapeHtml(compactSourceLabel(source))}</a>`)
    .join('; ');
  return `<span class="claim-citations" aria-label="Sources">${links}</span>`;
}

function inlineVerifiedClaims(section, html) {
  let output = html;
  for (const claimId of section.claimIds) {
    const claim = atlasClaims[claimId];
    if (!claim || claim.evidenceContract !== 'primary-v1') continue;
    if (!output.includes(claim.text)) {
      throw new Error(`Atlas claim ${claimId} is not present verbatim in section ${section.id}`);
    }
    output = output.replace(
      claim.text,
      `<span class="paper-claim" data-claim-id="${escapeHtml(claimId)}" data-claim-status="verified">${claim.text}${claimCitations(claim)}</span>`,
    );
  }
  return output;
}

export function sectionCitations(id) {
  const section = atlasSections[id];
  if (!section) throw new Error(`Unknown Atlas citation section: ${id}`);
  const links = sectionSources(section)
    .map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" data-source-id="${escapeHtml(source.id)}">${escapeHtml(compactSourceLabel(source))}</a>`)
    .join('; ');
  return `<span class="section-citations" data-citation-section-id="${escapeHtml(id)}"><span class="section-citations__label">Sources:</span> ${links}</span>`;
}

export function paperSection(id) {
  const section = atlasSections[id];
  if (!section) throw new Error(`Unknown Atlas citation section: ${id}`);
  if (section.renderMode !== 'claim-text') {
    throw new Error(`Atlas citation section ${id} does not render claim text`);
  }
  const text = section.claimIds.map((claimId) => {
    const claim = atlasClaims[claimId];
    if (!claim) throw new Error(`Unknown Atlas paper claim: ${claimId}`);
    return escapeHtml(claim.text);
  }).join(' ');
  return `<span class="paper-section" data-paper-section-id="${escapeHtml(id)}">${text}</span>${sectionCitations(id)}`;
}

export function citedText(id, html) {
  const section = atlasSections[id];
  if (!section) throw new Error(`Unknown Atlas citation section: ${id}`);
  if (section.renderMode !== 'citations-only') {
    throw new Error(`Atlas citation section ${id} does not accept authored text`);
  }
  const hasPrimaryClaims = section.claimIds.some((claimId) => atlasClaims[claimId]?.evidenceContract === 'primary-v1');
  if (hasPrimaryClaims) {
    return `<span class="paper-section" data-paper-section-id="${escapeHtml(id)}" data-citation-section-id="${escapeHtml(id)}">${inlineVerifiedClaims(section, html)}</span>`;
  }
  return `<span class="paper-section" data-paper-section-id="${escapeHtml(id)}">${html}</span>${sectionCitations(id)}`;
}

export function reviewedText(id, html) {
  const section = atlasSections[id];
  if (!section) throw new Error(`Unknown Atlas reviewed section: ${id}`);
  if (section.renderMode === 'audit-only') return html;
  if (section.renderMode === 'citations-only') return citedText(id, html);
  throw new Error(`Atlas reviewed section ${id} requires claim-text rendering`);
}

export function literatureReferences(page) {
  return Object.values(atlasSources)
    .map((source) => ({ source, pageUse: source.pageUses?.[page] }))
    .filter(({ pageUse }) => pageUse?.listed)
    .sort((left, right) => left.pageUse.order - right.pageUse.order)
    .map(({ source, pageUse }) => formatSourceReference(source, pageUse));
}

export function literatureAuditMeta(page) {
  const coverage = atlasCoverage[page];
  if (!coverage) return '';
  const sourceCount = literatureReferences(page).length;
  return `${sourceCount} audited sources · cutoff ${coverage.literatureCutoffLabel}`;
}

export { atlasClaims, atlasCoverage, atlasSections, atlasSources };
