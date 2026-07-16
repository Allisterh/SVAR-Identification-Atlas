% atlas_narrative_demo
% Narrative restriction on the shared Atlas rotation grid.
%
% Identification idea:
%   At a chosen event date, the recovered stock-market shock is negative and
%   dominates the recovered policy shock in absolute value.

atlas_setup;

methodName = 'Narrative restriction';
narrativeDate = atlas.narrativeDate;
estock = squeeze(atlas.Egrid(narrativeDate, stockShock, :));
epolicy = squeeze(atlas.Egrid(narrativeDate, policyShock, :));

trueEventShock = atlas.epsTrue(narrativeDate, :);

% Loss, accepted set, and representative selected rotation.
accepted = (estock < 0) & (abs(estock) > abs(epolicy));
loss = double(~accepted);

acceptedIdx = find(accepted);
if isempty(acceptedIdx)
    [~, selected] = min(abs(estock));
else
    selected = acceptedIdx(round(numel(acceptedIdx) / 2));
end

figs = gobjects(3, 1);
figs(1) = figure('Name', 'Atlas narrative-restriction diagnostics', 'Color', 'w');
tiledlayout(figs(1), 2, 2, 'Padding', 'compact', 'TileSpacing', 'compact');

nexttile;
stairs(atlas.anglesDeg, loss, 'LineWidth', 1.8);
ylim([-0.1 1.1]);
yticks([0 1]);
yticklabels({'accepted', 'rejected'});
xline(atlas.anglesDeg(selected), '--', 'representative');
title('Narrative violation indicator');
xlabel('\theta in degrees');
ylabel('status');
grid on;

nexttile;
plot(atlas.anglesDeg, estock, 'LineWidth', 1.8);
hold on;
plot(atlas.anglesDeg, epolicy, 'LineWidth', 1.8);
scatter(atlas.anglesDeg(accepted), estock(accepted), 22, 'filled');
yline(0, ':');
xline(atlas.anglesDeg(selected), '--', 'representative');
title(sprintf('Recovered shocks at event date t = %d', narrativeDate));
xlabel('\theta in degrees');
ylabel('shock value');
legend('stock shock', 'policy shock', 'accepted', 'Location', 'best');
grid on;

nexttile;
bar(categorical({'accepted', 'rejected'}), [sum(accepted), numel(accepted) - sum(accepted)]);
title('Rotation-set summary');
ylabel('number of grid rotations');
grid on;
subtitle(sprintf('True event shock: policy %.2f, stock %.2f', trueEventShock(policyShock), trueEventShock(stockShock)));

nexttile;
atlas_plot_selected_matrix(atlas, selected);

figs(2) = atlas_plot_all_irfs(atlas, loss, accepted, selected, methodName);
figs(3) = atlas_plot_selected_irfs(atlas, accepted, selected, methodName);
fig = figs(1);
