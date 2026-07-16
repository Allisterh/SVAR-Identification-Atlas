% atlas_heteroskedasticity_demo
% Heteroskedasticity-style identification on the Atlas rotation grid.
%
% Identification idea:
%   Split the sample into two volatility regimes and choose the rotation that
%   makes both regime covariance matrices as close to diagonal as possible.

atlas_setup;

methodName = 'Heteroskedasticity';
mid = floor(atlas.T / 2);
loss = zeros(numel(atlas.thetaGrid), 1);
regimeGap = zeros(numel(atlas.thetaGrid), 1);

for k = 1:numel(atlas.thetaGrid)
    earlyCov = cov(atlas.Egrid(1:mid, :, k));
    lateCov = cov(atlas.Egrid(mid + 1:end, :, k));
    loss(k) = earlyCov(1, 2)^2 + lateCov(1, 2)^2;
    regimeGap(k) = abs(lateCov(1, 1) - earlyCov(1, 1)) + ...
        abs(lateCov(2, 2) - earlyCov(2, 2));
end

% Loss and solution.
[~, selected] = min(loss);
accepted = loss <= atlas_quantile(loss, 0.10);

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas heteroskedasticity diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
plot(atlas.anglesDeg, loss, 'LineWidth', 1.8);
hold on;
scatter(atlas.anglesDeg(accepted), loss(accepted), 18, 'filled');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Two-regime covariance loss');
xlabel('\theta in degrees');
ylabel('loss');
grid on;

nexttile;
plot(atlas.anglesDeg, regimeGap, 'LineWidth', 1.8);
hold on;
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Displayed volatility-regime contrast');
xlabel('\theta in degrees');
ylabel('variance contrast');
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
