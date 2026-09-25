# dydt skills

Solana market and wallet data from [dydt](https://dydt.ai) for AI agents. It has two parts:

- **`dydt` CLI.** One command per [Data API](https://dydt.ai/developers) endpoint, with parameters validated locally against the live API spec.
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
```

Output is the response `data` as JSON (`--raw` for one line). Errors print `{"error": {...}}` and exit non-zero.

## Skills

| Skill | Covers |
|---|---|
| `dydt-token` | Name to mint, metadata, authorities, holders, pools, bonding curve |
| `dydt-token-check` | A risk read as findings that each cite a field; no scores, no advice |
| `dydt-market` | Candles, pool metrics, trades, top traders, SOL price |
| `dydt-discover` | New, popular, gaining, almost-bonded, migrated, and stock feeds |
| `dydt-wallet` | Wallet PnL, positions, trades, daily PnL, leaderboard |
| `dydt-smart-money` | KOL, smart-money, and VC trades; labeled wallet lists; wallet signals (Pro) |
| `dydt-signals` | dydt token signals and per-token history (Pro) |
| `dydt-dev-check` | A creator's launch record |

Multi-step guides: [token research](docs/workflows/token-research.md), [smart money brief](docs/workflows/smart-money-brief.md), [wallet review](docs/workflows/wallet-review.md).

## Plans

Free, Starter, Pro, and Scale; see [pricing](https://dydt.ai/developers/billing). Signals, labeled wallet lists, labeled trades, the KOL leaderboard, and wallet signals need Pro or Scale. Everything else works on every plan, within that plan's rate limits and monthly quota.

## Safety

- **Read-only by design.** There is no trade, transfer, or signing command.
- **Pinned host.** Requests go only to `data.dydt.ai`. `DYDT_API_BASE` accepts other `dydt.ai` hosts over https, or localhost, and nothing else.
- **Prompt-injection guard.** Token names, descriptions, and links are written by whoever launched the token. The CLI strips hidden characters, replaces instruction-like text with `[filtered]`, and warns on stderr. The skills tell agents to treat all response text as data.
- **Current spec.** Commands and parameters come from `https://dydt.ai/openapi.json`, cached for 24 hours, with a bundled copy as a fallback. `dydt spec refresh` updates it now.

## Develop

```bash
npm install
npm test          # builds, then runs the CLI and skill consistency tests
npm run sync-spec # refresh spec/openapi.json from dydt.ai
```

The skill test fails if any skill, workflow, or this README mentions a command or option that the API spec does not have.

MIT licensed.
