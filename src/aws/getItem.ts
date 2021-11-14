import ErrorLog from 'logger';
import { DbRaceItem, DbUserItem, Meet } from 'types';
import { isDbUserItem } from 'typeChecker';
import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

type DbGetResult =
  | {
      [key: string]: any;
    }
  | {
      error: true;
    }
  | undefined;

async function getRequest(
  userId: string,
  sk: string,
  select?: string
): Promise<DbGetResult> {
  try {
    const { Item } = await documentClient.get({
      TableName: RACE_TABLE_NAME,
      ProjectionExpression: select,
      Key: {
        userId: userId,
        sk: sk,
      },
    });

    return Item;
  } catch (error) {
    ErrorLog(`Get Request Failed on userId=${userId} and sk=${sk}:`, error);
    return { error: true };
  }
}

export async function getUser(userId: string): Promise<DbUserItem | undefined> {
  const sk = 'USER#' + userId;
  const item = await getRequest(userId, sk);

  if (!item || item.error === true) {
    return undefined;
  } else if (!isDbUserItem(item)) {
    ErrorLog('Cannot recognize the item received from db:', item);
    return undefined;
  }

  return item;
}

export async function getCachedMeetData(userId: string): Promise<Meet> {
  const sk = 'CACHE#' + userId;
  const item = await getRequest(userId, sk);

  if (!item || item.error === true) {
    return {};
  }

  const meetObj = onlyMeetKeyValue(item);
  return meetObj;
}

export async function checkRaceExists(
  userId: string,
  raceId: string
): Promise<boolean> {
  const sk = raceId;
  const item = await getRequest(userId, sk, 'sk');

  if (!item || item.error === true) {
    return false;
  }

  return true;
}

function onlyMeetKeyValue(obj: { [key: string]: any }): Meet {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) =>
        typeof v === 'string' && ['courseLength', 'meet', 'place'].includes(k)
    )
  );
}
