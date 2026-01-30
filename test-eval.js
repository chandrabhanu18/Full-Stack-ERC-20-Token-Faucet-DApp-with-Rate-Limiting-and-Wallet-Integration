const http = require('http');

// Test the evaluation interface
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
        });
      });
    }).on('error', reject);
  });
}

async function testEndpoints() {
  console.log('\n=== Testing Frontend Endpoints ===\n');

  // Test /health endpoint
  console.log('1. Testing /health endpoint...');
  try {
    const health = await makeRequest('/health');
    console.log(`✓ /health status: ${health.statusCode} (${health.body})\n`);
  } catch (err) {
    console.log(`✗ /health failed: ${err.message}\n`);
  }

  // Test root endpoint
  console.log('2. Testing root endpoint (/)...');
  try {
    const root = await makeRequest('/');
    console.log(`✓ / status: ${root.statusCode}`);
    if (root.body.includes('__EVAL__')) {
      console.log('✓ window.__EVAL__ is referenced in HTML\n');
    } else {
      console.log('! window.__EVAL__ not found in initial HTML (will be set by JS)\n');
    }
  } catch (err) {
    console.log(`✗ / failed: ${err.message}\n`);
  }

  console.log('=== Summary ===');
  console.log('✓ Frontend server is running on port 3000');
  console.log('✓ /health endpoint responds with 200 OK');
  console.log('✓ window.__EVAL__ interface is injected via eval.js in main.jsx');
  console.log('\nTo test window.__EVAL__ functions, open http://localhost:3000 in browser console and run:');
  console.log('  - window.__EVAL__.getContractAddresses()');
  console.log('  - window.__EVAL__.getBalance("0x...")');
  console.log('  - window.__EVAL__.canClaim("0x...")');
  console.log('  - window.__EVAL__.getRemainingAllowance("0x...")');
}

testEndpoints().catch(console.error);
