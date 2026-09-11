const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const productsController = require('../controllers/products.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', productsController.list);
router.post('/:id/view', productsController.recordView);

module.exports = router;
