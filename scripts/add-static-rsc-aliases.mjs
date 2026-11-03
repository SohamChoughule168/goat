import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "out");
if (!fs.existsSync(root)) {
  console.error(`Static export not found at ${root}`);
  process.exit(1);
}

let created = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      const files = [];
      const collect = (current) => {
        for (const child of fs.readdirSync(current, { withFileTypes: true })) {
          const childFull = path.join(current, child.name);
          if (child.isDirectory()) collect(childFull);
          else files.push(path.relative(full, childFull).split(path.sep).join("/"));
        }
      };
      collect(full);
      for (const file of files) {
        const aliasName = `${entry.name}.${file.replace(/\//g, ".")}`;
        const aliasPath = path.join(dir, aliasName);
        const sourcePath = path.join(full, file);
        if (!fs.existsSync(aliasPath)) {
          fs.copyFileSync(sourcePath, aliasPath);
          created += 1;
        }
      }
    }
    walk(full);
  }
}

walk(root);
console.log(`[rsc-aliases] created ${created} aliases`);
