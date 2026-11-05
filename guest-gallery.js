(() => {
  'use strict';
  const apiBase = location.hostname === 'bereket6244.github.io'
    ? 'https://menaincet.com/binyam-bethel/' : new URL('./', location.href).href;
  const input = document.getElementById('up');
  const status = document.getElementById('status');
  const uploadLabel = document.getElementById('uploadLabel');
  const uploadText = uploadLabel && uploadLabel.querySelector('.upload-label-text');
  const openButton = document.getElementById('fullGalleryBtn');
  if (!input || !status || !uploadLabel || !openButton) return;

  const gallery = document.createElement('dialog');
  gallery.className = 'guest-dialog';
  gallery.innerHTML = '<header><h2>Our shared memories</h2><button type="button" data-close aria-label="Close gallery">×</button></header><p class="guest-summary"></p><div class="guest-grid"></div>';
  const viewer = document.createElement('dialog');
  viewer.className = 'guest-dialog guest-viewer';
  viewer.innerHTML = '<header><span class="guest-position"></span><a class="guest-download" download>Download original</a><button type="button" data-close aria-label="Close photo">×</button></header><div class="guest-image-wrap"><img alt="Guest photo"></div><p class="guest-viewer-status" role="status"></p><nav><button type="button" data-prev>Previous</button><button type="button" data-retry hidden>Try again</button><button type="button" data-next>Next</button></nav>';
  document.body.append(gallery, viewer);

  let photos = [];
  const builtInPhotos = Array.from(document.querySelectorAll('#stage [data-full]'), slide => ({
    src: slide.dataset.full,
    previewSrc: slide.querySelector('img').currentSrc || slide.querySelector('img').dataset.src,
    alt: slide.getAttribute('aria-label'),
    builtIn: true
  }));
  let viewerPhotos = photos;
  let selected = 0;
  let busy = false;
  let imageVersion = 0;
  const frame = viewer.querySelector('.guest-image-wrap');
  const viewerImage = frame.querySelector('img');
  const activePointers = new Map();
  let zoom = 1, panX = 0, panY = 0, pinchStart = null, gestureUsed = false;
  let lastTapAt = 0, lastTapX = 0, lastTapY = 0, tapTimer = 0;
  const deviceKey = 'binyam-bethel-photo-device-id';
  let deviceId = '';
  try { deviceId = localStorage.getItem(deviceKey) || ''; } catch (_) {}
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
    try { localStorage.setItem(deviceKey, deviceId); } catch (_) {}
  }

  function setStatus(message) { status.textContent = message; }
  function setBusy(value, progress = 0, current = 0, total = 0) {
    busy = value;
    input.disabled = value;
    uploadLabel.classList.toggle('is-uploading', value);
    uploadLabel.setAttribute('aria-busy', String(value));
    uploadLabel.style.setProperty('--upload-progress', Math.max(0, Math.min(100, progress)) + '%');
    uploadText.textContent = value ? `Uploading ${current}/${total} · ${Math.round(progress)}%` : 'Choose photos';
  }
  async function isSupportedPhoto(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > 8000000) return false;
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (file.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (file.type === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
    return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  }
  function createDeleteButton(photo, index) {
    if (!photo.canDelete) return null;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'guest-delete';
    remove.setAttribute('aria-label', 'Delete your photo ' + (index + 1));
    remove.title = 'Delete your photo';
    remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M9 6V4h6v2m3 0-1 14H7L6 6m4 4v6m4-6v6"/></svg>';
    remove.addEventListener('click', async event => {
      event.stopPropagation();
      if (!confirm(window.weddingI18n?.translate('Delete this photo?') || 'Delete this photo?')) return;
      remove.disabled = true;
      try {
        const response = await fetch(apiBase + 'api/photos.php', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId, id: photo.id }) });
        const result = await response.json();
        if (!response.ok || !result.deleted) throw new Error('Delete failed');
        await refresh();
      } catch (_) { setStatus('Could not delete the photo. Please try again.'); remove.disabled = false; }
    });
    return remove;
  }
  window.createGuestDeleteButton = createDeleteButton;
  function makeCard(photo, index) {
    const card = document.createElement('article');
    card.className = 'guest-photo-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'guest-photo-open';
    button.setAttribute('aria-label', 'View photo ' + (index + 1));
    const image = document.createElement('img');
    image.src = photo.previewSrc;
    image.alt = 'Guest photo ' + (index + 1);
    image.loading = 'lazy';
    image.decoding = 'async';
    button.append(image);
    button.addEventListener('click', () => showPhoto(photos.findIndex(item => item.id === photo.id), photos));
    card.append(button);
    const actions = document.createElement('div');
    actions.className = 'guest-photo-actions';
    const download = document.createElement('a');
    download.href = photo.src + '&download=1';
    download.download = '';
    download.textContent = 'Download';
    download.setAttribute('aria-label', 'Download photo ' + (index + 1));
    actions.append(download);
    card.append(actions);
    const remove = createDeleteButton(photo, index);
    if (remove) card.append(remove);
    return card;
  }
  function render() {
    gallery.querySelector('.guest-grid').replaceChildren(...photos.map(makeCard));
    gallery.querySelector('.guest-summary').textContent = photos.length ? 'Select a photo to view or download the original.' : 'No guest photos yet. Be the first to share one!';
    if (window.setGuestCarouselPhotos) window.setGuestCarouselPhotos(photos);
  }
  let refreshVersion = 0;
  async function refresh() {
    const version = ++refreshVersion;
    try {
      const response = await fetch(apiBase + 'api/gallery.php?device_id=' + encodeURIComponent(deviceId), { cache: 'no-store' });
      if (!response.ok) throw new Error('Gallery unavailable');
      const data = await response.json();
      if (!Array.isArray(data.photos)) throw new Error('Invalid gallery');
      if (version !== refreshVersion) return;
      photos = data.photos.map(photo => ({
        ...photo,
        src: new URL(photo.src, apiBase).href,
        previewSrc: new URL(photo.previewSrc, apiBase).href,
      }));
      render();
    } catch (_) {
      if (version !== refreshVersion) return;
      setStatus('Photos are temporarily unavailable. Please try again.');
      gallery.querySelector('.guest-summary').textContent = 'Photos are temporarily unavailable. Close and try again.';
    }
  }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function applyImageTransform() {
    const width = frame.clientWidth, height = frame.clientHeight;
    if (!width || !height) {
      viewerImage.style.transform = 'none';
      frame.classList.toggle('is-zoomed', zoom > 1);
      return;
    }
    const ratio = viewerImage.naturalWidth && viewerImage.naturalHeight ? viewerImage.naturalWidth / viewerImage.naturalHeight : width / height;
    const baseWidth = Math.min(width, height * ratio);
    const baseHeight = Math.min(height, width / ratio);
    panX = clamp(panX, -Math.max(0, (baseWidth * zoom - width) / 2), Math.max(0, (baseWidth * zoom - width) / 2));
    panY = clamp(panY, -Math.max(0, (baseHeight * zoom - height) / 2), Math.max(0, (baseHeight * zoom - height) / 2));
    viewerImage.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoom + ')';
    frame.classList.toggle('is-zoomed', zoom > 1);
  }
  function resetZoom() {
    zoom = 1;
    panX = panY = 0;
    pinchStart = null;
    activePointers.clear();
    clearTimeout(tapTimer);
    lastTapAt = 0;
    frame.classList.remove('is-panning');
    applyImageTransform();
  }
  function toggleZoom(clientX, clientY) {
    if (zoom > 1) {
      zoom = 1;
      panX = panY = 0;
    } else {
      zoom = 2.5;
      const box = frame.getBoundingClientRect();
      panX = -(clientX - box.left - box.width / 2) * (zoom - 1);
      panY = -(clientY - box.top - box.height / 2) * (zoom - 1);
    }
    applyImageTransform();
  }
  function showPhoto(index, collection) {
    if (collection) viewerPhotos = collection;
    if (!viewerPhotos[index]) return;
    selected = index;
    const photo = viewerPhotos[index];
    const version = ++imageVersion;
    const image = viewer.querySelector('img');
    resetZoom();
    viewer.classList.remove('controls-hidden');
    image.src = photo.previewSrc || photo.src;
    image.alt = photo.alt || 'Guest photo ' + (index + 1);
    viewer.querySelector('.guest-position').textContent = (index + 1) + ' / ' + viewerPhotos.length;
    viewer.querySelector('.guest-download').href = photo.builtIn ? photo.src : photo.src + '&download=1';
    viewer.querySelector('[data-prev]').disabled = index === 0;
    viewer.querySelector('[data-next]').disabled = index === viewerPhotos.length - 1;
    viewer.querySelector('[data-retry]').hidden = true;
    viewer.querySelector('.guest-viewer-status').textContent = 'Loading full-size photo…';
    if (!viewer.open) viewer.showModal();
    const full = new Image();
    full.onload = () => { if (version === imageVersion && viewer.open) { image.src = photo.src; viewer.querySelector('.guest-viewer-status').textContent = ''; } };
    full.onerror = () => { if (version === imageVersion && viewer.open) { viewer.querySelector('.guest-viewer-status').textContent = 'Could not load the full-size photo.'; viewer.querySelector('[data-retry]').hidden = false; } };
    full.src = photo.src;
  }
  window.openGuestPhoto = index => showPhoto(index, photos);
  window.openBuiltInPhoto = index => showPhoto(index, builtInPhotos);
  window.openFullGuestGallery = () => { refresh(); gallery.showModal(); };
  openButton.addEventListener('click', event => { event.preventDefault(); window.openFullGuestGallery(); });
  gallery.querySelector('[data-close]').addEventListener('click', () => gallery.close());
  viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => { ++imageVersion; resetZoom(); viewer.querySelector('img').removeAttribute('src'); });
  viewer.querySelector('[data-prev]').addEventListener('click', () => showPhoto(selected - 1));
  viewer.querySelector('[data-next]').addEventListener('click', () => showPhoto(selected + 1));
  viewer.querySelector('[data-retry]').addEventListener('click', () => showPhoto(selected));
  viewer.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showPhoto(selected - 1); if (event.key === 'ArrowRight') showPhoto(selected + 1); });
  frame.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, startPanX: panX, startPanY: panY });
    if (frame.setPointerCapture) frame.setPointerCapture(event.pointerId);
    if (activePointers.size === 2) {
      const points = Array.from(activePointers.values());
      pinchStart = { distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y), centerX: (points[0].x + points[1].x) / 2, centerY: (points[0].y + points[1].y) / 2, zoom, panX, panY };
      gestureUsed = true;
      clearTimeout(tapTimer);
    } else if (activePointers.size === 1) gestureUsed = false;
  });
  frame.addEventListener('pointermove', event => {
    const point = activePointers.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;
    if (activePointers.size >= 2 && pinchStart) {
      const points = Array.from(activePointers.values()).slice(0, 2);
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      zoom = clamp(pinchStart.zoom * distance / Math.max(1, pinchStart.distance), 1, 4);
      const box = frame.getBoundingClientRect();
      const ratio = zoom / pinchStart.zoom;
      panX = pinchStart.panX + (points[0].x + points[1].x) / 2 - pinchStart.centerX - (ratio - 1) * (pinchStart.centerX - box.left - box.width / 2 - pinchStart.panX);
      panY = pinchStart.panY + (points[0].y + points[1].y) / 2 - pinchStart.centerY - (ratio - 1) * (pinchStart.centerY - box.top - box.height / 2 - pinchStart.panY);
      applyImageTransform();
      event.preventDefault();
    } else if (zoom > 1) {
      panX = point.startPanX + point.x - point.startX;
      panY = point.startPanY + point.y - point.startY;
      if (Math.hypot(point.x - point.startX, point.y - point.startY) > 6) gestureUsed = true;
      frame.classList.add('is-panning');
      applyImageTransform();
      event.preventDefault();
    }
  });
  function finishPointer(event) {
    const point = activePointers.get(event.pointerId);
    if (!point) return;
    const wasPinching = activePointers.size > 1;
    activePointers.delete(event.pointerId);
    frame.classList.remove('is-panning');
    if (activePointers.size) {
      const remaining = activePointers.values().next().value;
      remaining.startX = remaining.x;
      remaining.startY = remaining.y;
      remaining.startPanX = panX;
      remaining.startPanY = panY;
      pinchStart = null;
      gestureUsed = true;
      return;
    }
    pinchStart = null;
    if (event.type === 'pointercancel' || wasPinching || gestureUsed) return;
    const dx = event.clientX - point.startX, dy = event.clientY - point.startY;
    if (zoom === 1 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      showPhoto(selected + (dx < 0 ? 1 : -1));
      return;
    }
    if (zoom === 1 && dy > 90 && dy > Math.abs(dx) * 1.25) { viewer.close(); return; }
    if (Math.hypot(dx, dy) > 12) return;
    const now = Date.now();
    if (now - lastTapAt < 330 && Math.hypot(event.clientX - lastTapX, event.clientY - lastTapY) < 45) {
      clearTimeout(tapTimer);
      lastTapAt = 0;
      toggleZoom(event.clientX, event.clientY);
    } else {
      lastTapAt = now;
      lastTapX = event.clientX;
      lastTapY = event.clientY;
      tapTimer = setTimeout(() => viewer.classList.toggle('controls-hidden'), 330);
    }
  }
  frame.addEventListener('pointerup', finishPointer);
  frame.addEventListener('pointercancel', finishPointer);

  input.addEventListener('change', async () => {
    if (busy) return;
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const selectedFiles = files.slice(0, 12);
    setBusy(true, 0, 1, selectedFiles.length);
    setStatus('');
    let added = 0;
    try {
      const valid = await Promise.all(selectedFiles.map(isSupportedPhoto));
      if (valid.some(ok => !ok)) throw new Error('Choose JPEG, PNG, or WebP photos under 8 MB. Other files were not shared.');
      for (let index = 0; index < selectedFiles.length; index++) {
        const current = index + 1;
        const total = selectedFiles.length;
        setBusy(true, 100 * index / total, current, total);
        try {
          const result = await new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            const body = new FormData();
            body.append('deviceId', deviceId);
            body.append('photos[]', selectedFiles[index]);
            request.open('POST', apiBase + 'api/photos.php');
            request.upload.onprogress = event => {
              if (!event.lengthComputable) return;
              const progress = Math.min(99, 100 * (index + .95 * event.loaded / event.total) / total);
              setBusy(true, progress, current, total);
            };
            request.onerror = () => reject(new Error('Network error'));
            request.onload = () => {
              try {
                const data = JSON.parse(request.responseText);
                request.status >= 200 && request.status < 300 ? resolve(data) : reject(new Error(data.error || 'Upload failed'));
              } catch (error) { reject(error); }
            };
            request.send(body);
          });
          added += result.added || 0;
        } catch (_) {}
        setBusy(true, 100 * current / total, current, total);
      }
      await refresh();
      setStatus(added ? 'Photos shared' : 'No photos were uploaded. Please try again.');
    } catch (error) { setStatus(error.message || 'Upload failed. Please try again.'); }
    setBusy(false);
    input.value = '';
  });
  refresh();
  const stage = document.getElementById('stage');
  let inView = false;
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }).observe(stage);
  setInterval(() => {
    if (inView && !document.hidden && !busy) refresh();
  }, 30000);
})();
