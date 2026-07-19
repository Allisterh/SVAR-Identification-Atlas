"""Generate the static data module for the standalone identification illustration.

The browser app consumes a checked-in JavaScript module so page loads stay
deterministic and do not need to parse empirical source files at runtime.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
from scipy.io import loadmat


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source" / "Overview"
OUT = ROOT / "js" / "data" / "identification-atlas-data.js"

LAG_ORDER = 4
HORIZONS = 24
CANDIDATE_COUNT = 100
CRISIS_MONTH = "2008-10"
SURROGATE_SEED = 20260411
RATE_NOISE_SCALE = 0.012
SP500_LOG_NOISE_SCALE = 0.004
PROXY_NOISE_SCALE = 0.06


def round_float(value: float, digits: int = 6) -> float:
    rounded = round(float(value), digits)
    return 0.0 if rounded == -0.0 else rounded


def round_nested(value, digits: int = 6):
    if isinstance(value, np.ndarray):
        return round_nested(value.tolist(), digits)
    if isinstance(value, (list, tuple)):
        return [round_nested(item, digits) for item in value]
    if isinstance(value, (float, np.floating)):
        return round_float(value, digits)
    return value


def date_label(year: float, month: float) -> str:
    return f"{int(year):04d}-{int(month):02d}"


def build_rhs(y: np.ndarray, p: int) -> np.ndarray:
    rows, nvars = y.shape
    rhs = np.ones((rows, 1 + p * nvars))
    rhs[:, 1:] = np.nan
    for lag in range(1, p + 1):
        start = 1 + (lag - 1) * nvars
        rhs[lag:, start : start + nvars] = y[:-lag, :]
    return rhs


def fit_var(y: np.ndarray, p: int):
    rhs = build_rhs(y, p)
    rows, nvars = y.shape
    coefs = np.zeros((nvars, rhs.shape[1]))
    fitted = np.full((rows, nvars), np.nan)
    residuals = np.full((rows, nvars), np.nan)

    valid = ~np.isnan(rhs).any(axis=1)
    x_valid = rhs[valid, :]

    for eq in range(nvars):
        beta, *_ = np.linalg.lstsq(x_valid, y[valid, eq], rcond=None)
        coefs[eq, :] = beta
        fitted[valid, eq] = x_valid @ beta
        residuals[valid, eq] = y[valid, eq] - fitted[valid, eq]

    return coefs, fitted, residuals, valid


def coefficient_matrices(coefs: np.ndarray, p: int) -> np.ndarray:
    nvars = coefs.shape[0]
    matrices = np.zeros((p, nvars, nvars))
    for lag in range(p):
        start = 1 + lag * nvars
        matrices[lag] = coefs[:, start : start + nvars]
    return matrices


def moving_average_matrices(a_mats: np.ndarray, horizons: int) -> np.ndarray:
    p, nvars, _ = a_mats.shape
    phi = np.zeros((horizons, nvars, nvars))
    phi[0] = np.eye(nvars)
    for horizon in range(1, horizons):
        acc = np.zeros((nvars, nvars))
        for lag in range(1, min(p, horizon) + 1):
            acc += a_mats[lag - 1] @ phi[horizon - lag]
        phi[horizon] = acc
    return phi


def corrcoef(x: np.ndarray, y: np.ndarray) -> float:
    if np.std(x) == 0 or np.std(y) == 0:
        return 0.0
    return float(np.corrcoef(x, y)[0, 1])


def covariance_moment(x: np.ndarray, y: np.ndarray) -> float:
    return float(np.mean((x - np.mean(x)) * (y - np.mean(y))))


def format_candidate(index: int) -> str:
    return f"Candidate {index:02d}"


def format_metric(value: float, digits: int = 4) -> str:
    return f"{value:.{digits}f}"


def sanitize_public_string(value: str) -> str:
    replacements = {
        "θ": "theta",
        "ε": "e",
        "Σ": "sum",
        "Ψ": "Psi",
        "Φ": "Phi",
        "₀": "0",
        "₁": "1",
        "₂": "2",
        "₄": "4",
        "ₕ": "h",
        "ₜ": "_t",
        "₋": "-",
        "⁻¹": "^(-1)",
        "²": "^2",
        "≈": "approx",
        "≥": ">=",
        "Î¸": "theta",
        "Îµ": "e",
        "Î£": "sum",
        "Î¨": "Psi",
        "Î¦": "Phi",
        "â‚€": "0",
        "â‚": "1",
        "â‚‚": "2",
        "â‚„": "4",
        "â‚•": "h",
        "â‚œ": "_t",
        "â‚‹": "-",
        "â»Â¹": "^(-1)",
        "Â²": "^2",
        "â‰ˆ": "approx",
        "â‰¥": ">=",
        "â€œ": '"',
        "â€": '"',
        "Ã¼": "u",
    }
    result = value
    for old, new in replacements.items():
        result = result.replace(old, new)
    return result


def sanitize_public_object(value):
    if isinstance(value, dict):
        return {key: sanitize_public_object(item) for key, item in value.items()}
    if isinstance(value, list):
        return [sanitize_public_object(item) for item in value]
    if isinstance(value, str):
        return sanitize_public_string(value)
    return value


def load_inputs():
    raw = loadmat(SOURCE / "data.mat")["data"]
    proxy_raw = loadmat(SOURCE / "hfdata.mat")["hfproxy"]
    return raw, proxy_raw


def build_public_surrogates(raw: np.ndarray, proxy_raw: np.ndarray):
    """Create deterministic illustrative series so browser data are not exact source values."""

    rng = np.random.default_rng(SURROGATE_SEED)
    surrogate = raw.astype(float).copy()
    nobs = surrogate.shape[0]
    phase = np.linspace(0.0, 4.0 * math.pi, nobs)

    rate = surrogate[:, 2]
    rate_scale = np.nanstd(rate) or 1.0
    surrogate[:, 2] = rate + rng.normal(0.0, RATE_NOISE_SCALE * rate_scale, nobs) + 0.006 * np.sin(phase)

    sp500 = np.maximum(surrogate[:, 3], 1e-8)
    log_sp500 = np.log(sp500)
    log_noise = rng.normal(0.0, SP500_LOG_NOISE_SCALE, nobs) + 0.0025 * np.cos(phase * 0.7)
    surrogate[:, 3] = np.exp(log_sp500 + log_noise)

    proxy_surrogate = proxy_raw.astype(float).copy()
    valid_proxy = ~np.isnan(proxy_surrogate[:, 2])
    proxy_scale = np.nanstd(proxy_surrogate[:, 2]) or 1.0
    proxy_phase = np.linspace(0.0, 3.0 * math.pi, proxy_surrogate.shape[0])
    proxy_surrogate[valid_proxy, 2] = (
        proxy_surrogate[valid_proxy, 2]
        + rng.normal(0.0, PROXY_NOISE_SCALE * proxy_scale, int(np.sum(valid_proxy)))
        + 0.015 * proxy_scale * np.sin(proxy_phase[valid_proxy])
    )

    return surrogate, proxy_surrogate


def build_time_series(raw: np.ndarray):
    dates_raw = [date_label(row[0], row[1]) for row in raw]
    rate = raw[:, 2]
    sp500 = raw[:, 3]
    sp500_growth = np.diff(np.log(sp500))
    y = np.column_stack([rate[1:], sp500_growth])
    dates = dates_raw[1:]

    first_sp500 = sp500[0]
    time_series = [
        {
            "date": dates_raw[i],
            "rate": round_float(rate[i]),
            "sp500": round_float(sp500[i]),
            "sp500Indexed": round_float((sp500[i] / first_sp500) * 100),
            "sp500LogGrowth": None if i == 0 else round_float(sp500_growth[i - 1]),
        }
        for i in range(len(raw))
    ]

    return dates, y, time_series


def align_proxy(proxy_raw: np.ndarray, residual_dates: list[str]):
    proxy_map = {}
    for row in proxy_raw:
        if np.isnan(row).any():
            continue
        proxy_map[date_label(row[0], row[1])] = float(row[2])

    indices = []
    values = []
    for idx, label in enumerate(residual_dates):
        if label in proxy_map:
            indices.append(idx)
            values.append(proxy_map[label])
    return np.array(indices, dtype=int), np.array(values, dtype=float)


def build_irfs(phi: np.ndarray, impact: np.ndarray):
    psi = np.einsum("hij,jk->hik", phi, impact)
    return {
        "rateOnRate": round_nested(psi[:, 0, 0]),
        "sp500OnRate": round_nested(psi[:, 1, 0]),
        "rateOnSp500": round_nested(psi[:, 0, 1]),
        "sp500OnSp500": round_nested(psi[:, 1, 1]),
    }


def rotation_matrix(theta: float) -> np.ndarray:
    return np.array(
        [
            [math.cos(theta), -math.sin(theta)],
            [math.sin(theta), math.cos(theta)],
        ]
    )


def positive_diagonal_angles(chol: np.ndarray, count: int) -> list[float]:
    """Sample the admissible orientation arc where b11(theta) and b22(theta) are positive."""

    def allowed(theta: float) -> bool:
        impact = chol @ rotation_matrix(theta)
        return bool(impact[0, 0] > 0 and impact[1, 1] > 0)

    def boundary(direction: int) -> float:
        lo = 0.0
        hi = (math.pi / 2) - 1e-10
        if allowed(direction * hi):
            return direction * hi
        for _ in range(80):
            mid = (lo + hi) / 2
            if allowed(direction * mid):
                lo = mid
            else:
                hi = mid
        return direction * lo

    lower = boundary(-1)
    upper = boundary(1)
    angles = np.linspace(lower, upper, count + 2)[1:-1]
    zero_index = int(np.argmin(np.abs(angles)))
    angles[zero_index] = 0.0
    angles = np.array(sorted(float(angle) for angle in angles))

    if len(angles) != count or not all(allowed(angle) for angle in angles):
        raise RuntimeError("Could not construct the positive-diagonal rotation grid.")

    return angles.tolist()


def main() -> None:
    raw_source, proxy_source = load_inputs()
    raw, proxy_raw = build_public_surrogates(raw_source, proxy_source)
    y_dates, y, time_series = build_time_series(raw)
    coefs, fitted, residuals, valid = fit_var(y, LAG_ORDER)
    residual_dates = [date for date, is_valid in zip(y_dates, valid) if is_valid]
    u = residuals[valid]
    y_fit = fitted[valid]

    sigma = np.cov(u, rowvar=False)
    chol = np.linalg.cholesky(sigma)
    phi = moving_average_matrices(coefficient_matrices(coefs, LAG_ORDER), HORIZONS)
    proxy_indices, proxy_values = align_proxy(proxy_raw, residual_dates)
    crisis_index = residual_dates.index(CRISIS_MONTH)

    candidates = []
    rotation_candidates = []
    method_scores = {
        "recursive": [],
        "sign": [],
        "narrative": [],
        "long_run": [],
        "proxy": [],
        "max_share": [],
        "independence": [],
        "heteroskedasticity": [],
    }
    method_acceptance = {
        "sign": [],
        "narrative": [],
    }
    cumulative_sp500_on_rate = []
    regime_covariances = []

    midpoint = len(u) // 2

    theta_grid = positive_diagonal_angles(chol, CANDIDATE_COUNT)

    for index, theta in enumerate(theta_grid):
        rotation = rotation_matrix(theta)
        impact = chol @ rotation
        inv_impact = np.linalg.inv(impact)
        shocks = (inv_impact @ u.T).T
        shock_corr = corrcoef(shocks[:, 0], shocks[:, 1])
        irfs = build_irfs(phi, impact)

        long_run_sum = float(np.sum(irfs["sp500OnRate"]))
        proxy_moment = corrcoef(shocks[proxy_indices, 1], proxy_values)
        rate_share = float(
            np.sum(np.square(irfs["rateOnRate"]))
            / (np.sum(np.square(irfs["rateOnRate"])) + np.sum(np.square(irfs["rateOnSp500"])))
        )
        independence_score = float(
            np.mean((shocks[:, 0] ** 2) * shocks[:, 1]) ** 2
            + np.mean(shocks[:, 0] * (shocks[:, 1] ** 2)) ** 2
        )
        cov_first = covariance_moment(shocks[:midpoint, 0], shocks[:midpoint, 1])
        cov_second = covariance_moment(shocks[midpoint:, 0], shocks[midpoint:, 1])
        state_score = cov_first**2 + cov_second**2

        crisis_shock = shocks[crisis_index]
        sign_accept = impact[1, 0] < 0
        narrative_accept = crisis_shock[1] < 0 and abs(crisis_shock[0]) < abs(crisis_shock[1])
        recursive_loss = abs(float(impact[0, 1]))
        sign_loss = 0.0 if sign_accept else 1.0
        narrative_loss = float(crisis_shock[1] >= 0) + float(abs(crisis_shock[0]) >= abs(crisis_shock[1]))
        max_share_loss = 1 - rate_share
        cumulative_path = np.cumsum(np.array(irfs["sp500OnRate"], dtype=float))

        method_scores["recursive"].append(recursive_loss)
        method_scores["sign"].append(sign_accept)
        method_scores["narrative"].append(narrative_accept)
        method_scores["long_run"].append(abs(long_run_sum))
        method_scores["proxy"].append(abs(proxy_moment))
        method_scores["max_share"].append(max_share_loss)
        method_scores["independence"].append(independence_score)
        method_scores["heteroskedasticity"].append(state_score)
        method_acceptance["sign"].append(sign_accept)
        method_acceptance["narrative"].append(narrative_accept)
        cumulative_sp500_on_rate.append(cumulative_path)
        regime_covariances.append([cov_first, cov_second])

        diagnostics = {
            "recursiveLoss": round_float(recursive_loss),
            "impactSp500ToRateShock": round_float(impact[1, 0]),
            "crisisShock1": round_float(crisis_shock[0]),
            "crisisShock2": round_float(crisis_shock[1]),
            "signLoss": round_float(sign_loss, 8),
            "narrativeLoss": round_float(narrative_loss, 8),
            "longRunSp500OnRate": round_float(long_run_sum),
            "proxyCorrelationNonTarget": round_float(proxy_moment),
            "rateFevdShare": round_float(rate_share),
            "maxShareLoss": round_float(max_share_loss, 8),
            "independenceScore": round_float(independence_score, 8),
            "regimeCovarianceScore": round_float(state_score, 8),
            "regimeCovariances": round_nested([cov_first, cov_second]),
        }

        candidates.append(
            {
                "index": index,
                "label": format_candidate(index),
                "angleRadians": round_float(theta),
                "angleDegrees": round_float(math.degrees(theta), 2),
                "impactMatrix": round_nested(impact),
                "irfs": irfs,
                "helpers": {
                    "cumulativeSp500OnRate": round_nested(cumulative_path),
                    "narrativeShock": round_nested(crisis_shock),
                },
                "diagnostics": diagnostics,
            }
        )

        rotation_candidates.append(
            {
                "index": index,
                "label": format_candidate(index),
                "angleRadians": round_float(theta),
                "angleDegrees": round_float(math.degrees(theta), 2),
                "impactMatrix": round_nested(impact),
                "shockCorrelation": round_float(shock_corr, 8),
                "narrativeShock": round_nested(crisis_shock),
                "recoveredShocks": round_nested(shocks, 5),
            }
        )

    sign_indices = [idx for idx, ok in enumerate(method_acceptance["sign"]) if ok]
    narrative_indices = [idx for idx, ok in enumerate(method_acceptance["narrative"]) if ok]
    recursive_index = int(np.argmin(method_scores["recursive"]))
    long_run_index = int(np.argmin(method_scores["long_run"]))
    proxy_index = int(np.argmin(method_scores["proxy"]))
    max_share_index = int(np.argmin(method_scores["max_share"]))
    independence_index = int(np.argmin(method_scores["independence"]))
    hetero_index = int(np.argmin(method_scores["heteroskedasticity"]))

    reduced_form_shocks = [
        {
            "date": residual_dates[i],
            "uRate": round_float(u[i, 0]),
            "uSp500": round_float(u[i, 1]),
            "fitRate": round_float(y_fit[i, 0]),
            "fitSp500Growth": round_float(y_fit[i, 1]),
        }
        for i in range(len(u))
    ]

    setup_data = {
        "timeSeries": time_series,
        "reducedFormShocks": reduced_form_shocks,
        "rotationCandidates": rotation_candidates,
        "varSummary": {
            "lagOrder": LAG_ORDER,
            "residualObservationCount": len(u),
            "equationCount": 2,
            "regressorCountPerEquation": 1 + LAG_ORDER * 2,
            "estimationWindow": f"{residual_dates[0]} to {residual_dates[-1]}",
            "timeSeriesWindow": f"{date_label(raw[0,0], raw[0,1])} to {date_label(raw[-1,0], raw[-1,1])}",
            "reducedFormEquation": "yₜ = c + A₁yₜ₋₁ + ... + A₄yₜ₋₄ + uₜ",
            "structuralEquation": "uₜ = B₀εₜ",
            "rotationEquation": "B(θ) = P R(θ), εₜ(θ) = B(θ)⁻¹uₜ",
            "irfEquation": "Ψₕ(θ) = ΦₕB(θ)",
            "shockLabels": ["monetary policy shock", "stock market shock"],
            "reducedShockCorrelation": round_float(corrcoef(u[:, 0], u[:, 1]), 6),
            "narrativeIndex": crisis_index,
            "narrativeDate": "October 2008",
            "covarianceFactor": round_nested(chol),
            "thetaGrid": round_nested(theta_grid),
            "publicDataPolicy": {
                "type": "deterministic illustrative surrogate",
                "seed": SURROGATE_SEED,
                "note": "Browser-facing series and proxy values are deterministic transformed versions calibrated to the empirical example, not exact redistributable market data.",
            },
            "thetaGridDescription": "100 orientation-normalized rotations with b₁₁(θ) > 0 and b₂₂(θ) > 0.",
        },
        "proxyOverlap": [
            {
                "date": residual_dates[int(proxy_indices[i])],
                "residualIndex": int(proxy_indices[i]),
                "proxy": round_float(proxy_values[i]),
            }
            for i in range(len(proxy_values))
        ],
    }

    setup_data["varSummary"].update(
        {
            "reducedFormEquation": "y_t = c + A_1 y_{t-1} + ... + A_4 y_{t-4} + u_t",
            "structuralEquation": "u_t = B_0 epsilon_t",
            "rotationEquation": "B(theta) = P R(theta), e_t(theta) = B(theta)^(-1)u_t",
            "irfEquation": "Psi_h(theta) = Phi_h B(theta)",
            "thetaGridDescription": "100 orientation-normalized rotations with b11(theta) > 0 and b22(theta) > 0.",
        }
    )

    run_meta = {
        "title": "Interest-rate and S&P 500 running example",
        "sampleLabel": "Monthly U.S. interest-rate and stock-market data",
        "sampleWindow": f"{residual_dates[0]} to {residual_dates[-1]}",
        "candidateCount": CANDIDATE_COUNT,
        "candidateRule": "100 orientation-normalized rotations with positive diagonal impact entries",
        "observationCount": len(u),
        "horizons": HORIZONS,
        "lagOrder": LAG_ORDER,
        "proxyOverlap": int(len(proxy_values)),
        "crisisMonth": "October 2008",
        "crisisMonthCode": CRISIS_MONTH,
        "seed": SURROGATE_SEED,
        "variables": [
            {"id": "rate", "label": "Interest-rate series", "shortLabel": "Rate"},
            {"id": "sp500", "label": "S&P 500 log growth", "shortLabel": "S&P 500"},
        ],
        "notes": {
            "reducedForm": "A VAR(4) summarizes how the two observed series move with their own four monthly lags.",
            "benchmark": "The benchmark keeps all 100 admissible rotations because zero shock correlation alone does not choose one B matrix.",
            "proxy": f"The external high-frequency monetary proxy overlaps with {len(proxy_values)} residual observations.",
            "framework": "Each identification method adds one economic idea and turns it into a filter, loss, or objective on the same rotation grid.",
            "dataRights": "Browser-facing values are deterministic illustrative surrogates calibrated to the empirical example, not exact redistributable market or proxy data.",
        },
        "seriesLabels": {
            "rateOnRate": "Rate response to monetary policy shock",
            "sp500OnRate": "S&P 500 response to monetary policy shock",
            "rateOnSp500": "Rate response to stock market shock",
            "sp500OnSp500": "S&P 500 response to stock market shock",
        },
    }

    def selected_diag(index: int):
        return candidates[index]["diagnostics"]

    def objective(values, selected_index, direction="minimize", accepted=None, label="Loss"):
        clean = [float(value) for value in values]
        return {
            "label": label,
            "direction": direction,
            "values": round_nested(clean, 8),
            "accepted": [bool(value) for value in accepted] if accepted is not None else None,
            "selectedIndex": selected_index,
            "min": round_float(min(clean), 8),
            "max": round_float(max(clean), 8),
        }

    method_objectives = {
        "recursive": {
            **objective(method_scores["recursive"], recursive_index, label="|b₁₂(θ)|"),
            "description": "Short-run zero loss",
        },
        "sign": {
            **objective(
                [0.0 if method_acceptance["sign"][i] else 1.0 for i in range(CANDIDATE_COUNT)],
                sign_indices[0] if sign_indices else None,
                accepted=method_acceptance["sign"],
                label="1{b₂₁(θ) > 0}",
            ),
            "description": "Indicator violation of the negative impact-sign restriction",
        },
        "narrative": {
            **objective(
                [
                    float(setupDataShock[1] >= 0) + float(abs(setupDataShock[0]) >= abs(setupDataShock[1]))
                    for setupDataShock in [rotation_candidates[i]["recoveredShocks"][crisis_index] for i in range(CANDIDATE_COUNT)]
                ],
                narrative_indices[0] if narrative_indices else None,
                accepted=method_acceptance["narrative"],
                label="narrative indicator loss",
            ),
            "description": "Indicator violations of the October 2008 sign and dominance restrictions",
            "narrativeIndex": crisis_index,
            "narrativeDate": "October 2008",
            "october2008Shocks": [
                rotation_candidates[i]["narrativeShock"] for i in range(CANDIDATE_COUNT)
            ],
        },
        "long-run": {
            **objective(method_scores["long_run"], long_run_index, label="|Σₕ Ψ_S&P500,policy(h)|"),
            "description": "Absolute distance from a zero long-run cumulative response",
            "cumulativeSp500OnRate": round_nested(cumulative_sp500_on_rate),
        },
        "proxy": {
            **objective(method_scores["proxy"], proxy_index, label="|corr(ε_non-target(θ), z_proxy)|"),
            "description": "Absolute proxy orthogonality loss",
        },
        "max-share": {
            **objective(method_scores["max_share"], max_share_index, label="1 - FEVD_share(θ)"),
            "description": "Loss version of the max-share objective",
        },
        "independent-shocks": {
            **objective(method_scores["independence"], independence_index, label="E[ε₁²ε₂]² + E[ε₁ε₂²]²"),
            "description": "Third-order co-moment dependence loss",
        },
        "heteroskedasticity": {
            **objective(method_scores["heteroskedasticity"], hetero_index, label="cov_early² + cov_late²"),
            "description": "Two-regime cross-covariance loss",
            "regimeCovariances": round_nested(regime_covariances),
        },
    }

    methods = [
        {
            "id": "benchmark",
            "label": "Benchmark",
            "family": "Unidentified benchmark",
            "familyKey": "benchmark",
            "selectorType": "Admissible cloud",
            "selectionMode": "all",
            "formulaLabel": "cov(ε₁, ε₂) = 0",
            "summary": "The benchmark shows every admissible rotation. The reduced-form covariance pins down the shock scale, but not the rotation angle.",
            "assumption": "Structural shocks are uncorrelated, so monetary policy and stock-market innovations do not move together mechanically.",
            "variation": "Reduced-form covariance",
            "restriction": "Zero structural-shock correlation",
            "outputLabel": "All 100 rotations",
            "badges": ["Admissible cloud"],
            "candidateIndices": list(range(CANDIDATE_COUNT)),
            "selectedIndex": None,
            "selectionSummary": "All 100 rotations remain visible because no extra economic idea has been imposed yet.",
            "selectionDetail": "This is the common identification framework: many B matrices recover uncorrelated shocks from the same reduced-form residuals.",
            "diagnostics": [
                {"label": "Admissible rotations", "value": f"{CANDIDATE_COUNT} / {CANDIDATE_COUNT}"},
                {"label": "Residual observations", "value": str(len(u))},
                {"label": "IRF horizons", "value": str(HORIZONS)},
                {"label": "Output", "value": "Full rotation grid"},
            ],
            "comparisonOutput": "Full cloud",
        },
        {
            "id": "recursive",
            "label": "Recursive",
            "family": "Direct restrictions",
            "familyKey": "direct",
            "selectorType": "Point selection",
            "selectionMode": "point",
            "formulaLabel": "b₁₂ = 0",
            "summary": "Recursive identification picks the rotation where the stock-market shock has no contemporaneous impact on the interest-rate residual.",
            "assumption": "The policy-rate residual can react within the month to its own structural shock, but not instantly to the stock-market shock.",
            "variation": "Impact matrix",
            "restriction": "Zero contemporaneous rate response to the stock-market shock",
            "outputLabel": "One rotation",
            "badges": ["Point selection", "Best among sampled candidates"],
            "candidateIndices": [],
            "selectedIndex": recursive_index,
            "selectionSummary": f"{format_candidate(recursive_index)} minimizes the absolute forbidden impact entry in the 100-step grid.",
            "selectionDetail": "The additional economic idea is a short-run timing restriction, so the loss is the absolute forbidden impact entry.",
            "diagnostics": [
                {"label": "Selected candidate", "value": format_candidate(recursive_index)},
                {"label": "Forbidden impact", "value": format_metric(abs(candidates[recursive_index]["impactMatrix"][0][1]), 4)},
                {"label": "Criterion", "value": "Minimize |b₁₂|"},
                {"label": "Output", "value": "Single rotation"},
            ],
            "comparisonOutput": "Point estimate",
        },
        {
            "id": "sign",
            "label": "Sign",
            "family": "Direct restrictions",
            "familyKey": "direct",
            "selectorType": "Set identification",
            "selectionMode": "set",
            "formulaLabel": "b₂₁(θ) < 0",
            "summary": "Sign identification keeps the rotations where a monetary policy shock pushes the S&P 500 down on impact.",
            "assumption": "A contractionary monetary policy shock should be bad news for stock prices on impact.",
            "variation": "Impact response sign",
            "restriction": "Negative S&P 500 impact response to the monetary policy shock",
            "outputLabel": "Filtered set",
            "badges": ["Set identification"],
            "candidateIndices": sign_indices,
            "selectedIndex": None,
            "selectionSummary": f"{len(sign_indices)} of {CANDIDATE_COUNT} rotations satisfy the impact sign restriction.",
            "selectionDetail": "The economic idea does not choose one solution; it removes rotations with the wrong impact sign.",
            "diagnostics": [
                {"label": "Accepted rotations", "value": f"{len(sign_indices)} / {CANDIDATE_COUNT}"},
                {"label": "Criterion", "value": "Impact < 0"},
                {"label": "Selection type", "value": "Filter"},
                {"label": "Output", "value": "Set-valued"},
            ],
            "comparisonOutput": "Filtered set",
        },
        {
            "id": "narrative",
            "label": "Narrative",
            "family": "Direct restrictions",
            "familyKey": "direct",
            "selectorType": "Set identification",
            "selectionMode": "set",
            "formulaLabel": "ε_stock(Oct 2008) < 0 and |ε_policy| < |ε_stock|",
            "summary": "Narrative sign identification keeps rotations where October 2008 is dominated by a negative stock-market shock.",
            "assumption": "During the crisis month, the stock-market shock should be the main negative structural innovation.",
            "variation": "Dated structural shock",
            "restriction": "October 2008 shock sign and dominance condition",
            "outputLabel": "Filtered set",
            "badges": ["Set identification"],
            "candidateIndices": narrative_indices,
            "selectedIndex": None,
            "selectionSummary": f"{len(narrative_indices)} of {CANDIDATE_COUNT} rotations satisfy the October 2008 narrative filter.",
            "selectionDetail": "The economic idea is attached to one historical month, so the rule filters rotations by their recovered shocks in October 2008.",
            "diagnostics": [
                {"label": "Accepted rotations", "value": f"{len(narrative_indices)} / {CANDIDATE_COUNT}"},
                {"label": "Narrative date", "value": "October 2008"},
                {"label": "Rule", "value": "ε_stock < 0 and |ε_policy| < |ε_stock|"},
                {"label": "Output", "value": "Set-valued"},
            ],
            "comparisonOutput": "Filtered set",
        },
        {
            "id": "long-run",
            "label": "Long-run",
            "family": "Direct restrictions",
            "familyKey": "direct",
            "selectorType": "Point selection",
            "selectionMode": "point",
            "formulaLabel": "Σₕ Ψ_S&P500,policy(h) ≈ 0",
            "summary": "Long-run identification picks the rotation whose cumulative S&P 500 response to the monetary policy shock is closest to zero.",
            "assumption": "The monetary policy shock should not permanently shift the stock-market series in this simplified example.",
            "variation": "Cumulative impulse response",
            "restriction": "Long-run S&P 500 response to the monetary policy shock near zero",
            "outputLabel": "Best rotation on the grid",
            "badges": ["Point selection", "Best among sampled candidates"],
            "candidateIndices": [],
            "selectedIndex": long_run_index,
            "selectionSummary": f"{format_candidate(long_run_index)} is closest to the long-run zero restriction in the rotation grid.",
            "selectionDetail": "The economic idea becomes a distance-to-zero loss over the 100 admissible rotations.",
            "diagnostics": [
                {"label": "Selected candidate", "value": format_candidate(long_run_index)},
                {"label": "Cumulative response", "value": format_metric(selected_diag(long_run_index)["longRunSp500OnRate"], 4)},
                {"label": "Criterion", "value": "Minimize absolute sum"},
                {"label": "Output", "value": "Single rotation"},
            ],
            "comparisonOutput": "Point estimate",
        },
        {
            "id": "proxy",
            "label": "Proxy",
            "family": "External/state variation",
            "familyKey": "external",
            "selectorType": "Point selection",
            "selectionMode": "point",
            "formulaLabel": "corr(ε_non-target, z_proxy) ≈ 0",
            "summary": "Proxy identification picks the rotation whose non-target shock is closest to orthogonal to an external high-frequency monetary proxy.",
            "assumption": "The proxy is informative about the monetary policy shock and uncorrelated with the stock-market shock.",
            "variation": "External proxy information",
            "restriction": "Non-target shock orthogonal to the proxy over the overlap sample",
            "outputLabel": "Best rotation on the grid",
            "badges": ["Point selection", "Best among sampled candidates"],
            "candidateIndices": [],
            "selectedIndex": proxy_index,
            "selectionSummary": f"{format_candidate(proxy_index)} minimizes non-target proxy correlation over the overlap sample.",
            "selectionDetail": "The economic idea becomes an orthogonality loss using the external proxy.",
            "diagnostics": [
                {"label": "Selected candidate", "value": format_candidate(proxy_index)},
                {"label": "Proxy correlation", "value": format_metric(selected_diag(proxy_index)["proxyCorrelationNonTarget"], 4)},
                {"label": "Overlap sample", "value": f"{len(proxy_values)} observations"},
                {"label": "Output", "value": "Single rotation"},
            ],
            "comparisonOutput": "Point estimate",
        },
        {
            "id": "max-share",
            "label": "Max-share",
            "family": "Objective-based selectors",
            "familyKey": "objective",
            "selectorType": "Point selection",
            "selectionMode": "point",
            "formulaLabel": "max FEVD(rate <- policy shock)",
            "summary": "Max-share chooses the rotation that gives the monetary policy shock the largest forecast-error variance share in the rate equation.",
            "assumption": "The monetary policy shock should explain as much rate variation as possible.",
            "variation": "Variance-share objective",
            "restriction": "Maximize the policy shock FEVD share for the rate variable",
            "outputLabel": "Best rotation on the grid",
            "badges": ["Point selection", "Best among sampled candidates", "Extension"],
            "candidateIndices": [],
            "selectedIndex": max_share_index,
            "selectionSummary": f"{format_candidate(max_share_index)} delivers the largest rate FEVD share in the rotation grid.",
            "selectionDetail": "This is marked as an extension because it illustrates the same framework with an objective rather than a basic restriction.",
            "diagnostics": [
                {"label": "Selected candidate", "value": format_candidate(max_share_index)},
                {"label": "Rate FEVD share", "value": format_metric(selected_diag(max_share_index)["rateFevdShare"], 4)},
                {"label": "Criterion", "value": "Maximize share"},
                {"label": "Output", "value": "Single rotation"},
            ],
            "comparisonOutput": "Point estimate",
        },
        {
            "id": "independent-shocks",
            "label": "Independent shocks",
            "family": "Objective-based selectors",
            "familyKey": "objective",
            "selectorType": "Point selection",
            "selectionMode": "point",
            "formulaLabel": "E[ε₁²ε₂]² + E[ε₁ε₂²]²",
            "summary": "Independent-shocks identification goes beyond zero covariance and picks the rotation with the smallest third-order cross-moment objective.",
            "assumption": "Structural shocks should be statistically independent, not merely uncorrelated.",
            "variation": "Higher-order cross moments",
            "restriction": "Minimize third-order dependence between the recovered shocks",
            "outputLabel": "Best rotation on the grid",
            "badges": ["Point selection", "Best among sampled candidates"],
            "candidateIndices": [],
            "selectedIndex": independence_index,
            "selectionSummary": f"{format_candidate(independence_index)} minimizes the independence score on the rotation grid.",
            "selectionDetail": "The economic/statistical idea becomes a loss based on higher-order co-moments.",
            "diagnostics": [
                {"label": "Selected candidate", "value": format_candidate(independence_index)},
                {"label": "Independence score", "value": format_metric(selected_diag(independence_index)["independenceScore"], 6)},
                {"label": "Criterion", "value": "Minimize co-moments"},
                {"label": "Output", "value": "Single rotation"},
            ],
            "comparisonOutput": "Point estimate",
        },
        {
            "id": "heteroskedasticity",
            "label": "Heteroskedasticity",
            "family": "External/state variation",
            "familyKey": "external",
            "selectorType": "Point selection",
            "selectionMode": "point",
            "formulaLabel": "cov_early(ε₁,ε₂)² + cov_late(ε₁,ε₂)²",
            "summary": "Heteroskedastic identification splits the sample in two and chooses the rotation with the smallest within-regime cross-covariances.",
            "assumption": "Shock variances can change across periods while the structural orientation stays fixed.",
            "variation": "Regime-dependent volatility",
            "restriction": "Cross-covariances vanish separately before and after the sample midpoint",
            "outputLabel": "Best rotation on the grid",
            "badges": ["Point selection", "Best among sampled candidates"],
            "candidateIndices": [],
            "selectedIndex": hetero_index,
            "selectionSummary": f"{format_candidate(hetero_index)} best matches separate zero-covariance conditions across the two halves of the sample.",
            "selectionDetail": "The economic idea becomes a two-state covariance loss on the same recovered shocks.",
            "diagnostics": [
                {"label": "Selected candidate", "value": format_candidate(hetero_index)},
                {"label": "State score", "value": format_metric(selected_diag(hetero_index)["regimeCovarianceScore"], 6)},
                {"label": "State split", "value": "Midpoint of sample"},
                {"label": "Output", "value": "Single rotation"},
            ],
            "comparisonOutput": "Point estimate",
        },
    ]

    def dump(obj, pretty: bool = False) -> str:
        obj = sanitize_public_object(obj)
        if pretty:
            return json.dumps(obj, indent=2)
        return json.dumps(obj, separators=(",", ":"))

    module = "\n\n".join(
        [
            f"export const runMeta = {dump(run_meta, pretty=True)};",
            f"export const setupData = {dump(setup_data)};",
            f"export const candidates = {dump(candidates)};",
            f"export const methods = {dump(methods, pretty=True)};",
            f"export const methodObjectives = {dump(method_objectives)};",
            "",
        ]
    )
    OUT.write_text(module, encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT.parent)}")
    print(f"Residual observations: {len(u)}")
    print(f"Proxy overlap: {len(proxy_values)}")
    print(f"Candidates: {len(candidates)}")


if __name__ == "__main__":
    main()
