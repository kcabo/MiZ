import { ImageMessage, TextMessage } from '@line/bot-sdk';

export function askFixCreateSheetFormat(): TextMessage {
  return {
    type: 'text' as const,
    text: 'メッセージが間違っています。正しい書式で再送してください。',
  };
}
export function sendSheetImage(url: string): ImageMessage {
  return {
    type: 'image' as const,
    originalContentUrl: url as string,
    previewImageUrl: url as string,
  };
}
export function paparazzoError(): TextMessage {
  return {
    type: 'text' as const,
    text: '画像生成でエラーが生じました。時間をおいて再度お試しください',
  };
}
