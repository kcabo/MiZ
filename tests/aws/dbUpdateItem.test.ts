import { mockClient } from 'aws-sdk-client-mock';

import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { documentClient, RACE_TABLE_NAME } from 'aws/dynamodbClient';

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock.on(UpdateCommand).resolves({});

afterAll(() => jest.restoreAllMocks());

test('aaaa', async () => {
  const output = await documentClient.update({
    TableName: RACE_TABLE_NAME,
    Key: {
      userId: 'Dev',
      sk: 'USER#' + 'Dev',
    },
    UpdateExpression: 'set #friendship = :friendship',
    ExpressionAttributeNames: { '#friendship': 'friendship' },
    ExpressionAttributeValues: { ':friendship': true },
  });

  expect(output).toStrictEqual({});
});
