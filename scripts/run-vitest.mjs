import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const declaredRoot = fileURLToPath(new URL("..", import.meta.url));
const rootDir = fs.realpathSync.native(declaredRoot);
const vitestBin = fs.realpathSync.native(
  path.join(rootDir, "node_modules/vitest/vitest.mjs"),
);

const child = spawn(process.execPath, [vitestBin, ...process.argv.slice(2)], {
  cwd: rootDir,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
