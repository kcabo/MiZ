import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { InvalidItem, ItemNotFoundFromDB } from 'exceptions';
import { dbErrorLog, ErrorLog } from 'lib/logger';
import { isSkOnlyArray } from 'lib/typeGuard';
import { QueryStartPoint } from 'types';

const PAGE_SIZE = Number(process.env.RACE_LIST_PAGE_SIZE) || 10;

export async function queryAllRaces(
  userId: string,
  startKey?: QueryStartPoint
) {
  return await dbQueryRequest(userId, PAGE_SIZE, startKey);
}

async function dbQueryRequest(
  userId: string,
  pageSize: number,
  startKey?: QueryStartPoint
): Promise<
  | {
      raceIds: { sk: string }[];
      LastEvaluatedKey?: QueryStartPoint;
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
