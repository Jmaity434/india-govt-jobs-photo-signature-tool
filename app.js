/**
 * Indian Govt Exam Image Cropper & Resizer
 * - Hero capital image updates on board select
 * - Canvas performance: CSS transform3d, rAF, reusable canvas, createImageBitmap
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
  let sourceImage = null;
  let sourceBitmap = null; // createImageBitmap for faster canvas draw
  let rafPending = false;
  let processCanvas = null; // reusable off-DOM canvas

  const $ = (id) => document.getElementById(id);

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
  const heroImage = $('heroImage');
  const heroBoardName = $('heroBoardName');
  const heroCapitalName = $('heroCapitalName');

  // Curated high-quality Unsplash images per capital (reliable direct URLs)
  const CAPITAL_IMAGES = {
    'New Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=70',
    'Mumbai': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=70',
    'Amaravati': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=70',
    'Itanagar': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Dispur (Guwahati)': 'https://images.unsplash.com/photo-1596402185679-9d8f0f5b0b0b?auto=format&fit=crop&w=1600&q=70',
    'Patna': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=70',
    'Raipur': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Panaji': 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?auto=format&fit=crop&w=1600&q=70',
    'Gandhinagar': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=70',
    'Chandigarh': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=70',
    'Shimla': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=70',
    'Ranchi': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=70',
    'Thiruvananthapuram': 'https://images.unsplash.com/photo-1602216056335-c1aab87b0a48?auto=format&fit=crop&w=1600&q=70',
    'Bhopal': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=70',
    'Imphal': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Shillong': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=70',
    'Aizawl': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Kohima': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Bhubaneswar': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=70',
    'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=70',
    'Gangtok': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=70',
    'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=70',
    'Hyderabad': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=70',
    'Agartala': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Lucknow': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=70',
    'Dehradun': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=70',
    'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=70',
    'Srinagar': 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1600&q=70',
    'Leh': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70',
    'Pondicherry': 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?auto=format&fit=crop&w=1600&q=70',
    'Port Blair': 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?auto=format&fit=crop&w=1600&q=70',
    'Daman': 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?auto=format&fit=crop&w=1600&q=70',
    'Kavaratti': 'https://images.unsplash.com/photo-1512343879784-a960cd67eb2b?auto=format&fit=crop&w=1600&q=70'
  };
  const FALLBACK_HERO = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=70';

  // ---------- Board dropdown ----------
  function buildBoardOptions() {
    boardSelect.innerHTML = '';

    const centralGroup = document.createElement('optgroup');
    centralGroup.label = 'Central Government';
    Object.entries(RECRUITMENT_REGISTRY.central).forEach(function ([id, board]) {
      const opt = document.createElement('option');
      opt.value = 'central:' + id;
      opt.textContent = board.name;
      centralGroup.appendChild(opt);
    });
    boardSelect.appendChild(centralGroup);

    const stateGroup = document.createElement('optgroup');
    stateGroup.label = 'State PSC / Recruitment Boards';
    Object.entries(RECRUITMENT_REGISTRY.states)
      .sort(function (a, b) { return a[1].name.localeCompare(b[1].name); })
      .forEach(function ([id, entry]) {
        const opt = document.createElement('option');
        opt.value = 'state:' + id;
        opt.textContent = entry.name;
        stateGroup.appendChild(opt);
      });
    boardSelect.appendChild(stateGroup);

    const utGroup = document.createElement('optgroup');
    utGroup.label = 'Union Territories';
    Object.entries(RECRUITMENT_REGISTRY.uts).forEach(function ([id, entry]) {
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
    var parts = value.split(':');
    var type = parts[0];
    var id = parts[1];
    if (type === 'central') return RECRUITMENT_REGISTRY.central[id];
    if (type === 'state') return normalizeStateSpec(RECRUITMENT_REGISTRY.states[id]);
    if (type === 'ut') return normalizeStateSpec(RECRUITMENT_REGISTRY.uts[id]);
    return null;
  }

  function onBoardChange() {
    currentBoard = resolveBoard(boardSelect.value);
    if (!currentBoard) return;

    // Update HERO image + captions
    updateHero(currentBoard);

    // Document types
    docSelect.innerHTML = '';
    Object.keys(currentBoard.specs).forEach(function (key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = currentBoard.specs[key].label || key.replace(/_/g, ' ');
      docSelect.appendChild(opt);
    });
    docSelect.onchange = updateCurrentSpec;
    updateCurrentSpec();
  }

  function updateHero(board) {
    var capital = board.capitalName || 'India';
    var url = CAPITAL_IMAGES[capital] || FALLBACK_HERO;

    heroBoardName.textContent = board.name;
    heroCapitalName.textContent = 'Capital perspective: ' + capital;

    if (heroImage.src.indexOf(url.split('?')[0]) !== -1) return; // already showing

    heroImage.classList.add('is-loading');
    var preloader = new Image();
    preloader.onload = function () {
      heroImage.src = url;
      heroImage.classList.remove('is-loading');
    };
    preloader.onerror = function () {
      heroImage.src = FALLBACK_HERO;
      heroImage.classList.remove('is-loading');
    };
    preloader.src = url;
  }

  function updateCurrentSpec() {
    currentDocKey = docSelect.value;
    currentSpec = currentBoard.specs[currentDocKey];
    if (!currentSpec) return;

    cropViewport.style.aspectRatio = currentSpec.width + ' / ' + currentSpec.height;

    targetInfo.innerHTML =
      '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">JPG</span> ' +
      '<strong class="ml-1">' + currentSpec.width + ' \u00d7 ' + currentSpec.height + ' px</strong>' +
      ' <span class="mx-1 text-slate-400">|</span> ' +
      '<strong>' + currentSpec.minKb + ' \u2013 ' + currentSpec.maxKb + ' KB</strong>';

    reqList.innerHTML =
      '<li>Format: <strong>JPG / JPEG</strong></li>' +
      '<li>Dimensions: <strong>' + currentSpec.width + ' \u00d7 ' + currentSpec.height + ' px</strong></li>' +
      '<li>File size: <strong>' + currentSpec.minKb + ' \u2013 ' + currentSpec.maxKb + ' KB</strong></li>' +
      (currentSpec.allowNameDate ? '<li class="text-amber-700">Name &amp; Date stamp available</li>' : '');

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

  // ---------- Image load (with createImageBitmap for faster later draws) ----------
  fileInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;

    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      sourceImage = img;
      imgNatural = { w: img.naturalWidth, h: img.naturalHeight };

      // Prefer ImageBitmap for faster canvas transfer
      if (typeof createImageBitmap === 'function') {
        createImageBitmap(img).then(function (bmp) {
          if (sourceBitmap) sourceBitmap.close();
          sourceBitmap = bmp;
        }).catch(function () { sourceBitmap = null; });
      }

      cropImage.src = url;
      cropImage.style.display = 'block';
      emptyState.style.display = 'none';
      zoomSlider.disabled = false;
      processBtn.disabled = false;

      var vpW = cropViewport.clientWidth;
      var vpH = cropViewport.clientHeight;
      var scale = Math.max(vpW / imgNatural.w, vpH / imgNatural.h);
      transform = { scale: scale, x: 0, y: 0 };
      zoomSlider.min = String(Math.max(0.25, scale * 0.35));
      zoomSlider.max = String(Math.max(4, scale * 3));
      zoomSlider.value = String(scale);
      scheduleTransform();
    };
    img.src = url;
  });

  // ---------- Transform via CSS translate3d + scale (GPU) ----------
  function applyTransform() {
    var vpW = cropViewport.clientWidth;
    var vpH = cropViewport.clientHeight;
    var displayW = imgNatural.w * transform.scale;
    var displayH = imgNatural.h * transform.scale;

    // Center + pan offset
    var tx = (vpW - displayW) / 2 + transform.x;
    var ty = (vpH - displayH) / 2 + transform.y;

    cropImage.style.width = displayW + 'px';
    cropImage.style.height = displayH + 'px';
    cropImage.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
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
    var delta = e.deltaY > 0 ? -0.06 : 0.06;
    var min = parseFloat(zoomSlider.min);
    var max = parseFloat(zoomSlider.max);
    transform.scale = Math.min(max, Math.max(min, transform.scale + delta));
    zoomSlider.value = String(transform.scale);
    scheduleTransform();
  }, { passive: false });

  // ---------- Name & Date stamp ----------
  function applyCandidateNameDateStamp(ctx, width, height, candidateName, photoDate) {
    var bannerHeight = Math.floor(height * 0.18);
    var bannerY = height - bannerHeight;

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

    var nameFontSize = Math.max(11, Math.floor(bannerHeight * 0.32));
    var dateFontSize = Math.max(9, Math.floor(bannerHeight * 0.26));

    ctx.font = 'bold ' + nameFontSize + 'px system-ui, -apple-system, sans-serif';
    ctx.fillText((candidateName || 'CANDIDATE NAME').toUpperCase(), width / 2, bannerY + bannerHeight * 0.35);

    ctx.font = '600 ' + dateFontSize + 'px system-ui, -apple-system, sans-serif';
    ctx.fillText('Photo Date: ' + (photoDate || 'DD/MM/YYYY'), width / 2, bannerY + bannerHeight * 0.72);
  }

  // ---------- Binary quality loop ----------
  async function generateCompliantImageBlob(canvas, minKb, maxKb) {
    var low = 0.08;
    var high = 0.98;
    var bestBlob = null;
    var bestDiff = Infinity;
    var maxAttempts = 12;

    for (var i = 0; i < maxAttempts; i++) {
      var q = (low + high) / 2;
      var blob = await new Promise(function (resolve) {
        canvas.toBlob(resolve, 'image/jpeg', q);
      });
      var sizeKb = blob.size / 1024;

      if (sizeKb >= minKb && sizeKb <= maxKb) return blob;

      var diff = sizeKb > maxKb ? sizeKb - maxKb : minKb - sizeKb;
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
      }

      if (sizeKb > maxKb) high = q;
      else low = q;
    }
    return bestBlob;
  }

  // ---------- Process (optimized canvas path) ----------
  processBtn.addEventListener('click', async function () {
    if (!sourceImage || !currentSpec) return;

    processBtn.disabled = true;
    processBtn.textContent = 'Processing...';

    var tw = currentSpec.width;
    var th = currentSpec.height;

    // Reuse a single off-DOM canvas
    if (!processCanvas) {
      processCanvas = document.createElement('canvas');
    }
    processCanvas.width = tw;
    processCanvas.height = th;

    var ctx = processCanvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tw, th);

    var vpW = cropViewport.clientWidth;
    var vpH = cropViewport.clientHeight;
    var scale = transform.scale;
    var displayW = imgNatural.w * scale;
    var displayH = imgNatural.h * scale;
    var imgLeft = (vpW - displayW) / 2 + transform.x;
    var imgTop = (vpH - displayH) / 2 + transform.y;

    var sx = (0 - imgLeft) / scale;
    var sy = (0 - imgTop) / scale;
    var sWidth = vpW / scale;
    var sHeight = vpH / scale;

    // Prefer ImageBitmap when available (faster GPU upload)
    var drawSource = sourceBitmap || sourceImage;
    ctx.drawImage(drawSource, sx, sy, sWidth, sHeight, 0, 0, tw, th);

    if (currentSpec.allowNameDate && nameDateCheck.checked) {
      applyCandidateNameDateStamp(
        ctx, tw, th,
        nameInput.value.trim() || 'CANDIDATE NAME',
        dateInput.value.trim() || new Date().toLocaleDateString('en-IN')
      );
    }

    var blob = await generateCompliantImageBlob(processCanvas, currentSpec.minKb, currentSpec.maxKb);
    processedBlob = blob;

    var sizeKb = (blob.size / 1024).toFixed(1);
    var url = URL.createObjectURL(blob);

    resultPreview.innerHTML = '';
    var outImg = document.createElement('img');
    outImg.src = url;
    outImg.alt = 'Processed output';
    outImg.className = 'max-w-full max-h-64 object-contain rounded-lg';
    resultPreview.appendChild(outImg);

    var inRange = parseFloat(sizeKb) >= currentSpec.minKb && parseFloat(sizeKb) <= currentSpec.maxKb;
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
    var a = document.createElement('a');
    a.href = URL.createObjectURL(processedBlob);
    var boardLabel = (currentBoard.name || 'exam').split('(')[0].trim().replace(/\s+/g, '_').toLowerCase();
    a.download = boardLabel + '_' + currentDocKey + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Boot
  buildBoardOptions();
})();
