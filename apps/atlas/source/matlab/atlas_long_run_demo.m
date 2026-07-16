% atlas_long_run_demo
% Long-run cumulative restriction on the shared Atlas rotation grid.
%
% Identification idea:
%   Choose the rotation whose long-run stock-market response to the policy
%   shock is closest to zero.

atlas_setup;

methodName = 'Long-run restriction';
C = inv(eye(atlas.n) - atlas.A);
longRunImpact = zeros(numel(atlas.thetaGrid), 1);
stockResponse = squeeze(atlas.IRF(stock, policyShock, :, :));
cumPath = cumsum(stockResponse, 1);

for k = 1:numel(atlas.thetaGrid)
    thisLongRun = C * atlas.Bgrid(:, :, k);
    longRunImpact(k) = thisLongRun(stock, policyShock);
end

% Loss and solution.
loss = abs(longRunImpact);
[~, selected] = min(loss);
accepted = loss <= atlas_quantile(loss, 0.10);

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas long-run diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
plot(atlas.anglesDeg, loss, 'LineWidth', 1.8);
hold on;
scatter(atlas.anglesDeg(accepted), loss(accepted), 18, 'filled');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Loss: final cumulative response near zero');
xlabel('\theta in degrees');
ylabel('loss');
grid on;

nexttile;
plot(atlas.anglesDeg, longRunImpact, 'LineWidth', 1.8);
hold on;
yline(0, ':');
xline(atlas.anglesDeg(selected), '--', 'selected');
title('Long-run stock response');
xlabel('\theta in degrees');
ylabel('long-run response');
grid on;

nexttile;
plot(atlas.horizons, cumPath(:, selected), 'LineWidth', 2);
hold on;
yline(0, ':');
title('Cumulative path at selected rotation');
xlabel('horizon');
ylabel('cumulative response');
grid on;

nexttile;
atlas_plot_selected_matrix(atlas, selected);

figs(2) = atlas_plot_all_irfs(atlas, loss, accepted, selected, methodName);
figs(3) = atlas_plot_selected_irfs(atlas, accepted, selected, methodName);
fig = figs(1);
