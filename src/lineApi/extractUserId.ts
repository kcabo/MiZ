import { WebhookEvent } from '@line/bot-sdk';
import * as BotReply from './replies';
import { reply } from './webhookReply';

export async function extractUserId(event: WebhookEvent): Promise<string> {
  const userId = event.source.userId;
  if (typeof userId === 'string') {
    return userId;
  }

  console.error('Cannot get LINE userId!:', JSON.stringify(event, null, 2));
  if ('replyToken' in event) {
    const response = BotReply.userIdNotFound();
    await reply(event.replyToken, response);
  }
  return '-';
}
