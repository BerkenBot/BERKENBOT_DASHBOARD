/* =========================================================
   Agent Office — 32-bit Silicon Valley Startup HQ
   BerkenBot Labs — HD pixel art, smooth gradients, real lighting
   ========================================================= */
(function () {
  'use strict';

  /* 16-bit palette — Sega Genesis / SNES richness */
  const C = {
    skin:'#f4c08a', skinHi:'#fce0b8', skinShd:'#d48e5c', skinD:'#b87040',
    floor:'#1a1828', floorHi:'#2a283a', floorL:'#222030', floorTile:'#201e2e',
    concrete:'#3a3a4c', concreteL:'#4e4e62', concreteHi:'#5a5a6e',
    brick:'#a0522d', brickHi:'#c06030', brickL:'#8b4513', brickM:'#6b3410', brickDk:'#4a2508',
    steel:'#a8b0b8', steelD:'#6e7880', steelL:'#d0d8e0', steelHi:'#e8eef2',
    wood:'#d4a574', woodD:'#b08050', woodL:'#e8c89a', woodDk:'#805a28', woodHi:'#f0dab0',
    glass:'#6ab4f8', glassHi:'#a0d4ff', glassFrame:'#90a0b0',
    monitor:'#181820', monBezel:'#2a2a34', monHi:'#3a3a48',
    led:'#f8cc60', ledWarm:'#fff0a0', ledHi:'#fff8d0',
    plant:'#20b880', plantD:'#109868', plantL:'#60f0c0', plantDk:'#087850', plantHi:'#80ffd8',
    pot:'#607078', potL:'#a0b0b8', potTerra:'#c87848', potHi:'#d89868',
    board:'#f8f8f0', boardFrame:'#586068',
    cup:'#f0f0f0', cupD:'#d0d8e0', cupHi:'#ffffff',
    slack:'#611f69',
    neon:'#a8a0ff', neonHi:'#d0c8ff', neonPink:'#ff80b0', neonGreen:'#40f8a0',
    wall:'#141428', wallHi:'#1e1e38', wallL:'#1a1a32', wallM:'#181830',
    carpet:'#183858', carpetL:'#204870', carpetHi:'#285880',
    espresso:'#2d1810',
    server:'#282e32', serverHi:'#383e44', serverL:'#586068', serverLed:'#30e890', serverLedR:'#f04848', serverLedY:'#f8d050',
    rug:'#6858d8', rugD:'#5040b0', rugL:'#8070f0', rugHi:'#9888ff',
    cactus:'#30d070', cactusD:'#28a858',
    book1:'#e84040', book2:'#3898e0', book3:'#f0c830', book4:'#9858c0', book5:'#28c8a0',
    hair1:'#c04040', hair2:'#282830', hair3:'#e8c050', hair4:'#686870', hair5:'#282830',
    shirt1:'#e84848', shirt2:'#30d070', shirt3:'#2898e0', shirt4:'#f878a8', shirt5:'#a090f0',
  };

  let _gradId=0;
  function px(x,y,w,h,fill,o){
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${o?` opacity="${o}"`:''}shape-rendering="crispEdges"/>`;
  }
  /* 16-bit shaded rect: top highlight + body + bottom shadow */
  function px16(x,y,w,h,hi,mid,shd){
    return px(x,y,w,1,hi)+px(x,y+1,w,Math.max(1,h-2),mid)+px(x,y+h-1,w,1,shd);
  }
  /* Dithered blend between two colors (checkerboard pattern) */
  function dither(x,y,w,h,c1,c2){
    let s='';
    for(let dy=0;dy<h;dy++){
      for(let dx=0;dx<w;dx++){
        s+=px(x+dx,y+dy,1,1,(dx+dy)%2===0?c1:c2);
      }
    }
    return s;
  }
  function txt(x,y,text,size,fill,anchor,bold){
    return `<text x="${x}" y="${y}" fill="${fill||'#b8c8f0'}" font-family="'Press Start 2P',monospace" font-size="${size||3}" text-anchor="${anchor||'middle'}"${bold?' font-weight="bold"':''}>${text}</text>`;
  }
  /* Shadow text (16-bit style drop shadow) */
  function txt16(x,y,text,size,fill,anchor){
    return txt(x+0.5,y+0.5,text,size,'#000',anchor)+txt(x,y,text,size,fill,anchor,true);
  }

  /* ---- 16-BIT BRICK WALL ---- */
  function brickWall(totalW, brickEnd){
    let s='';
    // Dark base wall with gradient feel
    s+=px(0,0,totalW,80,C.wall);
    s+=px(0,0,totalW,2,C.wallHi); // top edge lighter
    // Wainscoting
    s+=px(0,62,totalW,18,C.wallM);
    s+=px(0,62,totalW,1,C.wallHi,0.2);
    // Brick section with highlight/shadow per brick
    for(let row=0;row<20;row++){
      const y=row*4, off=(row%2)?5:0;
      for(let col=-1;col<Math.ceil(brickEnd/10)+1;col++){
        const x=col*10+off;
        if(x+9<0||x>brickEnd)continue;
        const cx=Math.max(0,x), cw=Math.min(9,brickEnd-cx,x+9-cx);
        if(cw<=0)continue;
        const shade=(col+row)%3===0?C.brickHi:(col+row)%3===1?C.brick:C.brickM;
        // Top highlight, body, bottom shadow — 16-bit shading
        s+=px(cx,y,cw,1,(col+row)%3===0?C.brickHi:C.brickL);
        s+=px(cx,y+1,cw,1,shade);
        s+=px(cx,y+2,cw,1,C.brickDk);
        // Mortar lines
        s+=px(cx,y+3,cw,0.5,'#3a2810',0.4);
      }
    }
    // Concrete section with richer texture
    s+=px(brickEnd,0,totalW-brickEnd,80,C.concreteL);
    s+=px(brickEnd,0,totalW-brickEnd,1,C.concreteHi,0.3);
    for(let i=0;i<25;i++){
      const tx=brickEnd+4+i*15;
      if(tx<totalW){
        s+=px(tx,4+(i%7)*10,10,1,C.concreteHi,0.12);
        s+=px(tx+2,6+(i%5)*12,6,1,C.concrete,0.08);
      }
    }
    // Exposed pipe with highlight
    s+=px(0,3,totalW,2,C.steelD,0.5);
    s+=px(0,3,totalW,0.5,C.steelHi,0.25);
    return s;
  }

  /* ---- 16-BIT PENDANT / INDUSTRIAL LIGHT ---- */
  function pendant(x){
    let s='';
    // Cable
    s+=px(x+2,0,1,7,C.steelD);s+=px(x+3,0,0.5,7,C.steelL,0.3);
    // Shade (16-bit: highlight top, dark bottom)
    s+=px16(x-2,7,8,1,C.steelHi,C.steelD,C.steel);
    s+=px(x-1,8,6,1,C.steelD);s+=px(x-1,8,6,0.5,C.steelL,0.2);
    s+=px(x,9,4,2,C.steelD);s+=px(x,9,4,0.5,C.steelHi,0.15);
    // Bulb (warm glow gradient)
    s+=px(x+1,11,2,1,C.ledHi);
    s+=px(x,12,4,1,C.led);
    // Light cone (multi-layer for 16-bit softness)
    s+=`<polygon points="${x-3},18 ${x+7},18 ${x+4},12 ${x},12" fill="${C.ledHi}" opacity="0.05"/>`;
    s+=`<polygon points="${x-6},28 ${x+10},28 ${x+6},12 ${x-2},12" fill="${C.ledWarm}" opacity="0.03"/>`;
    s+=`<polygon points="${x-10},40 ${x+14},40 ${x+8},12 ${x-4},12" fill="${C.ledWarm}" opacity="0.015"/>`;
    return s;
  }

  /* ---- 16-BIT STANDING DESK ---- */
  function desk(w){
    w=w||40;
    let s='';
    // Desktop surface (wood grain: highlight, 2 mid tones, shadow)
    s+=px(0,0,w,1,C.woodHi);
    s+=px(0,1,w,1,C.woodL);
    s+=px(0,2,w,1,C.wood);
    s+=px(0,3,w,1,C.woodD);
    // Wood grain detail
    for(let g=4;g<w;g+=7) s+=px(g,1,3,1,C.woodHi,0.15);
    // Front edge bevel
    s+=px(0,3,w,0.5,C.woodDk,0.4);
    // Cable management tray (16-bit)
    s+=px16(6,4,w-12,1.5,C.steelL,C.steelD,C.steel);
    // Motorized legs (highlight + body + shadow)
    s+=px(2,4,1,20,C.steelL,0.4);s+=px(3,4,2,20,C.steel);s+=px(4,4,1,20,C.steelD);
    s+=px(w-5,4,1,20,C.steelL,0.4);s+=px(w-4,4,2,20,C.steel);s+=px(w-3,4,1,20,C.steelD);
    // Motor housing
    s+=px16(2,10,3,3,C.steelHi,C.steelD,'#484858');
    s+=px16(w-5,10,3,3,C.steelHi,C.steelD,'#484858');
    // Feet (16-bit)
    s+=px16(0,24,7,1.5,C.steelHi,C.steelD,C.steel);
    s+=px16(w-7,24,7,1.5,C.steelHi,C.steelD,C.steel);
    // Cross brace with highlight
    s+=px(5,15,w-10,0.5,C.steelL,0.3);
    s+=px(5,15.5,w-10,1,C.steelD,0.4);
    return s;
  }

  /* ---- DUAL ULTRAWIDE MONITORS (16-bit + animated content IDs) ---- */
  function dualMon(on,content,agentIdx){
    let s='';
    // Monitor L (16-bit bezel)
    s+=px16(0,0,14,11,C.monHi,C.monBezel,C.monitor);
    s+=px(1,1,12,9,'#080c18');
    // Monitor R
    s+=px16(15,0,14,11,C.monHi,C.monBezel,C.monitor);
    s+=px(16,1,12,9,'#080c18');
    // Stand (16-bit)
    s+=px16(13,11,3,2,C.steelL,C.steelD,C.steel);
    s+=px16(11,13,7,1,C.steelHi,C.steel,C.steelD);
    // Webcam with LED
    s+=px(13,-1,3,2,'#282830');
    s+=`<circle cx="14.5" cy="-0.5" r="0.6" fill="${on?'#f04848':'#383838'}" opacity="${on?0.9:0.3}"/>`;
    if(!on)return s;

    // Each screen gets a unique animation group
    const sid='screen-'+agentIdx;

    if(content==='code'){
      // FORGE: VS Code with scrolling code + terminal with typing output
      s+=`<g id="${sid}-L" class="code-scroll">`;
      s+=px(2,2,3,7,'#1a1e30'); // sidebar
      for(let f=0;f<4;f++) s+=px(3,3+f*1.5,1,1,'#586068',0.5);
      // Code lines (will scroll via CSS)
      const codeColors=['#c678dd','#e06c75','#98c379','#61afef','#e5c07b','#56b6c2','#c678dd','#d19a66'];
      const codeLens=[5,3,6,4,5,3,7,4];
      for(let l=0;l<8;l++){
        s+=px(6,2+l,codeLens[l],1,codeColors[l],0.8);
        if(l%2===0) s+=px(6,2+l,1,1,codeColors[l]); // keyword highlight
      }
      s+=`</g>`;
      s+=`<g id="${sid}-R" class="term-type">`;
      s+=px(17,2,1,1,'#98c379');s+=txt(18,3,'$',1.5,'#98c379','start');
      const termColors=['#98c379','#abb2bf','#e5c07b','#61afef','#abb2bf','#98c379','#abb2bf','#f04848'];
      for(let l=0;l<8;l++) s+=px(17,2+l,6+l%4,1,termColors[l],0.6);
      s+=`<rect x="17" y="9" width="2" height="1" fill="#98c379" class="cursor-blink"/>`;
      s+=`</g>`;
    } else if(content==='review'){
      // ANVIL: Animated diff view + spinning CI pipeline
      s+=`<g id="${sid}-L" class="diff-flash">`;
      s+=px(2,2,11,1,'#484858',0.5);
      const diffLines=[['#2ecc71',6],['#2ecc71',8],['#e74c3c',5],['#2ecc71',9],['#2ecc71',7],['#e74c3c',4],['#abb2bf',6]];
      diffLines.forEach(([c,w],l)=>{
        s+=px(2,3+l,w,1,c,c==='#abb2bf'?0.3:0.35);
        if(c!=='#abb2bf') s+=px(2,3+l,1,1,c==='#2ecc71'?'#fff':'#fff',0.1); // +/- marker
      });
      s+=`</g>`;
      s+=`<g id="${sid}-R">`;
      // CI Pipeline with animated spinner
      s+=px(17,2,3,2,'#2ecc71');s+=px(21,2,3,2,'#2ecc71');
      s+=`<g class="ci-spin" transform-origin="26.5 3"><rect x="25" y="2" width="3" height="2" fill="#f0c830"/></g>`;
      s+=px(20,3,1,1,'#484858');s+=px(24,3,1,1,'#484858');
      s+=txt(18,7,'PASS',2,'#2ecc71','start');
      s+=txt(18,9,'98.2%',2,'#40f8a0','start');
      s+=`</g>`;
    } else if(content==='research'){
      // SCOUT: Animated browser with loading bar + flickering notes
      s+=`<g id="${sid}-L">`;
      s+=px(2,2,11,1,'#484858',0.4);
      s+=`<rect x="2" y="2" width="0" height="1" fill="#60a8f0" class="loading-bar"/>`;
      s+=px(2,3,10,1,'#dfe6e9',0.5);s+=px(2,4,8,1,'#abb2bf',0.25);
      s+=px(2,6,6,1,'#60a8f0',0.5);s+=px(2,7,9,1,'#abb2bf',0.25);
      s+=px(2,8,7,1,'#abb2bf',0.25);s+=px(2,9,5,1,'#60a8f0',0.4);
      s+=`</g>`;
      s+=`<g id="${sid}-R" class="notes-flicker">`;
      s+=px(17,2,3,1,'#a090f0');s+=px(21,2,5,1,'#abb2bf',0.3);
      s+=px(17,3,8,1,'#f0c830',0.4);s+=px(17,4,6,1,'#abb2bf',0.25);
      s+=px(17,6,5,1,'#a090f0',0.5);s+=px(17,7,9,1,'#abb2bf',0.25);
      s+=`<rect x="17" y="9" width="4" height="1" fill="#f0c830" class="cursor-blink"/>`;
      s+=`</g>`;
    } else if(content==='ops'){
      // RELAY: Animated bar chart + scrolling logs
      s+=`<g id="${sid}-L">`;
      for(let i=0;i<10;i++){
        const maxH=7;
        s+=`<rect x="${2+i}" y="${10-maxH}" width="1" height="${maxH}" fill="#60a8f0" opacity="0.6" class="bar-pulse" style="animation-delay:${i*0.15}s"/>`;
      }
      s+=px(2,10,10,0.5,'#484858');
      s+=`<circle cx="7" cy="5" r="3" fill="none" stroke="#40f8a0" stroke-width="0.6" stroke-dasharray="6,12" class="gauge-spin"/>`;
      s+=`</g>`;
      s+=`<g id="${sid}-R" class="log-scroll">`;
      const logColors=['#40f8a0','#abb2bf','#f0c830','#abb2bf','#40f8a0','#abb2bf','#f04848','#40f8a0'];
      logColors.forEach((c,l)=>s+=px(17,2+l,7+l%3,1,c,0.45));
      s+=`</g>`;
    } else if(content==='monitor'){
      // PULSE: Animated heartbeat + blinking status grid
      s+=`<g id="${sid}-L">`;
      s+=`<path d="M2,6 L3,6 L4,4 L5,8 L6,3 L7,7 L8,5 L9,6 L10,6 L11,4 L12,7" stroke="#40f8a0" stroke-width="0.8" fill="none" class="heartbeat-line"/>`;
      s+=px(2,9,10,0.5,'#484858');
      s+=`<text x="7" y="3" fill="#40f8a0" font-family="'Press Start 2P',monospace" font-size="2" text-anchor="middle" class="uptime-counter">99.97%</text>`;
      s+=`</g>`;
      s+=`<g id="${sid}-R">`;
      const grid=['#40f8a0','#40f8a0','#f0c830','#40f8a0','#40f8a0','#40f8a0','#f04848','#40f8a0','#40f8a0','#40f8a0','#f0c830','#40f8a0'];
      grid.forEach((c,i)=>{
        s+=`<rect x="${17+(i%4)*2.5}" y="${2+Math.floor(i/4)*3}" width="2" height="2" fill="${c}" opacity="0.8" class="status-blink" style="animation-delay:${i*0.3}s"/>`;
      });
      s+=`</g>`;
    } else if(content==='orchestrate'){
      // BERKEN_BOT: Task delegation view — agent status grid + message feed
      s+=`<g id="${sid}-L">`;
      // Agent list with status dots
      const agNames=['FRG','ANV','SCT','CRE','CRN','SNT','FLT'];
      const agCols=['#e74c3c','#2ecc71','#3498db','#fab1a0','#55efc4','#636e72','#74b9ff'];
      agNames.forEach((n,l)=>{
        s+=`<circle cx="3" cy="${2+l*1.2}" r="0.5" fill="${agCols[l]}" class="status-blink" style="animation-delay:${l*0.4}s"/>`;
        s+=px(5,1.5+l*1.2,4,0.7,agCols[l],0.4);
      });
      s+=`</g>`;
      s+=`<g id="${sid}-R" class="log-scroll">`;
      // Task feed
      const taskCols=['#ffd700','#40f8a0','#74b9ff','#ffd700','#40f8a0','#fd79a8','#55efc4','#ffd700'];
      taskCols.forEach((c,l)=>s+=px(17,2+l,5+l%4,1,c,0.5));
      s+=`</g>`;
    } else if(content==='creative'){
      // CREATIVE: Color palette + waveform (voice/TTS)
      s+=`<g id="${sid}-L">`;
      // Color swatches grid
      const swatches=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c','#e84393'];
      swatches.forEach((c,i)=>{
        s+=`<rect x="${2+(i%4)*2.5}" y="${2+Math.floor(i/4)*3}" width="2" height="2" fill="${c}" opacity="0.8"/>`;
      });
      s+=`</g>`;
      s+=`<g id="${sid}-R">`;
      // Audio waveform
      for(let w=0;w<10;w++){
        s+=`<rect x="${17+w}" y="${6-w%3*2}" width="0.8" height="${2+w%4*1.5}" fill="#fd79a8" opacity="0.7" class="bar-pulse" style="animation-delay:${w*0.12}s"/>`;
      }
      s+=txt(22,3,'♪',2.5,'#fd79a8');
      s+=`</g>`;
    }
    return s;
  }

  /* ---- ERGO CHAIR (Herman Miller-style) ---- */
  function chair(color){
    let s='';
    // Back
    s+=px(3,0,10,6,color);
    s+=px(2,1,1,4,color);s+=px(13,1,1,4,color);
    // Mesh pattern
    for(let i=0;i<4;i++) s+=px(4,1+i*1.5,8,0.5,'#000',0.1);
    // Lumbar support
    s+=px(3,4,10,1,color);
    // Seat
    s+=px(2,6,12,3,'#2d3436');
    s+=px(3,6,10,1,'#3d4d4d');
    // Armrests
    s+=px(0,3,2,4,C.steelD);s+=px(14,3,2,4,C.steelD);
    s+=px(0,2,3,1,color);s+=px(13,2,3,1,color);
    // Gas cylinder
    s+=px(7,9,2,4,C.steel);
    // Star base
    s+=px(3,13,10,1,C.steel);
    s+=px(1,14,3,1,C.steelD);s+=px(12,14,3,1,C.steelD);
    // Wheels
    s+=px(1,14,2,1,'#444');s+=px(13,14,2,1,'#444');s+=px(7,14,2,1,'#444');
    return s;
  }

  /* ---- DETAILED CHARACTER ---- */
  function agent(hairCol,shirtCol,pantsCol,status,acc){
    let s='';
    // Hair
    s+=px(7,0,10,5,hairCol);
    s+=px(6,2,1,2,hairCol); // sideburn L
    s+=px(17,2,1,2,hairCol); // sideburn R
    if(acc.buzzcut) { s+=px(7,0,10,3,hairCol); }
    if(acc.beanie){ s+=px(6,-1,12,4,acc.beanie); s+=px(8,-2,8,2,acc.beanie); s+=px(7,-1,10,1,'#fff',0.1); }
    if(acc.ponytail){ s+=px(16,1,2,6,hairCol); s+=px(17,3,1,4,hairCol); }
    // Head
    s+=px(8,3,8,9,C.skin);
    s+=px(7,5,1,4,C.skin); // ear L
    s+=px(16,5,1,4,C.skin); // ear R
    // Eyes
    if(status==='green'){
      s+=px(10,6,2,2,'#2d3436');s+=px(14,6,2,2,'#2d3436');
      s+=px(10,6,1,1,'#fff');s+=px(14,6,1,1,'#fff'); // pupil highlight
    } else if(status==='yellow'){
      s+=px(10,7,2,1,'#2d3436');s+=px(14,7,2,1,'#2d3436');
    } else {
      s+=px(10,7,2,1,'#636e72');s+=px(14,7,2,1,'#636e72');
    }
    // Eyebrows
    s+=px(9,5,3,1,hairCol,0.6);s+=px(13,5,3,1,hairCol,0.6);
    // Nose
    s+=px(12,8,1,2,C.skinShd,0.5);
    // Mouth
    if(status==='green') s+=px(11,10,3,1,'#e17055');
    else s+=px(11,10,2,1,'#b07050');
    // Glasses
    if(acc.glasses){
      s+=`<rect x="9" y="5.5" width="4" height="3" fill="none" stroke="${acc.glassCol||'#2d3436'}" stroke-width="0.5" rx="0.5"/>`;
      s+=`<rect x="13.5" y="5.5" width="4" height="3" fill="none" stroke="${acc.glassCol||'#2d3436'}" stroke-width="0.5" rx="0.5"/>`;
      s+=px(13,6.5,0.5,1,acc.glassCol||'#2d3436');
      s+=px(9,7,0,0,''); // nose bridge
    }
    // Headphones
    if(acc.headphones){
      s+=px(6,3,1,6,'#2d3436');s+=px(17,3,1,6,'#2d3436');
      s+=`<path d="M6,3 Q12,-1 17,3" stroke="#2d3436" stroke-width="1" fill="none"/>`;
      s+=px(5,5,2,4,acc.hpColor||'#e74c3c');s+=px(17,5,2,4,acc.hpColor||'#e74c3c');
      // Mic boom
      if(acc.mic){s+=px(4,7,1,4,'#2d3436');s+=px(3,11,2,1,'#636e72');}
    }
    // Body / T-shirt
    s+=px(6,12,12,10,shirtCol);
    // Shirt detail
    if(acc.hoodie){
      s+=px(10,12,4,2,shirtCol);
      s+=px(11,12,2,3,'#000',0.06); // hood string
      s+=px(7,17,10,2,shirtCol); // kangaroo pocket
      s+=px(8,17,8,1,'#000',0.04);
    }
    if(acc.vest){
      s+=px(6,12,3,10,acc.vestCol||'#2d3436');
      s+=px(15,12,3,10,acc.vestCol||'#2d3436');
    }
    // Company badge
    s+=px(14,13,3,4,'#fff',0.15);s+=px(15,14,1,1,'#74b9ff',0.5);
    // Arms
    s+=px(3,13,3,8,shirtCol);s+=px(18,13,3,8,shirtCol);
    // Hands on keyboard position
    s+=px(3,21,3,2,C.skin);s+=px(18,21,3,2,C.skin);
    // Watch
    if(acc.watch){s+=px(3,20,3,1,'#2d3436');s+=px(4,19,1,1,'#74b9ff',0.6);}
    // Held items
    if(acc.clipboard){
      s+=px(19,18,6,8,'#b8895a');s+=px(20,19,4,6,'#fefefe');
      s+=px(20,20,3,1,'#2ecc71');s+=px(20,22,3,1,'#e74c3c');s+=px(20,24,2,1,'#f1c40f');
    }
    if(acc.magnifier){
      s+=`<circle cx="23" cy="18" r="3.5" fill="none" stroke="#fdcb6e" stroke-width="0.8"/>`;
      s+=`<circle cx="23" cy="18" r="2.5" fill="#74b9ff" opacity="0.12"/>`;
      s+=px(25,20,1,4,'#fdcb6e');
    }
    if(acc.wrench){
      s+=px(19,17,1,6,C.steelD);s+=px(18,17,3,2,C.steel);
    }
    // Pants
    s+=px(7,22,5,7,pantsCol);s+=px(13,22,5,7,pantsCol);
    s+=px(12,22,1,7,'#000',0.05); // gap between legs
    // Sneakers
    const sc=acc.shoeCol||'#fff';
    s+=px(5,29,7,3,sc);s+=px(12,29,7,3,sc);
    s+=px(5,30,3,1,'#dfe6e9',0.5);s+=px(12,30,3,1,'#dfe6e9',0.5);
    // Sole
    s+=px(5,31,7,1,'#444');s+=px(12,31,7,1,'#444');
    // Status indicator (floating above)
    const lc=status==='green'?'#2ecc71':status==='yellow'?'#f1c40f':'#636e72';
    s+=`<circle cx="12" cy="-3" r="2" fill="${lc}"/>`;
    s+=`<circle cx="12" cy="-3" r="3.5" fill="${lc}" opacity="0.15"/>`;
    if(status==='green') s+=`<circle cx="12" cy="-3" r="5" fill="${lc}" opacity="0.06" class="status-pulse"/>`;
    return s;
  }

  /* ---- 16-BIT SERVER RACK ---- */
  function serverRack(){
    let s='';
    // Outer frame (16-bit)
    s+=px16(0,0,18,40,C.serverHi,C.server,'#181c20');
    s+=px(1,1,16,38,'#141820');
    // Rack units (each with highlight/shadow)
    for(let u=0;u<7;u++){
      const uy=2+u*5;
      s+=px(2,uy,14,0.5,'#404850'); // top highlight
      s+=px(2,uy+0.5,14,3,'#2a3038');
      s+=px(2,uy+3.5,14,0.5,'#1a1e24'); // bottom shadow
      // LEDs (16-bit glow)
      s+=`<circle cx="4" cy="${uy+2}" r="0.8" fill="${C.serverLed}" filter="url(#ledGlow)"/>`;
      s+=`<circle cx="4" cy="${uy+2}" r="2" fill="${C.serverLed}" opacity="0.08"/>`;
      s+=`<circle cx="7" cy="${uy+2}" r="0.6" fill="${u%3===2?C.serverLedY:C.serverLedR}" filter="url(#ledGlow)"/>`;
      s+=`<circle cx="9" cy="${uy+2}" r="0.6" fill="${C.serverLed}" filter="url(#ledGlow)"/>`;
      // Vent lines (thinner, more of them)
      for(let v=0;v<4;v++) s+=px(10.5,uy+0.8+v*0.7,3.5,0.3,C.serverL,0.2);
      // Drive bays (16-bit)
      s+=px(3,uy+2.5,3.5,1,'#141820');s+=px(3,uy+2.5,3.5,0.3,'#303840',0.3);
      s+=px(7.5,uy+2.5,3.5,1,'#141820');s+=px(7.5,uy+2.5,3.5,0.3,'#303840',0.3);
    }
    // Side handles (16-bit metallic)
    s+=px(0,0,0.5,40,C.steelHi,0.3);s+=px(0.5,0,0.5,40,C.serverL);
    s+=px(17,0,0.5,40,C.serverL);s+=px(17.5,0,0.5,40,C.steelD,0.3);
    // Top vent
    s+=px(3,0,12,0.5,C.serverL,0.25);
    return s;
  }

  /* ---- 16-BIT BIG PLANT ---- */
  function bigPlant(variant){
    let s='';
    if(variant==='fiddle'){
      // Fiddle leaf fig — 16-bit shaded leaves
      s+=px(5,12,1,14,C.plantDk);s+=px(6,12,1,14,C.plantD,0.7); // trunk highlight
      s+=px(6,14,1,4,C.plantDk);
      // Leaves (each: highlight edge + base + dark center vein)
      s+=px(1,2,6,1,C.plantHi);s+=px(1,3,6,4,C.plant);s+=px(1,7,6,1,C.plantD);s+=px(3,4,1,3,C.plantDk,0.3); // vein
      s+=px(7,0,5,1,C.plantHi);s+=px(7,1,5,3,C.plantD);s+=px(7,4,5,1,C.plantDk);s+=px(9,1,1,3,C.plantDk,0.2);
      s+=px(3,7,5,1,C.plantHi);s+=px(3,8,5,3,C.plantL);s+=px(3,11,5,1,C.plant);s+=px(5,8,1,2,C.plantDk,0.2);
      s+=px(8,5,4,1,C.plantHi);s+=px(8,6,4,3,C.plant);s+=px(8,9,4,1,C.plantD);
      s+=px(0,4,2,3,C.plantL);s+=px(2,0,3,2,C.plantHi);
    } else if(variant==='monstera'){
      // Monstera — 16-bit with leaf holes and veins
      s+=px(5,10,1,16,C.plantDk);s+=px(6,10,1,16,C.plantD,0.5);
      s+=px(1,0,1,8,C.plantHi);s+=px(2,0,6,1,C.plantHi);s+=px(2,1,6,6,C.plant);s+=px(2,7,6,1,C.plantD);
      s+=px(3,2,2,2,'#080c18',0.08); // leaf hole
      s+=px(4,3,1,3,C.plantDk,0.2); // vein
      s+=px(6,3,1,6,C.plantHi);s+=px(7,3,5,1,C.plantHi);s+=px(7,4,5,4,C.plantD);s+=px(7,8,5,1,C.plantDk);
      s+=px(8,5,1,1,'#080c18',0.08);s+=px(9,4,1,3,C.plantDk,0.2);
      s+=px(0,5,1,5,C.plantHi);s+=px(1,5,3,1,C.plantHi);s+=px(1,6,3,3,C.plantL);s+=px(1,9,3,1,C.plant);
    } else {
      // Snake plant — 16-bit with striping
      s+=px(4,0,1,18,C.plantHi);s+=px(5,0,1,18,C.plantD);s+=px(4,2,2,2,C.plantL,0.3); // stripe
      s+=px(7,2,1,16,C.plantHi);s+=px(8,2,1,16,C.plant);s+=px(7,6,2,2,C.plantL,0.3);
      s+=px(2,4,1,14,C.plantL);s+=px(3,4,1,14,C.plantD);s+=px(2,8,2,2,C.plantHi,0.3);
      s+=px(9,6,1,12,C.plantD);s+=px(10,6,1,12,C.plantDk);s+=px(9,10,2,2,C.plantL,0.2);
    }
    // Pot (16-bit: highlight + body + shadow + rim)
    s+=px(2,23,8,1,C.potHi); // rim
    s+=px(1,24,10,1,C.potHi);
    s+=px(1,25,10,3,C.potTerra);
    s+=px(1,28,10,2,C.potTerra.replace('48','30')); // darker bottom
    s+=px(2,24,1,5,'#e0a070',0.2); // left highlight
    s+=px(3,29,6,1,'#000',0.06); // shadow under pot
    return s;
  }

  /* ---- WHITEBOARD (data-driven from projects) ---- */
  function whiteboard(projects){
    const bW=55, bH=50;
    let s='';
    // Frame (16-bit)
    s+=px16(0,0,bW,bH,C.steelL,C.boardFrame,C.steelD);
    s+=px(1,1,bW-2,bH-2,C.board);
    // Header
    s+=px(2,2,bW-4,5,'#282840',0.08);
    s+=txt(bW/2,6,'ACTIVE PROJECTS',2.2,'#282840');
    s+=px(2,7,bW-4,0.5,'#c0c0c8');

    // Project list
    const statusColors={green:'#2ecc71',yellow:'#f0c830',red:'#f04848',gray:'#888'};
    const items=(projects||[]).slice(0,8);
    items.forEach((p,i)=>{
      const y=9+i*5;
      // Status dot
      const sc=statusColors[p.status]||'#888';
      s+=`<circle cx="5" cy="${y+2}" r="1.5" fill="${sc}"/>`;
      // Project name
      s+=txt(8,y+3,p.name||'?',1.8,'#282840','start');
      // Progress bar
      const barW=16;
      s+=px(32,y+1,barW,2,'#e0e0e0');
      s+=px(32,y+1,Math.round(barW*(p.progress||0)/100),2,sc);
      // Percentage
      s+=txt(50,y+3,(p.progress||0)+'%',1.5,'#484858','start');
    });

    // Marker tray (16-bit)
    s+=px16(2,bH-2,bW-4,2,C.steelL,C.steelD,C.steel);
    s+=px(6,bH-3,3,1,'#e04040');s+=px(11,bH-3,3,1,'#2080e0');s+=px(16,bH-3,3,1,'#20c070');s+=px(21,bH-3,3,1,'#282830');
    return s;
  }

  /* ---- COFFEE STATION (back wall mounted) ---- */
  function coffeeStation(){
    const w=45, h=55;
    let s='';
    // Back panel / shelving unit
    s+=px16(0,0,w,h,C.woodHi,C.woodD,C.woodDk);
    s+=px(1,1,w-2,h-2,C.wood);

    // Top shelf
    s+=px16(2,8,w-4,2,C.woodHi,C.woodL,C.woodD);
    // Mugs on top shelf
    const mugColors=['#f0f0f0','#e04040','#2080e0','#282830','#f0c830'];
    mugColors.forEach((c,i)=>{
      s+=px(4+i*8,3,3,5,c);s+=px(7+i*8,5,1,2,c); // handle
      s+=px(4+i*8,3,3,1,'#fff',0.15); // rim highlight
    });

    // Middle shelf
    s+=px16(2,22,w-4,2,C.woodHi,C.woodL,C.woodD);

    // Espresso machine (16-bit, centered)
    s+=px16(4,10,14,12,C.steelHi,C.steelD,C.steel);
    s+=px(5,11,12,8,C.steel);s+=px(5,11,12,1,C.steelHi); // body highlight
    s+=px(6,19,4,3,'#282830'); // group head
    s+=px(7,20,2,1,C.steelL); // portafilter
    s+=px(5,9,3,2,'#282830'); // buttons
    s+=`<circle cx="7" cy="10" r="0.7" fill="#40f8a0"/>`; // power LED
    // Drip tray
    s+=px(5,22,10,1,'#484848');
    // Steam
    s+=`<path d="M10,10 Q11,7 10,5" stroke="#fff" stroke-width="0.3" fill="none" opacity="0.15" class="steam"/>`;
    s+=`<path d="M12,10 Q13,6 11,4" stroke="#fff" stroke-width="0.3" fill="none" opacity="0.1" class="steam" style="animation-delay:1s"/>`;

    // Grinder
    s+=px16(20,12,8,10,C.steelHi,'#484858','#282830');
    s+=px(21,10,6,2,'#383840'); // hopper
    s+=px(22,9,4,1,'#484858'); // hopper top
    s+=`<circle cx="24" cy="15" r="1.5" fill="#282830"/>`; // dial
    s+=`<circle cx="24" cy="15" r="0.5" fill="${C.steelL}"/>`; // dial dot

    // Kettle
    s+=px(32,14,6,8,C.steelL);s+=px(32,14,6,1,C.steelHi); // highlight
    s+=px(38,17,2,2,C.steelD); // handle
    s+=px(32,13,3,2,C.steelD); // spout

    // Bottom shelf items
    s+=px16(2,36,w-4,2,C.woodHi,C.woodL,C.woodD);

    // Bean bags
    s+=px(4,24,7,12,'#402010');s+=px(4,24,7,1,'#583018'); // bag 1
    s+=txt(7,31,'BEANS',1.5,'#a08060');
    s+=px(13,24,7,12,'#302818');s+=px(13,24,7,1,'#484030');
    s+=txt(16,31,'DARK',1.5,'#a09870');

    // Sugar & supplies
    s+=px(24,25,4,8,'#f0f0e8');s+=txt(26,30,'S',1.5,'#888'); // sugar
    s+=px(30,26,5,7,'#f0f0e8');s+=txt(32,31,'☕',2,'#604020'); // tea box
    s+=px(37,27,5,6,C.glass,0.3); // water pitcher
    s+=px(37,27,5,1,'#fff',0.1);

    // Snack basket on bottom
    s+=px(4,38,12,6,C.potTerra,0.5);
    s+=px(5,37,2,2,'#f0c830');s+=px(8,37,2,2,'#e04040');s+=px(11,37,2,2,'#20c070'); // fruit
    // Cookies/snacks
    s+=px(20,38,8,5,'#d4a060');s+=px(20,38,8,1,'#e0b070');

    // "FUEL UP" sign
    s+=txt(w/2,h-3,'☕ FUEL UP',2.5,'#a08060');

    return s;
  }

  /* ---- 16-BIT GLASS CONFERENCE ROOM ---- */
  function glassRoom(w,h){
    let s='';
    // Floor (carpet with texture)
    s+=px(0,h-5,w,1,C.carpetHi);
    s+=px(0,h-4,w,4,C.carpet);
    for(let ct=0;ct<w;ct+=4) s+=px(ct,h-3,2,1,C.carpetL,0.08);
    // Glass walls (16-bit: frame + glass + reflections)
    s+=px16(0,0,1.5,h,C.steelHi,C.glassFrame,C.steelD);
    s+=px16(w-1.5,0,1.5,h,C.steelHi,C.glassFrame,C.steelD);
    s+=px16(0,0,w,1.5,C.steelHi,C.glassFrame,C.steelD);
    s+=px(1.5,1.5,w-3,h-6.5,C.glass,0.05);
    // Reflections (multiple for 16-bit feel)
    s+=px(3,4,0.5,h-12,'#fff',0.07);
    s+=px(5,6,0.5,h-16,'#fff',0.04);
    s+=px(w-5,8,0.5,h-18,'#fff',0.03);
    // Table (16-bit wood)
    s+=px(5,h-16,w-10,1,C.woodHi);
    s+=px(5,h-15,w-10,1,C.woodD);
    s+=px(5,h-14,w-10,1,C.woodDk);
    // Table legs
    s+=px16(7,h-13,2,9,C.steelL,C.steelD,C.steel);
    s+=px16(w-9,h-13,2,9,C.steelL,C.steelD,C.steel);
    // TV screen (16-bit bezel)
    const tvW=Math.floor(w*0.55);
    s+=px16(Math.floor((w-tvW)/2)-1,2,tvW+2,10,C.monHi,C.monBezel,C.monitor);
    s+=px(Math.floor((w-tvW)/2),3,tvW,8,'#0060c0',0.3);
    s+=px(Math.floor((w-tvW)/2),3,tvW,1,'#0080e0',0.15); // screen top glow
    s+=txt(Math.floor(w/2),8,'SPRINT',2,'#c0e0ff');
    // Chairs (16-bit)
    for(let c=0;c<3;c++){
      const cx=8+c*Math.floor((w-18)/2);
      s+=px16(cx,h-10,5,3,C.steelL,'#505860',C.steelD);
      s+=px(cx+1,h-10,3,1,'#606870',0.4); // seat highlight
    }
    return s;
  }

  /* ---- 16-BIT PING PONG TABLE ---- */
  function pingPong(){
    let s='';
    // Table surface (16-bit green gradient)
    s+=px(0,0,30,1,'#008060');
    s+=px(0,1,30,1,'#006850');
    s+=px(0,2,30,1,'#005040');
    // White line markings
    s+=px(0,0,30,0.5,'#fff',0.15);s+=px(0,2.5,30,0.5,'#fff',0.1);
    s+=px(14.5,0,1,3,'#fff',0.2); // center line
    // Net (16-bit)
    s+=px(14,-4,2,1,C.steelD);
    s+=px(14,-3,2,3,'#fff',0.5);
    for(let n=0;n<3;n++) s+=px(14,-3+n,2,0.5,'#ddd',0.3); // net mesh
    s+=px(13.5,-4,1,4,C.steelD);s+=px(16.5,-4,1,4,C.steelD); // net posts
    // Legs (16-bit)
    s+=px16(3,3,2,10,C.steelL,C.steelD,C.steel);
    s+=px16(25,3,2,10,C.steelL,C.steelD,C.steel);
    // Paddles (16-bit shaded)
    s+=px(4,-3,4,1,'#d03030');s+=px(4,-2,4,2,'#c02020');s+=px(4,0,4,1,'#a01818');
    s+=px(5,-4,2,1,'#704020'); // handle
    s+=px(22,-2,4,1,'#3080c0');s+=px(22,-1,4,2,'#2870a0');s+=px(22,1,4,1,'#205888');
    s+=px(23,-3,2,1,'#704020');
    // Ball (16-bit: highlight)
    s+=`<circle cx="18" cy="-2" r="1.3" fill="#f0c020"/>`;
    s+=`<circle cx="17.5" cy="-2.5" r="0.5" fill="#fff" opacity="0.3"/>`;
    return s;
  }

  /* ---- 16-BIT BOOKSHELF ---- */
  function bookshelf(){
    let s='';
    // Frame (16-bit wood)
    s+=px16(0,0,20,30,C.woodHi,C.woodDk,'#604010');
    s+=px(1,1,18,28,'#382818');
    s+=px(1,1,0.5,28,C.woodDk,0.3); // inner shadow left
    // Shelves
    for(let sh=0;sh<4;sh++){
      const sy=1+sh*7;
      s+=px(1,sy+6,18,0.5,C.woodHi,0.4);
      s+=px(1,sy+6.5,18,0.5,C.woodDk);
      // Books (16-bit: each with spine highlight)
      const colors=[C.book1,C.book2,C.book3,C.book4,C.book5,'#e07020','#283848'];
      // Use seeded random based on shelf index for consistency
      let bx=2;
      for(let b=0;b<6;b++){
        const bw=1+(b+sh)%2;
        const bh=4+(b+sh*2)%3;
        if(bx+bw>18)break;
        const bc=colors[(b+sh)%colors.length];
        s+=px(bx,sy+6-bh,bw,1,bc); // top edge
        s+=px(bx,sy+7-bh,bw,bh-2,bc);
        s+=px(bx,sy+5,bw,1,'#000',0.1); // bottom shadow
        s+=px(bx,sy+6-bh,0.5,bh,'#fff',0.08); // spine highlight
        bx+=bw+0.5;
      }
    }
    return s;
  }

  /* ---- NEON SIGN (vivid triple-glow) ---- */
  function neonSign(text,color){
    color=color||C.neon;
    const white='#ffffff';
    // Layer order: outer glow (wide blur) → mid glow → bright core → white-hot center
    return `<text x="0" y="6" fill="${color}" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.5" filter="url(#neonWide)">${text}</text>`
      +`<text x="0" y="6" fill="${color}" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.7" filter="url(#neonGlow)">${text}</text>`
      +`<text x="0" y="6" fill="${white}" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.95">${text}</text>`
      +`<text x="0.3" y="6.3" fill="#000" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.08">${text}</text>`;
  }

  /* ---- SMALL NEON (vivid) ---- */
  function neonSmall(text,color){
    color=color||C.neonPink;
    return `<text x="0" y="4" fill="${color}" font-family="'Press Start 2P',monospace" font-size="3.2" opacity="0.6" filter="url(#neonWide)">${text}</text>`
      +`<text x="0" y="4" fill="${color}" font-family="'Press Start 2P',monospace" font-size="3.2" opacity="0.8" filter="url(#neonGlow)">${text}</text>`
      +`<text x="0" y="4" fill="#fff0f8" font-family="'Press Start 2P',monospace" font-size="3.2" opacity="0.95">${text}</text>`;
  }

  /* ---- PROJECT TAGS ---- */
  function projectTags(projects, x, y, maxW){
    let s='';
    let cx=0, cy=0;
    const colors=['#6c5ce7','#00b894','#0984e3','#fdcb6e','#e74c3c','#fd79a8'];
    projects.forEach((p,i)=>{
      const tw=p.length*2.8+4;
      if(cx+tw>maxW){cx=0;cy+=5;}
      s+=px(x+cx,y+cy,tw,4,colors[i%colors.length],0.3);
      s+=px(x+cx,y+cy,tw,0.5,colors[i%colors.length],0.5);
      s+=txt(x+cx+tw/2,y+cy+3,p,1.8,'#eaf0ff');
      cx+=tw+2;
    });
    return s;
  }

  /* ---- 16-BIT DESK ACCESSORIES ---- */
  function deskStuff(type){
    let s='';
    if(type==='forge'){
      // Energy drink (16-bit: label + highlight)
      s+=px(0,0,2,1,'#d03030');s+=px(0,1,2,2,'#e04848');s+=px(0,3,2,1,'#c02020');
      s+=px(0,0,0.5,4,'#ff6060',0.15); // can highlight
      s+=px(0,1,2,0.5,'#f0f0f0',0.2); // label stripe
      // Mechanical keyboard (16-bit)
      s+=px(5,-1,12,1,'#383840');s+=px(5,0,12,1,'#303038');s+=px(5,1,12,1,'#282830');
      for(let k=0;k<5;k++){s+=px(6+k*2,0,1,1,'#505860');s+=px(6+k*2,-0.5,1,0.5,'#606870',0.3);}
      // RGB glow
      s+=px(6,-1,2,0.5,'#f04848',0.15);s+=px(10,-1,2,0.5,'#40f0a0',0.15);s+=px(14,-1,2,0.5,'#4080f0',0.15);
    } else if(type==='anvil'){
      // Tea mug (16-bit)
      s+=px(0,0,3,1,C.cupHi);s+=px(0,1,3,1,C.cup);s+=px(0,2,3,1,C.cupD);
      s+=px(3,1,1,1,C.cupD); // handle
      s+=`<path d="M1,-1 Q1.5,-3 1,-4" stroke="#d0d0d0" stroke-width="0.3" fill="none" opacity="0.2" class="steam"/>`;
      // Rubber duck (16-bit)
      s+=px(6,0,3,1,'#f8d840');s+=px(6,1,3,1,'#f0c830');s+=px(6,2,3,1,'#d8b020');
      s+=px(7,-1,1,1,'#f8d840'); // head
      s+=px(8,1,1,1,'#e08020'); // beak
      s+=`<circle cx="7.3" cy="-0.3" r="0.4" fill="#181828"/>`;
    } else if(type==='scout'){
      // Notebook (16-bit)
      s+=px(0,0,5,1,'#303840');s+=px(0,1,5,2,'#282830');s+=px(0,3,5,1,'#202028');
      s+=px(1,1,3,1,'#f0f0e8',0.2); // page edge
      s+=px(0,0,0.5,4,'#404850'); // spine
      // Pen (16-bit)
      s+=px(6,0,0.5,4,'#3080d0');s+=px(6.5,0,0.5,4,'#2060a0');
      s+=px(6,0,1,0.5,'#c0c0c0'); // clip
    } else if(type==='relay'){
      // Cable spaghetti (16-bit: thicker, more cables)
      s+=`<path d="M0,0 Q3,2 2,4 Q1,6 4,5" stroke="#e04040" stroke-width="0.6" fill="none"/>`;
      s+=`<path d="M2,0 Q5,1 3,3 Q1,5 5,4" stroke="#4080f0" stroke-width="0.6" fill="none"/>`;
      s+=`<path d="M1,1 Q4,0 3,3 Q2,5 5,3" stroke="#f0c020" stroke-width="0.4" fill="none"/>`;
      // USB stick
      s+=px(6,2,3,1.5,C.steelL);s+=px(6,2,3,0.5,C.steelHi);s+=px(6.5,3.5,2,0.5,'#4080f0');
    } else if(type==='boss'){
      // Executive coffee mug (gold rim)
      s+=px(0,0,3,1,'#daa520');s+=px(0,1,3,2,C.cup);s+=px(0,3,3,1,C.cupD);
      s+=px(3,1,1,1,C.cupD);
      s+=`<path d="M1,-1 Q1.5,-3 1,-4" stroke="#d0d8e0" stroke-width="0.3" fill="none" opacity="0.2" class="steam"/>`;
      // Nameplate
      s+=px(6,0,10,3,'#282830');s+=px(6,0,10,1,'#daa520',0.4);
      s+=txt(11,2.5,'BOSS',1.5,'#daa520','middle');
    } else if(type==='creative'){
      // Paint palette
      s+=`<ellipse cx="4" cy="2" rx="4" ry="2.5" fill="#d4a574"/>`;
      s+=`<circle cx="2" cy="1.5" r="0.8" fill="#e74c3c"/>`;
      s+=`<circle cx="4" cy="0.8" r="0.8" fill="#3498db"/>`;
      s+=`<circle cx="6" cy="1.5" r="0.8" fill="#f1c40f"/>`;
      s+=`<circle cx="3" cy="3" r="0.6" fill="#2ecc71"/>`;
      // Stylus
      s+=px(9,0,0.5,4,'#636e72');s+=px(9,0,0.5,1,'#e74c3c');
    } else if(type==='cron'){
      // Tiny clock
      s+=`<circle cx="2" cy="2" r="2.5" fill="#282830"/>`;
      s+=`<circle cx="2" cy="2" r="2" fill="#101828"/>`;
      s+=`<line x1="2" y1="2" x2="2" y2="0.5" stroke="#55efc4" stroke-width="0.4"/>`;
      s+=`<line x1="2" y1="2" x2="3.2" y2="2.5" stroke="#fff" stroke-width="0.3"/>`;
      // Schedule printout
      s+=px(6,0,6,4,'#f0f0e8');
      for(let l=0;l<3;l++) s+=px(7,1+l,4,0.5,'#55efc4',0.5);
    } else if(type==='sentinel'){
      // Shield icon (metal)
      s+=`<path d="M2,0 L5,0 L5,3 L3.5,4.5 L2,3 Z" fill="${C.steelD}"/>`;
      s+=`<path d="M2.5,0.5 L4.5,0.5 L4.5,2.8 L3.5,3.8 L2.5,2.8 Z" fill="#ff7675" opacity="0.3"/>`;
      // Lock
      s+=px(7,1,3,2,'#282830');s+=`<path d="M7.5,1 Q8.5,-0.5 9.5,1" stroke="#636e72" stroke-width="0.5" fill="none"/>`;
    } else if(type==='float'){
      // Modular cube toy
      s+=px(0,0,3,3,'#74b9ff',0.6);s+=px(1,1,1,1,'#fff',0.15);
      s+=px(4,1,3,3,'#a29bfe',0.6);s+=px(5,2,1,1,'#fff',0.15);
      s+=px(2,3,3,2,'#55efc4',0.5);
      // "FLEX" post-it
      s+=px(8,0,5,3,'#fff0a0');s+=txt(10.5,2,'FLEX',1.5,'#636e72','middle');
    }
    return s;
  }

  /* ---- 16-BIT CLOCK (with real CST time hands) ---- */
  function wallClock(x,y){
    let s='';
    // Bezel (16-bit metallic ring)
    s+=`<circle cx="${x}" cy="${y}" r="6" fill="${C.steelD}"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="5.5" fill="${C.steelL}" opacity="0.3"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="5" fill="#080c18"/>`;
    // Face gradient
    s+=`<circle cx="${x}" cy="${y}" r="4.5" fill="#101828"/>`;
    // Hour marks (16-bit: lines not dots)
    for(let h=0;h<12;h++){
      const a=h*30*Math.PI/180;
      const ix=Math.sin(a), iy=-Math.cos(a);
      s+=`<line x1="${x+ix*3}" y1="${y+iy*3}" x2="${x+ix*4}" y2="${y+iy*4}" stroke="${h%3===0?'#fff':'#808898'}" stroke-width="${h%3===0?0.5:0.3}"/>`;
    }
    // Real CST time hands
    const now=new Date();
    const cstOff=-6;
    const ch=(now.getUTCHours()+cstOff+24)%24;
    const cm=now.getUTCMinutes();
    const ha=(ch%12+cm/60)*30*Math.PI/180;
    const ma=cm*6*Math.PI/180;
    // Hour hand
    s+=`<line x1="${x}" y1="${y}" x2="${x+Math.sin(ha)*2.5}" y2="${y-Math.cos(ha)*2.5}" stroke="#e0e8f0" stroke-width="0.5" stroke-linecap="round"/>`;
    // Minute hand
    s+=`<line x1="${x}" y1="${y}" x2="${x+Math.sin(ma)*3.5}" y2="${y-Math.cos(ma)*3.5}" stroke="#c0c8d0" stroke-width="0.35" stroke-linecap="round"/>`;
    // Center dot
    s+=`<circle cx="${x}" cy="${y}" r="0.6" fill="#f04040"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="0.3" fill="#fff" opacity="0.4"/>`;
    return s;
  }

  /* ============ AGENTS DATA ============ */
  const AGENTS = [
    {
      name:'BERKEN_BOT', role:'Orchestrator',
      projects:['ALL_PROJECTS'],
      status:'green', screen:'orchestrate', stuff:'boss',
      // Robot: gold/chrome executive bot, tall regal head, holographic dual-eye, command core
      bot:{body:'#b8860b',bodyHi:'#daa520',bodyShd:'#8b6914',
           head:'tall',eyeColor:'#ffd700',eyeStyle:'holo',
           antenna:true,ears:'fins',detail:'command',accent:'#ffd700'},
    },
    {
      name:'FORGE', role:'Lead Engineer α',
      projects:['SCALARA','GH_INTEL','LOCAL_TTS','LORA_GEN','C64'],
      status:'green', screen:'code', stuff:'forge',
      // Robot: heavy industrial bot, red chassis, visor eyes, welding sparks
      bot:{body:'#c0392b',bodyHi:'#e74c3c',bodyShd:'#922b21',
           head:'square',eyeColor:'#f39c12',eyeStyle:'visor',
           antenna:false,ears:'vents',detail:'sparks',accent:'#e74c3c'},
    },
    {
      name:'ANVIL', role:'Lead Engineer β',
      projects:['SCALARA','GH_INTEL','LOCAL_TTS','LORA_GEN','C64'],
      status:'green', screen:'review', stuff:'anvil',
      // Robot: precise inspector bot, green chassis, dual-lens eyes, scanner
      bot:{body:'#27ae60',bodyHi:'#2ecc71',bodyShd:'#1e8449',
           head:'round',eyeColor:'#2ecc71',eyeStyle:'lenses',
           antenna:true,ears:'discs',detail:'scanner',accent:'#2ecc71'},
    },
    {
      name:'SCOUT', role:'Research Analyst',
      projects:['LOCAL_TTS','LORA_GEN'],
      status:'green', screen:'research', stuff:'scout',
      // Robot: sleek explorer bot, blue chassis, single large eye, radar dish
      bot:{body:'#2980b9',bodyHi:'#3498db',bodyShd:'#1a5276',
           head:'dome',eyeColor:'#00d2ff',eyeStyle:'cyclops',
           antenna:true,ears:'none',detail:'radar',accent:'#3498db'},
    },
    {
      name:'CREATIVE', role:'Creative Director',
      projects:['MORNING_REPORT','TTS','COMFYUI'],
      status:'green', screen:'creative', stuff:'creative',
      // Robot: artistic bot, coral/salmon chassis, expressive round eyes, palette core
      bot:{body:'#e17055',bodyHi:'#fab1a0',bodyShd:'#c0392b',
           head:'round',eyeColor:'#fd79a8',eyeStyle:'lenses',
           antenna:false,ears:'discs',detail:'palette',accent:'#fd79a8'},
    },
    {
      name:'CRON', role:'Ops Manager',
      projects:['CRON_JOBS','HEARTBEAT'],
      status:'green', screen:'ops', stuff:'cron',
      // Robot: clockwork bot, teal chassis, LED bar eyes, gears detail
      bot:{body:'#00b894',bodyHi:'#55efc4',bodyShd:'#00896a',
           head:'box',eyeColor:'#55efc4',eyeStyle:'ledbar',
           antenna:false,ears:'speakers',detail:'gears',accent:'#55efc4'},
    },
    {
      name:'SENTINEL', role:'Security & Infra',
      projects:['WATCHDOG','SECURITY','INFRA'],
      status:'green', screen:'monitor', stuff:'sentinel',
      // Robot: armored security bot, dark steel chassis, visor, shield core
      bot:{body:'#2d3436',bodyHi:'#636e72',bodyShd:'#1a1a2e',
           head:'square',eyeColor:'#ff7675',eyeStyle:'visor',
           antenna:false,ears:'vents',detail:'shield',accent:'#ff7675'},
    },
    {
      name:'FLOAT', role:'Flex Agent',
      projects:['OVERFLOW'],
      status:'yellow', screen:'research', stuff:'float',
      // Robot: modular/transforming bot, silver chassis, cyclops eye, morph detail
      bot:{body:'#636e72',bodyHi:'#b2bec3',bodyShd:'#2d3436',
           head:'dome',eyeColor:'#74b9ff',eyeStyle:'cyclops',
           antenna:true,ears:'none',detail:'morph',accent:'#74b9ff'},
    },
  ];

  /* ---- ROBOT SEATED AGENT ---- */
  function seatedAgent(ag, i){
    let s='';
    const b=ag.bot, status=ag.status;
    const metal='#484858', metalHi='#686878', metalDk='#2a2a3a';

    // ---- CHAIR BACK (behind robot) ----
    s+=px16(2,-10,20,10,C.steelL,C.steelD,C.steel);
    for(let my=-9;my<-2;my+=2) s+=px(4,my,16,1,'#000',0.06);
    s+=px(1,-8,2,14,C.steelD);s+=px(0,-7,1,12,C.steelL,0.3);
    s+=px(21,-8,2,14,C.steelD);
    s+=px(1,-9,3,2,b.body,0.4);s+=px(20,-9,3,2,b.body,0.4);

    // ---- ANTENNA (if equipped) ----
    if(b.antenna){
      s+=px(13,-38,2,4,metalHi);s+=px(13,-38,2,1,C.steelHi);
      s+=`<circle cx="14" cy="-39" r="1.5" fill="${b.accent}" class="antenna-pulse"/>`;
      s+=`<circle cx="14" cy="-39" r="1" fill="#fff" opacity="0.4"/>`;
      s+=`<circle cx="14" cy="-39" r="3" fill="${b.accent}" opacity="0.08"/>`;
    }
    // Radar dish (SCOUT)
    if(b.detail==='radar'){
      s+=px(17,-38,1,3,metalHi);
      s+=`<path d="M16,-39 Q20,-42 24,-39" stroke="${metalHi}" stroke-width="0.8" fill="${b.accent}" fill-opacity="0.15"/>`;
      s+=`<circle cx="20" cy="-40" r="0.8" fill="${b.accent}" class="antenna-pulse"/>`;
    }

    // ---- HEAD ----
    const hx=8, hy=-32, hw=12, hh=10;
    // Head shape varies per bot
    if(b.head==='square'){
      // Blocky industrial head
      s+=px16(hx,hy,hw,hh,metalHi,metal,metalDk);
      s+=px(hx+1,hy+1,hw-2,hh-2,b.body);
      s+=px(hx+1,hy+1,hw-2,1,b.bodyHi); // top highlight
      s+=px(hx+1,hy+hh-2,hw-2,1,b.bodyShd); // bottom shadow
      // Jaw plate
      s+=px(hx+2,hy+hh-3,hw-4,2,metalDk);s+=px(hx+2,hy+hh-3,hw-4,1,metalHi,0.2);
    } else if(b.head==='round'){
      // Rounded smooth head
      s+=`<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="3" fill="${metal}"/>`;
      s+=`<rect x="${hx+1}" y="${hy+1}" width="${hw-2}" height="${hh-2}" rx="2" fill="${b.body}"/>`;
      s+=px(hx+1,hy+1,hw-2,1,b.bodyHi,0.5);
    } else if(b.head==='dome'){
      // Dome/helmet head
      s+=`<rect x="${hx}" y="${hy+3}" width="${hw}" height="${hh-3}" fill="${metal}"/>`;
      s+=`<rect x="${hx+1}" y="${hy+4}" width="${hw-2}" height="${hh-5}" fill="${b.body}"/>`;
      s+=`<ellipse cx="${hx+hw/2}" cy="${hy+3}" rx="${hw/2}" ry="4" fill="${b.body}"/>`;
      s+=`<ellipse cx="${hx+hw/2}" cy="${hy+3}" rx="${hw/2-1}" ry="3" fill="${b.bodyHi}" opacity="0.3"/>`;
    } else if(b.head==='box'){
      // Wide boxy head (tank-like)
      s+=px16(hx-1,hy+1,hw+2,hh-1,metalHi,metal,metalDk);
      s+=px(hx,hy+2,hw,hh-3,b.body);
      s+=px(hx,hy+2,hw,1,b.bodyHi);
      // Rivets
      s+=`<circle cx="${hx+1}" cy="${hy+3}" r="0.5" fill="${metalHi}"/>`;
      s+=`<circle cx="${hx+hw-1}" cy="${hy+3}" r="0.5" fill="${metalHi}"/>`;
      s+=`<circle cx="${hx+1}" cy="${hy+hh-2}" r="0.5" fill="${metalHi}"/>`;
      s+=`<circle cx="${hx+hw-1}" cy="${hy+hh-2}" r="0.5" fill="${metalHi}"/>`;
    } else if(b.head==='tall'){
      // Tall elegant head
      s+=px16(hx+1,hy-2,hw-2,hh+2,metalHi,metal,metalDk);
      s+=px(hx+2,hy-1,hw-4,hh,b.body);
      s+=px(hx+2,hy-1,hw-4,1,b.bodyHi);
      // Crown ridge
      s+=px(hx+3,hy-2,hw-6,1,b.accent);s+=px(hx+3,hy-2,hw-6,1,'#fff',0.2);
    }

    // ---- EARS / SIDE MODULES ----
    if(b.ears==='vents'){
      // Industrial vents
      for(let v=0;v<3;v++){s+=px(hx-2,hy+2+v*2,2,1,metalDk);s+=px(hx-2,hy+2+v*2,1,1,metalHi,0.3);}
      for(let v=0;v<3;v++){s+=px(hx+hw,hy+2+v*2,2,1,metalDk);s+=px(hx+hw+1,hy+2+v*2,1,1,metalHi,0.3);}
    } else if(b.ears==='discs'){
      // Round sensor discs
      s+=`<circle cx="${hx-1}" cy="${hy+5}" r="2" fill="${metal}"/><circle cx="${hx-1}" cy="${hy+5}" r="1.2" fill="${b.accent}" opacity="0.4"/>`;
      s+=`<circle cx="${hx+hw+1}" cy="${hy+5}" r="2" fill="${metal}"/><circle cx="${hx+hw+1}" cy="${hy+5}" r="1.2" fill="${b.accent}" opacity="0.4"/>`;
    } else if(b.ears==='speakers'){
      // Speaker grilles
      s+=px(hx-2,hy+2,2,6,metalDk);
      for(let g=0;g<3;g++) s+=px(hx-2,hy+3+g*2,2,0.5,metalHi,0.3);
      s+=px(hx+hw,hy+2,2,6,metalDk);
      for(let g=0;g<3;g++) s+=px(hx+hw,hy+3+g*2,2,0.5,metalHi,0.3);
    } else if(b.ears==='fins'){
      // Sleek cooling fins
      s+=px(hx-1,hy+1,1,3,b.accent,0.6);s+=px(hx-1,hy+5,1,3,b.accent,0.4);
      s+=px(hx+hw,hy+1,1,3,b.accent,0.6);s+=px(hx+hw,hy+5,1,3,b.accent,0.4);
    }

    // ---- EYES ----
    const eyeY=hy+3, eyeActive=status==='green';
    if(b.eyeStyle==='visor'){
      // Single horizontal visor bar
      s+=px(hx+2,eyeY,hw-4,3,metalDk);
      if(eyeActive){
        s+=px(hx+3,eyeY+1,hw-6,1,b.eyeColor);
        s+=px(hx+3,eyeY+1,hw-6,1,'#fff',0.3);
        s+=`<rect x="${hx+3}" y="${eyeY+0.5}" width="${hw-6}" height="2" fill="${b.eyeColor}" opacity="0.15" filter="url(#ledGlow)"/>`;
        // Scanning line animation
        s+=`<rect x="${hx+3}" y="${eyeY+0.5}" width="2" height="2" fill="#fff" opacity="0.25" class="visor-scan-${i}"/>`;
      } else {
        s+=px(hx+3,eyeY+1,hw-6,1,'#383848',0.5);
      }
    } else if(b.eyeStyle==='lenses'){
      // Dual circular lenses
      s+=`<circle cx="${hx+4}" cy="${eyeY+2}" r="2.5" fill="${metalDk}"/>`;
      s+=`<circle cx="${hx+hw-4}" cy="${eyeY+2}" r="2.5" fill="${metalDk}"/>`;
      if(eyeActive){
        s+=`<circle cx="${hx+4}" cy="${eyeY+2}" r="1.8" fill="${b.eyeColor}"/>`;
        s+=`<circle cx="${hx+4}" cy="${eyeY+1.5}" r="0.8" fill="#fff" opacity="0.5"/>`;
        s+=`<circle cx="${hx+hw-4}" cy="${eyeY+2}" r="1.8" fill="${b.eyeColor}"/>`;
        s+=`<circle cx="${hx+hw-4}" cy="${eyeY+1.5}" r="0.8" fill="#fff" opacity="0.5"/>`;
        s+=`<circle cx="${hx+4}" cy="${eyeY+2}" r="3.5" fill="${b.eyeColor}" opacity="0.08"/>`;
        s+=`<circle cx="${hx+hw-4}" cy="${eyeY+2}" r="3.5" fill="${b.eyeColor}" opacity="0.08"/>`;
      } else {
        s+=`<circle cx="${hx+4}" cy="${eyeY+2}" r="1.5" fill="#383848" opacity="0.5"/>`;
        s+=`<circle cx="${hx+hw-4}" cy="${eyeY+2}" r="1.5" fill="#383848" opacity="0.5"/>`;
      }
    } else if(b.eyeStyle==='cyclops'){
      // Single large eye
      s+=`<circle cx="${hx+hw/2}" cy="${eyeY+2}" r="3.5" fill="${metalDk}"/>`;
      if(eyeActive){
        s+=`<circle cx="${hx+hw/2}" cy="${eyeY+2}" r="2.8" fill="${b.eyeColor}"/>`;
        s+=`<circle cx="${hx+hw/2}" cy="${eyeY+1}" r="1.2" fill="#fff" opacity="0.5"/>`;
        s+=`<circle cx="${hx+hw/2}" cy="${eyeY+2}" r="1" fill="#fff" opacity="0.2"/>`;
        s+=`<circle cx="${hx+hw/2}" cy="${eyeY+2}" r="5" fill="${b.eyeColor}" opacity="0.06" class="eye-pulse"/>`;
      } else {
        s+=`<circle cx="${hx+hw/2}" cy="${eyeY+2}" r="2" fill="#383848" opacity="0.5"/>`;
      }
    } else if(b.eyeStyle==='ledbar'){
      // Horizontal LED array (5 dots)
      s+=px(hx+2,eyeY+1,hw-4,2,metalDk);
      for(let d=0;d<5;d++){
        const dx=hx+3+d*1.8;
        if(eyeActive){
          s+=`<circle cx="${dx}" cy="${eyeY+2}" r="0.8" fill="${b.eyeColor}" class="led-seq" style="animation-delay:${d*0.15}s"/>`;
        } else {
          s+=`<circle cx="${dx}" cy="${eyeY+2}" r="0.6" fill="#383848" opacity="0.4"/>`;
        }
      }
      if(eyeActive) s+=`<rect x="${hx+2}" y="${eyeY}" width="${hw-4}" height="3" fill="${b.eyeColor}" opacity="0.06" filter="url(#ledGlow)"/>`;
    } else if(b.eyeStyle==='holo'){
      // Holographic visor band
      s+=px(hx+2,eyeY,hw-4,3,metalDk);
      if(eyeActive){
        s+=`<defs><linearGradient id="holoGrad${i}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#a29bfe"/><stop offset="33%" stop-color="#6c5ce7"/>
          <stop offset="66%" stop-color="#a29bfe"/><stop offset="100%" stop-color="#6c5ce7"/>
        </linearGradient></defs>`;
        s+=`<rect x="${hx+3}" y="${eyeY+0.5}" width="${hw-6}" height="2" fill="url(#holoGrad${i})" class="holo-shift"/>`;
        s+=px(hx+3,eyeY+0.5,hw-6,0.5,'#fff',0.3);
        s+=`<rect x="${hx+2}" y="${eyeY}" width="${hw-4}" height="3" fill="${b.eyeColor}" opacity="0.1" filter="url(#ledGlow)"/>`;
      }
    }

    // ---- MOUTH / SPEAKER GRILLE ----
    s+=px(hx+3,hy+7,hw-6,1,metalDk);
    for(let m=0;m<3;m++) s+=px(hx+4+m*2,hy+7,1,1,metalHi,0.25);
    // Chin LED (active indicator)
    if(eyeActive) s+=`<circle cx="${hx+hw/2}" cy="${hy+9}" r="0.6" fill="${b.accent}" class="chin-blink"/>`;

    // ---- NECK (mechanical joint) ----
    s+=px(11,-21,6,3,metal);
    s+=px(11,-21,6,1,metalHi,0.3);
    // Neck ridges
    s+=px(12,-20,4,0.5,metalDk);s+=px(12,-19,4,0.5,metalDk);

    // ---- TORSO / CHASSIS ----
    s+=px16(6,-17,16,1,metalHi,metal,metalDk); // shoulder plate
    s+=px(6,-16,16,13,b.body);
    s+=px(6,-16,16,1,b.bodyHi); // top highlight
    s+=px(6,-4,16,1,b.bodyShd); // bottom shadow
    // Chest plate detail
    s+=px(9,-14,10,1,metalHi,0.3);
    s+=px(9,-13,10,8,metalDk,0.15);
    s+=px(9,-13,10,1,metalHi,0.1);
    // Chassis accent stripe
    s+=px(8,-11,12,1,b.accent,0.5);s+=px(8,-11,12,1,'#fff',0.1);

    // ---- CHEST DETAIL (unique per bot) ----
    if(b.detail==='sparks'){
      // Welding energy core
      s+=`<circle cx="14" cy="-9" r="2" fill="#f39c12" opacity="0.6" class="core-glow"/>`;
      s+=`<circle cx="14" cy="-9" r="1" fill="#fff" opacity="0.4"/>`;
      s+=`<circle cx="14" cy="-9" r="3.5" fill="#f39c12" opacity="0.08"/>`;
    } else if(b.detail==='scanner'){
      // QA scan line
      s+=px(10,-10,8,3,metalDk);
      s+=`<rect x="10" y="-10" width="8" height="0.5" fill="${b.accent}" class="scan-line"/>`;
      s+=px(10,-10,8,1,'#fff',0.05);
    } else if(b.detail==='cables'){
      // Exposed cables on torso
      s+=`<path d="M9,-12 Q11,-10 10,-7" stroke="#e74c3c" stroke-width="0.5" fill="none"/>`;
      s+=`<path d="M11,-13 Q13,-10 12,-7" stroke="#3498db" stroke-width="0.5" fill="none"/>`;
      s+=`<path d="M13,-12 Q15,-10 14,-7" stroke="#f1c40f" stroke-width="0.4" fill="none"/>`;
    } else if(b.detail==='heartbeat'){
      // Heartbeat display on chest
      s+=px(10,-10,8,3,metalDk);
      s+=`<path d="M10,-9 L12,-9 L13,-10.5 L14,-7.5 L15,-10 L16,-9 L18,-9" stroke="${b.accent}" stroke-width="0.6" fill="none" class="heartbeat-line"/>`;
    } else if(b.detail==='command'){
      // Command star / orchestrator core
      s+=`<circle cx="14" cy="-9" r="2.5" fill="${metalDk}"/>`;
      s+=`<polygon points="14,-12 15,-9.5 17.5,-9.5 15.5,-8 16.5,-5.5 14,-7 11.5,-5.5 12.5,-8 10.5,-9.5 13,-9.5" fill="${b.accent}" opacity="0.7"/>`;
      s+=`<circle cx="14" cy="-9" r="1" fill="#fff" opacity="0.3" class="core-glow"/>`;
    } else if(b.detail==='palette'){
      // Creative color dots on chest
      const dots=['#e74c3c','#3498db','#f1c40f','#2ecc71'];
      dots.forEach((c,d)=>s+=`<circle cx="${11+d*2}" cy="-9" r="1" fill="${c}" opacity="0.6"/>`);
    } else if(b.detail==='gears'){
      // Clockwork gears
      s+=`<circle cx="13" cy="-9" r="2" fill="${metalDk}" stroke="${b.accent}" stroke-width="0.4" class="gauge-spin"/>`;
      s+=`<circle cx="16" cy="-8" r="1.5" fill="${metalDk}" stroke="${b.accent}" stroke-width="0.3" class="gauge-spin" style="animation-direction:reverse"/>`;
      s+=`<circle cx="13" cy="-9" r="0.5" fill="${b.accent}"/>`;
    } else if(b.detail==='shield'){
      // Security shield emblem
      s+=`<path d="M12,-12 L16,-12 L16,-8 L14,-6 L12,-8 Z" fill="${metalDk}" stroke="${b.accent}" stroke-width="0.5"/>`;
      s+=`<path d="M13,-11 L15,-11 L15,-8.5 L14,-7 L13,-8.5 Z" fill="${b.accent}" opacity="0.2"/>`;
    } else if(b.detail==='morph'){
      // Modular/shape-shifting indicator
      s+=px(11,-11,2,2,b.accent,0.4);
      s+=`<circle cx="15" cy="-9" r="1.2" fill="${b.accent}" opacity="0.4"/>`;
      s+=`<polygon points="12,-7 14,-7 13,-5" fill="${b.accent}" opacity="0.3"/>`;
    }

    // Company badge LED
    s+=`<circle cx="19" cy="-14" r="1" fill="${b.accent}" opacity="0.4"/>`;
    s+=`<circle cx="19" cy="-14" r="0.5" fill="#fff" opacity="0.2"/>`;

    // ---- ARMS (mechanical, reaching to desk) ----
    // Shoulder joints
    s+=`<circle cx="5" cy="-15" r="2" fill="${metal}"/>`;
    s+=`<circle cx="5" cy="-15" r="1" fill="${metalHi}"/>`;
    s+=`<circle cx="23" cy="-15" r="2" fill="${metal}"/>`;
    s+=`<circle cx="23" cy="-15" r="1" fill="${metalHi}"/>`;
    // Upper arms
    s+=px16(3,-14,3,6,metalHi,b.body,b.bodyShd);
    s+=px16(22,-14,3,6,metalHi,b.body,b.bodyShd);
    // Elbow joints
    s+=`<circle cx="4.5" cy="-8" r="1.5" fill="${metal}"/>`;
    s+=`<circle cx="23.5" cy="-8" r="1.5" fill="${metal}"/>`;
    // Forearms
    s+=px16(3,-7,3,5,metalHi,metal,metalDk);
    s+=px16(22,-7,3,5,metalHi,metal,metalDk);

    // ---- HANDS (mechanical claws/grippers) ----
    // Left hand
    s+=px(2,-2,2,2,metalHi);s+=px(4,-2,1,2,metal);s+=px(2,-1,1,1,metalDk);
    // Right hand
    s+=px(22,-2,1,2,metal);s+=px(23,-2,2,2,metalHi);s+=px(24,-1,1,1,metalDk);
    // Finger segments
    s+=px(1,-1,1,1,metalHi,0.7);s+=px(5,-1,1,1,metalHi,0.7);
    s+=px(22,-1,1,1,metalHi,0.7);s+=px(25,-1,1,1,metalHi,0.7);

    // ---- LEGS (mechanical, bent seated) ----
    // Upper legs (thigh pistons)
    s+=px16(7,-3,5,4,metalHi,b.body,b.bodyShd);
    s+=px16(16,-3,5,4,metalHi,b.body,b.bodyShd);
    // Knee joints
    s+=`<circle cx="9.5" cy="2" r="1.5" fill="${metal}"/>`;
    s+=`<circle cx="18.5" cy="2" r="1.5" fill="${metal}"/>`;
    // Lower legs
    s+=px16(6,2,5,4,metalHi,metal,metalDk);
    s+=px16(16,2,5,4,metalHi,metal,metalDk);
    // Hydraulic detail on legs
    s+=px(8,0,1,3,b.accent,0.3);s+=px(19,0,1,3,b.accent,0.3);

    // ---- FEET (heavy mechanical) ----
    s+=px16(4,6,8,2,metalHi,metal,metalDk);
    s+=px16(16,6,8,2,metalHi,metal,metalDk);
    // Grip pads
    s+=px(5,7,2,1,b.body,0.4);s+=px(9,7,2,1,b.body,0.4);
    s+=px(17,7,2,1,b.body,0.4);s+=px(21,7,2,1,b.body,0.4);

    // ---- CHAIR BASE ----
    s+=px16(4,8,16,1,C.steelHi,C.steel,C.steelD);
    s+=px16(9,9,6,2,C.steelL,C.steel,C.steelD);
    s+=px(2,11,5,1,C.steelD);s+=px(17,11,5,1,C.steelD);s+=px(9,11,6,1,C.steelD);
    s+=`<circle cx="4" cy="12" r="1.2" fill="#383838"/><circle cx="4" cy="11.5" r="0.5" fill="#505050"/>`;
    s+=`<circle cx="20" cy="12" r="1.2" fill="#383838"/><circle cx="20" cy="11.5" r="0.5" fill="#505050"/>`;
    s+=`<circle cx="12" cy="12" r="1.2" fill="#383838"/><circle cx="12" cy="11.5" r="0.5" fill="#505050"/>`;

    // ---- STATUS INDICATOR (eye-color glow above head) ----
    const lc=status==='green'?C.neonGreen:status==='yellow'?'#f0d040':'#585868';
    const indicY=b.antenna?-43:-36;
    s+=`<circle cx="14" cy="${indicY}" r="2.5" fill="${lc}" filter="url(#ledGlow)"/>`;
    s+=`<circle cx="14" cy="${indicY}" r="1" fill="#fff" opacity="0.35"/>`;
    s+=`<circle cx="14" cy="${indicY}" r="5" fill="${lc}" opacity="0.1"/>`;
    if(status==='green') s+=`<circle cx="14" cy="${indicY}" r="8" fill="${lc}" opacity="0.04" class="status-pulse"/>`;

    return s;
  }

  /* ---- 16-BIT WALKING CHARACTER ---- */
  function walkingPerson(hairCol, shirtCol, pantsCol, dir){
    let s='';
    const flip = dir==='left' ? 'transform="scale(-1,1)"' : '';
    const shirtHi=shirtCol.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+35);return v.toString(16).padStart(2,'0');});
    s+=`<g ${flip}>`;
    // Hair (16-bit)
    s+=px(4,0,8,1,hairCol.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+25);return v.toString(16).padStart(2,'0');}));
    s+=px(4,1,8,3,hairCol);
    // Head (16-bit: hi/mid/shd)
    s+=px(5,3,6,1,C.skinHi);s+=px(5,4,6,5,C.skin);s+=px(5,9,6,1,C.skinShd);
    s+=px(4,5,1,3,C.skin); // ear
    // Eye
    s+=px(7,5,2,2,'#181828');s+=px(7,5,1,1,'#fff',0.4);
    // Mouth
    s+=px(7,8,2,1,'#d06048',0.6);
    // Body (16-bit)
    s+=px(4,10,8,1,shirtHi);s+=px(4,11,8,6,shirtCol);s+=px(4,17,8,1,shirtCol.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.max(0,parseInt(m,16)-30);return v.toString(16).padStart(2,'0');}));
    // Arms (animated swing via CSS)
    s+=px(2,11,2,1,shirtHi);s+=px(2,12,2,5,shirtCol);
    s+=px(12,11,2,1,shirtHi);s+=px(12,12,2,5,shirtCol);
    // Hands
    s+=px(2,17,2,1,C.skin);s+=px(12,17,2,1,C.skin);
    // Legs (walking pose)
    s+=px(5,18,3,1,pantsCol.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+20);return v.toString(16).padStart(2,'0');}));
    s+=px(5,19,3,4,pantsCol);
    s+=px(8,18,3,1,pantsCol.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+20);return v.toString(16).padStart(2,'0');}));
    s+=px(8,19,3,4,pantsCol);
    // Shoes (16-bit)
    s+=px(4,23,4,1,'#f0f0f0');s+=px(4,24,4,1,'#d0d0d0');
    s+=px(8,23,4,1,'#f0f0f0');s+=px(8,24,4,1,'#d0d0d0');
    s+=`</g>`;
    // Walking shadow on floor
    s+=`<ellipse cx="8" cy="25" rx="5" ry="1" fill="#000" opacity="0.08"/>`;
    return s;
  }

  /* ---- LOC BADGE (lines of code counter near character) ---- */
  function locBadge(x, y, lines){
    let s='';
    const label = lines >= 1000 ? (lines/1000).toFixed(1)+'k' : String(lines);
    const bw = label.length * 3.2 + 8;
    // Badge background
    s+=px(x-bw/2,y,bw,7,'#181828',0.85);
    s+=px(x-bw/2,y,bw,1,'#282840',0.6);
    // Code icon (tiny </>)
    s+=txt(x-bw/2+3,y+5,'</>',2,'#60a8f0','start');
    // Count
    s+=txt16(x+2,y+5.5,label,2.5,lines>500?'#40f8a0':lines>0?'#f0c830':'#585868');
    // "lines" sublabel
    s+=txt(x+2,y+9,'lines today',1.5,'#585868');
    return s;
  }

  /* ============ BUILD SCENE ============ */
  let _agentLocData = null;
  let _projectsData = null;

  function buildOffice(){
    const W=600, H=280;
    let s='';

    // ---- 32-BIT DEFS: gradients, filters, patterns ----
    s+=`<defs>
      <!-- Glow filters -->
      <filter id="neonGlow"><feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="neonWide"><feGaussianBlur stdDeviation="8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow"><feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="dropShadow"><feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
        <feOffset dx="1" dy="2" result="s"/><feFlood flood-color="#000" flood-opacity="0.3" result="c"/>
        <feComposite in="c" in2="s" operator="in" result="shadow"/>
        <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="furnitureShadow"><feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="1.5" dy="3" result="s"/><feFlood flood-color="#000" flood-opacity="0.2" result="c"/>
        <feComposite in="c" in2="s" operator="in" result="shadow"/>
        <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="monitorGlow"><feGaussianBlur stdDeviation="2" result="b"/><feFlood flood-color="#4080ff" flood-opacity="0.08" result="c"/>
        <feComposite in="c" in2="b" operator="in" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="ledGlow"><feGaussianBlur stdDeviation="1" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <!-- Gradients -->
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1e38"/><stop offset="60%" stop-color="#141428"/><stop offset="100%" stop-color="#101020"/>
      </linearGradient>
      <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#222038"/><stop offset="100%" stop-color="#161424"/>
      </linearGradient>
      <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.woodHi}"/><stop offset="30%" stop-color="${C.woodL}"/>
        <stop offset="70%" stop-color="${C.wood}"/><stop offset="100%" stop-color="${C.woodD}"/>
      </linearGradient>
      <linearGradient id="steelGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.steelHi}"/><stop offset="40%" stop-color="${C.steelL}"/>
        <stop offset="80%" stop-color="${C.steel}"/><stop offset="100%" stop-color="${C.steelD}"/>
      </linearGradient>
      <linearGradient id="monitorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3a3a48"/><stop offset="20%" stop-color="#2a2a34"/><stop offset="100%" stop-color="#181820"/>
      </linearGradient>
      <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.skinHi}"/><stop offset="50%" stop-color="${C.skin}"/><stop offset="100%" stop-color="${C.skinShd}"/>
      </linearGradient>
      <radialGradient id="lightCone" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stop-color="${C.ledWarm}" stop-opacity="0.08"/><stop offset="100%" stop-color="${C.ledWarm}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.08"/><stop offset="50%" stop-color="#80b8f0" stop-opacity="0.04"/><stop offset="100%" stop-color="#fff" stop-opacity="0.02"/>
      </linearGradient>
      <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="4" refY="1.5" orient="auto">
        <polygon points="0 0, 4 1.5, 0 3" fill="#e17055"/>
      </marker>
    </defs>`;

    // ---- 32-BIT WALLS ----
    s+=brickWall(W, Math.floor(W*0.28));

    // ---- 32-BIT FLOOR (gradient + reflections) ----
    s+=`<rect x="0" y="80" width="${W}" height="1.5" fill="url(#steelGrad)" opacity="0.5"/>`;
    s+=`<rect x="0" y="82" width="${W}" height="198" fill="url(#floorGrad)"/>`;
    // Subtle gradient bands for depth
    s+=px(0,82,W,20,C.floorHi,0.06);
    s+=px(0,200,W,80,'#000',0.04);
    for(let i=0;i<W;i+=20){s+=px(i,82,0.5,198,C.floorL,0.06);s+=px(i+1,82,0.5,198,'#000',0.02);}
    for(let j=82;j<280;j+=20){s+=px(0,j,W,0.5,C.floorL,0.05);s+=px(0,j+1,W,0.5,'#000',0.02);}
    // Floor reflections (16-bit polish effect)
    s+=px(100,85,80,1,C.floorHi,0.04);s+=px(300,90,60,1,C.floorHi,0.03);
    // Rug (16-bit: fringe + pattern)
    s+=px(W-172,195,69,1,C.rugD,0.3); // fringe top
    s+=px(W-170,196,65,30,C.rug,0.22);
    s+=px(W-168,198,61,26,C.rugL,0.1);
    // Rug pattern (diamond)
    for(let ry=0;ry<4;ry++) for(let rx=0;rx<5;rx++){
      s+=px(W-165+rx*12,200+ry*6,4,2,C.rugHi,0.08);
    }
    s+=px(W-172,225,69,1,C.rugD,0.3); // fringe bottom

    // ---- CEILING ----
    s+=px(80,0,250,3,'#2a2a3a');s+=px(80,3,250,0.5,C.steelD,0.3);
    // Sprinkler pipes
    s+=px(200,0,1,5,C.steelD,0.3);s+=px(350,0,1,5,C.steelD,0.3);

    // ---- LIGHTS ----
    for(let lx=45;lx<W;lx+=60)s+=pendant(lx);

    // ---- 32-BIT NEON SIGNS (real glow) ----
    s+=`<g class="neon-sign" filter="url(#neonGlow)" transform="translate(14,16)">${neonSign('BERKENBOT','#a8a0ff')}</g>`;
    s+=`<g class="neon-sign-2" filter="url(#neonGlow)" transform="translate(14,25)">${neonSmall('LABS  ·  BUILD  SHIP  REPEAT','#ff80b0')}</g>`;
    // Wall glow from neon (vivid bloom)
    s+=`<ellipse cx="60" cy="22" rx="70" ry="18" fill="#a8a0ff" opacity="0.12" filter="url(#neonWide)"/>`;
    s+=`<ellipse cx="60" cy="22" rx="40" ry="10" fill="#c8c0ff" opacity="0.08"/>`;
    s+=`<ellipse cx="80" cy="30" rx="70" ry="12" fill="#ff80b0" opacity="0.08" filter="url(#neonWide)"/>`;
    s+=`<ellipse cx="80" cy="30" rx="40" ry="8" fill="#ffa0c0" opacity="0.06"/>`;
    // Neon light spill onto floor
    s+=`<ellipse cx="60" cy="82" rx="50" ry="8" fill="#a8a0ff" opacity="0.04"/>`;
    s+=`<ellipse cx="80" cy="84" rx="50" ry="6" fill="#ff80b0" opacity="0.03"/>`;

    // ---- TIME-OF-DAY LIGHTING (CST) ----
    const now=new Date();
    const cstOff=-6;
    const utcH=now.getUTCHours()+now.getUTCMinutes()/60;
    const cstH=(utcH+cstOff+24)%24;
    
    // Sky color based on CST hour
    let skyTop, skyBot, sunMoonY, sunMoonCol, sunMoonR, isNight, bridgeCol, waterCol, cloudOp;
    if(cstH>=6 && cstH<8){ // sunrise
      const t=(cstH-6)/2;
      skyTop=`#${Math.round(20+t*100).toString(16).padStart(2,'0')}${Math.round(20+t*60).toString(16).padStart(2,'0')}${Math.round(60+t*120).toString(16).padStart(2,'0')}`;
      skyBot='#f0a060';sunMoonY=45-t*15;sunMoonCol='#f8d040';sunMoonR=5;isNight=false;bridgeCol='#c03020';waterCol='#285898';cloudOp=0.15+t*0.1;
    } else if(cstH>=8 && cstH<17){ // day
      skyTop='#4090e0';skyBot='#80c0f0';sunMoonY=10+Math.abs(cstH-12.5)*3;sunMoonCol='#f8e860';sunMoonR=4;isNight=false;bridgeCol='#d04030';waterCol='#3878b8';cloudOp=0.3;
    } else if(cstH>=17 && cstH<20){ // sunset
      const t=(cstH-17)/3;
      skyTop=`#${Math.round(100-t*80).toString(16).padStart(2,'0')}${Math.round(80-t*60).toString(16).padStart(2,'0')}${Math.round(180-t*120).toString(16).padStart(2,'0')}`;
      skyBot=`#${Math.round(200-t*140).toString(16).padStart(2,'0')}${Math.round(100-t*60).toString(16).padStart(2,'0')}${Math.round(60+t*20).toString(16).padStart(2,'0')}`;
      sunMoonY=30+t*20;sunMoonCol='#f08030';sunMoonR=5;isNight=false;bridgeCol='#a03020';waterCol='#284870';cloudOp=0.2-t*0.1;
    } else { // night
      skyTop='#0a0820';skyBot='#101830';sunMoonY=20;sunMoonCol='#e0e8f0';sunMoonR=3;isNight=true;bridgeCol='#601818';waterCol='#101838';cloudOp=0.05;
    }

    // ---- 32-BIT PANORAMIC WINDOW ----
    const winX=W*0.28+70, winY=4, winW=120, winH=65;
    // Window frame (gradient metallic)
    s+=`<rect x="${winX-3}" y="${winY-3}" width="${winW+6}" height="${winH+6}" rx="1" fill="url(#steelGrad)"/>`;
    s+=`<rect x="${winX-1}" y="${winY-1}" width="${winW+2}" height="${winH+2}" rx="0.5" fill="#101020"/>`;
    // Clip path for window contents
    s+=`<defs><clipPath id="winClip"><rect x="${winX}" y="${winY}" width="${winW}" height="${winH}"/></clipPath>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${skyTop}"/><stop offset="70%" stop-color="${skyBot}"/><stop offset="100%" stop-color="${waterCol}"/>
    </linearGradient>
    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${waterCol}"/><stop offset="100%" stop-color="${waterCol}" stop-opacity="0.6"/>
    </linearGradient></defs>`;

    // === PARALLAX LAYER 0: SKY (farthest — slowest) ===
    s+=`<g id="parallax-sky" clip-path="url(#winClip)">`;
    s+=`<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#skyGrad)"/>`;
    // Sun or moon
    const smX=winX+winW*0.75, smY=winY+sunMoonY*winH/80;
    s+=`<circle cx="${smX}" cy="${smY}" r="${sunMoonR+6}" fill="${sunMoonCol}" opacity="0.06"/>`;
    s+=`<circle cx="${smX}" cy="${smY}" r="${sunMoonR+3}" fill="${sunMoonCol}" opacity="0.12"/>`;
    s+=`<circle cx="${smX}" cy="${smY}" r="${sunMoonR}" fill="${sunMoonCol}" filter="url(#softGlow)"/>`;
    if(isNight){
      for(let st=0;st<12;st++){
        const sx=winX+5+((st*37)%110), sy=winY+2+((st*13)%25);
        s+=`<circle cx="${sx}" cy="${sy}" r="0.4" fill="#fff" opacity="${0.4+Math.random()*0.4}" class="star-twinkle" style="animation-delay:${st*0.5}s"/>`;
      }
      s+=`<circle cx="${winX+winW*0.75+1.5}" cy="${winY+sunMoonY*winH/80-0.5}" r="2.5" fill="${skyTop}"/>`;
    }
    // Clouds
    s+=`<g class="cloud-drift" opacity="${cloudOp}" filter="url(#softGlow)">`;
    s+=`<ellipse cx="${winX+25}" cy="${winY+10}" rx="14" ry="3.5" fill="#fff" opacity="0.7"/>`;
    s+=`<ellipse cx="${winX+21}" cy="${winY+9}" rx="8" ry="3" fill="#fff" opacity="0.5"/>`;
    s+=`<ellipse cx="${winX+30}" cy="${winY+11}" rx="6" ry="2" fill="#fff" opacity="0.6"/>`;
    s+=`<ellipse cx="${winX+78}" cy="${winY+14}" rx="12" ry="3" fill="#fff" opacity="0.6"/>`;
    s+=`<ellipse cx="${winX+82}" cy="${winY+13}" rx="7" ry="2.5" fill="#fff" opacity="0.4"/>`;
    s+=`</g>`;
    // Seagull (flies across every ~20s)
    s+=`<g class="seagull-fly">`;
    s+=`<path d="M0,0 Q-2,-2 -4,0" stroke="#fff" stroke-width="0.4" fill="none" opacity="0.7"/>`;
    s+=`<path d="M0,0 Q2,-2 4,0" stroke="#fff" stroke-width="0.4" fill="none" opacity="0.7"/>`;
    s+=`<circle cx="0" cy="0.3" r="0.4" fill="#fff" opacity="0.6"/>`;
    s+=`</g>`;
    // Second seagull (offset timing, different altitude)
    s+=`<g class="seagull-fly-2">`;
    s+=`<path d="M0,0 Q-1.5,-1.5 -3,0" stroke="#e8e8e8" stroke-width="0.3" fill="none" opacity="0.5"/>`;
    s+=`<path d="M0,0 Q1.5,-1.5 3,0" stroke="#e8e8e8" stroke-width="0.3" fill="none" opacity="0.5"/>`;
    s+=`<circle cx="0" cy="0.2" r="0.3" fill="#e8e8e8" opacity="0.4"/>`;
    s+=`</g>`;
    s+=`</g>`; // end parallax-sky

    // === PARALLAX LAYER 1: HILLS + BRIDGE (mid — medium speed) ===
    s+=`<g id="parallax-bridge" clip-path="url(#winClip)">`;
    const bY=winY+winH/2-8;
    // Hills/headlands (behind bridge)
    s+=`<path d="M${winX-5},${bY+3} Q${winX+15},${bY-10} ${winX+28},${bY+3}" fill="#1a3820" opacity="0.7"/>`;
    s+=`<path d="M${winX+86},${bY+3} Q${winX+100},${bY-8} ${winX+winW+5},${bY+3}" fill="#1a3820" opacity="0.6"/>`;
    // Far headland (very background)
    s+=`<path d="M${winX+40},${bY+3} Q${winX+60},${bY-4} ${winX+85},${bY+3}" fill="#1a3820" opacity="0.3"/>`;
    // Towers
    s+=px16(winX+30,bY-22,4,30,bridgeCol,bridgeCol,'#400808');
    s+=px16(winX+80,bY-22,4,30,bridgeCol,bridgeCol,'#400808');
    s+=px(winX+29,bY-22,6,2,bridgeCol);s+=px(winX+79,bY-22,6,2,bridgeCol);
    // Road deck
    s+=px(winX+10,bY,100,3,bridgeCol);
    s+=px(winX+10,bY,100,1,bridgeCol.replace('0','4'));
    // Cables
    s+=`<path d="M${winX+32},${bY-20} Q${winX+56},${bY-5} ${winX+82},${bY-20}" stroke="${bridgeCol}" stroke-width="0.8" fill="none"/>`;
    for(let c=0;c<10;c++){
      const cx=winX+35+c*5;
      const cableTop=bY-20+Math.pow((c-4.5)/4.5,2)*15;
      s+=`<line x1="${cx}" y1="${cableTop}" x2="${cx}" y2="${bY}" stroke="${bridgeCol}" stroke-width="0.3" opacity="0.6"/>`;
    }
    // ---- CARS ON BRIDGE (animated, tiny pixel cars) ----
    // Left-to-right lane (top of deck)
    s+=`<g class="car-right-1"><rect x="0" y="${bY}" width="3" height="1.2" rx="0.3" fill="#fff"/><rect x="0.5" y="${bY-0.3}" width="1.5" height="0.5" rx="0.2" fill="#c0d8f0" opacity="0.6"/></g>`;
    s+=`<g class="car-right-2"><rect x="0" y="${bY}" width="2.5" height="1.2" rx="0.3" fill="#f0c830"/><rect x="0.3" y="${bY-0.3}" width="1.2" height="0.5" rx="0.2" fill="#c0d8f0" opacity="0.5"/></g>`;
    s+=`<g class="car-right-3"><rect x="0" y="${bY}" width="2" height="1" rx="0.2" fill="#e74c3c"/></g>`;
    // Right-to-left lane (bottom of deck)
    s+=`<g class="car-left-1"><rect x="0" y="${bY+1.5}" width="3" height="1.2" rx="0.3" fill="#b0b0b8"/><rect x="0.8" y="${bY+1.2}" width="1.5" height="0.5" rx="0.2" fill="#c0d8f0" opacity="0.5"/></g>`;
    s+=`<g class="car-left-2"><rect x="0" y="${bY+1.5}" width="2.5" height="1" rx="0.3" fill="#3498db"/></g>`;
    // Night: car headlights/taillights
    if(isNight){
      for(let bl=0;bl<12;bl++){
        s+=`<circle cx="${winX+15+bl*8}" cy="${bY+1}" r="0.5" fill="#f8d040" opacity="0.7" class="bridge-light" style="animation-delay:${bl*0.2}s"/>`;
      }
    }
    s+=`</g>`; // end parallax-bridge

    // === PARALLAX LAYER 2: WATER + BOATS (nearest — fastest) ===
    s+=`<g id="parallax-water" clip-path="url(#winClip)">`;
    s+=`<rect x="${winX}" y="${winY+winH/2}" width="${winW}" height="${winH/2}" fill="url(#waterGrad)"/>`;
    // Water shimmer
    for(let wl=0;wl<8;wl++){
      s+=`<rect x="${winX+5+wl*14}" y="${winY+winH/2+3+wl%3*5}" width="${8+wl%4}" height="0.5" fill="#fff" opacity="0.06" class="water-shimmer" style="animation-delay:${wl*0.4}s"/>`;
    }
    // ---- BOATS (animated, drifting across the bay) ----
    // Sailboat (slow drift right)
    s+=`<g class="boat-drift-1">`;
    s+=`<rect x="0" y="0" width="5" height="1.5" rx="0.5" fill="#f0ece0"/>`;  // hull
    s+=`<rect x="0" y="-0.2" width="5" height="0.5" rx="0.3" fill="#d4a060"/>`;  // deck
    s+=`<line x1="2" y1="-0.5" x2="2" y2="-5" stroke="#b0a090" stroke-width="0.3"/>`;  // mast
    s+=`<polygon points="2,-5 2,-1 5,-2" fill="#fff" opacity="0.7"/>`;  // sail
    s+=`<rect x="0" y="1.5" width="5" height="0.3" fill="#fff" opacity="0.04"/>`;  // wake
    s+=`</g>`;
    // Cargo/ferry (slow drift left)
    s+=`<g class="boat-drift-2">`;
    s+=`<rect x="0" y="0" width="8" height="2" rx="0.5" fill="#484858"/>`;  // hull
    s+=`<rect x="1" y="-1" width="3" height="1.5" rx="0.3" fill="#586068"/>`;  // cabin
    s+=`<rect x="5" y="-0.5" width="2" height="0.8" rx="0.2" fill="#404850"/>`;  // container
    s+=`<rect x="2" y="-0.5" width="1" height="0.5" fill="#e74c3c" opacity="0.5"/>`;  // flag
    s+=`<rect x="0" y="2" width="8" height="0.3" fill="#fff" opacity="0.03"/>`;  // wake
    s+=`</g>`;
    // Small speedboat (faster)
    s+=`<g class="boat-drift-3">`;
    s+=`<rect x="0" y="0" width="3" height="1" rx="0.5" fill="#f0f0f0"/>`;
    s+=`<rect x="0" y="1" width="4" height="0.4" fill="#fff" opacity="0.06"/>`;  // wake spray
    s+=`</g>`;
    s+=`</g>`; // end parallax-water

    // === WINDOW FRAME OVERLAY (on top of all parallax layers) ===
    // Window dividers
    s+=px(winX+winW/3,winY,1,winH,C.steelD,0.5);
    s+=px(winX+winW*2/3,winY,1,winH,C.steelD,0.5);
    s+=px(winX,winY+winH/2,winW,1,C.steelD,0.3);
    // Window glass reflection
    s+=`<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#glassGrad)"/>`;
    s+=`<rect x="${winX+3}" y="${winY+2}" width="2" height="${winH-4}" rx="1" fill="#fff" opacity="0.06"/>`;
    s+=`<rect x="${winX+8}" y="${winY+4}" width="1" height="${winH-8}" rx="0.5" fill="#fff" opacity="0.03"/>`;
    s+=`<rect x="${winX+winW/3-.5}" y="${winY}" width="1" height="${winH}" fill="#fff" opacity="0.03"/>`;
    s+=`<rect x="${winX+winW*2/3-.5}" y="${winY}" width="1" height="${winH}" fill="#fff" opacity="0.03"/>`;

    // 32-BIT: Ambient light cast from window onto floor (gradient fade)
    if(!isNight){
      s+=`<defs><linearGradient id="floorLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sunMoonCol}" stop-opacity="0.04"/><stop offset="100%" stop-color="${sunMoonCol}" stop-opacity="0"/>
      </linearGradient></defs>`;
      s+=`<polygon points="${winX-5},${82} ${winX+winW+5},${82} ${winX+winW+50},${240} ${winX-30},${240}" fill="url(#floorLight)"/>`;
    }
    // Subtle monitor ambient (no overlays)
    s+=`<ellipse cx="200" cy="90" rx="180" ry="15" fill="#4080ff" opacity="0.012"/>`;

    // ---- CLOCK ----
    s+=wallClock(winX-12, 12);

    // ---- WHITEBOARD (project board, data-driven) ----
    const projItems = (_projectsData && _projectsData.items) || [];
    s+=`<g transform="translate(${W*0.28+8},8)">${whiteboard(projItems)}</g>`;

    // ---- BOOKSHELF ----
    s+=`<g transform="translate(${winX+winW+8},14)">${bookshelf()}</g>`;

    // ---- GLASS CORNER OFFICE (BERKEN_BOT) ----
    s+=`<g filter="url(#furnitureShadow)" transform="translate(${W-80},10)">${glassRoom(70,75)}</g>`;

    // ---- COFFEE STATION (back wall, left side) ----
    s+=`<g filter="url(#dropShadow)" transform="translate(6,16)">${coffeeStation()}</g>`;

    // ---- PING PONG (lounge) ----
    s+=`<g filter="url(#furnitureShadow)" transform="translate(${W-160},190)">${pingPong()}</g>`;

    // ---- PLANTS ----
    s+=`<g transform="translate(48,50)">${bigPlant('fiddle')}</g>`;
    s+=`<g transform="translate(${W-90},56)">${bigPlant('monstera')}</g>`;
    s+=`<g transform="translate(${W/2+30},54)">${bigPlant('snake')}</g>`;
    s+=`<g transform="translate(${W/2-50},54)">${bigPlant('fiddle')}</g>`;
    s+=`<g transform="translate(40,130)">${bigPlant('monstera')}</g>`;
    s+=`<g transform="translate(360,130)">${bigPlant('snake')}</g>`;
    s+=`<g transform="translate(120,190)">${bigPlant('fiddle')}</g>`;

    // ---- SERVER RACK (RELAY's domain) ----
    const rackX=W-220;
    s+=`<g filter="url(#furnitureShadow)">`;
    s+=`<g transform="translate(${rackX},38)" class="server-blink">${serverRack()}</g>`;
    s+=`<g transform="translate(${rackX+20},38)">${serverRack()}</g>`;
    s+=`<g transform="translate(${rackX+40},38)">${serverRack()}</g>`;
    s+=`</g>`;
    s+=px(rackX-2,36,64,2,C.steelD,0.4);

    // ---- AGENT WORKSTATIONS (more spread out for taller scene) ----
    const stations = [
      {x:455, y:52},   // BERKEN_BOT - corner office (inside glass room)
      {x:55,  y:90},   // FORGE - front row left
      {x:165, y:90},   // ANVIL - front row center
      {x:280, y:90},   // SCOUT - front row right
      {x:55,  y:150},  // CREATIVE - mid row left
      {x:165, y:150},  // CRON - mid row center
      {x:280, y:150},  // SENTINEL - mid row right
      {x:165, y:205},  // FLOAT - back row center (flex desk)
    ];

    AGENTS.forEach((ag,i)=>{
      const st=stations[i];
      const bx=st.x, by=st.y;

      // Desk (with drop shadow)
      s+=`<g filter="url(#furnitureShadow)" transform="translate(${bx},${by})">${desk(44)}</g>`;
      // Monitors on desk (with glow)
      s+=`<g filter="url(#monitorGlow)" transform="translate(${bx+7},${by-14})">${dualMon(ag.status==='green',ag.screen,i)}</g>`;
      // Desk accessories
      s+=`<g transform="translate(${bx+36},${by-3})">${deskStuff(ag.stuff)}</g>`;
      // Seated character WITH chair (hands at desk height)
      s+=`<g id="agent-${i}" transform="translate(${bx+10},${by+2})">${seatedAgent(ag, i)}</g>`;

      // ---- LABELS below workstation (16-bit drop shadow) ----
      s+=txt16(bx+22,by+32,ag.name,3.5,'#e8f0ff');
      s+=txt16(bx+22,by+37,ag.role,2.2,'#90a0b0');
      // LOC badge (floating above character's head)
      const agLines = (_agentLocData && _agentLocData.agents && _agentLocData.agents[ag.name]) || 0;
      s+=locBadge(bx+22, by-22, agLines);
      s+=projectTags(ag.projects,bx-2,by+39,50);
    });

    // ---- WALKING PEOPLE removed per request ----

    // ---- 32-BIT AMBIENT DETAILS ----
    // Sneakers (near lounge)
    s+=`<g filter="url(#dropShadow)">`;
    s+=`<rect x="${W-128}" y="215" width="4" height="2" rx="0.5" fill="#e04040"/>`;
    s+=`<rect x="${W-123}" y="215" width="4" height="2" rx="0.5" fill="#2878b0"/>`;
    s+=`</g>`;
    // Pizza box (on conference room area)
    s+=`<g filter="url(#dropShadow)">`;
    s+=`<rect x="${W-52}" y="52" width="8" height="6" rx="0.5" fill="url(#woodGrad)"/>`;
    s+=`<rect x="${W-51}" y="53" width="6" height="4" rx="0.3" fill="#e04040" opacity="0.25"/>`;
    s+=`</g>`;
    // Skateboard (near back)
    s+=`<g filter="url(#dropShadow)"><rect x="4" y="250" width="2" height="8" rx="1" fill="#e04040"/>`;
    s+=`<circle cx="5" cy="251.5" r="0.8" fill="#f0c830"/><circle cx="5" cy="257" r="0.8" fill="#f0c830"/></g>`;

    return {svg:s, width:W, height:H, winX, winY, winW, winH};
  }

  /* ============ INIT ============ */
  function init(){
    const container=document.getElementById('agentOffice');
    if(!container)return;

    const {svg,width,height,winX,winY,winW,winH}=buildOffice();
    const fullH=height+50;

    // Pinch-to-zoom wrapper
    container.innerHTML=`
      <div id="officeZoomWrap" style="overflow:hidden;touch-action:none;position:relative;width:100%;cursor:grab;">
        <svg xmlns="http://www.w3.org/2000/svg" id="officeSvg"
             viewBox="0 0 ${width} ${fullH}"
             style="display:block;width:100%;height:auto;">
          ${svg}
        </svg>
      </div>`;

    // ---- PINCH-TO-ZOOM + PAN (mobile & desktop) ----
    const wrap=document.getElementById('officeZoomWrap');
    const svgEl=document.getElementById('officeSvg');
    let oScale=1, oTx=0, oTy=0, lastDist=0, lastMid={x:0,y:0};
    let dragging=false, dsx=0, dsy=0;

    function clampTransform(){
      const maxTx=0, maxTy=0;
      const minTx=-(oScale-1)*wrap.clientWidth;
      const minTy=-(oScale-1)*wrap.clientHeight;
      oTx=Math.max(minTx,Math.min(maxTx,oTx));
      oTy=Math.max(minTy,Math.min(maxTy,oTy));
    }
    function applyTransform(){
      clampTransform();
      svgEl.style.transform=`translate(${oTx}px,${oTy}px) scale(${oScale})`;
      svgEl.style.transformOrigin='0 0';
      // Parallax: shift window layers at different rates when zoomed/panned
      // Convert pixel offset to SVG-space offset (divide by scale and viewBox ratio)
      const vbW=width, wrapW=wrap.clientWidth||1;
      const svgPerPx=vbW/(wrapW*oScale);
      const pxX=oTx*svgPerPx, pxY=oTy*svgPerPx;
      const zFactor=(oScale-1)*0.15;
      const skyEl=document.getElementById('parallax-sky');
      const bridgeEl=document.getElementById('parallax-bridge');
      const waterEl=document.getElementById('parallax-water');
      const px0=(-pxX*0.02+zFactor*1.5), py0=(-pxY*0.015);
      const px1=(-pxX*0.05+zFactor*0.8), py1=(-pxY*0.03);
      const px2=(-pxX*0.08+zFactor*0.3), py2=(-pxY*0.05);
      if(skyEl) skyEl.style.transform='translate('+px0+'px,'+py0+'px)';
      if(bridgeEl) bridgeEl.style.transform='translate('+px1+'px,'+py1+'px)';
      if(waterEl) waterEl.style.transform='translate('+px2+'px,'+py2+'px)';
    }

    // Touch: pinch zoom + pan
    wrap.addEventListener('touchstart',(e)=>{
      if(e.touches.length===2){
        const dx=e.touches[0].clientX-e.touches[1].clientX;
        const dy=e.touches[0].clientY-e.touches[1].clientY;
        lastDist=Math.sqrt(dx*dx+dy*dy);
        lastMid={x:(e.touches[0].clientX+e.touches[1].clientX)/2, y:(e.touches[0].clientY+e.touches[1].clientY)/2};
      } else if(e.touches.length===1 && oScale>1){
        dragging=true;
        dsx=e.touches[0].clientX-oTx;
        dsy=e.touches[0].clientY-oTy;
      }
    },{passive:true});

    wrap.addEventListener('touchmove',(e)=>{
      if(e.touches.length===2){
        e.preventDefault();
        const dx=e.touches[0].clientX-e.touches[1].clientX;
        const dy=e.touches[0].clientY-e.touches[1].clientY;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(lastDist>0){
          const newScale=Math.max(1,Math.min(5,oScale*(dist/lastDist)));
          const mid={x:(e.touches[0].clientX+e.touches[1].clientX)/2, y:(e.touches[0].clientY+e.touches[1].clientY)/2};
          const rect=wrap.getBoundingClientRect();
          const cx=mid.x-rect.left, cy=mid.y-rect.top;
          const ratio=newScale/oScale;
          oTx=cx-(cx-oTx)*ratio;
          oTy=cy-(cy-oTy)*ratio;
          oScale=newScale;
          applyTransform();
        }
        lastDist=dist;
      } else if(e.touches.length===1 && dragging){
        oTx=e.touches[0].clientX-dsx;
        oTy=e.touches[0].clientY-dsy;
        applyTransform();
      }
    },{passive:false});

    wrap.addEventListener('touchend',()=>{dragging=false;lastDist=0;});

    // Mouse wheel zoom
    wrap.addEventListener('wheel',(e)=>{
      e.preventDefault();
      const factor=1+Math.min(Math.abs(e.deltaY),100)*0.002;
      const delta=e.deltaY>0?1/factor:factor;
      const newScale=Math.max(1,Math.min(5,oScale*delta));
      const rect=wrap.getBoundingClientRect();
      const cx=e.clientX-rect.left, cy=e.clientY-rect.top;
      const ratio=newScale/oScale;
      oTx=cx-(cx-oTx)*ratio;
      oTy=cy-(cy-oTy)*ratio;
      oScale=newScale;
      applyTransform();
    },{passive:false});

    // Mouse drag pan
    wrap.addEventListener('mousedown',(e)=>{
      if(oScale>1){dragging=true;dsx=e.clientX-oTx;dsy=e.clientY-oTy;wrap.style.cursor='grabbing';}
    });
    wrap.addEventListener('mousemove',(e)=>{
      if(dragging){oTx=e.clientX-dsx;oTy=e.clientY-dsy;applyTransform();}
    });
    wrap.addEventListener('mouseup',()=>{dragging=false;wrap.style.cursor=oScale>1?'grab':'default';});
    wrap.addEventListener('mouseleave',()=>{dragging=false;});

    // Double-tap/click reset
    wrap.addEventListener('dblclick',()=>{oScale=1;oTx=0;oTy=0;applyTransform();wrap.style.cursor='default';});

    const style=document.createElement('style');
    style.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      .office-section { padding: 16px !important; }
      .agent-office-wrap { overflow: hidden; }
      #agentOffice svg{shape-rendering:geometricPrecision;}
      #parallax-sky,#parallax-bridge,#parallax-water{transition:transform 0.15s ease-out;}
      @keyframes typing{0%,100%{transform:translateY(0)}15%{transform:translateY(-0.5px)}30%{transform:translateY(0.3px)}50%{transform:translateY(-0.4px)}70%{transform:translateY(0.2px)}85%{transform:translateY(-0.2px)}}
      @keyframes idle{0%,100%{transform:translateY(0)}50%{transform:translateY(1px)}}
      @keyframes neonPulse{0%,100%{opacity:.9}50%{opacity:.5}}
      @keyframes neonPulse2{0%,100%{opacity:.85}30%{opacity:.45}70%{opacity:.7}}
      @keyframes serverBlink{0%,85%{opacity:1}90%{opacity:.5}95%{opacity:.85}100%{opacity:1}}
      @keyframes cursorBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
      @keyframes statusPulse{0%,100%{r:5;opacity:.08}50%{r:8;opacity:.03}}
      @keyframes antennaPulse{0%,100%{opacity:.7;r:1.5}50%{opacity:1;r:2}}
      @keyframes visorScan{0%{transform:translateX(0)}100%{transform:translateX(6px)}}
      @keyframes eyePulse{0%,100%{r:5;opacity:.06}50%{r:7;opacity:.1}}
      @keyframes ledSeq{0%,60%{opacity:.3}70%{opacity:1}100%{opacity:.3}}
      @keyframes holoShift{0%{opacity:.8}50%{opacity:1}100%{opacity:.8}}
      @keyframes chinBlink{0%,90%{opacity:.6}95%{opacity:1}100%{opacity:.6}}
      @keyframes coreGlow{0%,100%{opacity:.5;r:2}50%{opacity:.8;r:2.5}}
      @keyframes scanLine{0%{transform:translateY(0)}100%{transform:translateY(2.5px)}}
      @keyframes steamFloat{0%{opacity:.35;transform:translateY(0)}100%{opacity:0;transform:translateY(-4px)}}
      @keyframes heartbeatDash{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-20}}
      @keyframes walkRight{0%{transform:translateX(0)}100%{transform:translateX(80px)}}
      @keyframes walkLeft{0%{transform:translateX(0)}100%{transform:translateX(-60px)}}
      @keyframes headBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-0.5px)}}
      @keyframes codeScroll{0%{transform:translateY(0)}100%{transform:translateY(-2px)}}
      @keyframes diffFlash{0%,100%{opacity:1}50%{opacity:0.7}}
      @keyframes ciSpin{0%{fill:#f0c830}50%{fill:#40f8a0}100%{fill:#f0c830}}
      @keyframes loadingBar{0%{width:0}50%{width:11}80%{width:11}100%{width:0}}
      @keyframes notesFlicker{0%,90%{opacity:1}95%{opacity:0.6}100%{opacity:1}}
      @keyframes barPulse{0%{height:2;y:8}50%{height:7;y:3}100%{height:2;y:8}}
      @keyframes gaugeSpin{0%{stroke-dashoffset:0}100%{stroke-dashoffset:18}}
      @keyframes logScroll{0%{transform:translateY(0)}100%{transform:translateY(-3px)}}
      @keyframes statusBlink{0%,80%{opacity:0.8}85%{opacity:0.3}90%{opacity:0.9}100%{opacity:0.8}}
      @keyframes starTwinkle{0%,100%{opacity:0.3}50%{opacity:0.9}}
      @keyframes cloudDrift{0%{transform:translateX(0)}100%{transform:translateX(15px)}}
      @keyframes waterShimmer{0%,100%{opacity:0.04}50%{opacity:0.1}}
      @keyframes bridgeLight{0%,100%{opacity:0.5}50%{opacity:0.9}}
      @keyframes carRight{0%{transform:translateX(${winX+8}px)}100%{transform:translateX(${winX+110}px)}}
      @keyframes carLeft{0%{transform:translateX(${winX+108}px)}100%{transform:translateX(${winX+5}px)}}
      @keyframes boatDrift1{0%{transform:translate(${winX-5}px,${winY+winH/2+8}px)}100%{transform:translate(${winX+winW+5}px,${winY+winH/2+6}px)}}
      @keyframes boatDrift2{0%{transform:translate(${winX+winW+5}px,${winY+winH/2+16}px)}100%{transform:translate(${winX-10}px,${winY+winH/2+18}px)}}
      @keyframes boatDrift3{0%{transform:translate(${winX-3}px,${winY+winH/2+22}px)}100%{transform:translate(${winX+winW}px,${winY+winH/2+20}px)}}
      @keyframes seagullFly{0%{transform:translate(${winX-10}px,${winY+8}px);opacity:0}5%{opacity:0.8}50%{transform:translate(${winX+winW/2}px,${winY+5}px);opacity:0.8}95%{opacity:0.8}100%{transform:translate(${winX+winW+10}px,${winY+12}px);opacity:0}}
      @keyframes seagullFly2{0%{transform:translate(${winX+winW+8}px,${winY+18}px);opacity:0}5%{opacity:0.6}50%{transform:translate(${winX+winW/2-10}px,${winY+15}px);opacity:0.6}95%{opacity:0.6}100%{transform:translate(${winX-8}px,${winY+20}px);opacity:0}}
      @keyframes wingFlap{0%,100%{d:path("M0,0 Q-2,-2 -4,0")}50%{d:path("M0,0 Q-2,0.5 -4,0")}}
      .neon-sign{animation:neonPulse 3s ease-in-out infinite}
      .neon-sign-2{animation:neonPulse2 4s ease-in-out infinite}
      .server-blink{animation:serverBlink 1.5s steps(2) infinite}
      .cursor-blink{animation:cursorBlink 1s steps(1) infinite}
      .status-pulse{animation:statusPulse 2s ease-in-out infinite}
      .antenna-pulse{animation:antennaPulse 2s ease-in-out infinite}
      .visor-scan-0,.visor-scan-1,.visor-scan-2,.visor-scan-3,.visor-scan-4{animation:visorScan 1.5s ease-in-out infinite alternate}
      .eye-pulse{animation:eyePulse 2.5s ease-in-out infinite}
      .led-seq{animation:ledSeq 1s ease-in-out infinite}
      .holo-shift{animation:holoShift 3s ease-in-out infinite}
      .chin-blink{animation:chinBlink 4s ease-in-out infinite}
      .core-glow{animation:coreGlow 2s ease-in-out infinite}
      .scan-line{animation:scanLine 1.5s linear infinite alternate}
      .steam{animation:steamFloat 3s ease-out infinite}
      .heartbeat-line{stroke-dasharray:20;animation:heartbeatDash 2s linear infinite}
      .walk-right{animation:walkRight 8s ease-in-out infinite alternate}
      .walk-left{animation:walkLeft 6s ease-in-out infinite alternate}
      .code-scroll{animation:codeScroll 3s steps(2) infinite alternate}
      .term-type{animation:notesFlicker 4s steps(1) infinite}
      .diff-flash{animation:diffFlash 2s ease-in-out infinite}
      .ci-spin rect{animation:ciSpin 3s ease-in-out infinite}
      .loading-bar{animation:loadingBar 4s ease-in-out infinite}
      .notes-flicker{animation:notesFlicker 5s steps(1) infinite}
      .bar-pulse{animation:barPulse 2s ease-in-out infinite}
      .gauge-spin{animation:gaugeSpin 4s linear infinite}
      .log-scroll{animation:logScroll 5s steps(3) infinite}
      .status-blink{animation:statusBlink 3s ease-in-out infinite}
      .star-twinkle{animation:starTwinkle 2s ease-in-out infinite}
      .cloud-drift{animation:cloudDrift 20s ease-in-out infinite alternate}
      .water-shimmer{animation:waterShimmer 3s ease-in-out infinite}
      .bridge-light{animation:bridgeLight 2s ease-in-out infinite}
      .car-right-1{animation:carRight 6s linear infinite}
      .car-right-2{animation:carRight 6s linear infinite 2.5s}
      .car-right-3{animation:carRight 5s linear infinite 4s}
      .car-left-1{animation:carLeft 7s linear infinite 1s}
      .car-left-2{animation:carLeft 6s linear infinite 3.5s}
      .boat-drift-1{animation:boatDrift1 45s linear infinite}
      .boat-drift-2{animation:boatDrift2 55s linear infinite 10s}
      .boat-drift-3{animation:boatDrift3 25s linear infinite 5s}
      .seagull-fly{animation:seagullFly 18s linear infinite}
      .seagull-fly-2{animation:seagullFly2 22s linear infinite 9s}
      ${AGENTS.map((a,i)=>{
        if(a.status==='green')return`#agent-${i}{animation:typing .6s ease-in-out infinite}`;
        if(a.status==='yellow')return`#agent-${i}{animation:idle 2.5s ease-in-out infinite}`;
        return`#agent-${i}{opacity:.35}`;
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  async function loadAndInit(){
    const base = window.DASH_BASE || (() => {
      const p = window.location.pathname || '/';
      return p.includes('/BERKENBOT_DASHBOARD') ? '/BERKENBOT_DASHBOARD/' : '/';
    })();
    const v = Date.now();
    // Load agent LOC stats + projects data
    try{
      const r = await fetch(new URL('data/agent_stats.json', `${window.location.origin}${base}`).toString()+`?v=${v}`, {cache:'no-store'});
      if(r.ok) _agentLocData = await r.json();
    }catch(e){}
    try{
      const r2 = await fetch(new URL('data/projects.json', `${window.location.origin}${base}`).toString()+`?v=${v}`, {cache:'no-store'});
      if(r2.ok) _projectsData = await r2.json();
    }catch(e){}
    init();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadAndInit);
  else loadAndInit();
})();
