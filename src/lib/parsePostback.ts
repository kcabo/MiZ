import { PostbackData } from 'types';
import { isPostbackData } from './typeGuard';
import { ErrorLog } from 'lib/logger';
import { InvalidItem } from 'exceptions';

export function parsePostbackData(str: string): PostbackData | undefined {
  try {
    const parsed = JSON.parse(str);
    if (!isPostbackData(parsed)) throw new InvalidItem();

    return parsed;
  } catch (error) {
    ErrorLog(`Cannot parse to postback data: ${str}`, error);
    return undefined;
  }
}
