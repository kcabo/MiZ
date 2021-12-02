import { shortenedEventToProperStyle } from 'lib/convertEvent';
import { RaceCoreData } from 'types';

const inputTextPattern =
  /^(?<swimmer>.*[^\n0-9０-９].*)\n(?<event>.*[^\s0-9０-９].*)(?<strReactionPrefixed>\n[0-9０-９]{2,3})?(?<strCumulativeTimePrefixed>(?:\n[0-9０-９]{3,6})+$)/;

type MatchedObjects = {
  swimmer: string;
  event: string;
  strReactionPrefixed?: string;
  strCumulativeTimePrefixed: string;
};

// 選手名\n種目名\nRTとタイム～の形式の入力
export function parseToRaceCoreData(input: string): RaceCoreData | SyntaxError {
  const found = input.match(inputTextPattern);
  if (!found) {
    return SyntaxError('invalid pattern');
  }

  const { swimmer, event, strReactionPrefixed, strCumulativeTimePrefixed } =
    found.groups as MatchedObjects; // safe

  // 正規表現の都合上、\n～の形でマッチするため、頭の改行文字を削除する
  const cumulativeTimeStr = removePrefixedLinefeed(strCumulativeTimePrefixed);
  let raceCoreData: RaceCoreData = {
    swimmer,
    event: shortenedEventToProperStyle(event),
    cumulativeTime: toCentiSecondsArray(cumulativeTimeStr),
  };

  if (strReactionPrefixed) {
    // 正規表現の都合上、\n～の形でマッチするため、頭の改行文字を削除する
    const reactionStr = removePrefixedLinefeed(strReactionPrefixed);
    const reaction = toCentiSeconds(reactionStr);
    raceCoreData = { ...raceCoreData, reaction };
  }

  return raceCoreData;
}

function toCentiSecondsArray(concatTimeLines: string): number[] {
  // 全角数字を半角に置き換える
  const normalizedCharacters = toHankakuNum(concatTimeLines);
  const concatTimeArray = normalizedCharacters.split('\n');
  return concatTimeArray.map((str) => toCentiSeconds(str));
}

function toCentiSeconds(concatTime: string): number {
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

function toHankakuNum(str: string) {
  return str.replace(/[０-９．]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  );
}

function removePrefixedLinefeed(str: string) {
  return str.slice(1);
}

// for tests only
export const __local__ = {
  toCentiSeconds,
  toCentiSecondsArray,
};
