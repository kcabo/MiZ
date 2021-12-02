import { Message } from '@line/bot-sdk';

import { fetchRace, deleteRaceItem, deleteSheetImage } from 'aws';
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
    return BotReply.dbRequestFailed();
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

  const dbResult = await deleteRaceItem(userId, raceId);
  if (dbResult instanceof ItemNotFoundFromDB) {
    return BotReply.noRaceFound();
  } else if (dbResult instanceof Error) {
    return BotReply.dbRequestFailed();
  }

  // データベースの削除リクエストでレースデータの所有は確認済みのため、画像削除をしても安全
  const s3Result = await deleteSheetImage(raceId);
  if (s3Result instanceof Error) {
    return BotReply.s3DeleteRequestFailed();
  }

  return BotReply.successfullyDeletedRace();
}
