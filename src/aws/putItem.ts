import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

import { DbRaceItem, DbUserItem, Race } from 'types';
import { nowISO } from '../utils';

export async function putNewRace(userId: string, raceId: string, race: Race) {
  const now = nowISO();
  const raceItem: DbRaceItem = {
    userId: userId,
    sk: raceId,
    ...race,
    updatedAt: now,
  };

  return await documentClient.put({
    TableName: RACE_TABLE_NAME,
    Item: raceItem,
  });
}

export async function putNewUser(userId: string, userName: string) {
  const now = nowISO();
  const userItem: DbUserItem = {
    userId: userId,
    sk: 'USER#' + userId,
    userName: userName,
    mode: 'swimmer', // デフォルト値
    isTermAccepted: false, // 同意したらこの属性をアップデート
    friendship: true,
    createdAt: now,
  };

  return await documentClient.put({
    TableName: RACE_TABLE_NAME,
    Item: userItem,
  });
}
