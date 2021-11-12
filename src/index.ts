import { EventMessage, Message, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import {
  validateAndParseRequest,
  reply,
  extractUserId,
  BotReply,
} from 'lineApi';
import { createSheet } from 'createSheet';
import { register } from 'UserRegister';
import { blockedByUser } from 'UserQuit';

export async function handler(
  ApiGatewayEvent: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { valid, lineEvents } = validateAndParseRequest(ApiGatewayEvent);
  // console.log(JSON.stringify(ApiGatewayEvent, null, 2));

  if (!valid) {
    console.warn('Request not from LINE');
    return { statusCode: 200, body: 'who are you?' };
  }

  await Promise.all(lineEvents.map(async (e) => await processEvent(e)));
  return { statusCode: 200, body: 'ok' };
}

async function processEvent(event: WebhookEvent) {
  const userId = await extractUserId(event);
  if (event.type == 'message') {
    // 通常の画像生成リクエストか関係のないメッセージ
    const response = await respondToMessage(event.message, userId);
    await reply(event.replyToken, response);
  } else if (event.type == 'follow') {
    // ユーザーの新規登録またはブロック解除
    const response = await register(userId);
    await reply(event.replyToken, response);
  } else if (event.type == 'unfollow') {
    // ユーザーによるブロック
    await blockedByUser(userId);
  } else {
    console.error('unknown event!:', JSON.stringify(event, null, 2));
  }
}

async function respondToMessage(
  message: EventMessage,
  userId: string
): Promise<Message | Message[]> {
  if (message.type != 'text') {
    return BotReply.ramdomSticker();
  }

  if (!message.text.includes('\n')) {
    return BotReply.tellIamAbot();
  }

  return await createSheet(message, userId);
}
