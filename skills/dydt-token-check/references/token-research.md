# Workflow: research one token

Use when the user wants a full picture of a token, not a single number. Skills involved: `dydt-token`, `dydt-token-check`, `dydt-market`, `dydt-dev-check`, and `dydt-signals` on Pro.

1. **Resolve.** Address given: use it. Name given: `dydt search --q <name> --limit 10`, confirm the mint with the user when more than one fits.
2. **Collect in parallel.**
   - `dydt token <mint>`
   - `dydt holders --base_mint <mint>`
   - `dydt pools-token <mint>`, then choose the pool with the highest `liqUsd`
3. **Then, with the pool:**
   - `dydt pool-metrics <pool>`
   - `dydt candles <pool> --limit 96 --granularity 15m --currency usd`
   - `dydt top-traders <mint> --timeRange 7d`
4. **Creator:** read the creator from `dydt pool <pool>` (`baseToken.devPubkey`) and run `dydt dev-tokens --dev_pubkey <creator>`.
5. **Signals (Pro and Scale):** `dydt signal-history <mint>`. Skip quietly on a 4033.
6. **Write it up:**
   - One-line identity: symbol, mint, age, venue, pool.
   - Market: market cap, liquidity, 1h and 24h volume and price change, distinct makers.
   - Risk findings, as in `dydt-token-check`, red first.
   - Holders and creator record.
   - Who is trading it: top traders, any labeled wallets among them.
   - Data time. No buy or sell call.
