import { Message, TextEventMessage } from '@line/bot-sdk';

import {
  generateURLforDownload,
  putNewRace,
  requestGenerateSheet,
  getUser,
  getCachedMeetData,
} from 'aws';
import { BotReply } from 'lineApi';
import { parseToRaceCoreData } from 'timeParser';
import { formattedToday } from 'utils';
import { DbUserItem, RaceData } from 'types';
import ErrorLog from 'logger';

export async function createSheet(
  message: TextEventMessage,
  userId: string
): Promise<Message | Message[]> {
  const user = await getUser(userId);
  if (!user) {
    ErrorLog('Cannot find user:', userId);
    return BotReply.failedToIdentifyUser();
  }

  if (!user.isTermAgreed) {
    return BotReply.askAgreeTerm();
  }

  const messageText = complementSwimmerNameToText(user, message.text);
  const { raceCoreData, error } = parseToRaceCoreData(messageText);
  if (!raceCoreData) {
    return BotReply.askFixCreateSheetFormat();
  }

  const raceId = message.id;
  const date = formattedToday();
  const cachedMeet = await getCachedMeetData(userId);
  const raceData: RaceData = { raceId, date, ...cachedMeet, ...raceCoreData };

  const generateSheetResult = await requestGenerateSheet(raceData);
  if (generateSheetResult.status == 'error') {
    return BotReply.paparazzoError();
  }

  const putDataResult = await putNewRace(raceData, userId);
  if (putDataResult.$metadata.httpStatusCode !== 200) {
    return BotReply.putRaceError();
  }

  const sheetObjectKey = raceId + '.png';
  const url = await generateURLforDownload(sheetObjectKey);

  return BotReply.sendSheetImage(url);
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
