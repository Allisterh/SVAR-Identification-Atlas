function atlas_plot_selected_matrix(atlas, selected)
% atlas_plot_selected_matrix  Show selected impact matrix with labels.

Bselected = atlas.Bgrid(:, :, selected);
imagesc(Bselected);
axis equal tight;
colormap(gca, parula);
title(sprintf('Selected B(\\theta), \\theta = %.1f degrees', atlas.anglesDeg(selected)));
xticks(1:2);
yticks(1:2);
xticklabels({'policy shock', 'stock shock'});
yticklabels({'rate residual', 'stock residual'});

for row = 1:2
    for col = 1:2
        text(col, row, sprintf('%.3f', Bselected(row, col)), ...
            'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'Color', 'w');
    end
end
end
