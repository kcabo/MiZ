import { Message, WebhookEvent } from '@line/bot-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { reply, getWebhookEvents, isLineWebhookEvent } from 'line';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  if (isLineWebhookEvent(event)) {
    // console.log('Request from LINE: ' + JSON.stringify(event, null, 1));

    try {
      const events = getWebhookEvents(event.body);
      await Promise.all(events.map(async (event) => await processEvent(event)));
    } catch (e) {
      console.error('UNEXPECTED ERROR!! >\n', e);
    } finally {
      return {
        statusCode: 200,
        body: 'ok',
      };
    }
  } else {
    // console.warn('Request not from LINE: ' + JSON.stringify(event, null, 1));

    return {
      statusCode: 200,
      body: 'who are you?',
    };
  }
}

async function processEvent(event: WebhookEvent) {
  if (event.type == 'message') {
    const { replyToken } = event;
    let response: Message;
    if (event.message.type == 'text') {
      response = {
        type: 'text' as const,
        text: event.message.text,
      };
    } else {
      response = {
        type: 'text' as const,
        text: 'Hello!',
      };
    }
    await reply(replyToken, response);
  }
}
