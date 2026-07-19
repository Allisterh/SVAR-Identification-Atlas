# SVAR Identification Framework Atlas

This is the active standalone app for the common identification framework visualization.

All reader-facing explanations are self-contained. Research claims and caveats should cite public papers or books directly; they must not depend on unpublished notes or adjacent project context.

## Preview

From the repository root:

- `python -m http.server 8000`
- Open `http://localhost:8000/apps/atlas/`

## Main Local Assets

- `index.html`
  - Standalone app shell.
- `styles.css`
  - Atlas-local visual system and layout styles.
- `js/app.js`
  - Main page controller and chart logic.
- `js/feature-flags.js`
  - Developer-only switches for optional Atlas subsystems.
- `js/renderers.js`
  - Atlas-local DOM and MathJax rendering helpers.
- `js/data/identification-atlas-data.js`
  - Checked-in empirical running example data used by the app.
- `source/Overview`
  - Source files used to regenerate the checked-in empirical example data.
- `research/sections.mjs`, `research/page-sections.mjs`, `research/claims.mjs`, `research/sources.mjs`, and `research/coverage.mjs`
  - Reviewed section contracts for the overview and all eight method pages, Proxy claim records, normalized public-source metadata, development-only vault citation links, and declared literature coverage.
- `research/atlas-source-audit.md`
  - Generated all-page matrix of reviewed sections, citation-display decisions, public bibliographies, and internal verification authority.
- `source/check_atlas_sources.mjs`
  - Atlas publication gate for vault/BibTeX agreement, public DOI metadata, inline citation placement, audit-only coverage, section hashes, and report freshness; run `node source/check_atlas_sources.mjs` from this directory.
- `source/export_static_figures.py`
  - Reproducible exporter for portable figures under `exports/static-figures`.

## Feature Flags

Edit `js/feature-flags.js` to control optional public app surfaces. Set
`matlabReplication` to `false` to hide the MATLAB sections on the overview
and method pages and prevent the browser from loading the MATLAB panel module or
the checked-in `.m` sources. Set it to `true` to enable them.
