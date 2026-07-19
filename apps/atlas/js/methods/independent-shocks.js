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
        'Every angle preserves the reduced-form covariance and therefore produces uncorrelated, unit-variance candidate shocks. A low correlation in the scatter is not evidence in favour of one angle; it is built into the construction for all angles.',
    },
    {
      title: 'Decode the two mixed moments',
      body:
        `The term ${mathHtml('E[e<sub>1</sub><sup>2</sup>e<sub>2</sub>]')} asks whether the magnitude of shock 1 is related to the sign of shock 2; ${mathHtml('E[e<sub>1</sub>e<sub>2</sub><sup>2</sup>]')} reverses the roles. Independence and zero means make both vanish. Squaring them creates a non-negative loss.`,
    },
    {
      title: 'Treat a low score as a narrow diagnostic',
      body:
        'Move the dial and compare the objective curve with the scatter. A low value says only that these two coskewness restrictions fit. Symmetric but dependent shocks can also score near zero, so a real analysis would add fourth moments, likelihood or density contrasts, and formal independence and Gaussianity checks.',
    },
    {
      title: 'Label and interpret the chosen column separately',
      body:
        'The minimizer is an anonymous independent-component orientation, up to sign and permutation. Before calling a column monetary policy, use economic information to fix its sign and label, then examine how sensitive the IRFs are to alternative moments, densities, samples, and weak-identification procedures.',
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
        'Comon (1994, Theorem 11 and Corollary 13) shows that, in the linear ICA model, mutually independent non-deterministic components with at most one Gaussian component are recovered only up to scale and permutation. Chen and Bickel (2006) construct a semiparametrically efficient ICA estimator using estimated density scores. Bonhomme and Robin (2009) show that second-to-fourth moments can identify factor loadings in a noisy linear factor model. Lanne, Meitz, and Saikkonen (2017) carry independent non-Gaussian identification into a dynamic SVAR and derive maximum-likelihood estimation, conventional inference, and tests of economic restrictions. Gouriéroux, Monfort, and Renne (2017) establish consistency and asymptotic inference for orthogonally constrained multi-unit pseudo-maximum likelihood under conditions on the chosen pseudo-densities.',
    },
    {
      title: 'The main estimator families use different amounts of shape information',
      body:
        'Lewis (2025) surveys likelihood, pseudo-likelihood, semiparametric, algorithmic, and moment-based routes that use different amounts of distributional information. Guay (2020) uses ranks of reduced-form coskewness and excess-cokurtosis matrices to diagnose whether the whole system or only a subsystem is identified. Keweloh (2021) constructs SVAR-GMM from covariance, coskewness, and cokurtosis restrictions under independent non-Gaussian shocks. Hafner, Herwartz, and Wang (2025) estimate shock densities with kernels and extend their likelihood framework to partial independence when only some shocks are credible independent components.',
    },
    {
      title: 'Later work combines statistical and economic information',
      body:
        'Drautzburg and Wright (2023) invert higher-moment and nonparametric independence tests to refine a sign-restricted set; in Gaussian or weak-signal cases the refinement has little bite instead of forcing a point estimate. Keweloh and Wang (2025) use adaptive ridge shrinkage toward possibly invalid short-run restrictions, so valid restrictions can improve efficiency while invalid restrictions lose asymptotic influence; their skewness result needs mean independence rather than full independence. Lanne, Meitz, and Saikkonen (2017) apply their model to U.S. monetary-policy and stock-market interactions and reject a recursive impact structure. Guay (2020) finds the U.S. tax-shock subsystem identified while the spending-shock subsystem remains underidentified. Braun (2023) estimates a Bayesian semiparametric oil-market SVAR with Dirichlet-process mixtures for the marginal shock distributions. Jarociński (2024) separates four shocks from financial-market reactions to FOMC announcements using an independent fat-tailed Student-t specification.',
    },
    {
      title: 'What the Atlas omits, and the central critiques',
      body:
        'The Atlas uses only two bivariate third moments on a finite grid; it is not a full independence test, likelihood, rank diagnostic, or confidence procedure. Montiel Olea, Plagborg-Møller, and Qian (2022) show that common stochastic volatility can leave shocks uncorrelated but dependent, so a linear ICA procedure may fail to recover a structurally interpretable object. Mesters and Zwiernik (2024) show that selected higher-order tensor restrictions can identify linear mixtures up to signed permutation in common-variance and other non-independent component models, but this requires a dependence pattern matched to those restrictions. Lewis (2025) emphasizes that small departures from Gaussianity can yield weak identification in realistic samples and that statistical information alone leaves shock labels unresolved. Kolesár and Plagborg-Møller (2025) show that latent-shock identification through non-Gaussianity is highly sensitive to departures from linearity and generally lacks a meaningful causal summary in an unrestricted nonlinear model.',
    },
  ],
  literatureQuestions: [
    'Which independence implications actually identify the estimator: a full density, pseudo-scores, coskewness, cokurtosis, or a test inversion?',
    'Do Gaussianity, rank, and dependence diagnostics support full-system identification or only an identified subsystem?',
    'Could common stochastic volatility or other cross-shock dependence violate the maintained assumptions?',
    'How are sign and permutation ambiguities converted into economic shock labels?',
    'How does inference handle weak non-Gaussianity, noisy higher moments, and possible nonlinear misspecification?',
  ],
  plotTitle: 'Higher-order dependence objective',
  extra: 'Recovered-shock scatter',
};
