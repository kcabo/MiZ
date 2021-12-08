import { Message } from '@line/bot-sdk';

import {
  createRace,
  generateSheetImage,
  fetchUser,
  fetchCachedMeetData,
  generateURLforDownload,
} from 'aws';
import { BotReply } from 'lineApi';
import { Race, RaceCoreData } from 'types';
import {
  ItemNotFoundFromDB,
  PaparazzoError,
  PayloadTooLarge,
  WrongMessageFormat,
} from 'exceptions';
import { parseToRaceCoreData } from 'lib/parseTime';
import { formattedToday } from 'lib/utils';
import { generateId } from 'lib/generateId';

export async function createSheet(
  userId: string,
  text: string
): Promise<Message | Message[]> {
  const user = await fetchUser(userId);

  if (user instanceof ItemNotFoundFromDB) {
    return BotReply.failedToIdentifyUser();
  } else if (user instanceof Error) {
    return BotReply.dbRequestFailed();
  }

  if (!user.isTermAccepted) {
    return BotReply.pleaseAcceptTerm();
  }

  let parsed: RaceCoreData | WrongMessageFormat | PayloadTooLarge;
  const isSwimmer = user.mode === 'swimmer';

  // 選手モードなら選手名なし・いきなり種目名からのメッセージ
  if (isSwimmer) {
    parsed = parseToRaceCoreData([user.userName, text].join('\n'));
  } else {
    parsed = parseToRaceCoreData(text);
  }

  if (parsed instanceof WrongMessageFormat) {
    return BotReply.wrongFormat(isSwimmer);
  } else if (parsed instanceof PayloadTooLarge) {
    return BotReply.tooLongTimeText();
  }

  const raceId = generateId();
  const date = formattedToday();
  const cachedMeet = await fetchCachedMeetData(userId);
  const race: Race = { date, ...cachedMeet, ...parsed };

  // 画像生成
  const generateSheetResult = await generateSheetImage(raceId, race);
  if (generateSheetResult instanceof PaparazzoError) {
    return BotReply.paparazzoError();
  }

  // データ生成
  // ここで失敗すると画像は存在するがデータがテーブルにない状況になる
  const result = await createRace(userId, raceId, race);
  if (result instanceof Error) {
    return BotReply.putRaceError();
  }

  const url = await generateURLforDownload(raceId);
  return BotReply.sheetImage(raceId, url);
}
