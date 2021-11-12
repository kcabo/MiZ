import { Message, ReplyableEvent, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createSheetEvent } from 'createSheet';
import { validateAndParseRequest } from 'lineApi/validation';
import { reply } from 'lineApi/webhookReply';
import { userIdNotFound } from 'lineApi/replies';
import { register } from 'UserRegister';

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
  const userId = await getUserId(event);
  if (event.type == 'message') {
    let response: Message | Message[];

    if (event.message.type == 'text') {
      response = await createSheetEvent(event.message, userId);
    } else {
      response = { type: 'text', text: 'hello!' };
    }

    await reply(event.replyToken, response);
  } else if (event.type == 'follow') {
    const response = await register(userId);

    await reply(event.replyToken, response);
  } else if (event.type == 'unfollow') {
  } else {
    console.error('unknown event!:', JSON.stringify(event, null, 2));
  }
}

async function getUserId(event: WebhookEvent): Promise<string> {
  const userId = event.source.userId;
  if (typeof userId === 'string') {
    return userId;
  }

  console.error('Cannot get LINE userId!:', JSON.stringify(event, null, 2));
  if ('replyToken' in event) {
    const response = userIdNotFound();
    await reply(event.replyToken, response);
  }
  return '-';
}
