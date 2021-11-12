import { ImageMessage, TextMessage } from '@line/bot-sdk';

function textMessageBase(text: string): TextMessage {
  return { type: 'text' as const, text };
}

export function failedToIdentifyUser(): TextMessage {
  return textMessageBase(
    'あなたの登録情報を参照できませんでした。時間をおいて再度お試しください。'
  );
}

export function askAgreeTerm(): TextMessage {
  return textMessageBase(
    '利用規約とプライバシーポリシーに同意してからご利用いただけます。'
  );
}

export function askFixCreateSheetFormat(): TextMessage {
  return textMessageBase(
    'データ生成メッセージの形式が間違っています。正しい書式で再送してください。'
  );
}
export function sendSheetImage(url: string): ImageMessage {
  return {
    type: 'image' as const,
    originalContentUrl: url,
    previewImageUrl: url,
  };
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

export function greetAndShowTerm(): TextMessage {
  return textMessageBase(
    '友達登録ありがとうございます！利用規約をご確認の上登録してください'
  );
}

export function alreadyAgreedToTerm(): TextMessage {
  return textMessageBase(
    '利用規約には既に同意いただけております。引き続きご利用ください'
  );
}

export function updateUserError(): TextMessage {
  return textMessageBase(
    '利用規約には既に同意いただけております。引き続きご利用ください'
  );
}

export function tutorial(): TextMessage {
  return textMessageBase(
    'ご利用いただきありがとうございます！MiZはレース結果を画像化するサービスです。まずはサンプルデータをお試しください'
  );
}
