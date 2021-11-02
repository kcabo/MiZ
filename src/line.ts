import { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  Client,
  Message,
  validateSignature,
  WebhookEvent,
  WebhookRequestBody,
  HTTPError,
} from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

export function isLineWebhookEvent(event: APIGatewayProxyEventV2) {
  const signature = event.headers['x-line-signature'];
  if (signature && event.body) {
    const isValidSignature = validateSignature(
      event.body,
      process.env.LINE_CHANNEL_SECRET,
      signature
    );
    return isValidSignature;
  } else {
    return false;
  }
}

export function getWebhookEvents(body: string | undefined): WebhookEvent[] {
  if (!body) {
    throw new Error('empty request body!');
  }

  let webhook = JSON.parse(body);
  if (!isWebhookRequestBody(webhook)) {
    throw new Error('invalid request body!' + JSON.stringify(webhook));
  }

  return webhook.events;
}

function isWebhookRequestBody(body: any): body is WebhookRequestBody {
  return (
    body.destination !== undefined &&
    typeof body.destination == 'string' &&
    Array.isArray(body.events)
  );
}

export async function reply(
  replyToken: string,
  messages: Message | Message[],
  notificationDisabled?: boolean | undefined
) {
  try {
    await client.replyMessage(replyToken, messages, notificationDisabled);
  } catch (e) {
    if (e instanceof HTTPError) {
      const detail = {
        code: e.statusCode,
        message: e.statusMessage,
        response: e.originalError.response.data,
      };
      console.error('reply failed >', JSON.stringify(detail, null, 1));
    } else {
      throw e;
    }
  }
}
