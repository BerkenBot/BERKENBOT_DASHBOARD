# BOT_DASHBOARD data schema (v1)

## overview.json
- `lastUpdated` (ISO string)
- `metrics` array of `{ key, value }`

## projects.json
- `items` array of:
  - `name` string
  - `status` enum: `green|yellow|red|gray`
  - `progress` number (0-100)
  - `lastUpdate` string
  - `owner` string
  - `nextAction` string
  - `subprocesses` array of:
    - `name` string
    - `status` enum
    - `progress` number (0-100)
    - `note` string

## bots.json
- `items` array of:
  - `name` string
  - `status` enum
  - `summary` string
  - `lastHeartbeat` string

## events.json
- `items` array of `{ when, text }`

## security.json
- `items` array of `{ level, text }`, level enum same as status

## history.json
- `items` array of:
  - `when` string
  - `project` string
  - `event` string
  - `status` enum
  - `progress` number (0-100)

## system_metrics.json
- `samples` array of:
  - `ts` ISO timestamp
  - `cpu_pct` number (0-100)
  - `ram_pct` number (0-100)
  - `ram_used_gib` number
  - `swap_used_gib` number
  - `gpu` array of:
    - `index` int
    - `name` string
    - `util_pct` number (0-100)
    - `mem_used_mib` number
    - `mem_total_mib` number
    - `mem_pct` number (0-100)
    - `power_w` number

## token_metrics.json
- `samples` array of:
  - `ts` ISO timestamp
  - `local_in_tokens` number (delta since previous sample)
  - `local_out_tokens` number (delta since previous sample)
  - `oauth_in_tokens` number (delta since previous sample)
  - `oauth_out_tokens` number (delta since previous sample)
