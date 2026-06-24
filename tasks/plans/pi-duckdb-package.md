# Plan: pi-duckdb Pi package

## Intent
Ship a Pi coding-agent package that (a) installs the DuckDB CLI binary onto the
user's system via a skill, and (b) re-exports DuckDB's own published skills
(duckdb/duckdb-skills) so a Pi user gets the full DuckDB skill set with one install.
No MCP — skills + CLI only.

## Context
- Pi loads skills from paths declared in `package.json` `pi.skills`. It recursively
  finds `SKILL.md` folders.
- duckdb/duckdb-skills is a Claude Code plugin (MIT) with 6 portable SKILL.md skills:
  attach-db, query, read-file, duckdb-docs, read-memories, install-duckdb.
  Their `install-duckdb` installs *extensions*, not the binary — no overlap with ours.
- Incorporation method: git submodule (decided) pinned to duckdb-skills@main.
- Name collision avoided: our skill is `install-duckdb-cli`.

## Items
- [x] Create repo ~/repos/pi-duckdb, git init, branch main
- [x] Write tasks/plans/pi-duckdb-package.md (this file)
- [ ] Write package.json with pi.skills = ["./skills", "./vendor/duckdb-skills/skills"]
- [ ] Write skills/install-duckdb-cli/SKILL.md (cross-OS binary install + verify)
- [ ] Write README.md (install, what it bundles, attribution)
- [ ] Write .gitignore
- [ ] Add git submodule vendor/duckdb-skills -> duckdb/duckdb-skills@main
- [ ] Commit
- [ ] gh repo create evanokeefe39/pi-duckdb + push (with submodule)
- [ ] Verify clone --recursive yields the vendored skills

## Definition of Done
- [ ] `pi install git:github.com/evanokeefe39/pi-duckdb` resolves skills (7 total)
- [ ] install-duckdb-cli detects OS and runs the correct installer, then verifies
- [ ] Submodule renders as a link to duckdb/duckdb-skills on GitHub
- [ ] README documents the recursive-clone caveat for submodules

## Negative Space
- Out of scope: writing query/attach skills ourselves (duckdb provides them).
- Out of scope: MotherDuck cloud skills (separate repo).
- Reserved for human: publishing to npm.

## Review
(to fill on completion)
