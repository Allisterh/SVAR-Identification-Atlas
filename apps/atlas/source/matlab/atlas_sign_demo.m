% atlas_sign_demo
% Sign restriction on the shared Atlas rotation grid.
%
% Identification idea:
%   A contractionary policy shock should lower the stock-market residual on
%   impact. In the impact matrix B(theta), this means b_21(theta) <= 0.

atlas_setup;

methodName = 'Sign restriction';
impact = squeeze(atlas.Bgrid(stock, policyShock, :));

% Loss, accepted set, and representative selected rotation.
accepted = impact <= 0;
loss = double(~accepted);

acceptedIdx = find(accepted);
if isempty(acceptedIdx)
    [~, selected] = min(abs(impact));
else
    selected = acceptedIdx(round(numel(acceptedIdx) / 2));
end

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas sign-restriction diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
stairs(atlas.anglesDeg, loss, 'LineWidth', 1.8);
ylim([-0.1 1.1]);
yticks([0 1]);
yticklabels({'accepted', 'rejected'});
xline(atlas.anglesDeg(selected), '--', 'representative');
title('Violation indicator');
xlabel('\theta in degrees');
ylabel('status');
grid on;

nexttile;
plot(atlas.anglesDeg, impact, 'LineWidth', 1.8);
hold on;
yline(0, ':');
scatter(atlas.anglesDeg(accepted), impact(accepted), 22, 'filled');
xline(atlas.anglesDeg(selected), '--', 'representative');
title('Impact sign b_{21}(\theta) <= 0');
xlabel('\theta in degrees');
ylabel('impact');
grid on;

nexttile;
bar(categorical({'accepted', 'rejected'}), [sum(accepted), numel(accepted) - sum(accepted)]);
title('Rotation-set summary');
ylabel('number of grid rotations');
grid on;

nexttile;
atlas_plot_selected_matrix(atlas, selected);

figs(2) = atlas_plot_all_irfs(atlas, loss, accepted, selected, methodName);
figs(3) = atlas_plot_selected_irfs(atlas, accepted, selected, methodName);
fig = figs(1);
