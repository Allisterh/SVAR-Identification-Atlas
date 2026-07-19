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
      title: '1. State the event claim before looking at the plots',
      body:
        'The maintained claim is stronger than “markets were turbulent in October 2008.” It says that one particular latent shock was negative and larger than the competing policy shock. That historical classification is an assumption supplied from outside the reduced-form VAR.',
    },
    {
      title: '2. Use the dial to recover alternative histories',
      body:
        'Each angle produces a covariance-equivalent impact matrix and therefore a different pair of recovered structural shocks. At the October marker, compare the stock-shock sign and the two absolute magnitudes.',
    },
    {
      title: '3. Interpret zero as acceptance, not as a best score',
      body:
        'The loss counts violations. Every zero-loss rotation is equally admissible under this simple rule; a rotation with loss one or two contradicts part or all of the maintained narrative.',
    },
    {
      title: '4. Carry the accepted set into the IRFs',
      body:
        'The event does not normally select a unique impact matrix. Read the accepted IRFs as the dynamic range consistent with both the reduced form and the dated story, and keep the event-classification uncertainty in mind.',
    },
  ],
  literatureTitle: 'From the Atlas event filter to the narrative-restrictions literature',
  literatureLead:
    'The Atlas displays the smallest useful building block: one reduced form, one date, two event inequalities, and an unweighted accepted set. The literature embeds this idea in a much richer history of narrative shock measurement, set identification, historical decompositions, and posterior inference.',
  literatureSections: [
    {
      title: 'Origins: from narrative shock series to restrictions inside an SVAR',
      body:
        'Romer and Romer (1989, Abstract and Sections 2&ndash;3) use FOMC minutes and Records of Policy Actions to identify six episodes in which the Federal Reserve deliberately attempted to create a recession to reduce inflation. Romer and Romer (2010, Abstract and Sections I&ndash;II) use primary policy records to classify legislated tax changes by motivation and retain inherited-deficit and long-run changes as unrelated to current or prospective economic conditions. Ramey (2011, Abstract and Sections IV&ndash;V) shows that military dates and professional forecasts Granger-cause VAR spending shocks and constructs a defense-news series from contemporaneous reports to date changes in expected spending. Kilian (2008, Abstract) proposes a new measure of exogenous oil-supply shocks and finds that only a small fraction of oil-price increases during crisis episodes is attributable to exogenous production disruptions.',
    },
    {
      title: 'The main formal variants',
      body:
        'Antol&iacute;n-D&iacute;az and Rubio-Ram&iacute;rez (2018, Section II.B) define narrative shock-sign restrictions that require a named recovered structural shock to be positive or negative at selected dates. In Section II.C, they define Type A historical-decomposition restrictions by comparing one shock with each competing contribution and Type B restrictions by comparing it with the sum of all competing contributions.',
    },
    {
      title: 'Development and applications',
      body:
        'Antol&iacute;n-D&iacute;az and Rubio-Ram&iacute;rez (2018, Abstract and Sections IV&ndash;V) use narrative restrictions around the August 1990 Persian Gulf War and the October 1979 Volcker reform and show that even one event can sharply narrow the admissible structural set. Ludvigson, Ma, and Ng (2021, Sections III.B&ndash;III.C) restrict recovered shocks at selected historical events and impose signed-correlation inequalities with stock returns and real gold-price changes, explicitly without treating those external variables as valid instruments.',
    },
    {
      title: 'What a full literature implementation adds',
      body:
        'Antol&iacute;n-D&iacute;az and Rubio-Ram&iacute;rez (2018, Section III, equation (17), and Algorithm 1) show that narrative restrictions truncate the likelihood and weight accepted draws by the inverse model-implied probability of satisfying the event. The Atlas instead holds the reduced form fixed and uses an unweighted finite-grid filter, so it illustrates the identifying logic rather than reproducing that Bayesian posterior.',
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
  plotTitle: 'October 2008 narrative restriction',
  extra: 'Recovered shocks over time',
};
