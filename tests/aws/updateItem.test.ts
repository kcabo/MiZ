import { updateUser } from '../../src/aws';
import {
  constructUpdateAttributeValues,
  constructUpdateExpression,
} from '../../src/aws/updateItem';
import { documentClient } from '../../src/aws/dynamodbClient';

const spy = jest.spyOn(console, 'error');
afterEach(() => spy.mockClear());

test('update user', async () => {
  const output = {
    $metadata: { httpStatusCode: 200 },
  } as any;
  documentClient.update = jest.fn(() => output);
  const res = await updateUser('U123', {});
  expect(res).toStrictEqual(output);
});

test('update user (db unavailable)', async () => {
  const output = {
    $metadata: { httpStatusCode: 400 },
  } as any;
  documentClient.update = jest.fn(() => output);

  const res = await updateUser('U123', {});
  expect(res).toStrictEqual(undefined);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toContain('Update request by');
});

test('update user (invalid request)', async () => {
  documentClient.update = jest.fn(() => {
    throw new Error();
  });

  const res = await updateUser('U123', {});
  expect(res).toStrictEqual(undefined);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toContain('Invalid update request');
});

const attributes = {
  mode: 'swimmer' as const,
  isTermAgreed: false,
  userName: undefined,
};

test('Construct expression', () => {
  const res = constructUpdateExpression(attributes);
  expect(res).toStrictEqual(
    'set #mode = :mode, #isTermAgreed = :isTermAgreed, #userName = #userName, #friendship = #friendship'
  );
});

test('Construct attribute values', () => {
  const res = constructUpdateAttributeValues(attributes);
  expect(res).toStrictEqual({
    ':mode': 'swimmer',
    ':isTermAgreed': false,
  });
});
