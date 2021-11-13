import { WebhookEvent } from '@line/bot-sdk';
import ErrorLog from 'logger';
import * as BotReply from './replies';
import { reply } from './webhookReply';

export async function extractUserId(event: WebhookEvent): Promise<string> {
  const userId = event.source.userId;
  if (typeof userId === 'string') {
    return userId;
  }

  ErrorLog('Cannot extract LINE userId from event:', event);
  if ('replyToken' in event) {
    const response = BotReply.userIdNotFound();
    await reply(event.replyToken, response);
  }
  return '-';
}
