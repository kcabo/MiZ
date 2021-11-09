import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({ region: 'ap-northeast-1' });

export const documentClient = DynamoDBDocument.from(dbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
