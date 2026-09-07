// Generates a signed, expiring magic link for a shop.
// Usage (Windows cmd, from D:\ration-saathi):
//   set MAGIC_LINK_SECRET=your-secret-from-env && node scripts/generate-shop-link.js ANDHERI1 30
//
// Args: <shop login code> <days valid, default 30>
const crypto = require('crypto');

const shop = process.argv[2];
const days = Number(process.argv[3]) || 30;

if (!shop) {
  console.error('Usage: node scripts/generate-shop-link.js <SHOP_CODE> [daysValid]');
  process.exit(1);
}

const secret = process.env.MAGIC_LINK_SECRET;
if (!secret) {
  console.error('MAGIC_LINK_SECRET is not set. Run with: set MAGIC_LINK_SECRET=yourvalue && node scripts/generate-shop-link.js ...');
  process.exit(1);
}

const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
const sig = crypto.createHmac('sha256', secret).update(`${shop}.${exp}`).digest('hex');

const url = `http://localhost:3000/shops/login?shop=${encodeURIComponent(shop)}&exp=${exp}&sig=${sig}`;

console.log('\nSigned link (valid ' + days + ' days):\n');
console.log(url);
console.log('\nFor production, replace localhost:3000 with your real deployed domain.\n');