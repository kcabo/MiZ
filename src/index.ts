import { Message, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createSheetEvent } from 'createSheet';
import { validateAndParseRequest } from 'lineApi/validation';
import { reply } from 'lineApi/client';

export async function handler(
  ApiGatewayEvent: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { valid, lineEvents } = validateAndParseRequest(ApiGatewayEvent);
  // console.log(JSON.stringify(ApiGatewayEvent, null, 1));

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
    const { replyToken } = event;
    let response: Message | Message[];
    if (event.message.type == 'text') {
      response = await createSheetEvent(event);
    } else {
      response = { type: 'text', text: 'hello!' };
    }
    await reply(replyToken, response);
  }
}
