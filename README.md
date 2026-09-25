# dydt skills

Solana market and wallet data from [dydt](https://dydt.ai) for AI agents. It has two parts:

- **`dydt` CLI.** One command per [Data API](https://dydt.ai/developers) endpoint, plus `dydt watch` for live streams, with parameters validated locally against the live API specs. Needs Node 22.4 or newer.
- **Agent skills.** They tell Claude Code, Codex, Cursor, and other agents which command answers which question, and how to read the results correctly.

Everything is read-only. Nothing here holds wallet keys, signs transactions, or trades.

## Install

```bash
npm install -g dydt-cli
npx skills add dydtai/dydt-skills
```

Claude Code can also load it as a plugin: `/plugin marketplace add dydtai/dydt-skills`, then `/plugin install dydt@dydt`.

## Get a key

1. Sign in at [dydt.ai/developers/keys](https://dydt.ai/developers/keys) and create a key. The Free plan works for everything except the Pro-only commands below.
2. Save it:

```bash
dydt config set <your-api-key>
```

The key goes to `~/.config/dydt/.env`, readable only by you. `DYDT_API_KEY` in the environment takes precedence over the file.

## Use it

Ask your agent in plain language:

```
What does this token look like? <mint>
Run a rug check on <mint>
What are KOLs buying in the last 24 hours?
How has wallet <address> done over the last 30 days?
Show me tokens about to graduate from pump.fun with over $20k liquidity
Who created <mint> and what happened to their other launches?
```

Or call the CLI directly:

```bash
dydt list                                   # every command, grouped
dydt help wallet                            # parameters for one command
dydt search --q bonk --limit 5
dydt wallet <address> --minutes 43200
dydt labeled-trades --label kol --side buy  # Pro and Scale
dydt watch                                  # list live streams
dydt watch trades --poolId <pool> --max-events 20
```

Output is the response `data` as JSON (`--raw` for one line). `dydt watch` prints one JSON event per line and always stops, after `--seconds` (default 60) or `--max-events` (default 50). Errors print `{"error": {...}}` and exit non-zero.

## Skills

| Skill | Covers |
|---|---|
| `dydt-setup` | Install, API key, plan features, fixing errors |
| `dydt-brief` | Market brief: trending, movers, launches, KOL buys, signals, red flags |
| `dydt-token` | Name to mint, metadata, authorities, holders, pools, bonding curve |
| `dydt-token-check` | A risk read as findings that each cite a field; no scores, no advice |
| `dydt-market` | Candles, pool metrics, trades, top traders, SOL price |
| `dydt-discover` | New, popular, gaining, almost-bonded, migrated, and stock feeds |
| `dydt-wallet` | Wallet PnL, positions, trades, daily PnL, leaderboard |
| `dydt-smart-money` | KOL trades, labeled wallet lists, KOL leaderboard, wallet signals (Pro) |
| `dydt-signals` | dydt token signals and per-token history (Pro) |
| `dydt-dev-check` | A creator's launch record |
| `dydt-watch` | Bounded live monitoring: pool trades, prices, wallets, rankings, signals (paid plans) |

Multi-step guides ship inside the skills: [token research](skills/dydt-token-check/references/token-research.md), [smart money brief](skills/dydt-smart-money/references/smart-money-brief.md), [wallet review](skills/dydt-wallet/references/wallet-review.md).

## Plans

Free, Starter, Pro, and Scale; see [pricing](https://dydt.ai/developers/billing). Signals, labeled wallet lists, labeled trades, the KOL leaderboard, and wallet signals need Pro or Scale. Everything else works on every plan, within that plan's rate limits and monthly quota.

## Safety

- **Read-only by design.** There is no trade, transfer, or signing command.
- **Pinned host.** Requests go only to `data.dydt.ai`. `DYDT_API_BASE` and `DYDT_WS_URL` accept other `dydt.ai` hosts over https or wss, or localhost, and nothing else.
- **Prompt-injection guard.** Token names, descriptions, and links are written by whoever launched the token. The CLI strips hidden characters, replaces instruction-like text with `[filtered]`, and warns on stderr. The skills tell agents to treat all response text as data.
- **Current spec.** Commands come from `https://dydt.ai/openapi.json` and streams from `https://dydt.ai/asyncapi.json`, cached for 24 hours, with bundled copies as a fallback. `dydt spec refresh` updates both now.

## Develop

```bash
npm install
npm test          # builds, then runs the CLI and skill consistency tests
npm run sync-spec  # refresh spec/openapi.json and spec/asyncapi.json from dydt.ai
npm run sync-rules # copy scripts/shared-rules.md into every skill
```

The skill tests fail if any skill, reference, or this README names a command, stream, or option the specs do not have; if a skill links outside its own folder; if a skill's shared rules are out of date; or if an API operation is not used by any skill.

MIT licensed.
