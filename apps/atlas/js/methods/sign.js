import { bEntry, mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('L(&theta;) = 1{')}${bEntry(2, 1)}${mathHtml(' > 0}')}`,
  assumptionSummary: 'A contractionary policy shock should not raise the stock return on impact.',
  atlasRuleSummary: `Accept rotations with non-positive ${bEntry(2, 1)}; reject rotations with the opposite sign.`,
  outputSummary: 'A set of sign-consistent rotations, not one estimated best rotation.',
  cardIntro:
    'Sign restrictions identify shocks with qualitative predictions instead of exact numerical zeros. In the Atlas, a contractionary monetary-policy shock should lower the S&amp;P 500 return on impact, but that single inequality is satisfied by many covariance-equivalent rotations. The method therefore works as a filter: it removes wrong-sign rotations and keeps every sign-consistent rotation. The surviving impulse responses form an admissible set, so dispersion across them is part of identification rather than a nuisance to optimize away. Choosing one best-looking rotation would add information that the displayed sign rule does not contain.',
  intuitionAssumption:
    'Economic theory may be more convincing about a direction of movement than about an exact zero or response size.',
  intuitionTranslation:
    `Here ${bEntry(2, 1)} is the impact of the policy shock (column 1) on the S&amp;P 500 growth residual (row 2). Rotations with a non-positive impact pass the Atlas rule; rotations with a positive impact fail.`,
  intuition:
    `A sign restriction rules out rotations that contradict a qualitative prediction. Here the prediction is that a contractionary policy shock does not raise the S&amp;P 500 return on impact, so rotations with non-positive ${bEntry(2, 1)} are retained. The rule does not rank the accepted rotations or constrain the later response path.`,
  detail:
    `<p><strong>Violation indicator:</strong> ${mathHtml('L(&theta;)=0')} means accepted and ${mathHtml('L(&theta;)=1')} means rejected. The Atlas treats the exact zero boundary as accepted.</p>`,
  chartTakeaway:
    'Zero loss means admissible, not best. Every accepted rotation satisfies the same one-sign rule even when its other impacts and later responses differ sharply.',
  criterionHeadline: `Use the sign of ${bEntry(2, 1)} to split the rotation cloud into two sets.`,
  criterionIntro:
    `The highlighted entry ${bEntry(2, 1)} is the impact response of S&amp;P 500 growth to the policy shock. In the formula, ${mathHtml('1{b<sub>21</sub>(&theta;) > 0}')} equals one when that response has the forbidden positive sign and zero otherwise. The rule therefore filters rotations into rejected and accepted sets; it does not rank the rotations that pass.`,
  objectivePlotNote:
    'The left plot applies that pass-or-fail rule at every angle. Zero plateaus are accepted regions and one plateaus are rejected regions; the vertical marker locates the current dial setting. Every angle on a zero plateau is equally admissible under this one-sign rule.',
  extraPlotNote:
    `The companion plot shows the underlying impact ${bEntry(2, 1)}. Non-positive values map to zero loss, positive values map to one, and crossings of the horizontal zero line create the boundaries between the plateaus in the left plot.`,
  irfIntro:
    'The only imposed statement concerns the S&amp;P 500 response on impact. The rate response, the stock response after horizon 0, and the responses to the other shock remain unrestricted. Read the accepted IRFs as a set of possible dynamics conditional on this fixed reduced form; the cloud does not yet include sampling or posterior uncertainty about the VAR.',
  priorityIrfKeys: ['sp500OnRate', 'rateOnRate'],
  readingNote:
    'Read this page as a filter, not an optimization exercise. The central question is what the single sign removes from the rotation cloud and, just as importantly, what it leaves unresolved.',
  readingSteps: [
    {
      title: '1. Decode the sign statement',
      body: `Use row first, column second. ${bEntry(2, 1)} is the impact response of S&amp;P 500 growth to the policy shock. Negative or zero passes the Atlas rule; positive violates it. No magnitude target is imposed. Uhlig (2005) popularized this qualitative logic using several signed responses over several horizons rather than the single impact sign used here.`,
    },
    {
      title: '2. Read zero loss as membership',
      body: 'On the objective plot, every angle on a zero plateau belongs to the accepted set. A lower value does not identify one rotation within that plateau, and the length of the plateau is not a p-value or specification test. Rubio-Ramirez, Waggoner, and Zha (2010) formalize the rotation geometry behind this admissible-set view.',
    },
    {
      title: '3. Inspect what remains unidentified',
      body: 'Switch to accepted rotations and compare complete IRF paths. If they tell different stories after impact, that variation is exactly what the one-sign restriction has not identified. A single representative path would require an additional, declared summary or selection rule. Arias, Rubio-Ramirez, and Waggoner (2018) show that selecting one optimized representative adds identifying content beyond the stated signs and zeros.',
    },
  ],
  literatureTitle: 'From one impact sign to the sign-restriction literature',
  literatureNote:
    'Applied sign-restricted SVARs usually impose several signs, bounds, or equality restrictions and carry both reduced-form and rotation uncertainty through inference. Their natural output remains an admissible set unless extra information point-identifies a shock.',
  literatureSections: [
    {
      title: 'Origins and the agnostic monetary-policy benchmark',
      body: 'Early sign-restriction work associated with Faust and with Canova and De Nicolo used qualitative response patterns to avoid fragile recursive exclusions. Uhlig (2005) made the approach canonical for monetary policy. He identified a contractionary policy impulse by requiring the federal funds rate to rise and prices, commodity prices, and nonborrowed reserves to fall for several months, while deliberately leaving real GDP unrestricted. The result was economically instructive precisely because it was not sharp: the accepted set did not force output to fall. This established the main trade-off. Signs can be easier to defend than exact zeros, but inequalities usually replace point identification with set identification.',
    },
    {
      title: 'Major variants and applications',
      body: 'The modern restriction menu is much wider than one impact sign. Static signs constrain impact responses; dynamic signs constrain selected horizons; elasticity bounds constrain ratios of impacts; shape restrictions encode monotonicity or hump shapes; narrative restrictions constrain recovered shocks or historical-decomposition contributions at named dates; and mixed sign-zero designs combine inequalities with exact impact, finite-horizon, or long-run equalities. Mountford and Uhlig (2009) extended the method to fiscal shocks and policy scenarios. Kilian and Murphy (2012) showed in the oil market that impact signs alone admitted implausibly elastic supply responses, while economically motivated elasticity and activity bounds narrowed the set sharply. Antolin-Diaz and Rubio-Ramirez (2018) formalized narrative sign restrictions. More recent hybrid designs combine signs with external instruments or other statistical information.',
    },
    {
      title: 'Rotation sampling, inference, and reporting',
      body: `In higher dimensions, researchers usually draw orthogonal matrices ${mathHtml('Q')} with a Gaussian-matrix QR decomposition, form candidate impacts ${mathHtml('P Q')}, normalize column signs, and retain draws satisfying the restrictions. A full Bayesian exercise also draws reduced-form coefficients and covariance matrices before drawing rotations. Rubio-Ramirez, Waggoner, and Zha (2010) supplied the general rotation and rank framework. Arias, Rubio-Ramirez, and Waggoner (2018) showed how to draw from Haar measure conditional on exact zero restrictions and then filter by signs; unrestricted draws will never hit a measure-zero equality. Reporting must preserve the set geometry. Pointwise medians can splice ordinates from different admissible models into a path that no rotation generates, so feasible model paths and joint credible sets are preferable when shape and comovement matter.`,
    },
    {
      title: 'What the Atlas omits and the main critiques',
      body: 'The Atlas holds the reduced form fixed and applies one weak impact inequality. Applied designs often use strict signs on several variables and horizons, inspect whether shocks have distinct sign patterns, and account for uncertainty in the VAR itself. Set identification is not the same as partial identification: every shock can be labeled while each response remains set-valued, or only one target shock may be labeled while the others remain unnamed. The acceptance rate is an algorithmic diagnostic, not a test of the economic restrictions, because every rotation fits the same reduced-form covariance. A Haar-uniform prior over rotations is also not flat over IRFs or elasticities and cannot be washed out by the likelihood along unidentified directions. Finally, penalty functions that choose the rotation with the largest desired responses add identifying content, can induce signs on supposedly unrestricted variables, and often make uncertainty appear too small. Weak signs may simply leave economically contradictory models in the set; the remedy is defensible additional information, not an undeclared optimizer.',
    },
  ],
  literatureQuestions: [
    'Which variables and horizons are restricted, are the inequalities strict or weak, and what theory supports each sign?',
    'Does the design point-identify a shock, set-identify every response, or label only a subset of the structural shocks?',
    'Which rotations and reduced-form draws are sampled, how are exact zero restrictions handled, and what prior over rotations is induced?',
    'Do elasticity bounds, narrative dates, shape restrictions, or external information rule out economically implausible rotations left by the signs alone?',
    'Are reported paths generated by feasible individual models, and do uncertainty statements preserve both reduced-form and identification uncertainty rather than selecting one convenient rotation?',
  ],
  literatureRefs: [
    'Harald Uhlig (2005), "What Are the Effects of Monetary Policy on Output? Results from an Agnostic Identification Procedure" - the canonical monetary-policy sign-restriction application.',
    'Juan F. Rubio-Ramirez, Daniel F. Waggoner, and Tao Zha (2010), "Structural Vector Autoregressions: Theory of Identification and Algorithms for Inference" - rotation geometry, rank conditions, and QR/Haar sampling.',
    'Andrew Mountford and Harald Uhlig (2009), "What Are the Effects of Fiscal Policy Shocks?" - a major multi-shock fiscal application using sequential penalty-function selection.',
    'Lutz Kilian and Daniel P. Murphy (2012), "Why Agnostic Sign Restrictions Are Not Enough" - impact signs, elasticity bounds, and economically implausible oil-market rotations.',
    'Jonas E. Arias, Juan F. Rubio-Ramirez, and Daniel F. Waggoner (2018), "Inference Based on Structural Vector Autoregressions Identified With Sign and Zero Restrictions" - conditional rotation sampling and the critique of penalty selectors.',
    'Juan Antolin-Diaz and Juan F. Rubio-Ramirez (2018), "Narrative Sign Restrictions for SVARs" - dated shock-sign and historical-decomposition restrictions.',
    'Lutz Kilian and Helmut Lutkepohl (2017), Structural Vector Autoregressive Analysis, Chapter 13 - static and dynamic signs, bounds, shapes, priors, accepted-set inference, and reporting cautions.',
  ],
  plotTitle: 'Accepted and rejected impact signs',
  extra: 'Policy impact on the S&amp;P 500 residual',
};
