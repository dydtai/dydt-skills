---
name: dydt-wallet
description: Analyze any Solana wallet on dydt - realised and unrealised PnL, win rate, volume, balance, streaks, open positions, trade history with per-sell PnL, day-by-day PnL, public labels such as KOL or smart money, and the wallet leaderboard. Use when the user pastes a wallet address, asks how a trader is doing, whether a wallet is worth following, what a wallet holds or recently traded, or who the top wallets are.
---

# dydt-wallet

Read the rules in `AGENTS.md` first. Run `dydt help <command>` for parameters.

## Commands

| Command | Use it for |
|---|---|
| `dydt wallet <address> --minutes <60|1440|4320|10080|43200>` | Stats for a window (1h, 24h, 3d, 7d, 30d): PnL, win rate, volume, fees, balance, streaks, best and worst day, cumulative PnL series, labels. |
| `dydt wallet-holdings <address>` | Open positions with cost, value now, and unrealised PnL, plus totals. |
| `dydt wallet-trades <address>` | Buys and sells, newest first; realised PnL on sells. Filter with `--side`, `--outcome`, `--base_mint`. Last 30 days. |
| `dydt wallet-pnl-daily <address> --year <y> --month <m>` | One UTC month day by day. The month must overlap the last 30 days. |
| `dydt leaderboard --minutes <window> --order_by realised_pnl --hide_bots true` | Top wallets. `--scope kols` needs Pro or Scale. |

## Steps for "is this wallet any good"

1. `dydt wallet <address> --minutes 43200` and `dydt wallet <address> --minutes 10080` in parallel: compare 30d and 7d.
2. `dydt wallet-trades <address> --limit 100`: check that profit is spread over many trades, not one lucky exit.
3. `dydt wallet-holdings <address>` when current exposure matters.
4. Report: realised PnL (SOL and USD), win rate, number of sells, largest win versus gross profit, average trade size, labels, and anything unusual.

## Reading the data

- `realised_pnl` is SOL; `realised_pnl_usd` is USD. `win_rate` is a fraction (0 to 1) of sells in profit.
- **Concentration:** if `insights.largest_win_*` is most of `insights.gross_profit_*`, the record rests on one trade. Say so.
- **Unrealised PnL is weak evidence.** Positions in dead tokens keep their cost basis and show large unrealised losses; tokens received by transfer have no cost basis (`untracked_amount` on trades). Lead with realised figures.
- Holdings return at most 200 positions; `truncated` tells you when there are more. `totals` always cover all of them.
- `labels` is usually empty. When present (`kol`, `smart`, `vc`, `dev_team`, `bot`, `mayhem_bot`, `agent_buyback`, `rat`) it is dydt's classification; `metadata.name` is the public handle for KOLs.
- High trade counts with tiny hold times and near-50% win rate often mean a bot. The leaderboard's `--hide_bots true` removes the obvious ones.
- Past results say nothing certain about future trades. Present the record, not a recommendation to copy it.
