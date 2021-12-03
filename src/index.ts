import { Message, Postback, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import {
  validateAndParseRequest,
  reply,
  extractUserId,
  BotReply,
} from 'lineApi';
import { createSheet } from 'createSheet';
import { becomeFriend } from 'becomeFriend';
import { startService } from 'startService';
import { blockedByUser } from 'blockedByUser';
import { listRaces } from 'listRaces';
import { showSheet } from 'showSheet';
import { confirmDeleteRace, confirmedDeleteRace } from 'deleteRace';
import { rerenderSheet } from 'rerenderSheet';
import { parsePostbackData } from 'lib/parsePostback';
import { ErrorLog, EventLog } from 'lib/logger';

export async function handler(
  apiGatewayEvent: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { valid, lineEvents } = validateAndParseRequest(apiGatewayEvent);

  if (!valid) {
    ErrorLog('Request not from LINE:', lineEvents);
    return { statusCode: 200, body: 'who are you?' };
  }

  EventLog(lineEvents);
  await Promise.all(lineEvents.map(async (e) => await processEvent(e)));
  return { statusCode: 200, body: 'ok' };
}

async function processEvent(event: WebhookEvent) {
  const userId = await extractUserId(event);

  // 通常の画像生成リクエストか関係のないメッセージなど
  if (event.type === 'message' && event.message.type === 'text') {
    const response = await respondToText(userId, event.message.text);
    return await reply(event.replyToken, response);
  }

  // テキスト以外のメッセージ
  if (event.type === 'message') {
    const response = BotReply.randomSticker();
    return await reply(event.replyToken, response);
  }

  // ユーザーの新規登録またはブロック解除
  if (event.type === 'follow') {
    const response = await becomeFriend(userId);
    return await reply(event.replyToken, response);
  }

  if (event.type === 'unfollow') {
    return await blockedByUser(userId);
  }

  if (event.type === 'postback') {
    const response = await respondToPostback(userId, event.postback);
    return await reply(event.replyToken, response);
  }

  ErrorLog('unknown event!:', event);
}

async function respondToText(
  userId: string,
  text: string
): Promise<Message | Message[]> {
  if (text.includes('\n')) {
    return await createSheet(userId, text);
  }

  if (text == '一覧') {
    return await listRaces(userId);
  }

  if (/^!render=\w+$/.test(text)) {
    const raceId = text.slice(8); // !render= が8文字
    return await rerenderSheet(userId, raceId);
  }

  return BotReply.tellIamBot();
}

async function respondToPostback(
  userId: string,
  postback: Postback
): Promise<Message | Message[]> {
  const data = parsePostbackData(postback.data);

  if (!data) {
    return BotReply.cannotParsePostbackError();
  }

  if (data.type === 'download') {
    const { raceId } = data;
    return await showSheet(userId, raceId);
  }

  if (data.type === 'rerender') {
    const { raceId } = data;
    return await rerenderSheet(userId, raceId);
  }

  if (data.type === 'reqDelete') {
    const { raceId } = data;
    return await confirmDeleteRace(userId, raceId);
  }

  if (data.type === 'delete') {
    const { raceId, expiresAt } = data;
    return await confirmedDeleteRace(userId, raceId, expiresAt);
  }

  if (data.type === 'acceptTerm') {
    const { mode } = data;
    return await startService(userId, mode);
  }

  ErrorLog('Received unknown postback:', postback);
  return BotReply.unExpectedError();
}
