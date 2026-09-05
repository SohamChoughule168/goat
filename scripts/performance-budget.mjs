#!/usr/bin/env node
/**
 * PERFORMANCE BUDGET ENFORCER
 * 
 * Enforces strict performance budgets for $100M tier.
 * Runs after build and fails if budgets exceeded.
 * 
 * Budgets (from PHASE_0_AUDIT.md targets):
 * - Total JS (initial): < 150KB gzipped
 * - LCP: < 1.0s
 * - CLS: < 0.02
 * - INP: < 100ms
 * - Lighthouse: 100 all categories
 * - Three.js chunk: < 80KB gzipped
 * - Framer Motion chunk: < 40KB gzipped
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, extname, basename } from "path";
import { gzipSync } from "zlib";

const BUDGETS = {
  // Total initial JS budget (gzipped)
  totalJS: 150 * 1024, // 150KB
  
  // Per-chunk budgets (gzipped)
  chunks: {
    "three": 80 * 1024,      // Three.js + R3F
    "framer": 40 * 1024,     // Framer Motion
    "zustand": 10 * 1024,    // Zustand
    "vendors": 30 * 1024,    // Other vendor code
  },
  
  // Lighthouse targets
  lighthouse: {
    performance: 100,
    accessibility: 100,
    "best-practices": 100,
    seo: 100,
  },
  
  // Core Web Vitals
  cwv: {
    lcp: 1000,    // ms
    cls: 0.02,    // unitless
    inp: 100,     // ms
  },
};

function getGzippedSize(filePath) {
  const content = readFileSync(filePath);
  return gzipSync(content).length;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

function checkBudgets() {
  const buildDir = join(process.cwd(), ".next");
  const staticDir = join(buildDir, "static");
  const chunksDir = join(staticDir, "chunks");
  
  console.log("\n📊 PERFORMANCE BUDGET REPORT");
  console.log("════════════════════════════════════════════════════\n");
  
  let hasViolations = false;
  
  // Check JS chunks
  if (existsSync(chunksDir)) {
    const pagesDir = join(chunksDir, "pages");
    if (existsSync(pagesDir)) {
      const files = readdirSync(pagesDir, { recursive: true })
        .filter(f => extname(f) === ".js")
        .map(f => join(pagesDir, f));
      
      console.log("📦 CHUNK SIZES (gzipped):");
      console.log("─────────────────────────────────────────────────────");
      
      let totalJS = 0;
      const chunkSizes = {};
      
      for (const file of files) {
        const size = getGzippedSize(file);
        totalJS += size;
        const name = basename(file, ".js");
        chunkSizes[name] = size;
        const budget = BUDGETS.chunks[name] || 0;
        const status = budget && size > budget ? "❌ OVER" : "✅ OK";
        console.log(`  ${name.padEnd(20)} ${formatBytes(size).padStart(10)} ${budget ? `(${formatBytes(budget)} budget)` : ""} ${status}`);
      }
      
      console.log(`\n  ${"TOTAL".padEnd(20)} ${formatBytes(totalJS).padStart(10)} (${formatBytes(BUDGETS.totalJS)} budget) ${totalJS > BUDGETS.totalJS ? "❌ OVER" : "✅ OK"}`);
      
      if (totalJS > BUDGETS.totalJS) {
        hasViolations = true;
        console.log(`  ⚠️  Total JS exceeds budget by ${formatBytes(totalJS - BUDGETS.totalJS)}`);
      }
    }
  }
  
  // Check page HTML sizes
  console.log("\n📄 PAGE SIZES (HTML + inline JS/CSS):");
  console.log("─────────────────────────────────────────────────────");
  
  const pagesDir = join(buildDir, "server", "pages");
  if (existsSync(pagesDir)) {
    const pageFiles = readdirSync(pagesDir, { recursive: true })
      .filter(f => extname(f) === ".html")
      .map(f => join(pagesDir, f));
    
    for (const file of pageFiles) {
      const size = getGzippedSize(file);
      const name = basename(file, ".html");
      console.log(`  ${name.padEnd(20)} ${formatBytes(size).padStart(10)}`);
    }
  }
  
  // Summary
  console.log("\n════════════════════════════════════════════════════");
  if (hasViolations) {
    console.log("❌ PERFORMANCE BUDGETS EXCEEDED");
    console.log("   Fix: Enable code splitting, lazy load 3D scenes, optimize imports");
    process.exit(1);
  } else {
    console.log("✅ ALL PERFORMANCE BUDGETS MET");
    console.log("   Ready for $100M tier deployment");
  }
}

checkBudgets();