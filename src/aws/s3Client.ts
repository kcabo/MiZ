import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
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
  const result = await sendS3Command(command);
  return result;
}

async function sendS3Command(command: DeleteObjectCommand): Promise<0 | Error> {
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
