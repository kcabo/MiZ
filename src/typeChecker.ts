import { DbUserItem, PaparazzoResponse } from 'types';

export function isPaparazzoResponse(arg: any): arg is PaparazzoResponse {
  return (
    !!arg &&
    typeof arg.status === 'string' &&
    ['ok', 'error'].includes(arg.status)
  );
}

export function isDbUserItem(arg: any): arg is DbUserItem {
  return (
    !!arg &&
    typeof arg.userId === 'string' &&
    typeof arg.userName === 'string' &&
    typeof arg.mode === 'string' &&
    ['swimmer', 'manager'].includes(arg.mode) &&
    typeof arg.isTermAgreed === 'boolean'
  );
}
