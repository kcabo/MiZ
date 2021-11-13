import { Message, HTTPError } from '@line/bot-sdk';
import ErrorLog from 'logger';

import { client } from './client';

export async function reply(
  replyToken: string,
  messages: Message | Message[],
  notificationDisabled?: boolean | undefined
) {
  try {
    await client.replyMessage(replyToken, messages, notificationDisabled);
  } catch (e) {
    if (e instanceof HTTPError) {
      const detail = {
        code: e.statusCode,
        message: e.statusMessage,
        response: e.originalError.response.data,
      };
      ErrorLog('Failed to reply:', detail);
    } else {
      throw e;
    }
  }
}
