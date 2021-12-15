import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { dbErrorLog, ErrorLog } from 'lib/logger';
import { dbQueryRequest } from './dbQueryItems';

export async function deleteAllData(userId: string) {
  const result = await dbQueryRequest(userId, {});
  if (result instanceof Error) {
    ErrorLog('Failed to list all item on userId:', userId);
    return result;
  }

  const { sks } = result;
  const width = 25;
  let index = 0;

  while (sks.length > index) {
    const range = sks.slice(index, index + width);

    const batchResult = await dbBatchDeleteRequest(userId, range);

    if (batchResult instanceof Error) {
      ErrorLog('Failed to delete all item on userId:', userId);
      return batchResult;
    }

    index += width;
  }

  return sks;
}

async function dbBatchDeleteRequest(
  userId: string,
  sks: { sk: string }[]
): Promise<0 | Error> {
  const deleteRequests = sks.map(({ sk }) => ({
    DeleteRequest: {
      Key: {
        userId: userId,
        sk: sk,
      },
    },
  }));

  try {
    await documentClient.batchWrite({
      RequestItems: {
        [RACE_TABLE_NAME as any]: deleteRequests,
      },
    });
    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('batch', { userId, sk: '*' }, error);
      return error;
    } else {
      throw new Error();
    }
  }
}
