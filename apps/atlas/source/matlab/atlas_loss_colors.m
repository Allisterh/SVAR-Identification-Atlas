function colors = atlas_loss_colors(loss, accepted)
% atlas_loss_colors  Map rotation losses to readable RGB line colors.
%
% Accepted rotations are teal. Rejected rotations move from blue-purple to
% warm orange as the loss worsens.

loss = loss(:);
accepted = accepted(:);
numAngles = numel(loss);
colors = zeros(numAngles, 3);

lossMin = min(loss);
lossMax = max(loss);
lossRange = max(lossMax - lossMin, eps);
scaledLoss = (loss - lossMin) ./ lossRange;

for k = 1:numAngles
    if accepted(k)
        colors(k, :) = [0.08, 0.62, 0.55];
    else
        warmth = scaledLoss(k);
        colors(k, :) = [0.15 + 0.70 * warmth, 0.40 - 0.22 * warmth, 0.68 - 0.42 * warmth];
    end
end
end
