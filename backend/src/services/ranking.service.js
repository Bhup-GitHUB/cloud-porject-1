const prisma = require('../lib/prisma');

async function getRankedProductsForUser(userId) {
  const products = await prisma.product.findMany();

  const views = await prisma.productView.findMany({
    where: { userId },
    include: { product: true },
  });

  const categoryViewCounts = {};
  for (const view of views) {
    const category = view.product.category;
    categoryViewCounts[category] = (categoryViewCounts[category] || 0) + 1;
  }

  const ratings = products.map((product) => product.rating);
  const salesCounts = products.map((product) => product.salesCount);

  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const minSales = Math.min(...salesCounts);
  const maxSales = Math.max(...salesCounts);

  const maxCategoryViews = Math.max(0, ...Object.values(categoryViewCounts));

  const ranked = products.map((product) => {
    const normalizedRating = (product.rating - minRating) / (maxRating - minRating || 1);
    const normalizedSales = (product.salesCount - minSales) / (maxSales - minSales || 1);
    const popularityScore = (normalizedRating + normalizedSales) / 2;

    const affinityScore =
      maxCategoryViews > 0 ? (categoryViewCounts[product.category] || 0) / maxCategoryViews : 0;

    const finalScore = popularityScore * 0.7 + affinityScore * 0.3;

    return { ...product, score: finalScore };
  });

  ranked.sort((a, b) => b.score - a.score);

  return ranked;
}

async function recordView(userId, productId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return null;
  }

  return prisma.productView.create({
    data: { userId, productId },
  });
}

module.exports = { getRankedProductsForUser, recordView };
