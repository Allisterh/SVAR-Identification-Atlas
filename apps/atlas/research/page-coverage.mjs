import { pageSections } from './page-sections.mjs';
import { atlasClaims } from './claims.mjs';

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

const primaryPageScopes = {
  overview:
    'A primary-source-verified orientation to the SVAR identification problem, covariance-equivalent rotations, and the distinction between reduced-form fit and structural shock labels. It is not a systematic review.',
  recursive:
    'A primary-source-verified teaching guide to recursive short-run identification, representative monetary, oil, and fiscal implementations, one modern uncertain-zero extension, and the distinction between structural and generalized responses. It is not a systematic review.',
  sign:
    'A primary-source-verified selected guide to foundational sign-restriction designs, a canonical monetary application, representative fiscal and oil applications, rotation and mixed sign-zero algorithms, narrative and proxy hybrids, and model-consistent reporting. It is not a systematic review.',
  narrative:
    'A primary-source-verified selected guide to historical shock-series construction, formal narrative sign and historical-decomposition restrictions, event-inequality extensions, and correct Bayesian likelihood reweighting. It is not a systematic review of narrative identification.',
  'long-run':
    'A primary-source-verified selected guide to the Blanchard-Quah long-run zero, stationary and cointegrated implementations, representative common-trend, technology, and news applications, and the main reliability critique. It is not a systematic review.',
  'max-share':
    'A primary-source-verified selected guide to two benchmark variance-share designs, sequential penalty-function selection, joint multi-shock max-share, feasibility and uniqueness conditions, implementation across reduced-form draws, and the confounding-shock limit. It is not a systematic review.',
  'independent-shocks':
    'A primary-source-verified teaching guide to linear independent/non-Gaussian SVAR identification, estimator families, representative applications, and central assumption and causal-interpretation limits. It is not a systematic review.',
  heteroskedasticity:
    'A primary-source-verified selected guide to identification through changing variances, discrete, smooth, ARCH, nonparametric, stochastic-volatility, and endogenous-regime variants, representative applications, and the main weak-identification and nonlinear-causal limits. It is not a systematic review.',
};

const primaryGapResults = {
  overview:
    'Retained the foundational critique and orthogonalization discussion in Sims (1980) and the exact-identification rotation framework in Rubio-Ramirez, Waggoner, and Zha (2010); kept Atlas mechanics and navigation uncited.',
  recursive:
    'Retained foundational recursive geometry, three representative applied designs, one uncertain-zero extension, and generalized impulse responses as an explicitly nonstructural comparison.',
  sign:
    'Retained distinct foundational, application, computational, hybrid-identification, and reporting branches; removed paper names from the beginner guide and kept the final Atlas comparison section citation-free.',
  narrative:
    'Retained four distinct narrative shock-series origins, the formal shock-sign and historical-decomposition variants, two event-based applications, and the likelihood-truncation correction; removed paper names from the beginner guide and excluded adjacent general sign-restriction references.',
  'long-run':
    'Retained the benchmark bivariate design, the stationary-versus-cointegrated rank distinction, four representative applications or critiques, and the principal imprecision and aggregation warning; removed all paper names from the beginner guide.',
  'max-share':
    'Retained the two-shock Uhlig design, the constrained Barsky-Sims news selector, the sequential Caldara et al. penalty procedure, and Carriero-Volpicella\'s joint objective, dominance constraints, implementation, and confounding analysis; removed paper names from the beginner guide.',
  'independent-shocks':
    'Added kernel likelihood with partial independence and non-independent-component tensor identification; bounded several adjacent literatures outside the declared teaching scope.',
  heteroskedasticity:
    'Retained the covariance-regime foundation, the principal discrete, ARCH, smooth-transition, nonparametric, stochastic-volatility, and endogenous-regime branches, four representative applications, and explicit proportional-variance, weak-identification, and nonlinear-causal limits; removed paper names from the beginner guide.',
};

const primaryCandidateDecisions = {
  overview: [
    {
      candidate: 'Kilian and Lutkepohl (2017), book-length SVAR treatment',
      decision: 'exclude-from-public-list',
      reason: 'The overview no longer attributes its Atlas interface, rotation controls, or page map to the book; those are Atlas-authored explanations rather than literature claims.',
    },
    {
      candidate: 'Method-specific foundational and application papers',
      decision: 'defer-to-method-pages',
      reason: 'The overview is intentionally limited to the identification problem and rotation geometry; each method page owns its specialized completeness review.',
    },
  ],
  recursive: [
    {
      candidate: 'Christiano, Eichenbaum, and Evans (2005); Kilian (2009); Blanchard and Perotti (2002)',
      decision: 'included',
      reason: 'Together they represent influential monetary, oil-market, and fiscal implementations while making their distinct timing and institutional assumptions explicit.',
    },
    {
      candidate: 'Keweloh and Wang (2025), uncertain short-run restrictions',
      decision: 'included',
      reason: 'Adds a modern design that treats suspected zero restrictions as shrinkage targets rather than unquestioned exact truths.',
    },
    {
      candidate: 'Pesaran and Shin (1998), generalized impulse responses',
      decision: 'included-as-comparison',
      reason: 'Clarifies that order-invariant reduced-form conditional responses do not by themselves supply an economically identified structural shock.',
    },
    {
      candidate: 'Exhaustive recursive ordering catalogs and application surveys',
      decision: 'excluded-adjacent',
      reason: 'The declared scope is a compact teaching guide with representative applications, not a systematic application survey.',
    },
  ],
  sign: [
    {
      candidate: 'Faust (1998), Canova and De Nicol&ograve; (2002), and Uhlig (2005)',
      decision: 'included',
      reason: 'Together they cover robustness over admissible identifications, dynamic-correlation signs, and the canonical agnostic monetary-policy design.',
    },
    {
      candidate: 'Mountford and Uhlig (2009), Kilian and Murphy (2012), Antol&iacute;n-D&iacute;az and Rubio-Ram&iacute;rez (2018), and Braun and Br&uuml;ggemann (2023)',
      decision: 'included',
      reason: 'They provide representative fiscal and oil applications plus narrative and external-instrument extensions without turning the page into an application catalog.',
    },
    {
      candidate: 'Fry and Pagan sign-restriction critiques and median-target literature',
      decision: 'excluded-as-redundant-for-page-scope',
      reason: 'The selected guide states the feasible-path problem through Kilian and L&uuml;tkepohl and the oil-set problem through Kilian and Murphy; a full reporting-history survey is outside scope.',
    },
    {
      candidate: 'Baumeister-Hamilton structural priors and robust-Bayesian rotation-prior literature',
      decision: 'excluded-adjacent',
      reason: 'Prior sensitivity is important but requires a separate Bayesian-inference treatment; this page does not make a paper-dependent claim about a preferred rotation prior.',
    },
    {
      candidate: 'Frequentist moment-inequality confidence-set literature',
      decision: 'excluded-adjacent',
      reason: 'The page explains admissible-set geometry and mixed-restriction sampling, not a comprehensive comparison of frequentist set-inference procedures.',
    },
  ],
  narrative: [
    {
      candidate: 'Romer and Romer (1989, 2010), Ramey (2011), and Kilian (2008)',
      decision: 'included',
      reason: 'They represent distinct monetary, tax, spending-news, and oil-supply constructions and anchor the historical shock-series branch without implying that the four objects share one econometric status.',
    },
    {
      candidate: 'Antolin-Diaz and Rubio-Ramirez (2018)',
      decision: 'included',
      reason: 'This is the primary source for shock-sign restrictions, Type A and Type B historical-decomposition restrictions, the oil and monetary applications, and the inverse event-probability posterior weight.',
    },
    {
      candidate: 'Ludvigson, Ma, and Ng (2021)',
      decision: 'included',
      reason: 'Adds the distinct event-constraint and external-variable inequality design and makes clear that its stock and gold variables are not required to be valid Proxy-SVAR instruments.',
    },
    {
      candidate: 'Kilian and Lutkepohl (2017) and Arias, Rubio-Ramirez, and Waggoner (2018)',
      decision: 'exclude-from-public-list',
      reason: 'The beginner guide no longer attributes Atlas-authored instructions to these works; book-length history and general sign-and-zero inference are adjacent to, rather than necessary for, the verified claims retained here.',
    },
    {
      candidate: 'Exhaustive narrative-series catalogs, local-projection implementations, and event-study applications',
      decision: 'excluded-adjacent',
      reason: 'The declared scope is the construction-versus-within-SVAR distinction and the main formal event-restriction variants, not a systematic survey of every narrative shock series or downstream estimator.',
    },
  ],
  'long-run': [
    {
      candidate: 'Blanchard and Quah (1989)',
      decision: 'included',
      reason: 'Anchors the permanent-supply versus transitory-demand design and establishes that the identifying zero is cumulative rather than recursive on impact.',
    },
    {
      candidate: 'Kilian and Lutkepohl (2017), Chapter 10',
      decision: 'included',
      reason: 'Supplies the stationary long-run-covariance construction and the cointegration-rank warning needed to distinguish identifying zeros from mechanical zeros.',
    },
    {
      candidate: 'King, Plosser, Stock, and Watson (1991) and Gali (1999)',
      decision: 'included',
      reason: 'They represent the common-trend balanced-growth and labor-productivity technology branches without turning the page into a complete technology-shock survey.',
    },
    {
      candidate: 'Beaudry and Portier (2006) with Kurmann and Mertens (2014)',
      decision: 'included-as-claim-and-correction',
      reason: 'The pair shows both the productivity-news interpretation and the nonuniqueness failure that appears in higher-dimensional cointegrated specifications.',
    },
    {
      candidate: 'Faust and Leeper (1997)',
      decision: 'included',
      reason: 'Provides the principal primary-source warning about finite-sample long-run precision and aggregation across omitted variables and time.',
    },
    {
      candidate: 'Fisher, Enders-Lee, Shapiro-Watson, and exhaustive monetary or oil applications',
      decision: 'excluded-adjacent',
      reason: 'These are useful applications, but the selected page already covers the main identification geometries and failure modes; an application catalog is outside scope.',
    },
  ],
  'max-share': [
    {
      candidate: 'Uhlig (2004) and Barsky and Sims (2011)',
      decision: 'included',
      reason: 'They provide two distinct benchmark designs: a two-shock real-GNP variance search and a technology-news selector combining an impact exclusion with a finite-horizon TFP variance objective.',
    },
    {
      candidate: 'Caldara et al. (2016) and Carriero and Volpicella (2025)',
      decision: 'included-as-methodological-progression',
      reason: 'The pair makes the sequential-ordering issue and the modern joint objective, target-dominance constraints, feasibility conditions, and confounding analysis explicit.',
    },
    {
      candidate: 'Francis, Owyang, and Roush (2007), flexible finite-horizon technology-shock identification',
      decision: 'excluded-as-redundant-for-page-scope',
      reason: 'Barsky and Sims directly acknowledge this closely related unpublished design; the selected guide retains the published Barsky-Sims implementation and does not claim an exhaustive origin history.',
    },
    {
      candidate: 'Giannone, Lenza, and Reichlin (2019); Kurmann and Sims (2021); Dieppe, Francis, and Kindberg-Hanlon (2021)',
      decision: 'excluded-as-covered-branch',
      reason: 'These works develop the confounding-shock critique, but the page makes only the narrower analytical and simulation claims verified directly in Carriero and Volpicella; a critique-history survey is outside scope.',
    },
    {
      candidate: 'Arias, Rubio-Ramirez, and Waggoner (2018) and Kilian and Lutkepohl (2017)',
      decision: 'exclude-from-public-list',
      reason: 'General set-inference and FEVD background no longer serve as citations for the beginner guide or Atlas-authored mechanics; every retained attribution is verified against its own primary paper.',
    },
    {
      candidate: 'Credit, inflation-target, sentiment, frequency-domain, and exhaustive objective-based applications',
      decision: 'excluded-adjacent',
      reason: 'The declared scope is the principal one-shock, sequential, and joint identification designs and their main confounding limit, not a systematic application catalog.',
    },
  ],
  'independent-shocks': [
    {
      candidate: 'Hafner, Herwartz, and Wang (2025), kernel maximum likelihood and partial independence',
      decision: 'included',
      reason: 'Fills an important flexible-likelihood and partial-independence branch absent from the earlier page.',
    },
    {
      candidate: 'Mesters and Zwiernik (2024), non-independent component analysis',
      decision: 'included',
      reason: 'Qualifies the independence assumption by showing what selected tensor restrictions can recover under matched dependence structures.',
    },
    {
      candidate: 'FastICA, JADE, and related algorithm catalogs',
      decision: 'excluded',
      reason: 'The page names algorithmic ICA as a family but does not attempt an exhaustive computational survey.',
    },
    {
      candidate: 'Generalized-covariance set inference',
      decision: 'excluded-adjacent',
      reason: 'A relevant extension, but outside this page\'s compact comparison of core estimator families and diagnostics.',
    },
    {
      candidate: 'Nonfundamental SVARMA and DSGE dynamic extensions',
      decision: 'excluded-adjacent',
      reason: 'The declared scope is linear contemporaneous shock orientation in an invertible VAR teaching setup.',
    },
  ],
  heteroskedasticity: [
    {
      candidate: 'Sentana and Fiorentini (2001) and Rigobon (2003)',
      decision: 'included',
      reason: 'They establish the general variance-path logic and the canonical two-regime simultaneous-equation result, including the failure under proportional covariance changes.',
    },
    {
      candidate: 'Lanne, L&uuml;tkepohl, and Maciejowska (2010); Milunovich and Yang (2013); L&uuml;tkepohl and Netsunajev (2017)',
      decision: 'included-as-parametric-variants',
      reason: 'Together they cover Markov-switching covariances, structural ARCH, and an estimated smooth variance transition without suggesting that the Atlas midpoint split implements any of these estimators.',
    },
    {
      candidate: 'Lewis (2021), Bertsche and Braun (2022), and Virolainen (2025)',
      decision: 'included-as-modern-variants',
      reason: 'They add nonparametric volatility moments, latent stochastic volatility, and observation-dependent regime probabilities, including partial-identification and diagnostic results.',
    },
    {
      candidate: 'Rigobon and Sack (2003), Normandin and Phaneuf (2004), Lewis (2021), and Bertsche and Braun (2022)',
      decision: 'included-as-representative-applications',
      reason: 'The selected applications show simultaneous-causality identification, restriction testing, fiscal measurement, and external-instrument overidentification without becoming an application catalog.',
    },
    {
      candidate: 'Montiel Olea, Plagborg-M&oslash;ller, and Qian (2022) and Koles&aacute;r and Plagborg-M&oslash;ller (2025)',
      decision: 'included-as-limits',
      reason: 'They make relative-variance separation, finite-sample weakness, and the fragility of causal interpretation under nonlinear data generation explicit.',
    },
    {
      candidate: 'Kilian and L&uuml;tkepohl (2017), Chapter 14, and broad heteroskedastic-SVAR surveys',
      decision: 'exclude-from-public-list',
      reason: 'The retained claims are verified directly against their primary papers; general background sources are not needed to cite Atlas-authored mechanics or the beginner guide.',
    },
    {
      candidate: 'Exhaustive break-date methods, time-varying-impact models, and downstream empirical applications',
      decision: 'excluded-adjacent',
      reason: 'The declared scope is identification from changing variances under stable structural directions and its principal variants and limits, not every model with parameter change or volatility.',
    },
  ],
};

function sourceRelations(section) {
  const relations = [...(section.sources ?? [])];
  for (const claimId of section.claimIds ?? []) {
    relations.push(...(atlasClaims[claimId]?.sources ?? []));
  }
  return relations;
}

function categoryRecords(pageSectionsForPage) {
  const records = {};
  for (const categoryId of Object.keys(labels)) {
    const sourceIds = new Set();
    for (const section of pageSectionsForPage) {
      if (!section.coverageCategoryIds.includes(categoryId)) continue;
      for (const relation of sourceRelations(section)) sourceIds.add(relation.id);
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
  const isPrimaryClaimPage = Object.values(atlasClaims).some(
    (claim) => claim.page === page && claim.evidenceContract === 'primary-v1',
  );
  const sourceCount = new Set(
    sections.flatMap((section) => sourceRelations(section).map((relation) => relation.id)),
  ).size;
  const primaryClaimCount = Object.values(atlasClaims).filter(
    (claim) => claim.page === page && claim.evidenceContract === 'primary-v1',
  ).length;

  return {
    page,
    status: isPrimaryClaimPage
      ? 'primary-claim-audited-selected-guide'
      : 'bibliographic-section-audited',
    scope: isPrimaryClaimPage
      ? primaryPageScopes[page]
      : `A bibliographic and section-level teaching-page guide for ${page}; migration to the primary atomic-claim contract remains pending.`,
    literatureCutoff: '2026-07-19',
    literatureCutoffLabel: '19 July 2026',
    reviewedAt: '2026-07-19',
    saturation: isPrimaryClaimPage ? 'achieved-for-declared-scope' : 'not-assessed-under-primary-contract',
    verificationAuthority: {
      primary: 'Raw primary paper text or a stable public copy of the primary paper, recorded with an exact locator and evidence paraphrase.',
      resolution: 'KnowledgeVault paper notes and verified BibTeX records resolve identity, version, DOI, and local provenance; they do not by themselves establish claim support.',
      fallback: 'Publisher, DOI, journal, NBER, or another stable scholarly public record resolves bibliographic ambiguity.',
      publicOutput: 'The Atlas exposes only DOI or public source links; private vault paths remain development metadata.',
    },
    searchPasses: [
      {
        id: 'vault-note-and-citation-pass',
        completedAt: '2026-07-19',
        method: isPrimaryClaimPage
          ? 'Used vault notes and verified BibTeX records to resolve every named paper, then checked each retained attribution against the raw primary paper with a concrete locator.'
          : 'Resolved named papers and section-support relations against KnowledgeVault notes and verified BibTeX records; primary semantic entailment remains to be migrated.',
        result: isPrimaryClaimPage
          ? `Verified the page bibliography and ${primaryClaimCount} atomic paper-dependent claims; the page currently lists ${sourceCount} public sources.`
          : `Verified the page bibliography and section map; the page currently lists ${sourceCount} public sources.`,
      },
      {
        id: 'primary-gap-and-completeness-pass',
        completedAt: '2026-07-19',
        method: isPrimaryClaimPage
          ? 'Searched the vault by method family, estimator, application, and limitation; checked candidate papers in their primary text and recorded included and excluded branches below.'
          : 'Checked version conflicts and named literature gaps against publisher, DOI, journal, NBER, or stable scholarly records.',
        result: isPrimaryClaimPage
          ? primaryGapResults[page]
          : 'Corrected bibliographic gaps without claiming primary semantic completeness.',
      },
    ],
    categories: categoryRecords(sections),
    sectionPolicy: {
      status: isPrimaryClaimPage ? 'complete-for-declared-scope' : 'primary-contract-migration-pending',
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
    candidateDecisions: isPrimaryClaimPage && page === 'independent-shocks'
      ? [
        {
          candidate: 'Hafner, Herwartz, and Wang (2025), kernel maximum likelihood and partial independence',
          decision: 'included',
          reason: 'Fills an important flexible-likelihood and partial-independence branch absent from the earlier page.',
        },
        {
          candidate: 'Mesters and Zwiernik (2024), non-independent component analysis',
          decision: 'included',
          reason: 'Qualifies the independence assumption by showing what selected tensor restrictions can recover under matched dependence structures.',
        },
        {
          candidate: 'FastICA, JADE, and related algorithm catalogs',
          decision: 'excluded',
          reason: 'The page names algorithmic ICA as a family but does not attempt an exhaustive computational survey.',
        },
        {
          candidate: 'Generalized-covariance set inference',
          decision: 'excluded-adjacent',
          reason: 'A relevant extension, but outside this page’s compact comparison of core estimator families and diagnostics.',
        },
        {
          candidate: 'Nonfundamental SVARMA and DSGE dynamic extensions',
          decision: 'excluded-adjacent',
          reason: 'The declared scope is linear contemporaneous shock orientation in an invertible VAR teaching setup.',
        },
      ]
      : primaryCandidateDecisions[page] ?? [],
  };
}

export const pageCoverage = Object.fromEntries(pages.map((page) => [page, coverageFor(page)]));

export default pageCoverage;
