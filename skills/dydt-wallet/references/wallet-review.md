# Workflow: review a wallet

Use when the user wants to know whether a wallet trades well, or what it is doing. Skill: `dydt-wallet`.

1. **Record, in parallel:**
   - `dydt wallet <address> --minutes 43200` (30 days)
   - `dydt wallet <address> --minutes 10080` (7 days)
   - `dydt wallet-trades <address> --limit 200`
2. **Position now:** `dydt wallet-holdings <address>`.
3. **Consistency:** `dydt wallet-pnl-daily <address> --year <y> --month <m>` for the current month; count profitable against losing days.
4. **Judge the record, in writing:**
   - Realised PnL and number of sells: a large PnL from few sells is luck until shown otherwise.
   - Share of gross profit from the single largest win (`insights.largest_win_usd` / `insights.gross_profit_usd`).
   - Win rate (a fraction) against average win and average loss size.
   - Hold times and trade counts: bot-like patterns.
   - Labels, if any.
   - Unrealised PnL only as a footnote: dead positions distort it.
5. **Answer:** the record in numbers, the main caveat, and the data time. No advice to copy the wallet.
