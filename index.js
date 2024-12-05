const http = require('http');

let items = []; // Array to store items

const server = http.createServer((req, res) => {
  const { method, url } = req;

  console.log(`Received ${method} request to ${url}`); // Log incoming requests

  // Root Route (GET /): Welcome message
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the Simple Node.js API! Use /items to interact.');
  }
  // GET /items: Retrieve all items
  else if (method === 'GET' && url === '/items') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ items }));
  }
  // POST /items: Add a new item
  else if (method === 'POST' && url === '/items') {
    let body = '{     "name": "David", "age": 22, "gender": "male",  }';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { item } = JSON.parse(body);
        if (!item) {
          throw new Error('Item is required');
        }
        items.push(item);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item added', items }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    });
  }
  // DELETE /items: Clear all items
  else if (method === 'DELETE' && url === '/items') {
    items = [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'All items cleared' }));
  }
  // Fallback for unsupported routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});


// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
