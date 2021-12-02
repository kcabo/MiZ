import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { dbErrorLog, ErrorLog } from 'lib/logger';
import { MeetKeys, RaceKeys } from 'types';
import { isDbUserItem, isMeet, isRace } from 'lib/typeGuard';
import { InvalidItem, ItemNotFoundFromDB } from 'exceptions';

// メタデータは取得しない
export async function fetchRace(userId: string, raceId: string) {
  return await dbGetRequest(userId, raceId, {
    validation: isRace,
    selectKeys: RaceKeys,
  });
}

export async function fetchCachedMeetData(userId: string) {
  const sk = 'CACHE#' + userId;
  const result = await dbGetRequest(userId, sk, {
    validation: isMeet,
    selectKeys: MeetKeys,
  });
  if (result instanceof Error) {
    return {};
  }
  return result;
}

export async function fetchUser(userId: string) {
  const sk = 'USER#' + userId;
  return await dbGetRequest(userId, sk, { validation: isDbUserItem });
}

export async function checkRaceExists(userId: string, raceId: string) {
  return await checkExists(userId, raceId);
}

export async function checkUserExists(userId: string) {
  const sk = 'USER#' + userId;
  return await checkExists(userId, sk);
}

async function checkExists(userId: string, sk: string) {
  const result = await dbGetRequest(userId, sk, { selectKeys: ['sk'] });
  if (result instanceof Error) return false;
  return true;
}

async function dbGetRequest<T = any>(
  userId: string,
  sk: string,
  options: {
    validation?: (arg: any) => arg is T;
    selectKeys?: string[];
  }
): Promise<T | Error> {
  const { validation, selectKeys } = options;

  const dynamicCommand = selectKeys
    ? constructGetSelectCommand(selectKeys)
    : {};

  const keys = { userId, sk };

  try {
    const { Item } = await documentClient.get({
      ...dynamicCommand,
      TableName: RACE_TABLE_NAME,
      Key: keys,
    });

    if (typeof Item === 'undefined') {
      return new ItemNotFoundFromDB();
    }

    if (validation && !validation(Item)) {
      ErrorLog('Unknown Data!!', Item);
      return new InvalidItem();
    }

    return Item as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('get', keys, error);
      return error;
    } else {
      throw new Error();
    }
  }
}

function constructGetSelectCommand(keys: string[]) {
  const initialValue: { [key: string]: any } = {};

  const names = keys.reduce((accumulator, currentValue) => {
    accumulator[`#${currentValue}`] = currentValue;
    return accumulator;
  }, initialValue);

  return {
    ProjectionExpression: keys.map((k) => `#${k}`).join(', '),
    ExpressionAttributeNames: names,
  };
}
