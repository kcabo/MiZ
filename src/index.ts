import { Message, ReplyableEvent, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createSheetEvent } from 'createSheet';
import { validateAndParseRequest } from 'lineApi/validation';
import { reply } from 'lineApi/client';
import { userIdNotFound } from 'lineApi/replies';

export async function handler(
  ApiGatewayEvent: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { valid, lineEvents } = validateAndParseRequest(ApiGatewayEvent);
  // console.log(JSON.stringify(ApiGatewayEvent, null, 2));

  if (valid) {
    await Promise.all(lineEvents.map(async (e) => await processEvent(e)));
    return {
      statusCode: 200,
      body: 'ok',
    };
  } else {
    console.warn('Request not from LINE');
    return {
      statusCode: 200,
      body: 'who are you?',
    };
  }
}

async function processEvent(event: WebhookEvent) {
  if (event.type == 'message') {
    let response: Message | Message[];
    const userId = await getUserId(event);

    if (event.message.type == 'text') {
      response = await createSheetEvent(event.message, userId);
    } else {
      response = { type: 'text', text: 'hello!' };
    }
    await reply(event.replyToken, response);
  }
}

async function getUserId(event: ReplyableEvent): Promise<string> {
  const userId = event.source.userId;
  if (typeof userId === 'string') {
    return userId;
  } else {
    console.error('Cannot get LINE userId!:', JSON.stringify(event, null, 2));
    const response = userIdNotFound();
    await reply(event.replyToken, response);
    return '-';
  }
}
