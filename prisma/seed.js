const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SHOPS = [
  { name: 'Andheri Fair Price Shop', address: 'Andheri West, Mumbai, Maharashtra' },
  { name: 'Dombivli Fair Price Shop', address: 'Dombivli East, Thane, Maharashtra' },
  { name: 'Thane Fair Price Shop', address: 'Naupada, Thane, Maharashtra' },
  { name: 'Malad Fair Price Shop', address: 'Malad West, Mumbai, Maharashtra' },
  { name: 'Dadar Fair Price Shop', address: 'Dadar East, Mumbai, Maharashtra' },
  { name: 'Chembur Fair Price Shop', address: 'Chembur, Mumbai, Maharashtra' },
  { name: 'Kurla Fair Price Shop', address: 'Kurla West, Mumbai, Maharashtra' },
  { name: 'Worli Fair Price Shop', address: 'Worli, Mumbai, Maharashtra' },
];

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
    citizens: 3,
    shops: shopRecords.length,
    applications: 0,
    timeSlots: shopRecords.length * 3 * 4,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
