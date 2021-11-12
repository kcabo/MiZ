import {
  FlexMessage,
  ImageMessage,
  StickerMessage,
  TextMessage,
} from '@line/bot-sdk';
import { getRandomIntInclusive } from 'utils';

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
  return textMessageBase(
    '申し訳ございませんが、個別にお返事することはできません'
  );
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
    'ユーザーデータの更新にエラーが発生しました。時間をおいて再度お試しください'
  );
}

export function tutorial(): TextMessage {
  return textMessageBase(
    'ご利用いただきありがとうございます！MiZはレース結果を画像化するサービスです。まずはサンプルデータをお試しください'
  );
}

export function sampleFlex(): FlexMessage {
  return {
    type: 'flex',
    altText: 'sample',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Buy milk and lettuce before class',
                color: '#8C8C8C',
                size: 'sm',
                wrap: true,
              },
            ],
            flex: 1,
          },
        ],
        spacing: 'md',
        paddingAll: '12px',
        action: {
          type: 'postback',
          label: 'hoge',
          data: JSON.stringify({ TTL: 2111, sk: '21233' }),
          displayText: '{\\aa/:}"\'',
        },
      },
    },
  };
}
