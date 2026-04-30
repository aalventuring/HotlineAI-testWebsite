import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.mjs':  'text/javascript',
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  const tryPaths = [
    filePath,
    filePath + '.html',
    path.join(filePath, 'index.html'),
  ];

  const tryNext = (paths) => {
    if (paths.length === 0) { res.writeHead(404); res.end('Not found'); return; }
    const [current, ...rest] = paths;
    fs.readFile(current, (err, data) => {
      if (err) { tryNext(rest); return; }
      const ext = path.extname(current);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  };

  tryNext(tryPaths);
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
