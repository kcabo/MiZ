import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { InvalidItem, ItemNotFoundFromDB } from 'exceptions';
import { dbErrorLog, ErrorLog } from 'lib/logger';
import { isSkOnlyArray } from 'lib/typeGuard';

export async function queryAllRaces(
  userId: string,
  startKey?: { [key: string]: any }
) {
  return await dbQueryRequest(userId, 10, startKey);
}

async function dbQueryRequest(
  userId: string,
  pageSize: number,
  startKey?: { [key: string]: any }
): Promise<
  | {
      raceIds: { sk: string }[];
      LastEvaluatedKey?: { [key: string]: any };
    }
  | Error
> {
  try {
    const { Items, LastEvaluatedKey } = await documentClient.query({
      TableName: RACE_TABLE_NAME,
      IndexName: 'date-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ProjectionExpression: 'sk',
      Limit: pageSize,
      ExclusiveStartKey: startKey,
      ScanIndexForward: false, // from end to start = 値の大きい最近の日付から読む
    });

    if (typeof Items === 'undefined' || Items.length === 0) {
      return new ItemNotFoundFromDB();
    }

    if (!isSkOnlyArray(Items)) {
      ErrorLog('Unknown Data!!', Items);
      return new InvalidItem();
    }

    return { raceIds: Items, LastEvaluatedKey };
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('query', { userId, sk: '-' }, error);
      return error;
    } else {
      throw new Error();
    }
  }
}
