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
        'The rule assumes that the policy shock is the shock that best explains interest-rate forecast uncertainty over H periods, following the max-share idea in Uhlig (2004). A different variable, horizon, weighting, or frequency band defines a different identifying problem.',
    },
    {
      title: '2. Read the FEVD as a share',
      body:
        'The numerator adds squared rate responses to the candidate policy shock. The denominator adds squared rate responses to all shocks. Their ratio lies between zero and one and answers how much of the H-step rate forecast error this candidate shock receives. Barsky and Sims (2011) use the same share logic for productivity news, together with a zero-impact restriction.',
    },
    {
      title: '3. Match the peak to the trough',
      body:
        'The FEVD-share peak on the right must occur at the loss trough on the left because the loss is one minus the share. The selected angle is an optimizer, not a rotation that fits the reduced-form data better; Arias, Rubio-Ramirez, and Waggoner (2018) stress that such optimization is not the same object as inference over an admissible set.',
    },
    {
      title: '4. Interpret the IRFs conditionally on the objective',
      body:
        'The selected responses describe the shock direction that wins this contest. They do not show that the winner is a unique primitive disturbance; Carriero and Volpicella (2025) show why one-shock-at-a-time selection can mix related shocks and replace it with a joint multi-shock objective.',
    },
  ],
  literatureTitle: 'From the Atlas FEVD peak to objective-based identification in the literature',
  literatureLead:
    'Max-share is part of a wider family of objective-based SVAR selectors. These methods choose one rotation because it maximizes a researcher-declared economic target; the target, constraints, and optimization order are therefore the identifying assumptions.',
  literatureSections: [
    {
      title: 'Origins: maximized variance shares for output and news shocks',
      body:
        'The max-share literature begins with Uhlig (2004), who proposed identifying a shock by the forecast-error variance share it explains. Barsky and Sims (2011) gave the approach a particularly influential economic interpretation: their technology-news shock has no contemporaneous effect on productivity and, among directions satisfying that zero restriction, explains the largest share of future productivity forecast errors. This is already richer than the Atlas because an economically motivated zero restriction and a long-horizon variance objective work together.',
    },
    {
      title: 'Applications and the move from one target to several',
      body:
        'The approach has been used for technology and news shocks, credit shocks, inflation-target shocks, sentiment, and uncertainty or financial disturbances. Caldara, Fuentes-Albero, Gilchrist, and Zakrajsek (2016) use a closely related penalty-function method: they maximize persistent impulse-response mass rather than a FEVD share and identify uncertainty and financial shocks sequentially. Their results vary with the sequence. Carriero and Volpicella (2025) respond by selecting macro-uncertainty, financial-uncertainty, and credit-supply shocks jointly in one constrained max-share problem.',
    },
    {
      title: 'Important versions of the method',
      body:
        'For a single unconstrained shock, maximizing a normalized FEVD share is a leading-eigenvector problem, unique only when the leading eigenvalue is separated and with the sign still needing a normalization. Sign, zero, or inequality restrictions turn it into a constrained rotation problem. Sequential multi-shock max-share identifies one direction and searches in its orthogonal complement for the next, so labels can depend on order. Joint max-share instead optimizes several orthogonal columns together; Carriero and Volpicella add FEVD-dominance inequalities requiring each shock to explain its own target more than the other target variables, plus optional signs and feasibility or uniqueness conditions.',
    },
    {
      title: 'How the Atlas differs from an empirical implementation',
      body:
        'The Atlas fixes one bivariate reduced form, one rate target, one horizon, and one shock, then searches a finite angle grid. An empirical one-shock implementation forms a quadratic FEVD criterion and solves analytically or numerically; a multi-shock implementation solves a constrained optimization over orthogonal vectors. Bayesian applications repeat the identification step across reduced-form posterior draws and report uncertainty conditional on the objective and constraints. They also need a sign anchor, diagnostics for a tied or nearly tied optimum, and sensitivity to alternative targets and horizons.',
    },
    {
      title: 'Critiques and interpretation limits',
      body:
        'Maximizing a share does not prove that the optimizer is a primitive structural shock. A direction can win by mixing several disturbances that all move the target, especially when targets are highly correlated. One-at-a-time selection can make later shocks depend on arbitrary ordering; joint selection reduces that problem but shifts discretion to target variables, horizon, objective weights, signs, and FEVD-dominance rules. A flat or tied objective weakens the label, while a sharp optimum can still be economically misspecified. Finally, posterior or bootstrap bands usually condition on the chosen objective and linear VAR, not on uncertainty about whether that objective is the right economic definition.',
    },
  ],
  literatureQuestions: [
    'Why is this target variable, horizon, frequency band, or objective weight the right definition of the shock?',
    'Which zero, sign, or FEVD-dominance restrictions supplement the max-share objective?',
    'Is the optimum unique, well separated, and stable across reduced-form draws and nearby specifications?',
    'Are several shocks selected sequentially or jointly, and how sensitive are their labels to ordering?',
    'Do the uncertainty statements condition on the chosen objective, and are alternative targets and horizons reported?',
  ],
  literatureRefs: [
    'Uhlig (2004), "What Moves GNP?": an early max-share formulation that identifies a shock through the forecast-error variance it explains.',
    'Barsky and Sims (2011), "News Shocks and Business Cycles," Journal of Monetary Economics 58(3): a no-current-productivity-effect restriction combined with maximum future productivity FEVD share.',
    'Caldara, Fuentes-Albero, Gilchrist, and Zakrajsek (2016), "The Macroeconomic Impact of Financial and Uncertainty Shocks": a related sequential penalty-function selector based on persistent target responses rather than FEVD shares.',
    'Carriero and Volpicella (2025), "Max Share Identification of Multiple Shocks: An Application to Uncertainty and Financial Conditions," Journal of Business and Economic Statistics 43(1): joint multi-shock optimization with FEVD-dominance restrictions.',
    'Arias, Rubio-Ramirez, and Waggoner (2018), "Inference Based on Structural Vector Autoregressions Identified With Sign and Zero Restrictions: Theory and Applications": why an optimizer over admissible rotations is not the same object as set inference.',
    'Kilian and Lutkepohl, Structural Vector Autoregressive Analysis, Chapters 4 and 17: FEVD construction, nonfundamentalness, and the Barsky-Sims technology-news selector.',
  ],
  plotTitle: 'Forecast-error variance share',
  extra: 'Rate FEVD share across rotation angle',
};
