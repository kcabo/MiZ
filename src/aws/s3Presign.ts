import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET_NAME = process.env.PAPARAZZO_BUCKET_NAME;
const PRESIGN_EXPIRES_IN = Number(process.env.PRESIGN_EXPIRES_IN) || 100;
const s3 = new S3Client({ region: 'ap-northeast-1' });

export async function generateURLforDownload(raceId: string) {
  const objectKey = raceId + '.png';
  const param = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
  };
  const command = new GetObjectCommand(param);
  const url = await getSignedUrl(s3, command, {
    expiresIn: PRESIGN_EXPIRES_IN,
  });
  return url;
}
