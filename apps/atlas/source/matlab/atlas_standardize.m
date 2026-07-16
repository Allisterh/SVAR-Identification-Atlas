function out = atlas_standardize(values)
% atlas_standardize  Center and scale a vector for overlay plots.

out = (values - mean(values)) / std(values);
end
