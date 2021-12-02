import { EventMessage, Message, Postback, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import {
  validateAndParseRequest,
  reply,
  extractUserId,
  BotReply,
} from 'lineApi';
import { ErrorLog } from 'lib/logger';
import { createSheet } from 'createSheet';
import { becomeFriend } from 'becomeFriend';
import { startService } from 'startService';
import { blockedByUser } from 'blockedByUser';
import { listRaces } from 'listRaces';
import { PostbackData } from 'types';
import { showSheet } from 'showSheet';
import { confirmDeleteRace, confirmedDeleteRace } from 'deleteRace';
import { rerenderSheet } from 'rerenderSheet';

export async function handler(
  ApiGatewayEvent: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { valid, lineEvents } = validateAndParseRequest(ApiGatewayEvent);
  // console.log(JSON.stringify(ApiGatewayEvent, null, 2));

  if (!valid) {
    ErrorLog('Request not from LINE:', lineEvents);
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
    const response = await becomeFriend(userId);
    await reply(event.replyToken, response);
  } else if (event.type == 'unfollow') {
    // ユーザーによるブロック
    await blockedByUser(userId);
  } else if (event.type == 'postback') {
    // FlexMessageによるPostback
    const response = await respondToPostback(event.postback, userId);
    await reply(event.replyToken, response);
  } else {
    ErrorLog('unknown event!:', event);
  }
}

async function respondToMessage(
  message: EventMessage,
  userId: string
): Promise<Message | Message[]> {
  if (message.type != 'text') {
    return BotReply.randomSticker();
  }

  if (message.text == '一覧') {
    return await listRaces(userId);
  }

  if (/^!render=\w+$/.test(message.text)) {
    const raceId = message.text.slice(8); // !render= が8文字
    return await rerenderSheet(userId, raceId);
  }

  if (!message.text.includes('\n')) {
    return BotReply.tellIamBot();
  }

  return await createSheet(userId, message);
}

async function respondToPostback(
  postback: Postback,
  userId: string
): Promise<Message | Message[]> {
  const postbackPayload = parsePostbackData(postback.data);

  if (!postbackPayload) {
    return BotReply.cannotParsePostbackError();
  }

  if (postbackPayload.type === 'download') {
    const raceId = postbackPayload.raceId;
    return await showSheet(userId, raceId);
  } else if (postbackPayload.type === 'rerender') {
    const raceId = postbackPayload.raceId;
    return await rerenderSheet(userId, raceId);
  } else if (postbackPayload.type === 'reqDelete') {
    const raceId = postbackPayload.raceId;
    return await confirmDeleteRace(userId, raceId);
  } else if (postbackPayload.type === 'delete') {
    const raceId = postbackPayload.raceId;
    const expiresAt = postbackPayload.expiresAt;
    return await confirmedDeleteRace(userId, raceId, expiresAt);
  } else if (postbackPayload.type === 'acceptTerm') {
    const mode = postbackPayload.mode;
    return await startService(userId, mode);
  }

  ErrorLog('Received unknown postback:', postback);
  return BotReply.unExpectedError();
}

function parsePostbackData(str: string): PostbackData | undefined {
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed.type !== 'string') {
      throw new Error('postback has no type key');
    }
    return parsed;
  } catch (e) {
    ErrorLog('Cannot parse postback data:', str);
    return undefined;
  }
}
