import { finiteDomain, rgba, theme, zScores } from './plotting.js?v=20260831-figure-system3';

const DEFAULT_MINIMUM_MS = 3000;
const REDUCED_MOTION_MINIMUM_MS = 360;
const FINISH_DURATION_MS = 520;
const FINISH_HOLD_MS = 180;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value) {
  const t = clamp(value);
  return 1 - (1 - t) ** 3;
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function roundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }

  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function setupCanvas(canvas) {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(320, bounds.width || canvas.clientWidth || 720);
  const height = Math.max(180, bounds.height || canvas.clientHeight || 260);
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { ctx, width, height };
}

function prepareLoaderSeries(timeSeries) {
  const rows = Array.isArray(timeSeries) ? timeSeries : [];
  const labels = rows.map((row) => row.date);
  const rate = zScores(rows.map((row) => row.rate));
  const sp500 = zScores(rows.map((row) => row.sp500));
  const domain = finiteDomain([rate, sp500], 0.18);

  return {
    labels,
    series: [
      {
        label: 'Interest rate',
        values: rate,
        color: theme('--accent-strong', '#0369a1'),
      },
      {
        label: 'S&P 500',
        values: sp500,
        color: theme('--accent-warm', '#f97316'),
      },
    ],
    domain,
  };
}

function drawGrid(ctx, bounds, domain, labels) {
  const { left, top, width, height } = bounds;
  const text = theme('--muted', '#5b6f8d');
  const grid = rgba(theme('--text', '#11233d'), 0.08);
  const axis = rgba(theme('--text', '#11233d'), 0.22);
  const fontBody = theme('--font-body', 'Segoe UI, sans-serif');

  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = grid;
  ctx.fillStyle = text;
  ctx.font = `600 11px ${fontBody}`;
  ctx.textBaseline = 'middle';

  const yTicks = [domain.max, 0, domain.min];
  yTicks.forEach((tick) => {
    const y = top + ((domain.max - tick) / (domain.max - domain.min || 1)) * height;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + width, y);
    ctx.stroke();
    ctx.fillText(tick.toFixed(1), 12, y);
  });

  const xTicks = [0, 0.5, 1];
  xTicks.forEach((tick) => {
    const x = left + tick * width;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + height);
    ctx.stroke();
  });

  ctx.strokeStyle = axis;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, top + height);
  ctx.lineTo(left + width, top + height);
  ctx.stroke();

  ctx.fillStyle = text;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(labels[0] ?? '', left, top + height + 12);
  ctx.textAlign = 'center';
  ctx.fillText(labels[Math.floor((labels.length - 1) / 2)] ?? '', left + width / 2, top + height + 12);
  ctx.textAlign = 'right';
  ctx.fillText(labels.at(-1) ?? '', left + width, top + height + 12);
  ctx.restore();
}

function drawSeries(ctx, series, bounds, domain, progress) {
  const cleanValues = series.values;
  if (cleanValues.length < 2 || progress <= 0) {
    return;
  }

  const { left, top, width, height } = bounds;
  const count = cleanValues.length;
  const position = clamp(progress) * (count - 1);
  const wholeIndex = Math.floor(position);
  const segmentProgress = position - wholeIndex;
  const points = [];

  const xFor = (index) => left + (index / (count - 1)) * width;
  const yFor = (value) => top + ((domain.max - value) / (domain.max - domain.min || 1)) * height;

  for (let index = 0; index <= wholeIndex; index += 1) {
    const value = cleanValues[index];
    if (Number.isFinite(value)) {
      points.push({ x: xFor(index), y: yFor(value) });
    }
  }

  if (wholeIndex < count - 1) {
    const current = cleanValues[wholeIndex];
    const next = cleanValues[wholeIndex + 1];
    if (Number.isFinite(current) && Number.isFinite(next)) {
      points.push({
        x: lerp(xFor(wholeIndex), xFor(wholeIndex + 1), segmentProgress),
        y: yFor(lerp(current, next, segmentProgress)),
      });
    }
  }

  if (points.length < 2) {
    return;
  }

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  [rgba(series.color, 0.22), series.color].forEach((color, layerIndex) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = layerIndex === 0 ? 7 : 2.8;
    ctx.stroke();
  });

  const last = points.at(-1);
  ctx.fillStyle = series.color;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(last.x, last.y, 4.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawLoaderChart(canvas, data, progress) {
  if (!canvas || !data.labels.length) {
    return;
  }

  const { ctx, width, height } = setupCanvas(canvas);
  const surface = 'rgba(255, 255, 255, 0.86)';
  const border = rgba(theme('--text', '#11233d'), 0.1);
  const bounds = {
    left: 54,
    top: 28,
    width: width - 78,
    height: height - 76,
  };

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.fillStyle = surface;
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundedRect(ctx, 0.5, 0.5, width - 1, height - 1, 22);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawGrid(ctx, bounds, data.domain, data.labels);
  data.series.forEach((series) => drawSeries(ctx, series, bounds, data.domain, progress));
}

function statusText(progress, done) {
  if (done || progress >= 0.995) {
    return 'Ready. Bringing the illustration into view';
  }
  if (progress > 0.7) {
    return 'Finishing the common rotation grid';
  }
  if (progress > 0.35) {
    return 'Loading illustrative time series';
  }
  return 'Preparing the illustrative canvas';
}

export function createAtlasLoader(timeSeries, options = {}) {
  const minimumMs = options.minimumMs ?? DEFAULT_MINIMUM_MS;
  const data = prepareLoaderSeries(timeSeries);
  const state = {
    canvas: null,
    bar: null,
    percent: null,
    status: null,
    startedAt: 0,
    progress: 0,
    raf: 0,
    finishing: false,
    finishFrom: 0,
    finishStartedAt: 0,
    resolveFinish: null,
    reducedMotion: false,
  };

  function mount() {
    state.canvas = document.getElementById('loader-time-series');
    state.bar = document.getElementById('loader-progress-bar');
    state.percent = document.getElementById('loader-progress-text');
    state.status = document.getElementById('loader-status-text');
    state.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function paint(done = false) {
    const progress = clamp(state.progress);
    drawLoaderChart(state.canvas, data, progress);

    if (state.bar) {
      state.bar.style.width = `${Math.round(progress * 1000) / 10}%`;
    }
    if (state.percent) {
      state.percent.textContent = `${Math.round(progress * 100)}%`;
    }
    if (state.status) {
      state.status.textContent = statusText(progress, done);
    }
  }

  function tick(now) {
    if (!state.startedAt) {
      state.startedAt = now;
    }

    if (state.finishing) {
      const finishDuration = state.reducedMotion ? 220 : FINISH_DURATION_MS;
      const completionInput = (now - state.finishStartedAt) / finishDuration;
      const completion = state.reducedMotion ? clamp(completionInput) : easeOutCubic(completionInput);
      state.progress = lerp(state.finishFrom, 1, completion);
      paint(completion >= 1);

      if (completion >= 1) {
        window.setTimeout(() => state.resolveFinish?.(), FINISH_HOLD_MS);
        state.raf = 0;
        return;
      }

      state.raf = requestAnimationFrame(tick);
      return;
    }

    const activeMinimumMs = state.reducedMotion ? Math.min(minimumMs, REDUCED_MOTION_MINIMUM_MS) : minimumMs;
    const elapsed = now - state.startedAt;
    const base = Math.min(elapsed / activeMinimumMs, 1) * 0.94;
    const slowCreep = elapsed > activeMinimumMs ? Math.min((elapsed - activeMinimumMs) / 9000, 1) * 0.045 : 0;
    state.progress = Math.max(state.progress, Math.min(0.985, base + slowCreep));
    paint(false);
    state.raf = requestAnimationFrame(tick);
  }

  function start() {
    mount();
    state.startedAt = performance.now();
    state.progress = 0;
    paint(false);
    state.raf = requestAnimationFrame(tick);
  }

  async function finish() {
    const activeMinimumMs = state.reducedMotion ? Math.min(minimumMs, REDUCED_MOTION_MINIMUM_MS) : minimumMs;
    const elapsed = performance.now() - state.startedAt;
    const remaining = Math.max(0, activeMinimumMs - elapsed);

    await new Promise((resolve) => window.setTimeout(resolve, remaining));

    return new Promise((resolve) => {
      state.finishing = true;
      state.finishFrom = state.progress;
      state.finishStartedAt = performance.now();
      state.resolveFinish = resolve;

      if (state.raf) {
        cancelAnimationFrame(state.raf);
      }

      state.raf = requestAnimationFrame(tick);
    });
  }

  function resize() {
    paint(state.finishing && state.progress >= 1);
  }

  function destroy() {
    if (state.raf) {
      cancelAnimationFrame(state.raf);
    }
    state.canvas = null;
    state.bar = null;
    state.percent = null;
    state.status = null;
  }

  return {
    start,
    finish,
    resize,
    destroy,
  };
}
