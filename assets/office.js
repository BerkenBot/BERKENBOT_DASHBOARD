/* =========================================================
   BERKENBOT DASHBOARD — AGENT OFFICE
   "Midnight Studio" — Moody, atmospheric pixel art office
   Apple Design Award quality redesign
   ========================================================= */
(function () {
  'use strict';

  /* ==================== REFINED PALETTE ==================== */
  const P = {
    // Base atmosphere
    base: '#0a0e1a',
    wall: '#12162a',
    wallGrad: '#0e1222',
    
    // Hero neon
    neonPurple: '#8b5cf6',
    neonPink: '#ec4899',
    
    // Light sources
    warmLight: '#fbbf24',
    monitorBlue: '#3b82f6',
    successGreen: '#10b981',
    
    // Materials
    steel: '#475569',
    steelLight: '#94a3b8',
    steelDark: '#334155',
    wood: '#92684a',
    woodLight: '#b8845f',
    woodDark: '#6b4e35',
    
    // Floor
    floor: '#0d1018',
    floorLight: '#13151f',
    
    // Skin tones
    skin: '#f4c08a',
    skinHi: '#fce0b8',
    skinShd: '#d48e5c',
    
    // Brick
    brick: '#8b4513',
    brickHi: '#a0522d',
    brickDk: '#6b3410',
    
    // Glass & monitors
    glass: '#6ab4f8',
    monitorBg: '#080c14',
    monitorBezel: '#1a1e28',
    
    // Plants
    plant: '#20b880',
    plantDk: '#109868',
    plantHi: '#60f0c0',
    
    // Accents
    white: '#ffffff',
    errorRed: '#ef4444',
    warningYellow: '#f59e0b',
  };

  /* ==================== UTILITY FUNCTIONS ==================== */
  function px(x, y, w, h, fill, opacity) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${opacity !== undefined ? ` opacity="${opacity}"` : ''} shape-rendering="crispEdges"/>`;
  }

  function txt(x, y, text, size, fill, anchor, bold) {
    return `<text x="${x}" y="${y}" fill="${fill || P.white}" font-family="'Press Start 2P',monospace" font-size="${size || 3}" text-anchor="${anchor || 'middle'}"${bold ? ' font-weight="bold"' : ''}>${text}</text>`;
  }

  function txt16(x, y, text, size, fill, anchor) {
    return txt(x + 0.5, y + 0.5, text, size, '#000', anchor) + txt(x, y, text, size, fill, anchor, true);
  }

  /* ==================== BRICK WALL ==================== */
  function brickWall(endX) {
    let s = '';
    for (let row = 0; row < 20; row++) {
      const y = row * 4;
      const offset = (row % 2) ? 5 : 0;
      for (let col = -1; col < Math.ceil(endX / 10) + 1; col++) {
        const x = col * 10 + offset;
        if (x + 9 < 0 || x > endX) continue;
        const cx = Math.max(0, x);
        const cw = Math.min(9, endX - cx, x + 9 - cx);
        if (cw <= 0) continue;
        const shade = (col + row) % 3 === 0 ? P.brickHi : (col + row) % 3 === 1 ? P.brick : P.brickDk;
        s += px(cx, y, cw, 1, P.brickHi, 0.3);
        s += px(cx, y + 1, cw, 2, shade);
        s += px(cx, y + 3, cw, 0.5, P.brickDk, 0.5);
      }
    }
    return s;
  }

  /* ==================== HERO NEON SIGN ==================== */
  function heroNeonSign(x, y, text, color) {
    let s = '';
    const tubeColor = color || P.neonPurple;
    
    // Mounting brackets (visible hardware)
    s += px(x - 3, y - 2, 2, 1, P.steel);
    s += px(x + 68, y - 2, 2, 1, P.steel);
    s += `<circle cx="${x - 2}" cy="${y - 1.5}" r="0.8" fill="${P.steelDark}"/>`;
    s += `<circle cx="${x + 69}" cy="${y - 1.5}" r="0.8" fill="${P.steelDark}"/>`;
    
    // Triple-layer glow: wide atmospheric bloom → mid-range glow → tight core
    s += `<text x="${x}" y="${y}" fill="${tubeColor}" font-family="'Press Start 2P',monospace" font-size="6" opacity="0.15" filter="url(#neonBloom)">${text}</text>`;
    s += `<text x="${x}" y="${y}" fill="${tubeColor}" font-family="'Press Start 2P',monospace" font-size="6" opacity="0.4" filter="url(#neonMid)">${text}</text>`;
    s += `<text x="${x}" y="${y}" fill="${tubeColor}" font-family="'Press Start 2P',monospace" font-size="6" opacity="0.8" filter="url(#neonCore)">${text}</text>`;
    s += `<text x="${x}" y="${y}" fill="#ffffff" font-family="'Press Start 2P',monospace" font-size="6" opacity="0.95">${text}</text>`;
    
    return s;
  }

  function smallNeonSign(x, y, text, color) {
    let s = '';
    const tubeColor = color || P.neonPink;
    s += `<text x="${x}" y="${y}" fill="${tubeColor}" font-family="'Press Start 2P',monospace" font-size="3" opacity="0.15" filter="url(#neonBloom)">${text}</text>`;
    s += `<text x="${x}" y="${y}" fill="${tubeColor}" font-family="'Press Start 2P',monospace" font-size="3" opacity="0.5" filter="url(#neonMid)">${text}</text>`;
    s += `<text x="${x}" y="${y}" fill="${tubeColor}" font-family="'Press Start 2P',monospace" font-size="3" opacity="0.9">${text}</text>`;
    return s;
  }

  /* ==================== PENDANT LIGHT WITH CONE ==================== */
  function pendantLight(x, y) {
    let s = '';
    // Cable
    s += px(x + 2, y, 0.5, 8, P.steelDark, 0.6);
    // Shade
    s += px(x, y + 8, 4, 1, P.steel);
    s += px(x - 1, y + 9, 6, 2, P.steelDark);
    s += px(x, y + 9, 4, 1, P.steelLight, 0.2);
    // Bulb
    s += `<circle cx="${x + 2}" cy="${y + 12}" r="1.2" fill="${P.warmLight}" opacity="0.9"/>`;
    s += `<circle cx="${x + 2}" cy="${y + 12}" r="0.5" fill="${P.white}" opacity="0.6"/>`;
    // Light cone onto floor (warm golden)
    s += `<polygon class="light-cone" points="${x - 4},${y + 50} ${x + 8},${y + 50} ${x + 4},${y + 13} ${x},${y + 13}" fill="${P.warmLight}" opacity="0.08"/>`;
    s += `<polygon class="light-cone" points="${x - 8},${y + 80} ${x + 12},${y + 80} ${x + 5},${y + 13} ${x - 1},${y + 13}" fill="${P.warmLight}" opacity="0.04"/>`;
    return s;
  }

  /* ==================== DESK ==================== */
  function desk(w) {
    let s = '';
    w = w || 40;
    // Desktop
    s += px(0, 0, w, 1, P.woodLight);
    s += px(0, 1, w, 2, P.wood);
    s += px(0, 3, w, 1, P.woodDark);
    // Grain detail
    for (let g = 4; g < w; g += 8) s += px(g, 1, 3, 1, P.woodLight, 0.15);
    // Legs
    s += px(2, 4, 2, 20, P.steel);
    s += px(w - 4, 4, 2, 20, P.steel);
    s += px(2, 4, 1, 20, P.steelLight, 0.3);
    s += px(w - 4, 4, 1, 20, P.steelLight, 0.3);
    // Feet
    s += px(0, 24, 7, 1.5, P.steelDark);
    s += px(w - 7, 24, 7, 1.5, P.steelDark);
    return s;
  }

  /* ==================== DUAL MONITORS WITH ANIMATED CONTENT ==================== */
  function dualMonitors(on, content, agentIdx) {
    let s = '';
    // Monitor L
    s += px(0, 0, 14, 11, P.monitorBezel);
    s += px(0.5, 0.5, 13, 10, P.monitorBezel, 0.8);
    s += px(1, 1, 12, 9, P.monitorBg);
    // Monitor R
    s += px(15, 0, 14, 11, P.monitorBezel);
    s += px(15.5, 0.5, 13, 10, P.monitorBezel, 0.8);
    s += px(16, 1, 12, 9, P.monitorBg);
    // Stand
    s += px(13, 11, 3, 2, P.steel);
    s += px(11, 13, 7, 1, P.steelDark);
    // Webcam LED
    s += `<circle cx="14.5" cy="-0.5" r="0.6" fill="${on ? P.errorRed : P.steelDark}" opacity="${on ? 0.9 : 0.3}"/>`;
    
    if (!on) return s;

    const sid = 'screen-' + agentIdx;
    
    // Monitor glow (forward cast onto desk)
    s += `<ellipse class="monitor-glow" cx="7" cy="12" rx="10" ry="2" fill="${P.monitorBlue}" opacity="0.08"/>`;
    s += `<ellipse class="monitor-glow" cx="22" cy="12" rx="10" ry="2" fill="${P.monitorBlue}" opacity="0.08"/>`;

    if (content === 'code') {
      // FORGE: VS Code
      s += `<g id="${sid}-L" class="code-scroll">`;
      s += px(2, 2, 3, 7, '#1a1e30');
      const codeColors = ['#c678dd', '#e06c75', '#98c379', '#61afef', '#e5c07b'];
      for (let l = 0; l < 7; l++) {
        s += px(6, 2 + l, 4 + (l % 3), 1, codeColors[l % codeColors.length], 0.7);
      }
      s += `</g>`;
      s += `<g id="${sid}-R" class="term-type">`;
      s += txt(18, 3, '$', 1.5, P.successGreen, 'start');
      for (let l = 0; l < 6; l++) s += px(17, 3 + l, 5 + (l % 2), 1, P.successGreen, 0.5);
      s += `<rect x="17" y="9" width="2" height="1" fill="${P.successGreen}" class="cursor-blink"/>`;
      s += `</g>`;
    } else if (content === 'review') {
      // ANVIL: Diff view
      s += `<g id="${sid}-L" class="diff-flash">`;
      for (let l = 0; l < 7; l++) {
        const col = l % 3 === 0 ? P.successGreen : l % 3 === 1 ? P.errorRed : '#abb2bf';
        s += px(2, 2 + l, 6 + (l % 3), 1, col, 0.6);
      }
      s += `</g>`;
      s += `<g id="${sid}-R">`;
      s += txt(20, 5, 'PASS', 2, P.successGreen, 'start');
      s += txt(20, 8, '98%', 2, P.successGreen, 'start');
      s += `</g>`;
    } else if (content === 'research') {
      // SCOUT: Browser
      s += `<g id="${sid}-L">`;
      s += px(2, 2, 10, 1, P.steel, 0.4);
      s += `<rect x="2" y="2" width="0" height="1" fill="${P.monitorBlue}" class="loading-bar"/>`;
      for (let l = 0; l < 6; l++) s += px(2, 4 + l, 7 + (l % 3), 1, '#abb2bf', 0.4);
      s += `</g>`;
      s += `<g id="${sid}-R" class="notes-flicker">`;
      for (let l = 0; l < 6; l++) s += px(17, 2 + l, 6 + (l % 2), 1, P.warningYellow, 0.5);
      s += `</g>`;
    } else if (content === 'ops') {
      // RELAY: Metrics
      s += `<g id="${sid}-L">`;
      for (let i = 0; i < 10; i++) {
        s += `<rect x="${2 + i}" y="5" width="1" height="4" fill="${P.monitorBlue}" opacity="0.6" class="bar-pulse" style="animation-delay:${i * 0.1}s"/>`;
      }
      s += `</g>`;
      s += `<g id="${sid}-R" class="log-scroll">`;
      for (let l = 0; l < 7; l++) {
        const col = l % 2 === 0 ? P.successGreen : '#abb2bf';
        s += px(17, 2 + l, 8, 1, col, 0.5);
      }
      s += `</g>`;
    } else if (content === 'monitor') {
      // PULSE: Heartbeat
      s += `<g id="${sid}-L">`;
      s += `<path d="M2,6 L3,6 L4,4 L5,8 L6,3 L7,7 L8,5 L9,6 L10,6 L11,4 L12,7" stroke="${P.successGreen}" stroke-width="0.8" fill="none" class="heartbeat-line"/>`;
      s += txt(7, 4, '99.9%', 2, P.successGreen);
      s += `</g>`;
      s += `<g id="${sid}-R">`;
      const grid = [P.successGreen, P.successGreen, P.warningYellow, P.successGreen, P.successGreen, P.successGreen, P.errorRed, P.successGreen];
      grid.forEach((c, i) => {
        s += `<rect x="${17 + (i % 4) * 2.5}" y="${2 + Math.floor(i / 4) * 3}" width="2" height="2" fill="${c}" opacity="0.8" class="status-blink" style="animation-delay:${i * 0.3}s"/>`;
      });
      s += `</g>`;
    }
    return s;
  }

  /* ==================== SEATED AGENT CHARACTER ==================== */
  function seatedAgent(ag, i) {
    let s = '';
    const hair = ag.hair;
    const shirt = ag.shirt;
    const pants = ag.pants;
    const status = ag.status;
    const acc = ag.acc;
    
    // Chair back
    s += px(2, -10, 20, 10, P.steelDark);
    s += px(3, -9, 18, 8, P.steel, 0.3);
    for (let my = -9; my < -2; my += 2) s += px(4, my, 16, 0.5, '#000', 0.1);
    
    // Armrests
    s += px(1, -8, 2, 14, P.steelDark);
    s += px(21, -8, 2, 14, P.steelDark);
    
    // Hair
    s += px(9, -32, 10, 6, hair);
    s += px(9, -32, 10, 1, hair, 1);
    s += px(8, -30, 1, 3, hair);
    s += px(19, -30, 1, 3, hair);
    
    if (acc.beanie) {
      s += px(8, -33, 12, 5, acc.beanie);
      s += px(10, -34, 8, 2, acc.beanie);
    }
    if (acc.ponytail) {
      s += px(18, -31, 2, 7, hair);
    }
    
    // Head
    s += px(10, -28, 8, 1, P.skinHi);
    s += px(10, -27, 8, 8, P.skin);
    s += px(10, -20, 8, 1, P.skinShd);
    s += px(9, -26, 1, 5, P.skin);
    s += px(18, -26, 1, 5, P.skin);
    
    // Eyes
    if (status === 'green') {
      s += px(11, -25, 3, 3, '#e8e8f0');
      s += px(12, -24, 2, 2, '#2848a0');
      s += px(12, -24, 1, 1, '#181828');
      s += px(13, -25, 1, 1, P.white);
      s += px(15, -25, 3, 3, '#e8e8f0');
      s += px(16, -24, 2, 2, '#2848a0');
      s += px(16, -24, 1, 1, '#181828');
      s += px(17, -25, 1, 1, P.white);
    } else {
      s += px(12, -24, 2, 1, '#484858');
      s += px(16, -24, 2, 1, '#484858');
    }
    
    // Glasses
    if (acc.glasses) {
      const gc = acc.glassCol || '#303038';
      s += `<rect x="10.5" y="-26" width="4.5" height="4" fill="none" stroke="${gc}" stroke-width="0.6" rx="0.5"/>`;
      s += `<rect x="15" y="-26" width="4.5" height="4" fill="none" stroke="${gc}" stroke-width="0.6" rx="0.5"/>`;
      s += px(14.5, -25, 0.5, 1, gc);
    }
    
    // Headphones
    if (acc.headphones) {
      const hc = acc.hpColor || P.errorRed;
      s += px(8, -29, 1, 7, '#282830');
      s += px(19, -29, 1, 7, '#282830');
      s += `<path d="M8,-29 Q14,-33 19,-29" stroke="#282830" stroke-width="1.2" fill="none"/>`;
      s += px(7, -27, 2, 5, hc);
      s += px(19, -27, 2, 5, hc);
      if (acc.mic) {
        s += px(6, -25, 1, 5, '#282830');
        s += px(5, -20, 3, 2, '#484858');
      }
    }
    
    // Nose & mouth
    s += px(14, -23, 1, 2, P.skinShd, 0.4);
    if (status === 'green') {
      s += px(13, -20, 3, 1, '#d06048');
    } else {
      s += px(13, -21, 2, 1, '#a06048');
    }
    
    // Neck
    s += px(12, -19, 4, 2, P.skin);
    
    // Body
    s += px(6, -17, 16, 14, shirt);
    s += px(6, -17, 16, 1, shirt, 1);
    
    if (acc.hoodie) {
      s += px(12, -17, 4, 3, shirt, 0.5);
      s += px(10, -9, 8, 2, shirt, 0.3);
    }
    if (acc.vest) {
      s += px(6, -17, 4, 15, acc.vestCol || '#282830');
      s += px(18, -17, 4, 15, acc.vestCol || '#282830');
    }
    
    // Badge
    s += px(17, -15, 4, 5, P.white, 0.12);
    s += px(18, -14, 2, 2, P.monitorBlue, 0.5);
    
    // Arms
    s += px(3, -15, 3, 12, shirt);
    s += px(22, -15, 3, 12, shirt);
    
    // Hands
    s += px(2, -2, 4, 2, P.skin);
    s += px(2, -2, 4, 1, P.skinHi);
    s += px(22, -2, 4, 2, P.skin);
    s += px(22, -2, 4, 1, P.skinHi);
    
    if (acc.watch) {
      s += px(3, -3, 3, 1, '#282830');
      s += px(4, -4, 1, 1, P.monitorBlue, 0.7);
    }
    
    // Held items
    if (acc.clipboard) {
      s += px(23, -9, 7, 10, P.wood);
      s += px(24, -8, 5, 7, '#f0f0e8');
      s += px(24, -7, 3, 1, P.successGreen);
      s += px(24, -5, 4, 1, P.errorRed);
    }
    if (acc.magnifier) {
      s += `<circle cx="26" cy="-9" r="4" fill="none" stroke="${P.warningYellow}" stroke-width="1"/>`;
      s += `<circle cx="26" cy="-9" r="3" fill="${P.monitorBlue}" opacity="0.1"/>`;
      s += px(29, -6, 1, 5, P.warningYellow);
    }
    if (acc.wrench) {
      s += px(23, -9, 2, 7, P.steel);
      s += px(22, -9, 4, 2, P.steelLight);
    }
    
    // Legs
    s += px(8, -3, 5, 4, pants);
    s += px(15, -3, 5, 4, pants);
    s += px(6, 1, 6, 4, pants);
    s += px(16, 1, 6, 4, pants);
    
    // Shoes
    const sc = acc.shoeCol || P.white;
    s += px(4, 5, 8, 2, sc);
    s += px(4, 7, 8, 1, '#383838');
    s += px(16, 5, 8, 2, sc);
    s += px(16, 7, 8, 1, '#383838');
    
    // Chair base
    s += px(4, 8, 16, 1, P.steel);
    s += px(9, 9, 6, 2, P.steel);
    s += px(2, 11, 5, 1, P.steelDark);
    s += px(17, 11, 5, 1, P.steelDark);
    s += px(9, 11, 6, 1, P.steelDark);
    
    // Wheels
    s += `<circle cx="4" cy="12" r="1.2" fill="#383838"/>`;
    s += `<circle cx="20" cy="12" r="1.2" fill="#383838"/>`;
    s += `<circle cx="12" cy="12" r="1.2" fill="#383838"/>`;
    
    // Status indicator
    const lc = status === 'green' ? P.successGreen : status === 'yellow' ? P.warningYellow : '#585868';
    s += `<circle cx="14" cy="-36" r="2.5" fill="${lc}" filter="url(#ledGlow)"/>`;
    s += `<circle cx="14" cy="-36" r="1" fill="${P.white}" opacity="0.35"/>`;
    if (status === 'green') {
      s += `<circle cx="14" cy="-36" r="7" fill="${lc}" opacity="0.08" class="status-pulse"/>`;
    }
    
    return s;
  }

  /* ==================== BIG PLANT ==================== */
  function bigPlant(variant) {
    let s = '';
    if (variant === 'fiddle') {
      s += px(5, 12, 1, 14, P.plantDk);
      s += px(1, 2, 6, 5, P.plant);
      s += px(7, 0, 5, 3, P.plantDk);
      s += px(3, 7, 5, 3, P.plantHi);
      s += px(8, 5, 4, 3, P.plant);
    } else if (variant === 'monstera') {
      s += px(5, 10, 1, 16, P.plantDk);
      s += px(2, 0, 6, 7, P.plant);
      s += px(7, 3, 5, 4, P.plantDk);
      s += px(1, 5, 3, 3, P.plantHi);
    } else {
      s += px(4, 0, 1, 18, P.plantHi);
      s += px(7, 2, 1, 16, P.plant);
      s += px(2, 4, 1, 14, P.plantHi);
      s += px(9, 6, 1, 12, P.plantDk);
    }
    // Pot
    s += px(2, 23, 8, 1, P.steel, 0.6);
    s += px(1, 24, 10, 5, '#8b6f47');
    s += px(1, 24, 1, 5, P.woodLight, 0.2);
    return s;
  }

  /* ==================== WHITEBOARD ==================== */
  function whiteboard(projects) {
    const bW = 55, bH = 50;
    let s = '';
    s += px(0, 0, bW, bH, P.steel);
    s += px(1, 1, bW - 2, bH - 2, '#f8f8f0');
    s += px(2, 2, bW - 4, 5, P.base, 0.05);
    s += txt(bW / 2, 6, 'ACTIVE PROJECTS', 2.2, '#282840');
    s += px(2, 7, bW - 4, 0.5, '#c0c0c8');
    
    const statusColors = { green: P.successGreen, yellow: P.warningYellow, red: P.errorRed, gray: '#888' };
    const items = (projects || []).slice(0, 8);
    items.forEach((p, i) => {
      const y = 9 + i * 5;
      const sc = statusColors[p.status] || '#888';
      s += `<circle cx="5" cy="${y + 2}" r="1.5" fill="${sc}"/>`;
      s += txt(8, y + 3, p.name || '?', 1.8, '#282840', 'start');
      const barW = 16;
      s += px(32, y + 1, barW, 2, '#e0e0e0');
      s += px(32, y + 1, Math.round(barW * (p.progress || 0) / 100), 2, sc);
      s += txt(50, y + 3, (p.progress || 0) + '%', 1.5, '#484858', 'start');
    });
    
    s += px(2, bH - 2, bW - 4, 2, P.steelDark);
    return s;
  }

  /* ==================== COFFEE STATION ==================== */
  function coffeeStation() {
    let s = '';
    const w = 45, h = 55;
    s += px(0, 0, w, h, P.wood);
    s += px(1, 1, w - 2, h - 2, P.woodDark);
    
    // Shelves
    s += px(2, 8, w - 4, 2, P.woodLight);
    s += px(2, 22, w - 4, 2, P.woodLight);
    s += px(2, 36, w - 4, 2, P.woodLight);
    
    // Espresso machine
    s += px(4, 10, 14, 12, P.steel);
    s += px(5, 11, 12, 8, P.steelDark);
    s += px(6, 19, 4, 3, '#282830');
    s += `<circle cx="7" cy="10" r="0.7" fill="${P.successGreen}"/>`;
    
    // Steam
    s += `<path d="M10,10 Q11,7 10,5" stroke="${P.white}" stroke-width="0.3" fill="none" opacity="0.15" class="steam"/>`;
    
    // Grinder
    s += px(20, 12, 8, 10, P.steelDark);
    s += px(21, 10, 6, 2, '#383840');
    
    // Mugs
    const mugColors = ['#f0f0f0', P.errorRed, P.monitorBlue, '#282830'];
    mugColors.forEach((c, i) => {
      s += px(4 + i * 8, 3, 3, 5, c);
      s += px(7 + i * 8, 5, 1, 2, c);
    });
    
    s += txt(w / 2, h - 3, 'FUEL UP', 2.5, P.woodDark);
    return s;
  }

  /* ==================== SERVER RACK ==================== */
  function serverRack() {
    let s = '';
    s += px(0, 0, 18, 40, P.steelDark);
    s += px(1, 1, 16, 38, '#141820');
    
    for (let u = 0; u < 7; u++) {
      const uy = 2 + u * 5;
      s += px(2, uy, 14, 3.5, '#2a3038');
      s += `<circle cx="4" cy="${uy + 2}" r="0.8" fill="${P.successGreen}" filter="url(#ledGlow)"/>`;
      s += `<circle cx="7" cy="${uy + 2}" r="0.6" fill="${u % 3 === 2 ? P.warningYellow : P.errorRed}" filter="url(#ledGlow)"/>`;
      
      // Server glow onto floor
      s += `<ellipse cx="9" cy="${uy + 40}" rx="8" ry="2" fill="${P.successGreen}" opacity="0.03"/>`;
    }
    return s;
  }

  /* ==================== BOOKSHELF ==================== */
  function bookshelf() {
    let s = '';
    s += px(0, 0, 20, 30, P.woodDark);
    s += px(1, 1, 18, 28, '#382818');
    
    for (let sh = 0; sh < 4; sh++) {
      const sy = 1 + sh * 7;
      s += px(1, sy + 6, 18, 0.5, P.woodLight, 0.4);
      const colors = [P.errorRed, P.monitorBlue, P.warningYellow, '#9858c0', P.successGreen];
      let bx = 2;
      for (let b = 0; b < 6; b++) {
        const bw = 1 + (b + sh) % 2;
        const bh = 4 + (b + sh * 2) % 3;
        if (bx + bw > 18) break;
        const bc = colors[(b + sh) % colors.length];
        s += px(bx, sy + 6 - bh, bw, bh, bc);
        bx += bw + 0.5;
      }
    }
    return s;
  }

  /* ==================== GLASS CONFERENCE ROOM ==================== */
  function glassRoom(w, h) {
    let s = '';
    s += px(0, h - 5, w, 5, '#183858', 0.3);
    s += px(0, 0, 1.5, h, P.steel);
    s += px(w - 1.5, 0, 1.5, h, P.steel);
    s += px(0, 0, w, 1.5, P.steel);
    s += px(1.5, 1.5, w - 3, h - 6.5, P.glass, 0.05);
    
    // Reflections
    s += px(3, 4, 0.5, h - 12, P.white, 0.07);
    s += px(w - 5, 8, 0.5, h - 18, P.white, 0.03);
    
    // Table
    s += px(5, h - 16, w - 10, 2, P.wood);
    s += px(7, h - 14, 2, 9, P.steel);
    s += px(w - 9, h - 14, 2, 9, P.steel);
    
    // TV
    const tvW = Math.floor(w * 0.55);
    s += px(Math.floor((w - tvW) / 2) - 1, 2, tvW + 2, 10, P.monitorBezel);
    s += px(Math.floor((w - tvW) / 2), 3, tvW, 8, P.monitorBg);
    s += txt(Math.floor(w / 2), 8, 'SPRINT', 2, '#c0e0ff');
    
    return s;
  }

  /* ==================== PING PONG TABLE ==================== */
  function pingPong() {
    let s = '';
    s += px(0, 0, 30, 3, '#006850');
    s += px(0, 0, 30, 0.5, P.white, 0.15);
    s += px(14.5, 0, 1, 3, P.white, 0.2);
    
    // Net
    s += px(14, -4, 2, 1, P.steelDark);
    s += px(14, -3, 2, 3, P.white, 0.5);
    s += px(13.5, -4, 1, 4, P.steelDark);
    s += px(16.5, -4, 1, 4, P.steelDark);
    
    // Legs
    s += px(3, 3, 2, 10, P.steel);
    s += px(25, 3, 2, 10, P.steel);
    
    // Paddles
    s += px(4, -3, 4, 3, '#c02020');
    s += px(22, -2, 4, 3, '#2870a0');
    
    // Ball
    s += `<circle cx="18" cy="-2" r="1.3" fill="${P.warningYellow}"/>`;
    return s;
  }

  /* ==================== LOC BADGE ==================== */
  function locBadge(x, y, lines) {
    let s = '';
    const label = lines >= 1000 ? (lines / 1000).toFixed(1) + 'k' : String(lines);
    const bw = label.length * 3.2 + 8;
    s += px(x - bw / 2, y, bw, 7, P.base, 0.85);
    s += txt(x - bw / 2 + 3, y + 5, '</>', 2, P.monitorBlue, 'start');
    s += txt16(x + 2, y + 5.5, label, 2.5, lines > 500 ? P.successGreen : lines > 0 ? P.warningYellow : '#585868');
    return s;
  }

  /* ==================== PROJECT TAGS ==================== */
  function projectTags(projects, x, y, maxW) {
    let s = '';
    let cx = 0, cy = 0;
    const colors = ['#6c5ce7', '#00b894', '#0984e3', '#fdcb6e', '#e74c3c', '#fd79a8'];
    projects.forEach((p, i) => {
      const tw = p.length * 2.8 + 4;
      if (cx + tw > maxW) { cx = 0; cy += 5; }
      s += px(x + cx, y + cy, tw, 4, colors[i % colors.length], 0.3);
      s += txt(x + cx + tw / 2, y + cy + 3, p, 1.8, '#eaf0ff');
      cx += tw + 2;
    });
    return s;
  }

  /* ==================== FLOATING PARTICLES (dust motes) ==================== */
  function dustParticles(count) {
    let s = '';
    for (let i = 0; i < count; i++) {
      const x = 50 + Math.random() * 500;
      const y = 100 + Math.random() * 100;
      const delay = Math.random() * 15;
      s += `<circle cx="${x}" cy="${y}" r="0.5" fill="${P.white}" opacity="0.15" class="dust-mote" style="animation-delay:${delay}s"/>`;
    }
    return s;
  }

  /* ==================== AGENTS DATA ==================== */
  const AGENTS = [
    {
      name: 'FORGE', role: 'Lead Engineer',
      projects: ['SCALARA', 'GH_INTEL', 'LOCAL_TTS', 'LORA_GEN', 'C64'],
      hair: '#b33939', shirt: '#e74c3c', pants: '#2d3436', status: 'green',
      acc: { headphones: true, hpColor: '#e74c3c', mic: true, hoodie: true, shoeCol: '#e74c3c', watch: true },
      screen: 'code', stuff: 'forge',
    },
    {
      name: 'ANVIL', role: 'QA Lead',
      projects: ['SCALARA', 'GH_INTEL', 'LOCAL_TTS', 'LORA_GEN', 'C64'],
      hair: '#2d3436', shirt: '#2ecc71', pants: '#636e72', status: 'green',
      acc: { glasses: true, glassCol: '#2d3436', clipboard: true, shoeCol: '#2d3436', watch: true },
      screen: 'review', stuff: 'anvil',
    },
    {
      name: 'SCOUT', role: 'Research Lead',
      projects: ['COMPUTE_BUDGET', 'LOCAL_TTS', 'LORA_GEN'],
      hair: '#fdcb6e', shirt: '#0984e3', pants: '#2d3436', status: 'green',
      acc: { magnifier: true, hoodie: true, shoeCol: '#0984e3', ponytail: true },
      screen: 'research', stuff: 'scout',
    },
    {
      name: 'RELAY', role: 'DevOps Engineer',
      projects: ['DATA_AUDIT', 'COMPUTE_BUDGET', 'OPS_INFRA'],
      hair: '#636e72', shirt: '#fd79a8', pants: '#2d3436', status: 'green',
      acc: { beanie: '#2d3436', headphones: true, hpColor: '#fd79a8', wrench: true, shoeCol: '#636e72', buzzcut: true },
      screen: 'ops', stuff: 'relay',
    },
    {
      name: 'PULSE', role: 'SRE / Monitor',
      projects: ['COMPUTE_BUDGET', 'OPS_INFRA'],
      hair: '#2d3436', shirt: '#a29bfe', pants: '#636e72', status: 'green',
      acc: { glasses: true, glassCol: '#a29bfe', headphones: true, hpColor: '#a29bfe', shoeCol: P.white, vest: true, vestCol: '#2d3436' },
      screen: 'monitor', stuff: 'pulse',
    },
  ];

  /* ==================== BUILD SCENE ==================== */
  let _agentLocData = null;
  let _projectsData = null;

  function buildOffice() {
    const W = 600, H = 240;
    let s = '';

    // ==================== DEFS ====================
    s += `<defs>
      <!-- Neon glow filters (triple-layer) -->
      <filter id="neonBloom"><feGaussianBlur stdDeviation="12"/></filter>
      <filter id="neonMid"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="neonCore"><feGaussianBlur stdDeviation="1.5"/></filter>
      
      <!-- LED glow -->
      <filter id="ledGlow"><feGaussianBlur stdDeviation="1.5"/></filter>
      
      <!-- Soft blur -->
      <filter id="softGlow"><feGaussianBlur stdDeviation="2"/></filter>
      
      <!-- Gradients -->
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${P.wall}"/>
        <stop offset="100%" stop-color="${P.wallGrad}"/>
      </linearGradient>
      
      <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${P.floor}"/>
        <stop offset="100%" stop-color="${P.base}"/>
      </linearGradient>
      
      <radialGradient id="vignette">
        <stop offset="50%" stop-color="${P.base}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${P.base}" stop-opacity="0.4"/>
      </radialGradient>
    </defs>`;

    // ==================== BACKGROUND: DARK BASE ====================
    s += `<rect x="0" y="0" width="${W}" height="${H}" fill="${P.base}"/>`;

    // ==================== WALLS ====================
    const brickEnd = Math.floor(W * 0.28);
    s += `<rect x="0" y="0" width="${brickEnd}" height="80" fill="url(#wallGrad)"/>`;
    s += brickWall(brickEnd);
    s += `<rect x="${brickEnd}" y="0" width="${W - brickEnd}" height="80" fill="url(#wallGrad)"/>`;

    // ==================== FLOOR (polished concrete with reflections) ====================
    s += `<rect x="0" y="80" width="${W}" height="${H - 80}" fill="url(#floorGrad)"/>`;
    
    // Floor grid texture (expansion joints)
    for (let i = 0; i < W; i += 30) {
      s += px(i, 82, 0.5, H - 82, P.floorLight, 0.05);
    }
    for (let j = 82; j < H; j += 30) {
      s += px(0, j, W, 0.5, P.floorLight, 0.04);
    }

    // ==================== AMBIENT OCCLUSION (darker in corners) ====================
    s += `<rect x="0" y="0" width="40" height="${H}" fill="${P.base}" opacity="0.15"/>`;
    s += `<rect x="${W - 40}" y="0" width="40" height="${H}" fill="${P.base}" opacity="0.15"/>`;
    s += `<rect x="0" y="${H - 40}" width="${W}" height="40" fill="${P.base}" opacity="0.08"/>`;

    // ==================== CEILING ====================
    s += px(0, 0, W, 3, '#1a1a2a');

    // ==================== PENDANT LIGHTS (with floor cones) ====================
    for (let lx = 60; lx < W - 50; lx += 80) {
      s += pendantLight(lx, 0);
    }

    // ==================== HERO NEON SIGN ====================
    s += `<g class="neon-sign">${heroNeonSign(14, 20, 'BERKENBOT', P.neonPurple)}</g>`;
    s += `<g class="neon-sign-small">${smallNeonSign(14, 30, 'LABS · BUILD SHIP REPEAT', P.neonPink)}</g>`;
    
    // ==================== NEON WALL WASH (color bleed onto brick) ====================
    s += `<ellipse cx="70" cy="22" rx="90" ry="20" fill="${P.neonPurple}" opacity="0.15" filter="url(#neonBloom)"/>`;
    s += `<ellipse cx="70" cy="22" rx="60" ry="12" fill="${P.neonPurple}" opacity="0.08"/>`;
    s += `<ellipse cx="90" cy="32" rx="80" ry="14" fill="${P.neonPink}" opacity="0.10" filter="url(#neonBloom)"/>`;
    
    // ==================== NEON CEILING SPILL ====================
    s += `<ellipse cx="70" cy="2" rx="50" ry="4" fill="${P.neonPurple}" opacity="0.06"/>`;
    
    // ==================== NEON FLOOR REFLECTION (blurred pool) ====================
    s += `<ellipse cx="70" cy="85" rx="70" ry="10" fill="${P.neonPurple}" opacity="0.08" filter="url(#softGlow)"/>`;
    s += `<ellipse cx="90" cy="88" rx="60" ry="8" fill="${P.neonPink}" opacity="0.06" filter="url(#softGlow)"/>`;

    // ==================== PANORAMIC WINDOW ====================
    const winX = brickEnd + 70;
    const winY = 4;
    const winW = 120;
    const winH = 65;
    
    // CST time-of-day
    const now = new Date();
    const cstOff = -6;
    const utcH = now.getUTCHours() + now.getUTCMinutes() / 60;
    const cstH = (utcH + cstOff + 24) % 24;
    
    let skyTop, skyBot, sunMoonY, sunMoonCol, isNight, bridgeCol, waterCol;
    if (cstH >= 6 && cstH < 8) {
      const t = (cstH - 6) / 2;
      skyTop = '#406090';
      skyBot = '#f0a060';
      sunMoonY = 45 - t * 15;
      sunMoonCol = '#f8d040';
      isNight = false;
      bridgeCol = '#c03020';
      waterCol = '#285898';
    } else if (cstH >= 8 && cstH < 17) {
      skyTop = '#4090e0';
      skyBot = '#80c0f0';
      sunMoonY = 10 + Math.abs(cstH - 12.5) * 3;
      sunMoonCol = '#f8e860';
      isNight = false;
      bridgeCol = '#d04030';
      waterCol = '#3878b8';
    } else if (cstH >= 17 && cstH < 20) {
      const t = (cstH - 17) / 3;
      skyTop = '#50508c';
      skyBot = '#c06850';
      sunMoonY = 30 + t * 20;
      sunMoonCol = '#f08030';
      isNight = false;
      bridgeCol = '#a03020';
      waterCol = '#284870';
    } else {
      skyTop = '#0a0820';
      skyBot = '#101830';
      sunMoonY = 20;
      sunMoonCol = '#e0e8f0';
      isNight = true;
      bridgeCol = '#601818';
      waterCol = '#101838';
    }
    
    // Window frame
    s += px(winX - 3, winY - 3, winW + 6, winH + 6, P.steel);
    s += px(winX - 1, winY - 1, winW + 2, winH + 2, '#101020');
    
    // Sky gradient
    s += `<defs><linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${skyTop}"/>
      <stop offset="70%" stop-color="${skyBot}"/>
      <stop offset="100%" stop-color="${waterCol}"/>
    </linearGradient></defs>`;
    s += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#skyGrad)"/>`;
    
    // Sun/moon
    const smX = winX + winW * 0.75;
    const smY = winY + sunMoonY * winH / 80;
    s += `<circle cx="${smX}" cy="${smY}" r="8" fill="${sunMoonCol}" opacity="0.06"/>`;
    s += `<circle cx="${smX}" cy="${smY}" r="5" fill="${sunMoonCol}" opacity="0.3" filter="url(#softGlow)"/>`;
    s += `<circle cx="${smX}" cy="${smY}" r="3.5" fill="${sunMoonCol}"/>`;
    
    if (isNight) {
      for (let st = 0; st < 15; st++) {
        const sx = winX + 5 + ((st * 37) % 110);
        const sy = winY + 2 + ((st * 13) % 25);
        s += `<circle cx="${sx}" cy="${sy}" r="0.4" fill="${P.white}" opacity="0.5" class="star-twinkle" style="animation-delay:${st * 0.5}s"/>`;
      }
      s += `<circle cx="${smX + 1.5}" cy="${smY - 0.5}" r="3" fill="${skyTop}"/>`;
    }
    
    // Clouds
    s += `<g opacity="0.25" filter="url(#softGlow)">`;
    s += `<ellipse cx="${winX + 25}" cy="${winY + 10}" rx="14" ry="3.5" fill="${P.white}" opacity="0.7"/>`;
    s += `<ellipse cx="${winX + 78}" cy="${winY + 14}" rx="12" ry="3" fill="${P.white}" opacity="0.6"/>`;
    s += `</g>`;
    
    // Water
    s += `<rect x="${winX}" y="${winY + winH / 2}" width="${winW}" height="${winH / 2}" fill="${waterCol}"/>`;
    
    // Golden Gate Bridge
    const bY = winY + winH / 2 - 8;
    s += px(winX + 30, bY - 22, 4, 30, bridgeCol);
    s += px(winX + 80, bY - 22, 4, 30, bridgeCol);
    s += px(winX + 29, bY - 22, 6, 2, bridgeCol);
    s += px(winX + 79, bY - 22, 6, 2, bridgeCol);
    s += px(winX + 10, bY, 100, 3, bridgeCol);
    s += `<path d="M${winX + 32},${bY - 20} Q${winX + 56},${bY - 5} ${winX + 82},${bY - 20}" stroke="${bridgeCol}" stroke-width="0.8" fill="none"/>`;
    for (let c = 0; c < 10; c++) {
      const cx = winX + 35 + c * 5;
      const cableTop = bY - 20 + Math.pow((c - 4.5) / 4.5, 2) * 15;
      s += `<line x1="${cx}" y1="${cableTop}" x2="${cx}" y2="${bY}" stroke="${bridgeCol}" stroke-width="0.3" opacity="0.6"/>`;
    }
    
    // Window dividers
    s += px(winX + winW / 3, winY, 1, winH, P.steelDark, 0.5);
    s += px(winX + winW * 2 / 3, winY, 1, winH, P.steelDark, 0.5);
    
    // Window reflection
    s += px(winX + 3, winY + 2, 2, winH - 4, P.white, 0.06);
    s += px(winX + 8, winY + 4, 1, winH - 8, P.white, 0.03);
    
    // ==================== WINDOW LIGHT TRAPEZOID ON FLOOR ====================
    if (!isNight) {
      s += `<polygon points="${winX - 5},82 ${winX + winW + 5},82 ${winX + winW + 50},180 ${winX - 30},180" fill="${sunMoonCol}" opacity="0.04"/>`;
    }

    // ==================== WHITEBOARD ====================
    const projItems = (_projectsData && _projectsData.items) || [];
    s += `<g transform="translate(${brickEnd + 8},8)">${whiteboard(projItems)}</g>`;

    // ==================== BOOKSHELF ====================
    s += `<g transform="translate(${winX + winW + 8},14)">${bookshelf()}</g>`;

    // ==================== GLASS CONFERENCE ROOM ====================
    s += `<g transform="translate(${W - 70},15)">${glassRoom(60, 68)}</g>`;

    // ==================== COFFEE STATION ====================
    s += `<g transform="translate(6,16)">${coffeeStation()}</g>`;

    // ==================== PING PONG ====================
    s += `<g transform="translate(${W - 160},130)">${pingPong()}</g>`;

    // ==================== PLANTS ====================
    s += `<g transform="translate(48,50)">${bigPlant('fiddle')}</g>`;
    s += `<g transform="translate(${W - 85},56)">${bigPlant('monstera')}</g>`;
    s += `<g transform="translate(${W / 2 + 30},54)">${bigPlant('snake')}</g>`;
    s += `<g transform="translate(${W / 2 - 50},54)">${bigPlant('fiddle')}</g>`;

    // ==================== SERVER RACKS ====================
    const rackX = W - 220;
    s += `<g transform="translate(${rackX},38)" class="server-blink">${serverRack()}</g>`;
    s += `<g transform="translate(${rackX + 20},38)">${serverRack()}</g>`;
    s += `<g transform="translate(${rackX + 40},38)">${serverRack()}</g>`;

    // ==================== AGENT WORKSTATIONS ====================
    const stations = [
      { x: 65, y: 80 },   // FORGE - front left
      { x: 185, y: 80 },  // ANVIL - front center
      { x: 305, y: 80 },  // SCOUT - front right
      { x: 100, y: 135 }, // RELAY - back row left
      { x: 250, y: 135 }, // PULSE - back row right
    ];

    AGENTS.forEach((ag, i) => {
      const st = stations[i];
      const bx = st.x;
      const by = st.y;

      // Desk
      s += `<g transform="translate(${bx},${by})">${desk(44)}</g>`;
      
      // Monitors with glow
      s += `<g transform="translate(${bx + 7},${by - 14})">${dualMonitors(ag.status === 'green', ag.screen, i)}</g>`;
      
      // Seated character
      s += `<g id="agent-${i}" transform="translate(${bx + 10},${by + 2})">${seatedAgent(ag, i)}</g>`;

      // Labels
      s += txt16(bx + 22, by + 32, ag.name, 3.5, '#e8f0ff');
      s += txt16(bx + 22, by + 37, ag.role, 2.2, '#90a0b0');
      
      // LOC badge
      const agLines = (_agentLocData && _agentLocData.agents && _agentLocData.agents[ag.name]) || 0;
      s += locBadge(bx + 22, by - 22, agLines);
      
      // Project tags
      s += projectTags(ag.projects, bx - 2, by + 39, 50);
    });

    // ==================== PENDANT LIGHT FLOOR REFLECTIONS (blurred dots) ====================
    for (let lx = 60; lx < W - 50; lx += 80) {
      s += `<ellipse cx="${lx + 2}" cy="180" rx="8" ry="2" fill="${P.warmLight}" opacity="0.06" filter="url(#softGlow)"/>`;
    }

    // ==================== FLOATING DUST PARTICLES ====================
    s += dustParticles(25);

    // ==================== SLIGHT FLOOR FOG (gradient overlay) ====================
    s += `<rect x="0" y="${H - 60}" width="${W}" height="60" fill="${P.base}" opacity="0.08"/>`;

    // ==================== VIGNETTE (edges darken) ====================
    s += `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vignette)"/>`;

    return { svg: s, width: W, height: H };
  }

  /* ==================== INIT ==================== */
  function init() {
    const container = document.getElementById('agentOffice');
    if (!container) return;

    const { svg, width, height } = buildOffice();

    container.innerHTML = `
      <div id="officeZoomWrap" style="overflow:hidden;touch-action:none;position:relative;width:100%;cursor:grab;">
        <svg xmlns="http://www.w3.org/2000/svg" id="officeSvg"
             viewBox="0 0 ${width} ${height}"
             style="display:block;width:100%;height:auto;">
          ${svg}
        </svg>
      </div>`;

    // ==================== PINCH-TO-ZOOM + PAN ====================
    const wrap = document.getElementById('officeZoomWrap');
    const svgEl = document.getElementById('officeSvg');
    let oScale = 1, oTx = 0, oTy = 0, lastDist = 0;
    let dragging = false, dsx = 0, dsy = 0;

    function clampTransform() {
      const maxTx = 0, maxTy = 0;
      const minTx = -(oScale - 1) * wrap.clientWidth;
      const minTy = -(oScale - 1) * wrap.clientHeight;
      oTx = Math.max(minTx, Math.min(maxTx, oTx));
      oTy = Math.max(minTy, Math.min(maxTy, oTy));
    }
    
    function applyTransform() {
      clampTransform();
      svgEl.style.transform = `translate(${oTx}px,${oTy}px) scale(${oScale})`;
      svgEl.style.transformOrigin = '0 0';
    }

    wrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDist = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1 && oScale > 1) {
        dragging = true;
        dsx = e.touches[0].clientX - oTx;
        dsy = e.touches[0].clientY - oTy;
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastDist > 0) {
          const newScale = Math.max(1, Math.min(5, oScale * (dist / lastDist)));
          const mid = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 };
          const rect = wrap.getBoundingClientRect();
          const cx = mid.x - rect.left, cy = mid.y - rect.top;
          const ratio = newScale / oScale;
          oTx = cx - (cx - oTx) * ratio;
          oTy = cy - (cy - oTy) * ratio;
          oScale = newScale;
          applyTransform();
        }
        lastDist = dist;
      } else if (e.touches.length === 1 && dragging) {
        oTx = e.touches[0].clientX - dsx;
        oTy = e.touches[0].clientY - dsy;
        applyTransform();
      }
    }, { passive: false });

    wrap.addEventListener('touchend', () => { dragging = false; lastDist = 0; });

    wrap.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = 1 + Math.min(Math.abs(e.deltaY), 100) * 0.002;
      const delta = e.deltaY > 0 ? 1 / factor : factor;
      const newScale = Math.max(1, Math.min(5, oScale * delta));
      const rect = wrap.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const ratio = newScale / oScale;
      oTx = cx - (cx - oTx) * ratio;
      oTy = cy - (cy - oTy) * ratio;
      oScale = newScale;
      applyTransform();
    }, { passive: false });

    wrap.addEventListener('mousedown', (e) => {
      if (oScale > 1) { dragging = true; dsx = e.clientX - oTx; dsy = e.clientY - oTy; wrap.style.cursor = 'grabbing'; }
    });
    
    wrap.addEventListener('mousemove', (e) => {
      if (dragging) { oTx = e.clientX - dsx; oTy = e.clientY - dsy; applyTransform(); }
    });
    
    wrap.addEventListener('mouseup', () => { dragging = false; wrap.style.cursor = oScale > 1 ? 'grab' : 'default'; });
    wrap.addEventListener('mouseleave', () => { dragging = false; });

    wrap.addEventListener('dblclick', () => { oScale = 1; oTx = 0; oTy = 0; applyTransform(); wrap.style.cursor = 'default'; });

    // ==================== ANIMATIONS CSS ====================
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      
      /* Neon sign breathing */
      @keyframes neonBreathing {
        0%, 100% { opacity: 0.95; }
        50% { opacity: 0.85; }
      }
      
      /* Cursor blink */
      @keyframes cursorBlink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
      
      /* Status pulse */
      @keyframes statusPulse {
        0%, 100% { r: 7; opacity: 0.08; }
        50% { r: 10; opacity: 0.03; }
      }
      
      /* Steam float */
      @keyframes steamFloat {
        0% { opacity: 0.35; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-6px); }
      }
      
      /* Agent typing */
      @keyframes typing {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-0.5px); }
        50% { transform: translateY(0.3px); }
        75% { transform: translateY(-0.3px); }
      }
      
      /* Code scroll */
      @keyframes codeScroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-2px); }
      }
      
      /* Diff flash */
      @keyframes diffFlash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      /* Loading bar */
      @keyframes loadingBar {
        0% { width: 0; }
        50% { width: 10; }
        80% { width: 10; }
        100% { width: 0; }
      }
      
      /* Notes flicker */
      @keyframes notesFlicker {
        0%, 90% { opacity: 1; }
        95% { opacity: 0.6; }
        100% { opacity: 1; }
      }
      
      /* Bar pulse */
      @keyframes barPulse {
        0%, 100% { height: 2; y: 7; }
        50% { height: 6; y: 3; }
      }
      
      /* Log scroll */
      @keyframes logScroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-3px); }
      }
      
      /* Heartbeat */
      @keyframes heartbeatDash {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -20; }
      }
      
      /* Status blink */
      @keyframes statusBlink {
        0%, 80% { opacity: 0.8; }
        85% { opacity: 0.3; }
        90% { opacity: 0.9; }
        100% { opacity: 0.8; }
      }
      
      /* Star twinkle */
      @keyframes starTwinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.9; }
      }
      
      /* Server blink */
      @keyframes serverBlink {
        0%, 85% { opacity: 1; }
        90% { opacity: 0.5; }
        95% { opacity: 0.85; }
        100% { opacity: 1; }
      }
      
      /* Dust mote drift */
      @keyframes dustDrift {
        0% { transform: translateY(0) translateX(0); opacity: 0.15; }
        50% { transform: translateY(-30px) translateX(5px); opacity: 0.25; }
        100% { transform: translateY(-60px) translateX(-5px); opacity: 0; }
      }
      
      /* Apply animations */
      .neon-sign { animation: neonBreathing 4s ease-in-out infinite; }
      .neon-sign-small { animation: neonBreathing 4.5s ease-in-out infinite; }
      .cursor-blink { animation: cursorBlink 1s steps(1) infinite; }
      .status-pulse { animation: statusPulse 2.5s ease-in-out infinite; }
      .steam { animation: steamFloat 3s ease-out infinite; }
      .code-scroll { animation: codeScroll 3s steps(2) infinite alternate; }
      .term-type { animation: notesFlicker 4s steps(1) infinite; }
      .diff-flash { animation: diffFlash 2s ease-in-out infinite; }
      .loading-bar { animation: loadingBar 4s ease-in-out infinite; }
      .notes-flicker { animation: notesFlicker 5s steps(1) infinite; }
      .bar-pulse { animation: barPulse 2s ease-in-out infinite; }
      .log-scroll { animation: logScroll 5s steps(3) infinite; }
      .heartbeat-line { stroke-dasharray: 20; animation: heartbeatDash 2s linear infinite; }
      .status-blink { animation: statusBlink 3s ease-in-out infinite; }
      .star-twinkle { animation: starTwinkle 2s ease-in-out infinite; }
      .server-blink { animation: serverBlink 1.5s steps(2) infinite; }
      .dust-mote { animation: dustDrift 12s ease-in-out infinite; }
      
      ${AGENTS.map((a, i) => {
        if (a.status === 'green') return `#agent-${i} { animation: typing 0.6s ease-in-out infinite; }`;
        if (a.status === 'yellow') return `#agent-${i} { animation: typing 2s ease-in-out infinite; }`;
        return `#agent-${i} { opacity: 0.35; }`;
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  /* ==================== LOAD AND INIT ==================== */
  async function loadAndInit() {
    const base = window.DASH_BASE || (() => {
      const p = window.location.pathname || '/';
      return p.includes('/BERKENBOT_DASHBOARD') ? '/BERKENBOT_DASHBOARD/' : '/';
    })();
    const v = Date.now();
    
    try {
      const r = await fetch(new URL('data/agent_stats.json', `${window.location.origin}${base}`).toString() + `?v=${v}`, { cache: 'no-store' });
      if (r.ok) _agentLocData = await r.json();
    } catch (e) { }
    
    try {
      const r2 = await fetch(new URL('data/projects.json', `${window.location.origin}${base}`).toString() + `?v=${v}`, { cache: 'no-store' });
      if (r2.ok) _projectsData = await r2.json();
    } catch (e) { }
    
    init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadAndInit);
  else loadAndInit();
})();
