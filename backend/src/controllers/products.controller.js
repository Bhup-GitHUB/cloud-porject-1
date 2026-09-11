const prisma = require('../lib/prisma');
const rankingService = require('../services/ranking.service');

async function list(req, res) {
  const result = await rankingService.getRankedProductsForUser(req.userId);
  return res.json(result);
}

async function recordView(req, res) {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  await rankingService.recordView(req.userId, id);

  return res.status(204).send();
}

module.exports = { list, recordView };
