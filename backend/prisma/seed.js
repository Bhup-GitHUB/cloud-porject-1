const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 149.99, rating: 4.6, salesCount: 980, seed: 'elec-headphones' },
  { name: '4K Ultra HD Smart TV 55"', category: 'Electronics', price: 499.99, rating: 4.4, salesCount: 320, seed: 'elec-tv' },
  { name: 'Portable Bluetooth Speaker', category: 'Electronics', price: 39.99, rating: 4.1, salesCount: 1450, seed: 'elec-speaker' },
  { name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 89.99, rating: 4.3, salesCount: 75, seed: 'elec-keyboard' },
  { name: 'Non-Stick Frying Pan Set', category: 'Home', price: 59.99, rating: 4.5, salesCount: 610, seed: 'home-frying-pan' },
  { name: 'Memory Foam Pillow', category: 'Home', price: 24.99, rating: 4.2, salesCount: 890, seed: 'home-pillow' },
  { name: 'Robot Vacuum Cleaner', category: 'Home', price: 219.99, rating: 4.0, salesCount: 44, seed: 'home-vacuum' },
  { name: 'Scented Soy Candle Set', category: 'Home', price: 18.99, rating: 4.7, salesCount: 1230, seed: 'home-candle' },
  { name: "Men's Slim Fit Denim Jacket", category: 'Fashion', price: 69.99, rating: 3.9, salesCount: 210, seed: 'fashion-jacket' },
  { name: "Women's Running Sneakers", category: 'Fashion', price: 84.99, rating: 4.5, salesCount: 1560, seed: 'fashion-sneakers' },
  { name: 'Leather Crossbody Bag', category: 'Fashion', price: 54.99, rating: 4.3, salesCount: 330, seed: 'fashion-bag' },
  { name: 'Classic Aviator Sunglasses', category: 'Fashion', price: 29.99, rating: 3.8, salesCount: 95, seed: 'fashion-sunglasses' },
  { name: 'The Midnight Library', category: 'Books', price: 14.99, rating: 4.8, salesCount: 2200, seed: 'books-midnight-library' },
  { name: 'Atomic Habits', category: 'Books', price: 16.99, rating: 4.9, salesCount: 3100, seed: 'books-atomic-habits' },
  { name: 'A Brief History of Time', category: 'Books', price: 12.99, rating: 4.6, salesCount: 540, seed: 'books-brief-history' },
  { name: 'The Silent Patient', category: 'Books', price: 13.99, rating: 4.4, salesCount: 128, seed: 'books-silent-patient' },
  { name: 'Adjustable Dumbbell Set', category: 'Sports', price: 129.99, rating: 4.5, salesCount: 410, seed: 'sports-dumbbell' },
  { name: 'Yoga Mat with Carry Strap', category: 'Sports', price: 22.99, rating: 4.3, salesCount: 1780, seed: 'sports-yoga-mat' },
  { name: 'Insulated Water Bottle', category: 'Sports', price: 19.99, rating: 4.7, salesCount: 2050, seed: 'sports-water-bottle' },
  { name: 'Trail Running Backpack', category: 'Sports', price: 74.99, rating: 3.7, salesCount: 62, seed: 'sports-backpack' },
  { name: 'Hydrating Facial Serum', category: 'Beauty', price: 27.99, rating: 4.6, salesCount: 970, seed: 'beauty-serum' },
  { name: 'Matte Liquid Lipstick Set', category: 'Beauty', price: 21.99, rating: 4.1, salesCount: 640, seed: 'beauty-lipstick' },
  { name: 'Electric Facial Cleansing Brush', category: 'Beauty', price: 34.99, rating: 3.9, salesCount: 88, seed: 'beauty-cleansing-brush' },
  { name: 'Argan Oil Hair Mask', category: 'Beauty', price: 15.99, rating: 4.4, salesCount: 350, seed: 'beauty-hair-mask' },
];

async function main() {
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: `https://picsum.photos/seed/${product.seed}/400/300`,
        rating: product.rating,
        salesCount: product.salesCount,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
