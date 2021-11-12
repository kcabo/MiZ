import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

export async function queryAllRaces(
  userId: string,
  pageSize: number,
  lastKey?: { [key: string]: any }
) {
  try {
    return await documentClient.query({
      TableName: RACE_TABLE_NAME,
      IndexName: 'date-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastKey,
      ScanIndexForward: false, // from end to start
    });
  } catch (error) {
    console.error(
      `Query failed on userId=${userId}:`,
      JSON.stringify(error, null, 2)
    );
    return { error: true };
  }
}
