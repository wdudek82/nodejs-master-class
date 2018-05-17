const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('<h1>Hello, World!:)</h1>');
  } else if (req.url === '/api/courses') {
    res.write(JSON.stringify(['item 1', 'item 2', 'item 3', 'item 4']));
  }
  res.end();
});

server.listen(5000, () => {
  console.log('Listen on port 5000');
});

server.on('connection', (socket) => {
  console.log('new connection');
});
