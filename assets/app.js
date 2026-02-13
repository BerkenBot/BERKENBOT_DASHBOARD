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

function drawSVGLineChart({containerId, legendId, samples, series, yMax=100, yLabel='%'}){
  const container = document.getElementById(containerId);
  if(!container || !samples?.length) return;

  // Clear existing content
  container.innerHTML = '';

  const svgNS = 'http://www.w3.org/2000/svg';
  const w = 1200, h = 320;
  const pad = {l:56, r:12, t:18, b:28};
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;

  // Create SVG element
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '320');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.style.display = 'block';
  svg.style.background = '#0f1834';

  // Zoom/pan state
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastTouchDistance = 0;

  // Create main group for zoom/pan transforms
  const chartGroup = document.createElementNS(svgNS, 'g');
  svg.appendChild(chartGroup);

  function updateTransform() {
    chartGroup.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
  }

  // Draw grid lines and Y-axis labels
  for(let i = 0; i <= 5; i++) {
    const y = pad.t + (ch * i / 5);
    const gridLine = document.createElementNS(svgNS, 'line');
    gridLine.setAttribute('x1', pad.l);
    gridLine.setAttribute('y1', y);
    gridLine.setAttribute('x2', w - pad.r);
    gridLine.setAttribute('y2', y);
    gridLine.setAttribute('stroke', '#2b3f74');
    gridLine.setAttribute('stroke-width', '1');
    chartGroup.appendChild(gridLine);

    const v = Math.round(yMax - i * (yMax / 5));
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', '8');
    label.setAttribute('y', y + 4);
    label.setAttribute('fill', '#94a7de');
    label.setAttribute('font-size', '11px');
    label.setAttribute('font-family', 'sans-serif');
    label.textContent = v + yLabel;
    chartGroup.appendChild(label);
  }

  // Helper functions for positioning
  function xPos(i, n) {
    return pad.l + (n <= 1 ? 0 : (i * (cw / (n - 1))));
  }

  function yPos(v) {
    return pad.t + ((yMax - v) * (ch / yMax));
  }

  // Draw data series
  series.forEach(sr => {
    const path = document.createElementNS(svgNS, 'path');
    let pathData = '';
    let started = false;

    samples.forEach((s, i) => {
      const raw = sr.get(s);
      if(raw === null || raw === undefined || Number.isNaN(raw)) return;
      const v = Math.max(0, Math.min(yMax, raw));
      const px = xPos(i, samples.length);
      const py = yPos(v);

      if(!started) {
        pathData += `M ${px} ${py}`;
        started = true;
      } else {
        pathData += ` L ${px} ${py}`;
      }
    });

    if(pathData) {
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', sr.color);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      chartGroup.appendChild(path);
    }
  });

  // Draw X-axis labels
  const start = samples[0]?.ts || '';
  const end = samples[samples.length - 1]?.ts || '';

  const startLabel = document.createElementNS(svgNS, 'text');
  startLabel.setAttribute('x', pad.l);
  startLabel.setAttribute('y', h - 8);
  startLabel.setAttribute('fill', '#94a7de');
  startLabel.setAttribute('font-size', '11px');
  startLabel.setAttribute('font-family', 'sans-serif');
  startLabel.textContent = start.replace('T', ' ').slice(5, 16);
  chartGroup.appendChild(startLabel);

  const endText = end.replace('T', ' ').slice(5, 16);
  const endLabel = document.createElementNS(svgNS, 'text');
  endLabel.setAttribute('x', w - pad.r);
  endLabel.setAttribute('y', h - 8);
  endLabel.setAttribute('fill', '#94a7de');
  endLabel.setAttribute('font-size', '11px');
  endLabel.setAttribute('font-family', 'sans-serif');
  endLabel.setAttribute('text-anchor', 'end');
  endLabel.textContent = endText;
  chartGroup.appendChild(endLabel);

  // Crosshair and tooltip elements (outside chartGroup so they don't scale)
  const crosshairGroup = document.createElementNS(svgNS, 'g');
  crosshairGroup.style.display = 'none';
  crosshairGroup.style.pointerEvents = 'none';
  svg.appendChild(crosshairGroup);

  const crosshairLine = document.createElementNS(svgNS, 'line');
  crosshairLine.setAttribute('stroke', '#94a7de');
  crosshairLine.setAttribute('stroke-width', '1');
  crosshairLine.setAttribute('stroke-dasharray', '4,4');
  crosshairLine.setAttribute('opacity', '0.6');
  crosshairGroup.appendChild(crosshairLine);

  const tooltipRect = document.createElementNS(svgNS, 'rect');
  tooltipRect.setAttribute('fill', '#1a2545');
  tooltipRect.setAttribute('stroke', '#3a5080');
  tooltipRect.setAttribute('stroke-width', '1');
  tooltipRect.setAttribute('rx', '4');
  tooltipRect.setAttribute('opacity', '0.95');
  crosshairGroup.appendChild(tooltipRect);

  const tooltipTextGroup = document.createElementNS(svgNS, 'g');
  crosshairGroup.appendChild(tooltipTextGroup);

  // Mouse move handler for crosshair and tooltip
  function handleMouseMove(e) {
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse position to chart coordinates (accounting for scale/translate)
    const scaledMouseX = (mouseX - translateX) / scale;

    if(scaledMouseX < pad.l || scaledMouseX > w - pad.r || mouseY < pad.t || mouseY > h - pad.b) {
      crosshairGroup.style.display = 'none';
      return;
    }

    crosshairGroup.style.display = 'block';
    crosshairLine.setAttribute('x1', mouseX);
    crosshairLine.setAttribute('y1', pad.t);
    crosshairLine.setAttribute('x2', mouseX);
    crosshairLine.setAttribute('y2', h - pad.b);

    // Find closest sample index
    const sampleIndex = Math.round(((scaledMouseX - pad.l) / cw) * (samples.length - 1));
    if(sampleIndex < 0 || sampleIndex >= samples.length) {
      crosshairGroup.style.display = 'none';
      return;
    }

    const sample = samples[sampleIndex];
    const tooltipLines = [];
    tooltipLines.push(sample.ts?.replace('T', ' ').slice(5, 16) || '');

    series.forEach(sr => {
      const raw = sr.get(sample);
      if(raw !== null && raw !== undefined && !Number.isNaN(raw)) {
        tooltipLines.push(`${sr.name}: ${raw.toFixed(1)}${yLabel}`);
      }
    });

    // Clear previous tooltip text
    tooltipTextGroup.innerHTML = '';

    const lineHeight = 14;
    const padding = 6;
    let maxWidth = 0;

    tooltipLines.forEach((line, i) => {
      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', 0);
      text.setAttribute('y', i * lineHeight);
      text.setAttribute('fill', '#eaf0ff');
      text.setAttribute('font-size', i === 0 ? '10px' : '11px');
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-weight', i === 0 ? 'bold' : 'normal');
      text.textContent = line;
      tooltipTextGroup.appendChild(text);

      // Estimate text width (rough approximation)
      const estimatedWidth = line.length * (i === 0 ? 5 : 6);
      if(estimatedWidth > maxWidth) maxWidth = estimatedWidth;
    });

    const tooltipWidth = maxWidth + padding * 2;
    const tooltipHeight = tooltipLines.length * lineHeight + padding * 2;

    let tooltipX = mouseX + 10;
    let tooltipY = mouseY - tooltipHeight - 10;

    // Keep tooltip within bounds
    if(tooltipX + tooltipWidth > w) tooltipX = mouseX - tooltipWidth - 10;
    if(tooltipY < 0) tooltipY = mouseY + 10;

    tooltipRect.setAttribute('x', tooltipX);
    tooltipRect.setAttribute('y', tooltipY);
    tooltipRect.setAttribute('width', tooltipWidth);
    tooltipRect.setAttribute('height', tooltipHeight);

    tooltipTextGroup.setAttribute('transform', `translate(${tooltipX + padding}, ${tooltipY + padding + 10})`);
  }

  svg.addEventListener('mousemove', handleMouseMove);
  svg.addEventListener('mouseleave', () => {
    crosshairGroup.style.display = 'none';
  });

  // Zoom with mouse wheel — smooth steps, anchored to pointer
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    // Smaller multiplier = smoother steps (was 0.9/1.1)
    const factor = 1 + Math.min(Math.abs(e.deltaY), 100) * 0.001;
    const delta = e.deltaY > 0 ? 1 / factor : factor;
    const newScale = Math.max(1, Math.min(20, scale * delta));

    if(newScale !== scale) {
      const rect = svg.getBoundingClientRect();
      const svgW = rect.width;
      const svgH = rect.height;
      // Mouse position in SVG viewport units
      const mouseX = (e.clientX - rect.left) / svgW * w;
      const mouseY = (e.clientY - rect.top) / svgH * h;

      // Keep the point under the cursor fixed
      const scaleRatio = newScale / scale;
      translateX = mouseX - (mouseX - translateX) * scaleRatio;
      translateY = mouseY - (mouseY - translateY) * scaleRatio;
      scale = newScale;

      updateTransform();
    }
  }, { passive: false });

  // Pan with drag
  svg.addEventListener('mousedown', (e) => {
    if(scale > 1) {
      isDragging = true;
      dragStartX = e.clientX - translateX;
      dragStartY = e.clientY - translateY;
      svg.style.cursor = 'grabbing';
    }
  });

  svg.addEventListener('mousemove', (e) => {
    if(isDragging) {
      translateX = e.clientX - dragStartX;
      translateY = e.clientY - dragStartY;
      updateTransform();
    }
  });

  svg.addEventListener('mouseup', () => {
    isDragging = false;
    svg.style.cursor = scale > 1 ? 'grab' : 'default';
  });

  svg.addEventListener('mouseleave', () => {
    isDragging = false;
    svg.style.cursor = 'default';
  });

  // Double-click to reset zoom
  svg.addEventListener('dblclick', () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
    svg.style.cursor = 'default';
  });

  // Touch support for pinch-to-zoom
  svg.addEventListener('touchstart', (e) => {
    if(e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
    } else if(e.touches.length === 1 && scale > 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - translateX;
      dragStartY = e.touches[0].clientY - translateY;
    }
  }, { passive: true });

  svg.addEventListener('touchmove', (e) => {
    if(e.touches.length === 2 && lastTouchDistance > 0) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const delta = distance / lastTouchDistance;
      const newScale = Math.max(1, Math.min(10, scale * delta));

      if(newScale !== scale) {
        const rect = svg.getBoundingClientRect();
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

        const scaleRatio = newScale / scale;
        translateX = centerX - (centerX - translateX) * scaleRatio;
        translateY = centerY - (centerY - translateY) * scaleRatio;
        scale = newScale;

        updateTransform();
      }
      lastTouchDistance = distance;
    } else if(e.touches.length === 1 && isDragging) {
      translateX = e.touches[0].clientX - dragStartX;
      translateY = e.touches[0].clientY - dragStartY;
      updateTransform();
    }
  }, { passive: false });

  svg.addEventListener('touchend', () => {
    isDragging = false;
    lastTouchDistance = 0;
  });

  container.appendChild(svg);

  // Update legend
  const lg = document.getElementById(legendId);
  if(lg) {
    lg.innerHTML = series.map(s => 
      `<span class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${s.name}</span>`
    ).join('');
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

    drawSVGLineChart({
      containerId:'usageChart', legendId:'usageLegend', samples: sysm.samples || [], yMax:100, yLabel:'%',
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
    drawSVGLineChart({
      containerId:'tokenChart', legendId:'tokenLegend', samples: tokenSamples, yMax:maxTok, yLabel:' tok',
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
    drawSVGLineChart({
      containerId:'llmTokChart', legendId:'llmTokLegend', samples: benchSamples, yMax:maxBenchTok, yLabel:' tok/s',
      series: benchSeries
    });

  } catch(e){
    document.body.innerHTML = `<pre style="padding:20px">Dashboard load error: ${e.message}</pre>`;
  }
})();
