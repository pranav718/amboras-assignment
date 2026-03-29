import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '../entities/user.entity';
import { Event } from '../entities/event.entity';
import { DailyMetric } from '../entities/daily-metric.entity';
import { ProductMetric } from '../entities/product-metric.entity';

const PRODUCTS = [
  { id: 'prod_001', name: 'Wireless Earbuds Pro', price: 79.99 },
  { id: 'prod_002', name: 'Phone Case Ultra', price: 29.99 },
  { id: 'prod_003', name: 'USB-C Hub 7-in-1', price: 49.99 },
  { id: 'prod_004', name: 'Laptop Stand Adjustable', price: 39.99 },
  { id: 'prod_005', name: 'Mechanical Keyboard RGB', price: 129.99 },
  { id: 'prod_006', name: 'Mouse Pad XXL', price: 19.99 },
  { id: 'prod_007', name: 'Webcam HD 1080p', price: 59.99 },
  { id: 'prod_008', name: 'Monitor Light Bar', price: 44.99 },
  { id: 'prod_009', name: 'Cable Management Kit', price: 14.99 },
  { id: 'prod_010', name: 'Desk Organizer Premium', price: 34.99 },
  { id: 'prod_011', name: 'Wireless Charger Pad', price: 24.99 },
  { id: 'prod_012', name: 'Bluetooth Speaker Mini', price: 49.99 },
  { id: 'prod_013', name: 'Smart Plug 4-Pack', price: 39.99 },
  { id: 'prod_014', name: 'LED Desk Lamp', price: 54.99 },
  { id: 'prod_015', name: 'Noise Cancelling Headphones', price: 199.99 },
  { id: 'prod_016', name: 'Portable SSD 1TB', price: 89.99 },
  { id: 'prod_017', name: 'Ergonomic Mouse', price: 69.99 },
  { id: 'prod_018', name: 'Screen Protector 3-Pack', price: 12.99 },
  { id: 'prod_019', name: 'Power Bank 20000mAh', price: 44.99 },
  { id: 'prod_020', name: 'Gaming Headset', price: 149.99 },
];

const EVENT_WEIGHTS = [
  { type: 'page_view', weight: 60 },
  { type: 'add_to_cart', weight: 15 },
  { type: 'remove_from_cart', weight: 5 },
  { type: 'checkout_started', weight: 10 },
  { type: 'purchase', weight: 10 },
];

const STORES = [
  {
    store_id: 'store_001',
    store_name: 'TechGear Pro',
    email: 'demo@store1.com',
  },
  {
    store_id: 'store_002',
    store_name: 'GadgetWorld',
    email: 'demo@store2.com',
  },
];

function pickWeightedEventType(): string {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const { type, weight } of EVENT_WEIGHTS) {
    cumulative += weight;
    if (rand <= cumulative) return type;
  }
  return 'page_view';
}

function pickRandomProduct() {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}

function randomTimestampInLast30Days(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysAgo,
    hoursAgo,
    minutesAgo,
  );
}

async function seed() {
  console.log(' Starting seed...');

  const dataSource = new DataSource({
    type: 'postgres',
    url:
      process.env.DATABASE_URL ||
      'postgresql://amboras:amboras_secret@localhost:5432/amboras_analytics',
    entities: [User, Event, DailyMetric, ProductMetric],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log(' Database connected');

  await dataSource.query('DELETE FROM product_metrics');
  await dataSource.query('DELETE FROM daily_metrics');
  await dataSource.query('DELETE FROM events');
  await dataSource.query('DELETE FROM users');
  console.log(' Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);
  for (const store of STORES) {
    await dataSource.getRepository(User).save({
      email: store.email,
      password: hashedPassword,
      store_id: store.store_id,
      store_name: store.store_name,
    });
  }
  console.log(' Created demo users');

  const EVENTS_PER_STORE = 25000;
  const BATCH_SIZE = 1000;

  for (const store of STORES) {
    console.log(`\n Generating events for ${store.store_name}...`);

    const dailyAccum: Record<string, any> = {};
    const productAccum: Record<string, any> = {};

    let eventBatch: any[] = [];

    for (let i = 0; i < EVENTS_PER_STORE; i++) {
      const eventType = pickWeightedEventType();
      const product = pickRandomProduct();
      const timestamp = randomTimestampInLast30Days();
      const dateStr = timestamp.toISOString().split('T')[0];
      const eventId = `evt_${store.store_id}_${uuid().slice(0, 8)}_${i}`;

      let data: Record<string, any> = {};
      if (eventType === 'page_view') {
        data = { url: `/products/${product.id}` };
      } else if (
        eventType === 'add_to_cart' ||
        eventType === 'remove_from_cart'
      ) {
        data = { product_id: product.id, product_name: product.name };
      } else if (eventType === 'checkout_started') {
        data = {
          product_id: product.id,
          amount: product.price,
          currency: 'USD',
        };
      } else if (eventType === 'purchase') {
        data = {
          product_id: product.id,
          product_name: product.name,
          amount: product.price,
          currency: 'USD',
        };
      }

      eventBatch.push({
        event_id: eventId,
        store_id: store.store_id,
        event_type: eventType,
        timestamp,
        data,
      });

      const dailyKey = `${store.store_id}_${dateStr}`;
      if (!dailyAccum[dailyKey]) {
        dailyAccum[dailyKey] = {
          store_id: store.store_id,
          date: dateStr,
          total_revenue: 0,
          page_views: 0,
          add_to_cart: 0,
          remove_from_cart: 0,
          checkout_started: 0,
          purchases: 0,
        };
      }

      const columnMap: Record<string, string> = {
        page_view: 'page_views',
        add_to_cart: 'add_to_cart',
        remove_from_cart: 'remove_from_cart',
        checkout_started: 'checkout_started',
        purchase: 'purchases',
      };

      dailyAccum[dailyKey][columnMap[eventType]]++;
      if (eventType === 'purchase') {
        dailyAccum[dailyKey].total_revenue += product.price;
      }

      if (eventType === 'purchase') {
        const prodKey = `${store.store_id}_${product.id}_${dateStr}`;
        if (!productAccum[prodKey]) {
          productAccum[prodKey] = {
            store_id: store.store_id,
            product_id: product.id,
            date: dateStr,
            revenue: 0,
            quantity_sold: 0,
          };
        }
        productAccum[prodKey].revenue += product.price;
        productAccum[prodKey].quantity_sold++;
      }

      if (eventBatch.length >= BATCH_SIZE) {
        await dataSource.getRepository(Event).save(eventBatch);
        eventBatch = [];
        process.stdout.write(`  ${i + 1}/${EVENTS_PER_STORE} events\r`);
      }
    }

    if (eventBatch.length > 0) {
      await dataSource.getRepository(Event).save(eventBatch);
    }
    console.log(`   ${EVENTS_PER_STORE} events created`);

    const dailyRows = Object.values(dailyAccum);
    await dataSource.getRepository(DailyMetric).save(dailyRows);
    console.log(`   ${dailyRows.length} daily metric rows created`);

    const productRows = Object.values(productAccum);
    await dataSource.getRepository(ProductMetric).save(productRows);
    console.log(`   ${productRows.length} product metric rows created`);
  }

  console.log('\n Seed complete!');
  console.log('\nDemo credentials:');
  console.log('  Store 1: demo@store1.com / password123');
  console.log('  Store 2: demo@store2.com / password123');

  await dataSource.destroy();
  process.exit(0);
}

seed().catch((error) => {
  console.error(' Seed failed:', error);
  process.exit(1);
});
