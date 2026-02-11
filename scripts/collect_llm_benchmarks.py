#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]              # BERKENBOT_DASHBOARD
WS = ROOT.parent                                        # workspace
OUT = ROOT / "data" / "llm_benchmarks.json"
STATIC_RESULTS = WS / "model_benchmark_results.json"
RUNS_DIR = WS / "benchmark_runs"


def _read_json(path: Path, default):
    try:
        return json.loads(path.read_text("utf-8"))
    except Exception:
        return default


def _latest_run_file() -> Path | None:
    files = sorted(RUNS_DIR.glob("max_throughput_2h_*.jsonl"), key=lambda p: p.stat().st_mtime)
    return files[-1] if files else None


def _parse_jsonl(path: Path):
    rows = []
    for line in path.read_text("utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rows.append(json.loads(line))
        except Exception:
            continue
    return rows


def main():
    static = _read_json(STATIC_RESULTS, {"summary": []})
    leaderboard = []
    for r in static.get("summary", []):
        leaderboard.append({
            "model": r.get("model"),
            "score": r.get("score"),
            "avg_tok_s": r.get("avg_tok_s"),
            "correctness": r.get("correctness"),
            "cold_wall_s": r.get("cold_wall_s"),
        })

    latest_file = _latest_run_file()
    samples = []
    model_totals = {}
    run_meta = {"file": None, "rows": 0, "startedAt": None, "endedAt": None}

    if latest_file and latest_file.exists():
        rows = _parse_jsonl(latest_file)
        run_meta["file"] = latest_file.name
        run_meta["rows"] = len(rows)
        if rows:
            run_meta["startedAt"] = rows[0].get("ts")
            run_meta["endedAt"] = rows[-1].get("ts")

        # Keep recent samples for charting
        for row in rows[-240:]:
            model = row.get("model")
            eval_count = row.get("eval_count") or 0
            elapsed = row.get("elapsed_s") or 0
            tok_s = (float(eval_count) / float(elapsed)) if elapsed else None
            samples.append({
                "ts": row.get("ts"),
                "model": model,
                "eval_count": eval_count,
                "elapsed_s": elapsed,
                "tok_s": round(tok_s, 2) if tok_s is not None else None,
                "ok": bool(row.get("ok", False)),
            })

            if model:
                rec = model_totals.setdefault(model, {"count": 0, "ok": 0, "sum_tok_s": 0.0})
                rec["count"] += 1
                rec["ok"] += 1 if row.get("ok") else 0
                if tok_s is not None:
                    rec["sum_tok_s"] += tok_s

    live_summary = []
    for model, rec in sorted(model_totals.items(), key=lambda kv: kv[1]["sum_tok_s"] / max(1, kv[1]["count"]), reverse=True):
        count = rec["count"]
        live_summary.append({
            "model": model,
            "samples": count,
            "ok_rate": round(rec["ok"] / count, 3) if count else None,
            "avg_tok_s": round(rec["sum_tok_s"] / count, 2) if count else None,
        })

    out = {
        "lastUpdated": datetime.now().astimezone().isoformat(timespec="seconds"),
        "leaderboard": leaderboard,
        "liveRun": run_meta,
        "liveSummary": live_summary,
        "samples": samples,
    }
    OUT.write_text(json.dumps(out, indent=2) + "\n", "utf-8")
    print(f"updated {OUT}")


if __name__ == "__main__":
    main()
