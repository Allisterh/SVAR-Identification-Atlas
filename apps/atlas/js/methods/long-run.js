import { mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('C<sub>H</sub>(&theta;) = &sum;<sub>h=0</sub><sup>H-1</sup>&Psi;<sub>S&amp;P,policy</sub>(h;&theta;), &nbsp; L(&theta;) = |C<sub>H</sub>(&theta;)|')}`,
  assumptionSummary: 'The policy shock may move stock returns temporarily but should leave no stock-price-level effect at the end of the window.',
  atlasRuleSummary: 'Sum the 24 monthly stock-return responses and minimize the absolute final cumulative value.',
  outputSummary: 'One finite-horizon neutrality candidate, not an estimated infinite-horizon long-run SVAR.',
  cardIntro:
    'Long-run identification distinguishes shocks by cumulative or permanent effects rather than by what happens only on impact. The Atlas VAR uses monthly S&amp;P 500 log growth, so adding its impulse responses reconstructs the approximate response of the log stock-price level. A rotation may therefore move stock returns for several months and still satisfy the displayed neutrality idea if those movements eventually offset. The Atlas chooses the rotation whose cumulative policy-shock effect is closest to zero after 24 displayed horizons. This is a teaching analogue: long-run SVARs in the literature impose restrictions on infinite-horizon multipliers or common trends and must confront stationarity, cointegration, low-frequency precision, and sign normalization.',
  intuitionAssumption:
    'A shock can have short-run effects on a variable without changing its level permanently. Long-run restrictions use that permanent-versus-transitory distinction to label shocks.',
  intuitionTranslation:
    `The VAR contains monthly S&amp;P 500 log growth. Summing its policy-shock IRF from ${mathHtml('h=0')} through ${mathHtml('h=23')} converts the growth responses into an approximate log stock-price-level response over the displayed window. The selected rotation makes the final sum closest to zero.`,
  intuition:
    'Long-run restrictions label shocks by cumulative or permanent effects. Here the response variable is monthly stock-price growth, so its cumulative IRF is the approximate stock-price-level response. The Atlas selects the rotation whose cumulative policy-shock effect is closest to zero at the end of the 24-horizon display.',
  detail:
    `<p><strong>Displayed object:</strong> ${mathHtml('C<sub>24</sub>(&theta;)')} is the endpoint of a finite cumulative path. The literature usually targets ${mathHtml('C<sub>&infin;</sub>(&theta;)')}, not month 24.</p>`,
  chartTakeaway:
    'The score uses the endpoint of the cumulative path. A temporary excursion is allowed, and two paths with different short-run shapes can receive similar endpoint scores.',
  criterionHeadline: 'Convert a response in growth rates into a finite-horizon level-neutrality score.',
  criterionIntro:
    `For each angle, ${mathHtml('C<sub>H</sub>(&theta;)')} adds the S&amp;P growth responses from impact through horizon ${mathHtml('H-1')}; that sum is the approximate stock-price-level response at the end of the window. The loss takes its absolute value, so positive and negative endpoints are treated alike and smaller means closer to level neutrality.`,
  objectivePlotNote:
    `The left plot compares the endpoint loss ${mathHtml('|C<sub>24</sub>(&theta;)|')} across rotations. The trough is the sampled angle with the smallest final level effect, while the vertical marker shows how the current dial setting scores.`,
  extraPlotNote:
    'The companion plot follows the running cumulative response over horizons for the current rotation. Only its last point enters the loss; the earlier points show the temporary level effects that can be large even when the endpoint is near zero.',
  irfIntro:
    'Read the S&amp;P 500 IRF as a response of monthly log growth, then mentally add the ordinates to obtain the level response shown in the cumulative companion plot. The selected candidate targets the final cumulative value only; it does not require every monthly return response to be zero.',
  priorityIrfKeys: ['sp500OnRate', 'rateOnRate'],
  readingNote:
    'This page has one extra transformation step that short-run pages do not: the plotted monthly growth responses must be accumulated before the identifying restriction can be evaluated.',
  readingSteps: [
    {
      title: '1. Identify the long-run object',
      body: `The Atlas VAR contains S&amp;P 500 log growth. A response ${mathHtml('&Psi;<sub>S&amp;P,policy</sub>(h)')} is the response of log growth at horizon ${mathHtml('h')}; summing those responses gives the cumulative response of the log stock-price level. Blanchard and Quah (1989) use the same growth-to-level accumulation logic when restricting the permanent output effect of a demand shock.`,
    },
    {
      title: '2. Follow the path, then score its endpoint',
      body: 'Use the companion chart to see whether early positive and negative return responses offset. The left objective plot discards that path detail and retains only the absolute final cumulative value for each rotation. Kilian and Lutkepohl (2017, Chapters 10-12) frame the corresponding applied target as a long-run multiplier, while the interim IRF traces the adjustment path.',
    },
    {
      title: '3. Keep finite horizon and long run separate',
      body: 'The display stops after 24 monthly horizons. A small endpoint is a visual analogue of long-run neutrality, not evidence that the infinite-horizon multiplier is zero. A slowly decaying response could look neutral at one endpoint and move again afterward. Faust and Leeper (1997) explain why long-run conclusions can be fragile to omitted shocks, dynamic approximation, and time aggregation.',
    },
  ],
  literatureTitle: 'From the finite Atlas sum to long-run SVAR identification',
  literatureNote:
    'The real literature replaces the displayed 24-horizon endpoint with a model-consistent infinite-horizon multiplier or VECM common-trend object. The economic restriction, data transformation, and rank structure must be designed together.',
  literatureSections: [
    {
      title: 'Benchmark origin: permanent supply and transitory demand',
      body: `Blanchard and Quah (1989) provided the canonical bivariate design for output growth and unemployment. Reduced-form covariance orthogonality supplies three restrictions; a fourth says that the aggregate-demand shock has no permanent effect on the level of output, while the aggregate-supply shock may. In modern notation, the restriction is a zero in the cumulative multiplier ${mathHtml('&Theta;(1)=&sum;<sub>h=0</sub><sup>&infin;</sup>&Theta;<sub>h</sub>')}. It selects an impact rotation that need not be recursive on impact. Their demand and supply labels come from this neutrality claim, not from a feature observed directly in the reduced-form data.`,
    },
    {
      title: 'Development into stationary, cointegrated, and mixed systems',
      body: `For a stable VAR in stationary transformed variables, the structural long-run multiplier is ${mathHtml('&Theta;(1)=A(1)<sup>-1</sup>B')}. A triangular long-run multiplier can sometimes be recovered by a Cholesky factorization of the long-run covariance matrix, after which the generally nonrecursive impact matrix is backed out. In integrated and cointegrated systems, the relevant object becomes the VECM common-trend multiplier ${mathHtml('&Upsilon;=&Xi;B')}. Its rank is fixed by the cointegrating rank, so some zero permanent effects follow mechanically from stationarity or cointegration and provide no additional identification. Long-run restrictions may identify permanent shocks while leaving several transitory shocks unresolved; applied models then stack short-run zeros, long-run zeros, signs, or other restrictions. Estimation uses long-run covariance factorization, nonlinear covariance equations, QR rotation algorithms, FIML, or narrower IV procedures.`,
    },
    {
      title: 'Important applications and what they added',
      body: 'The method expanded well beyond the original demand-supply decomposition. King, Plosser, Stock, and Watson used common trends to identify a balanced-growth shock. Gali used the claim that only technology shocks permanently affect labor productivity, opening a major debate over the response of hours and the ability of long-run SVARs to evaluate business-cycle models. Fisher separated neutral from investment-specific technology shocks. Enders and Lee distinguished real from nominal exchange-rate shocks. Beaudry and Portier combined stock prices and productivity to identify news about future productivity; the Kurmann-Mertens critique showed how cointegration can make a restriction redundant and leave infinitely many solutions. Larger monetary and oil systems often combine long-run neutrality with contemporaneous restrictions rather than relying on a purely long-run triangular scheme.',
    },
    {
      title: 'What the Atlas omits and why the method is criticized',
      body: `The Atlas fixes one bivariate reduced form and replaces ${mathHtml('&infin;')} with 24 horizons. Applied results can change when a variable is put in levels rather than differences, when deterministic trends or breaks are handled differently, when the cointegrating rank changes, or when a finite VAR approximates an underlying VARMA poorly. Long-run multipliers are low-frequency objects, so near-unit roots and inversion of an ill-conditioned ${mathHtml('A(1)')} can magnify small estimation errors. Faust and Leeper emphasize that a low-dimensional demand or supply shock can mix many omitted shocks and that time aggregation may destroy structural orthogonality. Column signs also remain arbitrary until normalized, and a short-run sign normalization can assume the very response the long-run design meant to learn. Bootstrap, Bayesian, and joint inference must therefore reflect persistence, transformation, rank, lag, and normalization uncertainty; a small finite-horizon endpoint alone addresses none of these issues.`,
    },
  ],
  literatureQuestions: [
    'Which variable is in levels, growth rates, or differences, and what infinite-horizon multiplier or common-trend object does the restriction actually constrain?',
    'What economic mechanism justifies the permanent-versus-transitory distinction, rather than merely fitting a convenient zero?',
    'Given the integration and cointegration ranks, does the long-run zero add identifying information or follow mechanically from the model?',
    'Are all shocks identified, or must long-run restrictions be combined with short-run zeros, signs, instruments, or other assumptions?',
    'How sensitive are the results to lag length, deterministic terms, breaks, near-unit roots, time aggregation, omitted shocks, and the inference method?',
  ],
  literatureRefs: [
    'Olivier J. Blanchard and Danny Quah (1989), "The Dynamic Effects of Aggregate Demand and Supply Disturbances" - the benchmark permanent-versus-transitory long-run SVAR.',
    'Robert G. King, Charles I. Plosser, James H. Stock, and Mark W. Watson (1991), "Stochastic Trends and Economic Fluctuations" - common trends and the balanced-growth-shock application.',
    'Jordi Gali (1999), "Technology, Employment, and the Business Cycle" - the influential technology-shock application and starting point for a large reliability debate.',
    'Jon Faust and Eric M. Leeper (1997), "When Do Long-Run Identifying Restrictions Give Reliable Results?" - omitted-shock, dynamic-aggregation, and time-aggregation cautions.',
    'Paul Beaudry and Franck Portier (2006), stock-price and productivity-news identification, read together with the Kurmann-Mertens (2014) nonuniqueness critique.',
    'Lutz Kilian and Helmut Lutkepohl (2016), Structural Vector Autoregressive Analysis, Chapters 10-12 - identification, estimation, and inference for stationary, integrated, cointegrated, and mixed long-run systems.',
  ],
  plotTitle: 'Finite-horizon cumulative neutrality loss',
  extra: 'Running cumulative S&amp;P 500 response',
};
