# BOT_DASHBOARD (local planning build)

This local scaffold is a static dashboard intended for GitHub Pages.

## Purpose
A single browser page to monitor:
- Projects and status
- Bot health (Beeker/Berken)
- Queue/activity feed
- Security checks

## Stack
- Static HTML/CSS/JS (no backend)
- JSON data in `data/`
- Optional GitHub Actions to refresh data files

## Local preview
```bash
cd BOT_DASHBOARD
python3 -m http.server 8080
# open http://127.0.0.1:8080
```

## Data files
- `data/overview.json`
- `data/projects.json`
- `data/bots.json`
- `data/events.json`
- `data/security.json`

## Automated GitHub activity ingest
- Configure tracked repos in `data/repo_sources.json` (`project` -> `owner/repo`).
- Run `python scripts/ingest_github_activity.py` to pull:
  - latest commit time
  - open issue count
- Script updates:
  - `data/projects.json` (`lastUpdate` + auto-pipeline notes)
  - `data/history.json` (append activity events)
- Auth uses `GITHUB_TOKEN` env var only (never written to disk).

The scheduled workflow (`.github/workflows/build-dashboard.yml`) runs every 15 minutes and passes `${{ secrets.GITHUB_TOKEN }}` server-side.
