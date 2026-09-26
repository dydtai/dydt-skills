# Workflow: research one token

Use when the user wants a full picture of a token, not a single number. Skills involved: `dydt-token`, `dydt-token-check`, `dydt-market`, `dydt-dev-check`, and `dydt-signals` on Pro.

1. **Resolve.** Address given: use it. Name given: `dydt search-tokens --q <name> --limit 10`, confirm the token with the user when more than one fits.
2. **Collect in parallel.**
   - `dydt token <token_address>`
   - `dydt token-holder-stats <token_address>`
   - `dydt pools --base_address <token_address>`, then choose the pool with the highest `liquidity_usd`
3. **Then, with the pool:**
   - `dydt pool-metrics <pool_address>`
   - `dydt pool-candles <pool_address> --limit 96 --interval 15m --currency usd`
   - `dydt token-traders <token_address> --window 7d`
4. **Creator:** read the creator from `dydt pool <pool_address>` (`base_token.creator_address`) and run `dydt wallet-created-tokens <creator_address>`.
5. **Signals (Pro and Scale):** `dydt token-signal-history <token_address>`. Skip quietly on a 4033.
6. **Write it up:**
   - One-line identity: symbol, token address, age, venue, pool.
   - Market: market cap, liquidity, 1h and 24h volume and price change, distinct traders.
   - Risk findings, as in `dydt-token-check`, red first.
   - Holders and creator record.
   - Who is trading it: top traders, any labeled wallets among them.
   - Data time. No buy or sell call.
