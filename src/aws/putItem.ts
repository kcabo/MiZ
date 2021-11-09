import { documentClient } from './dynamodb';

import { DbRaceItem, RaceData } from 'types';
import { nowISO } from '../utils';

const TABLE_NAME = 'miz-dev';

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
    TableName: TABLE_NAME,
    Item: raceItem,
  });
}
