export const atlasClaims = {
  'proxy.validity.baseline': {
    id: 'proxy.validity.baseline',
    page: 'proxy',
    type: 'identification',
    priority: 'core',
    text:
      'A Proxy-SVAR uses an external series as a noisy measurement of a latent structural shock. A high-frequency policy surprise or narrative tax series is therefore an instrument, not the shock itself. It must contain information about the target policy shock (relevance) and no information about the other structural shocks (exclusion or exogeneity). The Atlas visualizes the second moment by rotating the residual cloud until the proxy is orthogonal to the non-target recovered shock. A nearly zero loss or an attractive IRF cannot by itself establish that the proxy is strong, valid, correctly timed, or cleanly interpretable.',
    sources: [
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Sections 2–4',
        relation: 'supports',
      },
      {
        id: 'kilian-lutkepohl-2017',
        locator: 'Chapter 15, pp. 171–195',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '4e3c2d8b23184412',
  },
  'proxy.estimation.atlas-criterion': {
    id: 'proxy.estimation.atlas-criterion',
    page: 'proxy',
    type: 'atlas-simplification',
    priority: 'core',
    text:
      'At each angle, the Atlas recovers a candidate policy shock and a candidate non-target shock from the same residuals. Because a valid policy proxy should not co-move with the non-target shock, the loss is the absolute sample correlation between those two series over their common observations. The smallest loss labels the corresponding impact column as the policy direction. This bivariate visualization isolates one moment; a research estimator uses the proxy–residual covariance vector and also diagnoses relevance.',
    sources: [
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Section 2',
        relation: 'supports',
      },
      {
        id: 'kilian-lutkepohl-2017',
        locator: 'Chapter 15',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'bba30f3a547bc917',
  },
  'proxy.measurement.instrument-not-shock': {
    id: 'proxy.measurement.instrument-not-shock',
    page: 'proxy',
    type: 'measurement',
    priority: 'core',
    text:
      'The proxy may be noisy, censored, observed only on announcement days, or aggregated to the VAR frequency. Mertens and Ravn (2013) use noisy narrative tax measures this way: the proxy is useful because of its covariance with the latent shock, not because their observations are identical.',
    sources: [
      {
        id: 'mertens-ravn-2013',
        locator: 'Sections I–II',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '517f59cafed27057',
  },
  'proxy.inference.weak-relevance-reading': {
    id: 'proxy.inference.weak-relevance-reading',
    page: 'proxy',
    type: 'inference',
    priority: 'core',
    text:
      'Relevance asks whether the proxy co-moves with the target shock. Exclusion asks whether it is orthogonal to the non-target shocks. The Atlas loss directly displays only the second condition; Montiel Olea, Stock, and Watson (2021) show why a weak first stage can make plug-in estimates and ordinary confidence intervals unreliable.',
    sources: [
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Sections 3–4',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'a1768a80bc043e9e',
  },
  'proxy.diagnostics.scale-first-stage': {
    id: 'proxy.diagnostics.scale-first-stage',
    page: 'proxy',
    type: 'diagnostic',
    priority: 'core',
    text:
      'Find the trough of the absolute-correlation curve, then inspect the overlap plot at that angle. Standardization makes shapes comparable but removes information about scale, so it does not replace the proxy–residual covariance and first-stage diagnostics described by Kilian and Lütkepohl (2017, Chapter 15).',
    sources: [
      {
        id: 'kilian-lutkepohl-2017',
        locator: 'Chapter 15, pp. 171–195',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '3a1ebbcc13b91418',
  },
  'proxy.identification.partial-invertibility-reading': {
    id: 'proxy.identification.partial-invertibility-reading',
    page: 'proxy',
    type: 'identification',
    priority: 'core',
    text:
      'The chosen IRFs answer what the VAR implies under the maintained proxy moments. Before giving them a causal label, applied work must defend event construction, instrument strength, exogeneity, timing, and inference. Miranda-Agrippino and Ricco (2023) additionally show that the target shock must be partially invertible in the chosen information set and the instrument must satisfy the relevant limited lead–lag exogeneity condition.',
    sources: [
      {
        id: 'miranda-agrippino-ricco-2023',
        locator: 'Sections 2–6 and conclusion',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '1d61ce4dcd8fdd7f',
  },
  'proxy.output.conditional-irfs': {
    id: 'proxy.output.conditional-irfs',
    page: 'proxy',
    type: 'inference',
    priority: 'core',
    text:
      'The IRFs propagate the one rotation selected by the displayed proxy moment. Read them conditionally: they describe the dynamic model obtained if the proxy is relevant, excluded from non-target shocks, and compatible with the VAR information set. The plots cannot validate those assumptions or provide weak-instrument-robust confidence sets.',
    sources: [
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Sections 2–4',
        relation: 'supports',
      },
      {
        id: 'miranda-agrippino-ricco-2023',
        locator: 'Sections 3–6',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '668393ae33441180',
  },
  'proxy.history.external-instrument-origin': {
    id: 'proxy.history.external-instrument-origin',
    page: 'proxy',
    type: 'origin',
    priority: 'core',
    text:
      'Stock and Watson (2012) are an early published anchor for bringing external information into structural VAR analysis. Mertens and Ravn (2013) then supplied the influential fiscal Proxy-SVAR estimator and application: narrative tax changes are noisy proxies for latent personal and corporate tax shocks rather than perfectly observed shocks. Their design also makes censoring, measurement error, scaling, and the extra restrictions needed for several target shocks visible parts of identification.',
    sources: [
      {
        id: 'stock-watson-2012',
        locator: 'External-instrument identification discussion and empirical decomposition',
        relation: 'supports',
      },
      {
        id: 'mertens-ravn-2013',
        locator: 'Sections I–II',
        relation: 'supports',
      },
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Introduction',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '8082c53a0bfd4ea5',
  },
  'proxy.estimation.covariance-vector': {
    id: 'proxy.estimation.covariance-vector',
    page: 'proxy',
    type: 'estimation',
    priority: 'core',
    text:
      'With reduced-form innovations u and proxy z, the central population object is the vector E[z u]. Under relevance and exclusion it is proportional to the target impact column. Research implementations estimate that covariance, impose scale and sign normalizations, and propagate the identified direction through the VAR moving-average coefficients. They do not normally scan a two-dimensional angle grid or identify a shock from sample correlation alone. They also carry reduced-form and proxy-moment uncertainty into confidence or credible sets; the Atlas fixes the reduced form, uses a finite grid, and reports one illustrative minimizer.',
    sources: [
      {
        id: 'mertens-ravn-2013',
        locator: 'Section II',
        relation: 'supports',
      },
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Section 2',
        relation: 'supports',
      },
      {
        id: 'kilian-lutkepohl-2017',
        locator: 'Chapter 15',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '5259c36a7c51d51e',
  },
  'proxy.inference.weak-and-invertibility': {
    id: 'proxy.inference.weak-and-invertibility',
    page: 'proxy',
    type: 'inference',
    priority: 'core',
    text:
      'Montiel Olea, Stock, and Watson (2021) show that weak relevance invalidates ordinary plug-in normal inference and construct Anderson–Rubin/Fieller-style confidence sets that may honestly be unbounded. Miranda-Agrippino and Ricco (2023) replace full-system invertibility with partial invertibility of the target shock plus limited lead–lag exogeneity, and provide specification guidance and tests for the maintained information conditions. Angelini, Cavaliere, and Fanelli (2024) add an indirect route that can recover target responses from strong proxies for non-target shocks when its rank conditions and additional restrictions hold.',
    sources: [
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Sections 3–4',
        relation: 'supports',
      },
      {
        id: 'miranda-agrippino-ricco-2023',
        locator: 'Sections 3–6 and 8',
        relation: 'supports',
      },
      {
        id: 'angelini-cavaliere-fanelli-2024',
        locator: 'Identification strategy, bootstrap relevance test, and conclusion',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: '215867a66962ce4f',
  },
  'proxy.inference.bootstrap': {
    id: 'proxy.inference.bootstrap',
    page: 'proxy',
    type: 'inference',
    priority: 'core',
    text:
      'Jentsch and Lunsford (2019) show that the Rademacher wild bootstrap used in the Mertens–Ravn application suppresses Proxy-SVAR identification uncertainty and yields confidence intervals that are too small. Jentsch and Lunsford (2022) establish residual-based moving-block bootstrap inference and an Anderson–Rubin extension for weak proxies. Bruns and Lütkepohl (2023) propose a more structured proxy-residual bootstrap with potentially better small-sample coverage when its proxy model is credible.',
    sources: [
      {
        id: 'jentsch-lunsford-2019',
        locator: 'Abstract and Sections I–III',
        relation: 'supports',
      },
      {
        id: 'jentsch-lunsford-2022',
        locator: 'Abstract and main bootstrap results',
        relation: 'supports',
      },
      {
        id: 'bruns-lutkepohl-2023',
        locator: 'Sections 4–8',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'aea36439b5d90228',
  },
  'proxy.inference.bayesian': {
    id: 'proxy.inference.bayesian',
    page: 'proxy',
    type: 'inference',
    priority: 'core',
    text:
      'Bayesian Proxy-SVARs make the prior and the remaining rotation uncertainty explicit. Arias, Rubio-Ramírez, and Waggoner (2021) develop exact posterior simulation under proxy exogeneity/relevance plus additional sign or zero restrictions. Giacomini, Kitagawa, and Read (2022) use multiple-prior robust Bayesian inference when the proxy restrictions leave the target object set identified. Braun and Brüggemann (2023) combine external instruments with sign restrictions, allow plausibly exogenous proxies through inequalities, and use Bayes factors to assess overidentifying restrictions.',
    sources: [
      {
        id: 'arias-rubio-ramirez-waggoner-2021',
        locator: 'Sections 2–3 and conclusion',
        relation: 'supports',
      },
      {
        id: 'giacomini-kitagawa-read-2022',
        locator: 'Abstract and Sections 2–4',
        relation: 'supports',
      },
      {
        id: 'braun-brueggemann-2023',
        locator: 'Abstract and methodological sections',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'd787e3389eb22d6b',
  },
  'proxy.applications.fiscal-monetary': {
    id: 'proxy.applications.fiscal-monetary',
    page: 'proxy',
    type: 'application',
    priority: 'context',
    text:
      'Fiscal applications such as Mertens and Ravn (2013) use narrative tax records as instruments for latent tax shocks. Gertler and Karadi (2015) use narrow-window interest-rate surprises to instrument monthly monetary-policy innovations. Jarociński and Karadi (2020) show why announcement surprises must be decomposed when policy actions and central-bank information news move rates and stock prices together.',
    sources: [
      {
        id: 'mertens-ravn-2013',
        locator: 'Abstract and empirical application',
        relation: 'supports',
      },
      {
        id: 'gertler-karadi-2015',
        locator: 'Abstract and identification section',
        relation: 'supports',
      },
      {
        id: 'jarocinski-karadi-2020',
        locator: 'Abstract and identification design',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'ce0674fb333a0120',
  },
  'proxy.applications.oil-carbon': {
    id: 'proxy.applications.oil-carbon',
    page: 'proxy',
    type: 'application',
    priority: 'context',
    text:
      'The same external-instrument architecture extends beyond fiscal and monetary policy. Känzig (2021) builds oil-supply-news shocks from OPEC announcement-window futures movements. Känzig (2023, revised 2025) uses EU ETS regulatory-event surprises as an instrument for carbon-policy shocks. These applications still require a defensible event set, timing convention, first stage, exclusion argument, and inference procedure.',
    sources: [
      {
        id: 'kanzig-2021-oil-supply-news',
        locator: 'Abstract and identification section',
        relation: 'supports',
      },
      {
        id: 'kanzig-2023-carbon-pricing-r2025',
        locator: 'NBER abstract and identification section of the September 2025 revision',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'c5c300d5c34c962e',
  },
  'proxy.identification.multiple-proxies': {
    id: 'proxy.identification.multiple-proxies',
    page: 'proxy',
    type: 'identification',
    priority: 'core',
    text:
      'Several proxies do not automatically identify several economically distinct shocks. Multi-proxy work must state the proxy–shock assignment, rank conditions, extra restrictions, and shock-orthogonality conditions. Bruns, Lütkepohl, and McNeil (2025) show that one-by-one proxy estimates can produce correlated structural shocks even when the proxies look individually plausible, and they propose a joint GMM estimator and specification test that impose and assess shock orthogonality.',
    sources: [
      {
        id: 'angelini-cavaliere-fanelli-2024',
        locator: 'Identification discussion for multiple target shocks',
        relation: 'supports',
      },
      {
        id: 'giacomini-kitagawa-read-2022',
        locator: 'Set-identification discussion for multiple instruments and shocks',
        relation: 'supports',
      },
      {
        id: 'bruns-lutkepohl-mcneil-2025',
        locator: 'Abstract, Sections 1–2, and conclusion',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'e646354d5657b5b4',
  },
  'proxy.diagnostics.failure-sequence': {
    id: 'proxy.diagnostics.failure-sequence',
    page: 'proxy',
    type: 'limitation',
    priority: 'core',
    text:
      'A proxy can be weak, load on several shocks, or violate the information-set and timing conditions required for causal interpretation. High-frequency monetary surprises can mix policy actions with central-bank information, monthly aggregation adds a timing convention, and several one-by-one proxies need not yield mutually orthogonal shocks. Applied work should therefore report the event and overlap sample, target first-stage strength, exclusion argument and available tests, information-effect controls, invertibility assumptions, multi-proxy rank and orthogonality checks, and weak-proxy-robust inference. A near-zero Atlas loss addresses none of these questions by itself.',
    sources: [
      {
        id: 'montiel-olea-stock-watson-2021',
        locator: 'Sections 3–4',
        relation: 'supports',
      },
      {
        id: 'miranda-agrippino-ricco-2023',
        locator: 'Sections 5–9',
        relation: 'supports',
      },
      {
        id: 'jarocinski-karadi-2020',
        locator: 'Identification design and empirical decomposition',
        relation: 'supports',
      },
      {
        id: 'jentsch-lunsford-2022',
        locator: 'Bootstrap and weak-proxy inference results',
        relation: 'supports',
      },
      {
        id: 'bruns-lutkepohl-mcneil-2025',
        locator: 'Sections 1–2 and conclusion',
        relation: 'supports',
      },
    ],
    status: 'verified',
    reviewedAt: '2026-07-15',
    reviewedHash: 'bf0c49334dbcf095',
  },
};

export default atlasClaims;
