import { mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('L(&theta;) = 1{e<sub>stock, Oct 2008</sub>(&theta;) &ge; 0} + 1{|e<sub>policy, Oct 2008</sub>(&theta;)| &ge; |e<sub>stock, Oct 2008</sub>(&theta;)|}')}`,
  assumptionSummary: 'October 2008 contained a negative stock-market shock larger than the policy shock in absolute value.',
  atlasRuleSummary: 'Count failed event statements; accept a rotation only when the count is zero.',
  outputSummary: 'A set of event-compatible rotations, not one uniquely estimated shock.',
  cardIntro:
    'Narrative restrictions bring a historical claim into the SVAR identification problem. The claim must concern a latent shock or its contribution, not merely say that an important event occurred. Here the maintained story is that October 2008 contained a negative stock-market shock whose absolute size exceeded the policy shock. Every rotation still fits the same reduced-form covariance, but each rotation recovers a different shock history. The Atlas therefore keeps all rotations whose October 2008 history agrees with the story and rejects the others.',
  intuitionAssumption:
    'A historically documented episode reveals the sign, relative size, or contribution of one latent structural shock.',
  intuitionTranslation:
    'At the October 2008 marker, the recovered stock shock must be negative and larger in absolute value than the recovered policy shock. A zero loss means both statements hold.',
  intuition:
    'Narrative identification uses a dated historical episode as information about latent shocks. In this illustration, October 2008 is treated as a month dominated by a negative stock-market shock. A rotation is accepted only if the recovered shocks at that date agree with both parts of that maintained story.',
  detail:
    `${mathHtml('Accept if e<sub>stock, Oct 2008</sub>(&theta;) &lt; 0 and |e<sub>stock, Oct 2008</sub>(&theta;)| &gt; |e<sub>policy, Oct 2008</sub>(&theta;)|')}`,
  chartTakeaway:
    'A loss of zero means “historically admissible,” not “proved true.” A loss of one or two reports how many parts of the maintained October 2008 story fail.',
  criterionHeadline: 'Ask whether each candidate shock history agrees with the dated event story.',
  criterionIntro:
    'For each angle, the Atlas recovers both October 2008 shocks and checks two event statements: the stock shock is negative, and its absolute size exceeds the policy shock. Each indicator in the formula switches to one when its statement fails. Their sum is therefore a violation count from zero to two, with every zero-loss rotation accepted rather than one of them ranked as best.',
  objectivePlotNote:
    'The left plot applies the event check across the rotation grid. Zero plateaus satisfy both statements, one means either the sign or size comparison fails, and two means both fail; the vertical marker locates the current rotation.',
  extraPlotNote:
    'The companion plot shows both recovered shock histories at the current angle. At the October 2008 marker, check first whether the stock shock is below zero and then whether it lies farther from zero than the policy shock. Those two visual checks determine the loss in the left plot.',
  irfIntro:
    'The historical restriction is imposed at one date, but it changes which full dynamic models remain admissible. Compare the loss-colored paths first, then switch to accepted rotations to see the range of IRFs that the event story leaves open. A wide accepted range is genuine set-identification uncertainty, not a reason to choose the most convenient path.',
  priorityIrfKeys: ['rateOnSp500', 'sp500OnSp500'],
  readingSteps: [
    {
      title: '1. State the event claim before looking at the plots &mdash; Kilian and Lutkepohl (2017)',
      body:
        'The maintained claim is stronger than “markets were turbulent in October 2008.” It says that one particular latent shock was negative and larger than the competing policy shock. That historical classification is an assumption supplied from outside the reduced-form VAR.',
    },
    {
      title: '2. Use the dial to recover alternative histories',
      body:
        'Each angle produces a covariance-equivalent impact matrix and therefore a different pair of recovered structural shocks. This model-dependent event history is the central object in Antolin-Diaz and Rubio-Ramirez (2018). At the October marker, compare the stock-shock sign and the two absolute magnitudes.',
    },
    {
      title: '3. Interpret zero as acceptance, not as a best score',
      body:
        'The loss counts violations. Every zero-loss rotation is equally admissible under this simple rule, following the set-inference logic emphasized by Arias, Rubio-Ramirez, and Waggoner (2018); a rotation with loss one or two contradicts part or all of the maintained narrative.',
    },
    {
      title: '4. Carry the accepted set into the IRFs',
      body:
        'The event does not normally select a unique impact matrix. Read the accepted IRFs as the dynamic range consistent with both the reduced form and the dated story, as in the event-inequality application of Ludvigson, Ma, and Ng (2021), and keep the event-classification uncertainty in mind.',
    },
  ],
  literatureTitle: 'From the Atlas event filter to the narrative-restrictions literature',
  literatureLead:
    'The Atlas displays the smallest useful building block: one reduced form, one date, two event inequalities, and an unweighted accepted set. The literature embeds this idea in a much richer history of narrative shock measurement, set identification, historical decompositions, and posterior inference.',
  literatureSections: [
    {
      title: 'Origins: from narrative shock series to restrictions inside an SVAR',
      body:
        'Macroeconomists first used historical records to construct direct shock series: Romer and Romer monetary-policy dates and tax changes, Ramey government-spending news, and oil-supply disruptions are prominent examples in the literature. Those series face difficult questions about timing, predictability, measurement error, and contamination. Antolin-Diaz and Rubio-Ramirez (2018) made a different move: retain the latent shocks of an SVAR, but rule out rotations whose recovered history contradicts a small number of credible event statements.',
    },
    {
      title: 'The main formal variants',
      body:
        'A shock-sign restriction says that a named shock was positive or negative on a date. A Type A historical-decomposition restriction says that one shock was the most or least important contributor to an unexpected movement relative to each competing shock. A stronger Type B restriction says that its absolute contribution exceeded the sum of all other contributions, or was negligible relative to them. Real applications can combine several dates, ordinary sign or zero restrictions, elasticity bounds, and restrictions over event windows rather than one observation.',
    },
    {
      title: 'Development and applications',
      body:
        'Antolin-Diaz and Rubio-Ramirez use Persian Gulf War oil-market episodes to separate oil-supply and demand shocks and use the October 1979 Volcker reform to sharpen monetary-policy inference. Ludvigson, Ma, and Ng (2021) develop a related event-inequality design for macro and financial uncertainty: crisis dates restrict recovered shocks, while stock returns and real gold-price changes enter as signed correlation constraints rather than clean Proxy-SVAR instruments. These applications show that “narrative” can mean a shock sign, a relative contribution, or a collection of weaker event inequalities; the exact object must always be stated.',
    },
    {
      title: 'What a full literature implementation adds',
      body:
        'The Atlas holds the reduced form fixed and simply filters a finite angle grid. In the Bayesian procedure of Antolin-Diaz and Rubio-Ramirez, researchers also draw reduced-form parameters and rotations, recover shocks and historical decompositions, and condition on the narrative event. Because the event depends on realized model-implied shocks, it truncates the likelihood. Accepted draws therefore receive an importance weight proportional to the inverse of the model-implied probability that simulated shocks would satisfy the event; plain accept-reject filtering targets a different posterior.',
    },
    {
      title: 'Caveats and critiques to carry into applied work',
      body:
        'A famous date is not automatically an exogenous shock. The classification may be retrospective, predictable from the VAR information set, contaminated by several shocks, mistimed, or better understood as a regime change. “Dominance” must also be defined carefully: shock magnitude, contribution to one observable, and contribution relative to all other shocks are different claims. The fraction of accepted rotations is not a specification test, and pointwise median IRFs can splice together coordinates from different admissible models. Report the event rationale, sensitivity to removing individual dates, feasible response paths, and the importance-weight behavior.',
    },
  ],
  literatureQuestions: [
    'Which historical source supports the date, shock label, sign, and timing independently of the desired SVAR result?',
    'Is the restriction about shock sign, shock magnitude, or a historical-decomposition contribution, and is dominance Type A or Type B?',
    'How sensitive is the accepted set to removing one episode, widening the event window, or treating the episode as a regime change?',
    'If the analysis is Bayesian, are the inverse-probability importance weights implemented and stable?',
    'Does the paper report feasible response paths and joint uncertainty rather than one optimized rotation or a stitched pointwise median?',
  ],
  literatureRefs: [
    'Antolin-Diaz and Rubio-Ramirez (2018), "Narrative Sign Restrictions for SVARs," American Economic Review 108(10): the formal shock-sign and historical-decomposition framework, Bayesian weighting, and oil and monetary applications.',
    'Kilian and Lutkepohl, Structural Vector Autoregressive Analysis, Chapter 7: the historical route from narrative, news, and market-expectations measures to structurally interpreted shocks.',
    'Ludvigson, Ma, and Ng (2021), "Uncertainty and Business Cycles: Exogenous Impulse or Endogenous Response?": event inequalities and external-variable sign constraints for macro and financial uncertainty.',
    'Arias, Rubio-Ramirez, and Waggoner (2018), "Inference Based on Structural Vector Autoregressions Identified With Sign and Zero Restrictions: Theory and Applications": admissible-set inference and the danger of replacing a set with one optimized rotation.',
    'Kilian and Lutkepohl, Structural Vector Autoregressive Analysis, Chapter 13: historical restrictions, mixed sign-zero algorithms, rotation priors, and set-identification reporting.',
  ],
  plotTitle: 'October 2008 narrative restriction',
  extra: 'Recovered shocks over time',
};
