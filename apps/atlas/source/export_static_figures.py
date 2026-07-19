from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


ATLAS_ROOT = Path(__file__).resolve().parents[1]
DATA_MODULE = ATLAS_ROOT / "js" / "data" / "identification-atlas-data.js"
OUT_DIR = ATLAS_ROOT / "exports" / "static-figures"

METHOD_ORDER = [
    "recursive",
    "sign",
    "narrative",
    "long-run",
    "proxy",
    "max-share",
    "independent-shocks",
    "heteroskedasticity",
]

METHOD_LABELS = {
    "recursive": "Recursive",
    "sign": "Sign",
    "narrative": "Narrative",
    "long-run": "Long-run",
    "proxy": "Proxy",
    "max-share": "Max-share",
    "independent-shocks": "Independent shocks",
    "heteroskedasticity": "Heteroskedasticity",
}

POINT_METHODS = ["recursive", "long-run", "proxy", "max-share", "independent-shocks", "heteroskedasticity"]
SET_METHODS = ["sign", "narrative"]
COLORS = {
    "recursive": "#2563eb",
    "long-run": "#7c3aed",
    "proxy": "#0891b2",
    "max-share": "#f97316",
    "independent-shocks": "#16a34a",
    "heteroskedasticity": "#dc2626",
    "sign": "#0f766e",
    "narrative": "#be123c",
}


def extract_js_value(text: str, name: str):
    marker = f"export const {name} = "
    start = text.index(marker) + len(marker)
    opener = text[start]
    closer = "]" if opener == "[" else "}"
    depth = 0
    in_string = False
    escaped = False
    for pos in range(start, len(text)):
        char = text[pos]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return json.loads(text[start : pos + 1])
    raise ValueError(f"Could not parse {name}")


def load_data():
    text = DATA_MODULE.read_text(encoding="utf-8")
    return {
        "runMeta": extract_js_value(text, "runMeta"),
        "candidates": extract_js_value(text, "candidates"),
        "methods": extract_js_value(text, "methods"),
        "methodObjectives": extract_js_value(text, "methodObjectives"),
    }


def normalize(values):
    values = np.asarray(values, dtype=float)
    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return values
    low = float(np.min(finite))
    high = float(np.max(finite))
    if high == low:
        return np.zeros_like(values)
    return (values - low) / (high - low)


def style_axis(ax, title: str, ylabel: str):
    ax.set_title(title, loc="left", fontsize=13, fontweight="bold")
    ax.set_xlabel("Rotation angle in degrees")
    ax.set_ylabel(ylabel)
    ax.grid(True, color="#e5e7eb", linewidth=0.8)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)


def save(fig, name: str, caption: str, outputs: list[dict[str, str]]):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / name
    fig.tight_layout()
    fig.savefig(path, dpi=180, bbox_inches="tight")
    plt.close(fig)
    outputs.append({"file": name, "path": str(path.relative_to(ATLAS_ROOT)).replace("\\", "/"), "caption": caption})


def mark_selected(ax, angles, y_values, objective, color):
    selected = objective.get("selectedIndex")
    if selected is None:
        return
    ax.scatter([angles[selected]], [y_values[selected]], color=color, edgecolor="white", s=70, zorder=5)
    ax.axvline(angles[selected], color=color, linewidth=1.1, alpha=0.35)


def plot_method_recursive(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["recursive"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    values = np.array([candidate["impactMatrix"][0][1] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, values, color=COLORS["recursive"], linewidth=2.1)
    ax.axhline(0, color="#64748b", linewidth=1.0)
    mark_selected(ax, angles, values, objective, COLORS["recursive"])
    style_axis(ax, "Recursive: rotate until the forbidden impact is zero", r"$b_{12}(\theta)$")
    save(
        fig,
        "fig_atlas_method_recursive.png",
        "Recursive identification selects the rotation where the forbidden short-run impact entry is closest to zero.",
        outputs,
    )


def plot_method_sign(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["sign"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    values = np.array([candidate["impactMatrix"][1][0] for candidate in candidates], dtype=float)
    accepted = np.asarray(objective["accepted"], dtype=bool)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.scatter(angles[~accepted], values[~accepted], color="#cbd5e1", s=24, label="Rejected")
    ax.scatter(angles[accepted], values[accepted], color=COLORS["sign"], s=34, label="Accepted")
    ax.axhline(0, color="#64748b", linewidth=1.0)
    style_axis(ax, "Sign: keep rotations with the required impact sign", r"$b_{21}(\theta)$")
    ax.legend(frameon=False, fontsize=8.5)
    save(
        fig,
        "fig_atlas_method_sign.png",
        "Sign restrictions filter the rotation cloud: negative impact responses are accepted, positive ones rejected.",
        outputs,
    )


def plot_method_narrative(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["narrative"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    shocks = np.array([candidate["helpers"]["narrativeShock"] for candidate in candidates], dtype=float)
    accepted = np.asarray(objective["accepted"], dtype=bool)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, shocks[:, 0], color=COLORS["recursive"], linewidth=1.8, label="Policy shock")
    ax.plot(angles, shocks[:, 1], color=COLORS["narrative"], linewidth=1.8, label="Stock shock")
    ax.scatter(angles[accepted], shocks[accepted, 1], color=COLORS["narrative"], s=26, alpha=0.9, label="Accepted stock-shock rotations")
    ax.axhline(0, color="#64748b", linewidth=1.0)
    style_axis(ax, "Narrative: rotate recovered shocks at October 2008", "Recovered shock")
    ax.legend(frameon=False, fontsize=8.5)
    save(
        fig,
        "fig_atlas_method_narrative.png",
        "Narrative restrictions filter rotations by the recovered structural shocks in a dated historical episode.",
        outputs,
    )


def plot_method_long_run(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["long-run"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    values = np.array([candidate["diagnostics"]["longRunSp500OnRate"] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, values, color=COLORS["long-run"], linewidth=2.1)
    ax.axhline(0, color="#64748b", linewidth=1.0)
    mark_selected(ax, angles, values, objective, COLORS["long-run"])
    style_axis(ax, "Long-run: select the smallest cumulative response", "Cumulative response")
    save(
        fig,
        "fig_atlas_method_long_run.png",
        "Long-run identification selects the rotation whose cumulative response is closest to the neutrality target.",
        outputs,
    )


def plot_method_proxy(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["proxy"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    values = np.abs(np.array([candidate["diagnostics"]["proxyCorrelationNonTarget"] for candidate in candidates], dtype=float))
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, values, color=COLORS["proxy"], linewidth=2.1)
    mark_selected(ax, angles, values, objective, COLORS["proxy"])
    style_axis(ax, "Proxy: orient shocks by external-instrument orthogonality", r"$|\operatorname{corr}(e_{\mathrm{non-target}}, z)|$")
    save(
        fig,
        "fig_atlas_method_proxy.png",
        "Proxy identification selects the rotation where the proxy is closest to orthogonal to the non-target recovered shock.",
        outputs,
    )


def plot_method_max_share(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["max-share"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    values = np.array([candidate["diagnostics"]["rateFevdShare"] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, values, color=COLORS["max-share"], linewidth=2.1)
    mark_selected(ax, angles, values, objective, COLORS["max-share"])
    style_axis(ax, "Max-share: maximize the target FEVD share", "Rate FEVD share")
    save(
        fig,
        "fig_atlas_method_max_share.png",
        "Max-share selection chooses the rotation where the target shock explains the largest rate forecast-error variance share.",
        outputs,
    )


def plot_method_independent_shocks(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["independent-shocks"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    values = np.array([candidate["diagnostics"]["independenceScore"] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, values, color=COLORS["independent-shocks"], linewidth=2.1)
    mark_selected(ax, angles, values, objective, COLORS["independent-shocks"])
    style_axis(ax, "Independent shocks: minimize higher-order dependence", "Cross-moment score")
    save(
        fig,
        "fig_atlas_method_independent_shocks.png",
        "Independent-shocks identification asks for more than zero covariance by minimizing a higher-order dependence score.",
        outputs,
    )


def plot_method_heteroskedasticity(data, outputs):
    candidates = data["candidates"]
    objective = data["methodObjectives"]["heteroskedasticity"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    covariances = np.array([candidate["diagnostics"]["regimeCovariances"] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(8.2, 4.5))
    ax.plot(angles, covariances[:, 0], color=COLORS["recursive"], linewidth=1.8, label="Early regime covariance")
    ax.plot(angles, covariances[:, 1], color=COLORS["heteroskedasticity"], linewidth=1.8, label="Late regime covariance")
    ax.axhline(0, color="#64748b", linewidth=1.0)
    selected = objective.get("selectedIndex")
    if selected is not None:
        ax.scatter([angles[selected]], [covariances[selected, 0]], color=COLORS["recursive"], edgecolor="white", s=60, zorder=5)
        ax.scatter([angles[selected]], [covariances[selected, 1]], color=COLORS["heteroskedasticity"], edgecolor="white", s=60, zorder=5)
        ax.axvline(angles[selected], color=COLORS["heteroskedasticity"], linewidth=1.1, alpha=0.35)
    style_axis(ax, "Heteroskedasticity: make shocks orthogonal in both regimes", "Regime covariance")
    ax.legend(frameon=False, fontsize=8.5)
    save(
        fig,
        "fig_atlas_method_heteroskedasticity.png",
        "Heteroskedasticity-based identification selects the rotation that best diagonalizes recovered shocks across volatility regimes.",
        outputs,
    )


def plot_method_figures(data, outputs):
    plot_method_recursive(data, outputs)
    plot_method_sign(data, outputs)
    plot_method_narrative(data, outputs)
    plot_method_long_run(data, outputs)
    plot_method_proxy(data, outputs)
    plot_method_max_share(data, outputs)
    plot_method_independent_shocks(data, outputs)
    plot_method_heteroskedasticity(data, outputs)


def plot_objectives(data, outputs):
    candidates = data["candidates"]
    objectives = data["methodObjectives"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(10, 5.2))
    for method_id in POINT_METHODS:
        objective = objectives[method_id]
        values = normalize(objective["values"])
        ax.plot(angles, values, label=METHOD_LABELS[method_id], color=COLORS[method_id], linewidth=1.8)
        selected = objective.get("selectedIndex")
        if selected is not None:
            ax.scatter([angles[selected]], [values[selected]], color=COLORS[method_id], edgecolor="white", s=55, zorder=5)
    style_axis(ax, "Point selectors over the same Atlas rotation grid", "Normalized loss or objective")
    ax.legend(ncol=2, fontsize=8.5, frameon=False)
    save(
        fig,
        "fig_atlas_point_objectives.png",
        "Point-identification cards translated into normalized objectives over the same 100-rotation Atlas grid.",
        outputs,
    )


def plot_sets(data, outputs):
    candidates = data["candidates"]
    objectives = data["methodObjectives"]
    angles = np.array([candidate["angleDegrees"] for candidate in candidates], dtype=float)
    fig, ax = plt.subplots(figsize=(10, 3.8))
    rows = {"sign": 1, "narrative": 0}
    for method_id in SET_METHODS:
        accepted = np.asarray(objectives[method_id]["accepted"], dtype=bool)
        y = np.full_like(angles, rows[method_id], dtype=float)
        ax.scatter(angles[~accepted], y[~accepted], color="#cbd5e1", s=18, label=f"{METHOD_LABELS[method_id]} rejected")
        ax.scatter(angles[accepted], y[accepted], color=COLORS[method_id], s=34, label=f"{METHOD_LABELS[method_id]} accepted")
    ax.set_yticks([0, 1], ["Narrative", "Sign"])
    ax.set_ylim(-0.6, 1.6)
    style_axis(ax, "Set restrictions keep rotations instead of selecting one", "Restriction")
    ax.legend(ncol=2, fontsize=8.5, frameon=False)
    save(
        fig,
        "fig_atlas_set_restrictions.png",
        "Sign and narrative restrictions shown as accepted and rejected rotations on the same Atlas grid.",
        outputs,
    )


def plot_irf_cloud(data, outputs):
    candidates = data["candidates"]
    objectives = data["methodObjectives"]
    horizons = np.arange(len(candidates[0]["irfs"]["sp500OnRate"]))
    fig, ax = plt.subplots(figsize=(9, 5.2))
    for candidate in candidates:
        ax.plot(horizons, candidate["irfs"]["sp500OnRate"], color="#cbd5e1", linewidth=0.7, alpha=0.45)
    for method_id in ["recursive", "proxy", "independent-shocks", "heteroskedasticity"]:
        selected = objectives[method_id]["selectedIndex"]
        ax.plot(
            horizons,
            candidates[selected]["irfs"]["sp500OnRate"],
            color=COLORS[method_id],
            linewidth=2.2,
            label=METHOD_LABELS[method_id],
        )
    sign_accepted = np.asarray(objectives["sign"]["accepted"], dtype=bool)
    if sign_accepted.any():
        accepted_paths = np.asarray([candidates[i]["irfs"]["sp500OnRate"] for i, ok in enumerate(sign_accepted) if ok], dtype=float)
        ax.fill_between(
            horizons,
            np.min(accepted_paths, axis=0),
            np.max(accepted_paths, axis=0),
            color=COLORS["sign"],
            alpha=0.13,
            label="Sign accepted range",
        )
    ax.axhline(0, color="#64748b", linewidth=0.9)
    ax.set_title("IRF consequences of different rotation choices", loc="left", fontsize=13, fontweight="bold")
    ax.set_xlabel("Horizon")
    ax.set_ylabel("S&P 500 response to policy shock")
    ax.grid(True, color="#e5e7eb", linewidth=0.8)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.legend(fontsize=8.5, frameon=False)
    save(
        fig,
        "fig_atlas_irf_cloud.png",
        "All Atlas rotations form an IRF cloud; selected methods and the sign-restricted range show how identification choices propagate into responses.",
        outputs,
    )


def write_manifest(outputs, data):
    manifest = {
        "source": str(DATA_MODULE.relative_to(ATLAS_ROOT)).replace("\\", "/"),
        "sample": data["runMeta"]["sampleWindow"],
        "candidate_count": data["runMeta"]["candidateCount"],
        "figures": outputs,
    }
    path = OUT_DIR / "manifest.json"
    path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main():
    data = load_data()
    outputs = []
    plot_objectives(data, outputs)
    plot_sets(data, outputs)
    plot_irf_cloud(data, outputs)
    plot_method_figures(data, outputs)
    write_manifest(outputs, data)
    for item in outputs:
        print(item["path"])


if __name__ == "__main__":
    main()
