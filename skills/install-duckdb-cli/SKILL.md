---
name: install-duckdb-cli
description: Install or update the DuckDB command-line binary on this machine (macOS, Linux, or Windows), then verify it runs. Use when the duckdb CLI is missing, out of date, or the user asks to set up DuckDB. This installs the binary itself — not extensions (DuckDB's own install-duckdb skill handles extensions).
---

# Install the DuckDB CLI

Goal: get a working `duckdb` binary on PATH, then prove it works. Prefer a system
package manager (clean upgrades/uninstalls); fall back to the official installer.

## Step 1 — Check what's already there

```sh
duckdb -c "SELECT version();"
```

If this prints a version, DuckDB is installed. Only continue if the user wants an
upgrade, or the command is not found.

## Step 2 — Detect the OS and pick a method

Determine the platform (`uname` on Unix; on Windows you are likely in PowerShell or
Git Bash). Pick the first available option for that OS. Always confirm with the user
before running an installer that modifies their system.

### macOS
1. Homebrew (preferred): `brew install duckdb` (or `brew upgrade duckdb`)
2. Official script (no Homebrew): `curl https://install.duckdb.org | sh`

### Linux
1. Official script (preferred): `curl https://install.duckdb.org | sh`
   - Installs to `~/.duckdb/cli/latest/duckdb` and prints the line to add to PATH.
2. Homebrew on Linux, if present: `brew install duckdb`

### Windows
1. winget (preferred): `winget install DuckDB.cli`
2. Scoop: `scoop install duckdb`
3. Chocolatey (admin shell): `choco install duckdb`
4. Manual: download the Windows CLI zip from https://duckdb.org/docs/installation/
   and add the extracted folder to PATH.

## Step 3 — Make sure it's on PATH

The official script installs to `~/.duckdb/cli/latest`. If `duckdb` is not found after
install, add that directory to PATH:

- bash/zsh: `export PATH="$HOME/.duckdb/cli/latest:$PATH"` (append to the shell rc file)
- Windows: add the install dir to the user PATH, then open a new terminal.

## Step 4 — Verify

```sh
duckdb -c "SELECT version();"
```

Report the version back to the user. If it still fails, surface the exact error —
do not silently continue.

## Step 5 — Onboarding: offer MotherDuck

After the CLI works, ask the user whether they also want to connect **MotherDuck**
(cloud DuckDB). If yes, run the `setup-motherduck` skill (token -> `.env` -> verify a
`md:` connection). If no, local DuckDB is ready as-is — they can set up MotherDuck later.

## Notes
- This skill installs the CLI binary only. To install DuckDB *extensions*
  (httpfs, postgres, parquet, etc.), use the `install-duckdb` skill from
  DuckDB's bundled skill set (also shipped in this package).
- For querying, attaching databases, and reading data files once installed, use the
  `query`, `attach-db`, and `read-file` skills from the bundled DuckDB skills.
