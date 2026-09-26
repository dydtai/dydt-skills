# Workflow: smart money brief

Use for "what are KOLs and smart money doing", a morning brief, or a scheduled summary. Needs the Pro or Scale plan; on a 4033, fall back to step 4 only and say which parts need a higher plan.

1. **KOL buys:** `dydt wallet-activity --label kol --type buy --limit 100 --min_amount_usd 100`. Add the same for `smart` or `vc` only when `dydt wallets --label <label> --limit 1` returns at least one wallet.
2. **Group by token.** For each `token_address`: distinct wallets, total `amount_usd`, earliest and latest buy, market cap at the first buy (`market_cap_usd`). Rank by distinct wallets, then total size.
3. **Check for exits.** `dydt wallet-activity --label kol --type sell --limit 100` and note tokens from step 2 where the same wallets are already selling.
4. **Context:** `dydt token-ranking popular --window 1h --limit 20` to show what the wider market is trading.
5. **For the top three tokens:** `dydt token <token_address>` and the red checks from `dydt-token-check` (authorities, top 10 share, creator share, liquidity).
6. **Write it up:** a short list of tokens with who bought (KOL names from `labels[].name`), how much, when, current market cap versus entry, exits seen, and red flags. Close with the data time. Present it as activity, not recommendations.
