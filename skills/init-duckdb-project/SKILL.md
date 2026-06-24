---
name: init-duckdb-project
description: Scaffold sensible DuckDB defaults for a project — an init SQL file (memory limit, threads, common extensions like httpfs/parquet/json), plus a handy command runner (justfile or Makefile) for query/shell/backup. Use when starting a new DuckDB project or asking for good local defaults. Compatible with the bundled DuckDB skills' state file.
---

# Initialize a DuckDB project

Set up repeatable local defaults so every `duckdb` session starts configured.

## Step 1 — Ask scope
Confirm the user wants project defaults, and the database file path (store as
`DUCKDB_DATABASE` in `.env`). Detect whether the bundled DuckDB skills already created
`.duckdb-skills/state.sql` — if so, extend that instead of competing with it.

## Step 2 — Write an init SQL file
Create `init.sql` (project-scoped; run with `duckdb -init ./init.sql`). Sensible
starting defaults — tune to the machine:
```sql
SET memory_limit = '4GB';
SET threads = 4;
INSTALL httpfs;  LOAD httpfs;
INSTALL parquet; LOAD parquet;
INSTALL json;    LOAD json;
SET enable_progress_bar = true;
```
Note: the DuckDB CLI also auto-loads `~/.duckdbrc` on startup; keep machine-wide
preferences there and project-specific ones in `init.sql`. If `.duckdb-skills/state.sql`
exists, prefer adding ATTACH/LOAD lines there so the bundled `query`/`attach-db` skills
stay in sync.

## Step 3 — Write a command runner
If `just` is available, write a `justfile`; otherwise a `Makefile`. Include:
- `query`  — `duckdb -init ./init.sql "$DUCKDB_DATABASE" -c "$SQL"`
- `shell`  — interactive `duckdb -init ./init.sql "$DUCKDB_DATABASE"`
- `backup` — invoke the backup script (see `setup-backups`)
Load `.env` at the top so `DUCKDB_DATABASE` is available.

## Step 4 — Gitignore the right things
Ensure `.gitignore` contains `*.duckdb`, `*.duckdb.wal`, and `.env`. Ask before
editing if a `.gitignore` already exists.

## Step 5 — Verify
Run `duckdb -init ./init.sql -c "SELECT current_setting('threads'), current_setting('memory_limit');"`
and confirm the extensions load without error. Report the created files and how to use them.
