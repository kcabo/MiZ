import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

import { deleteRaceItem } from 'aws';

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock
  .on(DeleteCommand)
  .resolves({})
  .on(DeleteCommand, { Key: { userId: 'Fail' } })
  .rejects('mocked rejection');

afterAll(() => jest.restoreAllMocks());

const placeholder = 'hoge';

test('Delete race', async () => {
  const output = await deleteRaceItem(placeholder, placeholder);
  expect(output).toBe(0);
});

test('Delete race fail', async () => {
  const output = await deleteRaceItem('Fail', placeholder);
  expect(output).toStrictEqual(Error('mocked rejection'));
});
