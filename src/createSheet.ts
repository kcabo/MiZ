import { Message, TextEventMessage } from '@line/bot-sdk';

import {
  generateURLforDownload,
  putNewRace,
  requestGenerateSheet,
  getUser,
  getCachedMeetData,
} from 'aws';
import {
  askAgreeTerm,
  askFixCreateSheetFormat,
  failedToIdentifyUser,
  paparazzoError,
  putRaceError,
  sendSheetImage,
} from 'lineApi/replies';
import { parseToRaceCoreData } from 'timeParser';
import { formattedToday } from 'utils';
import { DbUserItem, RaceData } from 'types';

export async function createSheetEvent(
  message: TextEventMessage,
  userId: string
): Promise<Message | Message[]> {
  const user = await getUser(userId);
  if (!user) {
    return failedToIdentifyUser();
  }

  if (!user.isTermAgreed) {
    return askAgreeTerm();
  }

  const messageText = complementSwimmerNameToText(user, message.text);
  const { raceCoreData, error } = parseToRaceCoreData(messageText);
  if (!raceCoreData) {
    return askFixCreateSheetFormat();
  }

  const presetData = {
    raceId: '1',
    date: formattedToday(),
  };
  const cachedMeet = await getCachedMeetData(userId);
  const raceData: RaceData = { ...presetData, ...cachedMeet, ...raceCoreData };

  const generateSheetResult = await requestGenerateSheet(raceData);
  if (generateSheetResult.status == 'error') {
    return paparazzoError();
  }

  const putDataResult = await putNewRace(raceData, userId);
  if (putDataResult.$metadata.httpStatusCode !== 200) {
    return putRaceError();
  }

  const sheetObjectKey = '1.png';
  const url = await generateURLforDownload(sheetObjectKey);

  return sendSheetImage(url);
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
