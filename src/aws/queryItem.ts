import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import ErrorLog from 'logger';
import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

export async function queryAllRaces(
  userId: string,
  pageSize: number,
  startKey?: { [key: string]: any }
): Promise<QueryCommandOutput | undefined> {
  try {
    const result = await documentClient.query({
      TableName: RACE_TABLE_NAME,
      IndexName: 'date-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ProjectionExpression: 'sk',
      Limit: pageSize,
      ExclusiveStartKey: startKey,
      ScanIndexForward: false, // from end to start
    });

    if (result.$metadata.httpStatusCode !== 200) {
      ErrorLog('Failed to request:', result);
      return undefined;
    }

    return result;
  } catch (error) {
    ErrorLog(`Failed to query all races on userId=${userId}:`, error);
    return undefined;
  }
}
