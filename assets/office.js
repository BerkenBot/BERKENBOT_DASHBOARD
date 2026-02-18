/* =========================================================
   Agent Office — 8-bit Silicon Valley startup, 5 agents
   ========================================================= */
(function () {
  'use strict';

  /* ---- palette ---- */
  const C = {
    skin:'#f8c291', skinShd:'#e58e6a',
    floor:'#2c2c2c', floorL:'#383838',
    concrete:'#3d3d3d', concreteL:'#4a4a4a',
    brick:'#8b4513', brickL:'#a0522d', brickM:'#6b3410',
    steel:'#9e9e9e', steelD:'#757575',
    wood:'#d4a574', woodD:'#b8895a', woodL:'#e8c49a',
    glass:'#74b9ff', glassFrame:'#b2bec3',
    monitor:'#1e1e1e',
    led:'#fdcb6e', ledWarm:'#ffeaa7',
    plant:'#00b894', plantD:'#00a381', plantL:'#55efc4',
    pot:'#636e72', potL:'#b2bec3',
    board:'#fefefe', boardFrame:'#636e72',
    cup:'#fefefe', cupD:'#dfe6e9',
    slack:'#611f69',
    neon:'#a29bfe',
    wall:'#1a1a2e', wallL:'#22223a',
    carpet:'#1a3a5c',
    espresso:'#2d1810',
    server:'#2d3436', serverL:'#636e72', serverLed:'#00b894', serverLedR:'#e74c3c',
  };

  function px(x,y,w,h,fill,o){
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${o?` opacity="${o}"`:''}shape-rendering="crispEdges"/>`;
  }
  function txt(x,y,text,size,fill,anchor){
    return `<text x="${x}" y="${y}" fill="${fill||'#b6c4ee'}" font-family="'Press Start 2P',monospace" font-size="${size||3}" text-anchor="${anchor||'middle'}">${text}</text>`;
  }

  /* ---- BRICK WALL ---- */
  function brickWall(totalW, brickEnd){
    let s='';
    s+=px(0,0,totalW,60,C.wall);
    for(let row=0;row<15;row++){
      const y=row*4, off=(row%2)?5:0;
      for(let col=-1;col<Math.ceil(brickEnd/10)+1;col++){
        const x=col*10+off;
        if(x+9<0||x>brickEnd)continue;
        const cx=Math.max(0,x), cw=Math.min(9,brickEnd-cx,x+9-cx);
        if(cw<=0)continue;
        const shade=(col+row)%3===0?C.brickL:(col+row)%3===1?C.brick:C.brickM;
        s+=px(cx,y,cw,3,shade);
      }
    }
    s+=px(brickEnd,0,totalW-brickEnd,60,C.concreteL);
    for(let i=0;i<12;i++){
      const tx=brickEnd+10+i*25;
      if(tx<totalW)s+=px(tx,8+(i%4)*11,10,1,C.concrete,0.25);
    }
    return s;
  }

  /* ---- PENDANT LIGHT ---- */
  function pendant(x){
    let s='';
    s+=px(x+2,0,1,6,C.steel);
    s+=px(x,6,5,2,C.steelD);
    s+=px(x+1,8,3,1,C.led);
    s+=px(x-1,9,7,4,C.ledWarm,0.06);
    return s;
  }

  /* ---- STANDING DESK ---- */
  function desk(w){
    w=w||36;
    let s='';
    s+=px(0,0,w,2,C.woodL);
    s+=px(0,2,w,1,C.woodD);
    s+=px(2,3,2,16,C.steel);
    s+=px(w-4,3,2,16,C.steel);
    s+=px(2,12,w-4,1,C.steelD);
    return s;
  }

  /* ---- DUAL MONITORS ---- */
  function dualMon(on,content){
    let s='';
    // Mon L
    s+=px(0,0,13,10,C.monitor);
    s+=px(1,1,11,8,'#0f111a');
    // Mon R
    s+=px(14,0,13,10,C.monitor);
    s+=px(15,1,11,8,'#0f111a');
    // Stands
    s+=px(4,10,5,1,C.steelD);
    s+=px(3,11,7,1,C.steel);
    s+=px(18,10,5,1,C.steelD);
    s+=px(17,11,7,1,C.steel);
    if(!on)return s;

    if(content==='code'){
      // Left: code
      s+=px(2,2,5,1,'#6c5ce7');s+=px(2,4,7,1,'#00b894');
      s+=px(3,5,5,1,'#fdcb6e');s+=px(2,6,8,1,'#74b9ff');s+=px(3,7,4,1,'#ff7675');
      // Right: terminal
      s+=px(16,2,3,1,'#00b894');s+=px(16,3,8,1,'#b2bec3');
      s+=px(16,5,6,1,'#74b9ff');s+=px(16,6,9,1,'#dfe6e9');s+=px(16,7,5,1,'#fdcb6e');
    } else if(content==='review'){
      // Left: diff view
      s+=px(2,2,5,1,'#00b894');s+=px(2,3,7,1,'#e74c3c',0.6);
      s+=px(2,4,6,1,'#00b894');s+=px(2,5,4,1,'#e74c3c',0.6);
      s+=px(2,6,8,1,'#00b894');s+=px(2,7,3,1,'#b2bec3');
      // Right: test results
      s+=px(16,2,2,1,'#00b894');s+=txt(19,3,'✓',2.5,'#00b894','start');
      s+=px(16,4,2,1,'#00b894');s+=txt(19,5,'✓',2.5,'#00b894','start');
      s+=px(16,6,2,1,'#e74c3c');s+=txt(19,7,'✗',2.5,'#e74c3c','start');
      s+=px(16,8,2,1,'#fdcb6e');s+=txt(19,9,'…',2.5,'#fdcb6e','start');
    } else if(content==='research'){
      // Left: browser/papers
      s+=px(2,2,9,1,'#dfe6e9');s+=px(2,3,7,1,'#b2bec3');
      s+=px(2,5,5,1,'#74b9ff');s+=px(2,6,8,1,'#b2bec3');
      s+=px(2,7,6,1,'#b2bec3');
      // Right: notes
      s+=px(16,2,8,1,'#fdcb6e');s+=px(16,3,6,1,'#b2bec3');
      s+=px(16,5,4,1,'#a29bfe');s+=px(16,6,7,1,'#b2bec3');s+=px(16,7,5,1,'#b2bec3');
    } else if(content==='ops'){
      // Left: dashboard graphs
      for(let i=0;i<6;i++) s+=px(2+i*2,8-Math.floor(Math.random()*5+1),1,Math.floor(Math.random()*5+1),'#74b9ff');
      s+=px(2,8,11,1,'#636e72');
      // Right: logs
      s+=px(16,2,9,1,'#00b894');s+=px(16,3,7,1,'#b2bec3');
      s+=px(16,4,8,1,'#fdcb6e');s+=px(16,5,5,1,'#b2bec3');
      s+=px(16,6,9,1,'#e74c3c',0.6);s+=px(16,7,6,1,'#b2bec3');
    } else if(content==='monitor'){
      // Left: heartbeat/graphs
      let hb='M2,6 L4,6 L5,3 L6,8 L7,4 L8,7 L9,5 L11,5';
      s+=`<path d="${hb}" stroke="#00b894" stroke-width="0.8" fill="none"/>`;
      s+=px(2,8,10,1,'#636e72');
      // Right: status grid
      const colors=['#00b894','#00b894','#fdcb6e','#00b894','#e74c3c','#00b894','#00b894','#fdcb6e','#00b894'];
      colors.forEach((c,i)=>{
        s+=px(16+(i%3)*3,2+Math.floor(i/3)*3,2,2,c);
      });
    }
    return s;
  }

  /* ---- ERGO CHAIR ---- */
  function chair(color){
    let s='';
    s+=px(3,0,10,5,color);
    s+=px(2,1,1,3,color);
    s+=px(13,1,1,3,color);
    s+=px(2,5,12,3,'#2d3436');
    s+=px(7,8,2,4,C.steel);
    s+=px(3,12,10,1,C.steel);
    s+=px(1,13,3,1,C.steelD);
    s+=px(12,13,3,1,C.steelD);
    return s;
  }

  /* ---- CHARACTER ---- */
  function agent(hairCol,shirtCol,pantsCol,status,acc){
    let s='';
    // Hair
    s+=px(7,0,10,5,hairCol);
    if(acc.beanie)s+=px(6,0,12,3,acc.beanie)+px(8,-1,8,2,acc.beanie);
    // Head
    s+=px(8,3,8,8,C.skin);
    s+=px(7,5,1,3,C.skin);s+=px(16,5,1,3,C.skin);
    // Eyes
    if(status==='green'){
      s+=px(10,6,2,2,'#2d3436');s+=px(14,6,2,2,'#2d3436');
      s+=px(10,6,1,1,'#fff');s+=px(14,6,1,1,'#fff');
    } else {
      s+=px(10,7,2,1,'#2d3436');s+=px(14,7,1,1,'#2d3436');
    }
    // Glasses
    if(acc.glasses){
      s+=`<rect x="9" y="5" width="4" height="3" fill="none" stroke="#2d3436" stroke-width="0.6"/>`;
      s+=`<rect x="14" y="5" width="4" height="3" fill="none" stroke="#2d3436" stroke-width="0.6"/>`;
      s+=px(13,6,1,1,'#2d3436');
    }
    // Headphones
    if(acc.headphones){
      s+=px(6,3,2,5,'#2d3436');s+=px(16,3,2,5,'#2d3436');s+=px(7,2,10,1,'#2d3436');
      s+=px(5,5,2,3,acc.hpColor||'#e74c3c');s+=px(17,5,2,3,acc.hpColor||'#e74c3c');
    }
    // Mouth
    s+=px(11,9,3,1,'#e17055');
    // Body
    s+=px(6,11,12,10,shirtCol);
    if(acc.hoodie)s+=px(10,11,4,1,'#fff',0.12);
    // Arms
    s+=px(3,12,3,8,shirtCol);s+=px(18,12,3,8,shirtCol);
    // Hands
    s+=px(3,20,3,2,C.skin);s+=px(18,20,3,2,C.skin);
    // Held item
    if(acc.clipboard){
      s+=px(19,17,5,7,'#b8895a');s+=px(20,18,3,5,'#fefefe');
      s+=px(20,19,2,1,'#00b894');s+=px(20,21,2,1,'#e74c3c');
    }
    if(acc.magnifier){
      s+=`<circle cx="22" cy="17" r="3" fill="none" stroke="#fdcb6e" stroke-width="0.8"/>`;
      s+=px(24,19,1,3,'#fdcb6e');
      s+=`<circle cx="22" cy="17" r="2" fill="#74b9ff" opacity="0.15"/>`;
    }
    // Pants
    s+=px(7,21,5,6,pantsCol);s+=px(13,21,5,6,pantsCol);
    // Sneakers
    const sc=acc.shoeCol||'#fff';
    s+=px(6,27,6,3,sc);s+=px(13,27,6,3,sc);
    s+=px(6,28,2,1,'#dfe6e9');s+=px(13,28,2,1,'#dfe6e9');
    // Status LED
    const lc=status==='green'?'#00b894':status==='yellow'?'#ffd979':'#636e72';
    s+=`<circle cx="22" cy="1" r="2" fill="${lc}"/><circle cx="22" cy="1" r="3.5" fill="${lc}" opacity="0.15"/>`;
    return s;
  }

  /* ---- SERVER RACK ---- */
  function serverRack(){
    let s='';
    s+=px(0,0,16,36,C.server);
    s+=px(1,1,14,34,'#22272b');
    // Units
    for(let u=0;u<6;u++){
      const uy=2+u*5;
      s+=px(2,uy,12,4,'#363d42');
      s+=px(3,uy+1,2,2,C.serverLed);
      s+=px(6,uy+1,1,2,C.serverLedR);
      // Vent lines
      s+=px(8,uy+1,4,1,C.serverL,0.4);
      s+=px(8,uy+2,4,1,C.serverL,0.3);
    }
    // Side handles
    s+=px(0,0,1,36,C.serverL);s+=px(15,0,1,36,C.serverL);
    return s;
  }

  /* ---- BIG PLANT ---- */
  function bigPlant(){
    let s='';
    s+=px(2,18,8,6,C.potL);s+=px(3,17,6,1,C.pot);s+=px(1,24,10,1,C.pot);
    s+=px(5,8,2,10,C.plantD);
    s+=px(1,2,5,6,C.plant);s+=px(0,4,2,3,C.plantL);
    s+=px(6,0,5,5,C.plantD);s+=px(8,1,4,3,C.plant);
    s+=px(3,6,3,4,C.plantL);s+=px(7,5,4,4,C.plant);
    s+=px(2,0,3,3,C.plantL);s+=px(9,3,3,3,C.plantD);
    return s;
  }

  /* ---- WHITEBOARD (wider, with research stuff) ---- */
  function whiteboard(){
    let s='';
    s+=px(0,0,28,18,C.boardFrame);
    s+=px(1,1,26,16,C.board);
    // Flowchart
    s+=px(3,3,5,3,'#74b9ff',0.5);s+=px(5,6,1,2,'#2d3436');
    s+=px(3,8,5,3,'#55efc4',0.5);
    s+=px(9,5,3,1,'#e17055');s+=px(11,4,1,1,'#e17055');s+=px(11,6,1,1,'#e17055');
    s+=px(13,3,6,3,'#a29bfe',0.5);s+=px(13,8,6,3,'#ffeaa7',0.5);
    s+=px(20,3,5,1,'#636e72',0.4);s+=px(20,5,4,1,'#636e72',0.4);
    s+=px(20,7,6,1,'#636e72',0.4);s+=px(20,9,3,1,'#636e72',0.4);
    // Marker tray
    s+=px(2,17,24,1,C.steelD);
    s+=px(5,16,2,1,'#e74c3c');s+=px(8,16,2,1,'#0984e3');s+=px(11,16,2,1,'#00b894');
    return s;
  }

  /* ---- COFFEE BAR ---- */
  function coffeeBar(){
    let s='';
    s+=px(0,0,28,3,C.woodL);s+=px(0,3,28,10,C.woodD);
    s+=px(1,4,12,8,C.wood);s+=px(15,4,12,8,C.wood);
    // Espresso machine
    s+=px(3,-7,8,7,C.steelD);s+=px(4,-6,6,4,C.steel);
    s+=px(5,-2,2,2,'#2d3436');s+=px(4,-8,2,2,C.steel);
    // Cups
    s+=px(14,-3,3,3,C.cup);s+=px(14,-3,3,1,C.cupD);
    s+=px(19,-2,2,2,C.cup);
    // Beans
    s+=px(23,-4,3,4,C.glass,0.3);s+=px(24,-2,1,2,C.espresso);
    return s;
  }

  /* ---- GLASS CONF ROOM ---- */
  function glassRoom(w,h){
    let s='';
    s+=px(0,h-4,w,4,C.carpet);
    s+=px(0,0,1,h,C.glassFrame);s+=px(w-1,0,1,h,C.glassFrame);s+=px(0,0,w,1,C.glassFrame);
    s+=px(1,1,w-2,h-5,C.glass,0.07);
    s+=px(2,3,1,h-10,'#fff',0.08);
    // Table
    s+=px(4,h-14,w-8,2,C.woodD);
    s+=px(6,h-12,2,8,C.steelD);s+=px(w-8,h-12,2,8,C.steelD);
    // TV
    s+=px(Math.floor(w/2)-6,3,12,7,C.monitor);
    s+=px(Math.floor(w/2)-5,4,10,5,'#0984e3',0.4);
    return s;
  }

  /* ---- PING PONG ---- */
  function pingPong(){
    let s='';
    s+=px(0,0,26,2,'#00b894');s+=px(0,0,26,1,'#009b7d');
    s+=px(12,0,2,2,'#fff',0.3);s+=px(12,-3,2,3,C.cupD,0.6);
    s+=px(2,2,2,8,C.steelD);s+=px(22,2,2,8,C.steelD);
    s+=px(4,-2,3,3,'#e74c3c');s+=px(19,-1,3,3,'#2980b9');
    return s;
  }

  /* ---- NEON SIGN ---- */
  function neonSign(text,color){
    color=color||C.neon;
    return `<text x="0" y="5" fill="${color}" font-family="'Press Start 2P',monospace" font-size="4.5" opacity="0.9">${text}</text>`
      +`<text x="0" y="5" fill="${color}" font-family="'Press Start 2P',monospace" font-size="4.5" opacity="0.12" filter="url(#neonGlow)">${text}</text>`;
  }

  /* ---- PROJECT TAGS ---- */
  function projectTags(projects, x, y, maxW){
    let s='';
    let cx=0, cy=0;
    const colors=['#6c5ce7','#00b894','#0984e3','#fdcb6e','#e74c3c','#fd79a8'];
    projects.forEach((p,i)=>{
      const tw=p.length*3.2+4;
      if(cx+tw>maxW){cx=0;cy+=5;}
      s+=px(x+cx,y+cy,tw,4,colors[i%colors.length],0.25);
      s+=txt(x+cx+tw/2,y+cy+3,p,2.2,'#dfe6e9');
      cx+=tw+2;
    });
    return s;
  }

  /* ============ AGENTS DATA ============ */
  const AGENTS = [
    {
      name:'FORGE', role:'Code / Builder',
      projects:['SCALARA','GH_INTEL','LOCAL_TTS','LORA_GEN','C64'],
      hair:'#b33939', shirt:'#e74c3c', pants:'#2d3436', status:'green',
      acc:{headphones:true,hpColor:'#e74c3c',hoodie:true,shoeCol:'#e74c3c'},
      screen:'code',
    },
    {
      name:'ANVIL', role:'QA / Review',
      projects:['SCALARA','GH_INTEL','LOCAL_TTS','LORA_GEN','C64'],
      hair:'#2d3436', shirt:'#00b894', pants:'#636e72', status:'green',
      acc:{glasses:true,clipboard:true,shoeCol:'#2d3436'},
      screen:'review',
    },
    {
      name:'SCOUT', role:'Research',
      projects:['COMPUTE_BUDGET','LOCAL_TTS','LORA_GEN'],
      hair:'#fdcb6e', shirt:'#0984e3', pants:'#2d3436', status:'green',
      acc:{magnifier:true,hoodie:true,shoeCol:'#0984e3'},
      screen:'research',
    },
    {
      name:'RELAY', role:'DevOps',
      projects:['DATA_AUDIT','COMPUTE_BUDGET','OPS_INFRA'],
      hair:'#636e72', shirt:'#fd79a8', pants:'#2d3436', status:'green',
      acc:{beanie:'#2d3436',headphones:true,hpColor:'#fd79a8',shoeCol:'#636e72'},
      screen:'ops',
    },
    {
      name:'PULSE', role:'Monitor',
      projects:['COMPUTE_BUDGET','OPS_INFRA'],
      hair:'#2d3436', shirt:'#a29bfe', pants:'#636e72', status:'green',
      acc:{glasses:true,headphones:true,hpColor:'#a29bfe',shoeCol:'#fff'},
      screen:'monitor',
    },
  ];

  /* ============ BUILD SCENE ============ */
  function buildOffice(){
    const W=560, H=130;
    let s='';

    // ---- WALLS ----
    s+=brickWall(W, Math.floor(W*0.3));

    // ---- FLOOR ----
    s+=px(0,60,W,2,'#4a4a4a');
    s+=px(0,62,W,68,C.floor);
    for(let i=0;i<W;i+=24)s+=px(i,62,1,68,C.floorL,0.12);
    for(let j=62;j<130;j+=14)s+=px(0,j,W,1,C.floorL,0.08);

    // ---- LIGHTS ----
    for(let lx=35;lx<W;lx+=65)s+=pendant(lx);

    // ---- NEON ----
    s+=`<g class="neon-sign" transform="translate(12,14)">${neonSign('BUILD  SHIP  REPEAT','#a29bfe')}</g>`;

    // ---- WHITEBOARD ----
    s+=`<g transform="translate(${W*0.3+15},10)">${whiteboard()}</g>`;

    // ---- GLASS CONF ROOM (far right bg) ----
    s+=`<g transform="translate(${W-60},16)">${glassRoom(50,46)}</g>`;

    // ---- COFFEE BAR (left wall) ----
    s+=`<g transform="translate(6,48)">${coffeeBar()}</g>`;

    // ---- PING PONG (right side lounge) ----
    s+=`<g transform="translate(${W-120},68)">${pingPong()}</g>`;

    // ---- LOUNGE RUG ----
    s+=px(W-135,78,50,8,C.carpet,0.35);

    // ---- PLANTS ----
    s+=`<g transform="translate(40,38)">${bigPlant()}</g>`;
    s+=`<g transform="translate(${W-75},46)">${bigPlant()}</g>`;
    s+=`<g transform="translate(${W/2-5},42)">${bigPlant()}</g>`;

    // ---- SERVER RACK (for RELAY) ----
    const rackX=W-180;
    s+=`<g transform="translate(${rackX},24)" class="server-blink">${serverRack()}</g>`;
    s+=`<g transform="translate(${rackX+18},24)">${serverRack()}</g>`;

    // ---- AGENT WORKSTATIONS ----
    const stationW=90;
    const startX=60;

    AGENTS.forEach((ag,i)=>{
      // Stagger Y for depth: front row / back row
      const row=i<3?0:1;
      const col=row===0?i:(i-3);
      const bx=startX+col*(stationW+(row===0?10:40))+row*45;
      const by=row===0?42:68;

      // Desk
      s+=`<g transform="translate(${bx},${by})">${desk(38)}</g>`;
      // Monitors
      s+=`<g transform="translate(${bx+5},${by-12})">${dualMon(ag.status==='green',ag.screen)}</g>`;
      // Chair
      s+=`<g transform="translate(${bx+12},${by+18})">${chair(ag.shirt)}</g>`;
      // Character
      s+=`<g id="agent-${i}" transform="translate(${bx+7},${by-4})">${agent(ag.hair,ag.shirt,ag.pants,ag.status,ag.acc)}</g>`;
      // Coffee cup
      s+=px(bx+1,by-2,3,2,C.cup);
      // Laptop
      s+=px(bx+30,by-2,5,1,C.steelD);
      s+=px(bx+30,by-3,5,1,'#74b9ff',ag.status==='green'?0.35:0.08);

      // ---- LABELS ----
      // Name + role
      s+=txt(bx+19,by+36,ag.name,3.5,'#eaf0ff');
      s+=txt(bx+19,by+41,ag.role,2.2,'#9e9e9e');
      // Project tags
      s+=projectTags(ag.projects,bx-2,by+43,44);
    });

    return {svg:s, width:W, height:H};
  }

  /* ============ INIT ============ */
  function init(){
    const container=document.getElementById('agentOffice');
    if(!container)return;

    const {svg,width,height}=buildOffice();
    const SCALE=4;
    // Extra vertical for labels
    const fullH=height+50;

    container.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 ${width} ${fullH}"
           width="${width*SCALE}" height="${fullH*SCALE}"
           style="image-rendering:pixelated;image-rendering:crisp-edges;display:block;max-width:100%;">
        <defs>
          <filter id="neonGlow"><feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        ${svg}
      </svg>`;

    const style=document.createElement('style');
    style.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      #agentOffice svg{image-rendering:pixelated;image-rendering:crisp-edges;}
      @keyframes typing{0%,100%{transform:translateY(0)}25%{transform:translateY(-0.4px)}50%{transform:translateY(0.3px)}75%{transform:translateY(-0.2px)}}
      @keyframes idle{0%,100%{transform:translateY(0)}50%{transform:translateY(0.7px)}}
      @keyframes neonPulse{0%,100%{opacity:.9}50%{opacity:.55}}
      @keyframes serverBlink{0%,90%,100%{opacity:1}95%{opacity:.7}}
      .neon-sign{animation:neonPulse 3s ease-in-out infinite}
      .server-blink{animation:serverBlink 2s steps(2) infinite}
      ${AGENTS.map((a,i)=>{
        if(a.status==='green')return`#agent-${i}{animation:typing .45s steps(4) infinite}`;
        if(a.status==='yellow')return`#agent-${i}{animation:idle 2.5s steps(4) infinite}`;
        return`#agent-${i}{opacity:.4}`;
      }).join('\n')}
    `;
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
