#!/usr/bin/env python3
from __future__ import annotations
import json, re, subprocess, time
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "system_metrics.json"


def cpu_usage_pct(sample_s: float = 0.25) -> float:
    def read():
        with open('/proc/stat','r',encoding='utf-8') as f:
            line = f.readline().strip().split()
        vals = list(map(int, line[1:]))
        idle = vals[3] + vals[4]
        total = sum(vals)
        return idle, total
    i1,t1 = read()
    time.sleep(sample_s)
    i2,t2 = read()
    didle = i2-i1
    dtotal = t2-t1
    if dtotal <= 0:
        return 0.0
    return round((1 - didle/dtotal)*100, 2)


def mem_usage_pct() -> tuple[float, float, float]:
    kv = {}
    with open('/proc/meminfo','r',encoding='utf-8') as f:
        for ln in f:
            k,v = ln.split(':',1)
            kv[k]=int(v.strip().split()[0])
    total = kv.get('MemTotal',1)
    avail = kv.get('MemAvailable',0)
    used = total - avail
    swap_total = kv.get('SwapTotal',0)
    swap_free = kv.get('SwapFree',0)
    swap_used = max(0, swap_total - swap_free)
    return round(used/total*100,2), round(used/1024/1024,2), round(swap_used/1024/1024,2)


def gpus():
    cmd = ['/usr/lib/wsl/lib/nvidia-smi','--query-gpu=index,name,utilization.gpu,memory.used,memory.total,power.draw','--format=csv,noheader,nounits']
    try:
        out = subprocess.check_output(cmd, text=True, timeout=5)
    except Exception:
        return []
    items = []
    for ln in out.strip().splitlines():
        parts = [p.strip() for p in ln.split(',')]
        if len(parts) < 6:
            continue
        idx,name,util,mem_used,mem_total,power = parts[:6]
        try:
            utilf = float(util)
            mu = float(mem_used)
            mt = float(mem_total)
            mpct = round((mu/mt*100) if mt else 0,2)
            pw = float(power)
        except Exception:
            continue
        items.append({
            'index': int(idx),
            'name': name,
            'util_pct': utilf,
            'mem_used_mib': mu,
            'mem_total_mib': mt,
            'mem_pct': mpct,
            'power_w': pw,
        })
    return items


def main():
    DATA.parent.mkdir(parents=True, exist_ok=True)
    obj = {'samples': []}
    if DATA.exists():
        try:
            obj = json.loads(DATA.read_text('utf-8'))
        except Exception:
            obj = {'samples': []}

    cpu = cpu_usage_pct()
    mem_pct, mem_used_gib, swap_used_gib = mem_usage_pct()
    gpu = gpus()

    sample = {
        'ts': datetime.now().astimezone().isoformat(timespec='seconds'),
        'cpu_pct': cpu,
        'ram_pct': mem_pct,
        'ram_used_gib': mem_used_gib,
        'swap_used_gib': swap_used_gib,
        'gpu': gpu,
    }

    obj.setdefault('samples', []).append(sample)
    # keep last 720 samples (~12h at 1-min)
    obj['samples'] = obj['samples'][-720:]
    DATA.write_text(json.dumps(obj, indent=2) + '\n', 'utf-8')
    print('sampled', sample['ts'])


if __name__ == '__main__':
    main()
