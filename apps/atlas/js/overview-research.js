import {
  literatureAuditMeta,
  literatureReferences,
  sectionCitations,
} from '../research/index.mjs';

const citedSections = {
  'atlas-literature-origins': 'overview.literature.origins',
  'atlas-literature-rotations': 'overview.literature.rotations',
};

for (const [elementId, sectionId] of Object.entries(citedSections)) {
  const element = document.getElementById(elementId);
  if (element) element.insertAdjacentHTML('beforeend', sectionCitations(sectionId));
}

const disclosure = document.getElementById('atlas-literature-references');
const list = document.getElementById('atlas-literature-reference-list');
if (disclosure && list) {
  const references = literatureReferences('overview');
  const meta = disclosure.querySelector('summary span');
  if (meta) meta.textContent = literatureAuditMeta('overview');
  list.innerHTML = references.map((reference) => `<li>${reference}</li>`).join('');
}
