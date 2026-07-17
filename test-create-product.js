const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testCreateProduct() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/users/admin-login', {
      email: 'ecompaidhu@gmail.com',
      password: 'Paidhu2026'
    });
    
    const token = loginRes.data.token;
    console.log("Logged in successfully, token received.");

    // 2. Create product
    const form = new FormData();
    form.append('name', 'Test Script Product');
    form.append('description', 'This is a test product from script');
    form.append('price', '199');
    form.append('stock', '50');
    form.append('category', 'Saffron');
    form.append('shortDescription', 'Short test');
    form.append('featured', 'true');
    form.append('status', 'ACTIVE');
    
    // Create a dummy image file
    fs.writeFileSync('dummy.jpg', 'fake image content');
    form.append('images', fs.createReadStream('dummy.jpg'));

    const createRes = await axios.post('http://localhost:5000/api/products', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Product created successfully:", createRes.data);
  } catch (error) {
    console.error("Error creating product:");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testCreateProduct();
