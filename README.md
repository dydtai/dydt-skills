<div align="center">

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/banner.png" alt="dydt CLI and agent skills for Solana market data" width="1280">

# dydt CLI and agent skills

**Solana memecoin market data, wallet PnL, KOL trades, and live streams for AI agents.**

[![npm](https://img.shields.io/npm/v/dydt-cli?color=16a34a)](https://www.npmjs.com/package/dydt-cli)
[![node](https://img.shields.io/node/v/dydt-cli)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/dydt-cli)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-dydtai%2Fdydt--skills-111)](https://github.com/dydtai/dydt-skills)

[Website](https://dydt.ai) · [API docs](https://dydt.ai/developers) · [Get an API key](https://dydt.ai/developers/keys) · [Pricing](https://dydt.ai/developers/billing)

</div>

---

## What this is

Two pieces that work together:

- **`dydt` CLI.** One command per [dydt Data API](https://dydt.ai/developers) endpoint (23 today), plus `dydt watch` for live WebSocket streams. Commands, options, and allowed values come from the live API spec and are checked before any request is sent.
- **Agent skills.** Eleven skills that tell Claude Code, Cursor, Codex, OpenCode, Windsurf, Gemini CLI, and other agents which command answers which question, and how to read the answer correctly.

Ask your agent *"run a rug check on this token"*, *"what are KOLs buying today?"*, or *"how has this wallet done over 30 days?"* and it runs the right `dydt` commands and explains the result.

**Read-only by design.** Nothing here holds wallet keys, signs transactions, or places trades.

## Why dydt

| | |
|---|---|
| **Token risk data** | Mint and freeze authorities, Token-2022 transfer fees, top-10 / developer / sniper / bundle share of supply, insider and fresh-wallet share, LP burn, and the creator's past launches, from dydt's own Solana indexer. |
| **Wallet PnL for any address** | Realized and unrealized PnL with lot accounting, win rate, streaks, best and worst day, open positions, trade history with PnL on every sell, and day-by-day results. Not limited to dydt users. |
| **KOL tracking** | Hundreds of labeled KOL wallets, their buys and sells as they happen, and a KOL leaderboard. |
| **Discovery feeds** | New pairs, popular, top gainers, almost-bonded launchpad tokens, freshly migrated tokens, and tokenized stocks, with server-side filters on market cap, liquidity, holders, and supply concentration. |
| **Signals** | dydt token signals (groups of tiered wallets buying the same token) and wallet signals (tracked wallets closing profitable trades). |
| **Live streams** | Pool trades, candles, live pool metrics, ranking changes, wallet activity, signals, and token posts on X, over one WebSocket. |
| **Safe for agents** | Token names and links are attacker-controlled text. The CLI strips hidden characters and neutralizes instruction-like text before your agent sees it. |

## Quick start

```bash
npm install -g dydt-cli                  # Node 22.4 or newer
npx skills add dydtai/dydt-skills        # pick your agent when asked
dydt config set <your-api-key>           # key from https://dydt.ai/developers/keys
dydt sol-price                           # {"price_usd": 121.13} means it works
```

Then ask your agent something like *"what is trending on Solana in the last hour?"*

### Quick start for AI agents

If you are an agent setting this up for a user, do this:

1. Run `dydt --version`. If the command is missing, run `npm install -g dydt-cli`.
2. Run `dydt config check`. Exit code 0 means a key is already configured; you are done.
3. Otherwise tell the user: *"Create a free API key at https://dydt.ai/developers/keys and paste it here."* Wait for the key.
4. Run `dydt config set <key>`, then `dydt sol-price` to confirm.
5. Never print the full key back, and never write it into project files or commits.

## Install the skills in your agent

The skills live in [`skills/`](skills). Each one is self-contained, so you can install all of them or only the ones you need.

| Agent | Command |
|---|---|
| Claude Code (skills) | `npx skills add dydtai/dydt-skills --agent claude-code` |
| Claude Code (plugin) | `/plugin marketplace add dydtai/dydt-skills` then `/plugin install dydt@dydt` |
| Cursor | `npx skills add dydtai/dydt-skills --agent cursor` |
| Codex CLI | `npx skills add dydtai/dydt-skills --agent codex` |
| OpenCode | `npx skills add dydtai/dydt-skills --agent opencode` |
| Windsurf | `npx skills add dydtai/dydt-skills --agent windsurf` |
| Gemini CLI | `npx skills add dydtai/dydt-skills --agent gemini-cli` |
| GitHub Copilot | `npx skills add dydtai/dydt-skills --agent github-copilot` |
| Cline | `npx skills add dydtai/dydt-skills --agent cline` |
| OpenClaw | `npx skills add dydtai/dydt-skills --agent openclaw` |
| Every detected agent | `npx skills add dydtai/dydt-skills --all` |

Add `-g` to install for your user instead of the current project.

## Skills

| Skill | Use it for | Plan |
|---|---|---|
| `dydt-setup` | Installing the CLI, saving the key, what each plan includes, fixing errors | Any |
| `dydt-token` | Name to the right token address, metadata, supply, authorities, holders, pools, bonding curve | Any |
| `dydt-token-check` | A risk read as findings that each cite the field they read. No scores, no advice | Any |
| `dydt-market` | Candles, pool metrics, trades, top traders, SOL price | Any |
| `dydt-discover` | New, popular, gaining, almost-bonded, migrated, and stock feeds | Any |
| `dydt-wallet` | Wallet PnL, positions, trades, daily PnL, wallet leaderboard | Any |
| `dydt-dev-check` | A token creator's launch history | Any |
| `dydt-brief` | A market brief: trending, movers, launches, KOL buys, signals, red flags | Any; KOL and signal sections need Pro |
| `dydt-smart-money` | KOL trades, labeled wallet lists, KOL leaderboard, wallet signals | Pro, Scale |
| `dydt-signals` | dydt token signals and per-token signal history | Pro, Scale |
| `dydt-watch` | Bounded live monitoring of pools, wallets, rankings, and signals | Starter and up |

Longer guides ship inside the skills: [token research](skills/dydt-token-check/references/token-research.md), [smart money brief](skills/dydt-smart-money/references/smart-money-brief.md), [wallet review](skills/dydt-wallet/references/wallet-review.md).

## Example prompts

```
Is DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263 safe? Give me the red flags.
Find the real WIF token, not a copycat, and show its holders.
What is trending on Solana in the last hour with more than $50k liquidity?
Which tokens are about to graduate from pump.fun?
How has wallet <address> done over the last 30 days? Is it one lucky trade?
What does wallet <address> hold right now, and what is it up or down?
Who created <token>, and what happened to their other launches?
What are KOLs buying in the last 24 hours? Group by token.
Write me a morning brief of the Solana memecoin market.
Watch pool <pool> for the next 5 minutes and tell me about any sell over $5k.
```

## CLI reference

Every command prints the response `data` as pretty JSON. Add `--raw` for one line per result, which is easier to pipe into `jq`. Paged commands print the next `--cursor` on stderr. Run `dydt list` for every command and `dydt help <command>` for its options. Field names are snake_case: addresses end in `_address`, times in `_at` (Unix milliseconds), shares in `_pct` (0 to 100).

### Tokens

```bash
dydt search-tokens --q bonk --limit 10              # name, symbol, or address to candidates
dydt search-tokens --q BONK --match exact           # exact symbol only
dydt token <token_address>                          # metadata, supply, authorities, socials
dydt tokens --token_addresses <a>,<b>               # up to 50 tokens in one call
dydt token-holder-stats <token_address>             # insiders, fresh wallets, creator history
dydt token-holders <token_address> --limit 20       # largest holders with supply share and labels
dydt token-traders <token_address> --window 7d      # wallets ranked by PnL on a token
dydt token-bonding-curve <token_address>            # launchpad curve state
dydt wallet-created-tokens <creator_address>        # every token a creator launched
```

### Pools and prices

```bash
dydt pools --base_address <token_address>           # every pool for a token
dydt pools --base_address <token> --quote_address <quote>   # pools for one exact pair
dydt pools --limit 20                               # newest pools across every venue
dydt pool <pool_address>                            # one pool, with migration links
dydt pool-metrics <pool_address>                    # all-time totals plus volume, trades, traders per window
dydt pools-metrics --pool_addresses <a>,<b>         # the same for up to 50 pools
dydt pool-candles <pool_address> --limit 96 --interval 15m --currency usd
dydt sol-price                                      # SOL price in USD
```

### Trades and rankings

```bash
dydt trades --token_address <token> --limit 20      # latest trades for a token
dydt trades --pool_address <pool> --min_amount_usd 1000   # filtered trades, last 30 days
dydt token-ranking popular --window 1h --limit 20         # also new_pair, top_gainers, almost_bonded, migrated, stocks
dydt token-ranking new_pair --window 5m --min_liquidity_usd 20000 --max_top10_pct 40
```

### Wallets

```bash
dydt wallet-stats <address> --window 30d            # stats over 1h, 24h, 3d, 7d, or 30d
dydt wallet-holdings <address>                      # open positions with unrealized PnL
dydt wallet-trades <address> --type sell --outcome win
dydt wallet-daily-pnl <address> --month 2026-09
dydt wallet-leaderboard --window 24h --sort realized_pnl --exclude_bots true
```

Example: `dydt wallet-stats 4G9JAzftaydKjB2558MLnkYw175KMN6NGGgyxkeRuwwA --window 24h`

```json
{
  "wallet_address": "4G9JAzftaydKjB2558MLnkYw175KMN6NGGgyxkeRuwwA",
  "buy_count": 40,
  "sell_count": 21,
  "realized_pnl_sol": 3485.91,
  "realized_pnl_usd": 411988.85,
  "win_rate_pct": 90.5,
  "volume_usd": 1560608.17,
  "balance_sol": 0.0185,
  "balance_usd": 2.21,
  "labels": []
}
```

(Trimmed; the full response also has fees, cost basis, streaks, best and worst day, and a PnL series.)

### KOLs and signals (Pro and Scale)

```bash
dydt wallet-activity --label kol --type buy --min_amount_usd 100   # what KOLs are buying, newest first
dydt wallets --label kol --limit 100                      # KOL wallets with names and avatars
dydt wallet-leaderboard --scope kol --window 7d                # KOLs ranked by PnL
dydt wallet-signals --limit 20                      # best closed trades by tracked wallets
dydt token-signals --limit 20                       # dydt token signals
dydt token-signal-history <token_address>                      # every signal on one token
```

### Live streams (Starter and up)

`dydt watch` prints one JSON event per line (`{"stream", "data"}`) and **always stops**, after `--seconds` (default 60, up to 3600) or `--max-events` (default 50).

```bash
dydt watch                                          # list streams
dydt help watch trades                              # options for one stream
dydt watch trades --pool_address <pool> --max-events 20
dydt watch candles --pool_address <pool> --interval 1m --seconds 120
dydt watch wallet_activity --wallet_addresses <w1>,<w2> --seconds 600
dydt watch rankings --feed new_pair --window 5m
dydt watch token_signals --seconds 900              # Pro and Scale
```

| Stream | Needs | What arrives |
|---|---|---|
| `trades` | `--pool_address` | Every buy and sell on a pool |
| `candles` | `--pool_address` | Candle updates |
| `pool_metrics` | `--pool_addresses` | Live volume, traders, price change |
| `rankings` | `--feed --window` | Ranked feed changes |
| `wallet_activity` | `--wallet_addresses` | Trades and positions of chosen wallets |
| `token_metadata` | none | Token metadata changes |
| `wallet_signals`, `token_signals`, `markers`, `chart_lines`, `x_posts` | see `dydt help watch <stream>` | Pro and Scale streams |

### Setup and maintenance

```bash
dydt config                  # show key status and how to get one
dydt config set <api-key>    # save to ~/.config/dydt/.env (mode 600)
dydt config check            # exit 0 when a key is configured
dydt spec refresh            # reload commands and streams from dydt.ai now
dydt --version
```

## Output and errors

| Case | Output | Exit code |
|---|---|---|
| Success | The response `data` as JSON; the next `--cursor` on stderr when there are more rows | 0 |
| API error | `{"error": {"http", "code", "error", "message", "retry_after_seconds"?}}` | 1 |
| Invalid command or option, caught before sending | `{"error": {"message"}}` | 2 |

Common codes: `4010`/`4013` missing or invalid key · `4033` needs a higher plan · `4290` rate limited · `4291` monthly quota used · `4292` too many requests in flight · stream close `4402` streams need a paid plan · `4429` stream allowance or connection limit reached. The `dydt-setup` skill explains what to do for each.

## Plans

| | Free | Starter | Pro | Scale |
|---|---|---|---|---|
| REST commands | Yes | Yes | Yes | Yes |
| Live streams (`dydt watch`) | No | Yes | Yes | Yes |
| Signals, KOL trades, labeled wallets, KOL leaderboard, wallet signals | No | No | Yes | Yes |

Rate limits, monthly quotas, and prices are on the [pricing page](https://dydt.ai/developers/billing). Pay in USDC or SOL.

## Configuration

| Variable | Purpose |
|---|---|
| `DYDT_API_KEY` | API key. Overrides `~/.config/dydt/.env`. |
| `DYDT_API_BASE` | Alternate REST base. Only `https://*.dydt.ai` or localhost are accepted. |
| `DYDT_WS_URL` | Alternate stream URL. Only `wss://*.dydt.ai` or localhost are accepted. |
| `XDG_CONFIG_HOME`, `XDG_CACHE_HOME` | Where the key and the cached specs are stored. |

## Safety

- **Read-only.** There is no trade, transfer, or signing command, and no wallet key is ever asked for.
- **Pinned hosts.** Requests go only to `data.dydt.ai`. The overrides above refuse any other host.
- **Prompt-injection guard.** Token names, descriptions, and links are written by whoever launched the token. The CLI removes hidden and bidirectional characters, replaces instruction-like text with `[filtered]`, and prints a notice on stderr. The skills tell agents to treat all response text as data and to report `[filtered]` as a red flag.
- **Key handling.** The key is stored with mode 600 and sent only as a bearer token to dydt.
- **Current spec.** Commands come from `https://dydt.ai/openapi.json` and streams from `https://dydt.ai/asyncapi.json`, cached for 24 hours, with bundled copies as a fallback.

**Disclaimer.** dydt reports what happened on chain and what dydt's classifiers observed. Labels and signals can be wrong. Nothing here is financial advice, and the skills instruct agents not to give buy or sell recommendations.

## Troubleshooting

| Problem | Fix |
|---|---|
| `dydt: command not found` | `npm install -g dydt-cli`, and check `node --version` is 22.4 or newer |
| `No API key` | `dydt config set <key>`, or set `DYDT_API_KEY` |
| A command is not listed | `dydt spec refresh`, then `npm install -g dydt-cli@latest` |
| HTTP 403, code 4033 | The command needs Pro or Scale |
| Stream closes with 4402 | Streams need Starter or higher; use REST commands instead |
| Your agent scrapes dydt.ai instead of using the CLI | Add to your prompt: *"Use the dydt CLI; do not fetch dydt.ai pages."* |

## Upgrade

```bash
npm install -g dydt-cli@latest
npx skills add dydtai/dydt-skills        # re-run to update the skills
```

## Develop

```bash
git clone https://github.com/dydtai/dydt-skills && cd dydt-skills
npm install
npm test           # builds, then runs the CLI and skill consistency tests
npm run sync-spec  # refresh spec/openapi.json and spec/asyncapi.json from dydt.ai
npm run sync-rules # copy scripts/shared-rules.md into every skill
```

The tests fail if any skill, reference, or this README names a command, stream, or option the specs do not have; if a skill links outside its own folder; if a skill's shared rules are out of date; or if an API operation is not used by any skill.

## License

MIT
