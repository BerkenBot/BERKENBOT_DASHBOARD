/* =========================================================
   BerkenBot Dashboard — Office Layout Editor
   Drag-and-drop editor with profile save/load/export/import
   ========================================================= */
(function () {
  'use strict';

  let editMode = false;
  let currentLayout = null;
  let dragTarget = null;
  let dragStartMouse = null;
  let dragStartPos = null;

  // ======== INIT ========
  function init() {
    // Load saved layout from localStorage
    const saved = localStorage.getItem('officeLayout');
    if (saved) {
      try {
        window.__officeLayout = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved layout:', e);
      }
    }

    // Wait for office to be ready
    if (!document.getElementById('officeSvg')) {
      setTimeout(init, 100);
      return;
    }

    createToggleButton();
  }

  // ======== TOGGLE BUTTON ========
  function createToggleButton() {
    const container = document.querySelector('.office-section');
    if (!container) return;

    const btn = document.createElement('button');
    btn.id = 'layoutEditorToggle';
    btn.innerHTML = '✏️ Edit';
    btn.title = 'Toggle layout editor';
    Object.assign(btn.style, {
      position: 'absolute',
      top: '16px',
      right: '16px',
      padding: '8px 16px',
      background: '#0a0f24',
      border: '2px solid #243052',
      borderRadius: '4px',
      color: '#b8c8f0',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px',
      cursor: 'pointer',
      zIndex: '1000',
      transition: 'all 0.2s',
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#243052';
      btn.style.borderColor = '#3a4872';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#0a0f24';
      btn.style.borderColor = '#243052';
    });

    btn.addEventListener('click', () => {
      editMode = !editMode;
      btn.innerHTML = editMode ? '❌ Exit' : '✏️ Edit';
      if (editMode) {
        enterEditMode();
      } else {
        exitEditMode();
      }
    });

    container.style.position = 'relative';
    container.appendChild(btn);
  }

  // ======== EDIT MODE ========
  function enterEditMode() {
    // Clone current layout
    currentLayout = extractCurrentLayout();

    // Create toolbar
    createToolbar();

    // Add drag handlers
    setupDragHandlers();

    // Add hover styles
    const style = document.createElement('style');
    style.id = 'editorHoverStyle';
    style.textContent = `
      [data-drag] {
        outline: 2px dashed transparent;
        outline-offset: 2px;
        transition: outline 0.2s;
        cursor: move !important;
      }
      [data-drag]:hover {
        outline-color: #60a8f0;
      }
      [data-drag].dragging {
        outline-color: #40f8a0;
        opacity: 0.7;
      }
    `;
    document.head.appendChild(style);

    // Disable zoom/pan during drag
    const wrap = document.getElementById('officeZoomWrap');
    if (wrap) {
      wrap.__originalPointerEvents = wrap.style.pointerEvents;
      wrap.style.pointerEvents = 'none';
    }
  }

  function exitEditMode() {
    // Remove toolbar
    const toolbar = document.getElementById('layoutEditorToolbar');
    if (toolbar) toolbar.remove();

    // Remove hover styles
    const style = document.getElementById('editorHoverStyle');
    if (style) style.remove();

    // Remove drag handlers
    removeDragHandlers();

    // Re-enable zoom/pan
    const wrap = document.getElementById('officeZoomWrap');
    if (wrap && wrap.__originalPointerEvents !== undefined) {
      wrap.style.pointerEvents = wrap.__originalPointerEvents;
    }

    currentLayout = null;
  }

  // ======== TOOLBAR ========
  function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'layoutEditorToolbar';
    Object.assign(toolbar.style, {
      position: 'fixed',
      top: '50%',
      right: '16px',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px',
      background: '#0a0f24',
      border: '2px solid #243052',
      borderRadius: '8px',
      zIndex: '1001',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    });

    const buttons = [
      { icon: '✅', label: 'Set', title: 'Save and exit', action: actionSet },
      { icon: '💾', label: 'Save Profile', title: 'Save as named profile', action: actionSaveProfile },
      { icon: '📂', label: 'Load Profile', title: 'Load a saved profile', action: actionLoadProfile },
      { icon: '📤', label: 'Export', title: 'Download as JSON', action: actionExport },
      { icon: '📥', label: 'Import', title: 'Load from JSON file', action: actionImport },
      { icon: '🔄', label: 'Reset', title: 'Revert to default', action: actionReset },
      { icon: '❌', label: 'Cancel', title: 'Discard changes', action: actionCancel },
    ];

    buttons.forEach(({ icon, label, title, action }) => {
      const btn = document.createElement('button');
      btn.innerHTML = `${icon} <span style="font-size:8px;margin-left:4px">${label}</span>`;
      btn.title = title;
      Object.assign(btn.style, {
        padding: '10px 12px',
        background: '#0a0f24',
        border: '2px solid #243052',
        borderRadius: '4px',
        color: '#b8c8f0',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        textAlign: 'left',
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#243052';
        btn.style.borderColor = '#3a4872';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#0a0f24';
        btn.style.borderColor = '#243052';
      });

      btn.addEventListener('click', action);
      toolbar.appendChild(btn);
    });

    document.body.appendChild(toolbar);
  }

  // ======== DRAG HANDLERS ========
  function setupDragHandlers() {
    const svg = document.getElementById('officeSvg');
    if (!svg) return;

    svg.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  }

  function removeDragHandlers() {
    const svg = document.getElementById('officeSvg');
    if (!svg) return;

    svg.removeEventListener('mousedown', onDragStart);
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
  }

  function onDragStart(e) {
    const target = e.target.closest('[data-drag]');
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    dragTarget = target;
    dragTarget.classList.add('dragging');
    dragStartMouse = { x: e.clientX, y: e.clientY };

    // Extract current transform
    const transform = dragTarget.getAttribute('transform') || '';
    const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
    if (match) {
      dragStartPos = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    } else {
      dragStartPos = { x: 0, y: 0 };
    }

    // Show tooltip
    showDragTooltip(dragStartPos.x, dragStartPos.y);
  }

  function onDragMove(e) {
    if (!dragTarget || !dragStartMouse) return;

    e.preventDefault();

    // Convert screen pixels to SVG coordinates
    const state = window.__officeState || {};
    const svg = document.getElementById('officeSvg');
    const wrap = document.getElementById('officeZoomWrap');
    if (!svg || !wrap) return;

    // Calculate SVG coordinate delta
    const viewBox = svg.viewBox.baseVal;
    const wrapRect = wrap.getBoundingClientRect();
    const scale = state.oScale || 1;
    
    // Screen pixel delta
    const dx = e.clientX - dragStartMouse.x;
    const dy = e.clientY - dragStartMouse.y;

    // Convert to SVG space
    const svgDx = (dx / wrapRect.width) * viewBox.width / scale;
    const svgDy = (dy / wrapRect.height) * viewBox.height / scale;

    const newX = dragStartPos.x + svgDx;
    const newY = dragStartPos.y + svgDy;

    // Update transform
    const otherTransforms = (dragTarget.getAttribute('transform') || '')
      .replace(/translate\([^)]+\)/, '')
      .trim();
    dragTarget.setAttribute(
      'transform',
      `translate(${newX.toFixed(1)},${newY.toFixed(1)}) ${otherTransforms}`.trim()
    );

    // Update tooltip
    showDragTooltip(newX, newY);

    // Update currentLayout
    const key = dragTarget.getAttribute('data-drag');
    if (key && currentLayout[key]) {
      currentLayout[key].x = Math.round(newX);
      currentLayout[key].y = Math.round(newY);
    }
  }

  function onDragEnd(e) {
    if (!dragTarget) return;

    dragTarget.classList.remove('dragging');
    dragTarget = null;
    dragStartMouse = null;
    dragStartPos = null;

    // Hide tooltip
    hideDragTooltip();
  }

  // ======== TOOLTIP ========
  let tooltip = null;

  function showDragTooltip(x, y) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'dragTooltip';
      Object.assign(tooltip.style, {
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 16px',
        background: '#0a0f24',
        border: '2px solid #40f8a0',
        borderRadius: '4px',
        color: '#40f8a0',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        zIndex: '1002',
        pointerEvents: 'none',
      });
      document.body.appendChild(tooltip);
    }
    tooltip.textContent = `x: ${Math.round(x)}, y: ${Math.round(y)}`;
    tooltip.style.display = 'block';
  }

  function hideDragTooltip() {
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  // ======== ACTIONS ========
  function actionSet() {
    // Save current layout to localStorage
    localStorage.setItem('officeLayout', JSON.stringify(currentLayout));
    window.__officeLayout = currentLayout;
    
    // Exit edit mode
    editMode = false;
    document.getElementById('layoutEditorToggle').innerHTML = '✏️ Edit';
    exitEditMode();
    
    // Rebuild office
    if (window.__officeState && window.__officeState.rebuild) {
      window.__officeState.rebuild();
    }
  }

  function actionSaveProfile() {
    const name = prompt('Profile name:');
    if (!name) return;

    const profiles = JSON.parse(localStorage.getItem('officeProfiles') || '{}');
    profiles[name] = currentLayout;
    localStorage.setItem('officeProfiles', JSON.stringify(profiles));

    alert(`Profile "${name}" saved!`);
  }

  function actionLoadProfile() {
    const profiles = JSON.parse(localStorage.getItem('officeProfiles') || '{}');
    const names = Object.keys(profiles);

    if (names.length === 0) {
      alert('No saved profiles found.');
      return;
    }

    const name = prompt(`Choose profile:\n${names.join('\n')}`);
    if (!name || !profiles[name]) return;

    currentLayout = profiles[name];
    window.__officeLayout = currentLayout;

    // Exit edit mode
    editMode = false;
    document.getElementById('layoutEditorToggle').innerHTML = '✏️ Edit';
    exitEditMode();

    // Rebuild
    if (window.__officeState && window.__officeState.rebuild) {
      window.__officeState.rebuild();
    }
  }

  function actionExport() {
    const json = JSON.stringify(currentLayout, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `office-layout-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function actionImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const layout = JSON.parse(ev.target.result);
          currentLayout = layout;
          window.__officeLayout = layout;

          // Exit edit mode
          editMode = false;
          document.getElementById('layoutEditorToggle').innerHTML = '✏️ Edit';
          exitEditMode();

          // Rebuild
          if (window.__officeState && window.__officeState.rebuild) {
            window.__officeState.rebuild();
          }
        } catch (err) {
          alert('Failed to parse JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function actionReset() {
    if (!confirm('Reset to default layout?')) return;

    currentLayout = {};
    window.__officeLayout = {};
    localStorage.removeItem('officeLayout');

    // Exit edit mode
    editMode = false;
    document.getElementById('layoutEditorToggle').innerHTML = '✏️ Edit';
    exitEditMode();

    // Rebuild
    if (window.__officeState && window.__officeState.rebuild) {
      window.__officeState.rebuild();
    }
  }

  function actionCancel() {
    if (!confirm('Discard changes?')) return;

    // Exit edit mode without saving
    editMode = false;
    document.getElementById('layoutEditorToggle').innerHTML = '✏️ Edit';
    exitEditMode();

    // Rebuild to restore previous state
    if (window.__officeState && window.__officeState.rebuild) {
      window.__officeState.rebuild();
    }
  }

  // ======== HELPERS ========
  function extractCurrentLayout() {
    const layout = {};
    const draggables = document.querySelectorAll('[data-drag]');

    draggables.forEach((el) => {
      const key = el.getAttribute('data-drag');
      const transform = el.getAttribute('transform') || '';
      const match = transform.match(/translate\(([^,]+),([^)]+)\)/);

      if (match) {
        layout[key] = {
          x: Math.round(parseFloat(match[1])),
          y: Math.round(parseFloat(match[2])),
        };
      }
    });

    return layout;
  }

  // ======== START ========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
