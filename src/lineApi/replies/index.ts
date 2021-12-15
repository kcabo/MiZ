import { StickerMessage, TextMessage } from '@line/bot-sdk';

import { getRandomIntInclusive } from 'lib/utils';

export * from './sheetImage';
export * from './sheetImageCarousel';
export * from './registration';
export * from './confirmDeleteRace';
export * from './tutorial';
export * from './correctFormat';

function textMessageBase(text: string): TextMessage {
  return { type: 'text', text };
}

export function randomSticker(): StickerMessage {
  const packageId = '6325';
  const stickerId = getRandomIntInclusive(10979904, 10979927).toString();
  return {
    type: 'sticker',
    stickerId,
    packageId,
  };
}

export function tellIamBot(): TextMessage {
  return textMessageBase('ごめんなさい。個別にお返事はできません🙇');
}

export function failedToIdentifyUser(): TextMessage {
  return textMessageBase(
    'あなたの登録情報を参照できませんでした。時間をおいて再度お試しください。'
  );
}

export function tooLongTimeText(): TextMessage {
  return textMessageBase('タイムが長すぎます。登録できるのは20行までです');
}

export function paparazzoError(): TextMessage {
  return textMessageBase(
    '画像生成でエラーが生じました。時間をおいて再度お試しください'
  );
}

export function putRaceError(): TextMessage {
  return textMessageBase(
    'データを登録できませんでした。時間をおいて再度お試しください'
  );
}

export function userIdNotFound(): TextMessage {
  return textMessageBase(
    'ユーザーのプロフィール情報の取得に同意していないため、ご利用できません。'
  );
}

export function returnFromBlock(): TextMessage {
  return textMessageBase(
    'おかえりなさい！\nデータを削除したい場合はお問い合わせください'
  );
}

export function putUserError(): TextMessage {
  return textMessageBase(
    '友だち追加でエラーが発生しました。時間をおいてから再度友達登録してみてください'
  );
}

export function termsAlreadyAccepted(): TextMessage {
  return textMessageBase(
    '利用規約には既に同意いただけております。引き続きご利用ください'
  );
}

export function updateUserError(): TextMessage {
  return textMessageBase(
    'ユーザーデータの更新にエラーが発生しました。時間をおいて再度お試しください'
  );
}

export function fetchRacesError(): TextMessage {
  return textMessageBase(
    'レース一覧を取得できませんでした。時間をおいて再度お試しください'
  );
}

export function noRaceFound(): TextMessage {
  return textMessageBase('表示するレースデータがありません！');
}

export function unExpectedError(): TextMessage {
  return textMessageBase(
    '予期せぬエラーが発生しました。開発者が急いで対応いたします'
  );
}

export function dbRequestFailed(): TextMessage {
  return textMessageBase(
    'データ処理中にエラーが生じました。アクセスが集中している可能性があります。時間をおいて再度お試しください'
  );
}

export function s3DeleteRequestFailed(): TextMessage {
  return textMessageBase(
    '画像の削除中にエラーが生じました。アクセスが集中している可能性があります。時間をおいて再度お試しください'
  );
}

export function cannotParsePostbackError(): TextMessage {
  return textMessageBase('ポストバック送信データが不正です');
}

export function confirmDeleteTooLate(): TextMessage {
  return textMessageBase(
    '削除リクエストの有効期限が切れました。始めからやり直してください。'
  );
}

export function successfullyDeletedRace(): TextMessage {
  return textMessageBase('レースデータを削除しました');
}
