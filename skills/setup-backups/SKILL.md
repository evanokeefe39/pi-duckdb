---
name: setup-backups
description: Set up scheduled backups of a local DuckDB database. Prompts for cadence and location, recommends storing backups OUTSIDE the project directory (so an over-permissive agent that wipes the project cannot destroy them) or in S3, generates a backup script and a scheduler entry (cron / launchd / Task Scheduler), runs one backup now, and verifies a restore. Use when a user wants durable backups of a local .duckdb file.
---

# Scheduled DuckDB backups

Local `.duckdb` files have no automatic backups. This skill creates them. (MotherDuck
cloud data has managed durability — for MotherDuck, prefer its own snapshots/sharing;
use this for local files.)

## Step 0 — Ask whether to proceed
Confirm the user wants scheduled backups, and which database file to protect
(absolute path). If none yet, point them at `init-duckdb-project` first.

## Step 1 — Choose a location (advise the user)
Recommend, in order:
1. **A directory OUTSIDE the project dir** — e.g. `~/duckdb-backups/<project>` or an
   external/mounted drive. Rationale: if an agent or script wipes the project folder,
   backups stored elsewhere survive. This is the main safety win.
2. **S3 (or other object storage)** — best for offsite/durable copies, and natural if
   you are not using MotherDuck. Requires the `httpfs` extension or the `aws` CLI.
3. Avoid: a subfolder inside the project — it dies with the project.

Store the chosen target in `.env` as `DUCKDB_BACKUP_DIR` (local) or
`DUCKDB_BACKUP_S3_URI` (S3). Never commit `.env`.

## Step 2 — Choose a method
- **Logical export (preferred, version-safe):** `EXPORT DATABASE '<dest>/<ts>' (FORMAT
  PARQUET);` writes `schema.sql`, `load.sql`, and Parquet files. Restorable across
  DuckDB versions via `IMPORT DATABASE '<dest>/<ts>'`.
- **File copy (fast, simple):** `CHECKPOINT;` first to flush the WAL, then copy the
  single `.duckdb` file with a timestamped name. Restore = open the copy. Same-version
  only.

For S3, the export form can write directly to `s3://...` with `httpfs` + a secret, or
copy the file with `aws s3 cp`.

## Step 3 — Generate the backup script
Write a small script (e.g. `~/duckdb-backups/backup.sh`, or `.cmd` on Windows) that:
1. Loads `.env`.
2. Runs `CHECKPOINT;` then the chosen export/copy with a UTC timestamp
   (`date -u +%Y%m%dT%H%M%SZ`).
3. Applies retention: keep the last N (e.g. 14); delete older.
4. Logs success/failure with exit codes — never fail silently.

Example (logical export, local):
```sh
set -a; . "$PROJECT_DIR/.env"; set +a
TS=$(date -u +%Y%m%dT%H%M%SZ)
duckdb "$DUCKDB_DATABASE" -c "CHECKPOINT; EXPORT DATABASE '$DUCKDB_BACKUP_DIR/$TS' (FORMAT PARQUET);"
```

## Step 4 — Schedule it
Pick the platform's scheduler. Confirm before installing.
- **Linux/macOS (cron):** add `0 2 * * * /path/backup.sh >> /path/backup.log 2>&1`.
- **macOS (launchd):** write a LaunchAgent plist with `StartCalendarInterval`.
- **Windows (Task Scheduler):**
  `schtasks /Create /SC DAILY /ST 02:00 /TN duckdb-backup /TR "cmd /c C:\path\backup.cmd"`

Default cadence: daily. Ask the user to confirm or change.

## Step 5 — Run one backup now and verify a restore
Run the script once. Then prove the backup is good:
- Logical: `duckdb /tmp/restore_test.duckdb -c "IMPORT DATABASE '<dest>/<ts>'; SHOW TABLES;"`
- File copy: `duckdb '<copied-file>' -c "SHOW TABLES;"`

Report the verified backup path, schedule, retention, and the restore command. If
verification fails, surface the exact error and stop — do not leave a false sense of
safety.
