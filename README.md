# pi-duckdb

A [Pi coding agent](https://github.com/badlogic/pi-mono) package for working with
DuckDB and MotherDuck — **skills + CLI only, no MCP**.

It does two things:

1. **Installs the DuckDB CLI** onto your machine (macOS, Linux, Windows) via the
   `install-duckdb-cli` skill.
2. **Bundles the official skills** published by DuckDB and MotherDuck, so your agent
   learns how to query, attach databases, read files, write DuckDB-flavored SQL, and
   build MotherDuck analytics — all without an MCP server.

## Install

```sh
pi install git:github.com/evanokeefe39/pi-duckdb
```

> **Submodules:** the bundled DuckDB and MotherDuck skills are git submodules. If your
> Pi install does not fetch submodules, clone manually with `--recursive` and install
> from the local path:
>
> ```sh
> git clone --recursive https://github.com/evanokeefe39/pi-duckdb
> pi install ./pi-duckdb
> ```

Then enable the skills via `pi config`.

## What you get

### This package's skills
- **onboarding** — guided entry point. Runs the steps in order: install CLI ->
  MotherDuck? -> dev defaults? -> backups? -> protect file? (opt-in). Start here.
- **install-duckdb-cli** — detect the OS, install/upgrade the DuckDB CLI binary, put
  it on PATH, and verify. (Installs the *binary*; DuckDB's own `install-duckdb` skill
  handles *extensions*.)
- **setup-motherduck** — asks whether you want MotherDuck (cloud DuckDB), and if so
  stores `MOTHERDUCK_TOKEN` in `.env` and verifies a `md:` connection. No MCP.
- **init-duckdb-project** — scaffold sensible defaults: `init.sql` (memory/threads,
  httpfs/parquet/json), a `justfile`/`Makefile` of commands, and gitignore entries.
- **setup-backups** — scheduled backups of a local `.duckdb`. Recommends a location
  **outside the project dir** (survives an over-permissive agent wiping the project) or
  S3; generates a script + scheduler entry (cron / launchd / Task Scheduler) and
  verifies a restore.
- **protect-db-file** *(opt-in)* — keep the database file outside the project dir,
  gitignore artifacts, optionally symlink (with caveats) or set read-only.

Copy `.env.example` to `.env` and fill in what you use (`MOTHERDUCK_TOKEN`,
`DUCKDB_DATABASE`, `DUCKDB_BACKUP_DIR`).

> Note: backups matter most for **local** DuckDB files — MotherDuck-hosted data has
> managed durability. Symlinks are optional and need Developer Mode/admin on Windows;
> the default safety pattern is just pointing DuckDB at an absolute path outside the
> project (DuckDB writes its WAL next to the real file).

### Bundled from [duckdb/duckdb-skills](https://github.com/duckdb/duckdb-skills) (MIT)
`attach-db`, `query`, `read-file`, `convert-file`, `duckdb-docs`, `read-memories`,
`install-duckdb`, `s3-explore`, `spatial` — vendored at `vendor/duckdb-skills`.

### Bundled from [motherduckdb/agent-skills](https://github.com/motherduckdb/agent-skills) (MIT)
18 skills across connect / explore / query / SQL syntax / REST API / load / model /
share / Dives / DuckLake / security / pricing / apps / dashboards / pipelines /
migrations — vendored at `vendor/motherduck-skills`.

## No MCP

Tools come from CLIs the agent already has via `bash`: the `duckdb` binary (local
files, Parquet/CSV, and MotherDuck over a native `md:` connection), plus `psql` for
the MotherDuck Postgres-compatible endpoint and `curl` for the REST API. The skills
supply the know-how; the CLIs do the work.

## Updating the bundled skills

```sh
git submodule update --remote vendor/duckdb-skills vendor/motherduck-skills
git add vendor/duckdb-skills vendor/motherduck-skills
git commit -m "chore: bump vendored skills"
```

## License

MIT for this package's own code. Vendored skills retain their upstream MIT licenses
and copyright (DuckDB Labs and MotherDuck respectively).
