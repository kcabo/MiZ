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
  return await dbQueryRequest(userId, {
    Limit: PAGE_SIZE,
    ExclusiveStartKey: startKey,
    IndexName: 'date-index',
    ScanIndexForward: false, // 最近の日付から読む
  });
}

export async function dbQueryRequest(
  userId: string,
  options: {
    Limit?: number;
    ExclusiveStartKey?: QueryStartPoint;
    IndexName?: 'date-index';
    ScanIndexForward?: false;
  }
): Promise<
  | {
      sks: { sk: string }[];
      LastEvaluatedKey?: QueryStartPoint;
    }
  | Error
> {
  try {
    const { Items, LastEvaluatedKey } = await documentClient.query({
      TableName: RACE_TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ProjectionExpression: 'sk',
      ...options,
    });

    if (typeof Items === 'undefined' || Items.length === 0) {
      return new ItemNotFoundFromDB();
    }

    if (!isSkOnlyArray(Items)) {
      ErrorLog('Unknown Data!!', Items);
      return new InvalidItem();
    }

    return { sks: Items, LastEvaluatedKey };
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('query', { userId, sk: '*' }, error);
      return error;
    } else {
      throw new Error();
    }
  }
}
