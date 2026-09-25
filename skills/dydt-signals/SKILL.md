---
name: dydt-signals
description: Read dydt token signals for Solana - alerts raised when groups of tiered wallets buy the same token or when buying accelerates, with tier counts, cohort size, market cap and liquidity at alert, peak since, and caveats - and the signal history for one token. Use when the user asks for dydt signals, what just triggered, whether a token had a signal, or how past signals on a token played out. Pro and Scale plans.
---

# dydt-signals

Read the rules in `AGENTS.md` first. Both commands need the **Pro or Scale** plan; on a 403 with code 4033, say so and stop.

## Commands

| Command | Use it for |
|---|---|
| `dydt signals` | Current signals, newest first. Filter with `--tiers`, `--kinds cohort,momentum`, `--minEntities`, `--minCohortBuyUsd`, `--minAlertLiquidityUsd`, `--maxAlertMcUsd`. Page with `--cursor`. |
| `dydt signal-history <mint>` | Every signal on one token, newest first. |

## Reading the data

- `tier` is the signal's quality tier (for example `qualified`, `high_conviction`). `signalKind` / `kinds` say which detector fired; `confluence` is true when more than one agreed.
- `entities` counts distinct buyer entities; `tierA`, `tierB`, `tierC` break them down by wallet tier. `cohortBuyUsd` is their combined buying.
- `alertMcUsd`, `alertLiquidityUsd`, `alertMakers` describe the moment of this alert; `firstAlert*` the first alert of the signal. `peakMcUsd` / `peakAt` is the highest market cap since. `detectionLagMs` is time from the triggering trade to the alert.
- `warnings` lists caveats such as `dev_share_unknown`. Always pass them on.
- `buyerBurst` compares unique buyers in the 10-second window to the 5-minute rate; 1 is normal.

## How to present signals

- A signal is an observation that certain wallets bought, not a prediction. Do not describe it as a buy call or quote win rates for signals.
- Report the peak since alert honestly: a peak after the alert was only reachable by selling at that peak.
- Pair any signal the user wants to act on with `dydt-token-check`.
