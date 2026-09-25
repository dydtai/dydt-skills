---
name: dydt-smart-money
description: Follow labeled Solana wallets on dydt - what KOLs, smart money, and VCs are buying and selling right now with realised PnL, the full lists of labeled wallets (KOL, smart, VC, dev team, bot, rat trader), the KOL leaderboard, and closed-trade signals from tracked wallets. Use when the user asks what KOLs or smart money are buying, which tokens several KOLs entered, who a KOL is, or wants the best recent trades by tracked wallets. Pro and Scale plans.
---

# dydt-smart-money

Read the rules in `AGENTS.md` first. Every command here needs the **Pro or Scale** plan. On a 403 with code 4033, tell the user their plan does not include it and point to https://dydt.ai/developers/billing; do not retry.

## Commands

| Command | Use it for |
|---|---|
| `dydt labeled-trades --label <kol|smart|vc>` | Trades by labeled wallets, newest first. Default window 24h; `--start_time` up to 7 days back. Filter by `--side buy`, `--base_mint`, `--min_amount_usd`. |
| `dydt labeled-wallets --label <label>` | Every wallet with a label, with public name and avatar for KOLs. Paged. |
| `dydt leaderboard --scope kols --minutes <window> --order_by realised_pnl` | KOLs ranked by results. |
| `dydt wallet-signals` | Closed positions by tracked wallets that beat the feed floor, best first, with trader stats. |

## Steps for "what are KOLs buying"

1. `dydt labeled-trades --label kol --side buy --limit 100` (add `--min_amount_usd 100` to drop dust).
2. Group by `base_mint`: count distinct `wallet`s and sum `amount_usd`. Several distinct KOLs in the same token is the interesting part; one KOL buying repeatedly is one opinion.
3. For the top few tokens, run `dydt token <mint>` and hand risk questions to `dydt-token-check`.
4. Report each token with the KOL names (`labels[].metadata.name`), how many bought, total size, and time of the latest buy.

## Reading the data

- Each labeled trade carries `wallet` and `labels`, then the same fields as `wallet-trades`: `trade_type`, `amount_usd`, `market_cap_usd` at the trade, and realised PnL on sells.
- Labels are dydt's classification and refresh every minute; they can be wrong, and wallets can change hands. Present them as labels, not facts about people.
- Not every label has wallets yet. `kol` is the main one. If `dydt labeled-wallets --label <label>` shows `total: 0`, tell the user dydt has no wallets under that label yet. Do not report that as "no activity".
- A KOL buying is not a reason to buy: KOLs often sell into their followers. Always mention sells by the same wallets in the same token when you see them.
- `wallet-signals` items include `multiple` (proceeds over cost), `hold_seconds`, and `trader_stats` (win rate, behaviour, labels). They describe trades that already closed.
