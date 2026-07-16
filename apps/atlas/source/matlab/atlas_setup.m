% atlas_setup
% Shared simulated bivariate SVAR setup for the SVAR Identification Atlas.
%
% The method-page demos use this script as their common foundation. It creates
% a stable two-variable VAR(1), a known impact matrix, a grid of orthogonal
% rotations, recovered shocks, and impulse responses for every rotation.
%
% Variables:
%   atlas        Struct containing all simulated data and rotation-grid output.
%   rate         Index of the interest-rate variable.
%   stock        Index of the stock-market variable.
%   policyShock  Index of the monetary-policy shock.
%   stockShock   Index of the stock-market shock.

rng(7, 'twister');

T = 240;
H = 24;
n = 2;

rate = 1;
stock = 2;
policyShock = 1;
stockShock = 2;
narrativeDate = round(0.75 * T);

% Stable reduced-form dynamics used only for this public teaching example.
% The lower-left coefficient is chosen so the true long-run stock response
% to the policy shock is zero:
%   [inv(I - A) * Btrue](stock, policyShock) = 0.
A = [ 0.72  0.08;
      0.04 * (1 - 0.72) / 0.18  0.55];

% True contemporaneous impact matrix for the simulated structural shocks. It
% satisfies the recursive zero b_12 = 0 and the sign restriction b_21 < 0.
Btrue = [ 0.18  0.00;
         -0.04  0.07];

% Independent non-Gaussian structural shocks from MATLAB's Pearson system.
% The Pearson draws start with mean zero and standard deviation one, then are
% standardized again after the regime and narrative transformations below.
pearsonSkew = [1.20, -1.00];
pearsonKurt = [5.00, 4.50];
epsTrue = zeros(T, n);
epsTrue(:, policyShock) = pearsrnd(0, 1, pearsonSkew(policyShock), pearsonKurt(policyShock), T, 1);
epsTrue(:, stockShock) = pearsrnd(0, 1, pearsonSkew(stockShock), pearsonKurt(stockShock), T, 1);
epsTrue = (epsTrue - mean(epsTrue)) ./ std(epsTrue);

% Add a clear volatility split so the heteroskedasticity page has a true regime
% change in the DGP. The two shocks change variances in opposite directions.
mid = floor(T / 2);
regimeScale = ones(T, n);
regimeScale(1:mid, :) = repmat([0.75 1.30], mid, 1);
regimeScale(mid + 1:end, :) = repmat([1.55 0.65], T - mid, 1);
epsTrue = epsTrue .* regimeScale;

% Hand-place the narrative event used by atlas_narrative_demo. This keeps the
% example honest: the DGP itself contains a negative stock-market shock that
% dominates the policy shock at the event date.
epsTrue(narrativeDate, policyShock) = 0.15;
epsTrue(narrativeDate, stockShock) = -4.00;

% Preserve the standard SVAR normalization after all transformations:
% E[eps_t] = 0 and Var(eps_t) = 1 in sample for each structural shock.
epsTrue = (epsTrue - mean(epsTrue)) ./ std(epsTrue);

u = epsTrue * Btrue.';
y = zeros(T, n);
for t = 2:T
    y(t, :) = (A * y(t - 1, :).' + u(t, :).').';
end

SigmaU = cov(u);
P = chol(SigmaU, 'lower');
thetaGrid = linspace(-pi / 2, pi / 2, 100);
anglesDeg = thetaGrid * 180 / pi;
horizons = 0:H;

Bgrid = zeros(n, n, numel(thetaGrid));
Egrid = zeros(T, n, numel(thetaGrid));
IRF = zeros(n, n, numel(horizons), numel(thetaGrid));

for k = 1:numel(thetaGrid)
    theta = thetaGrid(k);
    R = [cos(theta) -sin(theta); sin(theta) cos(theta)];
    B = P * R;
    Bgrid(:, :, k) = B;
    Egrid(:, :, k) = (B \ u.').';

    Ah = eye(n);
    for h = 1:numel(horizons)
        IRF(:, :, h, k) = Ah * B;
        Ah = Ah * A;
    end
end

proxy = epsTrue(:, policyShock) + 0.6 * randn(T, 1);
proxy = (proxy - mean(proxy)) / std(proxy);

atlas = struct();
atlas.T = T;
atlas.H = H;
atlas.n = n;
atlas.narrativeDate = narrativeDate;
atlas.A = A;
atlas.Btrue = Btrue;
atlas.trueLongRunImpact = inv(eye(n) - A) * Btrue;
atlas.epsTrue = epsTrue;
atlas.regimeScale = regimeScale;
atlas.pearsonSkew = pearsonSkew;
atlas.pearsonKurt = pearsonKurt;
atlas.u = u;
atlas.y = y;
atlas.SigmaU = SigmaU;
atlas.P = P;
atlas.thetaGrid = thetaGrid;
atlas.anglesDeg = anglesDeg;
atlas.horizons = horizons;
atlas.Bgrid = Bgrid;
atlas.Egrid = Egrid;
atlas.IRF = IRF;
atlas.proxy = proxy;
atlas.labels = {'Interest rate', 'S&P 500'};
