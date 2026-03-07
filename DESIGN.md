# BERKENBOT_DASHBOARD — Comprehensive Design Document

**Author:** IVE (Creative Agent)
**Date:** 2026-03-05
**Status:** Design Spec — Ready for Implementation

---

## 1. Design Philosophy

This dashboard answers one question: **"Is everything okay, and what happened while I was away?"**

Justin checks this at a glance — morning coffee, between tasks, end of day. It should feel like a cockpit, not a spreadsheet. Every pixel earns its place. If something needs attention, it should be impossible to miss. If everything's fine, the dashboard should confirm that in under two seconds.

**Principles:**
- **Glanceable** — Status communicated through color, not paragraphs
- **Zero-config** — Agents write JSON, dashboard reads JSON, no database
- **Offline-first** — Static files, works from `file://` or `python -m http.server`
- **Dark theme** — This runs on a dev machine, not a corporate kiosk
- **Progressive detail** — Summary → click/hover → detail

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Markup** | Single `index.html` | Already exists, proven approach |
| **Style** | Vanilla CSS (custom properties) | No build step, easy to tweak |
| **Logic** | Vanilla JS (ES modules) | No bundler, no framework churn |
| **Data** | JSON files in `data/` | Agents write these via scripts/cron |
| **Charts** | Canvas-based (existing DIY) or [uPlot](https://github.com/leeoniya/uPlot) (~35KB) | Lightweight, no dependencies |
| **Hosting** | Local (`python -m http.server`) + GitHub Pages | Already set up |
| **Refresh** | Auto-reload every 60s via `fetch()` | Live-ish without WebSockets |

**Why not React/Vue/Svelte?** Because the existing vanilla stack works, Justin doesn't want to maintain a build pipeline for a status page, and the data model is flat JSON files. The complexity budget is better spent on good data collection scripts than on frontend framework ceremony.

---

## 3. Data Contract — JSON Files

Each agent writes its own JSON. The dashboard reads them all. No agent needs to know about any other agent's schema.

### 3.1 New/Modified Data Files

```
data/
├── overview.json          # (existing) KPI summary cards
├── projects.json          # (existing) repo list + status
├── bots.json              # (existing) bot health
├── events.json            # (existing) recent activity feed
├── security.json          # (existing) K2's audit results
├── system_metrics.json    # (existing) CPU/RAM/GPU samples
├── agent_stats.json       # (existing) agent invocation counts
├── agent_metrics.json     # (existing) per-agent timing data
├── history.json           # (existing) history log
├── llm_benchmarks.json    # (existing) local LLM scores
├── token_metrics.json     # (existing) API token usage
├── repo_sources.json      # (existing) tracked repos config
│
├── agents_live.json       # ← NEW: real-time agent status
├── voice_reports.json     # ← NEW: TTS report history
├── knowledge_stats.json   # ← NEW: knowledge dump category stats
└── security_detail.json   # ← NEW: expanded K2 audit data
```

### 3.2 New Schema Definitions

#### `agents_live.json` — Agent Status Board
```json
{
  "updated": "2026-03-05T21:30:00-06:00",
  "agents": [
    {
      "id": "BERKEN_BOT",
      "name": "BerkenBot",
      "emoji": "🤖",
      "role": "Orchestrator",
      "status": "active",          // "active" | "idle" | "offline" | "error"
      "currentTask": "Coordinating dashboard design sprint",
      "lastTask": "Daily report generation",
      "lastSeen": "2026-03-05T21:28:00-06:00",
      "sessionsToday": 14,
      "tokensBurned": 128400
    },
    {
      "id": "IVE",
      "name": "Ive",
      "emoji": "🎨",
      "role": "Creative Agent",
      "status": "active",
      "currentTask": "Dashboard DESIGN.md",
      "lastTask": "Figma implementation plan",
      "lastSeen": "2026-03-05T21:44:00-06:00",
      "sessionsToday": 3,
      "tokensBurned": 45200
    },
    {
      "id": "SPOCK",
      "name": "Spock",
      "emoji": "🖖",
      "role": "Systems & Analytics",
      "status": "idle",
      "currentTask": null,
      "lastTask": "System baseline metrics collection",
      "lastSeen": "2026-03-05T20:15:00-06:00",
      "sessionsToday": 8,
      "tokensBurned": 92100
    },
    {
      "id": "K2SO",
      "name": "K-2SO",
      "emoji": "🔒",
      "role": "Security",
      "status": "idle",
      "currentTask": null,
      "lastTask": "OpenClaw security audit",
      "lastSeen": "2026-03-05T18:00:00-06:00",
      "sessionsToday": 2,
      "tokensBurned": 31500
    },
    {
      "id": "R2D2",
      "name": "R2-D2",
      "emoji": "🔧",
      "role": "DevOps",
      "status": "offline",
      "currentTask": null,
      "lastTask": null,
      "lastSeen": null,
      "sessionsToday": 0,
      "tokensBurned": 0
    },
    {
      "id": "R4P17",
      "name": "R4-P17",
      "emoji": "📡",
      "role": "Research",
      "status": "offline",
      "currentTask": null,
      "lastTask": null,
      "lastSeen": null,
      "sessionsToday": 0,
      "tokensBurned": 0
    },
    {
      "id": "ADA",
      "name": "Ada",
      "emoji": "📊",
      "role": "Data Analysis",
      "status": "offline",
      "currentTask": null,
      "lastTask": null,
      "lastSeen": null,
      "sessionsToday": 0,
      "tokensBurned": 0
    },
    {
      "id": "MAVIC",
      "name": "Mavic",
      "emoji": "🚁",
      "role": "Drone/Vision",
      "status": "offline",
      "currentTask": null,
      "lastTask": null,
      "lastSeen": null,
      "sessionsToday": 0,
      "tokensBurned": 0
    }
  ]
}
```

#### `voice_reports.json` — Voice Report History
```json
{
  "updated": "2026-03-05T21:00:00-06:00",
  "reports": [
    {
      "id": "evening-2026-03-05",
      "type": "evening",
      "title": "Evening Report — March 5",
      "generated": "2026-03-05T20:30:00-06:00",
      "voice": "obama",
      "duration_sec": 142,
      "file": "/home/berkenbot/BerkenBot/projects/BERKENBOT_REPORTS/evening/2026-03-05.mp3",
      "summary": "Dashboard sprint, 4 agents active, system healthy"
    }
  ],
  "stats": {
    "totalGenerated": 47,
    "thisWeek": 5,
    "avgDurationSec": 128,
    "voicesUsed": ["obama", "neil_degrasse_tyson", "scarlett_johansson"]
  }
}
```

#### `knowledge_stats.json` — Knowledge Dump Stats
```json
{
  "updated": "2026-03-05T21:00:00-06:00",
  "categories": [
    { "name": "AI", "entries": 12, "lastAdded": "2026-03-04" },
    { "name": "TECH", "entries": 8, "lastAdded": "2026-03-02" },
    { "name": "SCIENCE", "entries": 5, "lastAdded": "2026-02-28" },
    { "name": "ENTREPRENEURIAL", "entries": 3, "lastAdded": "2026-02-20" },
    { "name": "PERSONAL_DEVELOPMENT", "entries": 4, "lastAdded": "2026-02-15" }
  ],
  "total": 32,
  "recentEntries": [
    { "category": "AI", "title": "Local LLM Inference Optimization", "date": "2026-03-04" },
    { "category": "TECH", "title": "RVC Voice Cloning Pipeline", "date": "2026-03-02" }
  ]
}
```

#### `security_detail.json` — Extended Security Audit
```json
{
  "updated": "2026-03-05T18:00:00-06:00",
  "auditedBy": "K-2SO",
  "overallGrade": "B+",
  "summary": "No critical issues. 1 advisory.",
  "categories": [
    {
      "name": "Network Exposure",
      "status": "green",
      "checks": [
        { "check": "No unexpected public listeners", "result": "pass" },
        { "check": "Firewall rules current", "result": "pass" }
      ]
    },
    {
      "name": "OpenClaw Config",
      "status": "yellow",
      "checks": [
        { "check": "Audit clean (0 critical)", "result": "pass" },
        { "check": "trustedProxies loopback-only", "result": "advisory" }
      ]
    },
    {
      "name": "System Updates",
      "status": "green",
      "checks": [
        { "check": "OS packages up to date", "result": "pass" },
        { "check": "npm audit clean", "result": "pass" }
      ]
    }
  ],
  "lastFullAudit": "2026-03-05T18:00:00-06:00",
  "nextScheduled": "2026-03-06T18:00:00-06:00"
}
```

---

## 4. Dashboard Layout

### 4.1 Full Layout Wireframe (Desktop, ~1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🤖 BERKENBOT HQ                                        Last updated: 21:30 │
│  ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  ┌─── COMMAND STRIP (always visible) ──────────────────────────────────────┐ │
│  │ 🟢 4 agents active  │ 🖥️ CPU 2% RAM 4% │ 🔒 B+ │ ⏱️ 47 reports │ 📚 32 │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ╔══════════════════════════════════════════════════════════════════════════╗ │
│  ║  SECTION 1: AGENT STATUS BOARD                                         ║ │
│  ╠══════════════════════════════════════════════════════════════════════════╣ │
│  ║                                                                        ║ │
│  ║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  ║ │
│  ║  │ 🤖       │ │ 🎨       │ │ 🖖       │ │ 🔒       │                  ║ │
│  ║  │ BerkenBot│ │ Ive      │ │ Spock    │ │ K-2SO    │                  ║ │
│  ║  │ ●ACTIVE  │ │ ●ACTIVE  │ │ ○IDLE    │ │ ○IDLE    │                  ║ │
│  ║  │ Coord.   │ │ Design   │ │ 38m ago  │ │ 3h ago   │                  ║ │
│  ║  │ dash...  │ │ DESIGN.. │ │ baseline │ │ audit    │                  ║ │
│  ║  │ 14 sess  │ │ 3 sess   │ │ 8 sess   │ │ 2 sess   │                  ║ │
│  ║  │ 128K tok │ │ 45K tok  │ │ 92K tok  │ │ 31K tok  │                  ║ │
│  ║  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  ║ │
│  ║                                                                        ║ │
│  ║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  ║ │
│  ║  │ 🔧       │ │ 📡       │ │ 📊       │ │ 🚁       │                  ║ │
│  ║  │ R2-D2    │ │ R4-P17   │ │ Ada      │ │ Mavic    │                  ║ │
│  ║  │ ◌OFFLINE │ │ ◌OFFLINE │ │ ◌OFFLINE │ │ ◌OFFLINE │                  ║ │
│  ║  │ never    │ │ never    │ │ never    │ │ never    │                  ║ │
│  ║  │ —        │ │ —        │ │ —        │ │ —        │                  ║ │
│  ║  │ 0 sess   │ │ 0 sess   │ │ 0 sess   │ │ 0 sess   │                  ║ │
│  ║  │ 0 tok    │ │ 0 tok    │ │ 0 tok    │ │ 0 tok    │                  ║ │
│  ║  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  ║ │
│  ╚══════════════════════════════════════════════════════════════════════════╝ │
│                                                                              │
│  ┌────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │ SECTION 2: SYSTEM HEALTH          │ │ SECTION 3: SECURITY STATUS       │ │
│  │                                    │ │                                  │ │
│  │  CPU  [██░░░░░░░░░░░░░░░░░░]  2%  │ │  Overall Grade: B+               │ │
│  │  RAM  [████░░░░░░░░░░░░░░░░]  4%  │ │  ┌────────────────┬──────────┐  │ │
│  │  DISK [████████████░░░░░░░░] 58%  │ │  │ Network        │ 🟢 PASS  │  │ │
│  │                                    │ │  │ OpenClaw       │ 🟡 ADVSR │  │ │
│  │  GPU 0: RTX 5090                   │ │  │ System Updates │ 🟢 PASS  │  │ │
│  │  [█░░░░░░░░░░░░░░░░░░░░]  7%     │ │  └────────────────┴──────────┘  │ │
│  │  VRAM: 2.3/32.6 GB  38W           │ │                                  │ │
│  │                                    │ │  Last audit: 3h ago              │ │
│  │  GPU 1: RTX 3090                   │ │  Next: tomorrow 18:00            │ │
│  │  [░░░░░░░░░░░░░░░░░░░░░]  0%     │ │  Auditor: K-2SO                  │ │
│  │  VRAM: 0/24.6 GB     6W           │ │                                  │ │
│  │                                    │ │  ▸ 3 checks passed               │ │
│  │  ▾ 24h history ▾                  │ │  ▸ 1 advisory (non-critical)     │ │
│  │  [sparkline chart area]            │ │                                  │ │
│  └────────────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │ SECTION 4: REPO HEALTH            │ │ SECTION 5: KNOWLEDGE DUMP        │ │
│  │                                    │ │                                  │ │
│  │  7 tracked repos                   │ │  📚 32 entries across 5 cats     │ │
│  │  🟢 2  🟡 4  🔴 1                 │ │                                  │ │
│  │                                    │ │  AI              ████████░░ 12   │ │
│  │  ┌─────────────┬───────┬───────┐  │ │  TECH            █████░░░░░  8   │ │
│  │  │ Repo        │Commit │Issues │  │ │  SCIENCE         ███░░░░░░░  5   │ │
│  │  ├─────────────┼───────┼───────┤  │ │  PERSONAL_DEV    ██░░░░░░░░  4   │ │
│  │  │ WIRE_FORGE  │ 2h    │  3    │  │ │  ENTREPRENEURIAL █░░░░░░░░░  3   │ │
│  │  │ DASHBOARD   │ 14m   │  0    │  │ │                                  │ │
│  │  │ KNOWLEDGE.. │ 1d    │  1    │  │ │  Recent:                         │ │
│  │  │ LOCAL_TTS   │ 3d    │  0    │  │ │  • Local LLM Inference (AI)      │ │
│  │  │ BERKEN_BOT  │ 5d    │  2    │  │ │  • RVC Voice Cloning (TECH)      │ │
│  │  │ BIM         │ 1w    │  0    │  │ │                                  │ │
│  │  │ C64         │ 2w    │  4    │  │ │  Last added: Mar 4               │ │
│  │  └─────────────┴───────┴───────┘  │ │                                  │ │
│  └────────────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                              │
│  ╔══════════════════════════════════════════════════════════════════════════╗ │
│  ║  SECTION 6: VOICE REPORTS                                              ║ │
│  ╠══════════════════════════════════════════════════════════════════════════╣ │
│  ║                                                                        ║ │
│  ║  🎙️ 47 total reports  │  5 this week  │  avg 2:08                      ║ │
│  ║  Voices: obama, neil_degrasse_tyson, scarlett_johansson                ║ │
│  ║                                                                        ║ │
│  ║  ┌────────┬─────────────────────────────┬────────┬───────┬──────────┐  ║ │
│  ║  │ Type   │ Title                       │ Voice  │ Len   │ When     │  ║ │
│  ║  ├────────┼─────────────────────────────┼────────┼───────┼──────────┤  ║ │
│  ║  │ 🌅 Eve │ Evening Report — Mar 5      │ obama  │ 2:22  │ 38m ago  │  ║ │
│  ║  │ ☀️ Morn│ Morning Report — Mar 5      │ obama  │ 1:54  │ 13h ago  │  ║ │
│  ║  │ 🌅 Eve │ Evening Report — Mar 4      │ NDT    │ 2:31  │ 1d ago   │  ║ │
│  ║  │ 📋 Upd │ WireForge Status Update     │ ScarJo │ 1:42  │ 2d ago   │  ║ │
│  ║  │ ☀️ Morn│ Morning Report — Mar 4      │ obama  │ 1:48  │ 2d ago   │  ║ │
│  ║  └────────┴─────────────────────────────┴────────┴───────┴──────────┘  ║ │
│  ╚══════════════════════════════════════════════════════════════════════════╝ │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ SECTION 7: ACTIVITY FEED (existing, enhanced)                          │ │
│  │ • 21:28 — IVE spawned for dashboard design (BerkenBot)                 │ │
│  │ • 20:30 — Evening report generated (obama, 2:22)                       │ │
│  │ • 20:15 — System baseline collected (Spock)                            │ │
│  │ • 18:00 — Security audit complete: B+ (K-2SO)                         │ │
│  │ • 17:24 — Dashboard data refresh (GitHub Actions)                      │ │
│  │ •  ...show more...                                                     │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ SECTION 8: TOKEN / LLM METRICS (existing charts, kept)                 │ │
│  │ [Token usage chart]  [LLM benchmark chart]                             │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Mobile Layout (~375px)

Everything stacks single-column. The Command Strip becomes a sticky top bar with just the status dots and numbers — tap to expand.

```
┌──────────────────────┐
│ 🤖 BERKENBOT HQ      │
│ 🟢4  🖥️2%  🔒B+  📚32│  ← sticky command strip
├──────────────────────┤
│ AGENT STATUS         │
│ ┌──────┐ ┌──────┐   │  ← 2-column grid
│ │🤖 BB │ │🎨 Ive│   │
│ │●ACT  │ │●ACT  │   │
│ └──────┘ └──────┘   │
│ ┌──────┐ ┌──────┐   │
│ │🖖Spk │ │🔒K2  │   │
│ │○IDLE │ │○IDLE │   │
│ └──────┘ └──────┘   │
│  ...                 │
├──────────────────────┤
│ SYSTEM HEALTH        │
│ CPU [██░░░░░░] 2%    │
│ RAM [████░░░░] 4%    │
│ GPU0 RTX5090 7%      │
│ GPU1 RTX3090 0%      │
├──────────────────────┤
│ SECURITY  B+         │
│ 🟢 Network           │
│ 🟡 OpenClaw          │
│ 🟢 Updates           │
├──────────────────────┤
│ ...remaining panels  │
└──────────────────────┘
```

---

## 5. Component Specifications

### 5.1 Command Strip

The always-visible summary bar at the top. One line. Everything critical at a glance.

```
Format: [agents_active] agents active │ CPU [x]% RAM [x]% │ Security [grade] │ [n] reports │ [n] knowledge entries
```

- **Background:** `#161B22` with subtle bottom border
- **Position:** sticky top (under header)
- **Height:** 36px
- **Each segment is clickable** → scrolls to the relevant section

### 5.2 Agent Card

```css
.agent-card {
  width: 160px;
  min-height: 180px;
  padding: 16px;
  border-radius: 8px;
  background: #161B22;
  border-left: 3px solid var(--status-color);
  /* --status-color: #3FB950 active, #8B949E idle, #484F58 offline, #F85149 error */
}
```

**Card contents (top to bottom):**
1. Emoji + Name (bold)
2. Role (muted, small)
3. Status indicator (colored dot + label)
4. Current/last task (truncated, 2 lines max)
5. Time since last seen (relative: "38m ago", "never")
6. Sessions today + tokens burned (small, bottom)

**Status colors:**
- `active` → green pulse animation (subtle)
- `idle` → gray, static
- `offline` → dim, slightly transparent (opacity: 0.6)
- `error` → red pulse

### 5.3 System Health Panel

**Gauge bars** — not circular gauges, not pie charts. Horizontal bars are the fastest to read.

```
CPU  [██░░░░░░░░░░░░░░░░░░]  2%    ← green
RAM  [████░░░░░░░░░░░░░░░░]  4%    ← green
DISK [████████████░░░░░░░░] 58%    ← yellow (>50%)
```

**Color thresholds:**
- 0–50%: green (`#3FB950`)
- 50–80%: yellow (`#D29922`)
- 80–100%: red (`#F85149`)

**GPU sub-cards:**
```
┌─ RTX 5090 ──────────────────────┐
│ Util: [█░░░░░░░] 7%   38W      │
│ VRAM: 2.3 / 32.6 GB            │
└─────────────────────────────────┘
```

**Collapsible 24h sparkline** — small inline chart showing CPU/RAM/GPU over time from `system_metrics.json` samples.

### 5.4 Security Panel

The grade dominates. Big letter, colored background.

```
┌─────────────────────────────┐
│       ┌─────┐               │
│       │ B+  │  ← 32px bold  │
│       └─────┘               │
│  🟢 Network Exposure  PASS  │
│  🟡 OpenClaw Config   ADVSR │
│  🟢 System Updates    PASS  │
│                             │
│  Last: 3h ago by K-2SO     │
│  Next: tomorrow 18:00      │
└─────────────────────────────┘
```

**Grade colors:**
- A/A+: green
- B/B+: blue
- C/C+: yellow
- D or below: red

### 5.5 Repo Health Table

Compact table. Rows sorted by last commit (most recent first). Color-code the "last commit" column:

- < 24h: green
- 1–7d: yellow
- \> 7d: red (stale)

Issues column shows count with red badge if > 0.

### 5.6 Knowledge Dump Panel

Horizontal bar chart showing entries per category. Each bar is proportional to count. Category name on the left, count on the right.

Below the chart: 2–3 most recent entries as a simple list.

### 5.7 Voice Reports Panel

Summary stats on top (total, this week, avg duration, voices used).

Below: table of last 5 reports. Each row has a type icon (🌅 evening, ☀️ morning, 📋 update, 🔬 research), title, voice name, duration, and relative time.

**Future enhancement:** If served locally, add a play button that loads the audio file.

---

## 6. Data Collection Scripts

### 6.1 New Scripts Needed

| Script | Runs | Writes | Source |
|--------|------|--------|--------|
| `scripts/collect_agent_status.py` | Every 5 min (cron) | `data/agents_live.json` | OpenClaw session API or log parsing |
| `scripts/collect_voice_reports.py` | Every 15 min | `data/voice_reports.json` | Scan `BERKENBOT_REPORTS/` directory tree |
| `scripts/collect_knowledge_stats.py` | Every hour | `data/knowledge_stats.json` | Count files in `KNOWLEDGE_DUMP/` categories |
| `scripts/collect_security_detail.py` | After K2 audit | `data/security_detail.json` | Parse K2's audit output |

### 6.2 `collect_voice_reports.py` — Example Logic

```python
#!/usr/bin/env python3
"""Scan BERKENBOT_REPORTS/ and generate voice_reports.json"""

import json, os, datetime
from pathlib import Path

REPORTS_DIR = Path.home() / "BerkenBot/projects/BERKENBOT_REPORTS"
OUTPUT = Path.home() / "BerkenBot/projects/BERKENBOT_DASHBOARD/data/voice_reports.json"

REPORT_TYPES = ["morning", "evening", "updates", "research"]

def scan_reports():
    reports = []
    for rtype in REPORT_TYPES:
        rdir = REPORTS_DIR / rtype
        if not rdir.exists():
            continue
        for f in rdir.glob("*.mp3"):
            stat = f.stat()
            reports.append({
                "id": f"{rtype}-{f.stem}",
                "type": rtype,
                "title": f"{rtype.capitalize()} Report — {f.stem}",
                "generated": datetime.datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "voice": "unknown",  # Could parse from metadata/log
                "duration_sec": 0,   # Could get via ffprobe
                "file": str(f),
                "summary": ""
            })
    reports.sort(key=lambda r: r["generated"], reverse=True)
    return reports

def main():
    reports = scan_reports()
    data = {
        "updated": datetime.datetime.now().isoformat(),
        "reports": reports[:20],  # Last 20
        "stats": {
            "totalGenerated": len(reports),
            "thisWeek": sum(1 for r in reports
                if datetime.datetime.fromisoformat(r["generated"])
                > datetime.datetime.now() - datetime.timedelta(days=7)),
            "avgDurationSec": 0,
            "voicesUsed": list(set(r["voice"] for r in reports))
        }
    }
    OUTPUT.write_text(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()
```

### 6.3 `collect_knowledge_stats.py` — Example Logic

```python
#!/usr/bin/env python3
"""Count entries per category in KNOWLEDGE_DUMP/"""

import json, datetime
from pathlib import Path

KNOWLEDGE_DIR = Path.home() / "BerkenBot/projects/KNOWLEDGE_DUMP"
OUTPUT = Path.home() / "BerkenBot/projects/BERKENBOT_DASHBOARD/data/knowledge_stats.json"

SKIP = {"README.md", "index.md", ".git"}

def main():
    categories = []
    total = 0
    recent = []

    for d in sorted(KNOWLEDGE_DIR.iterdir()):
        if d.name in SKIP or not d.is_dir():
            continue
        files = list(d.glob("*.md"))
        count = len(files)
        total += count
        last = max((f.stat().st_mtime for f in files), default=0)
        categories.append({
            "name": d.name,
            "entries": count,
            "lastAdded": datetime.datetime.fromtimestamp(last).strftime("%Y-%m-%d") if last else None
        })
        for f in files:
            recent.append({
                "category": d.name,
                "title": f.stem.replace("_", " ").replace("-", " ").title(),
                "date": datetime.datetime.fromtimestamp(f.stat().st_mtime).strftime("%Y-%m-%d")
            })

    categories.sort(key=lambda c: c["entries"], reverse=True)
    recent.sort(key=lambda r: r["date"], reverse=True)

    data = {
        "updated": datetime.datetime.now().isoformat(),
        "categories": categories,
        "total": total,
        "recentEntries": recent[:5]
    }
    OUTPUT.write_text(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()
```

---

## 7. Color System

Built on the existing Figma plan's design tokens, refined for the new sections:

```css
:root {
  /* Backgrounds */
  --bg-page:      #0D1117;
  --bg-card:      #161B22;
  --bg-elevated:  #21262D;
  --bg-strip:     #161B22;

  /* Text */
  --text-primary:   #E6EDF3;
  --text-secondary: #8B949E;
  --text-muted:     #484F58;

  /* Status */
  --status-green:   #3FB950;
  --status-yellow:  #D29922;
  --status-red:     #F85149;
  --status-blue:    #58A6FF;
  --status-purple:  #BC8CFF;

  /* Gauge fills */
  --gauge-bg:       #21262D;
  --gauge-fill-ok:  #3FB950;
  --gauge-fill-warn:#D29922;
  --gauge-fill-crit:#F85149;

  /* Agent status specific */
  --agent-active:   #3FB950;
  --agent-idle:     #8B949E;
  --agent-offline:  #484F58;
  --agent-error:    #F85149;
}
```

---

## 8. Interaction Design

### 8.1 Auto-Refresh
```javascript
// Fetch all JSON every 60 seconds, diff and update DOM
setInterval(async () => {
  const files = [
    'agents_live', 'overview', 'system_metrics',
    'security_detail', 'voice_reports', 'knowledge_stats',
    'projects', 'events'
  ];
  for (const f of files) {
    const res = await fetch(`data/${f}.json?t=${Date.now()}`);
    if (res.ok) window.dashData[f] = await res.json();
  }
  renderAll();
}, 60000);
```

### 8.2 Click-to-Scroll
Each command strip segment links to its section via smooth scroll:
```javascript
document.querySelectorAll('.strip-segment').forEach(el => {
  el.addEventListener('click', () => {
    document.getElementById(el.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });
});
```

### 8.3 Keyboard Shortcuts (power user)
- `1`–`8`: Jump to section
- `r`: Force refresh
- `?`: Show shortcut help

---

## 9. Implementation Priority

| Phase | What | Effort | Impact |
|-------|------|--------|--------|
| **P0** | Agent Status Board (new section + JSON) | 1 day | 🔥🔥🔥 — This is the killer feature |
| **P0** | System Health panel (already have data) | 0.5 day | 🔥🔥🔥 — Answers "is the box okay?" |
| **P1** | Command Strip | 0.5 day | 🔥🔥 — Instant glance value |
| **P1** | Security panel upgrade | 0.5 day | 🔥🔥 — K2 data already exists |
| **P2** | Voice Reports panel + collector | 1 day | 🔥 — Nice to have, fun |
| **P2** | Knowledge Dump stats + collector | 0.5 day | 🔥 — Satisfying to see grow |
| **P3** | Mobile responsive | 0.5 day | Low priority, Justin's on desktop |
| **P3** | Keyboard shortcuts | 0.5 day | Power user cherry on top |

**Total estimated effort: ~5 days of focused work**

---

## 10. What Makes This Dashboard Actually Useful

1. **The Command Strip** — Justin opens the page and in 0.5 seconds knows: agents running, system healthy, security clean, reports generated. Done.

2. **Agent Cards with Current Task** — "What are my agents doing right now?" is the #1 question. Each card answers it with status, current task, and how busy they've been today.

3. **System Health Bars, Not Numbers** — A bar at 7% is green and small. A bar at 92% is red and screaming. The eye processes this faster than reading "CPU: 91.7%".

4. **Security Grade** — One letter. B+. Not a wall of audit text. The details are there if you click, but the grade tells you whether to worry.

5. **Voice Reports in a Table** — Justin's TTS pipeline is unique to this setup. Seeing "5 reports this week, avg 2:08, last one 38 minutes ago" validates the pipeline is working without checking directories.

6. **Knowledge Dump Growth** — Watching the bars grow over time is genuinely motivating. "Oh, I have 12 AI entries now." It turns a directory into a progress metric.

---

## 11. Files to Create/Modify

### New Files
- `data/agents_live.json` — Agent status data
- `data/voice_reports.json` — Voice report index
- `data/knowledge_stats.json` — Knowledge dump stats
- `data/security_detail.json` — Expanded security audit
- `scripts/collect_agent_status.py` — Agent status collector
- `scripts/collect_voice_reports.py` — Voice report scanner
- `scripts/collect_knowledge_stats.py` — Knowledge stats counter
- `scripts/collect_security_detail.py` — Security audit parser

### Modified Files
- `index.html` — Add new sections (Agent Board, Command Strip, Voice Reports, Knowledge)
- `assets/app.js` — Add render functions for new sections
- `assets/styles.css` — Add styles for new components
- `assets/office.js` — May merge with agent board or keep as the fun pixel-art overlay

---

*Designed by IVE. Built for Justin. Meant to be glanced at, not stared at.*
