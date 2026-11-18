
(function () {
  'use strict';

  let zoom = 0.75;
  const STEP = 0.05, MIN = 0.15, MAX = 1.5;
  const cert = document.getElementById('certOuter');
  const zoomLbl = document.getElementById('zoomLbl');

  /* bindings: [inputId, outputId, transform?, isHTML?] */
  const bindings = [
    ['schoolCode', 'o-code'],
    ['schoolEmail', 'o-email'],
    ['schoolAddress', 'o-addr1'],
    ['schoolAddress2', 'o-addr2'],
    ['serialNo', 'o-serial', v => v || '....................'],
    ['studentName', 'o-stuname'],
    ['fatherName', 'o-dadname'],
    ['motherName', 'o-mom'],
    ['gpa', 'o-gpa'],
    ['yearBS', 'o-year', () =>
      document.getElementById('yearBS').value +
      ' (' + document.getElementById('yearAD').value + ')'],
    ['yearAD', 'o-year', () =>
      document.getElementById('yearBS').value +
      ' (' + document.getElementById('yearAD').value + ')'],
    ['dobBS', 'o-dobbs'],
    ['dobAD', 'o-dobad'],
    ['seeReg', 'o-seereg'],
    ['seeSymbol', 'o-seesym'],
    ['studentAddr', 'o-stuaddr'],
    ['issueDate', 'o-date', v => v || '................'],
    ['preparedBy', 'o-prepby'],
    ['principalLbl', 'o-prinlbl'],
  ];

  function applyOne(inputId, outputId, transform, isHTML) {
    const inp = document.getElementById(inputId);
    const out = document.getElementById(outputId);
    if (!inp || !out) return;
    const val = transform ? transform(inp.value) : inp.value;
    if (isHTML) out.innerHTML = val; else out.textContent = val;
  }

  function applyAll() {
    bindings.forEach(([a, b, c, d]) => applyOne(a, b, c, d));
  }

  bindings.forEach(([inputId, outputId, transform, isHTML]) => {
    const inp = document.getElementById(inputId);
    if (inp) inp.addEventListener('input', () => applyOne(inputId, outputId, transform, isHTML));
  });

  applyAll();

  /* ── Background ── */
  const bgFile = document.getElementById('bgFile');
  const bgImg = document.getElementById('certBgImg');
  const bgText = document.getElementById('bgText');
  const bgBox = document.getElementById('bgBox');
  const DEFAULT_SRC = 'assets/certificate_bg.png';

  bgFile.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    bgImg.src = URL.createObjectURL(f);
    bgText.textContent = f.name;
    bgBox.classList.add('active');
  });
  document.getElementById('resetBg').addEventListener('click', () => {
    bgImg.src = DEFAULT_SRC;
    bgFile.value = '';
    bgText.textContent = 'certificate_bg.png (active)';
    bgBox.classList.remove('active');
  });

  /* ── Logo ── */
  const logoFile = document.getElementById('logoFile');
  const logoImg = document.getElementById('certLogoImg');
  const logoText = document.getElementById('logoText');
  const logoBox = document.getElementById('logoBox');
  logoFile.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    logoImg.src = URL.createObjectURL(f);
    logoImg.style.display = 'block';
    logoText.textContent = f.name;
    logoBox.classList.add('active');
  });

  /* ── Student Photo ── */
  const photoFile = document.getElementById('photoFile');
  const photoImg = document.getElementById('certPhotoImg');
  const photoText = document.getElementById('photoText');
  const photoBox = document.getElementById('photoBox');
  photoFile.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    photoImg.src = URL.createObjectURL(f);
    photoImg.style.display = 'block';
    photoText.textContent = f.name;
    photoBox.classList.add('active');
  });

  /* ── Zoom & Stage Sizing ── */
  const stage = document.querySelector('.cert-stage');
  const fitBtn = document.getElementById('fitBtn');
  const actualBtn = document.getElementById('actualBtn');
  let currentMode = window.innerWidth <= 768 ? 'actual' : 'fit';

  function setZoom() {
    cert.style.transform = 'scale(' + zoom + ')';
    if (stage) {
      stage.style.width = (794 * zoom) + 'px';
      stage.style.height = (1123 * zoom) + 'px';
    }
    zoomLbl.textContent = Math.round(zoom * 100) + '%';

    if (Math.abs(zoom - 1.0) < 0.02) {
      if (actualBtn) actualBtn.classList.add('active');
      if (fitBtn && currentMode !== 'fit') fitBtn.classList.remove('active');
    } else {
      if (actualBtn) actualBtn.classList.remove('active');
    }
  }

  function setActualSize() {
    currentMode = 'actual';
    zoom = 1.0;
    setZoom();
    if (actualBtn) actualBtn.classList.add('active');
    if (fitBtn) fitBtn.classList.remove('active');
    const scrollEl = document.getElementById('previewScroll');
    if (scrollEl && scrollEl.scrollWidth > scrollEl.clientWidth) {
      scrollEl.scrollLeft = (scrollEl.scrollWidth - scrollEl.clientWidth) / 2;
    }
  }

  function autoFit() {
    currentMode = 'fit';
    const scrollEl = document.getElementById('previewScroll');
    if (!scrollEl) return;
    const isMobile = window.innerWidth <= 768;
    const padW = isMobile ? 16 : 100;
    const padH = isMobile ? 24 : 80;
    const aw = scrollEl.clientWidth - padW;
    const ah = scrollEl.clientHeight - padH;
    const fitW = aw / 794;
    const fitH = ah / 1123;
    const target = isMobile ? fitW : Math.min(fitW, fitH);
    zoom = Math.min(1.2, Math.max(MIN, +target.toFixed(2)));
    setZoom();
    if (fitBtn) fitBtn.classList.add('active');
    if (actualBtn) actualBtn.classList.remove('active');
  }

  document.getElementById('zoomIn').addEventListener('click', () => {
    currentMode = 'manual';
    if (zoom < MAX) {
      zoom = Math.min(MAX, +(zoom + STEP).toFixed(2));
      setZoom();
      if (fitBtn) fitBtn.classList.remove('active');
    }
  });

  document.getElementById('zoomOut').addEventListener('click', () => {
    currentMode = 'manual';
    if (zoom > MIN) {
      zoom = Math.max(MIN, +(zoom - STEP).toFixed(2));
      setZoom();
      if (fitBtn) fitBtn.classList.remove('active');
    }
  });

  if (fitBtn) fitBtn.addEventListener('click', autoFit);
  if (actualBtn) actualBtn.addEventListener('click', setActualSize);

  /* Touch Pinch to Zoom on Mobile */
  const previewScroll = document.getElementById('previewScroll');
  if (previewScroll) {
    let initialDist = null;
    let initialZoom = zoom;

    previewScroll.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = zoom;
      }
    }, { passive: true });

    previewScroll.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialDist) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDist / initialDist;
        const newZoom = Math.min(MAX, Math.max(MIN, +(initialZoom * factor).toFixed(2)));
        if (Math.abs(newZoom - zoom) >= 0.01) {
          currentMode = 'manual';
          zoom = newZoom;
          setZoom();
          if (fitBtn) fitBtn.classList.remove('active');
        }
      }
    }, { passive: true });

    previewScroll.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialDist = null;
      }
    }, { passive: true });
  }

  /* ── Mobile Tabs ── */
  const tabEditor = document.getElementById('tabEditor');
  const tabPreview = document.getElementById('tabPreview');
  const sidebar = document.getElementById('sidebar');
  const previewWrap = document.querySelector('.preview-wrap');

  function showEditorTab() {
    if (tabEditor && tabPreview && sidebar && previewWrap) {
      tabEditor.classList.add('active');
      tabPreview.classList.remove('active');
      sidebar.classList.remove('mobile-hidden');
      previewWrap.classList.add('mobile-hidden');
    }
  }

  function showPreviewTab() {
    if (tabEditor && tabPreview && sidebar && previewWrap) {
      tabPreview.classList.add('active');
      tabEditor.classList.remove('active');
      sidebar.classList.add('mobile-hidden');
      previewWrap.classList.remove('mobile-hidden');
      if (currentMode === 'actual') {
        setActualSize();
      } else {
        setTimeout(autoFit, 60);
      }
    }
  }

  if (tabEditor && tabPreview) {
    tabEditor.addEventListener('click', showEditorTab);
    tabPreview.addEventListener('click', showPreviewTab);

    function checkMobileView() {
      if (window.innerWidth <= 768) {
        if (!tabPreview.classList.contains('active')) {
          showEditorTab();
        }
        if (currentMode === 'actual') {
          setActualSize();
        } else {
          autoFit();
        }
      } else {
        sidebar.classList.remove('mobile-hidden');
        previewWrap.classList.remove('mobile-hidden');
        if (currentMode === 'fit') {
          autoFit();
        } else {
          setZoom();
        }
      }
    }
    window.addEventListener('resize', checkMobileView);
  }

  /* ── Sidebar Desktop Toggle ── */
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    setTimeout(() => {
      if (currentMode === 'fit') autoFit();
      else setZoom();
    }, 320);
  });

  /* ── Download PDF ── */
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async () => {
      const studentName = (document.getElementById('studentName')?.value || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${studentName}_Character_Certificate.pdf`;

      const origHTML = downloadPdfBtn.innerHTML;
      downloadPdfBtn.innerHTML = '&#9203; Generating PDF...';
      downloadPdfBtn.disabled = true;

      // Save original cert styles
      const prev = {
        transform: cert.style.transform,
        position: cert.style.position,
        top: cert.style.top,
        left: cert.style.left,
        backgroundColor: cert.style.backgroundColor,
        boxShadow: cert.style.boxShadow,
        overflow: cert.style.overflow,
        zIndex: cert.style.zIndex,
        width: cert.style.width,
        height: cert.style.height,
      };

      // Pin cert at top-left at exact A4 pixel size, no transform
      cert.style.position = 'fixed';
      cert.style.top = '0px';
      cert.style.left = '0px';
      cert.style.width = '794px';
      cert.style.height = '1123px';
      cert.style.transform = 'none';
      cert.style.backgroundColor = '#ffffff';
      cert.style.boxShadow = 'none';
      cert.style.overflow = 'visible';
      cert.style.zIndex = '99999';

      // Wait for fonts and layout
      await document.fonts.ready;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      try {
        // Use standalone html2canvas to capture the element
        const canvas = await window.html2canvas(cert, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794,
          height: 1123,
          scrollX: 0,
          scrollY: 0
        });

        // Build PDF with jsPDF — image fills entire A4 page (210×297mm)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        doc.save(filename);

      } catch (err) {
        console.error('PDF export error:', err);
        window.print();
      } finally {
        // Restore all styles
        Object.assign(cert.style, prev);
        downloadPdfBtn.innerHTML = origHTML;
        downloadPdfBtn.disabled = false;
      }
    });
  }

  /* ── Print ── */
  document.getElementById('printBtn').addEventListener('click', () => {
    const prev = cert.style.transform;
    const prevStageW = stage ? stage.style.width : '';
    const prevStageH = stage ? stage.style.height : '';
    cert.style.transform = 'none';
    if (stage) {
      stage.style.width = '';
      stage.style.height = '';
    }
    window.print();
    setTimeout(() => {
      cert.style.transform = prev;
      if (stage) {
        stage.style.width = prevStageW;
        stage.style.height = prevStageH;
      }
    }, 600);
  });

  /* ── Refresh ── */
  document.getElementById('updateBtn').addEventListener('click', applyAll);

  /* ── Initial sizing on load ── */
  window.addEventListener('load', () => {
    if (window.innerWidth <= 768) {
      setActualSize();
    } else {
      autoFit();
    }
  });

})();
