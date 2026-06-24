#!/usr/bin/env node
import { execSync } from "node:child_process";

const label = "pi-duckdb";

function tryRun(cmd) {
  try {
    execSync(cmd, { stdio: "pipe", encoding: "utf8", timeout: 120_000 });
    return true;
  } catch (err) {
    const msg = err.stderr?.trim() || err.message;
    console.log(`ℹ️  ${label}: ${msg}`);
    return false;
  }
}

console.log(`🔧 ${label} postinstall`);

// Fetch vendored skills from submodules — pi install doesn't do this automatically
tryRun("git submodule update --init --recursive");

console.log(`✅ ${label} postinstall complete`);
