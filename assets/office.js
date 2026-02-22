/* =========================================================
   Agent Office — 8-bit Silicon Valley Startup HQ
   BerkenBot Labs — A real company, real employees
   ========================================================= */
(function () {
  'use strict';

  const C = {
    skin:'#f8c291', skinShd:'#e58e6a', skinD:'#d4896e',
    floor:'#1e1e2a', floorL:'#282838', floorTile:'#252535',
    concrete:'#3d3d4d', concreteL:'#4a4a5a',
    brick:'#8b4513', brickL:'#a0522d', brickM:'#6b3410',
    steel:'#9e9e9e', steelD:'#757575', steelL:'#c0c0c0',
    wood:'#d4a574', woodD:'#b8895a', woodL:'#e8c49a', woodDk:'#8b6914',
    glass:'#74b9ff', glassFrame:'#b2bec3',
    monitor:'#1e1e1e', monBezel:'#2d2d2d',
    led:'#fdcb6e', ledWarm:'#ffeaa7',
    plant:'#00b894', plantD:'#00a381', plantL:'#55efc4', plantDk:'#006d5b',
    pot:'#636e72', potL:'#b2bec3', potTerra:'#c0764a',
    board:'#fefefe', boardFrame:'#636e72',
    cup:'#fefefe', cupD:'#dfe6e9',
    slack:'#611f69',
    neon:'#a29bfe', neonPink:'#fd79a8', neonGreen:'#00b894',
    wall:'#16162a', wallL:'#1e1e36', wallM:'#1a1a30',
    carpet:'#1a3a5c', carpetL:'#1e4470',
    espresso:'#2d1810',
    server:'#2d3436', serverL:'#636e72', serverLed:'#00b894', serverLedR:'#e74c3c', serverLedY:'#fdcb6e',
    rug:'#6c5ce7', rugD:'#5b4cc7', rugL:'#7c6cf7',
    cactus:'#2ecc71', cactusD:'#27ae60',
    book1:'#e74c3c', book2:'#3498db', book3:'#f1c40f', book4:'#9b59b6', book5:'#1abc9c',
  };

  function px(x,y,w,h,fill,o){
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${o?` opacity="${o}"`:''}shape-rendering="crispEdges"/>`;
  }
  function txt(x,y,text,size,fill,anchor,bold){
    return `<text x="${x}" y="${y}" fill="${fill||'#b6c4ee'}" font-family="'Press Start 2P',monospace" font-size="${size||3}" text-anchor="${anchor||'middle'}"${bold?' font-weight="bold"':''}>${text}</text>`;
  }

  /* ---- DETAILED BRICK WALL ---- */
  function brickWall(totalW, brickEnd){
    let s='';
    // Dark base wall
    s+=px(0,0,totalW,80,C.wall);
    // Wainscoting / dark panel at bottom
    s+=px(0,62,totalW,18,C.wallM);
    s+=px(0,62,totalW,1,'#2a2a45');
    // Brick section
    for(let row=0;row<20;row++){
      const y=row*4, off=(row%2)?5:0;
      for(let col=-1;col<Math.ceil(brickEnd/10)+1;col++){
        const x=col*10+off;
        if(x+9<0||x>brickEnd)continue;
        const cx=Math.max(0,x), cw=Math.min(9,brickEnd-cx,x+9-cx);
        if(cw<=0)continue;
        const shade=(col+row)%3===0?C.brickL:(col+row)%3===1?C.brick:C.brickM;
        s+=px(cx,y,cw,3,shade);
        // Mortar highlight
        if((col+row)%5===0) s+=px(cx,y+3,cw,0.5,'#5a3a1a',0.3);
      }
    }
    // Concrete section with subtle texture
    s+=px(brickEnd,0,totalW-brickEnd,80,C.concreteL);
    for(let i=0;i<20;i++){
      const tx=brickEnd+5+i*18;
      if(tx<totalW)s+=px(tx,5+(i%6)*12,12,1,C.concrete,0.15);
    }
    // Exposed pipe along top
    s+=px(0,2,totalW,1.5,C.steelD,0.5);
    s+=px(0,1,totalW,0.5,C.steelL,0.2);
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

  /* ---- DUAL ULTRAWIDE MONITORS ---- */
  function dualMon(on,content){
    let s='';
    // Monitor L (ultrawide)
    s+=px(0,0,14,11,C.monBezel);
    s+=px(0,0,14,1,C.monitor);
    s+=px(1,1,12,9,'#0a0e1a');
    // Monitor R
    s+=px(15,0,14,11,C.monBezel);
    s+=px(15,0,14,1,C.monitor);
    s+=px(16,1,12,9,'#0a0e1a');
    // Stands (single arm mount)
    s+=px(13,11,3,2,C.steelD);
    s+=px(11,13,7,1,C.steel);
    s+=px(14,11,1,2,C.steelL);
    // Webcam
    s+=px(13,-1,3,1,'#2d3436');
    s+=px(14,-1,1,1,'#e74c3c',on?0.8:0.2);
    if(!on)return s;

    if(content==='code'){
      // Left: VS Code-like editor
      s+=px(2,2,3,7,'#1e2235'); // sidebar
      s+=px(2,2,3,1,'#636e72',0.3);
      // File tree dots
      for(let f=0;f<4;f++) s+=px(3,3+f*1.5,1,1,'#636e72',0.5);
      // Code lines with indentation
      s+=px(6,2,5,1,'#c678dd');s+=px(6,3,3,1,'#e06c75');s+=px(7,4,6,1,'#98c379');
      s+=px(7,5,4,1,'#61afef');s+=px(8,6,5,1,'#e5c07b');s+=px(7,7,3,1,'#56b6c2');
      s+=px(6,8,7,1,'#c678dd');s+=px(8,9,2,1,'#abb2bf');
      // Right: terminal with output
      s+=px(17,2,10,1,'#98c379');s+=px(17,3,8,1,'#abb2bf');
      s+=px(17,4,6,1,'#e5c07b');s+=px(17,5,9,1,'#61afef');
      s+=px(17,6,7,1,'#abb2bf');s+=px(17,7,4,1,'#98c379');
      s+=px(17,8,8,1,'#abb2bf');
      // Cursor blink
      s+=`<rect x="17" y="9" width="2" height="1" fill="#98c379" class="cursor-blink"/>`;
    } else if(content==='review'){
      // Left: GitHub PR diff view
      s+=px(2,2,11,1,'#abb2bf',0.5); // tab bar
      s+=px(2,3,6,1,'#2ecc71',0.4);s+=px(2,4,8,1,'#2ecc71',0.25);
      s+=px(2,5,5,1,'#e74c3c',0.4);s+=px(2,6,9,1,'#2ecc71',0.25);
      s+=px(2,7,7,1,'#2ecc71',0.4);s+=px(2,8,4,1,'#abb2bf',0.3);
      s+=px(2,9,6,1,'#e74c3c',0.3);
      // Right: CI/CD pipeline
      s+=px(17,2,3,2,'#2ecc71');s+=px(21,2,3,2,'#2ecc71');s+=px(25,2,3,2,'#f1c40f');
      s+=px(20,3,1,1,'#636e72');s+=px(24,3,1,1,'#636e72');
      s+=txt(18,6,'PASS',2,'#2ecc71','start');
      s+=txt(18,8,'98%',2.5,'#2ecc71','start');
      s+=px(17,9,10,1,'#636e72',0.3);
    } else if(content==='research'){
      // Left: ArXiv papers / browser tabs
      s+=px(2,2,11,1,'#636e72',0.4); // address bar
      s+=px(2,3,10,1,'#dfe6e9',0.6);
      s+=px(2,4,8,1,'#abb2bf',0.3);
      s+=px(2,6,6,1,'#74b9ff',0.6);s+=px(2,7,9,1,'#abb2bf',0.3);
      s+=px(2,8,7,1,'#abb2bf',0.3);s+=px(2,9,5,1,'#74b9ff',0.4);
      // Right: Obsidian-like notes
      s+=px(17,2,3,1,'#a29bfe');s+=px(21,2,5,1,'#abb2bf',0.3);
      s+=px(17,3,8,1,'#fdcb6e',0.4);s+=px(17,4,6,1,'#abb2bf',0.3);
      s+=px(17,6,5,1,'#a29bfe',0.6);s+=px(17,7,9,1,'#abb2bf',0.3);
      s+=px(17,8,7,1,'#abb2bf',0.3);
    } else if(content==='ops'){
      // Left: Grafana-like dashboard
      for(let i=0;i<10;i++){
        const bh=Math.floor(Math.random()*5+2);
        s+=px(2+i,10-bh,1,bh,'#74b9ff',0.7);
      }
      s+=px(2,10,10,0.5,'#636e72');
      // Gauge
      s+=`<circle cx="7" cy="5" r="3" fill="none" stroke="#2ecc71" stroke-width="0.6" stroke-dasharray="6,12" opacity="0.6"/>`;
      // Right: log stream
      s+=px(17,2,10,1,'#2ecc71',0.4);s+=px(17,3,8,1,'#abb2bf',0.3);
      s+=px(17,4,9,1,'#f1c40f',0.4);s+=px(17,5,7,1,'#abb2bf',0.3);
      s+=px(17,6,10,1,'#2ecc71',0.4);s+=px(17,7,6,1,'#abb2bf',0.3);
      s+=px(17,8,8,1,'#e74c3c',0.4);s+=px(17,9,9,1,'#2ecc71',0.3);
    } else if(content==='monitor'){
      // Left: heartbeat monitor
      let hb='M2,6 L3,6 L4,4 L5,8 L6,3 L7,7 L8,5 L9,6 L10,6 L11,4 L12,7';
      s+=`<path d="${hb}" stroke="#2ecc71" stroke-width="0.7" fill="none" class="heartbeat-line"/>`;
      s+=px(2,9,10,0.5,'#636e72');
      s+=txt(7,3,'99.97%',2,'#2ecc71');
      // Right: status matrix
      const statuses=['#2ecc71','#2ecc71','#f1c40f','#2ecc71','#2ecc71','#2ecc71','#e74c3c','#2ecc71','#2ecc71','#2ecc71','#f1c40f','#2ecc71'];
      statuses.forEach((c,i)=>{
        s+=px(17+(i%4)*2.5,2+Math.floor(i/4)*3,2,2,c,0.8);
      });
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

  /* ---- NEON SIGN ---- */
  function neonSign(text,color){
    color=color||C.neon;
    return `<text x="0" y="6" fill="${color}" font-family="'Press Start 2P',monospace" font-size="5" opacity="0.9">${text}</text>`
      +`<text x="0" y="6" fill="${color}" font-family="'Press Start 2P',monospace" font-size="5" opacity="0.15" filter="url(#neonGlow)">${text}</text>`;
  }

  /* ---- SMALL NEON ---- */
  function neonSmall(text,color){
    return `<text x="0" y="4" fill="${color||C.neonPink}" font-family="'Press Start 2P',monospace" font-size="3" opacity="0.85">${text}</text>`;
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

  /* ---- SITTING CHARACTER (merged into chair) ---- */
  function seatedAgent(ag, i){
    let s='';
    const hairCol=ag.hair, shirtCol=ag.shirt, pantsCol=ag.pants, status=ag.status, acc=ag.acc;

    // ---- CHAIR (behind character) ----
    // Chair back
    s+=px(3,-8,18,8,shirtCol,0.15); // chair back peek
    s+=px(1,-6,2,12,C.steelD); // armrest L
    s+=px(21,-6,2,12,C.steelD); // armrest R
    s+=px(1,-7,3,2,shirtCol,0.4); // arm pad L
    s+=px(20,-7,3,2,shirtCol,0.4); // arm pad R

    // ---- CHARACTER UPPER BODY (seated) ----
    // Hair
    s+=px(9,-30,10,5,hairCol);
    s+=px(8,-28,1,2,hairCol);s+=px(19,-28,1,2,hairCol);
    if(acc.beanie){ s+=px(8,-31,12,4,acc.beanie);s+=px(10,-32,8,2,acc.beanie);s+=px(9,-31,10,1,'#fff',0.1); }
    if(acc.ponytail){ s+=px(18,-29,2,6,hairCol);s+=px(19,-27,1,4,hairCol); }
    // Head
    s+=px(10,-27,8,9,C.skin);
    s+=px(9,-25,1,4,C.skin);s+=px(18,-25,1,4,C.skin);
    // Eyebrows
    s+=px(11,-25,3,1,hairCol,0.6);s+=px(15,-25,3,1,hairCol,0.6);
    // Eyes
    if(status==='green'){
      s+=px(12,-24,2,2,'#2d3436');s+=px(16,-24,2,2,'#2d3436');
      s+=px(12,-24,1,1,'#fff');s+=px(16,-24,1,1,'#fff');
    } else {
      s+=px(12,-23,2,1,'#636e72');s+=px(16,-23,2,1,'#636e72');
    }
    // Glasses
    if(acc.glasses){
      s+=`<rect x="11" y="-24.5" width="4" height="3" fill="none" stroke="${acc.glassCol||'#2d3436'}" stroke-width="0.5" rx="0.5"/>`;
      s+=`<rect x="15.5" y="-24.5" width="4" height="3" fill="none" stroke="${acc.glassCol||'#2d3436'}" stroke-width="0.5" rx="0.5"/>`;
      s+=px(15,-23,0.5,1,acc.glassCol||'#2d3436');
    }
    // Headphones
    if(acc.headphones){
      s+=px(8,-27,1,6,'#2d3436');s+=px(19,-27,1,6,'#2d3436');
      s+=`<path d="M8,-27 Q14,-31 19,-27" stroke="#2d3436" stroke-width="1" fill="none"/>`;
      s+=px(7,-25,2,4,acc.hpColor||'#e74c3c');s+=px(19,-25,2,4,acc.hpColor||'#e74c3c');
      if(acc.mic){s+=px(6,-23,1,4,'#2d3436');s+=px(5,-19,2,1,'#636e72');}
    }
    // Nose & mouth
    s+=px(14,-22,1,2,C.skinShd,0.5);
    s+=px(13,-20,3,1,status==='green'?'#e17055':'#b07050');
    // Neck
    s+=px(12,-18,4,2,C.skin);
    // Torso
    s+=px(6,-16,16,14,shirtCol);
    if(acc.hoodie){s+=px(12,-16,4,2,shirtCol);s+=px(13,-16,2,3,'#000',0.06);}
    if(acc.vest){s+=px(6,-16,4,14,acc.vestCol||'#2d3436');s+=px(18,-16,4,14,acc.vestCol||'#2d3436');}
    // Badge
    s+=px(17,-14,3,4,'#fff',0.15);s+=px(18,-13,1,1,'#74b9ff',0.5);
    // Arms reaching to desk
    s+=px(3,-14,3,12,shirtCol);s+=px(22,-14,3,12,shirtCol);
    // Hands on keyboard
    s+=px(2,-2,4,2,C.skin);s+=px(22,-2,4,2,C.skin);
    if(acc.watch){s+=px(3,-3,3,1,'#2d3436');s+=px(4,-4,1,1,'#74b9ff',0.6);}
    // Held items (adjusted for seated)
    if(acc.clipboard){
      s+=px(23,-8,6,8,'#b8895a');s+=px(24,-7,4,6,'#fefefe');
      s+=px(24,-6,3,1,'#2ecc71');s+=px(24,-4,3,1,'#e74c3c');s+=px(24,-2,2,1,'#f1c40f');
    }
    if(acc.magnifier){
      s+=`<circle cx="26" cy="-8" r="3.5" fill="none" stroke="#fdcb6e" stroke-width="0.8"/>`;
      s+=`<circle cx="26" cy="-8" r="2.5" fill="#74b9ff" opacity="0.12"/>`;
      s+=px(28,-5,1,4,'#fdcb6e');
    }
    if(acc.wrench){s+=px(23,-8,1,6,C.steelD);s+=px(22,-8,3,2,C.steel);}
    // Legs (bent, seated)
    s+=px(8,-2,5,4,pantsCol);s+=px(15,-2,5,4,pantsCol);
    // Legs extending forward
    s+=px(6,2,6,3,pantsCol);s+=px(16,2,6,3,pantsCol);
    // Shoes (feet on floor)
    const sc=acc.shoeCol||'#fff';
    s+=px(4,5,7,2,sc);s+=px(17,5,7,2,sc);
    s+=px(4,6,7,1,'#444');s+=px(17,6,7,1,'#444');

    // Chair base (in front of legs)
    s+=px(5,7,14,1,C.steel);
    s+=px(10,7,4,3,C.steel);
    s+=px(3,10,4,1,C.steelD);s+=px(17,10,4,1,C.steelD);s+=px(10,10,4,1,C.steelD);
    // Wheels
    s+=`<circle cx="5" cy="10.5" r="1" fill="#444"/>`;
    s+=`<circle cx="19" cy="10.5" r="1" fill="#444"/>`;
    s+=`<circle cx="12" cy="10.5" r="1" fill="#444"/>`;

    // Status indicator
    const lc=status==='green'?'#2ecc71':status==='yellow'?'#f1c40f':'#636e72';
    s+=`<circle cx="14" cy="-34" r="2" fill="${lc}"/>`;
    s+=`<circle cx="14" cy="-34" r="3.5" fill="${lc}" opacity="0.15"/>`;
    if(status==='green') s+=`<circle cx="14" cy="-34" r="5" fill="${lc}" opacity="0.06" class="status-pulse"/>`;

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

  /* ============ BUILD SCENE ============ */
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

    // ---- FLOOR (polished concrete) ----
    s+=px(0,80,W,2,'#4a4a5a');
    s+=px(0,82,W,158,C.floor);
    for(let i=0;i<W;i+=20)s+=px(i,82,0.5,158,C.floorL,0.08);
    for(let j=82;j<240;j+=20)s+=px(0,j,W,0.5,C.floorL,0.06);
    // Rug under lounge
    s+=px(W-170,145,65,30,C.rug,0.2);
    s+=px(W-168,147,61,26,C.rugL,0.12);

    // ---- CEILING ----
    s+=px(80,0,250,3,'#2a2a3a');s+=px(80,3,250,0.5,C.steelD,0.3);
    // Sprinkler pipes
    s+=px(200,0,1,5,C.steelD,0.3);s+=px(350,0,1,5,C.steelD,0.3);

    // ---- LIGHTS ----
    for(let lx=45;lx<W;lx+=60)s+=pendant(lx);

    // ---- NEON SIGNS ----
    s+=`<g class="neon-sign" transform="translate(14,16)">${neonSign('BERKENBOT','#a29bfe')}</g>`;
    s+=`<g class="neon-sign-2" transform="translate(14,25)">${neonSmall('LABS  ·  BUILD  SHIP  REPEAT','#fd79a8')}</g>`;

    // ---- CLOCK ----
    s+=wallClock(W*0.28+55, 12);

    // ---- WHITEBOARD ----
    s+=`<g transform="translate(${W*0.28+8},12)">${whiteboard()}</g>`;

    // ---- BOOKSHELF ----
    s+=`<g transform="translate(${W*0.28+45},14)">${bookshelf()}</g>`;

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
      s+=`<g transform="translate(${bx+7},${by-14})">${dualMon(ag.status==='green',ag.screen)}</g>`;
      // Desk accessories
      s+=`<g transform="translate(${bx+36},${by-3})">${deskStuff(ag.stuff)}</g>`;
      // Seated character WITH chair (single unit)
      s+=`<g id="agent-${i}" transform="translate(${bx+10},${by+15})">${seatedAgent(ag, i)}</g>`;

      // ---- LABELS below workstation ----
      s+=txt(bx+22,by+32,ag.name,3.5,'#eaf0ff',null,true);
      s+=txt(bx+22,by+37,ag.role,2.2,'#9e9e9e');
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
      .neon-sign{animation:neonPulse 3s ease-in-out infinite}
      .neon-sign-2{animation:neonPulse2 4s ease-in-out infinite}
      .server-blink{animation:serverBlink 1.5s steps(2) infinite}
      .cursor-blink{animation:cursorBlink 1s steps(1) infinite}
      .status-pulse{animation:statusPulse 2s ease-in-out infinite}
      .steam{animation:steamFloat 3s ease-out infinite}
      .heartbeat-line{stroke-dasharray:20;animation:heartbeatDash 2s linear infinite}
      .walk-right{animation:walkRight 8s ease-in-out infinite alternate}
      .walk-left{animation:walkLeft 6s ease-in-out infinite alternate}
      ${AGENTS.map((a,i)=>{
        if(a.status==='green')return`#agent-${i}{animation:typing .5s steps(4) infinite}`;
        if(a.status==='yellow')return`#agent-${i}{animation:idle 2.5s steps(4) infinite}`;
        return`#agent-${i}{opacity:.35}`;
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
