import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { createRace, createUser } from 'aws';
import { Race } from 'types';

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock
  .on(PutCommand)
  .resolves({})
  .on(PutCommand, { Item: { userId: 'Fail' } })
  .rejects('mocked rejection');

afterAll(() => jest.restoreAllMocks());

const placeholder = 'hoge';
const race: Race = {
  date: '2021-11-11',
  swimmer: 'Test',
  event: '100m 自由形',
  cumulativeTime: [2890, 6109],
};

test('Create race', async () => {
  const output = await createRace(placeholder, placeholder, race);
  expect(output).toBe(0);
});

test('Create race fail', async () => {
  const output = await createRace('Fail', placeholder, race);
  expect(output).toStrictEqual(Error('mocked rejection'));
});

test('Create user', async () => {
  const output = await createUser(placeholder, placeholder);
  expect(output).toBe(0);
});

test('Create user fail', async () => {
  const output = await createUser('Fail', placeholder);
  expect(output).toStrictEqual(Error('mocked rejection'));
});
