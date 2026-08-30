#!/usr/bin/env node
/**
 * MODEL COMPRESSION SCRIPT
 * 
 * Compresses .glb/.gltf models with DRACO and textures with KTX2.
 * 
 * Usage:
 *   node scripts/compress-models.mjs
 *   node scripts/compress-textures.mjs
 * 
 * Requires: gltf-transform CLI installed globally
 *   npm install -g @gltf-transform/cli
 * 
 * Output:
 *   public/models/*.glb (DRACO-compressed, ~90% smaller)
 *   public/textures/*.ktx2 (basis-universal, ~95% smaller)
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

/**
 * Compress all .glb files in /public/models with DRACO
 */
export function compressModels() {
  const modelsDir = join(ROOT, "public", "models");
  if (!existsSync(modelsDir)) {
    console.log("[compress-models] No /public/models directory, skipping");
    return;
  }

  const files = readdirSync(modelsDir).filter(f => f.endsWith(".glb") || f.endsWith(".gltf"));
  if (files.length === 0) {
    console.log("[compress-models] No .glb/.gltf files found");
    return;
  }

  console.log(`[compress-models] Found ${files.length} model files`);

  for (const file of files) {
    const input = join(modelsDir, file);
    const ext = extname(file);
    const baseName = file.replace(ext, "");
    const output = join(modelsDir, `${baseName}.draco.glb`);

    try {
      console.log(`[compress-models] Compressing ${file}...`);
      // Using gltf-transform CLI to apply DRACO compression
      execSync(
        `gltf-transform draco "${input}" "${output}"`,
        { stdio: "pipe", cwd: ROOT }
      );
      const inSize = statSync(input).size;
      const outSize = statSync(output).size;
      const ratio = ((1 - outSize / inSize) * 100).toFixed(1);
      console.log(`[compress-models] ✓ ${file}: ${(inSize / 1024).toFixed(1)}KB → ${(outSize / 1024).toFixed(1)}KB (${ratio}% smaller)`);
    } catch (err) {
      console.warn(`[compress-models] ✗ Failed to compress ${file}:`, err.message);
    }
  }
}

/**
 * Compress all textures in /public/textures with KTX2 (basis)
 */
export function compressTextures() {
  const texturesDir = join(ROOT, "public", "textures");
  if (!existsSync(texturesDir)) {
    console.log("[compress-textures] No /public/textures directory, skipping");
    return;
  }

  const files = readdirSync(texturesDir, { recursive: true })
    .filter(f => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg"));

  if (files.length === 0) {
    console.log("[compress-textures] No image files found");
    return;
  }

  console.log(`[compress-textures] Found ${files.length} texture files`);

  for (const file of files) {
    const input = join(texturesDir, file);
    const ext = extname(file);
    const baseName = file.replace(ext, "");
    const output = join(texturesDir, `${baseName}.ktx2`);

    try {
      console.log(`[compress-textures] Compressing ${file}...`);
      execSync(
        `gltf-transform ktx2 "${input}" "${output}"`,
        { stdio: "pipe", cwd: ROOT }
      );
      const inSize = statSync(input).size;
      const outSize = statSync(output).size;
      const ratio = ((1 - outSize / inSize) * 100).toFixed(1);
      console.log(`[compress-textures] ✓ ${file}: ${(inSize / 1024).toFixed(1)}KB → ${(outSize / 1024).toFixed(1)}KB (${ratio}% smaller)`);
    } catch (err) {
      console.warn(`[compress-textures] ✗ Failed to compress ${file}:`, err.message);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const which = process.argv[2];
  if (which === "textures") {
    compressTextures();
  } else {
    compressModels();
  }
}
