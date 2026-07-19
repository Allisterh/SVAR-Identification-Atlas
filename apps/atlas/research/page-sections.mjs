const reviewedHashes = {
  'heteroskedasticity.hero.overview': 'a74a8657ec2f6db1',
  'heteroskedasticity.lab.criterion': '279e0314b2dfdc44',
  'heteroskedasticity.lab.irfs': '490a0c03adae07a2',
  'heteroskedasticity.lab.overview': '2d4d90b09fa85ec3',
  'heteroskedasticity.literature.0': 'f2488d3394d2a42d',
  'heteroskedasticity.literature.1': '9f1d6a48ff71761c',
  'heteroskedasticity.literature.2': '18533622e7c05a2b',
  'heteroskedasticity.literature.3': '2ad991035dfcd4c3',
  'heteroskedasticity.literature.overview': '84c13d2c9429be54',
  'heteroskedasticity.questions': 'cd3eaa1cfe29f5f3',
  'heteroskedasticity.reader.0': '24f25ecd60c72344',
  'heteroskedasticity.reader.1': 'cb97bbfc78f80739',
  'heteroskedasticity.reader.2': '0183100bb0bc90fe',
  'heteroskedasticity.reader.3': '356bc4cdc5875759',
  'heteroskedasticity.reader.overview': 'e63b8c0584f43ec6',
  'independent-shocks.hero.overview': 'b0440fea332201b0',
  'independent-shocks.lab.criterion': '35e710cda23ef4e2',
  'independent-shocks.lab.irfs': '81f369c3bab1e9fe',
  'independent-shocks.lab.overview': '617fc89d988f5ef6',
  'independent-shocks.literature.0': '787932ef942bcb40',
  'independent-shocks.literature.1': 'a3e02203e41d9a65',
  'independent-shocks.literature.2': '19de8ff5e461a622',
  'independent-shocks.literature.3': 'c0522f584742cba8',
  'independent-shocks.literature.overview': 'd24b01f63f5f94d5',
  'independent-shocks.questions': 'd70cdfd71f38016c',
  'independent-shocks.reader.0': '4db7d8f66be9cb86',
  'independent-shocks.reader.1': '40f4ebe877265f9c',
  'independent-shocks.reader.2': '3818d6cd0cac20e7',
  'independent-shocks.reader.3': '869126a08a128e92',
  'independent-shocks.reader.overview': '526849aa7abdbf83',
  'long-run.hero.overview': 'c6acefb5c1ad87be',
  'long-run.lab.criterion': '2f6adbbc1df40f98',
  'long-run.lab.irfs': '97f07541a295b074',
  'long-run.lab.overview': '81ea3dbe34db3298',
  'long-run.literature.0': 'd93885cbdca4eda5',
  'long-run.literature.1': '8b3fb35eee7b6747',
  'long-run.literature.2': '9310028ccd180b83',
  'long-run.literature.3': '71e7b75bfa9480f7',
  'long-run.literature.overview': 'eab9e120c77f6a65',
  'long-run.questions': '1781d479a14c7b04',
  'long-run.reader.0': '9df9bfbda87ff782',
  'long-run.reader.1': '71e05c09ab89534b',
  'long-run.reader.2': 'fd2c4e7506a0ca01',
  'long-run.reader.overview': '8302b29ef27047ae',
  'max-share.hero.overview': '2b596f85d161aa75',
  'max-share.lab.criterion': 'fe5a91784921eddc',
  'max-share.lab.irfs': '2939905e952ed30f',
  'max-share.lab.overview': 'd8306ca29dfedf5b',
  'max-share.literature.0': 'e27789aaed8e08bb',
  'max-share.literature.1': 'cc52ce3b90b62837',
  'max-share.literature.2': 'ce546bd9d0f83b58',
  'max-share.literature.3': 'bdcbddcf93e4dbb3',
  'max-share.literature.4': '8eeef9bd0a451145',
  'max-share.literature.overview': 'e6222d03ced32752',
  'max-share.questions': 'a7e792c49856eaca',
  'max-share.reader.0': '55764a255056295d',
  'max-share.reader.1': '06e2cc4e89721be0',
  'max-share.reader.2': '617dcb38daa93bfa',
  'max-share.reader.3': '9f12aa0bac25a88b',
  'narrative.hero.overview': '20776d8ea1c4e2bc',
  'narrative.lab.criterion': 'db9ecb581dc6526d',
  'narrative.lab.irfs': '9b30a0c19a0ce207',
  'narrative.lab.overview': '9e043d392727f234',
  'narrative.literature.0': '9f59b2f27f6d828a',
  'narrative.literature.1': '2f84b91e4d003d8d',
  'narrative.literature.2': '471e8cbee3a00bbd',
  'narrative.literature.3': '84a8cb507f370696',
  'narrative.literature.4': 'e79251dd7d101a8c',
  'narrative.literature.overview': 'e120741d054224a3',
  'narrative.questions': 'aab0f16f6755e95d',
  'narrative.reader.0': '4a6384aaf04504ca',
  'narrative.reader.1': 'f48554cbf0be338d',
  'narrative.reader.2': 'a63455eb9a5fa2b2',
  'narrative.reader.3': '0576f9be6a822dbc',
  'overview.hero.overview': '040681b8f6b30558',
  'overview.literature.complements': '530b950d88f8ff55',
  'overview.literature.lead': '5fbac99cb68e4c00',
  'overview.literature.limits': '6e3a0783a61e8170',
  'overview.literature.origins': 'dd8961dafe74c4ab',
  'overview.literature.rotations': '5d92c60bd599e881',
  'overview.questions': '880a150f348f6599',
  'overview.reader': '0f95c0a6ccb1d621',
  'overview.setup': 'da5fc463e2c77c4c',
  'recursive.hero.overview': '84f1074d9bde583c',
  'recursive.lab.criterion': '2d673b839840ea7a',
  'recursive.lab.irfs': '7bafc4212b935572',
  'recursive.lab.overview': '22a7ccc903b4643e',
  'recursive.literature.0': '3b191b9bd7126391',
  'recursive.literature.1': 'f052b3af31172a9f',
  'recursive.literature.2': '149eaa288982b651',
  'recursive.literature.3': '6291caf0c009081a',
  'recursive.literature.overview': 'a0955f3566506819',
  'recursive.questions': '80440b0d87aef88c',
  'recursive.reader.0': '5ccb1a2e9d1e6158',
  'recursive.reader.1': '60cd63ab7d16ba69',
  'recursive.reader.2': '57b7adc0838cb593',
  'recursive.reader.overview': 'facc94f43c1a561b',
  'sign.hero.overview': '87d94329097acde5',
  'sign.lab.criterion': 'c3a764638e3b9693',
  'sign.lab.irfs': '6d63642837027ff2',
  'sign.lab.overview': 'b292316fb066e33b',
  'sign.literature.0': '4122b601038ecbac',
  'sign.literature.1': '6ad002679ea7ad22',
  'sign.literature.2': '05ba243aa20e84a8',
  'sign.literature.3': 'e516d3d5ae855ce5',
  'sign.literature.overview': '6736d6441063a8ba',
  'sign.questions': '95f124413b1b68d8',
  'sign.reader.0': 'eaada294862a9c0b',
  'sign.reader.1': 'a119f0ae6a999904',
  'sign.reader.2': '89ae6c71eb14c4d5',
  'sign.reader.overview': '1f4d3a6c223cee86',
  'proxy.hero.overview': '8e233e119e00b138',
  'proxy.lab.overview': '7d5602e860e3b1ed',
  'proxy.lab.criterion': '6cacfe632f816908',
  'proxy.lab.irfs': 'e3da14b37d0f3c4a',
  'proxy.literature.overview': '40791962b3f8e233',
  'proxy.questions': '49a714306c5e3cd4',
  'proxy.reader.0': '6cedd3e7fe6e3ae7',
  'proxy.reader.1': '99a28d268f7adf4f',
  'proxy.reader.2': '4d3a934147db0edb',
  'proxy.reader.3': 'c363e001740648e3',
  'proxy.literature.0': '54132cab21db2012',
  'proxy.literature.1': '0d7630039125e971',
  'proxy.literature.2': '4f2f0cce7df09a0a',
  'proxy.literature.3': 'f227546deedd5f23',
  'proxy.literature.4': '8ead10a71b4a7573',
};

const evidence = (sourceIds, locator) => sourceIds.map((id) => ({
  id,
  relation: 'supports',
  locator,
}));

const section = (page, suffix, {
  title,
  renderMode,
  contentPaths = [],
  contentSelectors = [],
  sourceIds = [],
  displayReason,
  claimIds = [],
  categoryIds = [],
  citationStatus,
}) => {
  const id = `${page}.${suffix}`;
  return {
    id,
    page,
    title,
    renderMode,
    displayReason,
    contentPaths,
    contentSelectors,
    claimIds,
    sources: evidence(
      sourceIds,
      'The cited paper contribution, application, or qualification summarized in this reviewed Atlas section.',
    ),
    coverageCategoryIds: categoryIds,
    citationStatus: citationStatus ?? (renderMode === 'audit-only' ? 'not-applicable' : 'verified'),
    completenessStatus: 'complete-for-declared-scope',
    reviewedAt: '2026-07-16',
    reviewedHash: reviewedHashes[id] ?? '',
  };
};

const audit = (page, suffix, title, contentPaths, sourceIds = [], categoryIds = []) =>
  section(page, suffix, {
    title,
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored orientation, interaction guidance, or synthesis; evidence is retained in the audit without implying authorship by the cited papers.',
    contentPaths,
    sourceIds,
    categoryIds,
  });

const cited = (page, suffix, title, contentPaths, sourceIds, categoryIds) =>
  section(page, suffix, {
    title,
    renderMode: 'citations-only',
    contentPaths,
    sourceIds,
    categoryIds,
  });

const commonAuditSections = (page, allSources, hasReadingNote = true, leadPaths = ['literatureNote'], hasDetail = true) => [
  audit(page, 'hero.overview', 'Page overview', ['cardIntro'], allSources, ['core']),
  audit(page, 'lab.overview', 'Interactive lab overview', [
    'assumptionSummary',
    'atlasRuleSummary',
    'outputSummary',
    'intuitionAssumption',
    'intuitionTranslation',
    'intuition',
    ...(hasDetail ? ['detail'] : []),
    'chartTakeaway',
  ], allSources, ['core']),
  audit(page, 'lab.criterion', 'Rotation criterion and diagnostic plots', [
    'criterionHeadline',
    'criterionIntro',
    'objectivePlotNote',
    'extraPlotNote',
    'plotTitle',
    'extra',
  ], allSources, ['core']),
  audit(page, 'lab.irfs', 'Conditional impulse responses', ['irfIntro'], allSources, ['limits']),
  ...(hasReadingNote
    ? [audit(page, 'reader.overview', 'Reader-guide overview', ['readingNote'], allSources, ['core'])]
    : []),
  audit(page, 'literature.overview', 'Literature bridge overview', leadPaths, allSources, ['core']),
  audit(page, 'questions', 'Questions for reading applications', ['literatureQuestions'], allSources, ['limits']),
];

const buildMethodPage = ({
  page,
  allSources,
  readerSources,
  literatureSources,
  hasReadingNote = true,
  leadPaths,
  literatureCategories,
  hasDetail = true,
}) => {
  const records = commonAuditSections(page, allSources, hasReadingNote, leadPaths, hasDetail);
  readerSources.forEach((sourceIds, index) => {
    records.push(cited(
      page,
      `reader.${index}`,
      `Reader step ${index + 1}`,
      [`readingSteps.${index}.title`, `readingSteps.${index}.body`],
      sourceIds,
      ['core'],
    ));
  });
  literatureSources.forEach((sourceIds, index) => {
    records.push(cited(
      page,
      `literature.${index}`,
      `Literature section ${index + 1}`,
      [`literatureSections.${index}.title`, `literatureSections.${index}.body`],
      sourceIds,
      literatureCategories[index],
    ));
  });
  return Object.fromEntries(records.map((record) => [record.id, record]));
};
const buildPrimaryMethodPage = ({
  page,
  readerCount,
  claimGroups,
  hasReadingNote = true,
  leadPaths,
  hasDetail = true,
}) => {
  const records = commonAuditSections(page, [], hasReadingNote, leadPaths, hasDetail);
  for (let index = 0; index < readerCount; index += 1) {
    records.push(audit(
      page,
      `reader.${index}`,
      `Reader step ${index + 1}`,
      [`readingSteps.${index}.title`, `readingSteps.${index}.body`],
      [],
      ['core'],
    ));
  }
  claimGroups.forEach(({ claimIds = [], categoryIds = [] }, index) => {
    if (!claimIds.length) {
      records.push(audit(
        page,
        `literature.${index}`,
        `Literature section ${index + 1}`,
        [`literatureSections.${index}.title`, `literatureSections.${index}.body`],
        [],
        categoryIds,
      ));
      return;
    }
    records.push(section(page, `literature.${index}`, {
      title: `Literature section ${index + 1}`,
      renderMode: 'citations-only',
      contentPaths: [`literatureSections.${index}.title`, `literatureSections.${index}.body`],
      claimIds,
      categoryIds,
      citationStatus: 'derived-from-claims',
    }));
  });
  return Object.fromEntries(records.map((record) => [record.id, record]));
};


const recursiveSources = [
  'sims-1980',
  'kilian-lutkepohl-2017',
  'christiano-eichenbaum-evans-2005',
  'kilian-2009',
  'blanchard-perotti-2002',
  'pesaran-shin-1998',
  'keweloh-wang-2025',
];

const signSources = [
  'faust-1998',
  'canova-de-nicolo-2002',
  'uhlig-2005',
  'rubio-ramirez-waggoner-zha-2010',
  'mountford-uhlig-2009',
  'kilian-murphy-2012',
  'arias-rubio-ramirez-waggoner-2018',
  'antolin-diaz-rubio-ramirez-2018',
  'braun-brueggemann-2023',
  'kilian-lutkepohl-2017',
];

const narrativeSources = [
  'romer-romer-1989',
  'romer-romer-2010',
  'ramey-2011',
  'kilian-2008-oil-supply',
  'antolin-diaz-rubio-ramirez-2018',
  'kilian-lutkepohl-2017',
  'ludvigson-ma-ng-2021',
  'arias-rubio-ramirez-waggoner-2018',
];

const longRunSources = [
  'blanchard-quah-1989',
  'king-plosser-stock-watson-1991',
  'gali-1999',
  'faust-leeper-1997',
  'beaudry-portier-2006',
  'kurmann-mertens-2014',
  'kilian-lutkepohl-2017',
];


const independentClaimGroups = [
  {
    claimIds: [
      'independent.origins.comon',
      'independent.origins.chen-bickel',
      'independent.origins.bonhomme-robin',
      'independent.origins.lms',
      'independent.origins.gmr',
    ],
    categoryIds: ['origins'],
  },
  {
    claimIds: [
      'independent.estimation.lewis',
      'independent.estimation.guay',
      'independent.estimation.keweloh',
      'independent.estimation.hafner',
    ],
    categoryIds: ['implementation'],
  },
  {
    claimIds: [
      'independent.combination.drautzburg-wright',
      'independent.combination.keweloh-wang',
      'independent.application.lms',
      'independent.application.guay',
      'independent.application.braun',
      'independent.application.jarocinski',
    ],
    categoryIds: ['applications', 'inference'],
  },
  {
    claimIds: [
      'independent.limits.common-volatility',
      'independent.limits.mesters-zwiernik',
      'independent.limits.weak-and-labels',
      'independent.limits.nonlinearity',
    ],
    categoryIds: ['limits'],
  },
];

const buildIndependentPage = () => {
  const page = 'independent-shocks';
  const records = commonAuditSections(
    page,
    [],
    true,
    ['literatureLead', 'literatureNote'],
    false,
  );

  for (let index = 0; index < 4; index += 1) {
    records.push(audit(
      page,
      `reader.${index}`,
      `Reader step ${index + 1}`,
      [`readingSteps.${index}.title`, `readingSteps.${index}.body`],
      [],
      ['core'],
    ));
  }

  independentClaimGroups.forEach(({ claimIds, categoryIds }, index) => {
    records.push(section(page, `literature.${index}`, {
      title: `Literature section ${index + 1}`,
      renderMode: 'citations-only',
      contentPaths: [`literatureSections.${index}.title`, `literatureSections.${index}.body`],
      claimIds,
      categoryIds,
      citationStatus: 'derived-from-claims',
    }));
  });

  return Object.fromEntries(records.map((record) => [record.id, record]));
};


export const methodPageSections = {
  ...buildPrimaryMethodPage({
    page: 'recursive',
    readerCount: 3,
    claimGroups: [
      {
        claimIds: ['recursive.origins.sims', 'recursive.origins.kilian-lutkepohl'],
        categoryIds: ['origins'],
      },
      {
        claimIds: [
          'recursive.applications.cee',
          'recursive.applications.kilian',
          'recursive.applications.blanchard-perotti',
          'recursive.extensions.keweloh-wang',
        ],
        categoryIds: ['applications'],
      },
      { claimIds: [], categoryIds: ['implementation'] },
      { claimIds: ['recursive.limits.pesaran-shin'], categoryIds: ['limits'] },
    ],
  }),
  ...buildPrimaryMethodPage({
    page: 'sign',
    readerCount: 3,
    claimGroups: [
      {
        claimIds: ['sign.origins.faust', 'sign.origins.canova-de-nicolo', 'sign.origins.uhlig'],
        categoryIds: ['origins'],
      },
      {
        claimIds: [
          'sign.applications.mountford-uhlig',
          'sign.applications.kilian-murphy',
          'sign.extensions.antolin-diaz',
          'sign.extensions.braun-brueggemann',
        ],
        categoryIds: ['applications'],
      },
      {
        claimIds: ['sign.inference.rrwz', 'sign.inference.arias', 'sign.reporting.kilian-lutkepohl'],
        categoryIds: ['implementation', 'inference'],
      },
      { claimIds: [], categoryIds: ['limits'] },
    ],
  }),
  ...buildPrimaryMethodPage({
    page: 'narrative',
    readerCount: 4,
    hasReadingNote: false,
    leadPaths: ['literatureLead'],
    claimGroups: [
      {
        claimIds: [
          'narrative.origins.romer-romer-1989',
          'narrative.origins.romer-romer-2010',
          'narrative.origins.ramey',
          'narrative.origins.kilian',
        ],
        categoryIds: ['origins'],
      },
      {
        claimIds: ['narrative.variants.shock-sign', 'narrative.variants.historical-decomposition'],
        categoryIds: ['implementation'],
      },
      {
        claimIds: ['narrative.applications.antolin-diaz', 'narrative.applications.ludvigson-ma-ng'],
        categoryIds: ['applications'],
      },
      {
        claimIds: ['narrative.inference.antolin-diaz'],
        categoryIds: ['inference'],
      },
      { claimIds: [], categoryIds: ['limits'] },
    ],
  }),
  ...buildPrimaryMethodPage({
    page: 'long-run',
    readerCount: 3,
    claimGroups: [
      {
        claimIds: ['long-run.origins.blanchard-quah', 'long-run.identification.blanchard-quah'],
        categoryIds: ['origins'],
      },
      {
        claimIds: ['long-run.stationary.kilian-lutkepohl', 'long-run.cointegration.kilian-lutkepohl'],
        categoryIds: ['implementation'],
      },
      {
        claimIds: [
          'long-run.applications.kpsw',
          'long-run.applications.gali',
          'long-run.applications.beaudry-portier',
          'long-run.limits.kurmann-mertens',
        ],
        categoryIds: ['applications', 'limits'],
      },
      {
        claimIds: ['long-run.limits.faust-leeper'],
        categoryIds: ['limits'],
      },
    ],
  }),
  ...buildPrimaryMethodPage({
    page: 'proxy',
    readerCount: 4,
    hasReadingNote: false,
    leadPaths: ['literatureLead'],
    claimGroups: [
      {
        claimIds: [
          'proxy.origins.stock-watson',
          'proxy.origins.mertens-ravn',
          'proxy.estimator.kilian-lutkepohl',
        ],
        categoryIds: ['foundational', 'estimator', 'handbook'],
      },
      {
        claimIds: [
          'proxy.inference.mosw',
          'proxy.identification.miranda-agrippino-ricco',
          'proxy.identification.angelini',
        ],
        categoryIds: ['identification', 'weakIdentification', 'contaminationAndInvertibility'],
      },
      {
        claimIds: [
          'proxy.bootstrap.jentsch-lunsford-2019',
          'proxy.bootstrap.jentsch-lunsford-2022',
          'proxy.bootstrap.bruns-lutkepohl',
          'proxy.bayesian.arias',
          'proxy.bayesian.giacomini-kitagawa-read',
        ],
        categoryIds: ['bootstrap', 'bayesianAndSetInference'],
      },
      {
        claimIds: [
          'proxy.applications.gertler-karadi',
          'proxy.applications.jarocinski-karadi',
          'proxy.applications.kanzig-oil',
          'proxy.applications.kanzig-carbon',
          'proxy.extensions.braun-brueggemann',
          'proxy.multiple.bruns-lutkepohl-mcneil',
        ],
        categoryIds: ['representativeApplications', 'multipleProxies'],
      },
      { claimIds: [], categoryIds: ['limits'] },
    ],
  }),
  ...buildPrimaryMethodPage({
    page: 'max-share',
    readerCount: 4,
    hasReadingNote: false,
    leadPaths: ['literatureLead'],
    claimGroups: [
      {
        claimIds: ['max-share.origins.uhlig', 'max-share.origins.barsky-sims'],
        categoryIds: ['origins'],
      },
      {
        claimIds: [
          'max-share.sequential.caldara',
          'max-share.sequential.caldara-reverse',
          'max-share.joint.carriero-volpicella',
        ],
        categoryIds: ['applications', 'implementation'],
      },
      {
        claimIds: [
          'max-share.joint.dominance',
          'max-share.joint.nonempty',
          'max-share.joint.unique',
        ],
        categoryIds: ['implementation'],
      },
      {
        claimIds: [
          'max-share.implementation.bayesian',
          'max-share.implementation.frequentist',
        ],
        categoryIds: ['inference'],
      },
      {
        claimIds: [
          'max-share.limits.confounding',
          'max-share.limits.simulation',
        ],
        categoryIds: ['limits'],
      },
    ],
  }),
  ...buildIndependentPage(),
  ...buildPrimaryMethodPage({
    page: 'heteroskedasticity',
    readerCount: 4,
    hasDetail: false,
    leadPaths: ['literatureLead', 'literatureNote'],
    claimGroups: [
      {
        claimIds: [
          'heteroskedasticity.origins.sentana',
          'heteroskedasticity.origins.rigobon',
          'heteroskedasticity.limits.proportional',
        ],
        categoryIds: ['origins', 'limits'],
      },
      {
        claimIds: [
          'heteroskedasticity.variants.llm-model',
          'heteroskedasticity.variants.llm-testing',
          'heteroskedasticity.variants.llm-state-invariance',
          'heteroskedasticity.variants.milunovich-yang',
          'heteroskedasticity.variants.lutkepohl-netsunajev',
          'heteroskedasticity.variants.lewis',
          'heteroskedasticity.variants.lewis-rank',
          'heteroskedasticity.variants.bertsche-braun',
          'heteroskedasticity.variants.bertsche-braun-estimation',
          'heteroskedasticity.variants.virolainen',
          'heteroskedasticity.variants.virolainen-partial',
        ],
        categoryIds: ['implementation'],
      },
      {
        claimIds: [
          'heteroskedasticity.applications.rigobon-sack',
          'heteroskedasticity.applications.normandin-method',
          'heteroskedasticity.applications.normandin-targets',
          'heteroskedasticity.applications.normandin-orthogonality',
          'heteroskedasticity.applications.lewis',
          'heteroskedasticity.applications.bertsche-braun',
        ],
        categoryIds: ['applications'],
      },
      {
        claimIds: [
          'heteroskedasticity.limits.mopmq-separation',
          'heteroskedasticity.limits.mopmq-weak',
          'heteroskedasticity.limits.kpm-causal',
          'heteroskedasticity.limits.kpm-sets',
        ],
        categoryIds: ['limits'],
      },
    ],
  }),
};

const overview = (suffix, options) => section('overview', suffix, options);

export const overviewSections = Object.fromEntries([
  overview('hero.overview', {
    title: 'Atlas overview',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored orientation; it describes the product rather than a paper contribution.',
    contentSelectors: ['#introduction'],
    categoryIds: ['core'],
  }),
  overview('setup', {
    title: 'Common rotation experiment',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored derivation and interaction guide; the cited research boundary is handled in the literature bridge.',
    contentSelectors: ['#setup-framework'],
    categoryIds: ['core'],
  }),
  overview('reader', {
    title: 'How to read the Atlas',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored reading routine and interface guidance.',
    contentSelectors: ['#atlas-reading-guide'],
    categoryIds: ['limits'],
  }),
  overview('literature.lead', {
    title: 'Literature bridge orientation',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored orientation to the source-backed sections below.',
    contentSelectors: ['#atlas-literature-lead'],
    categoryIds: ['core'],
  }),
  overview('literature.origins', {
    title: 'Reduced-form VARs and structural interpretation',
    renderMode: 'citations-only',
    contentSelectors: ['#atlas-literature-origins'],
    claimIds: ['overview.origins.sims-critique', 'overview.origins.sims-orthogonalization'],
    citationStatus: 'derived-from-claims',
    categoryIds: ['origins'],
  }),
  overview('literature.rotations', {
    title: 'Modern rotation formulation',
    renderMode: 'citations-only',
    contentSelectors: ['#atlas-literature-rotations'],
    claimIds: ['overview.rotations.rrwz'],
    citationStatus: 'derived-from-claims',
    categoryIds: ['implementation'],
  }),
  overview('literature.complements', {
    title: 'Methods as alternatives and complements',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored taxonomy; source-specific claims are cited on the individual method pages.',
    contentSelectors: ['#atlas-literature-complements'],
    sourceIds: [],
    categoryIds: ['applications'],
  }),
  overview('literature.limits', {
    title: 'Atlas scope and omissions',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored disclosure of its own simplifications.',
    contentSelectors: ['#atlas-literature-limits'],
    sourceIds: [],
    categoryIds: ['limits'],
  }),
  overview('questions', {
    title: 'Questions for applied papers',
    renderMode: 'audit-only',
    displayReason: 'Atlas-authored synthesis questions.',
    contentSelectors: ['#atlas-literature-questions'],
    sourceIds: [],
    categoryIds: ['limits'],
  }),
].map((record) => [record.id, record]));

export const pageSections = { ...overviewSections, ...methodPageSections };

export default pageSections;
