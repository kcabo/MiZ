import { Message } from '@line/bot-sdk';

import { generateSheetImage, generateURLforDownload, fetchRace } from 'aws';
import { BotReply } from 'lineApi';
import { ItemNotFoundFromDB, PaparazzoError } from 'exceptions';

export async function rerenderSheet(
  userId: string,
  text: string
): Promise<Message | Message[]> {
  const raceId = text.slice(8); // !render= が8文字

  const race = await fetchRace(userId, raceId);
  if (race instanceof ItemNotFoundFromDB) {
    return BotReply.noRaceFound();
  } else if (race instanceof Error) {
    return BotReply.unExpectedError();
  }

  // 画像再生成
  const generateSheetResult = await generateSheetImage(raceId, race);
  if (generateSheetResult instanceof PaparazzoError) {
    return BotReply.paparazzoError();
  }

  const sheetObjectKey = raceId + '.png';
  const url = await generateURLforDownload(sheetObjectKey);
  return BotReply.sendImage(url);
}
