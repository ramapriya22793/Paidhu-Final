const https = require('https');

https.get('https://paidhu-final-anm2.vercel.app/api/settings', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const settings = JSON.parse(data);
      console.log('Hero image from API:', settings.ourCommunityData?.hero?.image ? settings.ourCommunityData.hero.image.substring(0, 100) + '...' : 'NONE');
      console.log('Tribe image from API:', settings.ourCommunityData?.findYourTribe?.image ? settings.ourCommunityData.findYourTribe.image.substring(0, 100) + '...' : 'NONE');
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
