import type { NextConfig } from "next";

const projectRoot = import.meta.dirname;

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep tracing/watching inside this app. A parent lockfile (or sibling
  // project) can make Next treat a much larger tree as the workspace root,
  // which on Windows can exhaust RAM/CPU and freeze the machine.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    // Next 16.1+ enables this by default. The persistent cache writes heavily
    // under .next/dev and pairs badly with Windows Defender real-time scan.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
