import { Message, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { validateAndParseRequest, reply, extractUserId } from 'lineApi';
import { createSheetEvent } from 'createSheet';
import { register } from 'UserRegister';
import { blockedByUser } from 'UserQuit';

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
  const userId = await extractUserId(event);
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
    await blockedByUser(userId);
  } else {
    console.error('unknown event!:', JSON.stringify(event, null, 2));
  }
}
