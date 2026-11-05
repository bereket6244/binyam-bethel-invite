(() => {
  'use strict';

  const mediaRoot = 'https://bereket6244.github.io/binyam-bethel-invite/video/birds-v1/';
  const mediaCache = 'wedding-birds-v1';
  const tier = {
    low: {width: 280, height: 120, fps: 8},
    medium: {width: 490, height: 210, fps: 8},
    high: {width: 840, height: 360, fps: 12},
  };
  const pageLoaded = document.readyState === 'complete' ? Promise.resolve() :
    new Promise(resolve => window.addEventListener('load', resolve, {once: true}));

  function decode(blob) {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    return image.decode().then(() => image).finally(() => URL.revokeObjectURL(url));
  }

  async function loadSheet(url, signal, allowDownload) {
    // This cache also works on the first visit, before a service worker takes control.
    let cache;
    let saved;
    try {
      cache = await caches.open(mediaCache);
      saved = await cache.match(url);
    } catch (_) { /* Storage may be disabled or full. */ }
    if (saved) {
      try { return {image: await decode(await saved.blob()), mbps: 0}; }
      catch (_) { await cache.delete(url).catch(() => {}); }
    }
    if (!allowDownload()) return null;
    const start = performance.now();
    const response = await fetch(url, {signal, priority: 'low'});
    if (!response.ok) throw new Error('Bird media unavailable');
    const blob = await response.blob();
    const mbps = blob.size * .008 / Math.max(1, performance.now() - start);
    const image = await decode(blob);
    if (cache) {
      cache.put(url, new Response(blob, {headers: {'Content-Type': 'image/webp'}})).catch(() => {});
    }
    return {image, mbps};
  }

  function init() {
    const poster = document.getElementById('bird-banner');
    const frame = poster.parentElement;
    const canvas = frame.querySelector('canvas');
    const context = canvas.getContext('2d');
    const mobile = matchMedia('(max-width: 640px)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const network = navigator.connection;
    let session, timer, visible = true;

    function targetQuality(state) {
      if (network?.saveData || /^(slow-2g|2g)$/.test(network?.effectiveType || '')) return 'low';
      const recent = performance.getEntriesByType('resource').reverse().find(entry =>
        entry.transferSize > 16000 && entry.responseEnd > entry.requestStart);
      const measured = state.mbps || (recent && recent.transferSize * .008 / (recent.responseEnd - recent.requestStart));
      const estimates = [network?.downlink, measured].filter(speed => speed > 0);
      const speed = estimates.length ? Math.min(...estimates) : 0;
      if (speed >= 6 && network?.effectiveType !== '3g') return 'high';
      return speed >= 1.8 ? 'medium' : 'low';
    }

    async function load(state, quality, part) {
      const key = quality + part;
      if (state.pending.has(key) || state.sheets[key]) return;
      state.pending.add(key);
      try {
        const sheet = await loadSheet(mediaRoot + state.language + '-' + quality + '-' + part + '.webp',
          state.controller.signal, () => quality === 'low' || quality === targetQuality(state));
        if (!sheet || state !== session) return;
        state.sheets[key] = sheet.image;
        if (sheet.mbps) state.mbps = sheet.mbps;
        render();
      } catch (_) { /* Keep the poster or the last available frame on screen. */ }
      finally { state.pending.delete(key); }
    }

    async function prepare(state) {
      await load(state, 'low', 0);
      if (state !== session || !state.sheets.low0) return;
      if (!state.hold) await load(state, 'low', 1);
      await pageLoaded;
      if (state === session) upgrade(state);
    }

    async function upgrade(state) {
      if (!state || motion.matches || !visible || document.hidden || !state.sheets.low0 || network?.saveData) return;
      const quality = targetQuality(state);
      // Try a previously saved sharper sheet without downloading on a slow connection.
      const preferred = quality === 'low' ? 'medium' : quality;
      await load(state, preferred, 0);
      if (state === session && !state.hold && state.sheets[preferred + '0']) await load(state, preferred, 1);
      if (preferred === 'medium' && state === session && targetQuality(state) === 'high') {
        await load(state, 'high', 0);
        if (!state.hold && state === session && state.sheets.high0) await load(state, 'high', 1);
      }
    }

    function render() {
      clearTimeout(timer);
      const state = session;
      if (!state?.sheets.low0 || document.hidden || !visible) return;
      const now = performance.now();
      if (state.lastTime !== null) state.time += now - state.lastTime;
      state.lastTime = now;
      if (state.hold) state.time = Math.min(state.time, 3000);
      else if (!state.sheets.low1) state.time = Math.min(state.time, 8000);
      else state.time %= 16000;
      const part = state.time >= 8000 && !!state.sheets.low1 ? 1 : 0;
      const quality = ['high', 'medium', 'low'].find(level => state.sheets[level + part]);
      const {width, height, fps} = tier[quality];
      const partTime = state.time - part * 8000;
      const i = Math.min(3 * fps, Math.floor(partTime * fps / 1000));
      const key = quality + part + ':' + i;
      if (state.drawn !== key) {
        if (canvas.width !== width) { canvas.width = width; canvas.height = height; }
        context.clearRect(0, 0, width, height);
        context.drawImage(state.sheets[quality + part], i % 7 * width, Math.floor(i / 7) * height,
          width, height, 0, 0, width, height);
        canvas.hidden = false;
        poster.style.visibility = 'hidden';
        state.drawn = key;
      }
      if (state.hold && state.time >= 3000) return;
      const delay = partTime < 3000 ? 1000 / fps : Math.max(60, 8000 - partTime);
      timer = setTimeout(render, delay);
    }

    function configure() {
      const language = document.documentElement.lang === 'am' ? 'amharic' : 'english';
      const fullWidth = parseFloat(getComputedStyle(frame).getPropertyValue('--banner-width'));
      const hold = !mobile.matches && frame.getBoundingClientRect().width < fullWidth;
      if (session?.language === language && session.hold === hold && session.still === motion.matches) return;
      session?.controller.abort();
      clearTimeout(timer);
      session = {language, hold, still: motion.matches, time: 0, lastTime: null, mbps: 0,
        controller: new AbortController(), sheets: {}, pending: new Set(), drawn: ''};
      poster.src = mediaRoot + language + '-poster.webp';
      poster.style.visibility = '';
      canvas.hidden = true;
      if (context && !motion.matches) prepare(session);
    }

    function activity() {
      if (!session) return;
      session.lastTime = null;
      render();
      if (visible && !document.hidden) upgrade(session);
    }
    configure();
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; activity(); }).observe(frame);
    new ResizeObserver(configure).observe(frame);
    mobile.addEventListener('change', configure);
    motion.addEventListener('change', configure);
    document.addEventListener('visibilitychange', activity);
    document.addEventListener('wedding:languagechange', configure);
    network?.addEventListener('change', () => {
      if (!session) return;
      // A new connection invalidates the estimate from the previous transfer.
      session.mbps = 0;
      upgrade(session);
    });
    window.addEventListener('online', () => {
      if (session && !motion.matches) prepare(session);
    });
  }

  init();
})();
