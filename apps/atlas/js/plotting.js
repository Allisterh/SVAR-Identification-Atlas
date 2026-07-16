const cleanupMap = new WeakMap();

export function theme(name, fallback) {
  return (getComputedStyle(document.documentElement).getPropertyValue(name) || fallback).trim();
}

export function rgba(hex, alpha) {
  if (!hex.startsWith('#')) {
    return hex;
  }
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized;
  const numeric = Number.parseInt(full, 16);
  return `rgba(${(numeric >> 16) & 255}, ${(numeric >> 8) & 255}, ${numeric & 255}, ${alpha})`;
}

export function objectiveColor(value, min, max, accepted = null) {
  if (accepted === true) {
    return 'rgba(20, 184, 166, 0.9)';
  }
  if (accepted === false && value === 0) {
    return 'rgba(20, 184, 166, 0.9)';
  }
  const span = Math.max(max - min, 1e-12);
  const normalized = Math.max(0, Math.min(1, (value - min) / span));
  const hue = 162 - normalized * 150;
  return `hsla(${hue}, 78%, 43%, 0.86)`;
}

export function zScores(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  const mean = clean.reduce((sum, value) => sum + value, 0) / clean.length;
  const variance = clean.reduce((sum, value) => sum + (value - mean) ** 2, 0) / clean.length;
  const sd = Math.sqrt(variance) || 1;
  return values.map((value) => (Number.isFinite(value) ? (value - mean) / sd : null));
}

export function finiteDomain(values, padding = 0.12) {
  const clean = values.flat(Infinity).filter((value) => Number.isFinite(value));
  if (clean.length === 0) {
    return { min: -1, max: 1 };
  }
  let min = Math.min(...clean);
  let max = Math.max(...clean);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const spread = max - min;
  return { min: min - spread * padding, max: max + spread * padding };
}

export function symmetricDomain(values, padding = 0.12) {
  const domain = finiteDomain(values, padding);
  const bound = Math.max(Math.abs(domain.min), Math.abs(domain.max), 1e-6);
  return { min: -bound, max: bound };
}

function canvasFont(size, weight = 400) {
  return `${weight} ${size}px ${theme('--font-body', 'Segoe UI, sans-serif')}`;
}

function setupCanvas(canvas) {
  if (!canvas) {
    return null;
  }
  const rect = canvas.getBoundingClientRect();
  const measuredWidth = rect.width || canvas.clientWidth || 0;
  const width = measuredWidth > 0 ? Math.max(140, measuredWidth) : 320;
  const height = Math.max(220, rect.height || canvas.clientHeight || 260);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function makeTooltip(canvas) {
  const parent = canvas.parentElement;
  if (!parent) {
    return null;
  }
  parent.classList.add('plot-card--interactive');
  let tooltip = parent.querySelector('.plot-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'plot-tooltip';
    parent.appendChild(tooltip);
  }
  return tooltip;
}

function bindCanvas(canvas, handlers) {
  const old = cleanupMap.get(canvas);
  if (old) {
    old();
  }

  const entries = Object.entries(handlers);
  entries.forEach(([eventName, handler]) => canvas.addEventListener(eventName, handler));
  cleanupMap.set(canvas, () => {
    entries.forEach(([eventName, handler]) => canvas.removeEventListener(eventName, handler));
  });
}

function formatTick(value) {
  const abs = Math.abs(value);
  if (abs >= 100) {
    return value.toFixed(0);
  }
  if (abs >= 10) {
    return value.toFixed(1);
  }
  if (abs >= 1) {
    return value.toFixed(2);
  }
  return value.toFixed(3);
}

function drawFrame(ctx, width, height, config) {
  const text = theme('--text', '#11233d');
  const muted = theme('--muted', '#5b6f8d');
  const grid = rgba(theme('--border-strong', '#2a3354'), 0.72);
  const plot = { left: 62, right: width - 22, top: 76, bottom: height - 50 };

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = text;
  ctx.font = canvasFont(14, 700);
  ctx.fillText(config.title, 16, 24);

  if (config.subtitle) {
    ctx.fillStyle = muted;
    ctx.font = canvasFont(11, 400);
    ctx.fillText(config.subtitle, 16, 43);
  }

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let index = 0; index <= 4; index += 1) {
    const y = plot.top + ((plot.bottom - plot.top) * index) / 4;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.right, y);
    ctx.stroke();
  }
  for (let index = 0; index <= 4; index += 1) {
    const x = plot.left + ((plot.right - plot.left) * index) / 4;
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();
  }

  ctx.strokeStyle = rgba(text, 0.5);
  ctx.beginPath();
  ctx.moveTo(plot.left, plot.top);
  ctx.lineTo(plot.left, plot.bottom);
  ctx.lineTo(plot.right, plot.bottom);
  ctx.stroke();

  ctx.fillStyle = muted;
  ctx.font = canvasFont(11, 600);
  ctx.fillText(config.yLabel, 16, plot.top - 10);
  ctx.fillText(config.xLabel, plot.right - ctx.measureText(config.xLabel).width, height - 14);

  return plot;
}

function drawLegend(ctx, series, plot) {
  let x = plot.left;
  const y = 58;
  series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x + 24, y - 4);
    ctx.stroke();
    ctx.fillStyle = theme('--muted', '#5b6f8d');
    ctx.font = canvasFont(11, 500);
    ctx.fillText(item.label, x + 30, y);
    x += 42 + ctx.measureText(item.label).width;
  });
}

function drawAxisTicks(ctx, plot, xDomain, yDomain, xTickLabels = null) {
  const muted = theme('--muted', '#5b6f8d');
  ctx.fillStyle = muted;
  ctx.font = canvasFont(10, 500);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let index = 0; index <= 4; index += 1) {
    const value = yDomain.min + ((yDomain.max - yDomain.min) * (4 - index)) / 4;
    const y = plot.top + ((plot.bottom - plot.top) * index) / 4;
    ctx.fillText(formatTick(value), plot.left - 8, y);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let index = 0; index <= 4; index += 1) {
    const x = plot.left + ((plot.right - plot.left) * index) / 4;
    const label = xTickLabels?.[index] ?? formatTick(xDomain.min + ((xDomain.max - xDomain.min) * index) / 4);
    ctx.fillText(label, x, plot.bottom + 8);
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawLineMarker(ctx, plot, config, marker, xFor, yFor) {
  if (!Number.isInteger(marker.index)) {
    return;
  }
  const color = marker.color ?? theme('--accent-warm', '#f97316');
  const x = xFor(marker.index);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = marker.width ?? 1.8;
  ctx.setLineDash(marker.dash ?? [4, 4]);
  ctx.beginPath();
  ctx.moveTo(x, plot.top);
  ctx.lineTo(x, plot.bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  if (marker.label) {
    ctx.fillStyle = color;
    ctx.font = canvasFont(10, 800);
    ctx.textAlign = marker.index > (config.labels?.length ?? 0) * 0.72 ? 'right' : 'left';
    ctx.fillText(marker.label, x + (ctx.textAlign === 'right' ? -6 : 6), plot.top + 12);
  }

  if (marker.showPoints !== false) {
    config.series.forEach((item) => {
      const value = item.values[marker.index];
      if (!Number.isFinite(value)) {
        return;
      }
      ctx.fillStyle = item.color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, yFor(value), marker.radius ?? 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }
  ctx.restore();
}

function pointInCanvas(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function drawLineChart(canvasId, config, hoverState = { index: null }) {
  const canvas = document.getElementById(canvasId);
  const prepared = setupCanvas(canvas);
  if (!prepared) {
    return;
  }
  const { ctx, width, height } = prepared;
  const plot = drawFrame(ctx, width, height, config);
  const maxLength = Math.max(...config.series.map((item) => item.values.length));
  let yDomain = config.yDomain ?? finiteDomain(config.series.map((item) => item.values), 0.16);
  if (config.includeZero || config.forceZeroLine) {
    yDomain = {
      min: Math.min(yDomain.min, 0),
      max: Math.max(yDomain.max, 0),
    };
    if (yDomain.min === yDomain.max) {
      yDomain = { min: yDomain.min - 1, max: yDomain.max + 1 };
    }
  }
  const xFor = (index) => plot.left + ((plot.right - plot.left) * index) / Math.max(1, maxLength - 1);
  const yFor = (value) => plot.bottom - ((value - yDomain.min) / (yDomain.max - yDomain.min)) * (plot.bottom - plot.top);
  const xLabels = config.xTickLabels ?? [0, 0.25, 0.5, 0.75, 1].map((share) => {
    const idx = Math.min(maxLength - 1, Math.round(share * (maxLength - 1)));
    return config.labels?.[idx] ?? String(idx);
  });

  drawAxisTicks(ctx, plot, { min: 0, max: maxLength - 1 }, yDomain, xLabels);
  drawLegend(ctx, config.series, plot);

  if ((config.forceZeroLine || yDomain.min < 0) && yDomain.min <= 0 && yDomain.max >= 0) {
    const zeroY = yFor(0);
    ctx.strokeStyle = rgba(theme('--text', '#11233d'), 0.22);
    ctx.beginPath();
    ctx.moveTo(plot.left, zeroY);
    ctx.lineTo(plot.right, zeroY);
    ctx.stroke();
  }

  config.series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.width ?? 2;
    ctx.setLineDash(item.dash ?? []);
    ctx.beginPath();
    let started = false;
    item.values.forEach((value, index) => {
      if (!Number.isFinite(value)) {
        started = false;
        return;
      }
      const x = xFor(index);
      const y = yFor(value);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  });

  const markers = [
    ...(config.markers ?? []),
    Number.isInteger(config.currentIndex)
      ? { index: config.currentIndex, label: config.currentLabel ?? 'current rotation', color: theme('--accent-warm', '#f97316') }
      : null,
  ].filter(Boolean);
  markers.forEach((marker) => drawLineMarker(ctx, plot, config, marker, xFor, yFor));

  const tooltip = makeTooltip(canvas);
  if (hoverState.index !== null && hoverState.index >= 0 && hoverState.index < maxLength) {
    const x = xFor(hoverState.index);
    ctx.strokeStyle = rgba(theme('--text', '#11233d'), 0.35);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();

    const rows = config.series
      .map((item) => {
        const value = item.rawValues?.[hoverState.index] ?? item.values[hoverState.index];
        if (!Number.isFinite(value)) {
          return '';
        }
        const y = yFor(item.values[hoverState.index]);
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        return `<span><i style="background:${item.color}"></i>${item.label}: <strong>${formatTick(value)}</strong></span>`;
      })
      .filter(Boolean)
      .join('');
    if (tooltip) {
      tooltip.innerHTML = `<strong>${config.labels?.[hoverState.index] ?? `Index ${hoverState.index}`}</strong>${rows}`;
      tooltip.style.left = `${Math.min(x + 12, width - 190)}px`;
      tooltip.style.top = `${Math.max(plot.top + 6, plot.bottom - 84)}px`;
      tooltip.classList.add('is-visible');
    }
  } else if (tooltip) {
    tooltip.classList.remove('is-visible');
  }

  bindCanvas(canvas, {
    pointermove: (event) => {
      const point = pointInCanvas(canvas, event);
      if (point.x < plot.left || point.x > plot.right || point.y < plot.top || point.y > plot.bottom) {
        hoverState.index = null;
      } else {
        hoverState.index = Math.round(((point.x - plot.left) / (plot.right - plot.left)) * (maxLength - 1));
      }
      drawLineChart(canvasId, config, hoverState);
    },
    pointerleave: () => {
      hoverState.index = null;
      drawLineChart(canvasId, config, hoverState);
    },
  });
}

export function drawScatterChart(canvasId, config, hoverState = { index: null }) {
  const canvas = document.getElementById(canvasId);
  const prepared = setupCanvas(canvas);
  if (!prepared) {
    return;
  }
  const { ctx, width, height } = prepared;
  const plot = drawFrame(ctx, width, height, config);
  const xDomain = config.xDomain ?? symmetricDomain(config.points.map((point) => point.x), 0.12);
  const yDomain = config.yDomain ?? symmetricDomain(config.points.map((point) => point.y), 0.12);
  const xFor = (value) => plot.left + ((value - xDomain.min) / (xDomain.max - xDomain.min)) * (plot.right - plot.left);
  const yFor = (value) => plot.bottom - ((value - yDomain.min) / (yDomain.max - yDomain.min)) * (plot.bottom - plot.top);

  drawAxisTicks(ctx, plot, xDomain, yDomain);

  config.points.forEach((point, index) => {
    ctx.fillStyle = point.color ?? config.pointColor ?? rgba(theme('--text', '#11233d'), 0.32);
    ctx.beginPath();
    ctx.arc(xFor(point.x), yFor(point.y), index === hoverState.index ? 5 : config.radius ?? 2.1, 0, Math.PI * 2);
    ctx.fill();
  });

  const tooltip = makeTooltip(canvas);
  if (hoverState.index !== null) {
    const point = config.points[hoverState.index];
    const x = xFor(point.x);
    const y = yFor(point.y);
    ctx.strokeStyle = rgba(theme('--text', '#11233d'), 0.3);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.right, y);
    ctx.stroke();
    if (tooltip) {
      tooltip.innerHTML = `<strong>${point.label ?? point.date ?? `Point ${hoverState.index}`}</strong><span>x: <strong>${formatTick(point.x)}</strong></span><span>y: <strong>${formatTick(point.y)}</strong></span>`;
      tooltip.style.left = `${Math.min(x + 12, width - 170)}px`;
      tooltip.style.top = `${Math.max(plot.top + 6, y - 44)}px`;
      tooltip.classList.add('is-visible');
    }
  } else if (tooltip) {
    tooltip.classList.remove('is-visible');
  }

  bindCanvas(canvas, {
    pointermove: (event) => {
      const pointer = pointInCanvas(canvas, event);
      let best = null;
      let bestDistance = 18;
      config.points.forEach((point, index) => {
        const dx = xFor(point.x) - pointer.x;
        const dy = yFor(point.y) - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      hoverState.index = best;
      drawScatterChart(canvasId, config, hoverState);
    },
    pointerleave: () => {
      hoverState.index = null;
      drawScatterChart(canvasId, config, hoverState);
    },
  });
}

export function drawIrfCloud(canvasId, spec, config) {
  const canvas = document.getElementById(canvasId);
  const prepared = setupCanvas(canvas);
  if (!prepared) {
    return;
  }
  const { ctx, width } = prepared;
  const hoverState = canvas.__irfHover ?? { index: null };
  canvas.__irfHover = hoverState;
  const plot = drawFrame(ctx, prepared.width, prepared.height, {
    title: spec.title,
    subtitle: config.subtitle,
    xLabel: 'Horizon',
    yLabel: spec.yLabel,
  });
  const domain = config.yDomain;
  const xFor = (index) => plot.left + ((plot.right - plot.left) * index) / Math.max(1, spec.horizons - 1);
  const yFor = (value) => plot.bottom - ((value - domain.min) / (domain.max - domain.min)) * (plot.bottom - plot.top);
  drawAxisTicks(ctx, plot, { min: 0, max: spec.horizons - 1 }, domain, ['0', '6', '12', '18', String(spec.horizons - 1)]);

  const drawSeries = (series, stroke, width = 1) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();
    series.forEach((value, index) => {
      const x = xFor(index);
      const y = yFor(value);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  (config.baseline ?? []).forEach((item) => drawSeries(item.series, item.color, item.width ?? 0.8));
  (config.highlight ?? []).forEach((item) => drawSeries(item.series, item.color, item.width ?? 3));

  const tooltip = makeTooltip(canvas);
  if (hoverState.index !== null && hoverState.index >= 0 && hoverState.index < spec.horizons) {
    const x = xFor(hoverState.index);
    ctx.strokeStyle = rgba(theme('--text', '#11233d'), 0.3);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();

    const rows = (config.highlight ?? []).slice(0, 3).map((item, seriesIndex) => {
      const y = yFor(item.series[hoverState.index]);
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      return `<span><i style="background:${item.color}"></i>${item.label ?? `series ${seriesIndex + 1}`}: <strong>${formatTick(item.series[hoverState.index])}</strong></span>`;
    }).join('');

    if (tooltip) {
      tooltip.innerHTML = `<strong>Horizon ${hoverState.index}</strong>${rows}`;
      tooltip.style.left = `${Math.min(x + 12, width - 190)}px`;
      tooltip.style.top = `${Math.max(plot.top + 6, plot.bottom - 78)}px`;
      tooltip.classList.add('is-visible');
    }
  } else if (tooltip) {
    tooltip.classList.remove('is-visible');
  }

  bindCanvas(canvas, {
    pointermove: (event) => {
      const point = pointInCanvas(canvas, event);
      if (point.x < plot.left || point.x > plot.right || point.y < plot.top || point.y > plot.bottom) {
        hoverState.index = null;
      } else {
        hoverState.index = Math.round(((point.x - plot.left) / (plot.right - plot.left)) * (spec.horizons - 1));
      }
      drawIrfCloud(canvasId, spec, config);
    },
    pointerleave: () => {
      hoverState.index = null;
      drawIrfCloud(canvasId, spec, config);
    },
  });
}

export function drawObjectiveChart(canvasId, config, hoverState = { index: null }) {
  const canvas = document.getElementById(canvasId);
  const prepared = setupCanvas(canvas);
  if (!prepared) {
    return;
  }
  const { ctx, width } = prepared;
  const yDomain = finiteDomain(config.values, 0.12);
  const plot = drawFrame(ctx, prepared.width, prepared.height, {
    title: config.title,
    subtitle: config.subtitle,
    xLabel: 'Rotation angle',
    yLabel: config.yLabel ?? 'Loss',
  });
  const xFor = (index) => plot.left + ((plot.right - plot.left) * index) / Math.max(1, config.values.length - 1);
  const yFor = (value) => plot.bottom - ((value - yDomain.min) / (yDomain.max - yDomain.min)) * (plot.bottom - plot.top);
  const xLabels = config.xTickLabels ?? [0, 0.25, 0.5, 0.75, 1].map((share) => {
    const idx = Math.min(config.values.length - 1, Math.round(share * (config.values.length - 1)));
    return config.labels?.[idx] ?? String(idx);
  });
  drawAxisTicks(ctx, plot, { min: 0, max: config.values.length - 1 }, yDomain, xLabels);

  for (let index = 0; index < config.values.length - 1; index += 1) {
    ctx.strokeStyle = objectiveColor(config.values[index], config.min, config.max, config.accepted?.[index]);
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(xFor(index), yFor(config.values[index]));
    ctx.lineTo(xFor(index + 1), yFor(config.values[index + 1]));
    ctx.stroke();
  }

  if (Number.isInteger(config.currentIndex)) {
    const x = xFor(config.currentIndex);
    ctx.save();
    ctx.strokeStyle = theme('--accent-warm', '#f97316');
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = theme('--accent-warm', '#f97316');
    ctx.font = '700 11px sans-serif';
    ctx.fillText(config.currentLabel ?? 'current rotation', Math.min(x + 6, plot.right - 92), plot.top + 13);
    ctx.restore();
  }

  const markers = [
    { index: config.selectedIndex, color: theme('--success', '#14b8a6'), label: 'selected' },
    { index: config.currentIndex, color: theme('--accent-warm', '#f97316'), label: 'current' },
  ].filter((item) => Number.isInteger(item.index));

  markers.forEach((marker) => {
    const x = xFor(marker.index);
    const y = yFor(config.values[marker.index]);
    ctx.fillStyle = marker.color;
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  const tooltip = makeTooltip(canvas);
  if (hoverState.index !== null) {
    const x = xFor(hoverState.index);
    const y = yFor(config.values[hoverState.index]);
    ctx.strokeStyle = rgba(theme('--text', '#11233d'), 0.3);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();
    if (tooltip) {
      tooltip.innerHTML = `<strong>Candidate ${String(hoverState.index).padStart(2, '0')}</strong><span>Angle: <strong>${config.labels?.[hoverState.index] ?? `${hoverState.index}`}</strong></span><span>${config.yLabel ?? 'Loss'}: <strong>${formatTick(config.values[hoverState.index])}</strong></span>`;
      tooltip.style.left = `${Math.min(x + 12, width - 190)}px`;
      tooltip.style.top = `${Math.max(plot.top + 6, y - 54)}px`;
      tooltip.classList.add('is-visible');
    }
  } else if (tooltip) {
    tooltip.classList.remove('is-visible');
  }

  bindCanvas(canvas, {
    pointermove: (event) => {
      const point = pointInCanvas(canvas, event);
      if (point.x < plot.left || point.x > plot.right || point.y < plot.top || point.y > plot.bottom) {
        hoverState.index = null;
      } else {
        hoverState.index = Math.round(((point.x - plot.left) / (plot.right - plot.left)) * (config.values.length - 1));
      }
      drawObjectiveChart(canvasId, config, hoverState);
    },
    pointerleave: () => {
      hoverState.index = null;
      drawObjectiveChart(canvasId, config, hoverState);
    },
  });
}

