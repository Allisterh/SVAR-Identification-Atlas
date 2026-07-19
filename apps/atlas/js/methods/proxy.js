import { mathHtml } from '../formulas.js';
import { literatureAuditMeta } from '../../research/index.mjs';

export default {
  objective: `${mathHtml('L(&theta;) = |corr(e<sub>non-target</sub>(&theta;), z<sub>proxy</sub>)|')}`,
  assumptionSummary: 'The proxy covaries with the policy shock but not with the non-target structural shock.',
  atlasRuleSummary: 'Visualize exclusion by minimizing proxy correlation with the non-target recovered shock.',
  outputSummary: 'One illustrative proxy-oriented rotation and the responses it implies.',
  cardIntro:
    'A Proxy-SVAR uses an external series as a noisy measurement of a latent structural shock. A high-frequency policy surprise or narrative tax series is therefore an instrument, not the shock itself. It must contain information about the target policy shock (relevance) and no information about the other structural shocks (exclusion or exogeneity). The Atlas visualizes the second moment by rotating the residual cloud until the proxy is orthogonal to the non-target recovered shock. A nearly zero loss or an attractive IRF cannot by itself establish that the proxy is strong, valid, correctly timed, or cleanly interpretable.',
  intuitionAssumption:
    'An external proxy is correlated with the target policy shock and orthogonal to every non-target shock.',
  intuitionTranslation:
    'In this two-shock system, the Atlas displays the exclusion half of proxy validity by making the proxy as orthogonal as possible to the recovered non-target shock.',
  intuition:
    'Proxy identification uses an external variable that is informative about one target shock and uninformative about all others. In the two-shock Atlas, that exclusion condition orients the rotation by making the proxy orthogonal to the recovered non-target shock.',
  detail:
    `${mathHtml('Relevance: E[z<sub>proxy</sub>e<sub>policy</sub>] &ne; 0; exclusion: E[z<sub>proxy</sub>e<sub>non-target</sub>] = 0')}`,
  chartTakeaway:
    'A near-zero exclusion loss means the proxy stays away from the displayed non-target shock at that angle. Use it as a visual cue, not as a full validity test.',
  criterionHeadline: 'Choose the angle that keeps the proxy away from the non-target shock.',
  criterionIntro:
    'The proxy is fixed, but turning the dial changes the recovered non-target shock. Their correlation is positive when they tend to move together, negative when they tend to move in opposite directions, and near zero when they have little linear co-movement. Taking the absolute value treats either signed relationship as a violation, so the Atlas selects the angle closest to zero correlation.',
  objectivePlotNote:
    'The left plot shows the absolute proxy correlation at every angle. Lower is better for this exclusion rule, the trough is the selected rotation, and the vertical marker reports the score at the current dial setting. This plot does not measure whether the proxy is sufficiently related to the target shock.',
  extraPlotNote:
    'The companion plot overlays the standardized proxy and current non-target shock over their shared dates. Tracking each other or moving as mirror images produces a large absolute correlation; little common linear movement is consistent with the trough in the left plot.',
  irfIntro:
    'Once an angle is selected, the same rotation determines the shock responses shown below. Compare the highlighted responses first, then open the companion pair if you want the full four-variable view.',
  priorityIrfKeys: ['rateOnRate', 'sp500OnRate'],
  readingSteps: [
    {
      title: '1. Do not treat the proxy as the structural shock',
      body:
        'The external series is a clue about the target shock, not the shock itself. It may be noisy, sparse, or observed at a different frequency from the VAR.',
    },
    {
      title: '2. Keep relevance and exclusion separate',
      body:
        'Relevance asks whether the proxy contains information about the target shock. Exclusion asks whether it stays unrelated to the other shocks. The Atlas picture focuses only on exclusion.',
    },
    {
      title: '3. Read the two criterion plots together',
      body:
        'Find the trough of the absolute-correlation curve, then inspect the overlap plot at that angle. The first plot scores each angle; the second helps you see what the current score is measuring. Because the overlay is standardized, use it to compare co-movement, not magnitudes.',
    },
    {
      title: '4. Treat the IRFs as conditional output',
      body:
        'The selected angle fixes the shock labels used for the IRFs. Read the highlighted responses as the dynamic implications of that choice; they do not by themselves establish that the proxy is economically valid.',
    },
  ],
  literatureTitle: 'From the Atlas orthogonality picture to the Proxy-SVAR literature',
  literatureLead:
    'The Atlas turns one exclusion moment into a rotation picture. The literature treats proxy construction, identification, and inference as separate problems and has developed several branches for weak, contaminated, high-frequency, multiple, and Bayesian instruments.',
  literatureSections: [
    {
      title: 'Origins and the baseline external-instrument idea',
      body:
        'Stock and Watson (2012, Section III) use 17 external instruments to estimate six structural shocks in a dynamic factor model. Mertens and Ravn (2013, Abstract and Section I.A) treat narratively identified personal- and corporate-tax changes as proxies for latent tax shocks that may be measured with error. Kilian and L&uuml;tkepohl (2017, Chapter 15, Section 15.2.1) show that relevance and exclusion make the proxy&ndash;residual covariance vector proportional to the target shock\'s impact vector, which identifies its direction after normalization.',
    },
    {
      title: 'Identification and weak relevance',
      body:
        'Montiel Olea, Stock, and Watson (2021, Sections 3&ndash;4) construct Anderson&ndash;Rubin/Fieller confidence sets for impulse responses that remain valid when the external instrument is weak and coincide with standard intervals when it is strong. Miranda-Agrippino and Ricco (2023, Sections 2&ndash;6) show that full-system invertibility is unnecessary, but the target shock must be partially invertible and the instrument must satisfy limited lead&ndash;lag exogeneity. Angelini, Cavaliere, and Fanelli (2024, Abstract and Sections 2&ndash;6) show that target responses can instead be estimated by minimum distance from strong proxies for non-target shocks when their identification conditions hold.',
    },
    {
      title: 'Bootstrap and Bayesian inference',
      body:
        'Jentsch and Lunsford (2019, Abstract and Sections I&ndash;II) show that the wild bootstrap used by Mertens and Ravn is invalid for Proxy-SVAR impulse responses and produces confidence intervals that are too small. Jentsch and Lunsford (2022, Abstract and Sections 1&ndash;4) prove validity of a modified residual-based moving-block bootstrap for smooth Proxy-SVAR statistics under strong proxies. Bruns and L&uuml;tkepohl (2023, Abstract and Section 1) propose a proxy-residual-based bootstrap whose simulated confidence intervals often have more accurate coverage than moving-block intervals of similar length. Arias, Rubio-Ram&iacute;rez, and Waggoner (2021, Abstract and Section 1) develop an exact finite-sample Bayesian algorithm that makes independent posterior draws and can combine proxies with zero and sign restrictions. Giacomini, Kitagawa, and Read (2022, Abstract and Section 1) extend multiple-prior robust Bayesian inference to set-identified Proxy-SVARs so results need not depend on one unrevisable prior over admissible rotations.',
    },
    {
      title: 'Important applications and variants',
      body:
        'Gertler and Karadi (2015, Abstract and Introduction) use high-frequency interest-rate surprises around policy announcements as external instruments in monetary VARs. Jaroci&nacute;ski and Karadi (2020, Abstract and Introduction) separate policy and central-bank-information shocks by the sign of the announcement-window co-movement between interest rates and stock prices. K&auml;nzig (2021, Abstract and Introduction) uses oil-futures movements around OPEC announcements as an external instrument for an oil-supply-news shock. K&auml;nzig (2023, revised 2025, Abstract and Section 1) instruments a carbon-policy shock with EU ETS regulatory-event surprises measured in carbon futures prices. Braun and Br&uuml;ggemann (2023, Abstract and Section 1) combine valid or plausibly exogenous external instruments with sign restrictions in a Bayesian SVAR. Bruns, L&uuml;tkepohl, and McNeil (2025, Abstract and Section 1) show that identifying several shocks one by one can leave them correlated and propose a joint GMM estimator that enforces shock orthogonality.',
    },
    {
      title: 'Critiques and the applied diagnostic sequence',
      body:
        'For an applied study, inspect the event and overlap sample first, then proxy strength, exclusion and timing, the VAR information set, any multi-proxy assignment and rank restrictions, and finally the uncertainty procedure. A near-zero Atlas loss addresses only one displayed sample moment and cannot validate the full design.',
    },
  ],
  literatureQuestions: [
    'How was the proxy constructed, timed, censored, and aggregated to the VAR frequency?',
    'How strong is the target first stage, and are the reported confidence sets valid under weak relevance?',
    'Why should the proxy be orthogonal to every non-target shock, including information shocks and lead-lag contamination?',
    'For several proxies or shocks, do rank, assignment, and mutual structural-shock orthogonality conditions hold?',
    'Which invertibility assumptions and bootstrap, frequentist, or Bayesian procedures carry proxy-moment uncertainty into the IRFs?',
  ],
  literatureReferenceLabel: 'Audited reading',
  literatureReferenceMeta: literatureAuditMeta('proxy'),
  plotTitle: 'Proxy orthogonality objective',
  extra: 'Proxy overlap sample',
};
