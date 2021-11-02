import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { ImageMessage } from '@line/bot-sdk';

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

export async function createSheetEvent(userInputText: string) {
  const data = {
    recordId: 1,
    courseLength: '長水路',
    meet: '大会です',
    place: '家です',
    date: Date().slice(0, 24),
    swimmer: '僕です',
    event: userInputText,
    reaction: 12,
    cumulativeTime: [3001, 6021],
  };
  const { ok, url } = await getSheetImageUrl(data);
  const replyMessage: ImageMessage = {
    type: 'image' as const,
    originalContentUrl: url as string,
    previewImageUrl: url as string,
  };
  return replyMessage;
}
