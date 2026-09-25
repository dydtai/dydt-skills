# Workflow: smart money brief

Use for "what are KOLs and smart money doing", a morning brief, or a scheduled summary. Needs the Pro or Scale plan; on a 4033, fall back to step 4 only and say which parts need a higher plan.

1. **KOL buys:** `dydt labeled-trades --label kol --side buy --limit 100 --min_amount_usd 100`. Add the same for `--label smart` or `--label vc` only when `dydt labeled-wallets --label <label> --limit 1` shows a `total` above 0.
2. **Group by token.** For each `base_mint`: distinct wallets, total `amount_usd`, earliest and latest buy, market cap at the first buy (`market_cap_usd`). Rank by distinct wallets, then total size.
3. **Check for exits.** `dydt labeled-trades --label kol --side sell --limit 100` and note tokens from step 2 where the same wallets are already selling.
4. **Context:** `dydt ranking popular --timeframe 1h --limit 20` to show what the wider market is trading.
5. **For the top three tokens:** `dydt token <mint>` and the red checks from `dydt-token-check` (authorities, top 10 share, developer share, liquidity).
6. **Write it up:** a short list of tokens with who bought (KOL names from `labels[].metadata.name`), how much, when, current market cap versus entry, exits seen, and red flags. Close with the data time. Present it as activity, not recommendations.
