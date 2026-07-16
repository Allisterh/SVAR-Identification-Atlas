% atlas_proxy_demo
% Proxy-SVAR external-instrument moment on the shared Atlas rotation grid.
%
% Identification idea:
%   The proxy is informative about the policy shock and orthogonal to the
%   non-target stock-market shock. Choose the rotation minimizing
%   |corr(e_stock(theta), z)|.

atlas_setup;

methodName = 'Proxy-SVAR';
loss = zeros(numel(atlas.thetaGrid), 1);

for k = 1:numel(atlas.thetaGrid)
    correlationMatrix = corrcoef(atlas.Egrid(:, stockShock, k), atlas.proxy);
    loss(k) = abs(correlationMatrix(1, 2));
end

% Loss and solution.
[~, selected] = min(loss);
accepted = loss <= atlas_quantile(loss, 0.10);
selectedNonTarget = atlas_standardize(atlas.Egrid(:, stockShock, selected));

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas Proxy-SVAR diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
plot(atlas.anglesDeg, loss, 'LineWidth', 1.8);
hold on;
scatter(atlas.anglesDeg(accepted), loss(accepted), 18, 'filled');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('|corr(e_{stock}(\theta), z)|');
xlabel('\theta in degrees');
ylabel('proxy orthogonality loss');
grid on;

nexttile;
plot(atlas.proxy, 'LineWidth', 1.1);
hold on;
plot(selectedNonTarget, 'LineWidth', 1.1);
yline(0, ':');
title('Proxy and selected non-target shock');
xlabel('time');
ylabel('standardized value');
legend('proxy z', 'non-target shock', 'Location', 'best');
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
