---
name: dydt-dev-check
description: Review a Solana token creator's track record on dydt - every token the developer wallet launched, how far each got, whether they sold out of their own launches, and how many went to zero. Use when the user asks about a dev, a creator wallet, "has this dev rugged before", "is this a serial launcher", or wants the history behind a new launch.
---

# dydt-dev-check

Read the rules in `AGENTS.md` first. Run `dydt help dev-tokens` for parameters.

## Find the developer wallet

- From a token: `dydt pools-token <mint>` then `dydt pool <pool>` and read `baseToken.devPubkey`; or `dydt bonding-curve <mint>` and read `creator`.
- `dydt holders --base_mint <mint>` also gives `dev_launch_count` and `dev_dump_pct` directly.

## Gather

1. `dydt dev-tokens --dev_pubkey <wallet>`: the developer's launches, newest first, each as a ranking row with market cap, all-time-high market cap, liquidity, holders, and developer holding.
2. `dydt holders --base_mint <current mint>` for the summary figures.
3. Optionally `dydt wallet <wallet> --minutes 43200` for the creator's own trading results.

## What to report

- Number of launches and the time span. Many launches in a short time is a serial launcher.
- How many reached a meaningful all-time-high market cap versus how many never traded beyond launch.
- `dev_dump_pct`: share of past launches the creator sold out of (0 to 100). Null means too few launches could be judged; say that rather than calling it clean.
- Current developer holding on each live launch.

Present the record and let the user judge. A clean history does not make the next launch safe.
