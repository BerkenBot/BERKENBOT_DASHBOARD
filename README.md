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

## Next
- Wire a GitHub Action to ingest status from project repos/issues once remote URL is available.
