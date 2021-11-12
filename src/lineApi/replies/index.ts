import { ImageMessage, TextMessage } from '@line/bot-sdk';

export function failedToIdentifyUser(): TextMessage {
  return {
    type: 'text' as const,
    text: 'あなたの登録情報を参照できませんでした。時間をおいて再度お試しください。',
  };
}

export function askAgreeTerm(): TextMessage {
  return {
    type: 'text' as const,
    text: '利用規約とプライバシーポリシーに同意してからご利用いただけます。',
  };
}

export function askFixCreateSheetFormat(): TextMessage {
  return {
    type: 'text' as const,
    text: 'データ生成メッセージの形式が間違っています。正しい書式で再送してください。',
  };
}
export function sendSheetImage(url: string): ImageMessage {
  return {
    type: 'image' as const,
    originalContentUrl: url,
    previewImageUrl: url,
  };
}
export function paparazzoError(): TextMessage {
  return {
    type: 'text' as const,
    text: '画像生成でエラーが生じました。時間をおいて再度お試しください',
  };
}

export function putRaceError(): TextMessage {
  return {
    type: 'text' as const,
    text: 'データを登録できませんでした。時間をおいて再度お試しください',
  };
}

export function userIdNotFound(): TextMessage {
  return {
    type: 'text' as const,
    text: 'ユーザーのプロフィール情報の取得に同意していないため、ご利用できません。',
  };
}

export function returnFromBlock(): TextMessage {
  return {
    type: 'text' as const,
    text: 'おかえりなさい！\nデータを削除したい場合はお問い合わせください',
  };
}

export function putUserError(): TextMessage {
  return {
    type: 'text' as const,
    text: '友だち追加でエラーが発生しました。時間をおいてから再度友達登録してみてください',
  };
}

export function greetAndShowTerm(): TextMessage {
  return {
    type: 'text' as const,
    text: '友達登録ありがとうございます！利用規約をご確認の上登録してください',
  };
}

export function alreadyAgreedToTerm(): TextMessage {
  return {
    type: 'text' as const,
    text: '利用規約には既に同意いただけております。引き続きご利用ください',
  };
}

export function updateUserError(): TextMessage {
  return {
    type: 'text' as const,
    text: '利用規約には既に同意いただけております。引き続きご利用ください',
  };
}

export function tutorial(): TextMessage {
  return {
    type: 'text' as const,
    text: 'ご利用いただきありがとうございます！MiZはレース結果を画像化するサービスです。まずはサンプルデータをお試しください',
  };
}
