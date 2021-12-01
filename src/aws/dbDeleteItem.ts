import { dbErrorLog } from 'lib/logger';
import { DbPrimaryKeys } from 'types';
import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

// deleteはidempotentな操作らしいので存在しないキーを指定しても成功する
// 実際削除ボタンを何度も押すことが考えられるので、このままでもよいか
export async function deleteRaceItem(userId: string, raceId: string) {
  const keys = { userId, sk: raceId };
  return await dbDeleteRequest(keys);
}

export async function dbDeleteRequest(key: DbPrimaryKeys): Promise<0 | Error> {
  try {
    await documentClient.delete({
      TableName: RACE_TABLE_NAME,
      Key: key,
    });
    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('delete', key, error);
      return error;
    } else {
      throw new Error();
    }
  }
}
