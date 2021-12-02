import {
  DbRaceItem,
  DbUserItem,
  PaparazzoResponse,
  Race,
  CentiSeconds,
  UserSettings,
  Meet,
  PostbackData,
} from 'types';

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
    typeof arg.sk === 'string' &&
    isUserSettings({ userName: arg.userName, mode: arg.mode }) &&
    typeof arg.isTermAccepted === 'boolean' &&
    typeof arg.friendship === 'boolean' &&
    isValidISO8601(arg.createdAt)
  );
}

export function isSkOnlyArray(arg: any): arg is { sk: string }[] {
  return (
    !!arg && Array.isArray(arg) && arg.every((el) => typeof el.sk === 'string')
  );
}

export function isRace(arg: any): arg is Race {
  return (
    !!arg &&
    isProperlySizedString(arg.swimmer) &&
    isProperlySizedString(arg.event) &&
    isValidDate(arg.date) &&
    isReaction(arg.reaction) &&
    isCourseLength(arg.courseLength) &&
    undefinedOrString(arg.meet) &&
    undefinedOrString(arg.place) &&
    Array.isArray(arg.cumulativeTime) &&
    arg.cumulativeTime.every(isCentiSeconds)
  );
}

export function isDbRaceItem(arg: any): arg is DbRaceItem {
  return (
    !!arg &&
    typeof arg.userId === 'string' &&
    typeof arg.sk === 'string' &&
    isValidISO8601(arg.updatedAt) &&
    isRace(arg)
  );
}

export function isDbRaceItemArray(arg: any): arg is DbRaceItem[] {
  return !!arg && Array.isArray(arg) && arg.every(isDbRaceItem);
}

export function isMeet(arg: any): arg is Meet {
  return (
    !!arg &&
    isCourseLength(arg.courseLength) &&
    undefinedOrString(arg.meet) &&
    undefinedOrString(arg.place)
  );
}

export function isUserSettings(arg: any): arg is UserSettings {
  return (
    !!arg &&
    isProperlySizedString(arg.userName) &&
    typeof arg.mode === 'string' &&
    ['swimmer', 'manager'].includes(arg.mode)
  );
}

function isProperlySizedString(arg: any): arg is string {
  return typeof arg === 'string' && arg.length > 0 && arg.length < 50;
}

function undefinedOrString(arg: any): arg is string | undefined {
  return typeof arg === 'undefined' || isProperlySizedString(arg);
}

function isCentiSeconds(arg: any): arg is CentiSeconds {
  return Number.isInteger(arg) && arg >= 0 && arg < 360000;
}

function isReaction(arg: any): arg is CentiSeconds | undefined {
  return typeof arg === 'undefined' || isCentiSeconds(arg);
}

function isCourseLength(arg: any): arg is '長水路' | '短水路' | undefined {
  return (
    typeof arg === 'undefined' ||
    (typeof arg === 'string' && ['長水路', '短水路'].includes(arg))
  );
}

// ありえない月などが入り込む可能性があるが、並び替えできれば十分なので単純な正規表現にとどめている
function isValidDate(arg: any): arg is string {
  return typeof arg === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(arg);
}

function isValidISO8601(arg: any): arg is string {
  return (
    typeof arg === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(arg)
  );
}

export function isPostbackData(arg: any): arg is PostbackData {
  return (
    !!arg &&
    typeof arg.type === 'string' &&
    ((arg.type === 'acceptTerm' && ['swimmer', 'manager'].includes(arg.mode)) ||
      (arg.type === 'download' && typeof arg.raceId === 'string') ||
      (arg.type === 'rerender' && typeof arg.raceId === 'string') ||
      (arg.type === 'reqDelete' && typeof arg.raceId === 'string') ||
      (arg.type === 'delete' &&
        typeof arg.raceId === 'string' &&
        typeof arg.expiresAt === 'number'))
  );
}
