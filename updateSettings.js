const http = require('http');

http.get('http://localhost:5000/api/settings', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const settings = JSON.parse(data);
      if (!settings.ourCommunityData) {
        console.log("No ourCommunityData found");
        return;
      }
      
      settings.ourCommunityData.hero.image = '/hero_family.png';

      const putData = JSON.stringify({ ourCommunityData: settings.ourCommunityData });
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/settings',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(putData)
        }
      };

      const req = http.request(options, (res2) => {
        let resData = '';
        res2.on('data', chunk => resData += chunk);
        res2.on('end', () => {
          console.log("Response status:", res2.statusCode);
          console.log("Response data:", resData);
        });
      });

      req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
      });

      req.write(putData);
      req.end();
      
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
