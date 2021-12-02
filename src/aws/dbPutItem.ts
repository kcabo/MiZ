import { PutCommandInput } from '@aws-sdk/lib-dynamodb';

import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { DbItem, DbRaceItem, DbUserItem, Race } from 'types';
import { nowISO } from 'lib/utils';
import { dbErrorLog } from 'lib/logger';

export async function createRace(userId: string, raceId: string, race: Race) {
  const now = nowISO();
  const sk = raceId;
  const item: DbRaceItem = { userId, sk, ...race, updatedAt: now };

  // 新規作成を保証する 新規作成の場合はskはまだ存在していないはず
  const additionalCommand = {
    ExpressionAttributeNames: { '#sk': 'sk' },
    ConditionExpression: 'attribute_not_exists(#sk)',
  };

  return await dbPutRequest(item, additionalCommand);
}

// 新規ユーザー作成時は事前にgetを走らせて存在しないことを確認しているため新規作成保証の必要はない
export async function createUser(userId: string, userName: string) {
  const now = nowISO();
  const sk = 'USER#' + userId;
  const item: DbUserItem = {
    userId,
    sk,
    userName,
    mode: 'swimmer', // デフォルト値
    isTermAccepted: false, // 同意したらこの属性をアップデート
    friendship: true,
    createdAt: now,
  };

  return await dbPutRequest(item);
}

async function dbPutRequest(
  item: DbItem,
  additionalCommand: Omit<PutCommandInput, 'TableName' | 'Item'> = {}
): Promise<0 | Error> {
  try {
    await documentClient.put({
      TableName: RACE_TABLE_NAME,
      Item: item,
      ...additionalCommand,
    });
    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('create', item, error);
      return error;
    } else {
      throw new Error();
    }
  }
}
