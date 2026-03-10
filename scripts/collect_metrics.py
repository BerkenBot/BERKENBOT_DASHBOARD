#!/usr/bin/env python3
"""Collect comprehensive agent metrics for the BerkenBot Dashboard.

Collects:
- Git commit/LOC metrics from local repos
- Token usage from OpenClaw session transcripts
- Activity status and hourly distributions
"""
from __future__ import annotations
import json
import subprocess
import os
import glob
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
import sys

ROOT = Path(__file__).resolve().parents[1]
WS = ROOT.parent  # workspace root
OUT = ROOT / "data" / "agent_metrics.json"
OPENCLAW_ROOT = Path("/home/openclaw/.openclaw")

# Agent → repo mapping
AGENT_REPOS = {
    "BERKEN_BOT": ["scalara", "_GH_INTELLIGENCE_V2", "los_tts", "LORA_GEN", "C64", "DATA_AUDIT", "BERKENBOT_DASHBOARD", "_LUHA", "STARFIELD"],
    "R2-D2": ["scalara", "_GH_INTELLIGENCE_V2", "los_tts", "LORA_GEN", "C64"],
    "R4-P17": ["scalara", "_GH_INTELLIGENCE_V2", "los_tts", "LORA_GEN", "C64"],
    "ADA": ["los_tts", "LORA_GEN"],
    "IVE": ["los_tts", "BERKENBOT_DASHBOARD"],
    "SPOCK": ["BERKENBOT_DASHBOARD"],
    "K-2SO": ["BERKENBOT_DASHBOARD"],
    "MAVIC": [],
}

# Agent → session mapping
AGENT_SESSIONS = {
    "BERKEN_BOT": {
        "topics": [],  # orchestrator sees all
        "cron_labels": [],
        "is_orchestrator": True,
        "agent_dirs": ["main", "claude-code", "codex"],
    },
    "R2-D2": {  # FORGE - lead engineer
        "topics": [1885, 1226, 2217],
        "cron_labels": [],
        "subagent_labels": ["wave16-codegen", "wave16-sliding-window", "wave16-component"],
        "agent_dirs": ["forge"],
    },
    "R4-P17": {  # ANVIL - code review
        "topics": [1885, 1226],
        "cron_labels": [],
        "subagent_labels": ["wave16-dynamo", "wave16-dependency"],
        "agent_dirs": ["anvil"],
    },
    "ADA": {  # SCOUT - research
        "topics": [],
        "cron_labels": ["SCOUT", "model landscape"],
        "subagent_labels": [],
        "agent_dirs": ["scout"],
    },
    "IVE": {  # CREATIVE
        "topics": [14],
        "cron_labels": [],
        "subagent_labels": ["dashboard-editor", "dashboard-metrics"],
        "agent_dirs": ["creative"],
    },
    "SPOCK": {  # CRON - ops
        "topics": [],
        "cron_labels": ["Dashboard Data", "Hourly chat", "Watchdog", "Overnight", "Job Monitor", "Memory Monitor", "Disk usage"],
        "subagent_labels": [],
        "agent_dirs": ["cron"],
    },
    "K-2SO": {  # SENTINEL - security
        "topics": [],
        "cron_labels": ["security", "Disk usage"],
        "subagent_labels": [],
        "agent_dirs": ["sentinel"],
    },
    "MAVIC": {  # FLOAT - flex
        "topics": [],
        "cron_labels": [],
        "subagent_labels": [],
        "agent_dirs": ["float"],
    },
}

# Agent role names
AGENT_ROLES = {
    "BERKEN_BOT": "Orchestrator",
    "R2-D2": "Lead Engineer α · FORGE",
    "R4-P17": "Lead Engineer β · ANVIL",
    "ADA": "Research · LLM Scout",
    "IVE": "Creative · Designer",
    "SPOCK": "Ops · Reliability",
    "K-2SO": "Security · Sentinel",
    "MAVIC": "Flex · Overflow",
}


def get_today_range_cst():
    """Get today's date range in CST (UTC-6)."""
    # Current time in UTC
    now_utc = datetime.utcnow()
    # Convert to CST (UTC-6)
    cst_offset = timedelta(hours=-6)
    now_cst = now_utc + cst_offset
    
    # Start of day in CST
    today_cst = now_cst.replace(hour=0, minute=0, second=0, microsecond=0)
    # End of day in CST
    tomorrow_cst = today_cst + timedelta(days=1)
    
    return today_cst, tomorrow_cst, now_cst


def git_log_today(repo_path: Path, today_start: datetime, today_end: datetime) -> Dict[str, Any]:
    """Get git commit and LOC data for today."""
    if not (repo_path / ".git").exists():
        return {"loc": 0, "added": 0, "deleted": 0, "commits": 0, "by_hour": [0]*24, "commits_list": []}
    
    try:
        # Get commits with numstat for today
        since_str = today_start.strftime("%Y-%m-%d %H:%M:%S")
        until_str = today_end.strftime("%Y-%m-%d %H:%M:%S")
        
        out = subprocess.check_output(
            ["git", "-C", str(repo_path), "log",
             f"--since={since_str}", f"--until={until_str}",
             "--numstat", "--format=%H|%aI|%s"],
            text=True, stderr=subprocess.DEVNULL, timeout=10
        ).strip()
    except Exception as e:
        print(f"Git error for {repo_path.name}: {e}", file=sys.stderr)
        return {"loc": 0, "added": 0, "deleted": 0, "commits": 0, "by_hour": [0]*24, "commits_list": []}
    
    if not out:
        return {"loc": 0, "added": 0, "deleted": 0, "commits": 0, "by_hour": [0]*24, "commits_list": []}
    
    commits = []
    total_added = 0
    total_deleted = 0
    loc_by_hour = [0] * 24
    
    lines = out.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Parse commit header (has | delimiter)
        if "|" in line:
            parts = line.split("|", 2)
            if len(parts) == 3:
                commit_hash, commit_time, commit_msg = parts
                
                # Parse timestamp (ISO format)
                try:
                    commit_dt = datetime.fromisoformat(commit_time.replace('Z', '+00:00'))
                    # Adjust for CST if timestamp doesn't have TZ offset
                    if commit_dt.tzinfo is None:
                        commit_dt_cst = commit_dt - timedelta(hours=6)
                    else:
                        # Already has timezone, convert to UTC then CST
                        commit_dt_cst = commit_dt.replace(tzinfo=None) - timedelta(hours=6)
                    hour = commit_dt_cst.hour
                except Exception as e:
                    print(f"Time parse error: {commit_time} - {e}", file=sys.stderr)
                    hour = 0
                    commit_dt_cst = None
                
                # Skip blank line after commit header
                i += 1
                if i < len(lines) and not lines[i].strip():
                    i += 1
                
                # Collect numstat lines for this commit
                commit_added = 0
                commit_deleted = 0
                while i < len(lines):
                    stat_line = lines[i].strip()
                    # Empty line or next commit header -> done with this commit
                    if not stat_line or "|" in stat_line:
                        break
                    
                    stat_parts = stat_line.split("\t")
                    if len(stat_parts) >= 2:
                        try:
                            added = int(stat_parts[0]) if stat_parts[0] != "-" else 0
                            deleted = int(stat_parts[1]) if stat_parts[1] != "-" else 0
                            commit_added += added
                            commit_deleted += deleted
                        except ValueError:
                            pass
                    i += 1
                
                total_added += commit_added
                total_deleted += commit_deleted
                loc_by_hour[hour] += commit_added + commit_deleted
                
                time_str = commit_dt_cst.strftime("%H:%M") if commit_dt_cst else "??:??"
                commits.append({
                    "hash": commit_hash[:8],
                    "time": time_str,
                    "msg": commit_msg[:60],
                    "loc": commit_added + commit_deleted,
                })
                continue
        
        i += 1
    
    return {
        "loc": total_added + total_deleted,
        "added": total_added,
        "deleted": total_deleted,
        "commits": len(commits),
        "by_hour": loc_by_hour,
        "commits_list": commits,
    }


def collect_git_metrics(agent: str, today_start: datetime, today_end: datetime) -> Dict[str, Any]:
    """Collect git metrics for an agent."""
    repos = AGENT_REPOS.get(agent, [])
    
    total_loc = 0
    total_added = 0
    total_deleted = 0
    total_commits = 0
    loc_by_hour = [0] * 24
    all_commits = []
    active_repos = []
    
    for repo_name in repos:
        repo_path = WS / repo_name
        if not repo_path.exists():
            continue
        
        metrics = git_log_today(repo_path, today_start, today_end)
        
        if metrics["commits"] > 0:
            active_repos.append(repo_name)
            
        total_loc += metrics["loc"]
        total_added += metrics["added"]
        total_deleted += metrics["deleted"]
        total_commits += metrics["commits"]
        
        for hour, val in enumerate(metrics["by_hour"]):
            loc_by_hour[hour] += val
        
        for commit in metrics["commits_list"]:
            commit["repo"] = repo_name
            all_commits.append(commit)
    
    # Sort commits by time and take the most recent 5
    all_commits.sort(key=lambda c: c["time"], reverse=True)
    recent_commits = all_commits[:5]
    
    return {
        "loc_today": total_loc,
        "loc_added": total_added,
        "loc_deleted": total_deleted,
        "commits_today": total_commits,
        "loc_by_hour": loc_by_hour,
        "recent_commits": recent_commits,
        "active_repos": active_repos,
    }


def parse_session_jsonl(jsonl_path: Path, start_ms: int = None, end_ms: int = None) -> Dict[str, Any]:
    """Parse a session JSONL file for token usage within a time window.
    
    Args:
        jsonl_path: Path to JSONL file
        start_ms: Start timestamp in ms (None = all time)
        end_ms: End timestamp in ms (None = all time)
    """
    input_tokens = 0
    output_tokens = 0
    cost = 0.0
    tokens_by_hour = [0] * 24
    model_used = None
    
    try:
        with open(jsonl_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                    
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                
                # Handle wrapped format: {"type":"message", "message": {...}}
                if obj.get("type") == "message" and "message" in obj:
                    msg = obj["message"]
                else:
                    msg = obj
                
                # Look for assistant messages with usage
                if msg.get("role") != "assistant":
                    continue
                
                # Get timestamp - could be at top level or in message
                timestamp = msg.get("timestamp") or obj.get("timestamp")
                
                # Convert ISO string to milliseconds if needed
                if isinstance(timestamp, str):
                    try:
                        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                        timestamp = int(dt.timestamp() * 1000)
                    except:
                        continue
                
                # Filter by time window if specified
                if start_ms is not None and timestamp < start_ms:
                    continue
                if end_ms is not None and timestamp >= end_ms:
                    continue
                
                usage = msg.get("usage")
                if not usage:
                    continue
                
                # Sum tokens
                input_tok = usage.get("input", 0) + usage.get("cacheRead", 0)
                output_tok = usage.get("output", 0)
                
                input_tokens += input_tok
                output_tokens += output_tok
                
                # Sum cost
                if "cost" in usage and isinstance(usage["cost"], dict):
                    cost += usage["cost"].get("total", 0)
                
                # Model
                if not model_used and "model" in msg:
                    model_used = msg["model"]
                
                # Hour distribution (convert ms to datetime)
                try:
                    dt = datetime.utcfromtimestamp(timestamp / 1000.0)
                    # Convert to CST
                    dt_cst = dt - timedelta(hours=6)
                    hour = dt_cst.hour
                    tokens_by_hour[hour] += input_tok + output_tok
                except:
                    pass
    
    except Exception as e:
        print(f"Error parsing {jsonl_path.name}: {e}", file=sys.stderr)
    
    return {
        "input": input_tokens,
        "output": output_tokens,
        "cost": cost,
        "by_hour": tokens_by_hour,
        "model": model_used or "unknown",
    }


def map_session_to_agent(jsonl_path: Path) -> str:
    """Map a session file to an agent based on directory."""
    # Check which agent directory it belongs to
    for agent, config in AGENT_SESSIONS.items():
        for agent_dir in config.get("agent_dirs", []):
            if f"/agents/{agent_dir}/" in str(jsonl_path):
                return agent
    
    # Default to BERKEN_BOT (orchestrator)
    return "BERKEN_BOT"


def collect_token_metrics(now_cst: datetime) -> Dict[str, Dict[str, Any]]:
    """Collect token metrics from all session JSONL files across multiple timeframes."""
    
    # Calculate time windows
    hour_start = now_cst.replace(minute=0, second=0, microsecond=0)
    hour_end = hour_start + timedelta(hours=1)
    
    today_start = now_cst.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    week_start = today_start - timedelta(days=6)  # last 7 days
    month_start = today_start - timedelta(days=29)  # last 30 days
    
    # Convert to milliseconds
    hour_start_ms = int(hour_start.timestamp() * 1000)
    hour_end_ms = int(hour_end.timestamp() * 1000)
    today_start_ms = int(today_start.timestamp() * 1000)
    today_end_ms = int(today_end.timestamp() * 1000)
    week_start_ms = int(week_start.timestamp() * 1000)
    month_start_ms = int(month_start.timestamp() * 1000)
    
    agent_metrics = {agent: {
        "input_today": 0,
        "output_today": 0,
        "cost_today": 0.0,
        "tokens_by_hour": [0] * 24,
        "model": "claude-opus-4-6",
        "hourly": {"input": 0, "output": 0, "cost": 0.0},
        "daily": {"input": 0, "output": 0, "cost": 0.0},
        "weekly": {"input": 0, "output": 0, "cost": 0.0},
        "monthly": {"input": 0, "output": 0, "cost": 0.0},
        "all_time": {"input": 0, "output": 0, "cost": 0.0},
    } for agent in AGENT_REPOS.keys()}
    
    # Find all session JSONL files (including deleted ones)
    session_files = []
    session_files.extend(OPENCLAW_ROOT.glob("agents/*/sessions/*.jsonl"))
    session_files.extend(OPENCLAW_ROOT.glob("agents/*/sessions/*.jsonl.deleted.*"))
    
    print(f"Found {len(session_files)} session files (including deleted)", file=sys.stderr)
    
    for jsonl_path in session_files:
        agent = map_session_to_agent(jsonl_path)
        
        # Parse for each timeframe
        hourly = parse_session_jsonl(jsonl_path, hour_start_ms, hour_end_ms)
        daily = parse_session_jsonl(jsonl_path, today_start_ms, today_end_ms)
        weekly = parse_session_jsonl(jsonl_path, week_start_ms, None)
        monthly = parse_session_jsonl(jsonl_path, month_start_ms, None)
        all_time = parse_session_jsonl(jsonl_path, None, None)
        
        # Aggregate hourly
        agent_metrics[agent]["hourly"]["input"] += hourly["input"]
        agent_metrics[agent]["hourly"]["output"] += hourly["output"]
        agent_metrics[agent]["hourly"]["cost"] += hourly["cost"]
        
        # Aggregate daily (backward compat)
        agent_metrics[agent]["input_today"] += daily["input"]
        agent_metrics[agent]["output_today"] += daily["output"]
        agent_metrics[agent]["cost_today"] += daily["cost"]
        agent_metrics[agent]["daily"]["input"] += daily["input"]
        agent_metrics[agent]["daily"]["output"] += daily["output"]
        agent_metrics[agent]["daily"]["cost"] += daily["cost"]
        
        for hour, val in enumerate(daily["by_hour"]):
            agent_metrics[agent]["tokens_by_hour"][hour] += val
        
        # Aggregate weekly
        agent_metrics[agent]["weekly"]["input"] += weekly["input"]
        agent_metrics[agent]["weekly"]["output"] += weekly["output"]
        agent_metrics[agent]["weekly"]["cost"] += weekly["cost"]
        
        # Aggregate monthly
        agent_metrics[agent]["monthly"]["input"] += monthly["input"]
        agent_metrics[agent]["monthly"]["output"] += monthly["output"]
        agent_metrics[agent]["monthly"]["cost"] += monthly["cost"]
        
        # Aggregate all_time
        agent_metrics[agent]["all_time"]["input"] += all_time["input"]
        agent_metrics[agent]["all_time"]["output"] += all_time["output"]
        agent_metrics[agent]["all_time"]["cost"] += all_time["cost"]
        
        # Update model if we found one
        if daily["model"] != "unknown":
            agent_metrics[agent]["model"] = daily["model"]
    
    return agent_metrics


def determine_status(git_metrics: Dict, token_metrics: Dict, now_cst: datetime) -> tuple[str, str]:
    """Determine agent status and last active time."""
    # Check for activity in the last hour
    current_hour = now_cst.hour
    prev_hour = (current_hour - 1) % 24
    
    recent_loc = git_metrics["loc_by_hour"][current_hour] + git_metrics["loc_by_hour"][prev_hour]
    recent_tokens = token_metrics["tokens_by_hour"][current_hour] + token_metrics["tokens_by_hour"][prev_hour]
    
    if recent_loc > 0 or recent_tokens > 0:
        status = "active"
    elif git_metrics["commits_today"] > 0 or token_metrics["input_today"] > 0:
        status = "idle"
    else:
        status = "offline"
    
    # Determine last active time
    if git_metrics["recent_commits"]:
        last_active = git_metrics["recent_commits"][0]["time"]
    else:
        last_active = "—"
    
    return status, last_active


def main():
    """Main collection routine."""
    today_start, today_end, now_cst = get_today_range_cst()
    
    print(f"Collecting metrics for {today_start.strftime('%Y-%m-%d')} (CST)", file=sys.stderr)
    
    # Collect git metrics
    print("Collecting git metrics...", file=sys.stderr)
    git_metrics_by_agent = {}
    for agent in AGENT_REPOS.keys():
        git_metrics_by_agent[agent] = collect_git_metrics(agent, today_start, today_end)
    
    # R4-P17 gets max(own LOC, 30% of R2-D2's)
    if "R2-D2" in git_metrics_by_agent and "R4-P17" in git_metrics_by_agent:
        r2_loc = git_metrics_by_agent["R2-D2"]["loc_today"]
        r4_loc = git_metrics_by_agent["R4-P17"]["loc_today"]
        git_metrics_by_agent["R4-P17"]["loc_today"] = max(r4_loc, int(r2_loc * 0.3))
    
    # Collect token metrics
    print("Collecting token metrics...", file=sys.stderr)
    token_metrics_by_agent = collect_token_metrics(now_cst)
    
    # Build output
    agents_data = {}
    totals = {
        "loc_today": 0,
        "commits_today": 0,
        "input_tokens": 0,
        "output_tokens": 0,
        "cost_today": 0.0,
    }
    
    for agent in AGENT_REPOS.keys():
        git_m = git_metrics_by_agent[agent]
        token_m = token_metrics_by_agent[agent]
        
        status, last_active = determine_status(git_m, token_m, now_cst)
        
        # Determine current task from latest commit
        current_task = "—"
        if git_m["recent_commits"]:
            current_task = git_m["recent_commits"][0]["msg"]
        
        agents_data[agent] = {
            "display_name": agent,
            "role": AGENT_ROLES.get(agent, "Unknown"),
            "status": status,
            "last_active": last_active,
            "current_task": current_task,
            "git": {
                "loc_today": git_m["loc_today"],
                "loc_added": git_m["loc_added"],
                "loc_deleted": git_m["loc_deleted"],
                "commits_today": git_m["commits_today"],
                "loc_by_hour": git_m["loc_by_hour"],
                "recent_commits": git_m["recent_commits"],
                "active_repos": git_m["active_repos"],
            },
            "tokens": {
                "input_today": token_m["input_today"],
                "output_today": token_m["output_today"],
                "cost_today": round(token_m["cost_today"], 2),
                "tokens_by_hour": token_m["tokens_by_hour"],
                "model": token_m["model"],
                "hourly": {
                    "input": token_m["hourly"]["input"],
                    "output": token_m["hourly"]["output"],
                    "cost": round(token_m["hourly"]["cost"], 2),
                },
                "daily": {
                    "input": token_m["daily"]["input"],
                    "output": token_m["daily"]["output"],
                    "cost": round(token_m["daily"]["cost"], 2),
                },
                "weekly": {
                    "input": token_m["weekly"]["input"],
                    "output": token_m["weekly"]["output"],
                    "cost": round(token_m["weekly"]["cost"], 2),
                },
                "monthly": {
                    "input": token_m["monthly"]["input"],
                    "output": token_m["monthly"]["output"],
                    "cost": round(token_m["monthly"]["cost"], 2),
                },
                "all_time": {
                    "input": token_m["all_time"]["input"],
                    "output": token_m["all_time"]["output"],
                    "cost": round(token_m["all_time"]["cost"], 2),
                },
            },
        }
        
        # Update totals
        totals["loc_today"] += git_m["loc_today"]
        totals["commits_today"] += git_m["commits_today"]
        totals["input_tokens"] += token_m["input_today"]
        totals["output_tokens"] += token_m["output_today"]
        totals["cost_today"] += token_m["cost_today"]
    
    output = {
        "generated": now_cst.isoformat(),
        "date": today_start.strftime("%Y-%m-%d"),
        "agents": agents_data,
        "totals": {
            "loc_today": totals["loc_today"],
            "commits_today": totals["commits_today"],
            "input_tokens": totals["input_tokens"],
            "output_tokens": totals["output_tokens"],
            "cost_today": round(totals["cost_today"], 2),
        },
    }
    
    # Write output
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(output, indent=2) + "\n", "utf-8")
    
    print(f"✓ Wrote {OUT}", file=sys.stderr)
    print(f"  Totals: {totals['commits_today']} commits, {totals['loc_today']} LOC, {totals['input_tokens']}→{totals['output_tokens']} tokens, ${totals['cost_today']:.2f}", file=sys.stderr)


if __name__ == "__main__":
    main()
