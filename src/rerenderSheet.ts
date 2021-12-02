import { Message } from '@line/bot-sdk';

import { generateSheetImage, generateURLforDownload, fetchRace } from 'aws';
import { BotReply } from 'lineApi';
import { ItemNotFoundFromDB, PaparazzoError } from 'exceptions';

export async function rerenderSheet(
  userId: string,
  raceId: string
): Promise<Message | Message[]> {
  const race = await fetchRace(userId, raceId);

  if (race instanceof ItemNotFoundFromDB) {
    return BotReply.noRaceFound();
  } else if (race instanceof Error) {
    return BotReply.dbRequestFailed();
  }

  // 画像再生成
  const generateSheetResult = await generateSheetImage(raceId, race);
  if (generateSheetResult instanceof PaparazzoError) {
    return BotReply.paparazzoError();
  }

  const url = await generateURLforDownload(raceId);
  return BotReply.sheetImage(raceId, url);
}
