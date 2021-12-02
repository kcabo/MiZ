import { PayloadTooLarge, WrongMessageFormat } from 'exceptions';
import { shortenedEventToProperStyle } from 'lib/convertEvent';
import { RaceCoreData } from 'types';

// 選手名\n種目名\nRTとタイム～の形式の入力
export function parseToRaceCoreData(
  input: string
): RaceCoreData | WrongMessageFormat | PayloadTooLarge {
  const matched = applyPattern(input);
  if (matched instanceof WrongMessageFormat) {
    return matched;
  }

  const cumulativeTime = toCentiSecondsArray(matched.cumulativeTimeStr);
  if (cumulativeTime instanceof PayloadTooLarge) {
    return cumulativeTime;
  }

  const formalEvent = shortenedEventToProperStyle(matched.event);

  let raceCoreData: RaceCoreData = {
    swimmer: matched.swimmer,
    event: formalEvent,
    cumulativeTime,
  };

  if (matched.reactionStr) {
    const reaction = toCentiSeconds(matched.reactionStr);
    raceCoreData = { ...raceCoreData, reaction };
  }

  return raceCoreData;
}

const inputTextPattern =
  /^(?<gSwimmer>.*[^\n0-9０-９].*)\n(?<gEvent>.*[^\s0-9０-９].*)(?<gReaction>\n[0-9０-９]{2,3})?(?<gCumulativeTime>(?:\n[0-9０-９]{3,6})+$)/;

type MatchedObjects = {
  gSwimmer: string;
  gEvent: string;
  gReaction?: string;
  gCumulativeTime: string;
};

function applyPattern(input: string) {
  const found = input.match(inputTextPattern);
  if (!found) {
    return new WrongMessageFormat();
  }

  let { gSwimmer, gEvent, gReaction, gCumulativeTime } =
    found.groups as MatchedObjects; // safe

  // 正規表現の都合上、\n～の形でマッチするため、頭の改行文字を削除する
  gCumulativeTime = removePrefixedLinefeed(gCumulativeTime);

  if (gReaction) {
    gReaction = removePrefixedLinefeed(gReaction);
  }

  return {
    swimmer: gSwimmer,
    event: gEvent,
    reactionStr: gReaction,
    cumulativeTimeStr: gCumulativeTime,
  };
}

function toCentiSecondsArray(
  concatTimeLines: string
): number[] | PayloadTooLarge {
  // 全角数字を半角に置き換える
  const normalizedCharacters = toHankakuNum(concatTimeLines);
  const strTimeArray = normalizedCharacters.split('\n');
  if (strTimeArray.length > 20) return new PayloadTooLarge('too long time');
  const centiSecondsArray = strTimeArray.map((str) => toCentiSeconds(str));
  return centiSecondsArray;
}

// /^[0-9]{1,6}$/にマッチすることは事前の正規表現で確認している
function toCentiSeconds(concatTime: string): number {
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
  applyPattern,
};
