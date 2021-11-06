import { MessageEvent, Message, TextEventMessage } from '@line/bot-sdk';
import { generateURLforDownload, requestGenerateSheet } from 'aws';
import {
  askFixCreateSheetFormat,
  paparazzoError,
  sendSheetImage,
} from 'lineApi/replies';
import { parseToRaceCoreData } from 'timeParser';
import { RaceCoreData, RaceData } from 'types';

export async function createSheetEvent(
  event: MessageEvent
): Promise<Message | Message[]> {
  const message = event.message as TextEventMessage;
  const { raceCoreData, error } = parseToRaceCoreData(message.text);
  if (!raceCoreData) {
    return askFixCreateSheetFormat();
  }
  const presetData = {
    // recordId: 1,
    raceId: '1',
    courseLength: '長水路' as const,
    meet: '大会',
    place: '会場',
    date: getDate(),
  };
  const raceData = { ...presetData, ...raceCoreData };
  const result = await requestGenerateSheet(raceData);
  if (result.status == 'error') {
    return paparazzoError();
  }

  const url = await generateURLforDownload('1.png');
  return sendSheetImage(url);
}

function getDate() {
  return new Date(
    Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
  ).toString();
}
