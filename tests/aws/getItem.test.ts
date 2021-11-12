import { DbUserItem, Meet } from '../../src/types';
import { getUser, getCachedMeetData } from '../../src/aws';
import { documentClient } from '../../src/aws/dynamodbClient';

const dbUserItem: DbUserItem = {
  userId: 'U123',
  sk: 'USER#U123',
  userName: 'hoge',
  mode: 'swimmer',
  isTermAgreed: true,
  friendship: true,
  createdAt: '2021-10-11',
};

const validUserGetOutput = {
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
  documentClient.get = jest.fn(() => validUserGetOutput);
  expect.assertions(1);
  const res = await getUser('U123');
  expect(res).toStrictEqual(dbUserItem);
});

test('Invalid user get parameter', async () => {
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

test('Got unknown user data structure', async () => {
  documentClient.get = jest.fn(() => unknownGetOutput);
  expect.assertions(3);
  const res = await getUser('U123');
  expect(res).toStrictEqual(undefined);
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Invalid User item:');
});

const meetData: Meet = {
  courseLength: '長水路',
  meet: '大会',
  place: '会場',
};

const validCachedMeetGetOutput = {
  Item: meetData,
} as any;

test('Get cached meet data', async () => {
  documentClient.get = jest.fn(() => validCachedMeetGetOutput);
  expect.assertions(1);
  const res = await getCachedMeetData('U123');
  expect(res).toStrictEqual(meetData);
});

const meetData2 = {
  courseLength: '長水路',
  place: 4,
  unneeded: 'where am I?',
};

test('Get cached meet data 2', async () => {
  documentClient.get = jest.fn(() => ({ Item: meetData2 } as any));
  expect.assertions(1);
  const res = await getCachedMeetData('U123');
  expect(res).toStrictEqual({ courseLength: '長水路' });
});

test('Get empty for cached meet data', async () => {
  documentClient.get = jest.fn(() => emptyGetOutput);
  expect.assertions(1);
  const res = await getCachedMeetData('U123');
  expect(res).toStrictEqual({});
});
