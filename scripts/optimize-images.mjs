#!/usr/bin/env node
/**
 * IMAGE OPTIMIZATION PIPELINE
 * 
 * Converts images to WebP/AVIF, generates responsive variants,
 * and creates blur placeholders for $100M tier.
 * 
 * Requires: sharp (already in deps)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "fs";
import { join, extname, basename, dirname, relative } from "path";
import sharp from "sharp";

const SOURCE_DIR = join(process.cwd(), "public");
const OUTPUT_DIR = join(process.cwd(), "public", "optimized");
const QUALITY = 80;
const AVIF_QUALITY = 50;

const RESPONSIVE_WIDTHS = [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const BLUR_WIDTH = 20;
const BLUR_QUALITY = 20;

const SUPPORTED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff", ".tif"];

async function optimizeImage(inputPath, outputDir) {
  const relPath = relative(SOURCE_DIR, inputPath);
  const baseName = basename(inputPath, extname(inputPath));
  const outSubDir = join(outputDir, dirname(relPath));
  
  if (!existsSync(outSubDir)) {
    mkdirSync(outSubDir, { recursive: true });
  }
  
  const results = {};
  
  // Original (copy if not already optimized)
  const originalOut = join(outSubDir, baseName + extname(inputPath));
  if (!existsSync(originalOut)) {
    await sharp(inputPath)
      .withMetadata()
      .toFile(originalOut);
  }
  results.original = originalOut;
  
  // WebP variants
  for (const width of RESPONSIVE_WIDTHS) {
    const webpOut = join(outSubDir, `${baseName}-${width}w.webp`);
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpOut);
  }
  results.webp = true;
  
  // AVIF variants (smaller, better quality)
  for (const width of RESPONSIVE_WIDTHS) {
    const avifOut = join(outSubDir, `${baseName}-${width}w.avif`);
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .avif({ quality: AVIF_QUALITY })
      .toFile(avifOut);
  }
  results.avif = true;
  
  // Blur placeholder (tiny base64)
  const blurOut = join(outSubDir, `${baseName}-blur.webp`);
  const blurBuffer = await sharp(inputPath)
    .resize(BLUR_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: BLUR_QUALITY })
    .toBuffer();
  
  const blurBase64 = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
  writeFileSync(join(outSubDir, `${baseName}-blur.txt`), blurBase64);
  results.blur = blurBase64;
  
  return { path: relPath, ...results };
}

async function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (SUPPORTED_EXTS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log("🖼️  IMAGE OPTIMIZATION PIPELINE");
  console.log("════════════════════════════════════════════════════\n");
  
  if (!existsSync(SOURCE_DIR)) {
    console.log("❌ Source directory not found:", SOURCE_DIR);
    process.exit(1);
  }
  
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const files = await walk(SOURCE_DIR);
  console.log(`Found ${files.length} images to optimize\n`);
  
  const manifest = [];
  
  for (const file of files) {
    const relPath = relative(SOURCE_DIR, file);
    console.log(`Processing: ${relPath}`);
    
    try {
      const result = await optimizeImage(file, OUTPUT_DIR);
      manifest.push(result);
      console.log(`  ✅ Done (${result.webp ? "WebP/AVIF" : "copy"})`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    }
  }
  
  // Write manifest
  writeFileSync(
    join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log("\n════════════════════════════════════════════════════");
  console.log(`✅ Optimized ${manifest.length} images`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📋 Manifest: ${join(OUTPUT_DIR, "manifest.json")}`);
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});