import { Message } from '@line/bot-sdk';
import { RequestDeleteRacePostback, RerenderSheetPostback } from 'types';

const RACES_LIFF_ID = process.env.RACES_LIFF_ID || '';
const ORIGIN = process.env.PUBLIC_ASSETS_ORIGIN;

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
                  imageUrl: ORIGIN + '/icons/edit.png',
                  action: {
                    type: 'uri',
                    label: '編集',
                    uri: editRaceLiffUrl,
                  },
                },
                {
                  type: 'action',
                  imageUrl: ORIGIN + '/icons/refresh.png',
                  action: {
                    type: 'postback',
                    label: '更新',
                    data: JSON.stringify(rerenderActionPayload),
                    displayText: '[更新]',
                  },
                },
                {
                  type: 'action',
                  imageUrl: ORIGIN + '/icons/delete.png',
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
