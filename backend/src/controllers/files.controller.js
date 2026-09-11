const prisma = require('../lib/prisma');
const s3Service = require('../services/s3.service');

async function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const { originalname, buffer, mimetype, size } = req.file;

  const latest = await prisma.file.findFirst({
    where: { userId: req.userId, filename: originalname },
    orderBy: { version: 'desc' },
  });

  const version = latest ? latest.version + 1 : 1;
  const s3Key = `users/${req.userId}/${originalname}`;

  const uploadResult = await s3Service.uploadFile(s3Key, buffer, mimetype);

  const file = await prisma.file.create({
    data: {
      filename: originalname,
      s3Key,
      version,
      s3VersionId: uploadResult.VersionId,
      size,
      userId: req.userId,
    },
  });

  return res.status(201).json(file);
}

async function list(req, res) {
  const files = await prisma.file.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  const latestByFilename = new Map();
  for (const file of files) {
    const existing = latestByFilename.get(file.filename);
    if (!existing || file.version > existing.version) {
      latestByFilename.set(file.filename, file);
    }
  }

  const result = Array.from(latestByFilename.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res.json(result);
}

async function download(req, res) {
  const { id } = req.params;

  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  if (file.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const url = await s3Service.downloadFile(file.s3Key, file.s3VersionId);
  return res.json({ url });
}

async function remove(req, res) {
  const { id } = req.params;

  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  if (file.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await s3Service.deleteFile(file.s3Key);
  await prisma.file.delete({ where: { id } });

  return res.status(204).send();
}

async function versions(req, res) {
  const { id } = req.params;

  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  if (file.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const fileVersions = await prisma.file.findMany({
    where: { userId: req.userId, filename: file.filename },
    orderBy: { version: 'asc' },
    select: { id: true, version: true, createdAt: true },
  });

  return res.json(fileVersions);
}

async function restore(req, res) {
  const { id, version } = req.params;
  const versionNumber = parseInt(version, 10);

  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  if (file.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const targetVersion = await prisma.file.findFirst({
    where: { userId: req.userId, filename: file.filename, version: versionNumber },
  });
  if (!targetVersion) {
    return res.status(404).json({ error: 'Version not found' });
  }

  const restoreResult = await s3Service.restoreVersion(
    targetVersion.s3Key,
    targetVersion.s3VersionId
  );

  const latest = await prisma.file.findFirst({
    where: { userId: req.userId, filename: file.filename },
    orderBy: { version: 'desc' },
  });

  const nextVersion = latest.version + 1;

  const newFile = await prisma.file.create({
    data: {
      filename: targetVersion.filename,
      s3Key: targetVersion.s3Key,
      version: nextVersion,
      s3VersionId: restoreResult.VersionId,
      size: targetVersion.size,
      userId: req.userId,
    },
  });

  return res.status(201).json(newFile);
}

module.exports = { upload, list, download, remove, versions, restore };
