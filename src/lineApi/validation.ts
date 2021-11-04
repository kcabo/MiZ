import { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  validateSignature,
  WebhookEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';

export function validateAndParseRequest(event: APIGatewayProxyEventV2): {
  valid: boolean;
  lineEvents: WebhookEvent[];
} {
  if (!event.body) {
    console.error('Request body was empty.');
    return { valid: false, lineEvents: [] };
  }

  if (!isLineWebhookEvent(event)) {
    console.error('Failed to validate the request signature.');
    return { valid: false, lineEvents: [] };
  }

  const lineEvents = getWebhookEvents(event.body);
  if (lineEvents) {
    return { valid: true, lineEvents: lineEvents };
  } else {
    return { valid: false, lineEvents: [] };
  }
}

function isLineWebhookEvent(event: APIGatewayProxyEventV2): boolean {
  if (!event.headers || !event.body) return false;

  const signature = event.headers['x-line-signature'];
  if (!signature) return false;

  return validateSignature(
    event.body,
    process.env.LINE_CHANNEL_SECRET,
    signature
  );
}

function getWebhookEvents(body: string): false | WebhookEvent[] {
  let requestBody: any;

  try {
    requestBody = JSON.parse(body);
  } catch (error) {
    console.error('Could not parse the request body.');
    return false;
  }

  if (!isWebhookRequestBody(requestBody)) {
    console.error('Request body did not match the type <WebhookRequestBody>');
    return false;
  }

  return requestBody.events;
}

function isWebhookRequestBody(body: any): body is WebhookRequestBody {
  return (
    body.destination !== undefined &&
    typeof body.destination == 'string' &&
    Array.isArray(body.events)
  );
}
