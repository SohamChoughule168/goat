/**
 * Vite config for shader support in development
 * 
 * This file is used by:
 * - The Vite-based dev tooling (vitest, etc.)
 * - IDE for shader import autocomplete
 * 
 * Turbopack (Next.js dev) uses its own configuration in next.config.ts
 */

import { defineConfig } from "vite";
import { transformGLSL } from "./glsl-loader.mjs";

export default defineConfig({
  plugins: [
    {
      name: "glsl-loader",
      transform(code, id) {
        if (/\.(glsl|vert|frag)$/.test(id)) {
          return {
            code: transformGLSL(code, id),
            map: null,
          };
        }
      },
    },
  ],
});
