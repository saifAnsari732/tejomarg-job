const https = require('https');

https.get('https://www.arbeitnow.com/api/job-board-api', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Arbeitnow jobs found:', parsed.data?.length);
      console.log('First job:', parsed.data?.[0]?.title, parsed.data?.[0]?.company_name);
    } catch (e) {
      console.error(e);
    }
  });
});
