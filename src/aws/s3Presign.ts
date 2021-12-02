import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from './s3Client';

const BUCKET_NAME = process.env.PAPARAZZO_BUCKET_NAME;
const PRESIGN_EXPIRES_IN = Number(process.env.PRESIGN_EXPIRES_IN) || 100;

export async function generateURLforDownload(raceId: string) {
  const objectKey = raceId + '.png';
  const param = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
  };
  const command = new GetObjectCommand(param);
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGN_EXPIRES_IN,
  });
  return url;
}
