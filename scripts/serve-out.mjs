import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".otf", "font/otf"],
  [".map", "application/json; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".glb", "model/gltf-binary"],
  [".gltf", "model/gltf+json"],
  [".glsl", "text/plain; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".riv", "application/octet-stream"],
  [".splinecode", "application/octet-stream"],
]);

if (!existsSync(path.join(root, "index.html"))) {
  console.error(`[serve-out] Static export not found at ${root}. Run "pnpm run build" first.`);
  process.exit(1);
}

function isFile(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isDirectory(filePath) {
  try {
    return statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function contentType(filePath) {
  return mimeTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

const COMPRESSIBLE = new Set([".html", ".js", ".mjs", ".css", ".json", ".xml", ".txt", ".svg"]);
const gzipCache = new Map();

function gzipped(filePath, stats) {
  const key = `${filePath}:${stats.mtimeMs}:${stats.size}`;
  const cached = gzipCache.get(key);
  if (cached) return cached;

  const body = gzipSync(readFileSync(filePath), { level: 9 });
  if (gzipCache.size > 200) gzipCache.clear();
  gzipCache.set(key, body);
  return body;
}

function sendFile(req, res, filePath, statusCode = 200) {
  const stats = statSync(filePath);
  const immutable = filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`);
  const ext = path.extname(filePath).toLowerCase();
  const acceptsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  const body = acceptsGzip && COMPRESSIBLE.has(ext) ? gzipped(filePath, stats) : null;

  res.writeHead(statusCode, {
    "Content-Type": contentType(filePath),
    "Content-Length": body ? body.length : stats.size,
    "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "no-cache",
    "X-Content-Type-Options": "nosniff",
    ...(body ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  if (body) {
    res.end(body);
    return;
  }

  createReadStream(filePath).pipe(res);
}

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function redirectToSlash(res, pathname, search) {
  res.writeHead(308, { Location: `${pathname}/${search}` });
  res.end();
}

const server = createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${host}:${port}`}`);
  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    sendText(res, 400, "Bad request");
    return;
  }

  if (pathname.includes("\0")) {
    sendText(res, 400, "Bad request");
    return;
  }

  const target = path.resolve(root, `.${pathname}`);

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  if (isFile(target)) {
    sendFile(req, res, target);
    return;
  }

  if (isDirectory(target)) {
    const index = path.join(target, "index.html");

    if (isFile(index)) {
      if (!pathname.endsWith("/")) {
        redirectToSlash(res, pathname, url.search);
        return;
      }

      sendFile(req, res, index);
      return;
    }
  }

  const notFound = path.join(root, "404.html");

  if (isFile(notFound)) {
    sendFile(req, res, notFound, 404);
    return;
  }

  sendText(res, 404, "Not found");
});

server.listen(port, host, () => {
  console.log(`[serve-out] Serving ${root} at http://${host}:${port}`);
});
