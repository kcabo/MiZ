import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { queryAllRaces } from 'aws';
import { InvalidItem, ItemNotFoundFromDB } from 'exceptions';

const skOnlys = [{ sk: '1' }, { sk: '2' }];

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock
  .on(QueryCommand)
  .resolves({ Items: skOnlys })
  .on(QueryCommand, { ExpressionAttributeValues: { ':userId': 'Fail' } })
  .rejects('mocked rejection')
  .on(QueryCommand, { ExpressionAttributeValues: { ':userId': 'Empty' } })
  .resolves({ Items: [] })
  .on(QueryCommand, { ExpressionAttributeValues: { ':userId': 'None' } })
  .resolves({})
  .on(QueryCommand, { ExpressionAttributeValues: { ':userId': 'Invalid' } })
  .resolves({ Items: [{ sk: '1' }, { sk: true }] });

afterAll(() => jest.restoreAllMocks());

describe('Query race', () => {
  test('success', async () => {
    const output = await queryAllRaces('');
    expect(output).toStrictEqual({
      sks: skOnlys,
      LastEvaluatedKey: undefined,
    });
  });

  test('sdk fail', async () => {
    const output = await queryAllRaces('Fail');
    expect(output).toStrictEqual(new Error('mocked rejection'));
  });

  test('empty', async () => {
    const output = await queryAllRaces('Empty');
    expect(output).toStrictEqual(new ItemNotFoundFromDB());
  });

  test('none', async () => {
    const output = await queryAllRaces('None');
    expect(output).toStrictEqual(new ItemNotFoundFromDB());
  });

  test('invalid', async () => {
    const output = await queryAllRaces('Invalid');
    expect(output).toStrictEqual(new InvalidItem());
  });
});
