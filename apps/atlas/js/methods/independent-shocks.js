import { mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('L(&theta;) = E[e<sub>1</sub><sup>2</sup>e<sub>2</sub>]<sup>2</sup> + E[e<sub>1</sub>e<sub>2</sub><sup>2</sup>]<sup>2</sup>')}`,
  assumptionSummary: 'After whitening, shocks are independent and carry enough non-Gaussian shape; this demo uses skewness.',
  atlasRuleSummary: 'Minimize two ordered mixed third moments of the recovered shocks.',
  outputSummary: 'The lowest-scoring grid rotation; a dependence diagnostic, not proof of independence.',
  cardIntro:
    'Covariance tells us how to whiten the VAR residuals, but it does not choose an orientation: every orthogonal rotation remains uncorrelated. Independent-shocks identification adds distributional information. If the structural shocks are mutually independent and at most one is Gaussian, a wrong rotation usually mixes their shapes and creates dependence. The Atlas illustrates only the skewness channel by scoring two mixed third moments. Full applications use richer ICA, likelihood, cumulant, GMM, or set-refinement procedures and still need economic labels for the recovered components.',
  intuitionAssumption:
    'Every candidate on the rotation grid is already uncorrelated. The additional assumption is that the true structural components are independent, so their joint distribution factorizes rather than sharing nonlinear or tail dependence.',
  intuitionTranslation:
    'The Atlas asks whether the size of one recovered shock helps predict the sign of the other. It uses two mixed third moments, so it is most informative when the underlying shocks are asymmetric or skewed.',
  intuition:
    'Uncorrelatedness removes only linear co-movement. Independence also rules out nonlinear links between signs, magnitudes, and tails. Under independent non-Gaussian shocks, most rotations combine those distributional fingerprints and create higher-order cross-moments. The Atlas selects the rotation with the smallest displayed coskewness loss, while leaving fuller notions of dependence to the literature.',
  chartTakeaway:
    'All displayed clouds have zero correlation by construction. Look for nonlinear shape or tail co-movement, but remember that a scatterplot - and two zero third moments - cannot establish independence.',
  criterionHeadline: 'Ask whether one shock\'s magnitude predicts the other shock\'s sign.',
  criterionIntro:
    `In ${mathHtml('E[e<sub>1</sub><sup>2</sup>e<sub>2</sub>]')}, squaring ${mathHtml('e<sub>1</sub>')} measures its magnitude, then multiplying by ${mathHtml('e<sub>2</sub>')} asks whether large values of shock 1 tend to coincide with a particular sign of shock 2. The second moment reverses those roles. Centered independent shocks make both moments zero; the loss squares and adds them, so lower means less of this displayed higher-order dependence, not proof of full independence.`,
  objectivePlotNote:
    'The left curve compares the summed squared moments across angles. Squaring prevents a positive moment from cancelling a negative one; a sharp trough gives a clearer orientation, while a flat curve says this skewness criterion changes little with rotation. Other troughs can reflect sign or column permutations.',
  extraPlotNote:
    'The companion scatter places the two recovered shocks on its axes at the current angle. Every angle is already linearly uncorrelated, so a cloud with no diagonal tilt is not enough; curved, fan-shaped, asymmetric, or joint-tail patterns can still signal dependence that the two displayed moments may only partly capture.',
  irfIntro:
    'The IRFs show the dynamics attached to the lowest coskewness score. Statistical independence can orient columns, but it does not name them: the policy-shock label still requires signs, timing, proxies, priors, or application-specific theory. Sampling and weak-identification uncertainty are absent from this toy choice.',
  priorityIrfKeys: ['rateOnRate', 'sp500OnRate'],
  readingNote:
    'First separate covariance from independence, then decode the two moments, and only afterward read the selected IRFs. The page demonstrates one source of non-Gaussian orientation rather than a complete ICA estimator.',
  readingSteps: [
    {
      title: 'Remember what whitening has already achieved',
      body:
        'Every angle preserves the reduced-form covariance and therefore produces uncorrelated, unit-variance candidate shocks. A low correlation in the scatter is not evidence in favour of one angle; it is built into the construction for all angles. Lanne, Meitz, and Saikkonen (2017) use this whitening step before non-Gaussian likelihood information chooses an orientation.',
    },
    {
      title: 'Decode the two mixed moments',
      body:
        `The term ${mathHtml('E[e<sub>1</sub><sup>2</sup>e<sub>2</sub>]')} asks whether the magnitude of shock 1 is related to the sign of shock 2; ${mathHtml('E[e<sub>1</sub>e<sub>2</sub><sup>2</sup>]')} reverses the roles. Independence and zero means make both vanish. Squaring them creates a non-negative loss. Guay (2020) builds a fuller SVAR procedure from broader collections of third- and fourth-moment restrictions and their ranks.`,
    },
    {
      title: 'Treat a low score as a narrow diagnostic',
      body:
        'Move the dial and compare the objective curve with the scatter. A low value says only that these two coskewness restrictions fit. Symmetric but dependent shocks can also score near zero, so a real analysis would add fourth moments, likelihood or density contrasts, and formal independence and Gaussianity checks. Drautzburg and Wright (2023) take a conservative version of this logic by inverting independence tests to refine, rather than automatically replace, a sign-restricted set.',
    },
    {
      title: 'Label and interpret the chosen column separately',
      body:
        'The minimizer is an anonymous independent-component orientation, up to sign and permutation. Before calling a column monetary policy, use economic information to fix its sign and label, then examine how sensitive the IRFs are to alternative moments, densities, samples, and weak-identification procedures. Keweloh and Wang (2025) illustrate this separation by combining higher-moment orientation with uncertain economically motivated short-run restrictions.',
    },
  ],
  literatureTitle: 'From the Atlas coskewness score to the literature',
  literatureLead:
    'The independent-shocks literature uses non-Gaussian distributional shape to break the rotation left by covariance information. The Atlas isolates one intuitive implication of independence; applied work uses richer distributional criteria and a separate economic labeling step.',
  literatureNote:
    'The independent-shocks literature uses non-Gaussian distributional shape to break the rotation left by covariance information. The Atlas isolates one intuitive implication of independence; applied work uses much richer distributional criteria and a separate economic labeling step.',
  literatureSections: [
    {
      title: 'Origins: ICA theory becomes an SVAR identification argument',
      body:
        'The theorem behind the method comes from the Darmois-Skitovich and Comon ICA tradition: linear mixtures of mutually independent components are unique up to scale and permutation when at most one component is Gaussian. Chen and Bickel (2006) developed efficient semiparametric ICA with estimated density scores, while Bonhomme and Robin (2009) showed how second-to-fourth cumulants can recover independent factors in noisy measurement systems. Lanne, Meitz, and Saikkonen (2017) translated the result into a dynamic SVAR, established standard maximum-likelihood inference, and made conventional short-run restrictions testable. Gourieroux, Monfort, and Renne (2017) developed pseudo-likelihood inference that can remain consistent with deliberately misspecified shock densities when the chosen scores still identify the rotation.',
    },
    {
      title: 'The main estimator families use different amounts of shape information',
      body:
        'Parametric likelihood uses a full shock-density family, often Student-t; pseudo-likelihood uses convenient non-Gaussian scores; semiparametric and kernel methods estimate scores more flexibly; and finite or Bayesian mixtures learn asymmetric and heavy-tailed marginals at higher computational cost. Moment methods expose the identifying equations directly. Guay (2020) uses ranks of reduced-form coskewness and excess-cokurtosis matrices to determine whether the whole system or only a subsystem is identified. Keweloh (2021) turns selected second-, third-, and fourth-moment restrictions into SVAR-GMM. FastICA, JADE, and related algorithms are computational choices, not the identification theorem itself; their contrast, normalization, and inferential theory still matter.',
    },
    {
      title: 'Later work combines statistical and economic information',
      body:
        'Drautzburg and Wright (2023) invert independence tests to refine a sign-restricted identified set, so weak or Gaussian higher-moment information falls back toward the original set rather than forcing a fragile point estimate. Keweloh and Wang (2025) shrink toward uncertain short-run zeros while allowing higher moments to reject them, and show that some skewness identification survives under mean independence rather than full independence. Applications include monetary-policy and stock-price interactions in Lanne, Meitz, and Saikkonen; Guay\'s partially identified U.S. fiscal system; Jarocinski\'s (2024) four high-frequency FOMC shocks; and Braun\'s (2023) Bayesian nonparametric decomposition of oil supply and demand shocks.',
    },
    {
      title: 'What the Atlas omits, and the central critiques',
      body:
        'The Atlas uses only two bivariate third moments on a finite grid. It is not a full independence test, likelihood, density estimator, Gaussianity test, rank diagnostic, or weak-identification-robust confidence procedure. Near-Gaussian shocks make every version weak, and sample third and fourth moments can be very noisy. Mutual independence is also much stronger than the usual SVAR assumption of uncorrelated shocks: shared stochastic volatility can produce non-Gaussian marginals while violating independence and flattening or misdirecting ICA criteria. Sign and permutation ambiguity remains even with sharp statistical identification. Finally, all these linear ICA claims maintain a linear mixing model; unrestricted nonlinear transformations can destroy the causal interpretation, so non-Gaussianity is not a stand-alone nonparametric solution to simultaneous causality.',
    },
  ],
  literatureQuestions: [
    'Which independence implications actually identify the estimator: a full density, pseudo-scores, coskewness, cokurtosis, or a test inversion?',
    'Do Gaussianity, rank, and dependence diagnostics support full-system identification or only an identified subsystem?',
    'Could common stochastic volatility or other cross-shock dependence violate the maintained assumptions?',
    'How are sign and permutation ambiguities converted into economic shock labels?',
    'How does inference handle weak non-Gaussianity, noisy higher moments, and possible nonlinear misspecification?',
  ],
  literatureRefs: [
    'Daniel J. Lewis (2025), "Identification Based on Higher Moments in Macroeconometrics," Annual Review of Economics 17: 665-693.',
    'Aiyou Chen and Peter J. Bickel (2006), "Efficient Independent Component Analysis," Annals of Statistics 34(6): 2825-2855.',
    'St&eacute;phane Bonhomme and Jean-Marc Robin (2009), "Consistent Noisy Independent Component Analysis," Journal of Econometrics 149(1): 12-25.',
    'Markku Lanne, Mika Meitz, and Pentti Saikkonen (2017), "Identification and Estimation of Non-Gaussian Structural Vector Autoregressions," Journal of Econometrics 196(2): 288-304.',
    'Christian Gouri&eacute;roux, Alain Monfort, and Jean-Paul Renne (2017), "Statistical Inference for Independent Component Analysis: Application to Structural VAR Models," Journal of Econometrics 196(1): 111-126.',
    'Alain Guay (2020), "Identification of Structural Vector Autoregressions Through Higher Unconditional Moments"; Sascha A. Keweloh (2021), "A Generalized Method of Moments Estimator for Structural Vector Autoregressions Based on Higher Moments."',
    'Jos&eacute; Luis Montiel Olea, Mikkel Plagborg-M&oslash;ller, and Eric Qian (2022), "SVAR Identification from Higher Moments: Has the Simultaneous Causality Problem Been Solved?"',
    'Thorsten Drautzburg and Jonathan H. Wright (2023), "Refining Set-Identification in VARs Through Independence."',
    'Robin Braun (2023), "The Importance of Supply and Demand for Oil Prices: Evidence from Non-Gaussianity."',
    'Marek Jaroci&#324;ski (2024), "Estimating the Fed\'s Unconventional Policy Shocks."',
    'Sascha A. Keweloh and Shu Wang (2025), "Uncertain Short-Run Restrictions and Statistically Identified Structural Vector Autoregressions."',
    'Michal Kolesar and Mikkel Plagborg-M&oslash;ller (2025), "Dynamic Causal Effects in a Nonlinear World: The Good, the Bad, and the Ugly."',
  ],
  plotTitle: 'Higher-order dependence objective',
  extra: 'Recovered-shock scatter',
};
