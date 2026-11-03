import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build tooling — plain Node scripts, not app code:
    "scripts/**",
    "glsl-loader.mjs",
    // Project-local skill instructions and third-party starter assets:
    ".opencode/**",
    // Private creative resource library — local only, never part of the site:
    "higgsfield/**",
    // Local deployment scratch scripts:
    "deploy-here.js",
    "publish.sh",
  ]),
]);

export default eslintConfig;
