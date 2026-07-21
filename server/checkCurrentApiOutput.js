const axios = require('axios');

async function run() {
  try {
    const res = await axios.get('https://paidhu-final-anm2.vercel.app/api/products?limit=1000&status=all');
    const products = res.data.products || res.data;
    console.log("Total products fetched from API:", products.length);
    const sample = products.find(p => p.name === "Gift Box");
    console.log("Gift Box returned fields:", Object.keys(sample));
    console.log("Gift Box seoKeywords value:", JSON.stringify(sample.seoKeywords));
  } catch (e) {
    console.error(e.message);
  }
}

run();
