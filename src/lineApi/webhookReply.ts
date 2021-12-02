import { Message, HTTPError } from '@line/bot-sdk';
import { ErrorLog } from 'lib/logger';

import { client } from './client';

export async function reply(
  replyToken: string,
  messages: Message | Message[],
  notificationDisabled?: boolean | undefined
) {
  try {
    inspectPayloadSize(messages);
    await client.replyMessage(replyToken, messages, notificationDisabled);
  } catch (error) {
    if (error instanceof HTTPError) {
      const detail = {
        code: error.statusCode,
        message: error.statusMessage,
        response: error.originalError.response.data,
      };
      ErrorLog('Failed to reply:', detail);
    } else {
      ErrorLog('unexpected error on post reply:', error);
    }
  }
}

function inspectPayloadSize(messages: Message | Message[]) {
  if (process.env.NODE_ENV !== 'development') return;

  const messagePayload = JSON.stringify(messages);
  const size = Buffer.byteLength(messagePayload);
  console.log(`[Debug] Message size: ${size / 1000} kb`); // バブルが30kbまで、カルーセルが50kbまで
}
