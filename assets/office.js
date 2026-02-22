/* =========================================================
   Agent Office — 8-bit Silicon Valley Startup HQ
   BerkenBot Labs — A real company, real employees
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

  /* ---- PENDANT / INDUSTRIAL LIGHT ---- */
  function pendant(x){
    let s='';
    s+=px(x+2,0,1,8,C.steel);
    s+=px(x-1,8,7,1,C.steelD);
    s+=px(x,9,5,2,C.steelD);
    s+=px(x+1,11,3,1,C.led);
    // Warm glow cone
    s+=`<polygon points="${x-4},20 ${x+8},20 ${x+5},12 ${x-1},12" fill="${C.ledWarm}" opacity="0.04"/>`;
    s+=`<polygon points="${x-8},35 ${x+12},35 ${x+7},12 ${x-3},12" fill="${C.ledWarm}" opacity="0.02"/>`;
    return s;
  }

  /* ---- STANDING DESK (more detail) ---- */
  function desk(w){
    w=w||40;
    let s='';
    // Desktop surface
    s+=px(0,0,w,3,C.woodL);
    s+=px(0,1,w,1,C.wood);
    s+=px(0,3,w,1,C.woodD);
    // Cable management tray
    s+=px(6,4,w-12,1,C.steelD,0.4);
    // Motorized legs
    s+=px(2,4,3,20,C.steel);
    s+=px(w-5,4,3,20,C.steel);
    // Feet
    s+=px(0,24,7,1,C.steelD);
    s+=px(w-7,24,7,1,C.steelD);
    // Cross brace
    s+=px(5,15,w-10,1,C.steelD,0.5);
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

  /* ---- SERVER RACK (detailed) ---- */
  function serverRack(){
    let s='';
    s+=px(0,0,18,40,C.server);
    s+=px(1,1,16,38,'#1a1e22');
    // Rack units
    for(let u=0;u<7;u++){
      const uy=2+u*5;
      s+=px(2,uy,14,4,'#2a3035');
      s+=px(2,uy,14,0.5,'#3a4045');
      // LEDs
      s+=px(3,uy+1,2,1,C.serverLed);
      s+=px(6,uy+1,1,1,u%3===2?C.serverLedY:C.serverLedR);
      s+=px(8,uy+1,1,1,C.serverLed);
      // Vent lines
      for(let v=0;v<3;v++) s+=px(10,uy+1+v*0.8,4,0.5,C.serverL,0.25);
      // Drive bays
      s+=px(3,uy+2.5,4,1,'#1a1e22');s+=px(8,uy+2.5,4,1,'#1a1e22');
    }
    // Side handles
    s+=px(0,0,1,40,C.serverL);s+=px(17,0,1,40,C.serverL);
    // Top vent
    s+=px(3,0,12,1,C.serverL,0.3);
    return s;
  }

  /* ---- BIG PLANT ---- */
  function bigPlant(variant){
    let s='';
    if(variant==='fiddle'){
      // Fiddle leaf fig
      s+=px(5,12,2,14,C.plantDk);
      s+=px(6,14,1,4,C.plantDk); // branch
      // Leaves
      s+=px(1,2,6,6,C.plant);s+=px(0,4,2,3,C.plantL);
      s+=px(7,0,5,5,C.plantD);s+=px(9,1,4,3,C.plant);
      s+=px(3,7,5,4,C.plantL);s+=px(8,5,4,4,C.plant);
      s+=px(2,0,3,3,C.plantL);
    } else if(variant==='monstera'){
      // Monstera
      s+=px(5,10,2,16,C.plantDk);
      s+=px(1,0,8,8,C.plant);s+=px(3,2,2,2,'#0a0e1a',0.1); // leaf hole
      s+=px(6,3,6,6,C.plantD);s+=px(8,5,1,1,'#0a0e1a',0.1);
      s+=px(0,5,4,5,C.plantL);
    } else {
      // Snake plant
      s+=px(4,0,2,18,C.plantD);s+=px(7,2,2,16,C.plant);s+=px(2,4,2,14,C.plantL);
      s+=px(9,6,2,12,C.plantD);
    }
    // Pot
    s+=px(1,24,10,6,C.potTerra);s+=px(2,23,8,1,C.potTerra);
    s+=px(2,24,8,1,'#d4896e',0.3);
    return s;
  }

  /* ---- WHITEBOARD (detailed) ---- */
  function whiteboard(){
    let s='';
    s+=px(0,0,32,22,C.boardFrame);
    s+=px(1,1,30,20,C.board);
    // Architecture diagram
    s+=px(3,3,6,4,'#74b9ff',0.4);s+=txt(6,6,'API',2,'#2d3436');
    s+=px(12,3,6,4,'#a29bfe',0.4);s+=txt(15,6,'LLM',2,'#2d3436');
    s+=px(21,3,8,4,'#2ecc71',0.4);s+=txt(25,6,'DEPLOY',1.8,'#2d3436');
    // Arrows
    s+=`<line x1="9" y1="5" x2="12" y2="5" stroke="#e17055" stroke-width="0.5" marker-end="url(#arrowhead)"/>`;
    s+=`<line x1="18" y1="5" x2="21" y2="5" stroke="#e17055" stroke-width="0.5"/>`;
    // Sprint board
    s+=px(3,9,6,2,'#f1c40f',0.4);s+=px(3,11,6,2,'#2ecc71',0.4);s+=px(3,13,6,2,'#e74c3c',0.3);
    // Notes
    s+=px(12,9,4,3,'#ffeaa7');s+=px(17,9,4,3,'#a29bfe',0.3);
    s+=px(12,13,6,3,'#74b9ff',0.3);s+=px(19,13,8,3,'#fdcb6e',0.2);
    // Sticky notes
    s+=px(22,9,3,3,'#ff7675',0.5);s+=px(26,10,3,3,'#55efc4',0.5);
    // Marker tray
    s+=px(2,21,28,1,C.steelD);
    s+=px(5,20,3,1,'#e74c3c');s+=px(9,20,3,1,'#0984e3');s+=px(13,20,3,1,'#2ecc71');s+=px(17,20,3,1,'#2d3436');
    return s;
  }

  /* ---- COFFEE BAR / KITCHEN ---- */
  function coffeeBar(){
    let s='';
    // Counter
    s+=px(0,0,34,3,C.woodL);s+=px(0,1,34,1,'#c4955e');
    s+=px(0,3,34,12,C.woodD);
    s+=px(1,4,15,10,C.wood);s+=px(18,4,15,10,C.wood);
    // Espresso machine
    s+=px(3,-10,10,10,C.steelD);
    s+=px(4,-9,8,6,C.steel);
    s+=px(4,-10,3,2,'#444');
    s+=px(6,-4,2,4,'#444'); // portafilter
    s+=px(5,-3,4,1,C.steelL);
    // Drip tray
    s+=px(4,-1,6,1,'#444');
    // Cups stack
    s+=px(16,-4,3,4,C.cup);s+=px(16,-4,3,1,C.cupD);
    s+=px(20,-3,3,3,C.cup);
    s+=px(24,-5,3,5,C.cup);s+=px(24,-5,3,1,C.cupD);
    // Fruit bowl
    s+=px(28,-3,4,3,C.steelL,0.3);
    s+=px(29,-4,1,1,'#e74c3c');s+=px(30,-4,1,1,'#f1c40f');s+=px(29,-3,2,1,'#2ecc71');
    // Sink
    s+=px(14,0,6,2,'#aaa',0.3);
    return s;
  }

  /* ---- GLASS CONFERENCE ROOM ---- */
  function glassRoom(w,h){
    let s='';
    // Floor
    s+=px(0,h-5,w,5,C.carpet);
    // Glass walls
    s+=px(0,0,1,h,C.glassFrame);s+=px(w-1,0,1,h,C.glassFrame);s+=px(0,0,w,1,C.glassFrame);
    s+=px(1,1,w-2,h-6,C.glass,0.06);
    // Reflections
    s+=px(2,4,1,h-12,'#fff',0.06);s+=px(4,6,1,h-16,'#fff',0.04);
    // Table (rounded conference table)
    s+=px(5,h-16,w-10,3,C.woodD);
    s+=px(7,h-13,2,9,C.steelD);s+=px(w-9,h-13,2,9,C.steelD);
    // TV screen
    const tvW=Math.floor(w*0.5);
    s+=px(Math.floor((w-tvW)/2),3,tvW,8,C.monitor);
    s+=px(Math.floor((w-tvW)/2)+1,4,tvW-2,6,'#0984e3',0.3);
    // "BerkenBot" on TV
    s+=txt(Math.floor(w/2),8,'SPRINT',2,'#fff');
    // Chairs
    for(let c=0;c<3;c++){
      const cx=6+c*Math.floor((w-14)/2);
      s+=px(cx,h-10,4,3,'#636e72');
    }
    return s;
  }

  /* ---- PING PONG TABLE ---- */
  function pingPong(){
    let s='';
    s+=px(0,0,30,3,'#00695c');s+=px(0,0,30,1,'#00796b');
    // Net
    s+=px(14,0,2,2,'#fff',0.4);s+=px(14,-4,2,4,C.cupD,0.6);
    // Legs
    s+=px(3,3,2,10,C.steelD);s+=px(25,3,2,10,C.steelD);
    // Paddles
    s+=px(4,-3,4,4,'#e74c3c');s+=px(5,-4,2,1,'#8b4513');
    s+=px(22,-2,4,4,'#2980b9');s+=px(23,-3,2,1,'#8b4513');
    // Ball
    s+=`<circle cx="18" cy="-2" r="1.2" fill="#f1c40f"/>`;
    return s;
  }

  /* ---- BOOKSHELF ---- */
  function bookshelf(){
    let s='';
    s+=px(0,0,20,30,C.woodDk);
    s+=px(1,1,18,28,'#3d2f1a');
    // Shelves
    for(let sh=0;sh<4;sh++){
      const sy=1+sh*7;
      s+=px(1,sy+6,18,1,C.woodDk);
      // Books
      const colors=[C.book1,C.book2,C.book3,C.book4,C.book5,'#e67e22','#2c3e50'];
      let bx=2;
      for(let b=0;b<5+Math.floor(Math.random()*3);b++){
        const bw=1+Math.floor(Math.random()*2);
        const bh=4+Math.floor(Math.random()*2);
        if(bx+bw>18)break;
        s+=px(bx,sy+6-bh,bw,bh,colors[b%colors.length]);
        bx+=bw+0.5;
      }
    }
    return s;
  }

  /* ---- 16-BIT NEON SIGN (double glow) ---- */
  function neonSign(text,color){
    color=color||C.neon;
    const hi=color.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+50);return v.toString(16).padStart(2,'0');});
    return `<text x="0" y="6" fill="${hi}" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.95">${text}</text>`
      +`<text x="0" y="6" fill="${color}" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.2" filter="url(#neonGlow)">${text}</text>`
      +`<text x="0.3" y="6.3" fill="#000" font-family="'Press Start 2P',monospace" font-size="5.5" opacity="0.15">${text}</text>`;
  }

  /* ---- 16-BIT SMALL NEON ---- */
  function neonSmall(text,color){
    color=color||C.neonPink;
    return `<text x="0" y="4" fill="${color}" font-family="'Press Start 2P',monospace" font-size="3.2" opacity="0.9">${text}</text>`
      +`<text x="0" y="4" fill="${color}" font-family="'Press Start 2P',monospace" font-size="3.2" opacity="0.12" filter="url(#neonGlow)">${text}</text>`;
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

  /* ---- DESK ACCESSORIES ---- */
  function deskStuff(type){
    let s='';
    if(type==='forge'){
      // Energy drink
      s+=px(0,0,2,4,'#e74c3c');s+=px(0,0,2,1,'#c0392b');
      // Mechanical keyboard (wider)
      s+=px(5,-1,12,3,'#2d3436');
      for(let k=0;k<5;k++) s+=px(6+k*2,0,1,1,'#636e72',0.5);
    } else if(type==='anvil'){
      // Tea mug
      s+=px(0,0,3,3,C.cup);s+=px(3,1,1,1,C.cupD);
      // Rubber duck
      s+=px(6,0,3,3,'#f1c40f');s+=px(7,-1,1,1,'#f1c40f');s+=px(8,1,1,1,'#e67e22');
    } else if(type==='scout'){
      // Notebook
      s+=px(0,0,5,4,'#2d3436');s+=px(1,1,3,2,'#fefefe',0.3);
      // Pen
      s+=px(6,0,1,4,'#0984e3');
    } else if(type==='relay'){
      // Cable spaghetti
      s+=`<path d="M0,0 Q3,2 2,4 Q1,6 4,5" stroke="#e74c3c" stroke-width="0.5" fill="none"/>`;
      s+=`<path d="M2,0 Q5,1 3,3 Q1,5 5,4" stroke="#74b9ff" stroke-width="0.5" fill="none"/>`;
    } else if(type==='pulse'){
      // Coffee cup with steam
      s+=px(0,1,3,3,C.cup);s+=px(3,2,1,1,C.cupD);
      s+=`<path d="M1,-2 Q2,-4 1,-5" stroke="#ddd" stroke-width="0.3" fill="none" opacity="0.3" class="steam"/>`;
    }
    return s;
  }

  /* ---- CLOCK ---- */
  function wallClock(x,y){
    let s='';
    s+=`<circle cx="${x}" cy="${y}" r="5" fill="#1e1e2e" stroke="${C.steelD}" stroke-width="0.5"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="4" fill="#0a0e1a"/>`;
    // Hour marks
    for(let h=0;h<12;h++){
      const a=h*30*Math.PI/180;
      s+=`<circle cx="${x+Math.sin(a)*3.2}" cy="${y-Math.cos(a)*3.2}" r="0.3" fill="${C.steelL}"/>`;
    }
    // Hands
    s+=`<line x1="${x}" y1="${y}" x2="${x+1.5}" y2="${y-2}" stroke="#fff" stroke-width="0.4"/>`;
    s+=`<line x1="${x}" y1="${y}" x2="${x-0.5}" y2="${y-3}" stroke="#aaa" stroke-width="0.3"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="0.5" fill="#e74c3c"/>`;
    return s;
  }

  /* ============ AGENTS DATA ============ */
  const AGENTS = [
    {
      name:'FORGE', role:'Lead Engineer',
      projects:['SCALARA','GH_INTEL','LOCAL_TTS','LORA_GEN','C64'],
      hair:'#b33939', shirt:'#e74c3c', pants:'#2d3436', status:'green',
      acc:{headphones:true,hpColor:'#e74c3c',mic:true,hoodie:true,shoeCol:'#e74c3c',watch:true},
      screen:'code', stuff:'forge',
    },
    {
      name:'ANVIL', role:'QA Lead',
      projects:['SCALARA','GH_INTEL','LOCAL_TTS','LORA_GEN','C64'],
      hair:'#2d3436', shirt:'#2ecc71', pants:'#636e72', status:'green',
      acc:{glasses:true,glassCol:'#2d3436',clipboard:true,shoeCol:'#2d3436',watch:true},
      screen:'review', stuff:'anvil',
    },
    {
      name:'SCOUT', role:'Research Lead',
      projects:['COMPUTE_BUDGET','LOCAL_TTS','LORA_GEN'],
      hair:'#fdcb6e', shirt:'#0984e3', pants:'#2d3436', status:'green',
      acc:{magnifier:true,hoodie:true,shoeCol:'#0984e3',ponytail:true},
      screen:'research', stuff:'scout',
    },
    {
      name:'RELAY', role:'DevOps Engineer',
      projects:['DATA_AUDIT','COMPUTE_BUDGET','OPS_INFRA'],
      hair:'#636e72', shirt:'#fd79a8', pants:'#2d3436', status:'green',
      acc:{beanie:'#2d3436',headphones:true,hpColor:'#fd79a8',wrench:true,shoeCol:'#636e72',buzzcut:true},
      screen:'ops', stuff:'relay',
    },
    {
      name:'PULSE', role:'SRE / Monitor',
      projects:['COMPUTE_BUDGET','OPS_INFRA'],
      hair:'#2d3436', shirt:'#a29bfe', pants:'#636e72', status:'green',
      acc:{glasses:true,glassCol:'#a29bfe',headphones:true,hpColor:'#a29bfe',shoeCol:'#fff',vest:true,vestCol:'#2d3436'},
      screen:'monitor', stuff:'pulse',
    },
  ];

  /* ---- 16-BIT SEATED CHARACTER ---- */
  function seatedAgent(ag, i){
    let s='';
    const hair=ag.hair, shirt=ag.shirt, pants=ag.pants, status=ag.status, acc=ag.acc;
    // Derived 16-bit shading colors
    const shirtHi=shirt.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+40);return v.toString(16).padStart(2,'0');});
    const shirtShd=shirt.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.max(0,parseInt(m,16)-40);return v.toString(16).padStart(2,'0');});
    const pantsHi=pants.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+30);return v.toString(16).padStart(2,'0');});

    // ---- CHAIR BACK (behind character) ----
    s+=px16(2,-10,20,10,C.steelL,C.steelD,C.steel); // chair back frame
    // Mesh pattern (16-bit detail)
    for(let my=-9;my<-2;my+=2) s+=px(4,my,16,1,'#000',0.06);
    s+=px(1,-8,2,14,C.steelD); // armrest L
    s+=px(0,-7,1,12,C.steelL,0.3); // armrest highlight
    s+=px(21,-8,2,14,C.steelD); // armrest R
    s+=px(1,-9,3,2,shirt,0.5); // arm pad L
    s+=px(20,-9,3,2,shirt,0.5); // arm pad R

    // ---- HAIR ----
    s+=px(9,-32,10,6,hair);
    s+=px(9,-32,10,1,hair.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+30);return v.toString(16).padStart(2,'0');})); // highlight
    s+=px(8,-30,1,3,hair);s+=px(19,-30,1,3,hair); // sideburns
    if(acc.beanie){s+=px(8,-33,12,5,acc.beanie);s+=px(10,-34,8,2,acc.beanie);s+=px(9,-33,10,1,'#fff',0.12);}
    if(acc.ponytail){s+=px(18,-31,2,7,hair);s+=px(19,-28,1,5,hair);}

    // ---- HEAD (16-bit: highlight + base + shadow) ----
    s+=px(10,-28,8,1,C.skinHi); // forehead highlight
    s+=px(10,-27,8,8,C.skin);
    s+=px(10,-20,8,1,C.skinShd); // jaw shadow
    s+=px(9,-26,1,5,C.skin);s+=px(18,-26,1,5,C.skin); // ears
    s+=px(9,-26,1,1,C.skinHi); // ear highlight

    // ---- EYEBROWS ----
    s+=px(11,-26,3,1,hair,0.7);s+=px(15,-26,3,1,hair,0.7);

    // ---- EYES (16-bit: white + iris + pupil + highlight) ----
    if(status==='green'){
      s+=px(11,-25,3,3,'#e8e8f0'); // white L
      s+=px(12,-24,2,2,'#2848a0'); // iris L
      s+=px(12,-24,1,1,'#181828'); // pupil L
      s+=px(13,-25,1,1,'#fff'); // highlight L
      s+=px(15,-25,3,3,'#e8e8f0'); // white R
      s+=px(16,-24,2,2,'#2848a0'); // iris R
      s+=px(16,-24,1,1,'#181828'); // pupil R
      s+=px(17,-25,1,1,'#fff'); // highlight R
    } else {
      s+=px(12,-24,2,1,'#484858');s+=px(16,-24,2,1,'#484858');
    }

    // ---- GLASSES ----
    if(acc.glasses){
      const gc=acc.glassCol||'#303038';
      s+=`<rect x="10.5" y="-26" width="4.5" height="4" fill="none" stroke="${gc}" stroke-width="0.6" rx="0.5"/>`;
      s+=px(11,-25,3,2,'#88c0f0',0.08); // lens glare
      s+=`<rect x="15" y="-26" width="4.5" height="4" fill="none" stroke="${gc}" stroke-width="0.6" rx="0.5"/>`;
      s+=px(16,-25,3,2,'#88c0f0',0.08);
      s+=px(14.5,-25,0.5,1,gc);
    }

    // ---- HEADPHONES (16-bit) ----
    if(acc.headphones){
      const hc=acc.hpColor||'#e04040';
      s+=px(8,-29,1,7,'#282830');s+=px(19,-29,1,7,'#282830');
      s+=`<path d="M8,-29 Q14,-33 19,-29" stroke="#282830" stroke-width="1.2" fill="none"/>`;
      s+=px(7,-27,2,5,hc);s+=px(7,-27,2,1,hc.replace(/[0-9a-f]{2}$/i,m=>{const v=Math.min(255,parseInt(m,16)+40);return v.toString(16).padStart(2,'0');})); // highlight
      s+=px(19,-27,2,5,hc);
      if(acc.mic){s+=px(6,-25,1,5,'#282830');s+=px(5,-20,3,2,'#484858');}
    }

    // ---- NOSE & MOUTH ----
    s+=px(14,-23,1,2,C.skinShd,0.4);
    if(status==='green'){s+=px(13,-20,3,1,'#d06048');s+=px(13,-20,1,1,'#e07058');} // smile
    else s+=px(13,-21,2,1,'#a06048');

    // ---- NECK ----
    s+=px(12,-19,4,2,C.skin);s+=px(12,-19,4,1,C.skinShd,0.15);

    // ---- TORSO (16-bit: highlight stripe + body + shadow) ----
    s+=px(6,-17,16,1,shirtHi); // collar highlight
    s+=px(6,-16,16,13,shirt);
    s+=px(6,-4,16,1,shirtShd); // bottom shadow
    // Shirt wrinkle details
    s+=px(10,-12,1,4,shirtShd,0.15);s+=px(16,-10,1,3,shirtHi,0.12);
    if(acc.hoodie){
      s+=px(12,-17,4,3,shirtHi,0.1); // hood at collar
      s+=px(10,-9,8,2,shirtShd,0.08); // kangaroo pocket shadow
      s+=px(10,-8,8,1,shirtHi,0.06);
    }
    if(acc.vest){
      s+=px(6,-17,4,15,acc.vestCol||'#282830');s+=px(6,-17,4,1,'#484858',0.2);
      s+=px(18,-17,4,15,acc.vestCol||'#282830');
    }
    // Badge
    s+=px(17,-15,4,5,'#fff',0.12);s+=px(18,-14,2,2,'#60a8f0',0.5);s+=px(18,-14,1,1,'#fff',0.2);

    // ---- ARMS (reaching to desk) ----
    s+=px(3,-15,3,1,shirtHi); // shoulder highlight L
    s+=px(3,-14,3,12,shirt);
    s+=px(22,-15,3,1,shirtHi); // shoulder highlight R
    s+=px(22,-14,3,12,shirt);

    // ---- HANDS ON KEYBOARD ----
    s+=px(2,-2,4,2,C.skin);s+=px(2,-2,4,1,C.skinHi); // highlight
    s+=px(22,-2,4,2,C.skin);s+=px(22,-2,4,1,C.skinHi);
    if(acc.watch){s+=px(3,-3,3,1,'#282830');s+=px(4,-4,1,1,'#60a8f0',0.7);}

    // ---- HELD ITEMS ----
    if(acc.clipboard){
      s+=px16(23,-9,7,10,C.woodHi,C.wood,C.woodD);
      s+=px(24,-8,5,7,'#f0f0e8');
      s+=px(24,-7,3,1,'#30d070');s+=px(24,-5,4,1,'#f04848');s+=px(24,-3,2,1,'#f0c830');
    }
    if(acc.magnifier){
      s+=`<circle cx="26" cy="-9" r="4" fill="none" stroke="#f0c830" stroke-width="1"/>`;
      s+=`<circle cx="26" cy="-9" r="3" fill="#60a8f0" opacity="0.1"/>`;
      s+=`<circle cx="26" cy="-9" r="1" fill="#fff" opacity="0.08"/>`;
      s+=px(29,-6,1,5,'#f0c830');
    }
    if(acc.wrench){
      s+=px16(23,-9,2,7,C.steelHi,C.steelD,C.steel);
      s+=px(22,-9,4,2,C.steelL);
    }

    // ---- LEGS (bent, seated — 16-bit) ----
    s+=px(8,-3,5,1,pantsHi);s+=px(8,-2,5,3,pants);
    s+=px(15,-3,5,1,pantsHi);s+=px(15,-2,5,3,pants);
    // Legs extending forward
    s+=px(6,1,6,4,pants);s+=px(6,1,6,1,pantsHi);
    s+=px(16,1,6,4,pants);s+=px(16,1,6,1,pantsHi);

    // ---- SHOES (16-bit: highlight + base + sole) ----
    const sc=acc.shoeCol||'#f0f0f0';
    s+=px(4,5,8,1,sc);s+=px(4,6,8,1,sc.replace(/f/gi,'d')); // darker
    s+=px(4,7,8,1,'#383838'); // sole
    s+=px(16,5,8,1,sc);s+=px(16,6,8,1,sc.replace(/f/gi,'d'));
    s+=px(16,7,8,1,'#383838');
    // Lace detail
    s+=px(6,5,1,1,'#fff',0.3);s+=px(18,5,1,1,'#fff',0.3);

    // ---- CHAIR BASE (16-bit) ----
    s+=px16(4,8,16,1,C.steelHi,C.steel,C.steelD);
    s+=px16(9,9,6,2,C.steelL,C.steel,C.steelD); // cylinder
    s+=px(2,11,5,1,C.steelD);s+=px(17,11,5,1,C.steelD);s+=px(9,11,6,1,C.steelD); // star base
    // Wheels (circles with highlight)
    s+=`<circle cx="4" cy="12" r="1.2" fill="#383838"/><circle cx="4" cy="11.5" r="0.5" fill="#505050"/>`;
    s+=`<circle cx="20" cy="12" r="1.2" fill="#383838"/><circle cx="20" cy="11.5" r="0.5" fill="#505050"/>`;
    s+=`<circle cx="12" cy="12" r="1.2" fill="#383838"/><circle cx="12" cy="11.5" r="0.5" fill="#505050"/>`;

    // ---- STATUS INDICATOR (16-bit glow) ----
    const lc=status==='green'?C.neonGreen:status==='yellow'?'#f0d040':'#585868';
    s+=`<circle cx="14" cy="-36" r="2.5" fill="${lc}"/>`;
    s+=`<circle cx="14" cy="-36" r="1" fill="#fff" opacity="0.3"/>`;
    s+=`<circle cx="14" cy="-36" r="4" fill="${lc}" opacity="0.15"/>`;
    if(status==='green') s+=`<circle cx="14" cy="-36" r="6" fill="${lc}" opacity="0.05" class="status-pulse"/>`;

    return s;
  }

  /* ---- WALKING CHARACTER (for ambient life) ---- */
  function walkingPerson(hairCol, shirtCol, pantsCol, dir){
    let s='';
    // Simple walking sprite
    const flip = dir==='left' ? 'transform="scale(-1,1)"' : '';
    s+=`<g ${flip}>`;
    s+=px(4,0,8,4,hairCol); // hair
    s+=px(5,3,6,7,C.skin); // head
    s+=px(7,5,2,2,'#2d3436'); // eye
    s+=px(4,10,8,8,shirtCol); // body
    s+=px(2,11,2,6,shirtCol); // arm back
    s+=px(12,11,2,6,shirtCol); // arm front  
    s+=px(5,18,3,5,pantsCol); // leg
    s+=px(8,18,3,5,pantsCol); // leg
    s+=px(4,23,4,2,'#fff'); // shoe
    s+=px(8,23,4,2,'#fff'); // shoe
    s+=`</g>`;
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

  function buildOffice(){
    const W=600, H=240;
    let s='';

    // ---- DEFS ----
    s+=`<defs>
      <filter id="neonGlow"><feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="4" refY="1.5" orient="auto">
        <polygon points="0 0, 4 1.5, 0 3" fill="#e17055"/>
      </marker>
    </defs>`;

    // ---- WALLS (taller scene) ----
    s+=brickWall(W, Math.floor(W*0.28));

    // ---- FLOOR (16-bit polished concrete with reflections) ----
    s+=px(0,80,W,1,C.steelD,0.4); // baseboard highlight
    s+=px(0,81,W,1,'#383848');
    s+=px(0,82,W,158,C.floor);
    // Subtle gradient bands for depth
    s+=px(0,82,W,20,C.floorHi,0.06);
    s+=px(0,160,W,40,'#000',0.04);
    for(let i=0;i<W;i+=20){s+=px(i,82,0.5,158,C.floorL,0.06);s+=px(i+1,82,0.5,158,'#000',0.02);}
    for(let j=82;j<240;j+=20){s+=px(0,j,W,0.5,C.floorL,0.05);s+=px(0,j+1,W,0.5,'#000',0.02);}
    // Floor reflections (16-bit polish effect)
    s+=px(100,85,80,1,C.floorHi,0.04);s+=px(300,90,60,1,C.floorHi,0.03);
    // Rug (16-bit: fringe + pattern)
    s+=px(W-172,145,69,1,C.rugD,0.3); // fringe top
    s+=px(W-170,146,65,30,C.rug,0.22);
    s+=px(W-168,148,61,26,C.rugL,0.1);
    // Rug pattern (diamond)
    for(let ry=0;ry<4;ry++) for(let rx=0;rx<5;rx++){
      s+=px(W-165+rx*12,150+ry*6,4,2,C.rugHi,0.08);
    }
    s+=px(W-172,175,69,1,C.rugD,0.3); // fringe bottom

    // ---- CEILING ----
    s+=px(80,0,250,3,'#2a2a3a');s+=px(80,3,250,0.5,C.steelD,0.3);
    // Sprinkler pipes
    s+=px(200,0,1,5,C.steelD,0.3);s+=px(350,0,1,5,C.steelD,0.3);

    // ---- LIGHTS ----
    for(let lx=45;lx<W;lx+=60)s+=pendant(lx);

    // ---- NEON SIGNS ----
    s+=`<g class="neon-sign" transform="translate(14,16)">${neonSign('BERKENBOT','#a29bfe')}</g>`;
    s+=`<g class="neon-sign-2" transform="translate(14,25)">${neonSmall('LABS  ·  BUILD  SHIP  REPEAT','#fd79a8')}</g>`;

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

    // ---- LARGE WINDOW WITH GOLDEN GATE BRIDGE ----
    const winX=W*0.28+70, winY=4, winW=120, winH=65;
    // Window frame
    s+=px16(winX-2,winY-2,winW+4,winH+4,C.steelHi,C.steelD,C.steel);
    // Sky
    s+=px(winX,winY,winW,winH/2,skyTop);
    s+=px(winX,winY+winH/2-5,winW,5,skyBot);
    // Sun or moon
    s+=`<circle cx="${winX+winW*0.75}" cy="${winY+sunMoonY*winH/80}" r="${sunMoonR}" fill="${sunMoonCol}"/>`;
    if(isNight){
      // Stars
      for(let st=0;st<12;st++){
        const sx=winX+5+((st*37)%110), sy=winY+2+((st*13)%25);
        s+=`<circle cx="${sx}" cy="${sy}" r="0.4" fill="#fff" opacity="${0.4+Math.random()*0.4}" class="star-twinkle" style="animation-delay:${st*0.5}s"/>`;
      }
      // Moon crescent shadow
      s+=`<circle cx="${winX+winW*0.75+1.5}" cy="${winY+sunMoonY*winH/80-0.5}" r="2.5" fill="${skyTop}"/>`;
    } else {
      // Sun glow
      s+=`<circle cx="${winX+winW*0.75}" cy="${winY+sunMoonY*winH/80}" r="${sunMoonR+3}" fill="${sunMoonCol}" opacity="0.1"/>`;
    }
    // Clouds
    s+=`<g class="cloud-drift" opacity="${cloudOp}">`;
    s+=`<ellipse cx="${winX+25}" cy="${winY+10}" rx="12" ry="3" fill="#fff"/>`;
    s+=`<ellipse cx="${winX+22}" cy="${winY+9}" rx="6" ry="2.5" fill="#fff"/>`;
    s+=`<ellipse cx="${winX+80}" cy="${winY+15}" rx="10" ry="2.5" fill="#fff"/>`;
    s+=`</g>`;
    // Water
    s+=px(winX,winY+winH/2,winW,winH/2,waterCol);
    // Water shimmer
    for(let wl=0;wl<8;wl++){
      s+=`<rect x="${winX+5+wl*14}" y="${winY+winH/2+3+wl%3*5}" width="${8+wl%4}" height="0.5" fill="#fff" opacity="0.06" class="water-shimmer" style="animation-delay:${wl*0.4}s"/>`;
    }
    // Golden Gate Bridge
    const bY=winY+winH/2-8; // bridge deck Y
    // Towers
    s+=px16(winX+30,bY-22,4,30,bridgeCol,bridgeCol,'#400808');
    s+=px16(winX+80,bY-22,4,30,bridgeCol,bridgeCol,'#400808');
    // Tower tops
    s+=px(winX+29,bY-22,6,2,bridgeCol);s+=px(winX+79,bY-22,6,2,bridgeCol);
    // Road deck
    s+=px(winX+10,bY,100,3,bridgeCol);
    s+=px(winX+10,bY,100,1,bridgeCol.replace('0','4')); // highlight
    // Cables (main span catenary)
    s+=`<path d="M${winX+32},${bY-20} Q${winX+56},${bY-5} ${winX+82},${bY-20}" stroke="${bridgeCol}" stroke-width="0.8" fill="none"/>`;
    // Suspender cables
    for(let c=0;c<10;c++){
      const cx=winX+35+c*5;
      const cableTop=bY-20+Math.pow((c-4.5)/4.5,2)*15;
      s+=`<line x1="${cx}" y1="${cableTop}" x2="${cx}" y2="${bY}" stroke="${bridgeCol}" stroke-width="0.3" opacity="0.6"/>`;
    }
    // Hills/headlands
    s+=`<path d="M${winX},${bY+3} Q${winX+15},${bY-8} ${winX+28},${bY+3}" fill="#1a3820" opacity="0.7"/>`;
    s+=`<path d="M${winX+86},${bY+3} Q${winX+100},${bY-6} ${winX+winW},${bY+3}" fill="#1a3820" opacity="0.6"/>`;
    // Night bridge lights
    if(isNight){
      for(let bl=0;bl<12;bl++){
        s+=`<circle cx="${winX+15+bl*8}" cy="${bY+1}" r="0.5" fill="#f8d040" opacity="0.7" class="bridge-light" style="animation-delay:${bl*0.2}s"/>`;
      }
    }
    // Window dividers
    s+=px(winX+winW/3,winY,1,winH,C.steelD,0.5);
    s+=px(winX+winW*2/3,winY,1,winH,C.steelD,0.5);
    s+=px(winX,winY+winH/2,winW,1,C.steelD,0.3);
    // Window reflection
    s+=px(winX+2,winY+2,3,winH-4,'#fff',0.04);

    // Ambient light cast from window onto floor
    if(!isNight){
      s+=`<polygon points="${winX},${80} ${winX+winW},${80} ${winX+winW+40},${180} ${winX-20},${180}" fill="${sunMoonCol}" opacity="0.02"/>`;
    }

    // ---- CLOCK ----
    s+=wallClock(winX-12, 12);

    // ---- WHITEBOARD ----
    s+=`<g transform="translate(${W*0.28+8},12)">${whiteboard()}</g>`;

    // ---- BOOKSHELF ----
    s+=`<g transform="translate(${winX+winW+8},14)">${bookshelf()}</g>`;

    // ---- GLASS CONF ROOM ----
    s+=`<g transform="translate(${W-70},15)">${glassRoom(60,68)}</g>`;

    // ---- COFFEE BAR ----
    s+=`<g transform="translate(8,62)">${coffeeBar()}</g>`;

    // ---- PING PONG (lounge) ----
    s+=`<g transform="translate(${W-160},130)">${pingPong()}</g>`;

    // ---- PLANTS ----
    s+=`<g transform="translate(48,50)">${bigPlant('fiddle')}</g>`;
    s+=`<g transform="translate(${W-85},56)">${bigPlant('monstera')}</g>`;
    s+=`<g transform="translate(${W/2+30},54)">${bigPlant('snake')}</g>`;
    s+=`<g transform="translate(${W/2-50},54)">${bigPlant('fiddle')}</g>`;
    s+=`<g transform="translate(160,120)">${bigPlant('monstera')}</g>`;

    // ---- SERVER RACK (RELAY's domain) ----
    const rackX=W-220;
    s+=`<g transform="translate(${rackX},38)" class="server-blink">${serverRack()}</g>`;
    s+=`<g transform="translate(${rackX+20},38)">${serverRack()}</g>`;
    s+=`<g transform="translate(${rackX+40},38)">${serverRack()}</g>`;
    s+=px(rackX-2,36,64,2,C.steelD,0.4);

    // ---- AGENT WORKSTATIONS (more spread out for taller scene) ----
    const stations = [
      {x:65,  y:80},   // FORGE - front left
      {x:185, y:80},   // ANVIL - front center
      {x:305, y:80},   // SCOUT - front right
      {x:100, y:135},  // RELAY - back row left
      {x:250, y:135},  // PULSE - back row right
    ];

    AGENTS.forEach((ag,i)=>{
      const st=stations[i];
      const bx=st.x, by=st.y;

      // Desk
      s+=`<g transform="translate(${bx},${by})">${desk(44)}</g>`;
      // Monitors on desk
      s+=`<g transform="translate(${bx+7},${by-14})">${dualMon(ag.status==='green',ag.screen,i)}</g>`;
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

    // ---- WALKING PEOPLE (ambient life) ----
    // Person walking to coffee bar
    s+=`<g id="walker-1" class="walk-right" transform="translate(55,92)">${walkingPerson('#8b4513','#3498db','#2d3436','right')}</g>`;
    // Person near ping pong
    s+=`<g id="walker-2" class="walk-left" transform="translate(${W-130},150)">${walkingPerson('#fdcb6e','#e74c3c','#636e72','left')}</g>`;

    // ---- AMBIENT DETAILS ----
    s+=px(W-128,143,4,2,'#e74c3c'); // sneakers
    s+=px(W-123,143,4,2,'#2980b9');
    s+=px(W-52,52,8,6,'#d4a574');s+=px(W-51,53,6,4,'#e74c3c',0.3); // pizza
    s+=px(192,66,4,3,'#ffeaa7'); // post-it
    // Skateboard leaning on wall
    s+=px(4,72,2,8,'#e74c3c');s+=px(3,73,1,1,'#fdcb6e');s+=px(3,78,1,1,'#fdcb6e');
    // Drone on shelf
    s+=px(W*0.28+50,14,4,2,'#636e72');s+=px(W*0.28+49,13,2,1,'#aaa',0.4);s+=px(W*0.28+54,13,2,1,'#aaa',0.4);

    return {svg:s, width:W, height:H};
  }

  /* ============ INIT ============ */
  function init(){
    const container=document.getElementById('agentOffice');
    if(!container)return;

    const {svg,width,height}=buildOffice();
    const fullH=height+50;

    // Pinch-to-zoom wrapper
    container.innerHTML=`
      <div id="officeZoomWrap" style="overflow:hidden;touch-action:none;position:relative;width:100%;cursor:grab;">
        <svg xmlns="http://www.w3.org/2000/svg" id="officeSvg"
             viewBox="0 0 ${width} ${fullH}"
             style="image-rendering:pixelated;image-rendering:crisp-edges;display:block;width:100%;height:auto;">
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
      #agentOffice svg{image-rendering:pixelated;image-rendering:crisp-edges;}
      @keyframes typing{0%,100%{transform:translateY(0)}15%{transform:translateY(-0.6px)}35%{transform:translateY(0.4px)}60%{transform:translateY(-0.3px)}80%{transform:translateY(0.2px)}}
      @keyframes idle{0%,100%{transform:translateY(0)}50%{transform:translateY(1px)}}
      @keyframes neonPulse{0%,100%{opacity:.9}50%{opacity:.5}}
      @keyframes neonPulse2{0%,100%{opacity:.85}30%{opacity:.45}70%{opacity:.7}}
      @keyframes serverBlink{0%,85%{opacity:1}90%{opacity:.5}95%{opacity:.85}100%{opacity:1}}
      @keyframes cursorBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
      @keyframes statusPulse{0%,100%{r:5;opacity:.08}50%{r:8;opacity:.03}}
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
      .neon-sign{animation:neonPulse 3s ease-in-out infinite}
      .neon-sign-2{animation:neonPulse2 4s ease-in-out infinite}
      .server-blink{animation:serverBlink 1.5s steps(2) infinite}
      .cursor-blink{animation:cursorBlink 1s steps(1) infinite}
      .status-pulse{animation:statusPulse 2s ease-in-out infinite}
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
      ${AGENTS.map((a,i)=>{
        if(a.status==='green')return`#agent-${i}{animation:typing .5s steps(4) infinite}`;
        if(a.status==='yellow')return`#agent-${i}{animation:idle 2.5s steps(4) infinite}`;
        return`#agent-${i}{opacity:.35}`;
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  async function loadAndInit(){
    // Load agent LOC stats
    try{
      const base = window.DASH_BASE || (() => {
        const p = window.location.pathname || '/';
        return p.includes('/BERKENBOT_DASHBOARD') ? '/BERKENBOT_DASHBOARD/' : '/';
      })();
      const url = new URL('data/agent_stats.json', `${window.location.origin}${base}`).toString();
      const r = await fetch(`${url}?v=${Date.now()}`, {cache:'no-store'});
      if(r.ok) _agentLocData = await r.json();
    }catch(e){console.log('agent_stats not available yet');}
    init();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadAndInit);
  else loadAndInit();
})();
