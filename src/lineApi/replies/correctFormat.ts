import { Message, TextMessage } from '@line/bot-sdk';
import { howToUseCarousel } from './tutorial';

export function wrongFormatNormal(isSwimmer: boolean): Message[] {
  return [
    {
      type: 'text',
      text: '送信フォーマットが間違っています💦 下記を参考に正しいフォーマットで再送してください🙇',
    },
    howToUseCarousel(isSwimmer),
  ];
}

export function wrongFormatWithSymbol(suggestion: string): TextMessage[] {
  return [
    {
      type: 'text',
      text: 'コロンやピリオドは不要です💦 以下が正しいメッセージならコピペして再送してください🙇',
    },
    {
      type: 'text',
      text: suggestion,
    },
  ];
}

export function wrongFormatWithNoEvent(input: string): TextMessage[] {
  return [
    {
      type: 'text',
      text: '種目名が含まれていません💦 以下の例のように種目名と合わせて送信してください🙇',
    },
    {
      type: 'text',
      text: 'はんふり\n' + input,
    },
  ];
}
