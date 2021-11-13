import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const RACE_TABLE_NAME = process.env.DYNAMODB_RACE_TABLE_NAME;

const dbClient = new DynamoDBClient({ region: 'ap-northeast-1' });

export const documentClient = DynamoDBDocument.from(dbClient);
