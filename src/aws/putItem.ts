import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

import { DbRaceItem, DbUserItem, RaceData } from 'types';
import { nowISO } from '../utils';

export async function putNewRace(raceData: RaceData, userId: string) {
  const now = nowISO();
  const raceItem: DbRaceItem = {
    userId: userId,
    sk: raceData.raceId,
    date: raceData.date,
    swimmer: raceData.swimmer,
    event: raceData.event,
    reaction: raceData.reaction,
    cumulativeTime: raceData.cumulativeTime,
    courseLength: raceData.courseLength,
    meet: raceData.meet,
    place: raceData.place,
    createdAt: now,
    updatedAt: now,
  };

  return documentClient.put({
    TableName: RACE_TABLE_NAME,
    Item: raceItem,
  });
}

export async function putNewUser(userId: string, userName: string) {
  const now = nowISO();
  const raceItem: DbUserItem = {
    userId: userId,
    sk: 'USER#' + userId,
    userName: userName,
    mode: 'swimmer', // デフォルト値
    isTermAgreed: false, // 同意したらこの属性をアップデート
    friendship: true,
    createdAt: now,
  };

  return documentClient.put({
    TableName: RACE_TABLE_NAME,
    Item: raceItem,
  });
}
