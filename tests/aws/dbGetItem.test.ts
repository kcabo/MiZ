import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import {
  fetchRace,
  checkRaceExists,
  fetchUser,
  checkUserExists,
  fetchCachedMeetData,
} from 'aws';
import { Race, DbUserItem, Meet } from 'types';
import { InvalidItem, ItemNotFoundFromDB } from 'exceptions';

const dbUserItem: DbUserItem = {
  userId: 'Dev',
  sk: 'USER#Dev',
  userName: 'hoge',
  mode: 'swimmer',
  isTermAccepted: true,
  friendship: true,
  createdAt: '2021-11-14T10:39:14Z',
};

const meetData: Meet = {
  courseLength: '長水路',
  meet: '大会',
  place: '会場',
};

const race: Race = {
  ...meetData,
  date: '2021-12-01',
  event: '自由形決勝',
  swimmer: 'Hoge',
  cumulativeTime: [3019, 6111],
};

const skOnly = { sk: '1' };

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock
  .on(GetCommand)
  .resolves({})
  .on(GetCommand, {
    ProjectionExpression: '#sk',
    ExpressionAttributeNames: { '#sk': 'sk' },
  })
  .resolves({ Item: skOnly })
  .on(GetCommand, { Key: { userId: 'RACE' } })
  .resolves({ Item: race })
  .on(GetCommand, { Key: { userId: 'USER' } })
  .resolves({ Item: dbUserItem })
  .on(GetCommand, { Key: { userId: 'CACHE' } })
  .resolves({ Item: meetData })
  .on(GetCommand, { Key: { userId: 'Fail' } })
  .rejects('mocked rejection')
  .on(GetCommand, { Key: { userId: 'Empty' } })
  .resolves({})
  .on(GetCommand, { Key: { userId: 'InvalidRace' } })
  .resolves({ Item: { swimmer: 0 } })
  .on(GetCommand, { Key: { userId: 'InvalidUser' } })
  .resolves({ Item: { isTermAccepted: 'true' } })
  .on(GetCommand, { Key: { userId: 'InvalidCachedMeet' } })
  .resolves({ Item: { courseLength: 'ooo' } });

afterAll(() => jest.restoreAllMocks());

describe('Get race', () => {
  test('success', async () => {
    const output = await fetchRace('RACE', '');
    expect(output).toStrictEqual(race);
  });

  test('sdk fail', async () => {
    const output = await fetchRace('Fail', '');
    expect(output).toStrictEqual(new Error('mocked rejection'));
  });

  test('empty', async () => {
    const output = await fetchRace('Empty', '');
    expect(output).toStrictEqual(new ItemNotFoundFromDB());
  });

  test('invalid', async () => {
    const output = await fetchRace('InvalidRace', '');
    expect(output).toStrictEqual(new InvalidItem());
  });
});

describe('Get user', () => {
  test('success', async () => {
    const output = await fetchUser('USER');
    expect(output).toStrictEqual(dbUserItem);
  });

  test('sdk fail', async () => {
    const output = await fetchUser('Fail');
    expect(output).toStrictEqual(new Error('mocked rejection'));
  });

  test('empty', async () => {
    const output = await fetchUser('Empty');
    expect(output).toStrictEqual(new ItemNotFoundFromDB());
  });

  test('invalid', async () => {
    const output = await fetchUser('InvalidUser');
    expect(output).toStrictEqual(new InvalidItem());
  });
});

describe('Get cached meet', () => {
  test('success', async () => {
    const output = await fetchCachedMeetData('CACHE');
    expect(output).toStrictEqual(meetData);
  });

  test('sdk fail', async () => {
    const output = await fetchCachedMeetData('Fail');
    expect(output).toStrictEqual({});
  });

  test('empty', async () => {
    const output = await fetchCachedMeetData('Empty');
    expect(output).toStrictEqual({});
  });

  test('invalid', async () => {
    const output = await fetchCachedMeetData('InvalidCachedMeet');
    expect(output).toStrictEqual({});
  });
});

describe('check race exists', () => {
  test('success', async () => {
    const output = await checkRaceExists('', '');
    expect(output).toStrictEqual(true);
  });

  test('sdk fail', async () => {
    const output = await checkRaceExists('Fail', '');
    expect(output).toStrictEqual(false);
  });

  test('empty', async () => {
    const output = await checkRaceExists('Empty', '');
    expect(output).toStrictEqual(false);
  });
});

describe('check user exists', () => {
  test('success', async () => {
    const output = await checkUserExists('');
    expect(output).toStrictEqual(true);
  });

  test('sdk fail', async () => {
    const output = await checkUserExists('Fail');
    expect(output).toStrictEqual(false);
  });

  test('empty', async () => {
    const output = await checkUserExists('Empty');
    expect(output).toStrictEqual(false);
  });
});
