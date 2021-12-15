import { WebhookEvent } from '@line/bot-sdk';
import { DbItem } from 'types';

export function ErrorLog(message: string, arg: any) {
  if (arg instanceof Error) {
    console.error(message, arg);
  } else if (typeof arg === 'object') {
    try {
      console.error(message, JSON.stringify(arg, null, 2));
    } catch (error) {
      // escape 'Converting circular structure to JSON' error
      console.error(message, arg);
    }
  } else {
    console.error(message, arg);
  }
}

export function dbErrorLog(
  type: 'create' | 'get' | 'delete' | 'batch' | 'query' | 'update',
  item: DbItem,
  error: Error
) {
  const { userId, sk, ...rest } = item;
  console.error(
    `[${type}] request failed on userId=${userId}, sk=${sk}:`,
    rest
  );
  console.error(error);
}

export function EventLog(events: WebhookEvent[]) {
  events.forEach((event) => {
    console.log(`EVENT: [${event.type}]`, JSON.stringify(event, null, 2));
  });
}
