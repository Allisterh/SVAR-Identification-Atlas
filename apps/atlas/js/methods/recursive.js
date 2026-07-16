import { bEntry, mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('L(&theta;) = |')}${bEntry(1, 2)}${mathHtml('|')}`,
  assumptionSummary: 'A stock-market shock cannot move the interest-rate innovation within the same month.',
  atlasRuleSummary: `Find the sampled rotation where the forbidden entry ${bEntry(1, 2)} is closest to zero.`,
  outputSummary: 'One recursive candidate; an exact recursive model would use the Cholesky factor directly.',
  cardIntro:
    'Recursive identification turns an ordering of variables into a causal timing claim. With the interest rate ordered before S&amp;P 500 growth, a policy shock may move both variables immediately, but a stock-market shock may not move the interest-rate innovation until later months. That one-way impact pattern makes the impact matrix lower triangular. The Atlas exposes the assumption by rotating through covariance-equivalent impact matrices and selecting the sampled matrix whose forbidden upper-right entry is closest to zero. The zero comes from the timing story, not from the reduced-form covariance matrix.',
  intuitionAssumption:
    'Order the interest rate before stock returns: the earlier variable may affect the later variable within the month, while the later variable cannot feed back contemporaneously.',
  intuitionTranslation:
    `Rows of ${mathHtml('B(&theta;)')} are residuals and columns are shocks. Thus ${bEntry(1, 2)} is the impact of the stock-market shock (column 2) on the interest-rate residual (row 1), and recursivity requires that entry to be zero.`,
  intuition:
    `With the interest rate ordered before stock returns, the stock-market shock cannot move the interest-rate residual within the same month. In ${mathHtml('B(&theta;)')}, that is the upper-right entry ${bEntry(1, 2)}. The restriction says nothing about feedback after impact: VAR lags may transmit the stock-market shock to the rate in later months.`,
  detail:
    `<p><strong>Impact only:</strong> ${bEntry(1, 2)} is restricted at horizon 0; later rate responses to the stock-market shock remain unrestricted.</p>`,
  chartTakeaway:
    'A near-zero upper-right entry selects the recursive ordering. It does not say that the two variables are dynamically unrelated after the impact month.',
  criterionHeadline: `Turn the ordering into the zero ${bEntry(1, 2)} = 0.`,
  criterionIntro:
    `Every displayed ${mathHtml('B(&theta;)')} reproduces the same reduced-form covariance. Recursive identification adds one timing claim: the stock-market shock is forbidden from entering the interest-rate residual on impact. The loss is the absolute size of that forbidden entry, so smaller means closer to the required zero and a loss of zero satisfies the restriction exactly.`,
  objectivePlotNote:
    `The left curve plots ${mathHtml('|b<sub>12</sub>(&theta;)|')} for every sampled angle. Its lowest point is the best grid match to the recursive zero; the vertical marker shows the current dial setting, and the exact zero may lie between two sampled angles.`,
  extraPlotNote:
    `The companion plot shows the same ${bEntry(1, 2)} before its sign is removed by the absolute value. A zero crossing is the exact solution, while the sampled loss reaches its trough at the nearest grid point. Values above and below zero approach the restriction from opposite sides.`,
  irfIntro:
    'First verify the zero on impact, then follow the responses beyond horizon 0. Recursivity permits delayed feedback through the VAR lags, so the rate can respond to a stock-market shock after the first month. Loss colors show distance from the impact zero, not the quality of the later IRF shapes.',
  priorityIrfKeys: ['rateOnRate', 'sp500OnRate'],
  readingNote:
    'Read the page as a chain from an economic ordering to one matrix zero, and from that zero to a complete dynamic response. The order is the identifying assumption; the Cholesky calculation is only its implementation.',
  readingSteps: [
    {
      title: '1. Decode the matrix entry',
      body: `Use row first, column second. ${bEntry(1, 2)} maps the stock-market shock into the interest-rate residual. Setting it to zero orders the interest rate before stock returns; ${bEntry(2, 1)} remains free, so a policy shock may move stock returns immediately. Kilian and Lutkepohl (2017, Chapters 8-9) connect this row-column mapping to a triangular short-run restriction.`,
    },
    {
      title: '2. Use the dial to see identification happen',
      body: `Turning the dial changes ${mathHtml('B(&theta;)')}, recovered shocks, and IRFs without changing the covariance fit. Watch ${bEntry(1, 2)} approach and cross zero. The selected grid point is the Atlas approximation to the lower-triangular impact matrix. Sims (1980) introduced orthogonalized VAR responses but warned that a Cholesky triangularization is not automatically a unique structural story.`,
    },
    {
      title: '3. Separate impact timing from later dynamics',
      body: 'The zero applies only within the impact month. Move to the IRFs and check what the VAR dynamics imply afterward. A later response of the interest rate to a stock-market shock does not violate the recursive restriction. Christiano, Eichenbaum, and Evans (2005) and Kilian (2009) are prominent applications of this impact-delay-versus-lagged-propagation logic.',
    },
  ],
  literatureTitle: 'From the Atlas zero to recursive SVAR practice',
  literatureNote:
    'The literature treats recursive identification as the simplest member of the broader family of short-run restrictions. Its computation is easy only after an economically defensible ordering has supplied the identifying content.',
  literatureSections: [
    {
      title: 'Origins and development',
      body: `Sims (1980) established the unrestricted VAR, orthogonalized impulse-response, and forecast-error-variance-decomposition program, while warning that a triangularization was not uniquely structural. Later SVAR practice made the hidden assumption explicit: if ${mathHtml("P P' = &Sigma;<sub>u</sub>")} and ${mathHtml('P')} is the lower-triangular Cholesky factor, setting the impact matrix equal to ${mathHtml('P')} imposes ${mathHtml('K(K-1)/2')} contemporaneous zeros. These zeros define a recursive causal ordering conditional on the VAR lags. Kilian and Lutkepohl emphasize that satisfying the covariance equation and the numerical order condition is not enough; the ordering also needs a credible economic and institutional interpretation.`,
    },
    {
      title: 'Major versions and applications',
      body: 'A fully recursive SVAR assigns an ordering to every shock. Block-recursive designs order groups of variables but allow unrestricted interaction within a block. Semistructural applications often interpret only one shock, such as a monetary-policy innovation, and leave the remaining orthogonal shocks as residual composites. Nonrecursive short-run SVARs relax the triangular chain and combine impact zeros, equality restrictions, calibrated elasticities, or an AB representation; estimation may then require nonlinear solvers, QR algorithms, IV, GMM, FIML, or structural Bayesian methods. Important applications include the recursive monetary-policy system used by Christiano, Eichenbaum, and Evans (2005), Kilian\'s (2009) monthly oil-market ordering, and the nonrecursive institutional-timing design of Blanchard and Perotti (2002). Recent work by Keweloh and Wang treats economically suspected zeros as shrinkage targets that non-Gaussian information may support or overturn.',
    },
    {
      title: 'How the Atlas differs from an applied recursive SVAR',
      body: `The Atlas fixes one estimated bivariate reduced form, varies one rotation angle, and approximates one zero with a finite grid. In an exactly recursive ${mathHtml('K')}-variable model, the declared ordering supplies a complete triangular zero pattern and the Cholesky factor computes the solution directly, with no rotation search. Applied work must also estimate lag dynamics and ${mathHtml('&Sigma;<sub>u</sub>')}, choose transformations and data frequency, normalize column signs, and propagate sampling uncertainty into IRFs and FEVDs. A positive Cholesky diagonal is a computational sign convention; it does not by itself label an economically positive shock.`,
    },
    {
      title: 'Credibility checks and critiques',
      body: 'The decisive question is whether the excluded within-period feedback is plausible at the sampling frequency. Financial variables can react within minutes, while production, fiscal decisions, or some real aggregates may adjust slowly. Reordering variables can change shocks and IRFs, yet agreement across orderings is not validation: when reduced-form residual correlations are small, several Cholesky orderings can look similar even when the true impact matrix is nonrecursive. Recursive monetary VARs additionally face omitted central-bank information, real-time-data, policy-regime, and effective-lower-bound problems. Just-identified zeros are maintained assumptions rather than restrictions tested by the same covariance information. Pesaran-Shin generalized responses remove ordering sensitivity for a reduced-form conditional experiment, but they do not identify an economic structural shock.',
    },
  ],
  literatureQuestions: [
    'Which contemporaneous response is set to zero, and what timing or information-flow argument makes that exclusion credible at the data frequency?',
    'How does the variable ordering map into the triangular impact matrix, and do alternative economically plausible orderings change the conclusions?',
    'Is the system fully recursive, block recursive, or only partly restricted, and do the stated restrictions satisfy the order and rank conditions for identification?',
    'Does the paper distinguish a zero impact response from unrestricted feedback at later horizons?',
    'How are reduced-form estimation uncertainty, normalization choices, and uncertainty about the short-run restrictions reflected in the reported IRFs?',
  ],
  literatureRefs: [
    'Christopher A. Sims (1980), "Macroeconomics and Reality" &mdash; the unrestricted VAR foundation and an early explicit warning that recursive orthogonalization is not unique.',
    'Lutz Kilian and Helmut Lutkepohl (2016), Structural Vector Autoregressive Analysis, Chapters 8-9 &mdash; identification, estimation, rank conditions, recursive, semistructural, and nonrecursive short-run designs.',
    'Lawrence J. Christiano, Martin Eichenbaum, and Charles L. Evans (2005), "Nominal Rigidities and the Dynamic Effects of a Shock to Monetary Policy" &mdash; a major recursive monetary-policy application and VAR-to-DSGE bridge.',
    'Lutz Kilian (2009), "Not All Oil Price Shocks Are Alike" &mdash; a canonical monthly recursive oil-market application whose shock labels depend on delay restrictions.',
    'Olivier Blanchard and Roberto Perotti (2002), "An Empirical Characterization of the Dynamic Effects of Changes in Government Spending and Taxes on Output" &mdash; institutional timing and calibrated elasticities as a nonrecursive short-run alternative.',
    'M. Hashem Pesaran and Yongcheol Shin (1998), "Generalized Impulse Response Analysis in Linear Multivariate Models" &mdash; an order-invariant reduced-form contrast that should not be mistaken for structural identification.',
    'Sascha A. Keweloh and Shu Wang (2025), "Uncertain Short-Run Restrictions and Statistically Identified Structural Vector Autoregressions" &mdash; a modern soft-restriction extension using non-Gaussian statistical information.',
  ],
  plotTitle: 'Distance from the recursive zero',
  extra: 'Forbidden impact entry across rotation angle',
};
