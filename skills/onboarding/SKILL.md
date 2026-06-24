---
name: onboarding
description: Guided setup entry point for pi-duckdb. Runs the setup steps in order — install the DuckDB CLI, optionally connect MotherDuck, apply local dev defaults, set up scheduled backups, and (optional) protect the database file. Use when a user first installs pi-duckdb or asks to "set up DuckDB".
---

# pi-duckdb onboarding

Walk the user through setup. Run each step in order. Each step is its own skill —
delegate to it, then come back. Always ask before changing the system; never run an
installer or write files silently. Skip any step the user declines.

## Step 1 — Install the DuckDB CLI (required)
Run the `install-duckdb-cli` skill. Confirm `duckdb -c "SELECT version();"` works
before continuing.

## Step 2 — MotherDuck (optional)
Ask: **"Connect MotherDuck (cloud DuckDB)?"** If yes, run `setup-motherduck`.
If no, local DuckDB is fine.

## Step 3 — Local dev defaults (optional)
Ask: **"Apply DuckDB defaults for this project (init SQL, common extensions, handy
commands)?"** If yes, run `init-duckdb-project`.

## Step 4 — Scheduled backups (optional, recommended for local databases)
Ask: **"Set up scheduled backups of your local database?"** If yes, run
`setup-backups`. Note: MotherDuck-hosted data has managed durability, so backups
mainly matter for local `.duckdb` files.

## Step 5 — Protect the database file (optional, opt-in — NOT default)
Ask: **"Want to harden your database file against accidental deletion (store it
outside the project dir, gitignore it, optionally symlink)?"** If yes, run
`protect-db-file`. Only do this when the user opts in.

## Final — Summary
Report what was set up: DuckDB version, MotherDuck status, init file path, backup
schedule + location, and whether file protection was applied. List the skills now
available (this package's plus the bundled DuckDB and MotherDuck skills).
