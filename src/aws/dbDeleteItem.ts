import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { ItemNotFoundFromDB } from 'exceptions';
import { dbErrorLog } from 'lib/logger';
import { DbPrimaryKeys } from 'types';

export async function deleteRaceItem(userId: string, raceId: string) {
  const keys = { userId, sk: raceId };
  return await dbDeleteRequest(keys);
}

// deleteはidempotentな操作らしいので存在しないキーを指定しても本来成功してしまう
// 存在しないItemを削除しようとするとConditionalCheckFailedExceptionが走る
// このときログは吐かないが、NotFoundエラーオブジェクトを返す
// 別の戦略として、削除結果(ReturnValues: ALL_OLD)を受け取り、それを判定する方法もある
async function dbDeleteRequest(key: DbPrimaryKeys): Promise<0 | Error> {
  try {
    await documentClient.delete({
      TableName: RACE_TABLE_NAME,
      Key: key,
      ExpressionAttributeNames: { '#sk': 'sk' },
      ConditionExpression: 'attribute_exists(#sk)',
    });
    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'ConditionalCheckFailedException') {
        return new ItemNotFoundFromDB();
      }
      dbErrorLog('delete', key, error);
      return error;
    } else {
      throw new Error();
    }
  }
}
