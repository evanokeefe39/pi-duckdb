# DuckDB & MotherDuck resources

Curated external resources for best practices, gotchas, and learning. The
`duckdb-best-practices` skill distills the essentials; this is the deeper reading list.
For live, searchable docs, use the bundled **duckdb-docs** skill (offline full-text
search — no MCP, no API key).

## Official
- Docs: https://duckdb.org/docs/
- Performance Guide: https://duckdb.org/docs/stable/guides/performance/overview
- Guides index: https://duckdb.org/docs/stable/guides/overview
- Blog / news: https://duckdb.org/news/ · RSS https://duckdb.org/feed.xml
- Community extensions registry: https://duckdb.org/community_extensions/
- Full-Text Search extension: https://duckdb.org/docs/stable/core_extensions/full_text_search

## Best practices, antipatterns & gotchas
- pg_duckdb gotchas & syntax: https://github.com/duckdb/pg_duckdb/blob/main/docs/gotchas_and_syntax.md
- Text analytics with DuckDB: https://duckdb.org/2025/06/13/text-analytics
- Concurrency model: https://duckdb.org/docs/stable/connect/concurrency

## Awesome lists (community)
- davidgasquez/awesome-duckdb (canonical): https://github.com/davidgasquez/awesome-duckdb
- RaczeQ/awesome-duckdb: https://github.com/RaczeQ/awesome-duckdb
- gijs-epping/duckdb-resources: https://github.com/gijs-epping/duckdb-resources

## Learning
- Interactive tutorial: https://dbquacks.com/tutorial/1
- Example-driven newsletter: https://learningduckdb.com/
- Snippets: https://duckdbsnippets.com/
- CLI reference (tldr): https://tldr.inbrowser.app/pages/common/duckdb

## Tools & UIs
- Online shell: https://shell.duckdb.org/
- Browser SQL workbench: https://sql-workbench.com
- Open-source playground: https://quackdb.com/

## MotherDuck
- Docs: https://motherduck.com/docs/
- Blog: https://motherduck.com/blog/
- Agent skills (bundled here): https://github.com/motherduckdb/agent-skills

## Bundled skills (in this package)
- DuckDB's own skills: https://github.com/duckdb/duckdb-skills (vendored at `vendor/duckdb-skills`)
- MotherDuck skills: https://github.com/motherduckdb/agent-skills (vendored at `vendor/motherduck-skills`)
