import { Message, TextEventMessage } from '@line/bot-sdk';

import {
  createRace,
  requestGenerateSheet,
  fetchUser,
  fetchCachedMeetData,
} from 'aws';
import { BotReply } from 'lineApi';
import { parseToRaceCoreData } from 'lib/timeParser';
import { formattedToday } from 'lib/utils';
import { Race, RaceCoreData } from 'types';
import { ItemNotFoundFromDB } from 'exceptions';
import { sheetImageMessage } from 'showSheet';

export async function createSheet(
  message: TextEventMessage,
  userId: string
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

  const raceId = message.id;
  const date = formattedToday();
  const cachedMeet = await fetchCachedMeetData(userId);
  const race: Race = { date, ...cachedMeet, ...parsed };

  const generateSheetResult = await requestGenerateSheet(raceId, race);
  if (generateSheetResult.status == 'error') {
    return BotReply.paparazzoError();
  }

  const result = await createRace(userId, raceId, race);
  if (result instanceof Error) {
    return BotReply.putRaceError();
  }

  return await sheetImageMessage(raceId);
}
