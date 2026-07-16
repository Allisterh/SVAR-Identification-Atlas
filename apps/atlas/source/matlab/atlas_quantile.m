function cutoff = atlas_quantile(values, probability)
% atlas_quantile  Dependency-light empirical quantile for demo cutoffs.

values = sort(values(:));
index = 1 + (numel(values) - 1) * probability;
lowerIndex = floor(index);
upperIndex = ceil(index);

if lowerIndex == upperIndex
    cutoff = values(lowerIndex);
else
    weight = index - lowerIndex;
    cutoff = (1 - weight) * values(lowerIndex) + weight * values(upperIndex);
end
end
