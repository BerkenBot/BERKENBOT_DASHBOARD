#!/usr/bin/env python3
"""Collect lines-of-code stats per agent for today, based on git commits.

Agent → repo mapping:
  FORGE: SCALARA, _GH_INTELLIGENCE_V2, LOCAL_TTS, LORA_GEN, C64
  ANVIL: same as FORGE (reviews)
  SCOUT: LOCAL_TTS, LORA_GEN
  RELAY: DATA_AUDIT, BERKENBOT_DASHBOARD
  PULSE: BERKENBOT_DASHBOARD (monitoring/data)
"""
from __future__ import annotations
import json, subprocess, os
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WS = ROOT.parent  # workspace root
OUT = ROOT / "data" / "agent_stats.json"

AGENT_REPOS = {
    "FORGE": ["scalara", "_GH_INTELLIGENCE_V2", "los_tts", "LORA_GEN", "C64"],
    "ANVIL": ["scalara", "_GH_INTELLIGENCE_V2", "los_tts", "LORA_GEN", "C64"],
    "SCOUT": ["los_tts", "LORA_GEN"],
    "RELAY": ["DATA_AUDIT", "BERKENBOT_DASHBOARD"],
    "PULSE": ["BERKENBOT_DASHBOARD"],
}

def git_lines_today(repo_path: Path) -> int:
    """Get total lines added+deleted today via git log."""
    if not (repo_path / ".git").exists():
        return 0
    today = datetime.now().strftime("%Y-%m-%d")
    try:
        out = subprocess.check_output(
            ["git", "-C", str(repo_path), "log",
             f"--since={today}T00:00:00", "--format=", "--numstat"],
            text=True, stderr=subprocess.DEVNULL, timeout=10
        ).strip()
    except Exception:
        return 0
    total = 0
    for line in out.split("\n"):
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) >= 2:
            try:
                added = int(parts[0]) if parts[0] != "-" else 0
                deleted = int(parts[1]) if parts[1] != "-" else 0
                total += added + deleted
            except ValueError:
                pass
    return total

def main():
    stats = {}
    for agent, repos in AGENT_REPOS.items():
        total = 0
        for repo in repos:
            repo_path = WS / repo
            total += git_lines_today(repo_path)
        # ANVIL gets ~30% of FORGE's count (reviewing, not writing)
        if agent == "ANVIL" and "FORGE" in stats:
            total = max(total, int(stats["FORGE"] * 0.3))
        stats[agent] = total

    today = datetime.now().strftime("%Y-%m-%d")
    obj = {"date": today, "agents": stats}
    OUT.write_text(json.dumps(obj, indent=2) + "\n", "utf-8")
    print(f"Agent stats: {stats}")

if __name__ == "__main__":
    main()
