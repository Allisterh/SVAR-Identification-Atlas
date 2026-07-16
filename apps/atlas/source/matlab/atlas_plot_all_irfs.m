function fig = atlas_plot_all_irfs(atlas, loss, accepted, selected, displayName)
% atlas_plot_all_irfs  Plot all four IRF clouds over the rotation grid.

fig = figure('Name', ['Atlas ' displayName ' all rotations IRFs'], 'Color', 'w');
tiledlayout(fig, 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

specs = {
    1, 1, 'Rate response to policy shock';
    2, 1, 'Stock response to policy shock';
    1, 2, 'Rate response to stock shock';
    2, 2, 'Stock response to stock shock'
};

colors = atlas_loss_colors(loss, accepted);
for i = 1:size(specs, 1)
    nexttile;
    hold on;
    for k = 1:numel(atlas.thetaGrid)
        responsePath = squeeze(atlas.IRF(specs{i, 1}, specs{i, 2}, :, k));
        plot(atlas.horizons, responsePath, 'Color', colors(k, :), 'LineWidth', 0.85);
    end
    selectedPath = squeeze(atlas.IRF(specs{i, 1}, specs{i, 2}, :, selected));
    plot(atlas.horizons, selectedPath, 'k', 'LineWidth', 2.4);
    yline(0, ':');
    title(specs{i, 3});
    xlabel('horizon');
    ylabel('response');
    grid on;
end

sgtitle([displayName ': all rotations, selected path in black']);
end
