---
name: setup-motherduck
description: Onboarding step — ask whether the user wants to connect MotherDuck (cloud DuckDB), and if so, get an access token, store it in .env as MOTHERDUCK_TOKEN, and verify a `md:` connection. Use after installing the DuckDB CLI, or whenever the user wants to set up MotherDuck without MCP.
---

# Set up MotherDuck (optional)

MotherDuck is cloud DuckDB. It is reached over the normal `duckdb` CLI with a `md:`
connection string plus an access token — no MCP, no extra server.

## Step 1 — Ask the user

Ask plainly: **"Do you want to connect MotherDuck (cloud DuckDB) now?"**

- If **no**: stop here. Local DuckDB works without any token. Tell them they can run
  this skill later.
- If **yes**: continue.

## Step 2 — Get an access token

If `MOTHERDUCK_TOKEN` is already set in the environment or `.env`, skip to Step 4.

Otherwise direct the user to create one:
1. Sign in at https://app.motherduck.com
2. Settings -> Access Tokens -> create a token
3. Paste it back.

Never print the token in logs or echo it back in full.

## Step 3 — Store it in .env

Copy `.env.example` to `.env` if `.env` does not exist, then set the value:

```sh
[ -f .env ] || cp .env.example .env
```

Write `MOTHERDUCK_TOKEN=<token>` into `.env` (edit the file; do not commit it — `.env`
is gitignored). Optionally set `MOTHERDUCK_DATABASE`.

## Step 4 — Verify the connection

Load the env and test a `md:` connection through the DuckDB CLI:

```sh
set -a; . ./.env; set +a
duckdb -c "ATTACH 'md:'; SHOW DATABASES;"
```

A successful run lists the user's MotherDuck databases. If it fails, surface the exact
error (most often an invalid or unset `MOTHERDUCK_TOKEN`). Do not continue silently.

## Step 5 — Hand off

Once connected, the bundled MotherDuck skills (`motherduck-connect`,
`motherduck-duckdb-sql`, dashboards, pipelines, etc.) and the DuckDB `query`/`attach-db`
skills can drive the workspace. Other non-MCP paths also work with the same token:
`psql` against MotherDuck's Postgres-compatible endpoint, or the REST API via `curl`.
