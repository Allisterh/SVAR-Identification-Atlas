const cleanupMap = new WeakMap();
const plainTextCache = new Map();

export function theme(name, fallback) {
  return (getComputedStyle(document.documentElement).getPropertyValue(name) || fallback).trim();
}

export function rgba(hex, alpha) {
  const color = String(hex ?? '').trim();
  const rgbMatch = color.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }
  if (!color.startsWith('#')) {
    return color;
  }
  const normalized = color.replace('#', '');
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

function plainCanvasText(value) {
  const source = String(value ?? '');
  if (!/[<&]/.test(source)) {
    return source;
  }
  if (plainTextCache.has(source)) {
    return plainTextCache.get(source);
  }
  const decoder = document.createElement('span');
  decoder.innerHTML = source;
  const text = decoder.textContent ?? source;
  plainTextCache.set(source, text);
  return text;
}

function wrapCanvasText(ctx, text, maxWidth, maxLines = 2) {
  const words = plainCanvasText(text).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const lines = [];
  let current = words.shift();
  while (words.length > 0) {
    const next = words[0];
    if (ctx.measureText(`${current} ${next}`).width <= maxWidth) {
      current += ` ${words.shift()}`;
      continue;
    }
    lines.push(current);
    current = words.shift();
    if (lines.length === maxLines - 1) {
      current += words.length ? ` ${words.join(' ')}` : '';
      words.length = 0;
    }
  }
  lines.push(current);

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }
  const lastIndex = lines.length - 1;
  if (ctx.measureText(lines[lastIndex]).width > maxWidth) {
    let clipped = lines[lastIndex];
    while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    lines[lastIndex] = `${clipped.trimEnd()}…`;
  }
  return lines;
}

function drawCanvasTextBlock(ctx, text, { x, y, maxWidth, lineHeight, maxLines = 2 }) {
  const lines = wrapCanvasText(ctx, text, maxWidth, maxLines);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return lines.length ? y + (lines.length - 1) * lineHeight : y;
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
  if (abs < 5e-7) {
    return '0';
  }
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
  const grid = theme('--chart-grid', 'rgba(15, 35, 62, 0.09)');
  const gridVertical = theme('--chart-grid-vertical', 'rgba(15, 35, 62, 0.06)');
  const axis = theme('--chart-axis', 'rgba(15, 35, 62, 0.38)');
  const plotBackground = theme('--chart-plot-bg', 'rgba(248, 251, 255, 0.68)');
  const compact = width < 480;
  const left = compact ? 54 : 62;
  const right = width - (compact ? 14 : 22);
  const bottom = height - (compact ? 44 : 50);
  const headerMaxWidth = width - (compact ? 24 : 32);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = text;
  ctx.font = canvasFont(compact ? 14 : 15, 800);
  let headerBottom = drawCanvasTextBlock(ctx, config.title, {
    x: compact ? 12 : 16,
    y: 23,
    maxWidth: headerMaxWidth,
    lineHeight: compact ? 16 : 18,
    maxLines: 2,
  });

  if (config.subtitle) {
    ctx.fillStyle = muted;
    ctx.font = canvasFont(compact ? 10.5 : 11, 500);
    headerBottom = drawCanvasTextBlock(ctx, config.subtitle, {
      x: compact ? 12 : 16,
      y: headerBottom + (compact ? 16 : 19),
      maxWidth: headerMaxWidth,
      lineHeight: compact ? 14 : 15,
      maxLines: 2,
    });
  }

  if (config.legendItems?.length) {
    headerBottom = drawLegend(ctx, config.legendItems, {
      left,
      right,
      y: headerBottom + (compact ? 16 : 18),
      compact,
    });
  }

  const requestedTop = Math.max(compact ? 66 : 70, headerBottom + (compact ? 22 : 24));
  const plot = {
    left,
    right,
    top: Math.min(requestedTop, bottom - 74),
    bottom,
  };

  ctx.fillStyle = plotBackground;
  ctx.fillRect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let index = 0; index <= 4; index += 1) {
    const y = plot.top + ((plot.bottom - plot.top) * index) / 4;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.right, y);
    ctx.stroke();
  }
  ctx.strokeStyle = gridVertical;
  for (let index = 0; index <= 4; index += 1) {
    const x = plot.left + ((plot.right - plot.left) * index) / 4;
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();
  }

  ctx.strokeStyle = axis;
  ctx.beginPath();
  ctx.moveTo(plot.left, plot.top);
  ctx.lineTo(plot.left, plot.bottom);
  ctx.lineTo(plot.right, plot.bottom);
  ctx.stroke();

  ctx.fillStyle = muted;
  ctx.font = canvasFont(compact ? 10 : 10.5, 700);
  const yLabel = plainCanvasText(config.yLabel);
  const xLabel = plainCanvasText(config.xLabel);
  ctx.fillText(yLabel, plot.left, plot.top - 9);
  ctx.fillText(xLabel, plot.right - ctx.measureText(xLabel).width, height - 14);

  return plot;
}

function drawLegend(ctx, series, bounds) {
  let x = bounds.left;
  let y = bounds.y;
  const rowHeight = bounds.compact ? 16 : 18;
  series.forEach((item) => {
    const label = plainCanvasText(item.label);
    ctx.font = canvasFont(bounds.compact ? 10 : 10.5, 650);
    const itemWidth = 34 + ctx.measureText(label).width + 18;
    if (x > bounds.left && x + itemWidth > bounds.right) {
      x = bounds.left;
      y += rowHeight;
    }
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x + 22, y - 4);
    ctx.stroke();
    ctx.fillStyle = theme('--muted', '#5b6f8d');
    ctx.fillText(label, x + 29, y);
    x += itemWidth;
  });
  ctx.lineCap = 'butt';
  return y;
}

function drawAxisTicks(ctx, plot, xDomain, yDomain, xTickLabels = null) {
  const muted = theme('--muted', '#5b6f8d');
  ctx.fillStyle = muted;
  ctx.font = canvasFont(10.5, 550);
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

function drawZeroGuides(ctx, plot, xDomain, yDomain, xFor, yFor, { vertical = false, horizontal = true } = {}) {
  ctx.save();
  ctx.strokeStyle = theme('--chart-zero', 'rgba(15, 35, 62, 0.46)');
  ctx.lineWidth = 1.35;
  if (horizontal && yDomain.min <= 0 && yDomain.max >= 0) {
    const y = yFor(0);
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.right, y);
    ctx.stroke();
  }
  if (vertical && xDomain.min <= 0 && xDomain.max >= 0) {
    const x = xFor(0);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.bottom);
    ctx.stroke();
  }
  ctx.restore();
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
  const legendItems = config.showLegend === false || (config.showLegend !== true && config.series.length < 2)
    ? []
    : config.series;
  const plot = drawFrame(ctx, width, height, { ...config, legendItems });
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

  if ((config.forceZeroLine || yDomain.min < 0) && yDomain.min <= 0 && yDomain.max >= 0) {
    drawZeroGuides(ctx, plot, { min: 0, max: maxLength - 1 }, yDomain, xFor, yFor);
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);
  ctx.clip();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  config.series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.width ?? 2.35;
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
  ctx.restore();

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
  drawZeroGuides(ctx, plot, xDomain, yDomain, xFor, yFor, { vertical: true, horizontal: true });

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);
  ctx.clip();
  config.points.forEach((point, index) => {
    ctx.fillStyle = point.color ?? config.pointColor ?? rgba(theme('--text', '#11233d'), 0.32);
    ctx.beginPath();
    ctx.arc(xFor(point.x), yFor(point.y), index === hoverState.index ? 5.2 : config.radius ?? 2.35, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

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

  const drawSeries = (series, stroke, width = 1, alpha = 1, dash = []) => {
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(dash);
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
    ctx.restore();
  };

  const baselines = (config.baseline ?? [])
    .filter((item) => item.active !== false && Array.isArray(item.series));

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);
  ctx.clip();

  // Keep every rotation tied to the exact color used in the criterion plot.
  // A single aggregate ribbon would erase the accept/reject or loss-gradient encoding.
  baselines.forEach((item) => {
    drawSeries(item.series, item.color, item.width ?? 0.8, item.alpha ?? 1, item.dash ?? []);
  });

  drawZeroGuides(ctx, plot, { min: 0, max: spec.horizons - 1 }, domain, xFor, yFor);

  (config.highlight ?? []).forEach((item) => {
    const width = item.width ?? 3;
    drawSeries(item.series, '#ffffff', width + 2.6, 0.92);
    drawSeries(item.series, item.color, width, 1);
  });
  ctx.restore();

  (config.highlight ?? []).forEach((item) => {
    const initial = item.series?.[0];
    if (!Number.isFinite(initial)) {
      return;
    }
    ctx.fillStyle = item.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xFor(0), yFor(initial), 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

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
  if (Number.isFinite(config.min) && config.min >= 0) {
    yDomain.min = 0;
  }
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
  drawZeroGuides(
    ctx,
    plot,
    { min: 0, max: config.values.length - 1 },
    yDomain,
    xFor,
    yFor
  );

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);
  ctx.clip();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let index = 0; index < config.values.length - 1; index += 1) {
    ctx.strokeStyle = objectiveColor(config.values[index], config.min, config.max, config.accepted?.[index]);
    ctx.lineWidth = 2.55;
    ctx.beginPath();
    ctx.moveTo(xFor(index), yFor(config.values[index]));
    ctx.lineTo(xFor(index + 1), yFor(config.values[index + 1]));
    ctx.stroke();
  }
  ctx.restore();

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
    ctx.font = canvasFont(10.5, 800);
    ctx.textAlign = x > plot.left + (plot.right - plot.left) * 0.72 ? 'right' : 'left';
    ctx.fillText(config.currentLabel ?? 'current rotation', x + (ctx.textAlign === 'right' ? -6 : 6), plot.top + 14);
    ctx.restore();
  }

  const markers = [
    { index: config.selectedIndex, color: theme('--success', '#14b8a6'), label: 'selected' },
    { index: config.currentIndex, color: theme('--accent-warm', '#f97316'), label: 'current' },
  ].filter((item) => Number.isInteger(item.index));

  markers.forEach((marker) => {
    const x = xFor(marker.index);
    const y = yFor(config.values[marker.index]);
    const sameSelection = config.selectedIndex === config.currentIndex;
    const radius = marker.label === 'current' && sameSelection ? 4.6 : 6;
    ctx.fillStyle = marker.color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (marker.label === 'selected' && sameSelection) {
      ctx.strokeStyle = marker.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
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

