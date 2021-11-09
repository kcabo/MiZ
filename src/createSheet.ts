import { Message, TextEventMessage } from '@line/bot-sdk';
import { generateURLforDownload, putNewRace, requestGenerateSheet } from 'aws';
import {
  askFixCreateSheetFormat,
  paparazzoError,
  putRaceError,
  sendSheetImage,
} from 'lineApi/replies';
import { parseToRaceCoreData } from 'timeParser';
import { formattedToday } from 'utils';
import { RaceData } from 'types';

export async function createSheetEvent(
  message: TextEventMessage,
  userId: string
): Promise<Message | Message[]> {
  const { raceCoreData, error } = parseToRaceCoreData(message.text);
  if (!raceCoreData) {
    return askFixCreateSheetFormat();
  }

  const presetData = {
    raceId: '1',
    courseLength: '長水路' as const,
    meet: '大会',
    place: '会場',
    date: formattedToday(),
  };
  const raceData: RaceData = { ...presetData, ...raceCoreData };

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
