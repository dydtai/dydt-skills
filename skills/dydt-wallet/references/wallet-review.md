# Workflow: review a wallet

Use when the user wants to know whether a wallet trades well, or what it is doing. Skill: `dydt-wallet`.

1. **Record, in parallel:**
   - `dydt wallet-stats <address> --window 30d`
   - `dydt wallet-stats <address> --window 7d`
   - `dydt wallet-trades <address> --limit 200`
2. **Position now:** `dydt wallet-holdings <address>`.
3. **Consistency:** `dydt wallet-daily-pnl <address> --month <YYYY-MM>` for the current month; compare `profit_day_count` against `loss_day_count`.
4. **Judge the record, in writing:**
   - Realized PnL and number of sells: a large PnL from few sells is luck until shown otherwise.
   - Share of gross profit from the single largest win (`insights.largest_win_usd` / `insights.gross_profit_usd`).
   - Win rate (`win_rate_pct`) against average win and average loss size.
   - Hold times and trade counts: bot-like patterns.
   - Labels, if any.
   - Unrealized PnL only as a footnote: dead positions distort it.
5. **Answer:** the record in numbers, the main caveat, and the data time. No advice to copy the wallet.
