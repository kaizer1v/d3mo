'use strict';

function selectAll(selector, parent = document) {
  if (typeof selector === 'string') {
    return [...parent.querySelectorAll(selector)];
  } else if (selector instanceof Element) {
    return [selector];
  } else if (selector instanceof NodeList) {
    return [...selector];
  } else if (selector instanceof Array) {
    return selector;
  }
  return [];
}

const getOffsetId = (id) => `scrollama__debug-offset--${id}`;

const setupOffset = ({ id, offsetVal, stepClass }) => {
  const el = document.createElement('div');
  el.id = getOffsetId(id);
  el.className = 'scrollama__debug-offset';
  el.style.position = 'fixed';
  el.style.left = '0';
  el.style.width = '100%';
  el.style.height = '0';
  el.style.borderTop = '2px dashed black';
  el.style.zIndex = '9999';

  const p = document.createElement('p');
  p.innerHTML = `".${stepClass}" trigger: <span>${offsetVal}</span>`;
  p.style.fontSize = '12px';
  p.style.fontFamily = 'monospace';
  p.style.color = 'black';
  p.style.margin = '0';
  p.style.padding = '6px';
  el.appendChild(p);
  document.body.appendChild(el);
};

const update = ({ id, offsetMargin, offsetVal, format }) => {
  const post = format === 'pixels' ? 'px' : '';
  const idVal = getOffsetId(id);
  const el = document.getElementById(idVal);
  el.style.top = `${offsetMargin}px`;
  el.querySelector('span').innerText = `${offsetVal}${post}`;
};

const notifyStep = ({ id, index, state }) => {
  const prefix = `scrollama__debug-step--${id}-${index}`;
  const elA = document.getElementById(`${prefix}_above`);
  const elB = document.getElementById(`${prefix}_below`);
  const display = state === 'enter' ? 'block' : 'none';

  if (elA) elA.style.display = display;
  if (elB) elB.style.display = display;
};

function scrollama() {
  const OBSERVER_NAMES = [
    'stepAbove',
    'stepBelow',
    'stepProgress',
    'viewportAbove',
    'viewportBelow',
  ];

  let cb = {};
  let io = {};

  let id = null;
  let stepEl = [];
  let stepOffsetHeight = [];
  let stepOffsetTop = [];
  let stepStates = [];

  let offsetVal = 0;
  let offsetMargin = 0;
  let viewH = 0;
  let pageH = 0;
  let previousYOffset = 0;
  let progressThreshold = 0;

  let isReady = false;
  let isEnabled = false;
  let isDebug = false;

  let progressMode = false;
  let preserveOrder = false;
  let triggerOnce = false;

  let direction = 'down';
  let format = 'percent';

  let exclude = [];

  const err = (msg) => console.error(`scrollama error: ${msg}`);

  const reset = () => {
    cb = {
      stepEnter: () => {},
      stepExit: () => {},
      stepProgress: () => {},
    };
    io = {};
  };

  const generateInstanceID = () => {
    const a = 'abcdefghijklmnopqrstuv';
    const l = a.length;
    const t = Date.now();
    const r = [0, 0, 0].map(() => a[Math.floor(Math.random() * l)]).join('');
    return `${r}${t}`;
  };

  const getOffsetTop = (el) => {
    const { top } = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const clientTop = document.body.clientTop || 0;
    return top + scrollTop - clientTop;
  };

  const getPageHeight = () => {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  };

  const getIndex = (element) => +element.getAttribute('data-scrollama-index');

  const updateDirection = () => {
    const y = window.pageYOffset;
    if (y > previousYOffset) direction = 'down';
    else if (y < previousYOffset) direction = 'up';
    previousYOffset = y;
  };

  const disconnectObserver = (name) => {
    if (io[name]) io[name].forEach((d) => d.disconnect());
  };

  const handleResize = () => {
    viewH = window.innerHeight;
    pageH = getPageHeight();

    const mult = format === 'pixels' ? 1 : viewH;
    offsetMargin = offsetVal * mult;

    if (isReady) {
      stepOffsetHeight = stepEl.map((el) => el.getBoundingClientRect().height);
      stepOffsetTop = stepEl.map(getOffsetTop);
      if (isEnabled) updateIO();
    }

    if (isDebug) update({ id, offsetMargin, offsetVal, format });
  };

  const handleEnable = (enable) => {
    if (enable && !isEnabled) {
      if (isReady) {
        updateIO();
      } else {
        err('scrollama error: enable() called before scroller was ready');
        isEnabled = false;
        return;
      }
    }
    if (!enable && isEnabled) {
      OBSERVER_NAMES.forEach(disconnectObserver);
    }
    isEnabled = enable;
  };

  const createThreshold = (height) => {
    const count = Math.ceil(height / progressThreshold);
    const t = [];
    const ratio = 1 / count;
    for (let i = 0; i < count; i++) {
      t.push(i * ratio);
    }
    return t;
  };

  const notifyStepProgress = (element, progress) => {
    const index = getIndex(element);
    if (progress !== undefined) stepStates[index].progress = progress;
    const resp = { element, index, progress: stepStates[index].progress };

    if (stepStates[index].state === 'enter') cb.stepProgress(resp);
  };

  const notifyOthers = (index, location) => {
    if (location === 'above') {
      for (let i = 0; i < index; i++) {
        const ss = stepStates[i];
        if (ss.state !== 'enter' && ss.direction !== 'down') {
          notifyStepEnter(stepEl[i], 'down', false);
          notifyStepExit(stepEl[i], 'down');
        } else if (ss.state === 'enter') notifyStepExit(stepEl[i], 'down');
      }
    } else if (location === 'below') {
      for (let i = stepStates.length - 1; i > index; i--) {
        const ss = stepStates[i];
        if (ss.state === 'enter') {
          notifyStepExit(stepEl[i], 'up');
        }
        if (ss.direction === 'down') {
          notifyStepEnter(stepEl[i], 'up', false);
          notifyStepExit(stepEl[i], 'up');
        }
      }
    }
  };

  const notifyStepEnter = (element, dir, check = true) => {
    const index = getIndex(element);
    const resp = { element, index, direction: dir };

    stepStates[index].direction = dir;
    stepStates[index].state = 'enter';
    if (preserveOrder && check && dir === 'down') notifyOthers(index, 'above');

    if (preserveOrder && check && dir === 'up') notifyOthers(index, 'below');

    if (cb.stepEnter && !exclude[index]) {
      cb.stepEnter(resp, stepStates);
      if (isDebug) notifyStep({ id, index, state: 'enter' });
      if (triggerOnce) exclude[index] = true;
    }

    if (progressMode) notifyStepProgress(element);
  };

  const notifyStepExit = (element, dir) => {
    const index = getIndex(element);
    const resp = { element, index, direction: dir };

    if (progressMode) {
      if (dir === 'down' && stepStates[index].progress < 1)
        notifyStepProgress(element, 1);
      else if (dir === 'up' && stepStates[index].progress > 0)
        notifyStepProgress(element, 0);
    }

    stepStates[index].direction = dir;
    stepStates[index].state = 'exit';

    cb.stepExit(resp, stepStates);
    if (isDebug) notifyStep({ id, index, state: 'exit' });
  };

  const intersectStepAbove = ([entry]) => {
    updateDirection();
    const { isIntersecting, boundingClientRect, target } = entry;
    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;
    const index = getIndex(target);
    const ss = stepStates[index];

    if (
      isIntersecting &&
      topAdjusted <= 0 &&
      bottomAdjusted >= 0 &&
      direction === 'down' &&
      ss.state !== 'enter'
    )
      notifyStepEnter(target, direction);

    if (
      !isIntersecting &&
      topAdjusted > 0 &&
      direction === 'up' &&
      ss.state === 'enter'
    )
      notifyStepExit(target, direction);
  };

  const intersectStepBelow = ([entry]) => {
    updateDirection();
    const { isIntersecting, boundingClientRect, target } = entry;
    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;
    const index = getIndex(target);
    const ss = stepStates[index];

    if (
      isIntersecting &&
      topAdjusted <= 0 &&
      bottomAdjusted >= 0 &&
      direction === 'up' &&
      ss.state !== 'enter'
    )
      notifyStepEnter(target, direction);

    if (
      !isIntersecting &&
      bottomAdjusted < 0 &&
      direction === 'down' &&
      ss.state === 'enter'
    )
      notifyStepExit(target, direction);
  };

  const intersectViewportAbove = ([entry]) => {
    updateDirection();
    const { isIntersecting, target } = entry;
    const index = getIndex(target);
    const ss = stepStates[index];

    if (
      isIntersecting &&
      direction === 'down' &&
      ss.direction !== 'down' &&
      ss.state !== 'enter'
    ) {
      notifyStepEnter(target, 'down');
      notifyStepExit(target, 'down');
    }
  };

  const intersectViewportBelow = ([entry]) => {
    updateDirection();
    const { isIntersecting, target } = entry;
    const index = getIndex(target);
    const ss = stepStates[index];
    if (
      isIntersecting &&
      direction === 'up' &&
      ss.direction === 'down' &&
      ss.state !== 'enter'
    ) {
      notifyStepEnter(target, 'up');
      notifyStepExit(target, 'up');
    }
  };

  const intersectStepProgress = ([entry]) => {
    updateDirection();
    const { isIntersecting, intersectionRatio, boundingClientRect, target } = entry;
    const { bottom } = boundingClientRect;
    const bottomAdjusted = bottom - offsetMargin;
    if (isIntersecting && bottomAdjusted >= 0) {
      notifyStepProgress(target, +intersectionRatio.toFixed(3)); // Round for performance
    }
  };

  const updateViewportAboveIO = () => {
    io.viewportAbove = stepEl.map((el, i) => {
      const marginTop = pageH - stepOffsetTop[i];
      const marginBottom = offsetMargin - viewH - stepOffsetHeight[i];
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectViewportAbove, options);
      obs.observe(el);
      return obs;
    });
  };

  const updateViewportBelowIO = () => {
    io.viewportBelow = stepEl.map((el, i) => {
      const marginTop = -offsetMargin - stepOffsetHeight[i];
      const marginBottom = offsetMargin - viewH + stepOffsetHeight[i] + pageH;
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectViewportBelow, options);
      obs.observe(el);
      return obs;
    });
  };

  const updateStepAboveIO = () => {
    io.stepAbove = stepEl.map((el, i) => {
      const marginTop = -offsetMargin + stepOffsetHeight[i];
      const marginBottom = offsetMargin - viewH;
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectStepAbove, options);
      obs.observe(el);
      return obs;
    });
  };

  const updateStepBelowIO = () => {
    io.stepBelow = stepEl.map((el, i) => {
      const marginTop = -offsetMargin;
      const marginBottom = offsetMargin - viewH + stepOffsetHeight[i];
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectStepBelow, options);
      obs.observe(el);
      return obs;
    });
  };

  const updateStepProgressIO = () => {
    io.stepProgress = stepEl.map((el, i) => {
      const marginTop = stepOffsetHeight[i] - offsetMargin;
      const marginBottom = -viewH + offsetMargin;
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const threshold = createThreshold(stepOffsetHeight[i]);
      const options = { rootMargin, threshold };
      const obs = new IntersectionObserver(intersectStepProgress, options);
      obs.observe(el);
      return obs;
    });
  };

  const updateIO = () => {
    OBSERVER_NAMES.forEach(disconnectObserver);

    updateViewportAboveIO();
    updateViewportBelowIO();
    updateStepAboveIO();
    updateStepBelowIO();

    if (progressMode) updateStepProgressIO();
  };

  const indexSteps = () => {
    stepEl.forEach((el, i) => el.setAttribute('data-scrollama-index', i));
  };

  const setupStates = () => {
    stepStates = stepEl.map(() => ({
      direction: null,
      state: null,
      progress: 0,
    }));
  };

  const addDebug = () => {
    if (isDebug) setupOffset({ id, offsetVal, stepClass: stepEl[0]?.className });
  };

  const isYScrollable = (element) => {
    const style = window.getComputedStyle(element);
    return (
      (style.overflowY === 'scroll' || style.overflowY === 'auto') &&
      element.scrollHeight > element.clientHeight
    );
  };

  const anyScrollableParent = (element) => {
    if (element && element.nodeType === 1) {
      return isYScrollable(element)
        ? element
        : anyScrollableParent(element.parentNode);
    }
    return false;
  };

  const S = {};

  S.setup = ({
    step,
    parent,
    offset = 0.5,
    progress = false,
    threshold = 4,
    debug = false,
    order = true,
    once = false,
  }) => {
    reset();
    id = generateInstanceID();

    stepEl = selectAll(step, parent);

    if (!stepEl.length) {
      err('no step elements');
      return S;
    }

    const scrollableParent = stepEl.reduce(
      (foundScrollable, s) => foundScrollable || anyScrollableParent(s.parentNode),
      false
    );
    if (scrollableParent) {
      console.error(
        'scrollama error: step elements cannot be children of a scrollable element. Remove any css on the parent element with overflow: scroll; or overflow: auto; on elements with fixed height.',
        scrollableParent
      );
    }

    isDebug = debug;
    progressMode = progress;
    preserveOrder = order;
    triggerOnce = once;

    S.offsetTrigger(offset);
    progressThreshold = Math.max(1, +threshold);

    isReady = true;

    addDebug();
    indexSteps();
    setupStates();
    handleResize();
    S.enable();
    return S;
  };

  S.resize = () => {
    handleResize();
    return S;
  };

  S.enable = () => {
    handleEnable(true);
    return S;
  };

  S.disable = () => {
    handleEnable(false);
    return S;
  };

  S.destroy = () => {
    handleEnable(false);
    reset();
  };

  S.offsetTrigger = (x) => {
    if (x === null) return offsetVal;

    if (typeof x === 'number') {
      format = 'percent';
      if (x > 1) err('offset value is greater than 1. Fallback to 1.');
      if (x < 0) err('offset value is lower than 0. Fallback to 0.');
      offsetVal = Math.min(Math.max(0, x), 1);
    } else if (typeof x === 'string' && x.includes('px')) {
      const v = +x.replace('px', '');
      if (!Number.isNaN(v)) {
        format = 'pixels';
        offsetVal = v;
      } else {
        err('offset value must be in "px" format. Fallback to 0.5.');
        offsetVal = 0.5;
      }
    } else {
      err('offset value does not include "px". Fallback to 0.5.');
      offsetVal = 0.5;
    }
    return S;
  };

  S.onStepEnter = (f) => {
    if (typeof f === 'function') cb.stepEnter = f;
    else err('onStepEnter requires a function');
    return S;
  };

  S.onStepExit = (f) => {
    if (typeof f === 'function') cb.stepExit = f;
    else err('onStepExit requires a function');
    return S;
  };

  S.onStepProgress = (f) => {
    if (typeof f === 'function') cb.stepProgress = f;
    else err('onStepProgress requires a function');
    return S;
  };

  return S;
}

export default scrollama;