import { MessageEvent, Message, TextEventMessage } from '@line/bot-sdk';
import { generateURLforDownload, requestGenerateSheet } from 'aws';
import {
  askFixCreateSheetFormat,
  paparazzoError,
  sendSheetImage,
} from 'lineApi/replies';
import { parseToRaceCoreData } from 'timeParser';
import { formattedToday } from 'utils';
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
    raceId: '1',
    courseLength: '長水路' as const,
    meet: '大会',
    place: '会場',
    date: formattedToday(),
  };
  const raceData = { ...presetData, ...raceCoreData };
  const result = await requestGenerateSheet(raceData);
  if (result.status == 'error') {
    return paparazzoError();
  }

  const url = await generateURLforDownload('1.png');
  return sendSheetImage(url);
}
