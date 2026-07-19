import { mathHtml } from '../formulas.js';

export default {
  objective: `${mathHtml('L(&theta;) = cov<sub>early</sub>(e<sub>1</sub>, e<sub>2</sub>)<sup>2</sup> + cov<sub>late</sub>(e<sub>1</sub>, e<sub>2</sub>)<sup>2</sup>')}`,
  assumptionSummary: 'The impact matrix is stable, shocks are orthogonal within each regime, and their relative variances change.',
  atlasRuleSummary: 'Find one rotation that makes the recovered shocks uncorrelated in each sample half separately.',
  outputSummary: 'The best rotation on this finite grid; its columns are statistically oriented but not economically labelled.',
  cardIntro:
    'Heteroskedasticity-based identification treats changes in the shape of the residual cloud as information about the structural axes. If one shock becomes much more volatile while another changes little, the covariance ellipse changes shape in a way that can reveal the common impact directions. The Atlas turns that idea into a two-regime exercise: split the observations in half, recover shocks under every rotation, and ask which rotation makes them uncorrelated in both halves. High volatility by itself is not enough; the relative shock variances must move differently while the impact matrix remains stable.',
  intuitionAssumption:
    `${mathHtml('&Sigma;<sub>u,r</sub> = B<sub>0</sub>D<sub>r</sub>B<sub>0</sub>&prime;')} says that every regime has the same structural directions ${mathHtml('B<sub>0</sub>')}, while the diagonal matrix ${mathHtml('D<sub>r</sub>')} lets each shock have a different variance.`,
  intuitionTranslation:
    'The Atlas calls the early and late sample halves two regimes. For each rotation it recovers two candidate shocks and checks their covariance inside each half, not just in the pooled sample.',
  intuition:
    `${mathHtml('&Sigma;<sub>u,r</sub> = B<sub>0</sub>D<sub>r</sub>B<sub>0</sub>&prime;')} is the common volatility-identification model. A candidate rotation is useful when it uncovers axes that remain orthogonal while the spread along those axes changes across regimes. If both structural variances merely rise by the same proportion, the ellipse only grows and no rotation is revealed.`,
  chartTakeaway:
    'Read the colours as two covariance states: useful identification comes from a change in the ellipse\'s relative axis lengths, not from one cloud simply being a larger copy of the other.',
  criterionHeadline: 'Find axes that diagonalize both regime covariance matrices.',
  criterionIntro:
    'Every rotation fits the pooled covariance, so the Atlas instead computes the covariance between the two recovered shocks inside the early and late halves separately. A covariance near zero means that a regime cloud has little systematic diagonal tilt. Squaring and adding the two covariances prevents opposite signs from cancelling, so a low loss means the same candidate axes work in both regimes.',
  objectivePlotNote:
    'The left curve compares that two-regime loss across angles. A deep, isolated trough means few rotations make both cross-covariances small, whereas a broad flat region provides little orientation. The vertical marker shows the current angle; equivalent sign or column permutations may create other troughs.',
  extraPlotNote:
    'The companion scatter shows early observations in blue and late observations in orange at the current angle. Near a loss trough, each cloud should align with the horizontal and vertical axes, while the two colours may have different relative widths and heights. If one cloud is only a proportional enlargement of the other, the variance change reveals no preferred orientation.',
  irfIntro:
    'The IRFs attach dynamics to the rotation selected by the two-regime score. Read them only after checking the loss: volatility variation selects anonymous columns of the impact matrix, not a monetary-policy or stock-market label. Applied work must defend the labels and propagate uncertainty from regime and structural estimation.',
  priorityIrfKeys: ['rateOnRate', 'sp500OnRate'],
  readingNote:
    'Work from the covariance states to the selected rotation, and only then to the IRFs. The exercise is about whether one stable set of structural axes can explain two differently shaped residual clouds.',
  readingSteps: [
    {
      title: '1. Hold the structural directions fixed',
      body:
        'Start from one common set of structural directions. Across regimes, those directions stay fixed while the shock variances change. If contemporaneous transmission changes too, the Atlas objective is no longer isolating one common rotation.',
    },
    {
      title: '2. Read both terms in the loss',
      body:
        'For each angle, the Atlas recovers candidate shocks and computes their covariance in the early half and again in the late half. Squaring prevents positive and negative covariances from cancelling. A low total means that one rotation makes both regime covariance matrices close to diagonal.',
    },
    {
      title: '3. Look for relative volatility movement',
      body:
        'Compare the horizontal and vertical spreads of the two coloured clouds. If one cloud is only a larger copy of the other, both shocks changed volatility in the same proportion and the rotation remains hidden. Different changes in relative width and height can reveal common axes.',
    },
    {
      title: '4. Treat the IRFs as unlabelled candidates',
      body:
        'The lowest grid score selects an orientation, but sign and column order remain normalization choices. The volatility pattern does not say which column is a policy shock. Economic information must supply that label.',
    },
  ],
  literatureTitle: 'From the Atlas covariance split to the literature',
  literatureLead:
    'The research literature replaces the Atlas midpoint split with explicit volatility models or dated states. Its shared question is whether several covariance patterns reveal one stable impact matrix because structural variances move differently.',
  literatureNote:
    'The research literature replaces the Atlas midpoint split with explicit volatility models or dated states. Its shared question is whether several covariance patterns reveal one stable impact matrix because structural variances move differently.',
  literatureSections: [
    {
      title: 'Foundations: variance paths and covariance regimes',
      body:
        'Sentana and Fiorentini (2001, Section 3.1, Proposition 3) show that when the loading covariance and idiosyncratic covariance are identified from unconditional moments and the factor-variance processes are linearly independent, the loading matrix is unique up to column signs and permutations. Rigobon (2003, Proposition 1) identifies a bivariate simultaneous-equation system from two variance regimes under stable structural slopes, uncorrelated shocks, and nonproportional covariance matrices. His Section II.A also shows that proportional regime covariance matrices do not identify the system.',
    },
    {
      title: 'How the main volatility models differ',
      body:
        'Lanne, L&uuml;tkepohl, and Maciejowska (2010, Abstract and Section 1) confine Markov switching to innovation covariances and assume that impulse responses are invariant across states. They show that conventional just-identifying restrictions become testable. With more than two covariance states, they also test state-invariant impact responses. Milunovich and Yang (2013, Proposition 2) give sufficient conditions for joint local identification of the impact matrix and structural ARCH parameters when shocks are nondegenerate and at most one is homoskedastic. L&uuml;tkepohl and Netsunajev (2017, Abstract and Section 1) model a gradual covariance transition whose timing is estimated rather than fixed by the researcher. Lewis (2021, Abstract and Theorems 1&ndash;3) identifies the impact matrix from autocovariances of squared reduced-form innovations without imposing a parametric law on the variance process. He also provides reduced-form rank tests of the identifying conditions. Bertsche and Braun (2022, Abstract and Section 2) use independent latent AR(1) log-variance processes for structural shocks. They develop full and partial identification with maximum-likelihood EM algorithms. Virolainen (2025, Abstract and Sections 1 and 3) lets volatility-regime probabilities depend on lagged observations. She derives sign-and-zero conditions for identifying selected shocks when full statistical identification fails.',
    },
    {
      title: 'Representative applications and restriction tests',
      body:
        'Rigobon and Sack (2003; working-paper Abstract) use stock-return heteroskedasticity to identify the Federal Reserve\'s reaction to stock-market movements despite the simultaneous response of stock prices to interest rates. Normandin and Phaneuf (2004, Abstract and Section 5) use conditional heteroskedasticity to test monetary-policy targeting and contemporaneous orthogonality restrictions. They reject both interest-rate and non-borrowed-reserve targeting in their post-1982 U.S. sample. They also reject the restrictions that make policy shocks contemporaneously orthogonal to macroeconomic variables. Lewis (2021, Abstract and Section 4) applies his method to U.S. fiscal shocks and reports peak multipliers of 0.86 for tax cuts and 0.75 for government spending. Bertsche and Braun (2022, Abstract and Section 5) use instrumental-variable restrictions as overidentifying tests after stochastic-volatility identification in an oil-market application.',
    },
    {
      title: 'Maintained assumptions and causal limits',
      body:
        'Montiel Olea, Plagborg-M&oslash;ller, and Qian (2022, Section IV) show that conditional shock orthogonality identifies the impact directions only when relative shock variances change by distinct amounts. Their Section V warns that higher-moment identification can be weak when the additional moments are estimated imprecisely in moderate samples. Koles&aacute;r and Plagborg-M&oslash;ller (2025, Abstract and Sections 1 and 4) show that heteroskedasticity-based estimands can be nonzero with no causal effect or have the wrong sign under nonlinear data generation. Their natural nonparametric extension of heteroskedastic identification yields wide identified sets. The Atlas knows its two states, fixes one linear bivariate system, searches a finite angle grid, and reports no sampling uncertainty; empirical work must justify the states, test volatility separation, defend stability of the impact matrix, and label the statistically oriented columns.',
    },
  ],
  literatureQuestions: [
    'What observable event, latent state, or variance process supplies the volatility movement?',
    'Why should the impact matrix stay fixed while those variances change?',
    'Do relative variances and covariance-ratio eigenvalues separate the shocks strongly enough?',
    'How are regimes estimated, and could classification depend on the shock realizations themselves?',
    'Which information labels the statistical columns, and is inference robust to weak volatility separation?',
  ],
  plotTitle: 'Regime covariance objective',
  extra: 'Early and late sample regimes',
};
