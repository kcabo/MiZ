import ErrorLog from 'logger';
import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

// deleteはidempotentな操作らしいので存在しないキーを指定しても成功する
export async function deleteRace(
  userId: string,
  raceId: string
): Promise<{ error: boolean }> {
  try {
    const result = await documentClient.delete({
      TableName: RACE_TABLE_NAME,
      Key: {
        userId: userId,
        sk: raceId,
      },
    });

    if (result.$metadata.httpStatusCode !== 200) {
      ErrorLog('Failed to request:', result);
      return { error: true };
    }

    return { error: false };
  } catch (error) {
    ErrorLog(
      `Failed to delete race on userId=${userId}, raceId=${raceId}:`,
      error
    );
    return { error: true };
  }
}
