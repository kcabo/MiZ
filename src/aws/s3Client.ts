import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ErrorLog } from 'lib/logger';

const BUCKET_NAME = process.env.PAPARAZZO_BUCKET_NAME;

export const s3Client = new S3Client({ region: 'ap-northeast-1' });

// NOTE: 存在しないキーを指定しても成功する
export async function deleteSheetImage(raceId: string) {
  const objectKey = raceId + '.png';

  const param = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
  };
  const command = new DeleteObjectCommand(param);

  try {
    await s3Client.send(command);
    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      ErrorLog('S3 command failed:', command);
      return error;
    } else {
      throw new Error();
    }
  }
}

// never throws errors
export async function getSheetImageMetadata(raceId: string) {
  const objectKey = raceId + '.png';

  const param = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
  };
  const command = new HeadObjectCommand(param);

  try {
    const { Metadata } = await s3Client.send(command);
    return Metadata || {};
  } catch (error) {
    ErrorLog(
      `Head object failed on ${objectKey}. fallback to empty object...`,
      error
    );
    return {};
  }
}
