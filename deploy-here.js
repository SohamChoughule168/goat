const fs = require('fs');
const http = require('https');
const path = require('path');

const outDir = path.resolve('out');
const files = [];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else {
      if (entry.name === '.DS_Store' || entry.name === 'state.json') continue;
      const relPath = path.relative(outDir, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);
      let contentType = 'text/html';
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.css') contentType = 'text/css; charset=utf-8';
      else if (ext === '.js' || ext === '.mjs') contentType = 'text/javascript; charset=utf-8';
      else if (ext === '.json') contentType = 'application/json; charset=utf-8';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.woff2') contentType = 'font/woff2';
      else if (ext === '.woff') contentType = 'font/woff';
      else if (ext === '.ttf') contentType = 'font/ttf';
      else if (ext === '.ico') contentType = 'image/x-icon';
      else if (ext === '.mp4') contentType = 'video/mp4';
      files.push({
        path: relPath,
        size: stat.size,
        contentType: contentType,
        hash: require('crypto').createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex'),
        localPath: fullPath
      });
    }
  }
}

walkDir(outDir);
console.log('Found ' + files.length + ' files');

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL('https://' + options.hostname + options.path);
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + (parsedUrl.search || ''),
      method: options.method,
      headers: options.headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', (e) => reject(e));
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.setTimeout(120000);
    if (body) req.write(body);
    req.end();
  });
}

async function uploadFile(file, uploadUrl) {
  const fileContent = fs.readFileSync(file.localPath);
  const uploadUrlParsed = new URL(uploadUrl);
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await httpRequest({
        hostname: uploadUrlParsed.hostname,
        port: 443,
        path: uploadUrlParsed.pathname + (uploadUrlParsed.search || ''),
        method: 'PUT',
        headers: {
          'Content-Type': file.contentType,
          'Content-Length': fileContent.length
        }
      }, fileContent);
      return true;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {
  const createBody = JSON.stringify({
    files: files.map(f => ({ path: f.path, size: f.size, contentType: f.contentType, hash: f.hash })),
    slug: 'goat-wheat-2026',
    title: 'ImaginarsClub Services',
    description: 'Digital studio - Mumbai, India'
  });

  console.log('Creating publish with ' + files.length + ' files...');

  const createRes = await httpRequest({
    hostname: 'here.now',
    port: 443,
    path: '/api/v1/publish',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(createBody)
    }
  }, createBody);

  const createResult = JSON.parse(createRes.body);
  console.log('Create status:', createRes.statusCode);
  console.log('Site URL:', createResult.siteUrl);
  console.log('Version ID:', createResult.upload.versionId);

  const uploadMap = {};
  createResult.upload.uploads.forEach(u => {
    uploadMap[u.path] = u;
  });

  let uploaded = 0;
  let failed = 0;
  const total = files.length;

  async function uploadFileWithRetry(file) {
    const upload = uploadMap[file.path];
    if (!upload) {
      console.error('No upload URL for:', file.path);
      failed++;
      return;
    }

    try {
      await uploadFile(file, upload.url);
      uploaded++;
      if (uploaded % 50 === 0) console.log('Uploaded ' + uploaded + '/' + total);
    } catch (e) {
      console.error('Upload failed for', file.path, ':', e.message);
      failed++;
    }
  }

  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(batch.map(f => uploadFileWithRetry(f)));
    console.log('Uploaded batch ' + Math.floor(i / batchSize) + 1 + ' of ' + Math.ceil(files.length / batchSize));
  }

  console.log('Upload complete. Uploaded:', uploaded, 'Failed:', failed);

  if (failed > 0) {
    console.log('Some files failed. Retrying failed uploads...');
    const failedFiles = files.filter(f => {
      const upload = uploadMap[f.path];
      return !upload; // Simplified - just retry all remaining
    });
    // Actually just retry all files
    uploaded = 0;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(batch.map(f => uploadFileWithRetry(f)));
      console.log('Retry batch ' + Math.floor(i / batchSize) + 1 + ' of ' + Math.ceil(files.length / batchSize));
    }
  }

  const finalizeBody = JSON.stringify({ versionId: createResult.upload.versionId });
  const finalizeUrl = new URL(createResult.upload.finalizeUrl);
  
  console.log('Finalizing...');
  const finalizeRes = await httpRequest({
    hostname: finalizeUrl.hostname,
    port: 443,
    path: finalizeUrl.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(finalizeBody)
    }
  }, finalizeBody);

  console.log('Finalize status:', finalizeRes.statusCode);
  console.log('Finalize body:', finalizeRes.body);
  console.log('SITE LIVE at:', createResult.siteUrl);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  console.error(e.stack);
});
