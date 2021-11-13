import { FlexBox, FlexBubble, FlexMessage } from '@line/bot-sdk';

import { RaceSheetBubble } from 'types';

export function listRaceFlex(races: RaceSheetBubble[]): FlexMessage {
  const bubbles = races.map((race) => sheetBubble(race));
  return {
    type: 'flex',
    altText: 'レース一覧',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

function sheetBubble(race: RaceSheetBubble): FlexBubble {
  return {
    type: 'bubble',
    body: body(race.url),
    footer: footer(race.raceId),
  };
}

function body(url: string): FlexBox {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'image',
        url: url,
        aspectRatio: '750:1094',
        size: 'full',
      },
    ],
    paddingAll: 'none',
    backgroundColor: '#e9eaec',
  };
}

function footer(raceId: string): FlexBox {
  return {
    type: 'box',
    layout: 'horizontal',
    contents: [
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/delete.png',
            size: 'xxl',
          },
        ],
        width: '50px',
        action: {
          type: 'postback',
          label: '-',
          data: '{"sk": "21899111", "type":"delete"}',
          displayText: '削除',
        },
        justifyContent: 'center',
      },
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/download.png',
            size: '32px',
          },
        ],
        width: '50px',
        action: {
          type: 'postback',
          label: '-',
          data: '{"sk": "21899111", "type":"delete"}',
          displayText: '削除',
        },
        justifyContent: 'center',
      },
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/edit.png',
            size: 'xxl',
          },
        ],
        width: '50px',
        action: {
          type: 'postback',
          label: '-',
          data: '{"sk": "21899111", "type":"delete"}',
          displayText: '削除',
        },
        justifyContent: 'center',
      },
    ],
    backgroundColor: '#e9eaec',
    justifyContent: 'space-around',
    paddingTop: 'none',
  };
}
