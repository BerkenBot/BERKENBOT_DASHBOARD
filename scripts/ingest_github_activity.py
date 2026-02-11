#!/usr/bin/env python3
"""Ingest GitHub repo activity for tracked dashboard projects.

Reads repo mappings from `data/repo_sources.json`, fetches each repo's latest
commit timestamp + open issue count from GitHub API, and updates:
- `data/projects.json` (project `lastUpdate` + auto-pipeline note)
- `data/history.json` (append one activity event per successful repo fetch)

Auth:
- Optional `GITHUB_TOKEN` env var (recommended for private repos / higher limits)
- Token is never written to disk.
"""

from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REPO_SOURCES = DATA / "repo_sources.json"
PROJECTS_JSON = DATA / "projects.json"
HISTORY_JSON = DATA / "history.json"


def now_local_str() -> str:
    return datetime.now().astimezone().strftime("%Y-%m-%d %H:%M")


def parse_iso_to_local_minute(iso_text: str | None) -> str | None:
    if not iso_text:
        return None
    try:
        dt = datetime.fromisoformat(iso_text.replace("Z", "+00:00"))
    except ValueError:
        return None
    return dt.astimezone().strftime("%Y-%m-%d %H:%M")


def gh_get(path: str, token: str | None) -> dict:
    url = f"https://api.github.com{path}"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "berkenbot-dashboard-ingest",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = Request(url, headers=headers, method="GET")
    with urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_repo_activity(repo_full_name: str, token: str | None) -> dict:
    escaped = quote(repo_full_name, safe="/")

    repo = gh_get(f"/repos/{escaped}", token)
    default_branch = repo.get("default_branch") or "main"
    open_issues = int(repo.get("open_issues_count") or 0)

    commits = gh_get(f"/repos/{escaped}/commits?sha={quote(default_branch)}&per_page=1", token)
    last_commit_iso = None
    if isinstance(commits, list) and commits:
        last_commit_iso = (
            commits[0].get("commit", {}).get("committer", {}).get("date")
            or commits[0].get("commit", {}).get("author", {}).get("date")
        )

    last_commit_local = parse_iso_to_local_minute(last_commit_iso) or parse_iso_to_local_minute(repo.get("pushed_at"))

    return {
        "repo": repo_full_name,
        "open_issues": open_issues,
        "default_branch": default_branch,
        "last_commit_iso": last_commit_iso,
        "last_commit_local": last_commit_local,
    }


def local_git_last_commit(local_path: str | None) -> str | None:
    if not local_path:
        return None
    repo_dir = (ROOT / local_path).resolve()
    if not (repo_dir / ".git").exists():
        return None
    try:
        out = subprocess.check_output(
            ["git", "-C", str(repo_dir), "log", "-1", "--date=iso-strict", "--format=%cI"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except Exception:
        return None
    return parse_iso_to_local_minute(out)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text("utf-8"))


def save_json(path: Path, obj: dict) -> None:
    path.write_text(json.dumps(obj, indent=2) + "\n", "utf-8")


def upsert_pipeline_note(project_item: dict, note: str) -> None:
    subprocesses = project_item.get("subprocesses")
    if not isinstance(subprocesses, list):
        return

    for sp in subprocesses:
        name = (sp.get("name") or "").strip().lower()
        if "auto data pipeline" in name or "auto-ingest" in name or "ingest" in name:
            sp["note"] = note
            return


def main() -> int:
    token = os.environ.get("GITHUB_TOKEN")

    sources = load_json(REPO_SOURCES).get("items", [])
    projects = load_json(PROJECTS_JSON)
    history = load_json(HISTORY_JSON)

    project_items = projects.get("items", [])
    history_items = history.get("items", [])

    project_index = {p.get("name"): p for p in project_items if isinstance(p, dict) and p.get("name")}

    successes = 0
    failures: list[str] = []

    for item in sources:
        project_name = item.get("project")
        repo = item.get("repo")
        local_path = item.get("localPath")
        if not project_name or not repo:
            continue

        project = project_index.get(project_name)
        if not project:
            failures.append(f"{project_name}: project missing in projects.json")
            continue

        commit_local = "unknown"
        open_issues: int | None = None
        source = "github"

        try:
            activity = fetch_repo_activity(repo, token)
            commit_local = activity.get("last_commit_local") or "unknown"
            open_issues = activity["open_issues"]
        except (HTTPError, URLError, Exception) as e:
            fallback_commit = local_git_last_commit(local_path)
            if fallback_commit:
                source = "local-fallback"
                commit_local = fallback_commit
                failures.append(f"{project_name} ({repo}): {e}; used local git commit timestamp")
            else:
                failures.append(f"{project_name} ({repo}): {e}")
                continue

        project["lastUpdate"] = commit_local
        open_issues_note = str(open_issues) if open_issues is not None else "unknown(auth required)"
        upsert_pipeline_note(project, f"repo={repo} | last_commit={commit_local} | open_issues={open_issues_note}")

        issue_text = str(open_issues) if open_issues is not None else "unknown"
        history_items.append(
            {
                "when": now_local_str(),
                "project": project_name,
                "event": f"GitHub ingest ({source}): {repo} last commit {commit_local}, open issues {issue_text}",
                "status": project.get("status", "gray"),
                "progress": int(project.get("progress") or 0),
            }
        )
        successes += 1

    # keep history bounded
    if len(history_items) > 1000:
        history_items[:] = history_items[-1000:]

    projects["items"] = project_items
    history["items"] = history_items

    save_json(PROJECTS_JSON, projects)
    save_json(HISTORY_JSON, history)

    print(f"GitHub ingest complete: {successes} success, {len(failures)} failed")
    if failures:
        for f in failures:
            print(" -", f)

    # non-zero only when everything failed
    return 1 if successes == 0 and failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
