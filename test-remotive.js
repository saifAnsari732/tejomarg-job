const https = require('https');

https.get('https://remotive.com/api/remote-jobs?limit=10', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Remotive jobs found:', parsed.jobs?.length);
      console.log('First job:', parsed.jobs?.[0]?.title, parsed.jobs?.[0]?.company_name);
    } catch (e) {
      console.error(e);
    }
  });
});
