import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET_NAME = process.env.PAPARAZZO_BUCKET_NAME;
const OBJECT_DOWNLOAD_LIMIT_SECONDS =
  Number(process.env.OBJECT_DOWNLOAD_LIMIT_SECONDS) || 100;
const s3 = new S3Client({ region: 'ap-northeast-1' });

export async function generateURLforDownload(objectKey: string) {
  const param = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
  };
  const command = new GetObjectCommand(param);
  const url = await getSignedUrl(s3, command, {
    expiresIn: OBJECT_DOWNLOAD_LIMIT_SECONDS,
  });
  return url;
}
