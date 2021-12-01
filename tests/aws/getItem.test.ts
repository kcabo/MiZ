import { DbUserItem, Meet } from '../../src/types';
import { getUser, getCachedMeetData } from '../../src/aws';
import { documentClient } from '../../src/aws/dynamodbClient';

const dbUserItem: DbUserItem = {
  userId: 'U123',
  sk: 'USER#U123',
  userName: 'hoge',
  mode: 'swimmer',
  isTermAccepted: true,
  friendship: true,
  createdAt: '2021-10-11',
};

const mockErrorConsole = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

afterEach(() => mockErrorConsole.mockClear());
afterAll(() => jest.restoreAllMocks());

test('Get user', async () => {
  documentClient.get = jest.fn(() => ({ Item: dbUserItem } as any));
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
  documentClient.get = jest.fn(() => ({ Item: undefined } as any));
  expect.assertions(1);
  const res = await getUser('U123');
  expect(res).toStrictEqual(undefined);
});

test('Got unknown user data structure', async () => {
  documentClient.get = jest.fn(() => ({ Item: { who: 'amI?' } } as any));
  expect.assertions(3);
  const res = await getUser('U123');
  expect(res).toStrictEqual(undefined);
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain(
    'Cannot recognize the item'
  );
});

const meetData: Meet = {
  courseLength: '長水路',
  meet: '大会',
  place: '会場',
};

test('Get cached meet data', async () => {
  documentClient.get = jest.fn(() => ({ Item: meetData } as any));
  expect.assertions(1);
  const res = await getCachedMeetData('U123');
  expect(res).toStrictEqual(meetData);
});

const incompleteMeetData = {
  courseLength: '長水路',
  place: 4,
  unneeded: 'where am I?',
};

test('Get cached meet data 2', async () => {
  documentClient.get = jest.fn(() => ({ Item: incompleteMeetData } as any));
  expect.assertions(1);
  const res = await getCachedMeetData('U123');
  expect(res).toStrictEqual({ courseLength: '長水路' });
});

test('Get empty for cached meet data', async () => {
  documentClient.get = jest.fn(() => ({ Item: undefined } as any));
  expect.assertions(1);
  const res = await getCachedMeetData('U123');
  expect(res).toStrictEqual({});
});
