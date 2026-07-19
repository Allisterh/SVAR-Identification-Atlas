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
      body: `Use row first, column second. ${bEntry(1, 2)} maps the stock-market shock into the interest-rate residual. Setting it to zero orders the interest rate before stock returns; ${bEntry(2, 1)} remains free, so a policy shock may move stock returns immediately.`,
    },
    {
      title: '2. Use the dial to see identification happen',
      body: `Turning the dial changes ${mathHtml('B(&theta;)')}, recovered shocks, and IRFs without changing the covariance fit. Watch ${bEntry(1, 2)} approach and cross zero. The selected grid point is the Atlas approximation to the lower-triangular impact matrix.`,
    },
    {
      title: '3. Separate impact timing from later dynamics',
      body: 'The zero applies only within the impact month. Move to the IRFs and check what the VAR dynamics imply afterward. A later response of the interest rate to a stock-market shock does not violate the recursive restriction.',
    },
  ],
  literatureTitle: 'From the Atlas zero to recursive SVAR practice',
  literatureNote:
    'The literature treats recursive identification as the simplest member of the broader family of short-run restrictions. Its computation is easy only after an economically defensible ordering has supplied the identifying content.',
  literatureSections: [
    {
      title: 'Origins and development',
      body: 'Sims (1980, Section 2.C) orthogonalized correlated VAR innovations with a triangular ordering but stated that there was no unique best transformation. Kilian and L&uuml;tkepohl (2017, Chapter 8, Section 8.2) show that a lower-triangular Cholesky factor supplies K(K-1)/2 impact zeros and emphasize that the resulting recursive ordering needs an economic justification.',
    },
    {
      title: 'Major versions and applications',
      body: 'Christiano, Eichenbaum, and Evans (2005, Section II) identify a monetary-policy shock by ordering variables around the federal funds rate so that one block cannot respond within the period and the policy authority observes another block only with a lag. Kilian (2009, Section II.A) identifies three oil-market shocks with a monthly recursive impact matrix motivated by short-run delays. Blanchard and Perotti (2002, Section II.B and Appendix A.2) combine fiscal decision lags with externally constructed tax elasticities in a nonrecursive fiscal SVAR. Keweloh and Wang (2025, Sections 4 and 7) use an adaptive ridge penalty to shrink statistically identified non-Gaussian SVAR estimates toward suspected short-run zeros while making the asymptotic effect of invalid restrictions vanish.',
    },
    {
      title: 'How the Atlas differs from an applied recursive SVAR',
      body: `The Atlas fixes one estimated bivariate reduced form, varies one rotation angle, and approximates one zero with a finite grid. An exact recursive model instead computes the Cholesky factor after the ordering has been justified. Applied work must additionally estimate the lag dynamics and ${mathHtml('&Sigma;<sub>u</sub>')}, choose transformations and frequency, normalize column signs, and quantify sampling uncertainty. A positive Cholesky diagonal is a computational convention, not an economic shock label.`,
    },
    {
      title: 'Credibility checks and critiques',
      body: 'Pesaran and Shin (1998, Abstract and Section 3) define generalized impulse responses that do not require shock orthogonalization and are invariant to the ordering of the VAR variables. That order invariance describes a reduced-form conditional experiment; an economic shock label still requires separate identifying information.',
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
