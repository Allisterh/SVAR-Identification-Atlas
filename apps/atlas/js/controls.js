import { theme } from './plotting.js';

export function normalizeIndex(index, count) {
  return ((index % count) + count) % count;
}

export function createRotationControl(mountId, config) {
  const mount = typeof mountId === 'string' ? document.getElementById(mountId) : mountId;
  if (!mount) {
    return null;
  }

  const count = config.count;
  const angles = config.angles ?? Array.from({ length: count }, (_, index) => index * (360 / count));
  let currentIndex = normalizeIndex(config.initialIndex ?? 0, count);

  mount.innerHTML = `
    <div class="rotation-control rotation-control--circle">
      <div class="rotation-control__panel" data-rotation-details></div>
      <div
        class="rotation-dial"
        role="slider"
        tabindex="0"
        aria-label="${config.label}"
        aria-valuemin="0"
        aria-valuemax="${count - 1}"
        aria-valuenow="0"
      >
        <span class="rotation-dial__ring"></span>
        <span class="rotation-dial__arc"></span>
        <span class="rotation-dial__ticks"></span>
        <span class="rotation-dial__axis rotation-dial__axis--x"></span>
        <span class="rotation-dial__axis rotation-dial__axis--y"></span>
        <span class="rotation-dial__value" data-rotation-value>&theta; = 0.0&deg;</span>
        <span class="rotation-dial__knob"></span>
      </div>
    </div>`;

  const dial = mount.querySelector('.rotation-dial');
  const details = mount.querySelector('[data-rotation-details]');
  const dialValue = mount.querySelector('[data-rotation-value]');

  const angleFor = (index) => Number(angles[normalizeIndex(index, count)] ?? 0);
  const labelFor = (index) => `Candidate ${String(index).padStart(2, '0')}`;

  const visualAngleForIndex = (index) => -90 + (normalizeIndex(index, count) / count) * 360;

  const indexForVisualAngle = (degrees) => {
    const progress = ((((degrees + 90) % 360) + 360) % 360) / 360;
    return normalizeIndex(Math.round(progress * count), count);
  };

  const positionKnob = (index) => {
    const radians = (visualAngleForIndex(index) * Math.PI) / 180;
    const radius = 41.5;
    dial.style.setProperty('--knob-x', `${50 + Math.cos(radians) * radius}%`);
    dial.style.setProperty('--knob-y', `${50 + Math.sin(radians) * radius}%`);
  };

  const apply = (index, notify = true) => {
    currentIndex = normalizeIndex(index, count);
    const degrees = angleFor(currentIndex);
    dial.style.setProperty('--rotation-angle', `${visualAngleForIndex(currentIndex)}deg`);
    dial.style.setProperty('--rotation-color', theme('--accent-warm', '#f97316'));
    positionKnob(currentIndex);
    dial.setAttribute('aria-valuenow', String(currentIndex));
    dial.setAttribute(
      'aria-valuetext',
      `${labelFor(currentIndex)}, theta ${degrees.toFixed(1)} degrees`
    );
    if (dialValue) {
      dialValue.innerHTML = `&theta; = ${degrees.toFixed(1)}&deg;`;
    }
    if (details) {
      details.innerHTML =
        config.renderDetails?.(currentIndex, {
          angleDegrees: degrees,
          label: labelFor(currentIndex),
        }) ?? '';
    }
    if (notify) {
      config.onChange?.(currentIndex);
    }
  };

  const setFromPointer = (event) => {
    const rect = dial.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const visualDegrees = (Math.atan2(y, x) * 180) / Math.PI;
    apply(indexForVisualAngle(visualDegrees));
  };

  dial.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    dial.setPointerCapture(event.pointerId);
    setFromPointer(event);
  });

  dial.addEventListener('pointermove', (event) => {
    if (dial.hasPointerCapture(event.pointerId)) {
      setFromPointer(event);
    }
  });

  dial.addEventListener('keydown', (event) => {
    const keyMap = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
    };
    if (event.key in keyMap) {
      event.preventDefault();
      apply(currentIndex + keyMap[event.key]);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      apply(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      apply(count - 1);
    }
  });

  apply(currentIndex, false);

  return {
    setIndex(index, notify = false) {
      apply(index, notify);
    },
    getIndex() {
      return currentIndex;
    },
  };
}
