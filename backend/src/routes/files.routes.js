const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');
const filesController = require('../controllers/files.controller');

const router = express.Router();

router.use(authMiddleware);

router.post('/upload', uploadMiddleware, filesController.upload);
router.get('/', filesController.list);
router.get('/:id/download', filesController.download);
router.delete('/:id', filesController.remove);
router.get('/:id/versions', filesController.versions);
router.post('/:id/restore/:version', filesController.restore);

module.exports = router;
