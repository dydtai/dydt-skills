---
name: dydt-discover
description: Find Solana tokens worth a look on dydt - new pairs, popular, top gainers, almost-bonded launchpad tokens, freshly migrated tokens, tokenized stocks, and newly created pools, over 5m to 24h windows with filters on market cap, liquidity, holders, and developer, sniper, and bundle share. Use when the user asks what is trending, what just launched, what is about to graduate, or wants a filtered token screen.
---

# dydt-discover

Read the rules in `AGENTS.md` first. Run `dydt help ranking` for the full filter list.

## Commands

| Command | Use it for |
|---|---|
| `dydt ranking <selector> --timeframe <5m|1h|6h|24h>` | Ranked feed. Selectors: `new_pair`, `popular`, `top_gainers`, `almost_bonded`, `migrated`, `stocks`. |
| `dydt recent-pools` | Newest pools, newest first. |

`ranking` supports server-side filters (market cap, liquidity, volume, holders, makers, developer/sniper/bundle share, and more) and sorting. Filter on the server rather than fetching everything and filtering yourself.

## Steps

1. Map the ask to a selector: "trending" = `popular`, "pumping" = `top_gainers`, "just launched" = `new_pair`, "about to bond" = `almost_bonded`, "just graduated" = `migrated`.
2. Apply the user's constraints as filters. If they gave none, keep the default and a modest `--limit`.
3. For the few tokens the user cares about, hand off to `dydt-token-check` rather than judging from the ranking row alone.

## Reading the data

- Rows are compact: see `dydt help ranking` and the response notes. Use `usd` values; quote values can be 0 in snapshots.
- `next_cursor` pages further; `updated_at` is when the feed was computed. Quote it.
- A ranking is what traded, not what is good. Say so when presenting a list, and point out rows with red flags visible in the row itself (high developer, sniper, or bundle share; thin liquidity).
