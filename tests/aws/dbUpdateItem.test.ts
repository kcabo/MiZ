import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { updateUser } from 'aws';
import { __local__ } from 'aws/dbUpdateItem';
import { UserSettingsKeys } from 'types';

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock
  .on(UpdateCommand)
  .resolves({})
  .on(UpdateCommand, { Key: { userId: 'Fail' } })
  .rejects('mocked rejection');

afterAll(() => jest.restoreAllMocks());

describe('Update user', () => {
  test('success', async () => {
    const output = await updateUser('', { isTermAccepted: true });
    expect(output).toBe(0);
  });

  test('should fails', async () => {
    const output = await updateUser('', {}); // should fail but success
    expect(output).toBe(0);
  });

  test('sdk fail', async () => {
    const output = await updateUser('Fail', {});
    expect(output).toStrictEqual(new Error('mocked rejection'));
  });

  test('invalid', async () => {
    const output = await updateUser('', { hoge: 10 } as any);
    expect(output).toStrictEqual(new Error('Not allowed key detected'));
  });
});

const attributes = {
  mode: 'swimmer' as const,
  isTermAccepted: false,
  userName: 'Hoge',
};

test('construct command', () => {
  const allowedKeys = [...UserSettingsKeys, 'isTermAccepted'];
  const res = __local__.constructUpdateCommand(attributes, allowedKeys as any);
  expect(res).toStrictEqual({
    UpdateExpression:
      'set #mode = :mode, #isTermAccepted = :isTermAccepted, #userName = :userName',
    ExpressionAttributeNames: {
      '#mode': 'mode',
      '#isTermAccepted': 'isTermAccepted',
      '#userName': 'userName',
    },
    ExpressionAttributeValues: {
      ':mode': 'swimmer',
      ':isTermAccepted': false,
      ':userName': 'Hoge',
    },
  });
});
