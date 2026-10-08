const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const HOSTNAME = 'localhost';

const server = http.createServer((req, res) => {
  if (req.url === '/config.json') {
    fs.readFile(path.join(__dirname, 'config.json'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('{}');
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
    return;
  }

  const requestPath = new URL(req.url, `http://${HOSTNAME}`).pathname;
  let filePath = path.join(__dirname, requestPath === '/' ? 'Index.html' : requestPath.slice(1));
  const extname = path.extname(filePath);
  
  let contentType = 'text/html';
  switch(extname) {
    case '.js': contentType = 'application/javascript'; break;
    case '.css': contentType = 'text/css'; break;
    case '.json': contentType = 'application/json'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
    case '.ico': contentType = 'image/x-icon'; break;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});
