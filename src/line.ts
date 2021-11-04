import { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  validateSignature,
  WebhookEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';

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
