/**
 * Indian Govt Exam Image Cropper & Resizer
 * Optimized Canvas rendering + Binary quality loop + Zoom/Pan
 */

(function () {
  'use strict';

  // ---------- State ----------
  let currentBoard = null;
  let currentDocKey = null;
  let currentSpec = null;
  let imgNatural = { w: 0, h: 0 };
  let transform = { scale: 1, x: 0, y: 0 };
  let isDragging = false;
  let lastPos = { x: 0, y: 0 };
  let processedBlob = null;
  let sourceImage = null; // HTMLImageElement kept for canvas draws
  let rafPending = false;

  const $ = (id) => document.getElementById(id);

  // ---------- DOM refs ----------
  const boardSelect = $('boardSelect');
  const docSelect = $('docSelect');
  const fileInput = $('fileInput');
  const cropViewport = $('cropViewport');
  const cropImage = $('cropImage');
  const emptyState = $('emptyState');
  const zoomSlider = $('zoomSlider');
  const processBtn = $('processBtn');
  const downloadBtn = $('downloadBtn');
  const resultPreview = $('resultPreview');
  const resultMeta = $('resultMeta');
  const targetInfo = $('targetInfo');
  const reqList = $('reqList');
  const nameDateSection = $('nameDateSection');
  const nameInput = $('candidateName');
  const dateInput = $('photoDate');
  const nameDateCheck = $('enableNameDate');
  const backdrop = $('dynamic-city-backdrop');
  const cityCaption = $('backdrop-city-caption');

  // ---------- Init Board Dropdown ----------
  function buildBoardOptions() {
    boardSelect.innerHTML = '';

    // Central group
    const centralGroup = document.createElement('optgroup');
    centralGroup.label = 'Central Government';
    Object.entries(RECRUITMENT_REGISTRY.central).forEach(([id, board]) => {
      const opt = document.createElement('option');
      opt.value = 'central:' + id;
      opt.textContent = board.name;
      centralGroup.appendChild(opt);
    });
    boardSelect.appendChild(centralGroup);

    // States group
    const stateGroup = document.createElement('optgroup');
    stateGroup.label = 'State PSC / Recruitment Boards';
    Object.entries(RECRUITMENT_REGISTRY.states)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach(([id, entry]) => {
        const opt = document.createElement('option');
        opt.value = 'state:' + id;
        opt.textContent = entry.name;
        stateGroup.appendChild(opt);
      });
    boardSelect.appendChild(stateGroup);

    // UTs group
    const utGroup = document.createElement('optgroup');
    utGroup.label = 'Union Territories';
    Object.entries(RECRUITMENT_REGISTRY.uts).forEach(([id, entry]) => {
      const opt = document.createElement('option');
      opt.value = 'ut:' + id;
      opt.textContent = entry.name;
      utGroup.appendChild(opt);
    });
    boardSelect.appendChild(utGroup);

    boardSelect.addEventListener('change', onBoardChange);
    onBoardChange();
  }

  function resolveBoard(value) {
    const [type, id] = value.split(':');
    if (type === 'central') return RECRUITMENT_REGISTRY.central[id];
    if (type === 'state') return normalizeStateSpec(RECRUITMENT_REGISTRY.states[id]);
    if (type === 'ut') return normalizeStateSpec(RECRUITMENT_REGISTRY.uts[id]);
    return null;
  }

  function onBoardChange() {
    currentBoard = resolveBoard(boardSelect.value);
    if (!currentBoard) return;

    // Populate document types
    docSelect.innerHTML = '';
    Object.keys(currentBoard.specs).forEach((key) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = currentBoard.specs[key].label || key.replace(/_/g, ' ');
      docSelect.appendChild(opt);
    });
    docSelect.onchange = updateCurrentSpec;
    updateCurrentSpec();

    // Dynamic capital backdrop
    updateDynamicCapitalBackdrop(currentBoard.capitalQuery, currentBoard.capitalName);
  }

  function updateCurrentSpec() {
    currentDocKey = docSelect.value;
    currentSpec = currentBoard.specs[currentDocKey];
    if (!currentSpec) return;

    // Aspect ratio of viewport
    cropViewport.style.aspectRatio = currentSpec.width + ' / ' + currentSpec.height;

    // Target info
    targetInfo.innerHTML =
      '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">JPG</span> ' +
      '<strong class="ml-1">' + currentSpec.width + ' \u00d7 ' + currentSpec.height + ' px</strong>' +
      ' <span class="mx-1 text-slate-400">|</span> ' +
      '<strong>' + currentSpec.minKb + ' \u2013 ' + currentSpec.maxKb + ' KB</strong>';

    // Requirements list
    reqList.innerHTML =
      '<li>Format: <strong>JPG / JPEG</strong></li>' +
      '<li>Dimensions: <strong>' + currentSpec.width + ' \u00d7 ' + currentSpec.height + ' px</strong></li>' +
      '<li>File size: <strong>' + currentSpec.minKb + ' \u2013 ' + currentSpec.maxKb + ' KB</strong></li>' +
      (currentSpec.allowNameDate ? '<li class="text-amber-700">Name &amp; Date stamp available</li>' : '');

    // Name/Date section visibility
    if (currentSpec.allowNameDate) {
      nameDateSection.classList.remove('hidden');
      nameDateCheck.checked = true;
    } else {
      nameDateSection.classList.add('hidden');
      nameDateCheck.checked = false;
    }

    processedBlob = null;
    downloadBtn.disabled = true;
    resultMeta.textContent = '';
  }

  // ---------- Dynamic Backdrop ----------
  function updateDynamicCapitalBackdrop(query, capitalName) {
    if (!backdrop) return;
    const fallback = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=60';
    const url = 'https://source.unsplash.com/1920x1080/?' + encodeURIComponent(query || 'india,architecture');

    const preloader = new Image();
    preloader.onload = function () {
      backdrop.style.backgroundImage =
        'linear-gradient(rgba(15,23,42,0.88), rgba(15,23,42,0.92)), url("' + url + '")';
    };
    preloader.onerror = function () {
      backdrop.style.backgroundImage =
        'linear-gradient(rgba(15,23,42,0.90), rgba(15,23,42,0.94)), url("' + fallback + '")';
    };
    preloader.src = url;

    if (cityCaption) {
      cityCaption.textContent = 'Capital perspective: ' + (capitalName || 'India');
    }
  }

  // ---------- Image load ----------
  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      sourceImage = img;
      imgNatural = { w: img.naturalWidth, h: img.naturalHeight };
      cropImage.src = url;
      cropImage.style.display = 'block';
      emptyState.style.display = 'none';
      zoomSlider.disabled = false;
      processBtn.disabled = false;

      // Cover fit
      const vpW = cropViewport.clientWidth;
      const vpH = cropViewport.clientHeight;
      const scale = Math.max(vpW / imgNatural.w, vpH / imgNatural.h);
      transform = { scale: scale, x: 0, y: 0 };
      zoomSlider.value = scale;
      zoomSlider.min = Math.max(0.3, scale * 0.4);
      zoomSlider.max = Math.max(4, scale * 3);
      scheduleTransform();
    };
    img.src = url;
  });

  // ---------- Transform (rAF optimized) ----------
  function applyTransform() {
    const vpW = cropViewport.clientWidth;
    const vpH = cropViewport.clientHeight;
    const displayW = imgNatural.w * transform.scale;
    const displayH = imgNatural.h * transform.scale;

    cropImage.style.width = displayW + 'px';
    cropImage.style.height = displayH + 'px';
    cropImage.style.left = (vpW / 2 - displayW / 2 + transform.x) + 'px';
    cropImage.style.top = (vpH / 2 - displayH / 2 + transform.y) + 'px';
    rafPending = false;
  }

  function scheduleTransform() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(applyTransform);
  }

  zoomSlider.addEventListener('input', function (e) {
    transform.scale = parseFloat(e.target.value);
    scheduleTransform();
  });

  // Mouse pan
  cropViewport.addEventListener('mousedown', function (e) {
    if (!sourceImage) return;
    isDragging = true;
    lastPos = { x: e.clientX, y: e.clientY };
    cropViewport.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    transform.x += e.clientX - lastPos.x;
    transform.y += e.clientY - lastPos.y;
    lastPos = { x: e.clientX, y: e.clientY };
    scheduleTransform();
  });
  window.addEventListener('mouseup', function () {
    isDragging = false;
    cropViewport.style.cursor = 'grab';
  });

  // Touch pan
  cropViewport.addEventListener('touchstart', function (e) {
    if (!sourceImage || e.touches.length !== 1) return;
    isDragging = true;
    lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  cropViewport.addEventListener('touchmove', function (e) {
    if (!isDragging || e.touches.length !== 1) return;
    transform.x += e.touches[0].clientX - lastPos.x;
    transform.y += e.touches[0].clientY - lastPos.y;
    lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    scheduleTransform();
  }, { passive: true });
  cropViewport.addEventListener('touchend', function () { isDragging = false; });

  // Wheel zoom
  cropViewport.addEventListener('wheel', function (e) {
    if (!sourceImage) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    const min = parseFloat(zoomSlider.min);
    const max = parseFloat(zoomSlider.max);
    transform.scale = Math.min(max, Math.max(min, transform.scale + delta));
    zoomSlider.value = transform.scale;
    scheduleTransform();
  }, { passive: false });

  // ---------- Name & Date stamp ----------
  function applyCandidateNameDateStamp(ctx, width, height, candidateName, photoDate) {
    const bannerHeight = Math.floor(height * 0.18);
    const bannerY = height - bannerHeight;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, bannerY, width, bannerHeight);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bannerY);
    ctx.lineTo(width, bannerY);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const nameFontSize = Math.max(11, Math.floor(bannerHeight * 0.32));
    const dateFontSize = Math.max(9, Math.floor(bannerHeight * 0.26));

    ctx.font = 'bold ' + nameFontSize + 'px system-ui, -apple-system, sans-serif';
    ctx.fillText((candidateName || 'CANDIDATE NAME').toUpperCase(), width / 2, bannerY + bannerHeight * 0.35);

    ctx.font = '600 ' + dateFontSize + 'px system-ui, -apple-system, sans-serif';
    ctx.fillText('Photo Date: ' + (photoDate || 'DD/MM/YYYY'), width / 2, bannerY + bannerHeight * 0.72);
  }

  // ---------- Binary quality loop (optimized) ----------
  async function generateCompliantImageBlob(canvas, minKb, maxKb) {
    let low = 0.08;
    let high = 0.98;
    let bestBlob = null;
    let bestDiff = Infinity;
    const maxAttempts = 12;

    for (let i = 0; i < maxAttempts; i++) {
      const q = (low + high) / 2;
      const blob = await new Promise(function (resolve) {
        canvas.toBlob(resolve, 'image/jpeg', q);
      });
      const sizeKb = blob.size / 1024;

      if (sizeKb >= minKb && sizeKb <= maxKb) {
        return blob; // exact hit
      }

      const diff = sizeKb > maxKb ? sizeKb - maxKb : minKb - sizeKb;
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
      }

      if (sizeKb > maxKb) {
        high = q;
      } else {
        low = q;
      }
    }
    return bestBlob;
  }

  // ---------- Process ----------
  processBtn.addEventListener('click', async function () {
    if (!sourceImage || !currentSpec) return;

    processBtn.disabled = true;
    processBtn.textContent = 'Processing...';

    const tw = currentSpec.width;
    const th = currentSpec.height;

    // Use high-quality canvas settings
    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d', { alpha: false }); // opaque = faster

    // Performance hints
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // White background (critical for signatures)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tw, th);

    // Map visible viewport region back to natural image coordinates
    const vpW = cropViewport.clientWidth;
    const vpH = cropViewport.clientHeight;
    const scale = transform.scale;
    const displayW = imgNatural.w * scale;
    const displayH = imgNatural.h * scale;
    const imgLeft = vpW / 2 - displayW / 2 + transform.x;
    const imgTop = vpH / 2 - displayH / 2 + transform.y;

    const sx = (0 - imgLeft) / scale;
    const sy = (0 - imgTop) / scale;
    const sWidth = vpW / scale;
    const sHeight = vpH / scale;

    ctx.drawImage(sourceImage, sx, sy, sWidth, sHeight, 0, 0, tw, th);

    // Optional Name & Date stamp
    if (currentSpec.allowNameDate && nameDateCheck.checked) {
      applyCandidateNameDateStamp(
        ctx, tw, th,
        nameInput.value.trim() || 'CANDIDATE NAME',
        dateInput.value.trim() || new Date().toLocaleDateString('en-IN')
      );
    }

    // Binary search compression
    const blob = await generateCompliantImageBlob(canvas, currentSpec.minKb, currentSpec.maxKb);
    processedBlob = blob;

    const sizeKb = (blob.size / 1024).toFixed(1);
    const url = URL.createObjectURL(blob);

    resultPreview.innerHTML = '';
    const outImg = document.createElement('img');
    outImg.src = url;
    outImg.alt = 'Processed output';
    outImg.className = 'max-w-full max-h-64 object-contain rounded-lg';
    resultPreview.appendChild(outImg);

    const inRange = parseFloat(sizeKb) >= currentSpec.minKb && parseFloat(sizeKb) <= currentSpec.maxKb;
    resultMeta.innerHTML =
      (inRange
        ? '<span class="text-emerald-600 font-medium">Within limits</span>'
        : '<span class="text-amber-600 font-medium">Closest possible size</span>') +
      '<br>' + tw + ' \u00d7 ' + th + ' px &nbsp;\u00b7&nbsp; ' + sizeKb + ' KB';

    downloadBtn.disabled = false;
    processBtn.disabled = false;
    processBtn.innerHTML = '<svg class="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Process Image';
  });

  // ---------- Download ----------
  downloadBtn.addEventListener('click', function () {
    if (!processedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(processedBlob);
    const boardLabel = (currentBoard.name || 'exam').split('(')[0].trim().replace(/\s+/g, '_').toLowerCase();
    a.download = boardLabel + '_' + currentDocKey + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // ---------- Boot ----------
  buildBoardOptions();
})();
