import { Message } from '@line/bot-sdk';

import { fetchRaceItem, deleteRaceItem } from 'aws';
import { ItemNotFoundFromDB } from 'exceptions';
import { BotReply } from 'lineApi';
import { isAlreadyPassedBy } from 'lib/utils';

export async function confirmDeleteRace(
  userId: string,
  raceId: string
): Promise<Message | Message[]> {
  const raceItem = await fetchRaceItem(userId, raceId);

  if (raceItem instanceof ItemNotFoundFromDB) {
    return BotReply.cannotGetRace();
  } else if (raceItem instanceof Error) {
    return BotReply.unExpectedError();
  }

  return BotReply.confirmDeleteRace(raceItem);
}

export async function confirmedDeleteRace(
  userId: string,
  raceId: string,
  expiresAt: number
): Promise<Message | Message[]> {
  // 有効時間内に削除ボタンを押さなければ無効
  if (isAlreadyPassedBy(expiresAt)) {
    return BotReply.confirmDeleteTooLate();
  }

  const result = await deleteRaceItem(userId, raceId);
  if (result instanceof Error) {
    return BotReply.unExpectedError();
  }

  return BotReply.successfullyDeletedRace();
}
