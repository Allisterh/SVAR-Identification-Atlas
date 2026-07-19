import { literatureAuditMeta, literatureReferences, reviewedText } from '../../research/index.mjs';

function renderReadingSteps(method, content) {
  const outputKind = method.selectionMode === 'set' ? 'an admissible set' : 'one selected candidate';
  const steps = Array.isArray(content.readingSteps) && content.readingSteps.length
    ? content.readingSteps
    : [
        {
          title: 'Start with the identifying claim',
          body:
            content.readingNote ??
            `Ask what extra information ${method.label.toLowerCase()} identification adds beyond the reduced-form covariance. The assumption box states that claim in economic or statistical language.`,
        },
        {
          title: 'Follow the claim into the criterion',
          body:
            content.objectivePlotNote ??
            'Move the rotation dial and watch the objective status. The criterion plot records the same score for every sampled rotation; the companion plot shows the underlying object that makes the score move.',
        },
        {
          title: 'Interpret the output at the right level',
          body:
            content.irfReadingNote ??
            `Use the IRFs to compare the dynamic implications, but remember that the Atlas rule returns ${outputKind}. The current orange rotation is a candidate you are inspecting; it is not automatically the identified result.`,
        },
      ];

  return `<ol class="method-reading-steps method-reading-steps--${Math.min(4, steps.length)}">
    ${steps
      .map(
        (step, index) => `<li>
          <span class="method-reading-steps__number">${index + 1}</span>
          <div>
            <h3>${String(step.title).replace(/^\d+\.\s*/, '')}</h3>
            <p>${reviewedText(`${method.id}.reader.${index}`, step.body)}</p>
          </div>
        </li>`
      )
      .join('')}
  </ol>`;
}

function renderLiteratureSections(method, content, literatureNote) {
  const sections = Array.isArray(content.literatureSections) && content.literatureSections.length
    ? content.literatureSections
    : [{ title: 'From the Atlas to applied work', body: literatureNote }];

  return `<div class="method-literature-overview">
    ${sections
      .map(
        (section, index) => `<article class="method-literature-section">
          <h3>${section.title}</h3>
          <p>${reviewedText(`${method.id}.literature.${index}`, section.body)}</p>
        </article>`
      )
      .join('')}
  </div>`;
}

function renderLiteratureQuestion(item) {
  const question = typeof item === 'string' ? { text: item, citations: '' } : item;
  return `<li>${question.text}${question.citations ?? ''}</li>`;
}

function renderReadingQuestions(content) {
  if (!Array.isArray(content.literatureQuestions) || !content.literatureQuestions.length) {
    return '';
  }
  return `<div class="method-literature-questions">
    <h3>Questions to ask when reading an application</h3>
    <ul>${content.literatureQuestions.map(renderLiteratureQuestion).join('')}</ul>
  </div>`;
}

export function methodReadingGuideHtml(method, content) {
  const readingTitle = content.readingTitle ?? 'How to read this method';
  return `
    <div class="editorial-section__header method-reading-guide__header">
      <span class="section-eyebrow">${readingTitle}</span>
      <h2 id="method-reading-heading">Read from the identifying claim to the kind of answer it supports.</h2>
      <p>The plots use the same reduced-form VAR and rotation grid. What changes is the identifying information and how it narrows the cloud to a selected candidate, an identified direction, or an admissible set. Economic labeling remains a separate step.</p>
      <nav class="method-section-spine" aria-label="Method section path">
        <a href="#method-rule">Claim</a><span aria-hidden="true">&rarr;</span>
        <a href="#method-objective">Criterion</a><span aria-hidden="true">&rarr;</span>
        <a href="#method-irfs">Responses</a><span aria-hidden="true">&rarr;</span>
        <a href="#method-literature">Literature</a>
      </nav>
    </div>
    ${renderReadingSteps(method, content)}`;
}

export function methodLiteratureHtml(method, content) {
  const literatureTitle = content.literatureTitle ?? 'From this Atlas page to the literature';
  const literatureNote =
    content.literatureNote ??
    content.scopeNote ??
    'Applied work usually uses analytical restrictions, simulation, likelihood, GMM, or Bayesian algorithms rather than the Atlas rotation grid. The grid is retained here because it makes the identifying information comparable across methods.';
  const references = literatureReferences(method.id);
  const referenceLabel = content.literatureReferenceLabel ?? 'Audited reading';
  const referenceMeta = content.literatureReferenceMeta ?? literatureAuditMeta(method.id);
  const literatureRefs = references.length
    ? `<details class="method-reference-disclosure">
        <summary>${referenceLabel} <span>${referenceMeta}</span></summary>
        <ul class="method-literature-list">${references.map((item) => `<li>${item}</li>`).join('')}</ul>
      </details>`
    : '';

  return `
    <div class="editorial-section__header method-literature-chapter__header">
      <span class="section-eyebrow">Literature bridge</span>
      <h2 id="method-literature-heading">${literatureTitle}</h2>
      <p>${content.literatureLead ?? `The Atlas isolates one identifying mechanism for ${method.label.toLowerCase()}. The literature below shows where that mechanism came from, how researchers implement and extend it, and which qualifications matter in empirical work.`}${content.literatureLeadCitations ?? ''}</p>
    </div>
      ${renderLiteratureSections(method, content, literatureNote)}
      ${renderReadingQuestions(content)}
      ${literatureRefs}
    `;
}
