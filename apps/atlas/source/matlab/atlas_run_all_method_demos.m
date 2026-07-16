% atlas_run_all_method_demos
% Smoke-test every Atlas MATLAB method-page script and export PNG figures.
%
% This runner is intentionally plain MATLAB. It verifies that the public code
% shown in the web app runs without errors and recreates the method diagnostics,
% all-rotation IRFs, and selected/accepted-set IRFs for every method page.

clear; close all; clc;

rootDir = fileparts(mfilename('fullpath'));
addpath(rootDir);

outputDir = fullfile(rootDir, 'generated');
if ~exist(outputDir, 'dir')
    mkdir(outputDir);
end

methods = {
    'recursive', 'atlas_recursive_demo';
    'sign', 'atlas_sign_demo';
    'narrative', 'atlas_narrative_demo';
    'long-run', 'atlas_long_run_demo';
    'proxy', 'atlas_proxy_demo';
    'max-share', 'atlas_max_share_demo';
    'independent-shocks', 'atlas_independent_shocks_demo';
    'heteroskedasticity', 'atlas_heteroskedasticity_demo'
};

for i = 1:size(methods, 1)
    methodId = methods{i, 1};
    scriptName = methods{i, 2};

    fprintf('Running %s...\n', scriptName);
    clear atlas fig figs loss chosen accepted impact share cumResponse violation;
    close all;

    run(fullfile(rootDir, [scriptName '.m']));

    if ~exist('figs', 'var') || isempty(figs) || any(~isgraphics(figs, 'figure'))
        error('AtlasDemo:MissingFigure', '%s did not create valid figure handles named figs.', scriptName);
    end

    suffixes = {'diagnostics', 'all-irfs', 'selected-irfs'};
    for j = 1:numel(figs)
        outputPath = fullfile(outputDir, sprintf('%s-%s.png', methodId, suffixes{j}));
        exportgraphics(figs(j), outputPath, 'Resolution', 160);
    end
end

fprintf('All Atlas MATLAB method demos ran successfully. Figures written to:\n%s\n', outputDir);
