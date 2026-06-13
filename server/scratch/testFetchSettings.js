const http = require('http');

http.get('http://localhost:5000/api/settings', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Response Status:", res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log("Settings Response JSON:", JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log("Raw Response Data:", data);
    }
    process.exit(0);
  });
}).on('error', (e) => {
  console.error("Error fetching settings:", e.message);
  process.exit(1);
});
