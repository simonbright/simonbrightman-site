import { request } from 'node:https';

function head(url) {
  return new Promise((resolve, reject) => {
    request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location || '' });
    }).on('error', reject).end();
  });
}

const apex = await head('https://simonbrightman.com/');
const www = await head('https://www.simonbrightman.com/');

console.log(`Apex: HTTP ${apex.status}`);
console.log(`WWW: HTTP ${www.status}${www.location ? ` → ${www.location}` : ''}`);

if (apex.status !== 200) process.exit(1);
if (www.status !== 301 && www.status !== 302) process.exit(1);
