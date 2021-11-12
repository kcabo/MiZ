import { DbUserItem } from '../../src/types';
import { getUser } from '../../src/aws';
import { documentClient } from '../../src/aws/dynamodb';

const dbUserItem: DbUserItem = {
  userId: 'U123',
  sk: 'USER#U123',
  userName: 'hoge',
  mode: 'swimmer',
  isTermAgreed: true,
  friendship: true,
  createdAt: '2021-10-11',
};

const validGetOutput = {
  Item: dbUserItem,
} as any;

const emptyGetOutput = {
  Item: undefined,
} as any;

const unknownGetOutput = {
  Item: { who: 'amI?' },
} as any;

const mockErrorConsole = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

afterEach(() => {
  mockErrorConsole.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Get user', async () => {
  documentClient.get = jest.fn(() => validGetOutput);
  expect.assertions(1);
  const res = await getUser('U123');
  expect(res).toStrictEqual(dbUserItem);
});

test('Invalid Get parameter', async () => {
  documentClient.get = jest.fn(() => {
    throw new Error();
  });
  expect.assertions(3);
  const res = await getUser('U123');
  expect(res).toStrictEqual(undefined);
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Get Request Failed');
});

test('Cannot find user', async () => {
  documentClient.get = jest.fn(() => emptyGetOutput);
  expect.assertions(3);
  const res = await getUser('U123');
  expect(res).toStrictEqual(undefined);
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Cannot find user');
});

test('Got unknown data structure', async () => {
  documentClient.get = jest.fn(() => unknownGetOutput);
  expect.assertions(3);
  const res = await getUser('U123');
  expect(res).toStrictEqual(undefined);
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Invalid User item:');
});
