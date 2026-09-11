const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectVersionsCommand,
  CopyObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

async function uploadFile(key, buffer, mimetype) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  const response = await s3Client.send(command);
  return response;
}

async function downloadFile(key, versionId) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    VersionId: versionId,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return url;
}

async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response;
}

async function getFileVersions(key) {
  const command = new ListObjectVersionsCommand({
    Bucket: BUCKET_NAME,
    Prefix: key,
  });

  const response = await s3Client.send(command);
  return response.Versions || [];
}

async function restoreVersion(key, versionId) {
  const command = new CopyObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    CopySource: `${BUCKET_NAME}/${key}?versionId=${versionId}`,
  });

  const response = await s3Client.send(command);
  return response;
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  getFileVersions,
  restoreVersion,
};
