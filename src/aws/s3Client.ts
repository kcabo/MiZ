import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
} from '@aws-sdk/client-s3';
import { ErrorLog } from 'lib/logger';

const BUCKET_NAME = process.env.PAPARAZZO_BUCKET_NAME;

export const s3Client = new S3Client({ region: 'ap-northeast-1' });

export async function deleteSheetImage(raceId: string) {
  return deleteSheetImages([raceId]);
}

// NOTE: 存在しないキーを指定しても成功する
export async function deleteSheetImages(raceIds: string[]) {
  const keys = raceIds.map((raceId) => ({ Key: raceId + '.png' }));

  const param: DeleteObjectsCommandInput = {
    Bucket: BUCKET_NAME,
    Delete: {
      Objects: keys,
    },
  };

  const command = new DeleteObjectsCommand(param);

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
