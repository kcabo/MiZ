import { Message } from '@line/bot-sdk';
import { RequestDeleteRacePostback, RerenderSheetPostback } from 'types';

const RACES_LIFF_ID = process.env.RACES_LIFF_ID || '';

export function sheetImage(
  raceId: string,
  url: string,
  options?: { imageOnly: boolean }
): Message[] {
  const editRaceLiffUrl = `https://liff.line.me/${RACES_LIFF_ID}/${raceId}`;

  const rerenderActionPayload: RerenderSheetPostback = {
    type: 'rerender',
    raceId: raceId,
  };

  const requestDeleteRaceActionPayload: RequestDeleteRacePostback = {
    type: 'reqDelete',
    raceId: raceId,
  };

  return [
    ...(options?.imageOnly
      ? []
      : [{ type: 'text' as const, text: '✨できました！' }]),
    {
      type: 'image',
      originalContentUrl: url,
      previewImageUrl: url,
      ...(options?.imageOnly
        ? {}
        : {
            quickReply: {
              items: [
                {
                  type: 'action',
                  imageUrl:
                    'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/edit.png',
                  action: {
                    type: 'uri',
                    label: '編集',
                    uri: editRaceLiffUrl,
                  },
                },
                {
                  type: 'action',
                  imageUrl:
                    'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/refresh.png',
                  action: {
                    type: 'postback',
                    label: '更新',
                    data: JSON.stringify(rerenderActionPayload),
                    displayText: '[更新]',
                  },
                },
                {
                  type: 'action',
                  imageUrl:
                    'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/delete.png',
                  action: {
                    type: 'postback',
                    label: '削除',
                    data: JSON.stringify(requestDeleteRaceActionPayload),
                    displayText: '[削除する]',
                  },
                },
              ],
            },
          }),
    },
  ];
}
