import { FlexMessage } from '@line/bot-sdk';

import { nowUnix } from 'lib/utils';
import { DeleteRacePostback, Race } from 'types';

const ORIGIN = process.env.PUBLIC_ASSETS_ORIGIN;

export function confirmDeleteRace(raceId: string, race: Race): FlexMessage {
  const deleteRaceActionPayload: DeleteRacePostback = {
    type: 'delete',
    raceId: raceId,
    expiresAt: nowUnix() + 20, // 20秒間有効
  };

  return {
    type: 'flex',
    altText: '💀レースデータを削除しますか？',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: ORIGIN + '/icons/warning.png',
            size: '28px',
            offsetTop: '8px',
          },
          {
            type: 'text',
            text: '以下のレースを削除しますか？',
            color: '#A16207',
            weight: 'bold',
          },
        ],
        backgroundColor: '#FEFCE8',
        spacing: 'md',
        paddingTop: '12px',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '大会名',
                size: '12px',
                flex: 0,
              },
              {
                type: 'text',
                text: race.meet || '-',
                flex: 1,
                size: '16px',
                weight: 'bold',
                color: '#3F3F46',
              },
            ],
            spacing: 'lg',
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '日付　',
                size: '12px',
                flex: 0,
              },
              {
                type: 'text',
                text: race.date,
                flex: 1,
                size: '16px',
                weight: 'bold',
                color: '#3F3F46',
              },
            ],
            spacing: 'lg',
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '選手名',
                size: '12px',
                flex: 0,
              },
              {
                type: 'text',
                text: race.swimmer,
                flex: 1,
                size: '16px',
                weight: 'bold',
                color: '#3F3F46',
              },
            ],
            spacing: 'lg',
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '種目名',
                size: '12px',
                flex: 0,
              },
              {
                type: 'text',
                text: race.event,
                flex: 1,
                size: '16px',
                weight: 'bold',
                color: '#3F3F46',
              },
            ],
            spacing: 'lg',
          },
        ],
        spacing: 'lg',
        paddingAll: 'xxl',
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '削除する',
                color: '#EF4444',
                weight: 'bold',
                align: 'center',
              },
            ],
            cornerRadius: 'md',
            paddingAll: 'lg',
            borderWidth: '2px',
            borderColor: '#EF4444',
            action: {
              type: 'postback',
              label: '-',
              data: JSON.stringify(deleteRaceActionPayload),
              displayText: '[削除]',
            },
          },
          {
            type: 'text',
            text: '削除しない場合はこのまま無視してください',
            color: '#3F3F46',
            size: 'xxs',
            offsetTop: '14px',
            align: 'center',
          },
        ],
        paddingTop: '0px',
        paddingStart: 'xxl',
        paddingEnd: 'xxl',
        paddingBottom: '30px',
      },
    },
  };
}
