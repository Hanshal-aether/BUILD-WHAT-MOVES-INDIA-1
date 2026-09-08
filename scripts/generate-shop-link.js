// Generates a signed, expiring magic link for a shop.
// Usage (Windows cmd, from D:\ration-saathi):
//   set MAGIC_LINK_SECRET=your-secret-from-env && node scripts/generate-shop-link.js ANDHERI1 30
//   set MAGIC_LINK_SECRET=your-secret-from-env && node scripts/generate-shop-link.js ANDHERI1 30 https://ration-saathi-lime.vercel.app
//
// Args: <shop login code> <days valid, default 30> <base URL, default http://localhost:3000>
//
// IMPORTANT: MAGIC_LINK_SECRET here must be the EXACT same value you have
// set in Vercel (Project Settings -> Environment Variables) for whichever
// deployment the link will be opened against. If they don't match, the
// deployed site's /api/shops/auth-token will reject the link as invalid —
// this script signs the link, but your live server is what verifies it,
// and they only agree if both sides use the same secret.
const crypto = require('crypto');

const shop = process.argv[2];
const days = Number(process.argv[3]) || 30;
const baseUrl = (process.argv[4] || 'http://localhost:3000').replace(/\/$/, '');

if (!shop) {
  console.error('Usage: node scripts/generate-shop-link.js <SHOP_CODE> [daysValid] [baseUrl]');
  process.exit(1);
}

const secret = process.env.MAGIC_LINK_SECRET;
if (!secret) {
  console.error('MAGIC_LINK_SECRET is not set. Run with: set MAGIC_LINK_SECRET=yourvalue && node scripts/generate-shop-link.js ...');
  process.exit(1);
}

const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
const sig = crypto.createHmac('sha256', secret).update(`${shop}.${exp}`).digest('hex');

const url = `${baseUrl}/shops/login?shop=${encodeURIComponent(shop)}&exp=${exp}&sig=${sig}`;

console.log('\nSigned link (valid ' + days + ' days):\n');
console.log(url);
if (baseUrl.includes('localhost')) {
  console.log('\nThis points at localhost. For your deployed site, pass the domain as a 3rd argument, e.g.:');
  console.log(`  node scripts/generate-shop-link.js ${shop} ${days} https://ration-saathi-lime.vercel.app\n`);
} else {
  console.log('');
}
