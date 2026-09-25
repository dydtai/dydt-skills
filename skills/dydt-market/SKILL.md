---
name: dydt-market
description: Read Solana token market data from dydt - OHLCV and market-cap candles, pool metrics over 1m to 24h windows, live and historical trades, top traders for a token, and the SOL reference price. Use when the user asks for a chart, price or market-cap history, volume, buy and sell pressure, recent trades, who is making money on a token, or the SOL price.
---

# dydt-market

Read the rules in `AGENTS.md` first. Run `dydt help <command>` for parameters.

## Commands

| Command | Use it for |
|---|---|
| `dydt pools-token <mint>` | Find the pool to query; most commands here take a pool address. |
| `dydt candles <pool> --limit <n> ...` | Price or market-cap candles. `--limit` is required (at most 1000). |
| `dydt pool-metrics <pool>` | Volume, trades, makers, and price change per window, plus all-time `global` stats. |
| `dydt recent-trades --baseMint <mint>` | Latest trades for a token. |
| `dydt trades --pool_id <pool>` | Trade events with filters and a cursor for older pages (last 30 days). |
| `dydt top-traders <mint> --timeRange 7d` | Wallets ranked by PnL or volume on this token. |
| `dydt market-price` | SOL price in USD. |

## Reading the data

- **Pick the right pool.** Tokens migrate from a bonding curve to an AMM. After migration, the curve pool stops trading; use the pool with current liquidity. `dydt pool <pool>` shows `supersededBy` when a pool was replaced.
- **pool-metrics is compact.** `t` lists the windows (for example `["1m","5m","1h","6h","24h"]`) and every other array is indexed by `t`. Money values are `[quote, usd]` pairs. `pp` is price change %, `v`/`vb`/`vs` total/buy/sell volume, `tc`/`bc`/`sc` trade counts, `m`/`bm`/`sm` unique makers.
- **Candles** are oldest first; `window_start` is UTC without a zone suffix.
- **Rankings and some snapshots can show quote values as 0 while `usd` is set.** Use `usd`.
- **Trades:** `trade_type` is `buy` or `sell`; amounts in `base_amount` are whole tokens. History is limited to the last 30 days.
- Distinct makers matter more than trade count: one wallet can make hundreds of trades.

## Answer shape

Lead with the number the user asked for and its window and time. For charts, summarize trend, range, and volume instead of pasting raw candles unless the user wants the data.
