import { RaceCoreData } from 'types';

type ParseResult =
  | {
      error: string;
    }
  | {
      data: RaceCoreData;
    };

const inputTextPattern =
  /^(?<swimmer>.*[^\s0-9０-９].*)\n(?<event>.*[^\s0-9０-９].*)(?<reactionStrPrefixed>\n[0-9０-９]{2,3})?(?<cumulativeTimeStrPrefixed>(?:\n[0-9０-９]{3,6})+$)/;

type MatchedObjects = {
  swimmer: string;
  event: string;
  reactionStrPrefixed?: string;
  cumulativeTimeStrPrefixed: string;
};

// 選手名\n種目名\nRTとタイム～の形式の入力
export function parseToRaceCoreData(concatInput: string): ParseResult {
  const found = concatInput.match(inputTextPattern);
  if (!found) {
    return { error: 'unmatching pattern' };
  }

  const { swimmer, event, reactionStrPrefixed, cumulativeTimeStrPrefixed } =
    found.groups as MatchedObjects;

  // 正規表現の都合上、\n～の形でマッチするため、頭の改行文字を削除する
  const cumulativeTimeStr = removePrefixedLinefeed(cumulativeTimeStrPrefixed);
  const cumulativeTime = toCentiSecondsArray(cumulativeTimeStr);
  let result: RaceCoreData = {
    swimmer,
    event,
    cumulativeTime,
  };

  if (reactionStrPrefixed) {
    // 正規表現の都合上、\n～の形でマッチするため、頭の改行文字を削除する
    const reactionStr = removePrefixedLinefeed(reactionStrPrefixed);
    const reaction = toCentiSeconds(reactionStr);
    result = { ...result, reaction };
  }
  return { data: result };
}

export function toCentiSeconds(concatTime: string): number {
  // 全部の桁が数字であることと6桁以内であることの確認
  if (!/^[0-9]{1,6}$/.test(concatTime)) {
    throw new Error('cannot convert to seconds!');
  }
  const paddedConcatTime = concatTime.padStart(6, '0');
  const minutesSegment = paddedConcatTime.slice(0, 2);
  const secondsSegment = paddedConcatTime.slice(2, 4);
  const centiSecondsSegment = paddedConcatTime.slice(4, 6);
  const centiSeconds =
    parseInt(minutesSegment) * 6000 +
    parseInt(secondsSegment) * 100 +
    parseInt(centiSecondsSegment);
  return centiSeconds;
}

export function toCentiSecondsArray(concatTimeLines: string): number[] {
  // 全角数字を半角に置き換える
  const normalizedCharacters = toZenkaku(concatTimeLines);
  const concatTimeArray = normalizedCharacters.split('\n');
  return concatTimeArray.map((str) => toCentiSeconds(str));
}

function toZenkaku(str: string) {
  return str.replace(/[０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
}

function removePrefixedLinefeed(str: string) {
  return str.slice(1);
}
