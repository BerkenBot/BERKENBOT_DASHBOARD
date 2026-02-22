# Figma + Pencil.dev Implementation Plan for BerkenBot Dashboard

**Date:** 2026-02-19
**Project:** BERKENBOT_DASHBOARD — Project + Bot + Pipeline Status Dashboard
**Stack:** Static HTML/CSS/JS, JSON data files, GitHub Pages hosted
**Current State:** Functional but minimal — vanilla JS, basic CSS, ~1100 lines of JS, 48 lines of CSS

---

## Current Dashboard Sections

| Section | Current State | Design Opportunity |
|---------|--------------|-------------------|
| Overview Cards | Basic stat cards | Rich KPI widgets with sparklines |
| Project Cards | Grid with progress bars | Visual project health cards with subprocess drilling |
| Bot Status | Simple grid | Live-feel status panels with uptime indicators |
| Recent Activity | Plain `<ul>` list | Timeline feed with icons, filtering, search |
| System Usage Chart | DIY canvas chart | Proper data viz with hover tooltips |
| Token Usage Chart | DIY canvas chart | Stacked area chart with cost annotations |
| History Log | Plain HTML table | Sortable, filterable table with status badges |
| LLM Benchmarks | Basic table + chart | Comparison cards with bar charts and model tags |
| Security | Plain list | Status cards with severity badges |
| Agent Office | Animated pixel art agents | Keep as-is (unique charm), polish surrounding chrome |

---

## Tool Roles

| Tool | Role |
|------|------|
| **Figma** | Design all dashboard sections, component library, responsive layouts |
| **Figma MCP** | Claude Code reads Figma → generates HTML/CSS/JS (or migrates to React if desired) |
| **Pencil.dev** | Rapidly test layout variations — dark vs. darker themes, card layouts, chart placements |
| **Claude Code** | Generates production code from Figma designs, refactors existing app.js |

---

## Phase 1: Design System & Layout Foundation (Days 1–2)

### 1.1 Design Tokens

```
Colors:
├── Background: #0D1117 (GitHub dark), #161B22 (cards), #21262D (elevated)
├── Text: #E6EDF3 (primary), #8B949E (secondary), #484F58 (muted)
├── Status: #3FB950 (green/healthy), #D29922 (yellow/warning), #F85149 (red/error), #58A6FF (info/blue)
├── Progress: gradient from status color to darker variant
├── Accent: #58A6FF (links, interactive), #BC8CFF (agent/AI accent)
└── Charts: palette of 6-8 distinguishable colors for data series

Typography:
├── Dashboard title: 24px, semibold
├── Section headers: 18px, semibold
├── Card titles: 14px, semibold
├── Body/values: 13px, regular
├── KPI numbers: 28px, bold, monospace
└── Timestamps: 11px, muted
└── Font: Inter or system-ui stack

Spacing:
├── Page padding: 24px
├── Section gap: 24px
├── Card padding: 16px
├── Card gap: 16px
└── Base unit: 4px grid
```

### 1.2 Figma Project Structure

```
BerkenBot Dashboard/
├── 🎨 Design System
│   ├── Colors & Tokens
│   ├── Typography Scale
│   ├── Status Badge Component (green/yellow/red/blue)
│   ├── Progress Bar Component (with percentage)
│   ├── Card Component (base, with variants)
│   └── Chart Placeholder Component
├── 📊 Dashboard Sections
│   ├── Header & Navigation
│   ├── KPI Overview Row
│   ├── Project Cards Grid
│   ├── Bot Status Panels
│   ├── Activity Timeline
│   ├── System Metrics Charts
│   ├── Token Usage Charts
│   ├── History Table
│   ├── LLM Benchmark Cards
│   ├── Security Status
│   └── Agent Office
├── 📱 Responsive Variants
│   ├── Desktop (1440px)
│   ├── Tablet (768px)
│   └── Mobile (375px)
└── 🔄 Interaction States
    ├── Card hover/expand
    ├── Chart tooltip
    ├── Filter active/inactive
    └── Loading skeleton
```

### Deliverable
→ Figma file with complete token system and base components

---

## Phase 2: Section-by-Section Redesign (Days 3–6)

### 2.1 KPI Overview Row (HIGH IMPACT)

**Current:** Basic stat cards
**Redesign:**
- 4-5 large KPI cards across the top
- Each card: big number, label, sparkline trend, delta indicator (↑↓)
- KPIs: Total Projects, Active Bots, Uptime %, Today's Events, Token Spend

**Pencil variations:**
1. Horizontal card row (equal width)
2. Hero card (main KPI large) + smaller supporting cards
3. Compact single-row with inline sparklines

### 2.2 Project Cards (HIGH IMPACT)

**Current:** Grid of cards with progress bars and subprocess lists
**Redesign:**
- Card header: project name + status dot + owner badge
- Circular or arc progress indicator (overall %)
- Subprocess list with mini progress bars
- Last update timestamp + next action preview
- Expandable detail view on click
- Color-coded left border by status

**Pencil variations:**
1. Grid layout (3 columns desktop)
2. List layout (full-width rows with inline subprocesses)
3. Kanban-style columns by status (green/yellow/red)

### 2.3 Bot Status Panels

**Current:** Simple grid
**Redesign:**
- Bot avatar/icon + name + status indicator (pulsing dot)
- Uptime bar (last 24h, like GitHub status)
- Last heartbeat timestamp
- Quick stats: messages today, errors, model in use

### 2.4 Activity Timeline

**Current:** Plain `<ul>` list
**Redesign:**
- Vertical timeline with icons per event type (commit, deploy, alert, cron)
- Relative timestamps ("2h ago")
- Project tags as colored pills
- Filter bar: by project, event type, severity
- Infinite scroll or "Load more"

### 2.5 Charts (System + Token Usage)

**Current:** Custom canvas-drawn charts
**Redesign in Figma, implement with Chart.js or Recharts:**
- System metrics: CPU, RAM, disk as stacked area chart
- Token usage: stacked bar by model/session with cost overlay
- Hover tooltips with exact values
- Time range selector (24h, 7d, 30d)
- Responsive sizing

### 2.6 History Table

**Current:** Plain HTML table
**Redesign:**
- Zebra-striped rows on dark theme
- Status badges (colored pills)
- Sortable column headers (click to sort)
- Search/filter input
- Progress as inline mini-bar
- Pagination or virtual scroll

### 2.7 LLM Benchmark Section

**Current:** Basic table + chart
**Redesign:**
- Model comparison cards with key metrics
- Horizontal bar chart for tok/s comparison
- Correctness as star rating or percentage badge
- Cold start time as visual indicator
- Filter by model size/type

### 2.8 Security Section

**Current:** Plain list
**Redesign:**
- Cards with severity icon (shield + color)
- Status: pass/warn/fail with timestamp
- Expandable detail with recommendation
- Overall security score at top

### 2.9 Agent Office

**Current:** Animated pixel art — this is charming, keep it
**Redesign:** Only polish the surrounding chrome:
- Section header with agent count
- Subtle border/frame around the office
- Tooltip on agent hover showing current task

### Deliverable
→ All sections designed in Figma with real data mockups
→ Pencil variations for project cards, KPI row, and activity timeline

---

## Phase 3: Code Generation via Figma MCP (Days 7–9)

### 3.1 Architecture Decision: Stay Static or Migrate?

**Option A: Stay vanilla HTML/CSS/JS (recommended)**
- Lowest friction — matches current stack
- Figma MCP generates clean HTML + CSS
- Swap out existing `styles.css` + `index.html`
- Refactor `app.js` to populate new markup
- No build step, instant GitHub Pages deploy

**Option B: Migrate to lightweight framework**
- Use Preact or Svelte for component structure
- Better for maintainability long-term
- Adds build step (Vite)
- More work upfront

**Recommendation:** Option A for now. The dashboard is ~1100 lines of JS — manageable without a framework. Figma MCP generates the HTML/CSS, we adapt the existing JS to target new DOM structure.

### 3.2 Generation Order

1. **Design tokens** → CSS custom properties in `:root {}`
2. **Base components** → Status badge, progress bar, card shell (CSS classes)
3. **Header** → New header layout with nav/filters
4. **KPI row** → `<section class="kpi-row">` with card markup
5. **Project cards** → Card template markup + CSS grid
6. **Bot panels** → Bot card markup
7. **Activity timeline** → Timeline markup + CSS
8. **Charts wrapper** → Chart container with proper sizing/responsive
9. **History table** → Styled table with sort indicators
10. **LLM benchmarks** → Benchmark card layout
11. **Security section** → Security card layout
12. **Full page assembly** → Complete `index.html` with all sections
13. **Responsive CSS** → Media queries for tablet/mobile

### 3.3 JS Refactor

After new HTML/CSS is generated:
- Update `app.js` DOM selectors to match new markup
- Add event listeners for new interactions (sort, filter, expand)
- Keep existing data-fetching logic (JSON files)
- Add chart library (Chart.js via CDN) to replace custom canvas drawing
- Preserve `office.js` as-is

### Deliverable
→ New `index.html`, `assets/styles.css` generated from Figma
→ Refactored `app.js` targeting new DOM
→ Chart.js integration for data viz

---

## Phase 4: Polish & Responsive Testing (Days 10–12)

### 4.1 Responsive Breakpoints
- **Desktop (1200px+):** 3-column project grid, full chart width
- **Tablet (768–1199px):** 2-column grid, stacked charts
- **Mobile (< 768px):** Single column, collapsible sections, swipeable KPI cards

### 4.2 Interaction Polish
- Card hover effects (subtle elevation change)
- Smooth expand/collapse for project subprocess details
- Chart tooltip transitions
- Loading skeletons while JSON fetches
- Filter animations

### 4.3 Performance
- Keep total CSS under 10KB (current is trivially small)
- Lazy-load chart library
- Service worker caching (already exists in `sw.js`)
- Optimize for GitHub Pages cold-load

### 4.4 Accessibility
- ARIA labels on interactive elements
- Keyboard navigation for filters and tables
- Color-blind safe status indicators (icons + color, not just color)
- Sufficient contrast ratios on dark theme

### Deliverable
→ Fully responsive, polished dashboard
→ Commit and push to GitHub Pages

---

## Phase 5: Ongoing Design-Code Loop

Once the Figma MCP workflow is established:
- **New section needed?** Design in Figma → MCP → code → deploy
- **Visual tweak?** Update Figma → re-sync changed component → push
- **New data source?** Add JSON file + design the card in Figma → generate markup

This makes the dashboard infinitely extensible without touching raw CSS.

---

## File Changes Summary

```
BERKENBOT_DASHBOARD/
├── index.html              ← REGENERATED from Figma
├── assets/
│   ├── styles.css          ← REGENERATED from Figma
│   ├── app.js              ← REFACTORED (new DOM selectors, chart.js)
│   ├── office.js           ← KEPT AS-IS
│   └── charts.js           ← NEW (Chart.js wrapper utilities)
├── data/                   ← UNCHANGED (existing JSON files)
├── scripts/                ← UNCHANGED (existing Python collectors)
└── FIGMA_PENCIL_IMPLEMENTATION_PLAN.md ← THIS FILE
```

---

## Prerequisites

- [ ] Figma account
- [ ] Figma MCP configured with Claude Code
- [ ] Pencil.dev account
- [ ] Current dashboard JSON data for realistic mockups

## Estimated Timeline

| Phase | Duration | Output |
|-------|----------|--------|
| 1. Design System | 2 days | Figma tokens + component library |
| 2. Section Redesign | 4 days | All sections designed + Pencil variations |
| 3. Code Generation | 3 days | New HTML/CSS + refactored JS |
| 4. Polish & Responsive | 3 days | Production-ready dashboard |
| 5. Ongoing Loop | continuous | Design → code for new features |

**Total: ~12 days** from current basic dashboard to a polished, professional monitoring interface.

---

## Cost Estimate

| Item | Cost |
|------|------|
| Figma (free tier) | $0 |
| Pencil.dev | TBD |
| Chart.js (open source) | $0 |
| Claude Code tokens for generation | ~$10–20 |
| **Total** | **~$10–20** |

---

*The dashboard is the command center for all projects. A Figma-first redesign ensures it looks and feels like a real ops tool rather than a developer prototype — and the MCP pipeline means future sections are a Figma design away from production.*
