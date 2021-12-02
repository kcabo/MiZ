import { Message } from '@line/bot-sdk';

import { fetchRace, deleteRaceItem } from 'aws';
import { ItemNotFoundFromDB } from 'exceptions';
import { BotReply } from 'lineApi';
import { isAlreadyPassedBy } from 'lib/utils';

export async function confirmDeleteRace(
  userId: string,
  raceId: string
): Promise<Message | Message[]> {
  const race = await fetchRace(userId, raceId);

  if (race instanceof ItemNotFoundFromDB) {
    return BotReply.noRaceFound();
  } else if (race instanceof Error) {
    return BotReply.unExpectedError();
  }

  return BotReply.confirmDeleteRace(raceId, race);
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
