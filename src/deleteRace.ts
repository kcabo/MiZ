import { Message } from '@line/bot-sdk';

import { getRace, deleteRaceItem } from 'aws';
import { BotReply } from 'lineApi';
import { isAlreadyPassedBy } from 'utils';

export async function confirmDeleteRace(
  userId: string,
  raceId: string
): Promise<Message | Message[]> {
  const race = await getRace(userId, raceId);
  if (!race) {
    return BotReply.cannotGetRace();
  }

  return BotReply.confirmDeleteRace(race);
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
