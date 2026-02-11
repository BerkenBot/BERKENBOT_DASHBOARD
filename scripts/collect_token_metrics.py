#!/usr/bin/env python3
from __future__ import annotations
import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
DATA = ROOT / "data" / "token_metrics.json"
STATE_DIR = ROOT / ".state"
STATE = STATE_DIR / "token_metrics_state.json"
SESSIONS = Path('/home/openclaw/.openclaw/agents/main/sessions/sessions.json')
BENCH_DIR = WORKSPACE / 'benchmark_runs'


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text('utf-8'))
    except Exception:
        return default


def oauth_totals() -> tuple[int, int]:
    d = load_json(SESSIONS, {})
    tin=tout=0
    if isinstance(d, dict):
        for _, s in d.items():
            if not isinstance(s, dict):
                continue
            prov = (s.get('modelProvider') or '').lower()
            # treat non-local providers as oauth/API usage
            if prov in ('ollama','lmstudio','local'):
                continue
            tin += int(s.get('inputTokens') or 0)
            tout += int(s.get('outputTokens') or 0)
    return tin, tout


def local_deltas(state: dict) -> tuple[int, int, dict]:
    offsets = state.get('local_offsets', {}) if isinstance(state.get('local_offsets'), dict) else {}
    in_delta = out_delta = 0

    if not BENCH_DIR.exists():
        return 0, 0, offsets

    for fp in sorted(BENCH_DIR.glob('*.jsonl')):
        key = str(fp)
        off = int(offsets.get(key, 0) or 0)
        size = fp.stat().st_size
        if off > size:
            off = 0
        with fp.open('r', encoding='utf-8', errors='ignore') as f:
            f.seek(off)
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                in_delta += int(obj.get('prompt_eval_count') or 0)
                out_delta += int(obj.get('eval_count') or 0)
            offsets[key] = f.tell()

    return in_delta, out_delta, offsets


def main():
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    DATA.parent.mkdir(parents=True, exist_ok=True)

    data = load_json(DATA, {'samples': []})
    state = load_json(STATE, {'oauth_last_in': 0, 'oauth_last_out': 0, 'local_offsets': {}})

    o_in_total, o_out_total = oauth_totals()
    prev_in = int(state.get('oauth_last_in', 0))
    prev_out = int(state.get('oauth_last_out', 0))

    # Bootstrap guard: first run (or lost state) should not emit a giant synthetic spike.
    bootstrap_reset = (prev_in == 0 and prev_out == 0 and (o_in_total > 0 or o_out_total > 0))
    if bootstrap_reset:
        o_in_delta = 0
        o_out_delta = 0
    else:
        o_in_delta = max(0, o_in_total - prev_in)
        o_out_delta = max(0, o_out_total - prev_out)

    l_in_delta, l_out_delta, offsets = local_deltas(state)

    sample = {
        'ts': datetime.now().astimezone().isoformat(timespec='seconds'),
        'local_in_tokens': l_in_delta,
        'local_out_tokens': l_out_delta,
        'oauth_in_tokens': o_in_delta,
        'oauth_out_tokens': o_out_delta,
        'bootstrap_reset': bootstrap_reset,
    }

    data.setdefault('samples', []).append(sample)
    data['samples'] = data['samples'][-1440:]  # keep ~24h at 1-min cadence
    DATA.write_text(json.dumps(data, indent=2) + '\n', 'utf-8')

    state['oauth_last_in'] = o_in_total
    state['oauth_last_out'] = o_out_total
    state['local_offsets'] = offsets
    STATE.write_text(json.dumps(state, indent=2) + '\n', 'utf-8')

    print('token sample', sample['ts'])


if __name__ == '__main__':
    main()
