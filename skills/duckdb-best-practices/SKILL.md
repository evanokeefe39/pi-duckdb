---
name: duckdb-best-practices
description: Curated DuckDB best practices, antipatterns, gotchas, and high-value features. Use when writing or reviewing DuckDB SQL, designing a schema, loading data, tuning performance, or debugging why something is slow or behaves unexpectedly. For version-specific or API details, delegate to the duckdb-docs skill (live full-text search of the official docs).
---

# DuckDB best practices, antipatterns & gotchas

A quick reference distilled from DuckDB's official Performance Guide and community
resources. For anything version-specific or not covered here, run the **duckdb-docs**
skill (offline full-text search of the official docs + blog). See also `RESOURCES.md`.

## High-value features worth reaching for
- **Friendly SQL:** `GROUP BY ALL`, `SELECT * EXCLUDE (col)`, `* REPLACE (expr AS col)`,
  `QUALIFY`, `FILTER (WHERE …)` on aggregates, `ASOF JOIN`, `USING SAMPLE`, list/struct
  types, `UNNEST`.
- **Query files in place:** `read_parquet('s3://…/*.parquet')`, `read_csv(..., union_by_name=true)`,
  `read_json_auto`. No load step needed for exploration.
- **Move data between systems:** `ATTACH` Postgres/MySQL/SQLite directly; `COPY`;
  `EXPORT DATABASE` / `IMPORT DATABASE` for portable, version-safe dumps.
- **Single-file database** (`.duckdb`), `httpfs` for S3/HTTP, `fts` for full-text,
  `spatial` for geo.

## Schema & types
- **DO** use specific types (`BIGINT`, `DATE`, `TIMESTAMP`) — not `VARCHAR` for numbers
  or dates. Official benchmark: `TIMESTAMP` aggregation 0.9s/3.3GB vs `VARCHAR` 3.9s/5.2GB.
- **DO** join on numeric keys (`BIGINT`). Joining on string-encoded numbers is ~1.8× slower.
- **DON'T** add a PRIMARY KEY / UNIQUE constraint *before* bulk loading — it builds an
  ART index per row. Loading 554M rows: 121s without PK vs 461.6s with (≈3.8×). Add
  constraints *after* the bulk load, and only for integrity (they don't speed up joins
  or aggregations — DuckDB doesn't plan around them).

## Loading data
- **DON'T** do row-by-row `INSERT` loops — detrimental even with prepared statements.
  Avoid tuple-at-a-time for >100k rows.
- **DO** bulk load: `COPY`, `INSERT … SELECT FROM read_parquet(...)`, or the **Appender**
  API (C/C++/Go/Java/Rust). Prefer **Parquet over CSV** (better compression + typing).
- For other DBs, prefer the native scanner extension (postgres/mysql/sqlite) or export
  to Parquet first.

## Performance tuning
- `SET memory_limit = '8GB';` and `SET threads = N;` — manually cap threads if
  HyperThreading hurts; too many threads can slow things down.
- `SET preserve_insertion_order = false;` — big memory savings on large import/export
  when you don't need original row order. (Caveat: results may then come back unordered;
  add explicit `ORDER BY` when order matters.)
- `SET temp_directory = '/path';` — control spill-to-disk location for
  larger-than-memory GROUP BY / JOIN / ORDER BY / windowed queries.
- **Larger-than-memory caveat:** `list()` and `string_agg()` cannot spill to disk, and
  several blocking operators in one query can still exhaust RAM.
- **DO** `SELECT` only the columns you need (especially on Parquet / remote files — it
  enables projection + filter pushdown). Push `WHERE` filters early.
- Use `EXPLAIN` to inspect plans and `EXPLAIN ANALYZE` to profile per-operator time.

## Concurrency gotchas
- DuckDB is **single-writer**: one process holds the write lock on a `.duckdb` file.
  Multiple concurrent readers are fine; multiple writer processes are not — you'll get a
  lock error. Use one connection/process for writes (or MotherDuck for multi-client).
- Changes go to a WAL (`<file>.wal`); run `CHECKPOINT;` to fold it into the main file
  (also do this before copying the file for a backup — see `setup-backups`).

## Common gotchas
- **Row order is not guaranteed** without `ORDER BY`, and even less so with
  `preserve_insertion_order = false`.
- **FTS index is not auto-updated** when the underlying table changes — rebuild it after
  writes.
- **CSV sniffing** can misread types/delimiters — pass explicit `types=`, `delim=`,
  `header=` when ingesting untrusted CSVs.
- **Reading many files:** use globs and `union_by_name=true` when schemas differ slightly.
- **pg_duckdb** (DuckDB-in-Postgres) has transaction limits: you can't write a Postgres
  table and a DuckDB table in the same transaction. Don't set
  `duckdb.unsafe_allow_mixed_transactions` to dodge it.

## When to go deeper
Run the **duckdb-docs** skill for live, version-specific answers (functions, extensions,
syntax). It searches DuckDB's official prebuilt index offline — no MCP, no API key.

## Sources
- DuckDB Performance Guide: https://duckdb.org/docs/stable/guides/performance/overview
- awesome-duckdb: https://github.com/davidgasquez/awesome-duckdb
- pg_duckdb gotchas: https://github.com/duckdb/pg_duckdb/blob/main/docs/gotchas_and_syntax.md
