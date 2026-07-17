const fs = require('fs');

async function testEndpoint() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/users/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ecompaidhu@gmail.com', password: 'Paidhu2026' })
    });
    
    if (!loginRes.ok) {
      const text = await loginRes.text();
      throw new Error(`Login failed: ${loginRes.status} ${text}`);
    }
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Logged in, token:", token.substring(0, 20) + '...');

    // 2. Create Product
    const formData = new FormData();
    formData.append('name', 'Script Product');
    formData.append('description', 'Test');
    formData.append('price', '100');
    formData.append('stock', '10');
    
    // Node.js 18+ FormData requires File or Blob for files. 
    // We can use a simple text Blob to simulate a file, or just skip it since it's optional in controller.
    
    const createRes = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const createText = await createRes.text();
    console.log(`Create Product Status: ${createRes.status}`);
    console.log(`Create Product Response:`, createText);

  } catch (err) {
    console.error("Test script failed:", err.message);
  }
}

testEndpoint();
