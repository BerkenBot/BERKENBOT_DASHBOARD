/* =========================================================
   Agent Office — 8-bit Silicon Valley startup office scene
   ========================================================= */
(function () {
  'use strict';

  const C = {
    skin: '#f8c291', skinShd: '#e58e6a',
    hair1: '#2d3436', hair2: '#b33939',
    shirt1: '#0984e3', shirt2: '#6c5ce7',
    pants1: '#2d3436', pants2: '#636e72',
    shoes: '#1e272e',
    // Modern office palette
    concrete: '#3d3d3d', concreteL: '#4a4a4a',
    brick: '#8b4513', brickL: '#a0522d', brickM: '#6b3410',
    steel: '#9e9e9e', steelD: '#757575',
    wood: '#d4a574', woodD: '#b8895a', woodL: '#e8c49a',
    glass: '#74b9ff', glassD: '#0984e3', glassFrame: '#b2bec3',
    floor: '#2c2c2c', floorL: '#383838', floorAccent: '#4a4a4a',
    carpet: '#1a3a5c',
    monitor: '#1e1e1e', screenOn: '#1e1e2e', screenGlow: '#0984e3',
    led: '#fdcb6e', ledWarm: '#ffeaa7',
    plant: '#00b894', plantD: '#00a381', plantL: '#55efc4',
    pot: '#636e72', potL: '#b2bec3',
    white: '#dfe6e9', whiteD: '#b2bec3',
    board: '#fefefe', boardFrame: '#636e72',
    pingpong: '#00b894', ppNet: '#dfe6e9', ppLegs: '#636e72',
    coffee: '#4a2c1a', coffeeM: '#6b4226', espresso: '#2d1810',
    cup: '#fefefe', cupD: '#dfe6e9',
    slack: '#611f69', slackG: '#2eb67d', slackB: '#36c5f0', slackY: '#ecb22e', slackR: '#e01e5a',
    neon: '#a29bfe', neonG: '#55efc4',
    wall: '#1a1a2e', wallL: '#22223a',
  };

  function px(x, y, w, h, fill, o) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${o ? ` opacity="${o}"` : ''} shape-rendering="crispEdges"/>`;
  }

  /* ---------- EXPOSED BRICK WALL ---------- */
  function brickWall(totalW) {
    let s = '';
    // Base wall
    s += px(0, 0, totalW, 52, C.wall);
    // Brick section (left third)
    const bw = Math.floor(totalW * 0.35);
    for (let row = 0; row < 13; row++) {
      const y = row * 4;
      const off = (row % 2) ? 5 : 0;
      for (let col = -1; col < Math.ceil(bw / 10) + 1; col++) {
        const x = col * 10 + off;
        if (x + 9 < 0 || x > bw) continue;
        const clampX = Math.max(0, x);
        const clampW = Math.min(9, bw - clampX, x + 9 - clampX);
        if (clampW <= 0) continue;
        const shade = (col + row) % 3 === 0 ? C.brickL : (col + row) % 3 === 1 ? C.brick : C.brickM;
        s += px(clampX, y, clampW, 3, shade);
      }
    }
    // Concrete section (right portion)
    s += px(bw, 0, totalW - bw, 52, C.concreteL);
    // Subtle concrete texture
    for (let i = 0; i < 8; i++) {
      const tx = bw + 15 + i * 30;
      if (tx < totalW) s += px(tx, 10 + (i % 3) * 12, 12, 1, C.concrete, 0.3);
    }
    return s;
  }

  /* ---------- INDUSTRIAL PENDANT LIGHT ---------- */
  function pendantLight(x) {
    let s = '';
    s += px(x + 2, 0, 1, 6, C.steel);           // cord
    s += px(x, 6, 5, 2, C.steelD);               // shade
    s += px(x + 1, 8, 3, 1, C.led);              // bulb
    s += px(x - 1, 9, 7, 3, C.ledWarm, 0.08);    // glow
    return s;
  }

  /* ---------- STANDING DESK (modern) ---------- */
  function standingDesk() {
    let s = '';
    // Thin modern desktop surface
    s += px(0, 0, 36, 2, C.woodL);
    s += px(0, 2, 36, 1, C.woodD);
    // Slim steel legs
    s += px(2, 3, 2, 18, C.steel);
    s += px(32, 3, 2, 18, C.steel);
    // Crossbar
    s += px(2, 14, 32, 1, C.steelD);
    // Cable tray
    s += px(10, 3, 16, 1, C.steelD);
    return s;
  }

  /* ---------- DUAL MONITORS ---------- */
  function dualMonitors(on, slackMode) {
    let s = '';
    // Monitor 1
    s += px(0, 0, 12, 9, C.monitor);
    s += px(1, 1, 10, 7, on ? '#0f111a' : '#111');
    // Monitor 2
    s += px(13, 0, 12, 9, C.monitor);
    s += px(14, 1, 10, 7, on ? '#0f111a' : '#111');
    // Slim stands
    s += px(4, 9, 4, 1, C.steelD);
    s += px(3, 10, 6, 1, C.steel);
    s += px(17, 9, 4, 1, C.steelD);
    s += px(16, 10, 6, 1, C.steel);

    if (on) {
      // Left monitor: code/terminal
      s += px(2, 2, 4, 1, '#6c5ce7');
      s += px(2, 4, 6, 1, '#00b894');
      s += px(3, 5, 5, 1, '#fdcb6e');
      s += px(2, 6, 7, 1, '#74b9ff');
      // Right monitor: Slack-style
      s += px(15, 1, 2, 7, C.slack, 0.7); // sidebar
      if (slackMode) {
        s += px(18, 2, 5, 1, C.slackG);
        s += px(18, 4, 4, 1, C.slackB);
        s += px(18, 6, 6, 1, C.slackY);
      } else {
        s += px(18, 3, 4, 1, '#636e72');
        s += px(18, 5, 5, 1, '#636e72');
      }
    }
    return s;
  }

  /* ---------- ERGONOMIC CHAIR ---------- */
  function ergoChair(color) {
    let s = '';
    s += px(3, 0, 10, 6, color);       // backrest
    s += px(2, 1, 1, 4, color);        // lumbar wing L
    s += px(13, 1, 1, 4, color);       // lumbar wing R
    s += px(2, 6, 12, 3, '#2d3436');   // seat
    s += px(7, 9, 2, 4, C.steel);      // stem
    s += px(3, 13, 10, 1, C.steel);    // star base
    s += px(1, 14, 3, 1, C.steelD);    // wheel L
    s += px(12, 14, 3, 1, C.steelD);   // wheel R
    return s;
  }

  /* ---------- GLASS CONFERENCE ROOM ---------- */
  function glassRoom(w, h) {
    let s = '';
    // Floor
    s += px(0, h - 4, w, 4, C.carpet);
    // Glass walls
    s += px(0, 0, 1, h, C.glassFrame);
    s += px(w - 1, 0, 1, h, C.glassFrame);
    s += px(0, 0, w, 1, C.glassFrame);
    // Glass fill
    s += px(1, 1, w - 2, h - 5, C.glass, 0.08);
    // Reflections
    s += px(2, 3, 1, h - 10, '#fff', 0.1);
    s += px(w - 3, 5, 1, h - 12, '#fff', 0.06);
    // Table inside
    s += px(4, h - 14, w - 8, 3, C.woodD);
    s += px(6, h - 11, 2, 7, C.steelD);
    s += px(w - 8, h - 11, 2, 7, C.steelD);
    // TV/screen on wall
    s += px(Math.floor(w / 2) - 5, 3, 10, 6, C.monitor);
    s += px(Math.floor(w / 2) - 4, 4, 8, 4, '#0984e3', 0.5);
    return s;
  }

  /* ---------- PING PONG TABLE ---------- */
  function pingPongTable() {
    let s = '';
    s += px(0, 0, 28, 2, C.pingpong);
    s += px(0, 0, 28, 1, '#009b7d');
    // White lines
    s += px(0, 0, 28, 1, '#fff', 0.15);
    s += px(13, 0, 2, 2, '#fff', 0.3);
    // Net
    s += px(13, -3, 2, 3, C.ppNet, 0.7);
    // Legs
    s += px(2, 2, 2, 10, C.ppLegs);
    s += px(24, 2, 2, 10, C.ppLegs);
    // Paddles (decorative)
    s += px(5, -2, 3, 4, '#e74c3c');
    s += px(20, -1, 3, 4, '#2980b9');
    return s;
  }

  /* ---------- COFFEE BAR ---------- */
  function coffeeBar() {
    let s = '';
    // Counter
    s += px(0, 0, 30, 3, C.wood);
    s += px(0, 0, 30, 1, C.woodL);
    // Cabinet below
    s += px(0, 3, 30, 12, C.woodD);
    s += px(1, 4, 13, 10, C.wood);
    s += px(16, 4, 13, 10, C.wood);
    // Espresso machine
    s += px(3, -8, 8, 8, C.steelD);
    s += px(4, -7, 6, 5, C.steel);
    s += px(5, -3, 2, 3, '#2d3436'); // portafilter
    s += px(4, -9, 2, 2, C.steel);   // top
    // Cups
    s += px(14, -3, 3, 3, C.cup);
    s += px(15, -4, 1, 1, C.cupD);
    s += px(19, -2, 2, 2, C.cup);
    // Coffee beans jar
    s += px(24, -5, 4, 5, C.glass, 0.3);
    s += px(25, -3, 2, 3, C.espresso);
    s += px(24, -6, 4, 1, C.woodD);
    return s;
  }

  /* ---------- WHITEBOARD ---------- */
  function whiteboard() {
    let s = '';
    s += px(0, 0, 24, 16, C.boardFrame);
    s += px(1, 1, 22, 14, C.board);
    // Diagrams
    // Flow chart
    s += px(3, 3, 4, 3, '#74b9ff', 0.6);
    s += px(5, 6, 1, 2, '#2d3436');
    s += px(3, 8, 4, 3, '#55efc4', 0.6);
    // Arrow
    s += px(8, 5, 3, 1, '#e17055');
    s += px(10, 4, 1, 1, '#e17055');
    s += px(10, 6, 1, 1, '#e17055');
    // More boxes
    s += px(12, 3, 5, 3, '#a29bfe', 0.6);
    s += px(12, 8, 5, 3, '#ffeaa7', 0.6);
    // Text squiggles
    s += px(18, 4, 4, 1, '#636e72', 0.4);
    s += px(18, 6, 3, 1, '#636e72', 0.4);
    s += px(18, 8, 5, 1, '#636e72', 0.4);
    // Marker tray
    s += px(2, 15, 20, 1, C.steelD);
    s += px(4, 14, 2, 1, '#e74c3c');
    s += px(7, 14, 2, 1, '#0984e3');
    s += px(10, 14, 2, 1, '#00b894');
    return s;
  }

  /* ---------- LARGE MONSTERA / FIDDLE LEAF ---------- */
  function bigPlant() {
    let s = '';
    // Modern pot
    s += px(2, 18, 8, 6, C.potL);
    s += px(3, 17, 6, 1, C.pot);
    s += px(1, 24, 10, 1, C.pot);
    // Trunk
    s += px(5, 8, 2, 10, C.plantD);
    // Leaves
    s += px(1, 2, 5, 6, C.plant);
    s += px(0, 4, 2, 3, C.plantL);
    s += px(6, 0, 5, 5, C.plantD);
    s += px(8, 1, 4, 3, C.plant);
    s += px(3, 6, 3, 4, C.plantL);
    s += px(7, 5, 4, 4, C.plant);
    s += px(2, 0, 3, 3, C.plantL);
    s += px(9, 3, 3, 3, C.plantD);
    return s;
  }

  /* ---------- NEON SIGN ---------- */
  function neonSign(text) {
    let s = '';
    const w = text.length * 5 + 4;
    s += `<text x="${w / 2}" y="5" fill="${C.neon}" font-family="'Press Start 2P',monospace" font-size="4" text-anchor="middle" opacity="0.9">${text}</text>`;
    // Glow
    s += `<text x="${w / 2}" y="5" fill="${C.neon}" font-family="'Press Start 2P',monospace" font-size="4" text-anchor="middle" opacity="0.15" filter="url(#neonGlow)">${text}</text>`;
    return { svg: s, w };
  }

  /* ---------- CHARACTER (modern dev look) ---------- */
  function characterSVG(hairColor, shirtColor, pantsColor, status, accessories) {
    let s = '';
    // Hair
    s += px(7, 0, 10, 5, hairColor);
    if (accessories?.beanie) {
      s += px(6, 0, 12, 3, accessories.beanie);
      s += px(8, -1, 8, 2, accessories.beanie);
    }
    // Head
    s += px(8, 3, 8, 8, C.skin);
    s += px(7, 5, 1, 3, C.skin);
    s += px(16, 5, 1, 3, C.skin);
    // Eyes
    if (status === 'green') {
      // Focused eyes
      s += px(10, 6, 2, 2, '#2d3436');
      s += px(14, 6, 2, 2, '#2d3436');
      s += px(10, 6, 1, 1, '#fff');
      s += px(14, 6, 1, 1, '#fff');
    } else {
      // Relaxed / half-closed
      s += px(10, 7, 2, 1, '#2d3436');
      s += px(14, 7, 1, 1, '#2d3436');
    }
    // Glasses
    if (accessories?.glasses) {
      s += px(9, 5, 4, 4, 'none');
      s += `<rect x="9" y="5" width="4" height="3" fill="none" stroke="#2d3436" stroke-width="0.5" shape-rendering="crispEdges"/>`;
      s += `<rect x="13.5" y="5" width="4" height="3" fill="none" stroke="#2d3436" stroke-width="0.5" shape-rendering="crispEdges"/>`;
      s += px(13, 6, 1, 1, '#2d3436');
    }
    // Mouth
    s += px(11, 9, 3, 1, '#e17055');
    // Headphones
    if (accessories?.headphones) {
      s += px(6, 3, 2, 5, '#2d3436');
      s += px(16, 3, 2, 5, '#2d3436');
      s += px(7, 2, 10, 1, '#2d3436');
      s += px(5, 5, 2, 3, '#e74c3c');
      s += px(17, 5, 2, 3, '#e74c3c');
    }
    // Body (hoodie/tshirt)
    s += px(6, 11, 12, 10, shirtColor);
    // Hoodie detail
    if (accessories?.hoodie) {
      s += px(9, 11, 6, 2, shirtColor);
      s += px(10, 11, 4, 1, '#fff', 0.15); // zipper/drawstring
    }
    // Arms
    s += px(3, 12, 3, 8, shirtColor);
    s += px(18, 12, 3, 8, shirtColor);
    // Hands
    s += px(3, 20, 3, 2, C.skin);
    s += px(18, 20, 3, 2, C.skin);
    // Pants (jeans/chinos)
    s += px(7, 21, 5, 6, pantsColor);
    s += px(13, 21, 5, 6, pantsColor);
    // Sneakers
    s += px(6, 27, 6, 3, accessories?.shoeColor || '#fff');
    s += px(13, 27, 6, 3, accessories?.shoeColor || '#fff');
    s += px(6, 28, 2, 1, '#dfe6e9');
    s += px(13, 28, 2, 1, '#dfe6e9');

    // Status LED
    const statusColor = status === 'green' ? '#00b894' : status === 'yellow' ? '#ffd979' : '#636e72';
    s += `<circle cx="21" cy="2" r="2" fill="${statusColor}"/>`;
    s += `<circle cx="21" cy="2" r="3" fill="${statusColor}" opacity="0.2"/>`;
    return s;
  }

  /* ---------- BUILD THE SCENE ---------- */
  function buildOffice(bots) {
    const SCENE_W = 420;
    const SCENE_H = 90;
    let s = '';

    // -- BRICK WALL & CONCRETE --
    s += brickWall(SCENE_W);

    // -- FLOOR --
    s += px(0, 52, SCENE_W, 2, C.floorAccent);
    // Polished concrete floor with subtle grid
    s += px(0, 54, SCENE_W, 36, C.floor);
    for (let i = 0; i < SCENE_W; i += 20) {
      s += px(i, 54, 1, 36, C.floorL, 0.15);
    }
    for (let j = 54; j < 90; j += 12) {
      s += px(0, j, SCENE_W, 1, C.floorL, 0.1);
    }

    // -- INDUSTRIAL PENDANT LIGHTS --
    for (let lx = 30; lx < SCENE_W; lx += 55) {
      s += `<g transform="translate(${lx}, 0)">${pendantLight(0)}</g>`;
    }

    // -- NEON SIGN on brick wall --
    const neon = neonSign('BUILD');
    s += `<g transform="translate(20, 12)" class="neon-sign">${neon.svg}</g>`;

    // -- WHITEBOARD on concrete wall --
    s += `<g transform="translate(${SCENE_W * 0.35 + 20}, 10)">${whiteboard()}</g>`;

    // -- GLASS CONFERENCE ROOM (far right) --
    s += `<g transform="translate(${SCENE_W - 55}, 14)">${glassRoom(45, 42)}</g>`;

    // -- AGENT WORKSTATIONS --
    const agents = [
      {
        hair: C.hair2, shirt: '#e74c3c', pants: '#2d3436',
        acc: { headphones: true, hoodie: true, shoeColor: '#e74c3c' }
      },
      {
        hair: C.hair1, shirt: '#6c5ce7', pants: '#636e72',
        acc: { glasses: true, hoodie: true, shoeColor: '#2d3436' }
      },
    ];

    bots.forEach((bot, i) => {
      const a = agents[i] || agents[0];
      const bx = 70 + i * 120;
      const isOn = bot.status === 'green';

      // Standing desk
      s += `<g transform="translate(${bx}, 40)">${standingDesk()}</g>`;
      // Dual monitors on desk
      s += `<g transform="translate(${bx + 6}, 29)">${dualMonitors(isOn, isOn)}</g>`;
      // Chair
      s += `<g transform="translate(${bx + 10}, 55)">${ergoChair(a.shirt)}</g>`;
      // Character
      s += `<g id="agent-${i}" transform="translate(${bx + 6}, 28)">${characterSVG(a.hair, a.shirt, a.pants, bot.status, a.acc)}</g>`;
      // Laptop next to monitors
      s += px(bx + 28, 38, 6, 1, C.steelD);
      s += px(bx + 28, 37, 6, 1, '#74b9ff', isOn ? 0.4 : 0.1);
      // Coffee cup on desk
      s += px(bx + 2, 37, 3, 3, C.cup);
      s += px(bx + 2, 37, 3, 1, C.cupD);

      // Name tag
      s += `<text x="${bx + 18}" y="${SCENE_H - 4}" fill="#b6c4ee" font-family="'Press Start 2P',monospace" font-size="3" text-anchor="middle">${bot.name}</text>`;
    });

    // -- BIG PLANT --
    s += `<g transform="translate(55, 40)">${bigPlant()}</g>`;

    // -- ANOTHER BIG PLANT --
    s += `<g transform="translate(${SCENE_W - 70}, 42)">${bigPlant()}</g>`;

    // -- PING PONG TABLE (lounge area, between workstations and conf room) --
    s += `<g transform="translate(${SCENE_W - 130}, 60)">${pingPongTable()}</g>`;

    // -- COFFEE BAR (left side) --
    s += `<g transform="translate(5, 42)">${coffeeBar()}</g>`;

    // -- Small decorative rug under lounge --
    s += px(SCENE_W - 140, 72, 40, 6, C.carpet, 0.4);
    s += px(SCENE_W - 139, 73, 38, 4, '#1a3a5c', 0.3);

    return { svg: s, width: SCENE_W, height: SCENE_H };
  }

  /* ---------- INIT ---------- */
  async function init() {
    const CACHE_BUST = `${Date.now()}`;
    const DASH_BASE = (() => {
      const p = window.location.pathname || '/';
      return p.includes('/BERKENBOT_DASHBOARD') ? '/BERKENBOT_DASHBOARD/' : '/';
    })();
    const baseUrl = new URL('data/bots.json', `${window.location.origin}${DASH_BASE}`).toString();
    const r = await fetch(`${baseUrl}?v=${CACHE_BUST}`, { cache: 'no-store' });
    const data = await r.json();
    const bots = data.items || data;

    const container = document.getElementById('agentOffice');
    if (!container) return;

    const { svg, width, height } = buildOffice(bots);

    const SCALE = 4;
    container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 ${width} ${height}"
           width="${width * SCALE}" height="${height * SCALE}"
           style="image-rendering:pixelated;image-rendering:crisp-edges;display:block;max-width:100%;">
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        ${svg}
      </svg>
    `;

    // Animations
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      #agentOffice svg { image-rendering:pixelated; image-rendering:crisp-edges; }

      @keyframes typing {
        0%,100% { transform:translateY(0); }
        25% { transform:translateY(-0.3px); }
        50% { transform:translateY(0.3px); }
        75% { transform:translateY(-0.2px); }
      }
      @keyframes idle {
        0%,100% { transform:translateY(0); }
        50% { transform:translateY(0.6px); }
      }
      @keyframes neonPulse {
        0%,100% { opacity:0.9; }
        50% { opacity:0.6; }
      }
      .neon-sign { animation:neonPulse 3s ease-in-out infinite; }

      ${bots.map((b, i) => {
        if (b.status === 'green') return `#agent-${i} { animation:typing 0.5s steps(4) infinite; }`;
        if (b.status === 'yellow') return `#agent-${i} { animation:idle 2.5s steps(4) infinite; }`;
        return `#agent-${i} { opacity:0.45; }`;
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
