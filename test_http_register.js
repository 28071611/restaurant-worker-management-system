const http = require('http');

const postData = JSON.stringify({
    name: 'Harish',
    email: 'harishr24Cs@srishakthi.ac.in',
    password: 'password123',
    phone: '8015153200',
    role: 'admin'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log('STATUS:', res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log('BODY:', chunk);
    });
});

req.on('error', (e) => {
    console.error('problem with request:', e.message);
});

req.write(postData);
req.end();
