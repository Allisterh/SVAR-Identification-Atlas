import { mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('L(&theta;) = 1 - FEVD<sub>policy</sub>(H, &theta;)')}`,
  assumptionSummary: 'The policy shock is the direction that explains the most H-step interest-rate forecast uncertainty.',
  atlasRuleSummary: 'Compute the rate FEVD share at every angle and choose its maximum.',
  outputSummary: 'One optimizer conditional on the target variable and horizon, not an accepted set.',
  cardIntro:
    `A forecast-error variance decomposition normally describes how an already identified set of shocks accounts for forecast uncertainty. Max-share reverses that order: it labels the shock by finding the rotation that makes one shock explain as much as possible of a chosen variable's forecast-error variance over a chosen horizon. In the Atlas, the candidate policy shock is the direction that maximizes the rate FEVD share. The target variable and horizon are therefore assumptions that define the shock, not neutral plotting choices.`,
  intuitionAssumption:
    `The economically relevant shock should be the dominant source of forecast uncertainty in a chosen target variable over a chosen horizon.`,
  intuitionTranslation:
    'The Atlas labels the policy shock by choosing the rotation at which that shock explains the largest H-step share of the interest-rate forecast error.',
  intuition:
    `Max-share turns a variance-decomposition diagnostic into an identifying rule. The selected structural direction is the one that explains the largest share of forecast uncertainty in a declared target variable over a declared horizon.`,
  detail:
    `${mathHtml('FEVD<sub>policy</sub>(H,&theta;) = &sum;<sub>h=0</sub><sup>H-1</sup>&Psi;<sub>rate,policy</sub>(h;&theta;)<sup>2</sup> / &sum;<sub>j</sub>&sum;<sub>h=0</sub><sup>H-1</sup>&Psi;<sub>rate,j</sub>(h;&theta;)<sup>2</sup>')}`,
  chartTakeaway:
    'The trough of the loss and the peak of the FEVD share are the same angle. That optimum is only as persuasive as the assumption that the policy shock should dominate rate forecast uncertainty over H periods.',
  criterionHeadline: 'Turn the rate FEVD from a diagnostic into a one-shock selector.',
  criterionIntro:
    'For each angle, the FEVD share is the fraction of the rate forecast error attributed to the candidate policy shock over horizons zero through H minus one. The share lies between zero and one. Because the loss is one minus that share, a share of 0.70 becomes a loss of 0.30; minimizing the loss is exactly the same decision as maximizing the share.',
  objectivePlotNote:
    'The left plot compares one minus the FEVD share across angles. The trough is the rotation assigning the largest share of rate forecast uncertainty to the candidate policy shock; the vertical marker shows the current angle. The loss is not a p-value or overall model-fit measure.',
  extraPlotNote:
    'The companion plot shows the same information as the FEVD share itself. Its peak must line up with the loss trough in the left plot: one rises exactly when the other falls. Changing the target variable or H would generally change both curves and the selected angle.',
  irfIntro:
    'The IRFs show the dynamic story attached to the objective-selected direction. All-rotations mode reveals how strongly the responses change as the FEVD score worsens; chosen-candidate mode shows only the optimizer. The second view is convenient, but it hides the rotation alternatives and should not be mistaken for set-identification uncertainty.',
  priorityIrfKeys: ['rateOnRate', 'sp500OnRate'],
  readingSteps: [
    {
      title: '1. Fix the target before turning the dial',
      body:
        'Decide which variable the shock should dominate and over how many periods. A different target, horizon, weighting, or frequency band defines a different identifying problem.',
    },
    {
      title: '2. Read the FEVD as a share',
      body:
        'The numerator adds squared rate responses to the candidate policy shock. The denominator adds squared rate responses to all shocks. Their ratio lies between zero and one and answers how much of the H-step rate forecast error this candidate shock receives.',
    },
    {
      title: '3. Match the peak to the trough',
      body:
        'The FEVD-share peak on the right must occur at the loss trough on the left because the loss is one minus the share. The selected angle wins the declared contest; it does not fit the reduced-form data better than the other rotations.',
    },
    {
      title: '4. Interpret the IRFs conditionally on the objective',
      body:
        'The selected responses describe the shock direction that wins this contest. They do not by themselves show that the winner is the only economically meaningful direction or a primitive disturbance.',
    },
  ],
  literatureTitle: 'From the Atlas FEVD peak to objective-based identification in the literature',
  literatureLead:
    'Max-share is part of a wider family of objective-based SVAR selectors. These methods choose one rotation because it maximizes a researcher-declared economic target; the target, constraints, and optimization order are therefore the identifying assumptions.',
  literatureSections: [
    {
      title: 'Two benchmark variance-share designs',
      body:
        'Uhlig (2004, Abstract) searches for two VAR shocks that together explain most of real GNP\'s k-step prediction-error variance over horizons from zero to five years. Barsky and Sims (2011, Abstract and Section 2.1) identify a technology-news shock that is orthogonal to the current TFP innovation and maximizes the sum of its contributions to future TFP forecast-error variance over a finite horizon. The second design therefore combines an impact exclusion with a future-variance objective.',
    },
    {
      title: 'Sequential and joint selection of several shocks',
      body:
        'Caldara, Fuentes-Albero, Gilchrist, and Zakrajsek (2016, Sections 1 and 3.1) first choose an uncertainty shock by maximizing its target proxy\'s response over a prespecified horizon, then choose an orthogonal financial shock by maximizing the response of a financial-conditions indicator over the same horizon. They also repeat the two penalty-function steps in the reverse order. Carriero and Volpicella (2025, Section 3.1) instead jointly maximize a forecast-error-variance objective over several orthonormal shock directions.',
    },
    {
      title: 'What the joint constraints add',
      body:
        'Carriero and Volpicella (2025, equation 3.2) require each selected shock to contribute more to the forecast-error variance of its own target than to the variances of the other target variables. Their Proposition 3.2 gives a sufficient condition for the constrained joint problem to be non-empty. Their Proposition 3.3 gives a sufficient condition for a feasible solution to be unique when the relevant target responses satisfy the stated sign restrictions. For the Atlas\'s single unconstrained shock, the objective is simply a quadratic variance-share contest over one rotation angle.',
    },
    {
      title: 'How the Atlas differs from an empirical implementation',
      body:
        'Carriero and Volpicella\'s (2025, Algorithm 3.1) Bayesian implementation draws reduced-form VAR parameters, checks that the constrained problem is non-empty, solves the joint optimization, and repeats those steps. They note that maximum-likelihood or bootstrap draws can replace posterior draws. The Atlas fixes one bivariate reduced form, one rate target, one horizon, and one shock, then searches a finite angle grid. It illustrates the conditional optimizer rather than sampling uncertainty.',
    },
    {
      title: 'Confounding and interpretation limits',
      body:
        'Carriero and Volpicella (2025, Example 2.1) show analytically how standard one-at-a-time max-share can produce a linear combination of the data-generating shocks. Their Section 3.3 simulations compare that procedure with joint identification. Joint selection addresses that particular confounding problem, but the economic label still depends on the chosen targets, horizon, objective, signs, and dominance constraints. A sharp numerical optimum cannot establish that those assumptions are the right economic definition of the shock.',
    },
  ],
  literatureQuestions: [
    'Why is this target variable, horizon, frequency band, or objective weight the right definition of the shock?',
    'Which zero, sign, or FEVD-dominance restrictions supplement the max-share objective?',
    'Is the optimum unique, well separated, and stable across reduced-form draws and nearby specifications?',
    'Are several shocks selected sequentially or jointly, and how sensitive are their labels to ordering?',
    'Do the uncertainty statements condition on the chosen objective, and are alternative targets and horizons reported?',
  ],
  plotTitle: 'Forecast-error variance share',
  extra: 'Rate FEVD share across rotation angle',
};
