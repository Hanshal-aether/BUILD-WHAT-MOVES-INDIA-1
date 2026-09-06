const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SHOPS = [
  { name: 'Andheri Fair Price Shop', address: 'Andheri West, Mumbai, Maharashtra', loginCode: 'ANDHERI1' },
  { name: 'Dombivli Fair Price Shop', address: 'Dombivli East, Thane, Maharashtra', loginCode: 'DOMBIVLI1' },
  { name: 'Thane Fair Price Shop', address: 'Naupada, Thane, Maharashtra', loginCode: 'THANE1' },
  { name: 'Malad Fair Price Shop', address: 'Malad West, Mumbai, Maharashtra', loginCode: 'MALAD1' },
  { name: 'Dadar Fair Price Shop', address: 'Dadar East, Mumbai, Maharashtra', loginCode: 'DADAR1' },
  { name: 'Chembur Fair Price Shop', address: 'Chembur, Mumbai, Maharashtra', loginCode: 'CHEMBUR1' },
  { name: 'Kurla Fair Price Shop', address: 'Kurla West, Mumbai, Maharashtra', loginCode: 'KURLA1' },
  { name: 'Worli Fair Price Shop', address: 'Worli, Mumbai, Maharashtra', loginCode: 'WORLI1' },
];
const SHOP_PIN = '1234'; // demo PIN, same for every seeded shop

const IMAGES = ['/images/shops/shop-1.svg', '/images/shops/shop-2.svg', '/images/shops/shop-3.svg'];

async function main() {
  console.log('Seeding database...');

  // Wipe anything from a previous run so this script is safe to re-run
  // (also clears out any old demo applications / booked slots).
  await prisma.timeSlot.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.fairPriceShop.deleteMany({});

  // Citizens
  await prisma.citizen.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: { phone: '9876543210', name: 'Ravi Kumar', state: 'Maharashtra' },
  });
  await prisma.citizen.upsert({
    where: { phone: '9876543211' },
    update: {},
    create: { phone: '9876543211', name: 'Aisha Khan', state: 'Maharashtra' },
  });
  await prisma.citizen.upsert({
    where: { phone: '9876543212' },
    update: {},
    create: { phone: '9876543212', name: 'Meera Nair', state: 'Maharashtra' },
  });

  // A citizen with an already-approved card, for demoing shop-side check-in.
  await prisma.citizen.upsert({
    where: { phone: '9876543213' },
    update: {},
    create: {
      phone: '9876543213',
      name: 'Suresh Patil',
      rationCardNumber: 'MH-RC-2026-004821',
      state: 'Maharashtra',
    },
  });

  // Shops + time slots
  const shopRecords = [];
  for (let i = 0; i < SHOPS.length; i++) {
    const s = SHOPS[i];
    const shop = await prisma.fairPriceShop.create({
      data: {
        name: s.name,
        address: s.address,
        state: 'Maharashtra',
        image: IMAGES[i % IMAGES.length],
        loginCode: s.loginCode,
        pin: SHOP_PIN,
      },
    });
    shopRecords.push(shop);

    const today = new Date();
    const slotTimes = [
      ['10:00', '11:30'],
      ['11:30', '13:00'],
      ['14:00', '15:30'],
      ['15:30', '17:00'],
    ];
    for (let d = 0; d < 3; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toISOString().slice(0, 10);
      for (const [startTime, endTime] of slotTimes) {
        await prisma.timeSlot.create({
          data: { shopId: shop.id, date: dateStr, startTime, endTime, isBooked: false },
        });
      }
    }
  }

  // No fake applications are seeded — the Status page only ever shows
  // applications a real citizen actually submits through the app.

  console.log('Seed complete:', {
    citizens: 4,
    shops: shopRecords.length,
    applications: 0,
    timeSlots: shopRecords.length * 3 * 4,
  });
  console.log('\nShop staff logins (code / PIN), for the /shops/login demo:');
  for (const s of SHOPS) console.log(`  ${s.name}: ${s.loginCode} / ${SHOP_PIN}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
