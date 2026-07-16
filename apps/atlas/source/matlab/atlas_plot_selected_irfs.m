function fig = atlas_plot_selected_irfs(atlas, accepted, selected, displayName)
% atlas_plot_selected_irfs  Plot accepted rotations and emphasize selection.

fig = figure('Name', ['Atlas ' displayName ' accepted-selected IRFs'], 'Color', 'w');
tiledlayout(fig, 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

specs = {
    1, 1, 'Rate response to policy shock';
    2, 1, 'Stock response to policy shock';
    1, 2, 'Rate response to stock shock';
    2, 2, 'Stock response to stock shock'
};

acceptedIdx = find(accepted);
if isempty(acceptedIdx)
    acceptedIdx = selected;
end

for i = 1:size(specs, 1)
    nexttile;
    hold on;
    for k = acceptedIdx(:).'
        responsePath = squeeze(atlas.IRF(specs{i, 1}, specs{i, 2}, :, k));
        plot(atlas.horizons, responsePath, 'Color', [0.46 0.72 0.78], 'LineWidth', 0.9);
    end
    selectedPath = squeeze(atlas.IRF(specs{i, 1}, specs{i, 2}, :, selected));
    plot(atlas.horizons, selectedPath, 'Color', [0.07 0.25 0.33], 'LineWidth', 2.5);
    yline(0, ':');
    title(specs{i, 3});
    xlabel('horizon');
    ylabel('response');
    grid on;
end

sgtitle(sprintf('%s: accepted set (%d rotations) and selected path', displayName, numel(acceptedIdx)));
end
