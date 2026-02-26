/* =========================================================
   BerkenBot Dashboard — Office Layout Editor
   Drag-and-drop editor with profile save/load/export/import
   ========================================================= */
(function () {
  'use strict';

  let editMode = false;
  let currentLayout = null;
  let dragTarget = null;
  let dragStartSVG = null;   // SVG-space start point
  let dragStartPos = null;   // original translate of the element

  // ======== INIT ========
  function init() {
    const saved = localStorage.getItem('officeLayout');
    if (saved) {
      try { window.__officeLayout = JSON.parse(saved); } catch (e) {}
    }
    if (!document.getElementById('officeSvg')) { setTimeout(init, 200); return; }
    createToggleButton();
  }

  // Convert client coords to SVG viewBox coords
  function clientToSVG(clientX, clientY) {
    const svg = document.getElementById('officeSvg');
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }

  // ======== TOGGLE BUTTON ========
  function createToggleButton() {
    const container = document.querySelector('.office-section') || document.getElementById('agentOffice');
    if (!container) return;
    const btn = document.createElement('button');
    btn.id = 'layoutEditorToggle';
    btn.innerHTML = '✏️ Edit Layout';
    btn.title = 'Toggle layout editor';
    Object.assign(btn.style, {
      position: 'absolute', top: '8px', right: '8px',
      padding: '6px 12px', background: '#0a0f24', border: '2px solid #243052',
      borderRadius: '4px', color: '#b8c8f0',
      fontFamily: "'Press Start 2P', monospace", fontSize: '9px',
      cursor: 'pointer', zIndex: '1000',
    });
    btn.addEventListener('click', () => {
      editMode = !editMode;
      btn.innerHTML = editMode ? '🔓 Editing...' : '✏️ Edit Layout';
      btn.style.borderColor = editMode ? '#40f8a0' : '#243052';
      if (editMode) enterEditMode(); else exitEditMode(false);
    });
    container.style.position = 'relative';
    container.appendChild(btn);
  }

  // ======== EDIT MODE ========
  function enterEditMode() {
    currentLayout = extractCurrentLayout();
    createToolbar();

    const style = document.createElement('style');
    style.id = 'editorStyle';
    style.textContent = `
      [data-drag] { cursor: move !important; }
      [data-drag]:hover > :first-child { outline: 1.5px dashed #60a8f0; outline-offset: 2px; }
      [data-drag].dragging { opacity: 0.75; }
      [data-drag].dragging > :first-child { outline: 2px solid #40f8a0; outline-offset: 2px; }
    `;
    document.head.appendChild(style);
    setupDragHandlers();
  }

  function exitEditMode(save) {
    const toolbar = document.getElementById('layoutEditorToolbar');
    if (toolbar) toolbar.remove();
    const style = document.getElementById('editorStyle');
    if (style) style.remove();
    hideDragTooltip();
    removeDragHandlers();
    if (save && currentLayout) {
      localStorage.setItem('officeLayout', JSON.stringify(currentLayout));
      window.__officeLayout = currentLayout;
    }
    const btn = document.getElementById('layoutEditorToggle');
    if (btn) { btn.innerHTML = '✏️ Edit Layout'; btn.style.borderColor = '#243052'; }
    editMode = false;
    currentLayout = null;
  }

  // ======== TOOLBAR ========
  function createToolbar() {
    const old = document.getElementById('layoutEditorToolbar');
    if (old) old.remove();

    const toolbar = document.createElement('div');
    toolbar.id = 'layoutEditorToolbar';
    Object.assign(toolbar.style, {
      position: 'fixed', top: '50%', right: '12px', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px',
      background: '#0a0f24ee', border: '2px solid #243052', borderRadius: '8px',
      zIndex: '1001', boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    });

    const buttons = [
      { icon: '✅', label: 'Set', action: () => { exitEditMode(true); rebuild(); } },
      { icon: '💾', label: 'Save', action: actionSaveProfile },
      { icon: '📂', label: 'Load', action: actionLoadProfile },
      { icon: '📤', label: 'Export', action: actionExport },
      { icon: '📥', label: 'Import', action: actionImport },
      { icon: '🔄', label: 'Reset', action: actionReset },
      { icon: '❌', label: 'Cancel', action: () => { exitEditMode(false); rebuild(); } },
    ];

    buttons.forEach(({ icon, label, action }) => {
      const btn = document.createElement('button');
      btn.textContent = `${icon} ${label}`;
      Object.assign(btn.style, {
        padding: '8px 10px', background: '#0a0f24', border: '1.5px solid #243052',
        borderRadius: '4px', color: '#b8c8f0',
        fontFamily: "'Press Start 2P', monospace", fontSize: '8px',
        cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap',
      });
      btn.addEventListener('mouseenter', () => { btn.style.background = '#1a2548'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = '#0a0f24'; });
      btn.addEventListener('click', action);
      toolbar.appendChild(btn);
    });

    document.body.appendChild(toolbar);
  }

  // ======== DRAG HANDLERS ========
  let boundDown, boundMove, boundUp;

  function setupDragHandlers() {
    const svg = document.getElementById('officeSvg');
    if (!svg) return;
    boundDown = onDragStart.bind(null);
    boundMove = onDragMove.bind(null);
    boundUp = onDragEnd.bind(null);
    // Use capture phase to intercept before zoom/pan handlers
    svg.addEventListener('mousedown', boundDown, true);
    svg.addEventListener('touchstart', boundDown, { capture: true, passive: false });
    window.addEventListener('mousemove', boundMove, true);
    window.addEventListener('touchmove', boundMove, { capture: true, passive: false });
    window.addEventListener('mouseup', boundUp, true);
    window.addEventListener('touchend', boundUp, true);
  }

  function removeDragHandlers() {
    const svg = document.getElementById('officeSvg');
    if (!svg) return;
    svg.removeEventListener('mousedown', boundDown, true);
    svg.removeEventListener('touchstart', boundDown, true);
    window.removeEventListener('mousemove', boundMove, true);
    window.removeEventListener('touchmove', boundMove, true);
    window.removeEventListener('mouseup', boundUp, true);
    window.removeEventListener('touchend', boundUp, true);
  }

  function getXY(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function onDragStart(e) {
    if (!editMode) return;
    const xy = getXY(e);
    const el = document.elementFromPoint(xy.x, xy.y);
    if (!el) return;
    const target = el.closest('[data-drag]');
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    dragTarget = target;
    dragTarget.classList.add('dragging');

    dragStartSVG = clientToSVG(xy.x, xy.y);

    const transform = dragTarget.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*([^,\s]+)[,\s]+([^)\s]+)\s*\)/);
    dragStartPos = match
      ? { x: parseFloat(match[1]), y: parseFloat(match[2]) }
      : { x: 0, y: 0 };

    showDragTooltip(dragTarget.getAttribute('data-drag'), dragStartPos.x, dragStartPos.y);
  }

  function onDragMove(e) {
    if (!dragTarget) return;
    e.preventDefault();
    e.stopPropagation();

    const xy = getXY(e);
    const svgPt = clientToSVG(xy.x, xy.y);
    const dx = svgPt.x - dragStartSVG.x;
    const dy = svgPt.y - dragStartSVG.y;

    const newX = Math.round(dragStartPos.x + dx);
    const newY = Math.round(dragStartPos.y + dy);

    dragTarget.setAttribute('transform', `translate(${newX},${newY})`);

    const key = dragTarget.getAttribute('data-drag');
    if (key && currentLayout) {
      currentLayout[key] = { x: newX, y: newY };
    }

    showDragTooltip(key, newX, newY);
  }

  function onDragEnd(e) {
    if (!dragTarget) return;
    e.stopPropagation();
    dragTarget.classList.remove('dragging');
    dragTarget = null;
    dragStartSVG = null;
    dragStartPos = null;
    hideDragTooltip();
  }

  // ======== TOOLTIP ========
  let tooltip = null;

  function showDragTooltip(name, x, y) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'dragTooltip';
      Object.assign(tooltip.style, {
        position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)',
        padding: '6px 14px', background: '#0a0f24', border: '2px solid #40f8a0',
        borderRadius: '4px', color: '#40f8a0',
        fontFamily: "'Press Start 2P', monospace", fontSize: '9px',
        zIndex: '1002', pointerEvents: 'none',
      });
      document.body.appendChild(tooltip);
    }
    tooltip.textContent = `${name}  x:${x}  y:${y}`;
    tooltip.style.display = 'block';
  }

  function hideDragTooltip() {
    if (tooltip) tooltip.style.display = 'none';
  }

  // ======== REBUILD HELPER ========
  function rebuild() {
    const st = window.__officeState;
    if (st && st.rebuild) st.rebuild();
  }

  // ======== ACTIONS ========
  function actionSaveProfile() {
    const name = prompt('Profile name:');
    if (!name) return;
    const profiles = JSON.parse(localStorage.getItem('officeProfiles') || '{}');
    profiles[name] = { ...currentLayout };
    localStorage.setItem('officeProfiles', JSON.stringify(profiles));
    alert(`Profile "${name}" saved.`);
  }

  function actionLoadProfile() {
    const profiles = JSON.parse(localStorage.getItem('officeProfiles') || '{}');
    const names = Object.keys(profiles);
    if (!names.length) { alert('No profiles saved yet.'); return; }
    const name = prompt('Load profile:\n' + names.join('\n'));
    if (!name || !profiles[name]) return;
    window.__officeLayout = profiles[name];
    localStorage.setItem('officeLayout', JSON.stringify(profiles[name]));
    exitEditMode(false);
    rebuild();
  }

  function actionExport() {
    const json = JSON.stringify(currentLayout, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `office-layout-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  function actionImport() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const layout = JSON.parse(ev.target.result);
          window.__officeLayout = layout;
          localStorage.setItem('officeLayout', JSON.stringify(layout));
          exitEditMode(false);
          rebuild();
        } catch (err) { alert('Invalid JSON: ' + err.message); }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function actionReset() {
    if (!confirm('Reset to default layout?')) return;
    window.__officeLayout = {};
    localStorage.removeItem('officeLayout');
    exitEditMode(false);
    rebuild();
  }

  // ======== HELPERS ========
  function extractCurrentLayout() {
    const layout = {};
    document.querySelectorAll('[data-drag]').forEach(el => {
      const key = el.getAttribute('data-drag');
      const t = el.getAttribute('transform') || '';
      const m = t.match(/translate\(\s*([^,\s]+)[,\s]+([^)\s]+)\s*\)/);
      if (m) layout[key] = { x: Math.round(parseFloat(m[1])), y: Math.round(parseFloat(m[2])) };
    });
    return layout;
  }

  // ======== START ========
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
