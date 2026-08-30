/**
 * GLSL Shader Loader
 * 
 * Custom loader that transforms .glsl, .vert, .frag files into JavaScript
 * modules that export the shader source as a string.
 * 
 * Supports #include "../common/noise.glsl" preprocessor directive.
 * 
 * Usage in components:
 *   import monolithVertex from "@/shaders/hero/monolith.vert";
 *   import monolithFragment from "@/shaders/hero/monolith.frag";
 * 
 * In Three.js:
 *   new THREE.ShaderMaterial({
 *     vertexShader: monolithVertex,
 *     fragmentShader: monolithFragment,
 *   });
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";

export function transformGLSL(code, filename) {
  // Process #include directives
  // #include "../common/noise.glsl" → file contents inlined
  const includeRegex = /#include\s+(.+?)(?:\n|$)/g;
  
  const processed = code.replace(includeRegex, (match, includePath) => {
    const trimmedPath = includePath.trim().replace(/["']/g, "");
    const currentDir = dirname(filename);
    const resolvedPath = resolve(currentDir, trimmedPath);
    
    if (!existsSync(resolvedPath)) {
      console.warn(`[glsl-loader] Could not find include: ${resolvedPath}`);
      return `// #include "${trimmedPath}" - FILE NOT FOUND\n`;
    }
    
    try {
      const includeContent = readFileSync(resolvedPath, "utf-8");
      // Recursively process includes
      return transformGLSL(includeContent, resolvedPath);
    } catch (err) {
      console.warn(`[glsl-loader] Error reading include: ${resolvedPath}`, err.message);
      return `// #include "${trimmedPath}" - READ ERROR\n`;
    }
  });
  
  // Convert GLSL to a JavaScript module that exports the source as a string
  // Escape backticks and template literal interpolation characters
  const escaped = processed
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  
  return `export default \`${escaped}\`;\n`;
}

export default function glslLoader(source) {
  return {
    code: transformGLSL(source, this.resourcePath),
    map: null,
  };
}
