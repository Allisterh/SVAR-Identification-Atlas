import { pageSections } from './page-sections.mjs';

const pages = [
  'overview',
  'recursive',
  'sign',
  'narrative',
  'long-run',
  'max-share',
  'independent-shocks',
  'heteroskedasticity',
];

const labels = {
  core: 'Core identifying idea and structural object',
  origins: 'Foundational origin and early development',
  implementation: 'Estimator, computation, and normalization',
  applications: 'Representative applications and extensions',
  inference: 'Set, sampling, or posterior inference',
  limits: 'Diagnostics, weak information, and interpretation limits',
};

function categoryRecords(pageSectionsForPage) {
  const records = {};
  for (const categoryId of Object.keys(labels)) {
    const sourceIds = new Set();
    for (const section of pageSectionsForPage) {
      if (!section.coverageCategoryIds.includes(categoryId)) continue;
      for (const relation of section.sources ?? []) sourceIds.add(relation.id);
    }
    if (sourceIds.size) {
      records[categoryId] = {
        label: labels[categoryId],
        importance: ['core', 'origins', 'limits'].includes(categoryId) ? 'core' : 'representative',
        status: 'covered',
        sourceIds: [...sourceIds],
      };
    }
  }
  return records;
}

function coverageFor(page) {
  const sections = Object.values(pageSections).filter((section) => section.page === page);
  const sourceCount = new Set(
    sections.flatMap((section) => (section.sources ?? []).map((relation) => relation.id)),
  ).size;

  return {
    page,
    status: 'audited-selected-guide',
    scope:
      `A source-verified teaching-page guide for ${page}, covering the core identifying idea, origins, implementation, representative applications, inference where relevant, and central limitations. It is not a systematic review.`,
    literatureCutoff: '2026-07-16',
    literatureCutoffLabel: '16 July 2026',
    reviewedAt: '2026-07-16',
    saturation: 'achieved-for-declared-scope',
    verificationAuthority: {
      primary: 'KnowledgeVault paper note plus its verified individual BibTeX record.',
      fallback: 'Publisher, DOI, journal, NBER, or stable scholarly public record when the paper is absent from the vault or its version is ambiguous.',
      publicOutput: 'The Atlas exposes only DOI or public source links; private vault paths remain development metadata.',
    },
    searchPasses: [
      {
        id: 'vault-note-and-citation-pass',
        completedAt: '2026-07-16',
        method:
          'Resolved every named paper and section-support relation against absorbed KnowledgeVault notes and verified BibTeX records; normalized title, author, version year, venue, DOI, and public URL.',
        result:
          `Verified the page bibliography and section evidence map; the page currently lists ${sourceCount} public sources.`,
      },
      {
        id: 'primary-gap-and-completeness-pass',
        completedAt: '2026-07-16',
        method:
          'Checked sources missing from the vault, version conflicts, and explicitly named but previously unlisted literature branches against publisher, DOI, journal, NBER, or stable scholarly records.',
        result:
          'Corrected version-of-record years and filled important origin or critique gaps without turning the teaching page into a systematic review.',
      },
    ],
    categories: categoryRecords(sections),
    sectionPolicy: {
      status: 'complete-for-declared-scope',
      citationDisplayPolicy: {
        inline: 'Paper-specific contribution, result, attribution, or research-practice comparison.',
        auditOnly: 'Atlas-authored orientation, interaction guidance, product explanation, or synthesis with evidence retained in the audit.',
      },
      requiredSectionIds: sections.map((section) => section.id),
      excludedSurfaces: [
        {
          surface: 'Navigation, rotation controls, live status labels, canvases, and response-display controls',
          reason: 'Interface and generated output; interpretation is covered by adjacent reviewed sections.',
        },
        {
          surface: 'MATLAB disclosure, next-page navigation, and footer',
          reason: 'Product and replication navigation rather than research claims.',
        },
      ],
    },
    candidateDecisions: [],
  };
}

export const pageCoverage = Object.fromEntries(pages.map((page) => [page, coverageFor(page)]));

export default pageCoverage;
