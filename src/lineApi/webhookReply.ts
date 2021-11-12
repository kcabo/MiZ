import { Message, HTTPError } from '@line/bot-sdk';

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
      console.error('reply failed >', JSON.stringify(detail, null, 1));
    } else {
      throw e;
    }
  }
}
