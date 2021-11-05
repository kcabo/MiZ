import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import {
  ImageMessage,
  MessageEvent,
  TextMessage,
  TextEventMessage,
} from '@line/bot-sdk';
import { parseToRaceCoreData } from 'timeParser';
import { RaceCoreData, RaceData } from 'types';

const client = new LambdaClient({ region: 'ap-northeast-1' });
const PAPARAZZO_FUNCTION_ARN = process.env.PAPARAZZO_FUNCTION_ARN;

async function getSheetImageUrl(postData: any) {
  const params = {
    FunctionName: PAPARAZZO_FUNCTION_ARN,
    Payload: Buffer.from(JSON.stringify(postData)),
  };
  const command = new InvokeCommand(params);
  const response = await client.send(command);
  const payload = response.Payload;
  if (payload) {
    const data = JSON.parse(Buffer.from(payload).toString());
    return data;
  } else {
    throw new Error('Paparazzo returned empty payload');
  }
}

export async function createSheetEvent(event: MessageEvent) {
  const message = event.message as TextEventMessage;
  const { raceCoreData, error } = parseToRaceCoreData(message.text);
  if (!raceCoreData) {
    const askRetryMessage: TextMessage = {
      type: 'text' as const,
      text: 'メッセージが間違っています。正しい書式で再送してください。',
    };
    return askRetryMessage;
  }
  const presetData = {
    recordId: 1,
    courseLength: '長水路' as const,
    meet: '大会です',
    place: '家です',
    date: getDate(),
  };
  const raceData = { ...presetData, ...raceCoreData };
  const { ok, url } = await getSheetImageUrl(raceData);
  const replyMessage: ImageMessage = {
    type: 'image' as const,
    originalContentUrl: url as string,
    previewImageUrl: url as string,
  };
  return replyMessage;
}

function getDate() {
  return new Date(
    Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
  ).toString();
}
