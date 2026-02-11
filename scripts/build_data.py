#!/usr/bin/env python3
"""Local data builder scaffold.

Updates `overview.lastUpdated` and appends a WSL CPU/GPU/RAM sample to
`data/system_metrics.json`.
Later this will ingest GitHub Issues/commits and local runtime snapshots.
"""
from __future__ import annotations
import json
from datetime import datetime
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OV = ROOT / "data" / "overview.json"


def main():
    obj = json.loads(OV.read_text("utf-8"))
    obj["lastUpdated"] = datetime.now().astimezone().isoformat(timespec="seconds")
    OV.write_text(json.dumps(obj, indent=2) + "\n", "utf-8")

    # collect one system metric sample + token metric sample (best effort)
    try:
      subprocess.run(["python3", str(ROOT / "scripts" / "collect_system_metrics.py")], check=False)
      subprocess.run(["python3", str(ROOT / "scripts" / "collect_token_metrics.py")], check=False)
    except Exception:
      pass

    print("updated", OV)


if __name__ == "__main__":
    main()
