import { FlexMessage } from '@line/bot-sdk';

import { nowUnix } from 'lib/utils';
import { DbRaceItem, DeleteRacePostback } from 'types';

export function confirmDeleteRace(race: DbRaceItem): FlexMessage {
  const deleteRaceActionPayload: DeleteRacePostback = {
    type: 'delete',
    raceId: race.sk,
    expiresAt: nowUnix() + 60, // 60秒間有効
  };

  return {
    type: 'flex',
    altText: 'レースデータを削除しますか？',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '本当に以下のデータを削除しますか？削除しない場合は無視してください',
            size: 'sm',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '大会名' + (race.place || '-'),
              },
              {
                type: 'text',
                text: '日付' + race.date,
              },
              {
                type: 'text',
                text: '選手名' + race.swimmer,
              },
              {
                type: 'text',
                text: '種目' + race.event,
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: '削除',
                action: {
                  type: 'postback',
                  label: '-',
                  data: JSON.stringify(deleteRaceActionPayload),
                  displayText: '[削除]',
                },
              },
            ],
            paddingAll: 'md',
          },
          {
            type: 'text',
            text: '画像が表示されない・表示が崩れている場合は再生成を試してください',
            wrap: true,
          },
          {
            type: 'text',
            text: '画像を再生成',
            color: '#559ab9',
            action: {
              type: 'postback',
              label: 'action',
              data: 'hello',
              displayText: '[画像を再生成]',
            },
          },
        ],
      },
    },
  };
}
