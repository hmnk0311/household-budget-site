// Local preview server for app/ (Node 22, standard library only).
//   node serve.ts [--port 8123]
// Serves the static site exactly as a browser will meet it in the hand-in:
// no build step, no rewrites, and it refuses paths outside app/.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const portFlag = process.argv.indexOf('--port');
const parsed = portFlag === -1 ? 8080 : Number(process.argv[portFlag + 1]);
const port = Number.isInteger(parsed) && parsed > 0 && parsed < 65536 ? parsed : 8080;

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

createServer((req, res) => {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const filePath = resolve(join(appRoot, normalize(pathname)));
  if (filePath !== appRoot && !filePath.startsWith(appRoot + sep)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    const stats = statSync(filePath);
    if (!stats.isFile()) throw new Error('not a file');
    res.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'content-length': stats.size,
      'cache-control': 'no-store',
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Kakeibo Ledger preview: http://localhost:${port}`);
});
