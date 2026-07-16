import { mathHtml } from '../formulas.js';
import {
  literatureAuditMeta,
  literatureReferences,
  paperSection,
} from '../../research/index.mjs';

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
      body: paperSection('proxy.reader.measurement'),
    },
    {
      title: '2. Keep relevance and exclusion separate',
      body: paperSection('proxy.reader.relevance'),
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
      body: paperSection('proxy.literature.origins'),
    },
    {
      title: 'How the literature estimator differs from this display',
      body: paperSection('proxy.literature.estimator'),
    },
    {
      title: 'The main methodological developments',
      body: paperSection('proxy.literature.developments'),
    },
    {
      title: 'Important applications and variants',
      body: paperSection('proxy.literature.applications'),
    },
    {
      title: 'Critiques and the applied diagnostic sequence',
      body: paperSection('proxy.literature.diagnostics'),
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
  literatureRefs: literatureReferences('proxy'),
  plotTitle: 'Proxy orthogonality objective',
  extra: 'Proxy overlap sample',
};
