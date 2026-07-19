# Atlas MATLAB code

This folder is the canonical source for the MATLAB code shown in the Atlas web app.

- `atlas_setup.m` builds the shared simulated bivariate SVAR example.
- `atlas_<method>_demo.m` files reproduce a MATLAB version of each method page:
  method diagnostics, all-rotation IRFs, and selected/accepted-set IRFs.
- `atlas_run_all_method_demos.m` smoke-tests every page script and exports PNGs to
  `source/matlab/generated/`.

Run from MATLAB:

```matlab
cd webillustration/apps/atlas/source/matlab
atlas_run_all_method_demos
```

The browser code panels load these files directly. Keep method snippets runnable after
`atlas_setup.m`, and keep each method script self-running by calling `atlas_setup` if
the shared `atlas` struct is missing.
