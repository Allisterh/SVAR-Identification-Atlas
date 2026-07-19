import { pageCoverage } from './page-coverage.mjs';

export const atlasCoverage = {
  ...pageCoverage,
  proxy: {
    page: 'proxy',
    status: 'primary-claim-audited-selected-guide',
    scope:
      'Selected foundational, estimator, identification, weak-instrument, bootstrap, Bayesian/set-identification, multiple-proxy, and representative application sources verified claim by claim against primary texts; this is not a systematic review.',
    literatureCutoff: '2026-07-19',
    literatureCutoffLabel: '19 July 2026',
    reviewedAt: '2026-07-19',
    saturation: 'achieved-for-declared-scope',
    searchPasses: [
      {
        id: 'vault-branch-map',
        completedAt: '2026-07-15',
        method:
          'Reviewed the Proxy-SVAR specialist overview, linked source-backed paper notes, citation records, and the overview branches for weak proxies, invertibility, bootstrap, Bayesian, high-frequency, multi-proxy, and application work.',
        result:
          'Established the initial source set and exposed missing one-paper-per-entry coverage for recent weak-proxy and multi-proxy diagnostics.',
      },
      {
        id: 'primary-publisher-verification',
        completedAt: '2026-07-15',
        method:
          'Checked the candidate set against publisher or official working-paper records and performed targeted branch searches for foundational attribution, weak identification, partial invertibility, bootstrap inference, Bayesian/set inference, multiple proxies, and representative applications.',
        result:
          'Corrected version-of-record metadata and added the 2024 weak-proxy strategy and 2025 correlated-shock diagnostic; no further source changed a required core coverage category.',
      },
      {
        id: 'atomic-primary-claim-audit',
        completedAt: '2026-07-19',
        method:
          'Re-read each visible Proxy-SVAR attribution against the primary article, book chapter, or public author/publisher copy; split bundled statements into one-source atomic claims and removed paper citations from Atlas-authored teaching prose.',
        result:
          'Replaced the legacy bundled claim records with 17 primary-v1 claims, one for every publicly listed Proxy-SVAR source, while keeping the reader guide and applied diagnostic synthesis citation-free.',
      },
    ],
    categories: {
      foundational: {
        label: 'Foundational external-instrument formulation',
        importance: 'core',
        status: 'covered',
        sourceIds: ['stock-watson-2012', 'mertens-ravn-2013'],
      },
      identification: {
        label: 'Identification conditions and structural object',
        importance: 'core',
        status: 'covered',
        sourceIds: [
          'mertens-ravn-2013',
          'montiel-olea-stock-watson-2021',
          'miranda-agrippino-ricco-2023',
        ],
      },
      estimator: {
        label: 'Estimator, normalization, and implementation',
        importance: 'core',
        status: 'covered',
        sourceIds: ['mertens-ravn-2013', 'kilian-lutkepohl-2017'],
      },
      weakIdentification: {
        label: 'Weak-proxy identification and inference',
        importance: 'core',
        status: 'covered',
        sourceIds: [
          'montiel-olea-stock-watson-2021',
          'angelini-cavaliere-fanelli-2024',
        ],
      },
      bootstrap: {
        label: 'Bootstrap validity and small-sample alternatives',
        importance: 'core',
        status: 'covered',
        sourceIds: [
          'jentsch-lunsford-2019',
          'jentsch-lunsford-2022',
          'bruns-lutkepohl-2023',
        ],
      },
      contaminationAndInvertibility: {
        label: 'Information contamination, timing, and invertibility',
        importance: 'core',
        status: 'covered',
        sourceIds: ['jarocinski-karadi-2020', 'miranda-agrippino-ricco-2023'],
      },
      bayesianAndSetInference: {
        label: 'Bayesian and set-identified Proxy-SVAR inference',
        importance: 'core',
        status: 'covered',
        sourceIds: [
          'arias-rubio-ramirez-waggoner-2021',
          'giacomini-kitagawa-read-2022',
          'braun-brueggemann-2023',
        ],
      },
      multipleProxies: {
        label: 'Multiple proxies, assignment, rank, and shock orthogonality',
        importance: 'core',
        status: 'covered',
        sourceIds: [
          'angelini-cavaliere-fanelli-2024',
          'giacomini-kitagawa-read-2022',
          'bruns-lutkepohl-mcneil-2025',
        ],
      },
      representativeApplications: {
        label: 'Representative fiscal, monetary, oil, and carbon applications',
        importance: 'representative',
        status: 'covered',
        sourceIds: [
          'mertens-ravn-2013',
          'gertler-karadi-2015',
          'jarocinski-karadi-2020',
          'kanzig-2021-oil-supply-news',
          'kanzig-2023-carbon-pricing-r2025',
        ],
      },
      handbook: {
        label: 'Handbook or book-length treatment',
        importance: 'core',
        status: 'covered',
        sourceIds: ['kilian-lutkepohl-2017'],
      },
    },
    sectionPolicy: {
      status: 'complete-for-declared-scope',
      citationDisplayPolicy: {
        inline: 'Paper-specific contribution, result, attribution, or research-practice comparison.',
        auditOnly: 'Atlas-authored orientation, interaction guidance, or synthesis with evidence retained in the audit.',
      },
      requiredSectionIds: [
        'proxy.hero.overview',
        'proxy.lab.overview',
        'proxy.lab.criterion',
        'proxy.lab.irfs',
        'proxy.literature.overview',
        'proxy.questions',
        'proxy.reader.0',
        'proxy.reader.1',
        'proxy.reader.2',
        'proxy.reader.3',
        'proxy.literature.0',
        'proxy.literature.1',
        'proxy.literature.2',
        'proxy.literature.3',
        'proxy.literature.4',
      ],
      excludedSurfaces: [
        {
          surface: 'Reader-guide heading and section navigation',
          reason: 'Atlas navigation and comparison prose; it makes no paper-dependent contribution claim.',
        },
        {
          surface: 'Rotation controls, live status labels, canvases, and IRF display controls',
          reason: 'Interactive UI and generated outputs whose interpretation is covered by the adjacent audited section.',
        },
        {
          surface: 'Next-page navigation and MATLAB disclosure',
          reason: 'Product navigation and optional replication access, not literature claims.',
        },
      ],
    },


    candidateDecisions: [
      {
        candidate: 'Stock (2008) SVAR-IV lecture material',
        decision: 'exclude-from-public-list',
        reason:
          'The origin is acknowledged through the published Stock–Watson application and the Montiel Olea–Stock–Watson historical discussion; the Atlas list requires a stable public source record.',
      },
      {
        candidate: 'Testing for strong exogeneity in Proxy-VARs',
        decision: 'defer',
        reason:
          'The vault contains a substantive working-paper note, but the pilot public list prioritizes publisher-stable sources and already covers maintained-exogeneity tests through the published partial-invertibility and multi-proxy branches.',
      },
      {
        candidate: 'Exogenous uncertainty and the identification of structural vector autoregressions with external instruments',
        decision: 'exclude-as-redundant-for-page-scope',
        reason:
          'Its multi-instrument rank contribution remains important in the vault, but the shorter Atlas bridge uses the newer weak-proxy and correlated-shock papers for the applied checklist it presents.',
      },
    ],
  },
};

export default atlasCoverage;
