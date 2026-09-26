<div align="center">

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/banner.png" alt="dydt CLI and agent skills for Solana market data" width="1280">

# dydt CLI and agent skills

**Ask your AI agent about any Solana token or wallet, and get answers from live on-chain data.**

[![npm](https://img.shields.io/npm/v/dydt-cli?color=16a34a)](https://www.npmjs.com/package/dydt-cli)
[![node](https://img.shields.io/node/v/dydt-cli)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/dydt-cli)](LICENSE)

[Setup guide](https://dydt.ai/developers/agents) · [Get a free API key](https://dydt.ai/developers/keys) · [API docs](https://dydt.ai/developers) · [Pricing](https://dydt.ai/developers/billing)

</div>

---

## What it does

You ask your AI agent a question in plain words, such as *"Is this token safe?"* or *"What are KOLs buying today?"*. The agent runs the `dydt` command to fetch live data from dydt, then explains what it found.

It is **read-only**: it cannot trade, move funds, or touch your wallet.

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/how-it-works.png" alt="How it works: your agent uses the dydt skills to pick a dydt command, and the command reads the dydt Data API" width="1280">

## What you need

- **An AI coding agent:** Claude Code, Cursor, Codex, Windsurf, Gemini CLI, GitHub Copilot, Cline, or OpenCode. Chat websites such as claude.ai cannot run commands, so they cannot use dydt.
- **Node.js 22.4 or newer:** check with `node --version`. If it is missing or older, install the LTS version from [nodejs.org](https://nodejs.org).
- **A free dydt API key:** create one at [dydt.ai/developers/keys](https://dydt.ai/developers/keys). No payment needed.

## Set it up in 4 steps

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/setup.png" alt="Setup in four steps: install dydt-cli, add the skills, save your API key, run dydt sol-price to check" width="1280">

Run these in your terminal (Terminal on macOS, PowerShell on Windows, or the terminal panel in Cursor or VS Code).

**1. Install the `dydt` command**

```bash
npm install -g dydt-cli
```

**2. Add the dydt skills to your agent**

```bash
npx skills add dydtai/dydt-skills -g
```

Pick your agent from the list when asked. Skills are short instruction files that tell your agent which `dydt` command answers which question.

**3. Save your API key**

```bash
dydt config set <your-api-key>
```

The key is saved on your computer only.

**4. Check that it works**

```bash
dydt sol-price
```

You should see something like `{"price_usd": 121.13}`. Restart your agent and ask your first question.

> **Prefer to let your agent do it?** Paste this into your agent:
> *"Set up dydt for me from https://github.com/dydtai/dydt-skills: install the dydt-cli npm package, install the dydt skills globally with npx skills add dydtai/dydt-skills -g, ask me for my API key and save it with dydt config set, then show me the SOL price to confirm it works."*

## Things to ask

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/ask.png" alt="You ask whether a token is safe; the agent runs the dydt-token-check commands; you get findings marked red, caution, unknown, or ok" width="1280">

```
Is <token address> safe? Give me the red flags.
Find the real WIF token, not a copycat, and show its top holders.
What is trending on Solana in the last hour with more than $50k liquidity?
Which pump.fun tokens are about to graduate?
How has wallet <address> done over the last 30 days? Was it one lucky trade?
Who created <token address>, and what happened to their other launches?
What are KOLs buying in the last 24 hours? Group it by token.
Write me a morning brief of the Solana memecoin market.
```

Copy a token or wallet address from its page on [dydt.ai](https://dydt.ai). If your agent answers without using dydt, start your question with *"Using dydt, …"*.

## What your agent can look up

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/skills.png" alt="The 11 dydt skills grouped by what they look up, with the plan each needs" width="1280">

| Skill | Ask about | Plan |
|---|---|---|
| `dydt-token` | A token's details, supply, holders, pools, and launch curve | Free |
| `dydt-token-check` | Red flags on a token, each backed by the data it came from | Free |
| `dydt-dev-check` | Who launched a token and how their other launches went | Free |
| `dydt-market` | Charts, prices, trades, and top traders | Free |
| `dydt-discover` | New, trending, gaining, and about-to-graduate tokens | Free |
| `dydt-wallet` | Any wallet's profit and loss, holdings, and trades | Free |
| `dydt-brief` | A market summary | Free; KOL and signal parts need Pro |
| `dydt-setup` | Installing, saving the key, plans, and fixing errors | Free |
| `dydt-watch` | Watching a token or wallet live for a few minutes | Starter and up |
| `dydt-smart-money` | What KOLs and labeled wallets are buying and selling | Pro and Scale |
| `dydt-signals` | dydt token signals | Pro and Scale |

## Plans

| | Free | Starter | Pro | Scale |
|---|---|---|---|---|
| Tokens, pools, trades, wallets, discovery | ✓ | ✓ | ✓ | ✓ |
| Live monitoring (`dydt watch`) | | ✓ | ✓ | ✓ |
| KOL trades, labeled wallets, signals | | | ✓ | ✓ |

Start on Free. If you ask for something your plan does not include, your agent tells you which plan does. Limits and prices are on the [pricing page](https://dydt.ai/developers/billing); pay in USDC or SOL.

## Safety

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/safety.png" alt="Your key and the dydt command stay on your computer, requests go only to data.dydt.ai, and your wallet, seed phrase, and signing are never involved" width="1280">

- **Read-only.** There is no command that trades, transfers, or signs. dydt never asks for a seed phrase or private key; anyone who does is trying to steal from you.
- **Your key stays with you.** It is stored on your computer (file mode 600) and sent only to dydt.
- **Pinned hosts.** Requests go only to `data.dydt.ai`.
- **Protected from tricks in token names.** Anyone can write a token's name and description. The CLI strips hidden characters and replaces instruction-like text with `[filtered]` before your agent reads it.
- **Not financial advice.** Answers report what dydt observed on chain. Labels and signals can be wrong, and memecoins are high risk.

## If something goes wrong

| Problem | Fix |
|---|---|
| `dydt: command not found` | Run step 1 again, then open a new terminal. Check `node --version` shows 22.4 or newer. |
| `No API key` | Run `dydt config set <your-api-key>` with a key from [dydt.ai/developers/keys](https://dydt.ai/developers/keys). |
| HTTP 401 | The key is mistyped or was deleted. Create a new one and save it again. |
| HTTP 403 or code 4033 | Your plan does not include that data. Your agent says which plan does. |
| HTTP 429 | Too many requests, or the monthly allowance is used up. Wait a minute or upgrade. |
| Stream closes with 4402 | Live monitoring needs Starter or higher. |
| The agent answers without dydt | Restart the agent after step 2, and start your question with *"Using dydt, …"*. |

## Update

```bash
npm install -g dydt-cli@latest
npx skills add dydtai/dydt-skills -g
```

---

## For developers

The `dydt` command works on its own too, in scripts or your terminal. There is one command for every [dydt Data API](https://dydt.ai/developers) endpoint, plus `dydt watch` for live streams. Commands and options come from the live API spec and are checked before any request is sent.

<img src="https://raw.githubusercontent.com/dydtai/dydt-skills/main/static/commands.png" alt="Output of dydt list: every command grouped by tokens, pools, trades, rankings, signals, wallets, and market" width="1280">

### Install the skills for one agent

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

Add `-g` to install for every project instead of only the current folder.

### Setup steps for AI agents

If you are an agent setting this up for a user, do this:

1. Run `dydt --version`. If the command is missing, run `npm install -g dydt-cli`.
2. Run `dydt config check`. Exit code 0 means a key is already configured; you are done.
3. Otherwise tell the user: *"Create a free API key at https://dydt.ai/developers/keys and paste it here."* Wait for the key.
4. Run `dydt config set <key>`, then `dydt sol-price` to confirm.
5. Never print the full key back, and never write it into project files or commits.

### Commands

Every command prints the response `data` as pretty JSON. Add `--raw` for one line per result, which is easier to pipe into `jq`. Paged commands print the next `--cursor` on stderr. Run `dydt list` for every command and `dydt help <command>` for its options. Field names are snake_case: addresses end in `_address`, times in `_at` (Unix milliseconds), shares in `_pct` (0 to 100).

#### Tokens

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

#### Pools and prices

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

#### Trades and rankings

```bash
dydt trades --token_address <token> --limit 20      # latest trades for a token
dydt trades --pool_address <pool> --min_amount_usd 1000   # filtered trades, last 30 days
dydt token-ranking popular --window 1h --limit 20         # also new_pair, top_gainers, almost_bonded, migrated, stocks
dydt token-ranking new_pair --window 5m --min_liquidity_usd 20000 --max_top10_pct 40
```

#### Wallets

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

#### KOLs and signals (Pro and Scale)

```bash
dydt wallet-activity --label kol --type buy --min_amount_usd 100   # what KOLs are buying, newest first
dydt wallets --label kol --limit 100                      # KOL wallets with names and avatars
dydt wallet-leaderboard --scope kol --window 7d                # KOLs ranked by PnL
dydt wallet-signals --limit 20                      # best closed trades by tracked wallets
dydt token-signals --limit 20                       # dydt token signals
dydt token-signal-history <token_address>                      # every signal on one token
```

#### Live streams (Starter and up)

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

#### Setup and maintenance

```bash
dydt config                  # show key status and how to get one
dydt config set <api-key>    # save to ~/.config/dydt/.env (mode 600)
dydt config check            # exit 0 when a key is configured
dydt spec refresh            # reload commands and streams from dydt.ai now
dydt --version
```

### Output and errors

| Case | Output | Exit code |
|---|---|---|
| Success | The response `data` as JSON; the next `--cursor` on stderr when there are more rows | 0 |
| API error | `{"error": {"http", "code", "error", "message", "retry_after_seconds"?}}` | 1 |
| Invalid command or option, caught before sending | `{"error": {"message"}}` | 2 |

Common codes: `4010`/`4013` missing or invalid key · `4033` needs a higher plan · `4290` rate limited · `4291` monthly quota used · `4292` too many requests in flight · stream close `4402` streams need a paid plan · `4429` stream allowance or connection limit reached. The `dydt-setup` skill explains what to do for each.

### Environment variables

| Variable | Purpose |
|---|---|
| `DYDT_API_KEY` | API key. Overrides `~/.config/dydt/.env`. |
| `DYDT_API_BASE` | Alternate REST base. Only `https://*.dydt.ai` or localhost are accepted. |
| `DYDT_WS_URL` | Alternate stream URL. Only `wss://*.dydt.ai` or localhost are accepted. |
| `XDG_CONFIG_HOME`, `XDG_CACHE_HOME` | Where the key and the cached specs are stored. |

### Work on this repository

```bash
git clone https://github.com/dydtai/dydt-skills && cd dydt-skills
npm install
npm test           # builds, then runs the CLI and skill consistency tests
npm run sync-spec  # refresh spec/openapi.json and spec/asyncapi.json from dydt.ai
npm run sync-rules # copy scripts/shared-rules.md into every skill
```

The README images are rendered from `static/source/*.html` at 2x. Update the HTML when commands change, then re-render the matching PNG in `static/`.

The tests fail if any skill, reference, or this README names a command, stream, or option the specs do not have; if a skill links outside its own folder; if a skill's shared rules are out of date; or if an API operation is not used by any skill.

## License

MIT
