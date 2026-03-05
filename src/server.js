const http = require('http');
const app = require('./app');
const { port } = require('./config/env');

const server = http.createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});

