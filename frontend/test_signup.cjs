const http = require('http');

const data = JSON.stringify({
  fullName: 'Test User',
  username: 'testuser123',
  email: 'test@example.com',
  password: 'TestPass123'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();
