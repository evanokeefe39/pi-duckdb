---
name: protect-db-file
description: Harden a local DuckDB database file against accidental deletion by an over-permissive agent or script. Stores the file OUTSIDE the project directory and references it by absolute path, gitignores database artifacts, and optionally creates an in-project symlink (with caveats) or sets the file read-only. OPT-IN — only run when the user explicitly asks during onboarding.
---

# Protect the database file

Reduce the blast radius of an accidental `rm -rf` in the project directory. This is
opt-in; do not apply by default.

## Step 1 — Move the database outside the project (primary, robust)
The reliable pattern: keep the `.duckdb` file at an absolute path OUTSIDE the project
(e.g. `~/duckdb-data/<project>/main.duckdb`) and reference that path directly in every
connection string and in `DUCKDB_DATABASE`.

Why this works: DuckDB opens whatever path it is given and writes its WAL
(`<file>.wal`) next to the real file. If the file lives outside the project, wiping the
project cannot delete the data. No symlink required.

```sh
mkdir -p ~/duckdb-data/<project>
# if a db already exists in-project, checkpoint then move it:
duckdb ./old.duckdb -c "CHECKPOINT;"
mv ./old.duckdb ~/duckdb-data/<project>/main.duckdb
```
Set `DUCKDB_DATABASE=~/duckdb-data/<project>/main.duckdb` in `.env`.

## Step 2 — Gitignore database artifacts
Ensure `.gitignore` has `*.duckdb`, `*.duckdb.wal`, and `.env`.

## Step 3 — Optional: in-project symlink (convenience, with caveats)
If the user wants the file to *appear* in the project, create a symlink pointing to the
external file. State these caveats first:
- **Protective side effect:** deleting the project removes only the symlink; `rm <link>`
  does not delete the target. Good for safety.
- **DuckDB writes through** the link to the real target (WAL lands in the target dir).
  Verify read AND write before relying on it.
- **Windows:** symlinks require Developer Mode or an elevated shell; otherwise creation
  fails. Prefer the plain external-path approach on Windows.

```sh
# Linux/macOS
ln -s ~/duckdb-data/<project>/main.duckdb ./main.duckdb
# Windows (Developer Mode / admin), Git Bash:
#   cmd //c mklink main.duckdb "C:\Users\<you>\duckdb-data\<project>\main.duckdb"
```
Then verify: `duckdb ./main.duckdb -c "CREATE TABLE _t(x int); DROP TABLE _t; SHOW TABLES;"`.

## Step 4 — Optional: read-only when idle
For an archival DB not being written, mark it read-only (`chmod 0444` / `attrib +R`).
It must be made writable again before use — note this clearly to the user.

## Step 5 — Verify and report
Confirm DuckDB can open (and, if intended, write to) the file at its new location.
Report the final path, whether a symlink was used, gitignore changes, and remind the
user to also run `setup-backups` — relocation reduces accidental-wipe risk but is not a
backup.
