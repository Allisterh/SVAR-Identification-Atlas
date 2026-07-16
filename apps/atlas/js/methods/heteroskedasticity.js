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
      title: 'Hold the structural directions fixed',
      body:
        `Start from ${mathHtml('&Sigma;<sub>u,r</sub> = B<sub>0</sub>D<sub>r</sub>B<sub>0</sub>&prime;')}. Across regimes, ${mathHtml('B<sub>0</sub>')} is assumed constant and ${mathHtml('D<sub>r</sub>')} is diagonal; only shock variances move. If policy behaviour or contemporaneous transmission changes with the regime, this identifying story no longer follows. Stability of the structural coefficients is likewise the key maintained assumption in Rigobon (2003).`,
    },
    {
      title: 'Read both terms in the loss',
      body:
        'For each angle, the Atlas recovers candidate shocks and computes their covariance in the early half and again in the late half. Squaring prevents positive and negative covariances from cancelling. A low total therefore means one rotation makes both regime covariance matrices close to diagonal. The same common-axis logic underlies the Markov-switching covariance design of Lanne, L&uuml;tkepohl, and Maciejowska (2010).',
    },
    {
      title: 'Look for relative, not common, volatility movement',
      body:
        'Use the coloured scatter to compare the horizontal and vertical spreads. Identification needs different variance ratios across shocks. If blue and orange have the same shape and differ only by a common scale factor, the covariance-ratio eigenvalues coincide and the structural directions remain unidentified. Lewis (2021) develops rank diagnostics for whether time-varying volatility contains enough independent variation to orient the shocks.',
    },
    {
      title: 'Interpret the IRFs as candidates',
      body:
        'The lowest grid score chooses an orientation, but sign, scale, and column order are normalization choices. Economic restrictions, instruments, event information, or priors must still say which column is the policy shock. In an application, also report eigenvalue or rank separation and uncertainty about the volatility states. Virolainen (2025) shows how sign and zero restrictions can complete the interpretation when volatility identifies only part of the system.',
    },
  ],
  literatureTitle: 'From the Atlas covariance split to the literature',
  literatureLead:
    'The literature replaces the Atlas midpoint split with explicit models or measurements of volatility states, but keeps the same central question: can one stable impact matrix diagonalize covariance information from several states because structural variances move non-proportionally?',
  literatureNote:
    'The literature replaces the Atlas midpoint split with explicit models or measurements of volatility states, but keeps the same central question: can one stable impact matrix diagonalize covariance information from several states because structural variances move non-proportionally?',
  literatureSections: [
    {
      title: 'Early ideas and the move into SVARs',
      body:
        'Sentana and Fiorentini (2001) showed in a conditional-factor setting that sufficiently different variance paths can remove rotational indeterminacy. Rigobon (2003) gave the canonical covariance-regime treatment for simultaneous equations: extra covariance matrices identify stable structural slopes when relative variances change, while additional regimes provide overidentifying restrictions. Rigobon and Sack (2003) supplied an early macro-finance application to the simultaneous response of expected monetary policy and stock prices, explicitly allowing a common shock. Normandin and Phaneuf (2004) carried the logic into a monetary SVAR and used heteroskedasticity to turn familiar targeting and orthogonality restrictions into testable hypotheses rather than assumptions required for identification.',
    },
    {
      title: 'The main versions differ in how volatility is represented',
      body:
        'Regime designs estimate covariance matrices for externally dated or latent states. Lanne, L&uuml;tkepohl, and Maciejowska (2010) use Markov-switching covariances; L&uuml;tkepohl and Netsunajev (2017) let covariance move smoothly between limiting states. Milunovich and Yang (2013) jointly identify the impact matrix and structural ARCH/GARCH parameters when almost all shocks carry an ARCH signal. Bertsche and Braun (2022) use autocovariances of squared residuals generated by latent stochastic volatility. Lewis (2021) states the identifying information directly in unconditional autocovariances of squared innovations and supplies reduced-form rank diagnostics. Virolainen (2025) lets regime probabilities depend on the economic state and combines eigenvalue separation with sign and zero restrictions when only some shocks are statistically identified.',
    },
    {
      title: 'Applications use volatility both to identify and to test',
      body:
        'The method has been used for sovereign-bond contagion and monetary-policy/stock-market simultaneity in Rigobon\'s work; for testing recursive monetary-policy restrictions in the Markov-switching and smooth-transition SVARs; for fiscal tax and spending shocks in Lewis (2021); and for oil-market shocks in Bertsche and Braun (2022). A recurring payoff is overidentification: once volatility statistically orients the columns, recursive zeros, external-instrument relevance and exogeneity, or sign labels can be checked against the data instead of silently doing all the identifying work.',
    },
    {
      title: 'What the Atlas omits, and the central critiques',
      body:
        'The Atlas knows the two states, uses a bivariate finite rotation grid, estimates no volatility law, and reports no sampling uncertainty. Empirical studies must estimate or justify regimes, allow for first-step VAR uncertainty, diagnose close eigenvalues or weak rank, and decide whether more than two states are jointly diagonalizable. The strongest maintained restriction is stability of the impact matrix: if transmission changes when volatility changes, extra covariance matrices add new structural coefficients as well as new moments. Proportional variance changes, common volatility, regime misclassification, or state definitions based on realized squared shocks can also erase or contaminate the signal. Finally, statistical columns remain economically anonymous, and variance shifts are not automatically causal location-shift interventions in nonlinear models.',
    },
  ],
  literatureQuestions: [
    'What observable event, latent state, or variance process supplies the volatility movement?',
    'Why should the impact matrix stay fixed while those variances change?',
    'Do relative variances and covariance-ratio eigenvalues separate the shocks strongly enough?',
    'How are regimes estimated, and could classification depend on the shock realizations themselves?',
    'Which information labels the statistical columns, and is inference robust to weak volatility separation?',
  ],
  literatureRefs: [
    'Enrique Sentana and Gabriele Fiorentini (2001), "Identification, Estimation and Testing of Conditionally Heteroskedastic Factor Models."',
    'Roberto Rigobon (2003), "Identification Through Heteroskedasticity," Review of Economics and Statistics 85(4): 777-792.',
    'Roberto Rigobon and Brian Sack (2001), "Measuring the Reaction of Monetary Policy to the Stock Market," NBER Working Paper No. 8350.',
    'Michel Normandin and Louis Phaneuf (2004), "Monetary Policy Shocks: Testing Identification Conditions Under Time-Varying Conditional Volatility."',
    'Markku Lanne, Helmut L&uuml;tkepohl, and Katarzyna Maciejowska (2010), "Structural Vector Autoregressions with Markov Switching," Journal of Economic Dynamics and Control 34(2): 121-131.',
    'Steven Milunovich and Mingyue Yang (2010), "On Identifying Structural VAR Models via ARCH Effects," Journal of Time Series Econometrics.',
    'Helmut L&uuml;tkepohl and Aleksei Netsunajev (2017), "Structural Vector Autoregressions with Smooth Transition in Variances," Journal of Economic Dynamics and Control 84: 43-57.',
    'Daniel J. Lewis (2021), "Identifying Shocks via Time-Varying Volatility," Review of Economic Studies 88(6): 3086-3124.',
    'Dominik Bertsche and Robin Braun (2022), "Identification of Structural Vector Autoregressions by Stochastic Volatility."',
    'Savi Virolainen (2025), "A Statistically Identified Structural Vector Autoregression with Endogenously Switching Volatility Regime."',
    'Jos&eacute; Luis Montiel Olea, Mikkel Plagborg-M&oslash;ller, and Eric Qian (2022), "SVAR Identification from Higher Moments: Has the Simultaneous Causality Problem Been Solved?"',
  ],
  plotTitle: 'Regime covariance objective',
  extra: 'Early and late sample regimes',
};
