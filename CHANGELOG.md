# Changelog

## 0.3.0

Moves the CLI to version 1 of the dydt Data API. **Every command was renamed**, so update the CLI and the skills together:

```bash
npm install -g dydt-cli@latest
npx skills add dydtai/dydt-skills -g
```

### Renamed commands

| 0.2.x | 0.3.0 |
|---|---|
| `dydt search` | `dydt search-tokens --q <text>` |
| `dydt holders` | `dydt token-holders <token_address>` |
| `dydt bonding-curve` | `dydt token-bonding-curve <token_address>` |
| `dydt top-traders` | `dydt token-traders <token_address>` |
| `dydt signals` | `dydt token-signals` |
| `dydt signal-history` | `dydt token-signal-history <token_address>` |
| `dydt dev-tokens` | `dydt wallet-created-tokens <wallet_address>` |
| `dydt pools-token` | `dydt pools --base_address <token_address>` |
| `dydt pools-pair` | `dydt pools --base_address <token> --quote_address <quote>` |
| `dydt recent-pools` | `dydt pools` |
| `dydt candles` | `dydt pool-candles <pool_address>` |
| `dydt recent-trades` | `dydt trades` |
| `dydt ranking` | `dydt token-ranking <feed>` |
| `dydt market-price` | `dydt sol-price` |
| `dydt wallet` | `dydt wallet-stats <wallet_address>` |
| `dydt wallet-pnl-daily` | `dydt wallet-daily-pnl <wallet_address>` |
| `dydt leaderboard` | `dydt wallet-leaderboard` |
| `dydt labeled-wallets` | `dydt wallets --label <label>` |
| `dydt labeled-trades` | `dydt wallet-activity --label <label>` |

`token`, `pool`, `pool-metrics`, `trades`, `wallet-holdings`, `wallet-trades`, `wallet-signals`, and `watch` keep their names. Run `dydt list` for every command and `dydt help <command>` for its options.

### Other changes

- Every endpoint of the Data API now has a command, including `tokens` and `pools-metrics` for up to 50 addresses in one call.
- Options use the API's snake_case names, such as `--token_address` and `--min_liquidity_usd`.
- Commands print the response `data`. Paged commands print the next `--cursor` on stderr.
- Errors print `{"error": {"http", "code", "error", "message"}}`. Missing or invalid addresses are caught before any request, with a plain message.
- Stream names are snake_case: `pool_metrics`, `wallet_activity`, `token_signals`.
- The command list shows a short summary for each command.
