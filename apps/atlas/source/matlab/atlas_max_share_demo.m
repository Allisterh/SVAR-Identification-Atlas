% atlas_max_share_demo
% Forecast-error variance max-share rule on the Atlas rotation grid.
%
% Identification idea:
%   Choose the rotation that maximizes the share of interest-rate forecast-
%   error variance explained by the policy shock.

atlas_setup;

methodName = 'Max-share';
share = zeros(numel(atlas.thetaGrid), 1);

for k = 1:numel(atlas.thetaGrid)
    numerator = sum(squeeze(atlas.IRF(rate, policyShock, :, k)).^2);
    denominator = 0;
    for shock = 1:atlas.n
        denominator = denominator + sum(squeeze(atlas.IRF(rate, shock, :, k)).^2);
    end
    share(k) = numerator / denominator;
end

% Maximize share, equivalently minimize 1 - share.
loss = 1 - share;
[~, selected] = max(share);
accepted = share >= atlas_quantile(share, 0.90);

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas max-share diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
plot(atlas.anglesDeg, loss, 'LineWidth', 1.8);
hold on;
scatter(atlas.anglesDeg(accepted), loss(accepted), 18, 'filled');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Loss: 1 - FEVD share');
xlabel('\theta in degrees');
ylabel('loss');
grid on;

nexttile;
plot(atlas.anglesDeg, share, 'LineWidth', 1.8);
hold on;
xline(atlas.anglesDeg(selected), '--', 'selected');
title('FEVD share explained by policy shock');
xlabel('\theta in degrees');
ylabel('share');
grid on;

nexttile;
bar(categorical({'top share', 'other'}), [sum(accepted), numel(accepted) - sum(accepted)]);
title('Rotation-set summary');
ylabel('number of grid rotations');
grid on;

nexttile;
atlas_plot_selected_matrix(atlas, selected);

figs(2) = atlas_plot_all_irfs(atlas, loss, accepted, selected, methodName);
figs(3) = atlas_plot_selected_irfs(atlas, accepted, selected, methodName);
fig = figs(1);
