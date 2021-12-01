import { Message, TextEventMessage } from '@line/bot-sdk';

import {
  createRace,
  requestGenerateSheet,
  getUser,
  getCachedMeetData,
} from 'aws';
import { BotReply } from 'lineApi';
import { parseToRaceCoreData } from 'timeParser';
import { formattedToday } from 'utils';
import { DbUserItem, Race } from 'types';
import { ErrorLog } from 'logger';
import { sheetImageMessage } from 'showSheet';

export async function createSheet(
  message: TextEventMessage,
  userId: string
): Promise<Message | Message[]> {
  const user = await getUser(userId);
  if (!user) {
    ErrorLog('Cannot find user:', userId);
    return BotReply.failedToIdentifyUser();
  }

  if (!user.isTermAccepted) {
    return BotReply.pleaseAcceptTerm();
  }

  const messageText = complementSwimmerNameToText(user, message.text);
  const { raceCoreData, error } = parseToRaceCoreData(messageText);
  if (!raceCoreData) {
    return BotReply.askFixCreateSheetFormat();
  }

  const raceId = message.id;
  const date = formattedToday();
  const cachedMeet = await getCachedMeetData(userId);
  const race: Race = { date, ...cachedMeet, ...raceCoreData };

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

function complementSwimmerNameToText(
  user: DbUserItem,
  message: string
): string {
  let messageText: string;
  if (user.mode == 'swimmer') {
    messageText = [user.userName, message].join('\n');
  } else {
    messageText = message;
  }
  return messageText;
}
