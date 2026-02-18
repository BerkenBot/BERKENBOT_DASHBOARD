/* =========================================================
   Agent Office — 8-bit pixel-art office scene
   ========================================================= */
(function () {
  'use strict';

  /* ---------- palette ---------- */
  const C = {
    skin:   '#f8c291', skinShd: '#e58e6a',
    hair1:  '#2d3436', hair2:  '#b33939',
    shirt1: '#0984e3', shirt2: '#6c5ce7',
    pants:  '#2d3436', shoes:  '#1e272e',
    desk:   '#5f3c26', deskTop:'#8d6e4e', deskLeg:'#4a2c1a',
    monitor:'#2d3436', screen: '#0984e3', screenOff:'#1e272e',
    chair:  '#636e72', chairSeat:'#b2bec3',
    floor:  '#0e1a38', wall:   '#121a33',
    plant:  '#00b894', pot:    '#d35400',
    cooler: '#dfe6e9', coolerW:'#74b9ff', coolerB:'#636e72',
    carpet: '#162246',
  };

  /* ---------- tiny pixel helper ---------- */
  function px(x, y, w, h, fill) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" shape-rendering="crispEdges"/>`;
  }

  /* ---------- desk SVG (32×20) ---------- */
  function deskSVG() {
    let s = '';
    // desktop surface
    s += px(0, 0, 32, 4, C.deskTop);
    s += px(1, 1, 30, 2, C.desk);
    // legs
    s += px(2, 4, 3, 16, C.deskLeg);
    s += px(27, 4, 3, 16, C.deskLeg);
    return s;
  }

  /* ---------- monitor SVG (14×12 placed at ox,oy) ---------- */
  function monitorSVG(on) {
    let s = '';
    s += px(0, 0, 14, 10, C.monitor);
    s += px(1, 1, 12, 8, on ? C.screen : C.screenOff);
    if (on) {
      // scanlines / text
      for (let i = 0; i < 3; i++) {
        s += px(3, 2 + i * 2, 6 + (i % 2 ? 2 : 0), 1, '#74b9ff');
      }
    }
    // stand
    s += px(5, 10, 4, 2, C.monitor);
    return s;
  }

  /* ---------- chair SVG (16×18) ---------- */
  function chairSVG() {
    let s = '';
    s += px(2, 0, 12, 3, C.chair);       // back
    s += px(1, 3, 14, 4, C.chairSeat);   // seat
    s += px(3, 7, 3, 10, C.chair);       // leg L
    s += px(10, 7, 3, 10, C.chair);      // leg R
    s += px(0, 15, 16, 2, C.chair);      // base
    return s;
  }

  /* ---------- character sprite (24×32) ---------- */
  function characterSVG(hairColor, shirtColor, status) {
    let s = '';
    // Hair
    s += px(7, 0, 10, 5, hairColor);
    // Head
    s += px(8, 3, 8, 8, C.skin);
    s += px(7, 5, 1, 3, C.skin); // ear L
    s += px(16, 5, 1, 3, C.skin); // ear R
    // Eyes
    s += px(10, 6, 2, 2, '#2d3436');
    s += px(14, 6, 2, 2, '#2d3436');
    // Mouth
    s += px(11, 9, 3, 1, '#e17055');
    // Body
    s += px(6, 11, 12, 10, shirtColor);
    // Arms
    s += px(3, 12, 3, 8, shirtColor);
    s += px(18, 12, 3, 8, shirtColor);
    // Hands
    s += px(3, 20, 3, 2, C.skin);
    s += px(18, 20, 3, 2, C.skin);
    // Pants
    s += px(7, 21, 5, 6, C.pants);
    s += px(13, 21, 5, 6, C.pants);
    // Shoes
    s += px(6, 27, 6, 3, C.shoes);
    s += px(13, 27, 6, 3, C.shoes);

    // Status indicator glow
    if (status === 'green') {
      s += px(20, 0, 4, 4, '#00b894');
    } else if (status === 'yellow') {
      s += px(20, 0, 4, 4, '#ffd979');
    } else {
      s += px(20, 0, 4, 4, '#636e72');
    }
    return s;
  }

  /* ---------- plant (12×20) ---------- */
  function plantSVG() {
    let s = '';
    s += px(4, 14, 5, 6, C.pot);
    s += px(3, 14, 7, 2, '#e17055');
    // leaves
    s += px(5, 4, 3, 10, '#00b894');
    s += px(2, 2, 3, 5, '#00cec9');
    s += px(8, 3, 3, 4, '#55efc4');
    s += px(4, 0, 4, 3, '#00b894');
    return s;
  }

  /* ---------- water cooler (14×28) ---------- */
  function coolerSVG() {
    let s = '';
    // bottle
    s += px(4, 0, 6, 3, C.coolerW);
    s += px(3, 3, 8, 10, C.coolerW);
    s += px(2, 2, 10, 2, '#dfe6e9');
    // body
    s += px(1, 13, 12, 12, C.cooler);
    s += px(2, 14, 10, 10, '#b2bec3');
    // tap
    s += px(5, 17, 4, 2, '#d63031');
    // legs
    s += px(2, 25, 3, 3, C.coolerB);
    s += px(9, 25, 3, 3, C.coolerB);
    return s;
  }

  /* ---------- build the full scene ---------- */
  function buildOffice(bots) {
    const SCALE = 3;
    const SW = 260; // scene width per workstation
    const SH = 80;  // scene height
    const totalW = Math.max(SW * bots.length + 80, 600);

    let svgContent = '';

    // Floor
    svgContent += px(0, 55, totalW, 25, C.carpet);
    svgContent += px(0, 75, totalW, 5, C.floor);

    // Water cooler on far right
    const cX = totalW - 25;
    svgContent += `<g transform="translate(${cX}, 30)">${coolerSVG()}</g>`;

    // Plant on far left
    svgContent += `<g transform="translate(8, 38)">${plantSVG()}</g>`;

    bots.forEach((bot, i) => {
      const baseX = 40 + i * SW;
      const isActive = bot.status === 'green';
      const hairCol = i === 0 ? C.hair2 : C.hair1;
      const shirtCol = i === 0 ? C.shirt1 : C.shirt2;

      // Desk
      svgContent += `<g transform="translate(${baseX}, 40)">${deskSVG()}</g>`;

      // Monitor on desk
      svgContent += `<g transform="translate(${baseX + 9}, 28)">${monitorSVG(isActive)}</g>`;

      // Chair behind desk
      svgContent += `<g transform="translate(${baseX + 8}, 42)">${chairSVG()}</g>`;

      // Character sitting at desk
      const charId = `agent-${i}`;
      svgContent += `<g id="${charId}" transform="translate(${baseX + 4}, 26)">${characterSVG(hairCol, shirtCol, bot.status)}</g>`;

      // Name label
      svgContent += `<text x="${baseX + 16}" y="${72}" fill="#b6c4ee" font-family="'Press Start 2P', monospace" font-size="3.5" text-anchor="middle">${bot.name}</text>`;

      // Plant between desks
      if (i < bots.length - 1) {
        svgContent += `<g transform="translate(${baseX + SW - 30}, 38)">${plantSVG()}</g>`;
      }
    });

    return { svg: svgContent, width: totalW, height: SH };
  }

  /* ---------- init ---------- */
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

    const SCALE = 3;
    container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 ${width} ${height}"
           width="${width * SCALE}" height="${height * SCALE}"
           style="image-rendering: pixelated; image-rendering: crisp-edges; display:block; max-width:100%;">
        <rect width="${width}" height="${height}" fill="${C.wall}"/>
        <!-- Wall detail -->
        <rect x="0" y="50" width="${width}" height="1" fill="#1e2d56" opacity="0.5"/>
        <rect x="0" y="20" width="${width}" height="1" fill="#1e2d56" opacity="0.3"/>
        <!-- Window -->
        <rect x="30" y="4" width="20" height="16" fill="#0984e3" opacity="0.3" rx="1"/>
        <rect x="30" y="4" width="20" height="16" fill="none" stroke="#74b9ff" stroke-width="0.5" rx="1"/>
        <line x1="40" y1="4" x2="40" y2="20" stroke="#74b9ff" stroke-width="0.3"/>
        <line x1="30" y1="12" x2="50" y2="12" stroke="#74b9ff" stroke-width="0.3"/>
        ${svg}
      </svg>
    `;

    // --- CSS animations via class injection ---
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      #agentOffice svg {
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }

      /* Typing animation — arms move */
      @keyframes agentTyping {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-0.5px); }
      }

      @keyframes agentIdle {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(0.8px); }
      }

      @keyframes screenFlicker {
        0%, 90%, 100% { opacity: 1; }
        95% { opacity: 0.7; }
      }

      ${bots.map((b, i) => {
        if (b.status === 'green') {
          return `#agent-${i} { animation: agentTyping 0.4s steps(2) infinite; }`;
        } else if (b.status === 'yellow') {
          return `#agent-${i} { animation: agentIdle 2s steps(4) infinite; }`;
        } else {
          return `#agent-${i} { opacity: 0.5; }`;
        }
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  // Run when DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
