export const ATLAS_FEATURES = Object.freeze({
  // Developer-only switch. Set to false to remove the MATLAB code bridge.
  matlabReplication: false,
});

export function isAtlasFeatureEnabled(featureName) {
  return ATLAS_FEATURES[featureName] === true;
}

export function applyAtlasFeatureVisibility(root = document) {
  root.querySelectorAll('[data-atlas-feature]').forEach((element) => {
    element.hidden = !isAtlasFeatureEnabled(element.dataset.atlasFeature);
  });
}
