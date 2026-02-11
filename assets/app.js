const DASH_BASE = (() => {
  const p = window.location.pathname || '/';
  return p.includes('/BERKENBOT_DASHBOARD') ? '/BERKENBOT_DASHBOARD/' : '/';
})();

function resolvePath(path){
  return new URL(path, `${window.location.origin}${DASH_BASE}`).toString();
}

const CACHE_BUST = `${Date.now()}`;

async function load(path){
  const baseUrl = resolvePath(path);
  const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${CACHE_BUST}`;
  const r = await fetch(url, { cache: 'no-store' });
  if(!r.ok) throw new Error(`${path} (HTTP ${r.status})`);
  return r.json();
}
const badge=(s)=>`<span class="status ${s}">${s}</span>`;
const bar=(pct)=>`<div class="progress"><span style="width:${Math.max(0,Math.min(100,pct))}%"></span></div>`;

function drawLineChart({canvasId, legendId, samples, series, yMax=100, yLabel='%'}){
  const canvas = document.getElementById(canvasId);
  if(!canvas || !samples?.length) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const pad = {l:56,r:12,t:18,b:28};
  const cw = w-pad.l-pad.r, ch = h-pad.t-pad.b;

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = '#0f1834'; ctx.fillRect(0,0,w,h);

  // grid
  ctx.strokeStyle = '#2b3f74'; ctx.lineWidth = 1;
  for(let i=0;i<=5;i++){
    const y = pad.t + (ch*i/5);
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
    const v = Math.round(yMax - i*(yMax/5));
    ctx.fillStyle = '#94a7de'; ctx.font='11px sans-serif';
    ctx.fillText(v + yLabel, 8, y+4);
  }

  function x(i,n){ return pad.l + (n<=1?0:(i*(cw/(n-1)))); }
  function y(v){ return pad.t + (yMax-v)*(ch/yMax); }

  series.forEach(sr=>{
    ctx.strokeStyle = sr.color; ctx.lineWidth = 2; ctx.beginPath();
    let moved=false;
    samples.forEach((s,i)=>{
      const raw = sr.get(s);
      if(raw===null || raw===undefined || Number.isNaN(raw)) return;
      const v = Math.max(0, Math.min(yMax, raw));
      const px=x(i,samples.length), py=y(v);
      if(!moved){ ctx.moveTo(px,py); moved=true; } else { ctx.lineTo(px,py); }
    });
    ctx.stroke();
  });

  // x labels
  const start = samples[0]?.ts || '';
  const end = samples[samples.length-1]?.ts || '';
  ctx.fillStyle='#94a7de'; ctx.font='11px sans-serif';
  ctx.fillText(start.replace('T',' ').slice(5,16), pad.l, h-8);
  const txt=end.replace('T',' ').slice(5,16);
  ctx.fillText(txt, w-pad.r-ctx.measureText(txt).width, h-8);

  const lg = document.getElementById(legendId);
  if(lg){
    lg.innerHTML = series.map(s=>`<span class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${s.name}</span>`).join('');
  }
}

(async()=>{
  try{
    const [overview, projects, bots, events, security, history, sysm, tokens, llmBench] = await Promise.all([
      load('data/overview.json'),
      load('data/projects.json'),
      load('data/bots.json'),
      load('data/events.json'),
      load('data/security.json'),
      load('data/history.json'),
      load('data/system_metrics.json'),
      load('data/token_metrics.json'),
      load('data/llm_benchmarks.json'),
    ]);

    document.getElementById('lastUpdated').textContent = `Last updated: ${overview.lastUpdated}`;

    const cards = document.getElementById('overviewCards');
    overview.metrics.forEach(m=>{
      const el=document.createElement('div'); el.className='card';
      el.innerHTML=`<div class="k">${m.key}</div><div class="v">${m.value}</div>`;
      cards.appendChild(el);
    });

    const projectCards=document.getElementById('projectCards');
    projects.items.forEach(p=>{
      const div=document.createElement('div'); div.className='project';
      const subs=(p.subprocesses||[]).map(sp=>`
        <div class="subproc">
          <div class="progress-label"><span>${sp.name} ${badge(sp.status)}</span><span>${sp.progress}%</span></div>
          ${bar(sp.progress)}
          <div class="muted">${sp.note||''}</div>
        </div>`).join('');

      div.innerHTML=`
        <h3>${p.name} ${badge(p.status)}</h3>
        <div class="muted">Owner: ${p.owner} • Last update: ${p.lastUpdate}</div>
        <div class="progress-wrap">
          <div class="progress-label"><span>Overall completion</span><span>${p.progress}%</span></div>
          ${bar(p.progress)}
        </div>
        <div><b>Next:</b> ${p.nextAction}</div>
        <div class="muted" style="margin-top:8px">Sub-processes</div>
        ${subs}
      `;
      projectCards.appendChild(div);
    });

    const botGrid=document.getElementById('botGrid');
    bots.items.forEach(b=>{
      const div=document.createElement('div'); div.className='bot';
      div.innerHTML=`<h3>${b.name} ${badge(b.status)}</h3><p>${b.summary}</p><p><b>Last heartbeat:</b> ${b.lastHeartbeat}</p>`;
      botGrid.appendChild(div);
    });

    const eventsList=document.getElementById('eventsList');
    events.items.forEach(e=>{ const li=document.createElement('li'); li.textContent=`[${e.when}] ${e.text}`; eventsList.appendChild(li); });

    const historyBody=document.querySelector('#historyTable tbody');
    history.items.forEach(h=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${h.when}</td><td>${h.project}</td><td>${h.event}</td><td>${badge(h.status)}</td><td>${h.progress}%</td>`;
      historyBody.appendChild(tr);
    });

    const securityList=document.getElementById('securityList');
    security.items.forEach(s=>{ const li=document.createElement('li'); li.innerHTML=`${badge(s.level)} ${s.text}`; securityList.appendChild(li); });

    drawLineChart({
      canvasId:'usageChart', legendId:'usageLegend', samples: sysm.samples || [], yMax:100, yLabel:'%',
      series:[
        {name:'CPU %', color:'#63a7ff', get:s=>s.cpu_pct ?? null},
        {name:'RAM %', color:'#7be3c4', get:s=>s.ram_pct ?? null},
        {name:'GPU0 util %', color:'#ffb86b', get:s=>(s.gpu?.find(g=>g.index===0)?.util_pct ?? null)},
        {name:'GPU1 util %', color:'#ff7d9b', get:s=>(s.gpu?.find(g=>g.index===1)?.util_pct ?? null)},
        {name:'GPU0 VRAM %', color:'#c9a7ff', get:s=>(s.gpu?.find(g=>g.index===0)?.mem_pct ?? null)},
        {name:'GPU1 VRAM %', color:'#f2d06b', get:s=>(s.gpu?.find(g=>g.index===1)?.mem_pct ?? null)}
      ]
    });

    const tokenSamples = tokens.samples || [];
    const maxTok = Math.max(100, ...tokenSamples.map(s=>Math.max(s.local_in_tokens||0, s.local_out_tokens||0, s.oauth_in_tokens||0, s.oauth_out_tokens||0)));
    drawLineChart({
      canvasId:'tokenChart', legendId:'tokenLegend', samples: tokenSamples, yMax:maxTok, yLabel:' tok',
      series:[
        {name:'Local input tokens', color:'#5ec2ff', get:s=>s.local_in_tokens ?? null},
        {name:'Local output tokens', color:'#4be39f', get:s=>s.local_out_tokens ?? null},
        {name:'OAuth input tokens', color:'#ffae6b', get:s=>s.oauth_in_tokens ?? null},
        {name:'OAuth output tokens', color:'#ff6f91', get:s=>s.oauth_out_tokens ?? null}
      ]
    });

    const benchMeta = document.getElementById('llmBenchMeta');
    if (benchMeta && llmBench?.liveRun) {
      benchMeta.textContent = `Live run: ${llmBench.liveRun.file || 'n/a'} • rows: ${llmBench.liveRun.rows || 0} • window: ${llmBench.liveRun.startedAt || 'n/a'} → ${llmBench.liveRun.endedAt || 'n/a'}`;
    }

    const benchBody = document.querySelector('#llmBenchTable tbody');
    (llmBench?.leaderboard || []).forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.model}</td><td>${r.score ?? ''}</td><td>${r.avg_tok_s ?? ''}</td><td>${r.correctness ?? ''}</td><td>${r.cold_wall_s ?? ''}</td>`;
      benchBody?.appendChild(tr);
    });

    const benchSamples = llmBench?.samples || [];
    const byModel = {};
    benchSamples.forEach(s => {
      byModel[s.model] = byModel[s.model] || [];
      byModel[s.model].push(s);
    });
    const palette = ['#63a7ff','#7be3c4','#ffb86b','#ff7d9b','#c9a7ff','#f2d06b'];
    const benchSeries = Object.keys(byModel).slice(0,6).map((m, i) => ({
      name: `${m} tok/s`,
      color: palette[i % palette.length],
      get: s => (s.model === m ? s.tok_s : null)
    }));
    const maxBenchTok = Math.max(100, ...benchSamples.map(s => s.tok_s || 0));
    drawLineChart({
      canvasId:'llmTokChart', legendId:'llmTokLegend', samples: benchSamples, yMax:maxBenchTok, yLabel:' tok/s',
      series: benchSeries
    });

  } catch(e){
    document.body.innerHTML = `<pre style="padding:20px">Dashboard load error: ${e.message}</pre>`;
  }
})();
