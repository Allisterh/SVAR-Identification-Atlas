% atlas_recursive_demo
% Recursive short-run zero restriction on the shared Atlas rotation grid.
%
% Identification idea:
%   The stock-market shock has no contemporaneous effect on the interest-rate
%   residual. In the impact matrix B(theta), this means b_12(theta) = 0.

atlas_setup;

methodName = 'Recursive';
b12 = squeeze(atlas.Bgrid(rate, stockShock, :));

% Loss and solution.
loss = abs(b12);
[~, selected] = min(loss);

% For visualization, treat the best 10 percent of rotations as a near-zero
% neighborhood. Recursive identification itself selects one Cholesky ordering.
accepted = loss <= atlas_quantile(loss, 0.10);

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas recursive diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
plot(atlas.anglesDeg, loss, 'LineWidth', 1.8);
hold on;
scatter(atlas.anglesDeg(accepted), loss(accepted), 18, 'filled');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Loss L(\theta) = |b_{12}(\theta)|');
xlabel('\theta in degrees');
ylabel('loss');
grid on;

nexttile;
plot(atlas.anglesDeg, b12, 'LineWidth', 1.8);
hold on;
yline(0, ':');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Forbidden impact entry b_{12}(\theta)');
xlabel('\theta in degrees');
ylabel('impact');
grid on;

nexttile;
bar(categorical({'near zero', 'other'}), [sum(accepted), numel(accepted) - sum(accepted)]);
title('Rotation-set summary');
ylabel('number of grid rotations');
grid on;

nexttile;
atlas_plot_selected_matrix(atlas, selected);

figs(2) = atlas_plot_all_irfs(atlas, loss, accepted, selected, methodName);
figs(3) = atlas_plot_selected_irfs(atlas, accepted, selected, methodName);
fig = figs(1);
