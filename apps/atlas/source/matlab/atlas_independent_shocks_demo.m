% atlas_independent_shocks_demo
% Higher-moment independent-shocks diagnostic on the Atlas rotation grid.
%
% Identification idea:
%   Choose the rotation that makes the recovered shocks least dependent by a
%   simple third-order cross-moment score.

atlas_setup;

methodName = 'Independent shocks';
loss = zeros(numel(atlas.thetaGrid), 1);

for k = 1:numel(atlas.thetaGrid)
    e1 = atlas.Egrid(:, 1, k);
    e2 = atlas.Egrid(:, 2, k);
    loss(k) = mean(e1.^2 .* e2)^2 + mean(e1 .* e2.^2)^2;
end

% Loss and solution.
[~, selected] = min(loss);
accepted = loss <= atlas_quantile(loss, 0.10);

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas independent-shocks diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
plot(atlas.anglesDeg, loss, 'LineWidth', 1.8);
hold on;
scatter(atlas.anglesDeg(accepted), loss(accepted), 18, 'filled');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Third-moment dependence score');
xlabel('\theta in degrees');
ylabel('loss');
grid on;

nexttile;
scatter(atlas.Egrid(:, 1, selected), atlas.Egrid(:, 2, selected), 16, 'filled');
hold on;
xline(0, ':');
yline(0, ':');
title('Recovered shocks at selected rotation');
xlabel('shock 1');
ylabel('shock 2');
grid on;

nexttile;
bar(categorical({'near min', 'other'}), [sum(accepted), numel(accepted) - sum(accepted)]);
title('Rotation-set summary');
ylabel('number of grid rotations');
grid on;

nexttile;
atlas_plot_selected_matrix(atlas, selected);

figs(2) = atlas_plot_all_irfs(atlas, loss, accepted, selected, methodName);
figs(3) = atlas_plot_selected_irfs(atlas, accepted, selected, methodName);
fig = figs(1);
