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
      body: `The Atlas VAR contains S&amp;P 500 log growth. A response ${mathHtml('&Psi;<sub>S&amp;P,policy</sub>(h)')} is the response of log growth at horizon ${mathHtml('h')}; summing those responses gives the cumulative response of the log stock-price level.`,
    },
    {
      title: '2. Follow the path, then score its endpoint',
      body: 'Use the companion chart to see whether early positive and negative return responses offset. The left objective plot discards that path detail and retains only the absolute final cumulative value for each rotation.',
    },
    {
      title: '3. Keep finite horizon and long run separate',
      body: 'The display stops after 24 monthly horizons. A small endpoint is a visual analogue of long-run neutrality, not evidence that the infinite-horizon multiplier is zero. A slowly decaying response could look neutral at one endpoint and move again afterward.',
    },
  ],
  literatureTitle: 'From the finite Atlas sum to long-run SVAR identification',
  literatureNote:
    'The real literature replaces the displayed 24-horizon endpoint with a model-consistent infinite-horizon multiplier or VECM common-trend object. The economic restriction, data transformation, and rank structure must be designed together.',
  literatureSections: [
    {
      title: 'Benchmark origin: permanent supply and transitory demand',
      body: 'Blanchard and Quah (1989, Sections I&ndash;II) model U.S. output growth and unemployment and identify a demand disturbance by imposing that it has no long-run effect on the level of output. The covariance restrictions plus this zero identify the two structural shocks without requiring a recursive impact matrix.',
    },
    {
      title: 'Development into stationary, cointegrated, and mixed systems',
      body: 'Kilian and L&uuml;tkepohl (2017, Chapter 10, Section 10.2) show that a triangular long-run multiplier in a stationary VAR can be recovered from a Cholesky factorization of the long-run covariance and then mapped back to a generally nonrecursive impact matrix. In cointegrated systems, Section 10.3 shows that the common-trend multiplier has rank K&minus;r, so zeros implied by stationarity or rank add no identifying information and long-run restrictions can leave transitory shocks unresolved.',
    },
    {
      title: 'Important applications and what they added',
      body: 'King, Plosser, Stock, and Watson (1991, Abstract and Sections I&ndash;II) identify permanent productivity shocks with the common stochastic trend in output, consumption, and investment. Gal&iacute; (1999, Abstract and Section II) identifies technology shocks by assuming that only they can permanently affect labor productivity and finds that hours decline persistently after a positive technology shock. Beaudry and Portier (2006, Abstract and Sections I&ndash;II) identify a shock that moves stock prices immediately but affects productivity only with a substantial delay and interpret it as news about future technology. Kurmann and Mertens (2014, Abstract and Section I) show that this identification is not unique in the Beaudry&ndash;Portier VECMs with more than two variables because of the interaction between cointegration and long-run restrictions.',
    },
    {
      title: 'What the Atlas omits and why the method is criticized',
      body: 'Faust and Leeper (1997, Sections 2&ndash;4) show that long-run identification can be unreliable because long-run effects are imprecisely estimated and because aggregation across variables or time can mix the underlying structural shocks. The Atlas uses only a finite endpoint, so it does not address persistence, transformation, rank, lag, omitted-shock, aggregation, or normalization uncertainty.',
    },
  ],
  literatureQuestions: [
    'Which variable is in levels, growth rates, or differences, and what infinite-horizon multiplier or common-trend object does the restriction actually constrain?',
    'What economic mechanism justifies the permanent-versus-transitory distinction, rather than merely fitting a convenient zero?',
    'Given the integration and cointegration ranks, does the long-run zero add identifying information or follow mechanically from the model?',
    'Are all shocks identified, or must long-run restrictions be combined with short-run zeros, signs, instruments, or other assumptions?',
    'How sensitive are the results to lag length, deterministic terms, breaks, near-unit roots, time aggregation, omitted shocks, and the inference method?',
  ],
  plotTitle: 'Finite-horizon cumulative neutrality loss',
  extra: 'Running cumulative S&amp;P 500 response',
};
