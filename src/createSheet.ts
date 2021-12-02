import { Message, TextEventMessage } from '@line/bot-sdk';

import {
  createRace,
  generateSheetImage,
  fetchUser,
  fetchCachedMeetData,
  generateURLforDownload,
} from 'aws';
import { BotReply } from 'lineApi';
import { parseToRaceCoreData } from 'lib/parseTime';
import { Race, RaceCoreData } from 'types';
import { ItemNotFoundFromDB, PaparazzoError } from 'exceptions';
import { formattedToday } from 'lib/utils';
import { generateId } from 'lib/generateId';

export async function createSheet(
  userId: string,
  message: TextEventMessage
): Promise<Message | Message[]> {
  const user = await fetchUser(userId);

  if (user instanceof ItemNotFoundFromDB) {
    return BotReply.failedToIdentifyUser();
  } else if (user instanceof Error) {
    return BotReply.unExpectedError();
  }

  if (!user.isTermAccepted) {
    return BotReply.pleaseAcceptTerm();
  }

  let parsed: RaceCoreData | SyntaxError;

  // 選手モードなら選手名なし・いきなり種目名からのメッセージ
  if (user.mode === 'swimmer') {
    parsed = parseToRaceCoreData([user.userName, message.text].join('\n'));
  } else {
    parsed = parseToRaceCoreData(message.text);
  }

  if (parsed instanceof SyntaxError) {
    return BotReply.askFixCreateSheetFormat();
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
  const result = await createRace(userId, raceId, race);
  if (result instanceof Error) {
    return BotReply.putRaceError();
  }

  const url = await generateURLforDownload(raceId);
  return BotReply.sheetImage(raceId, url);
}
