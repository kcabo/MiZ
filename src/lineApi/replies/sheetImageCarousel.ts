import { FlexBox, FlexBubble, FlexMessage } from '@line/bot-sdk';

import { DownloadSheetPostback, RequestDeleteRacePostback } from 'types';

export function sheetImageCarousel(
  races: { raceId: string; url: string }[]
): FlexMessage {
  const bubbles = races.map(({ raceId, url }) => sheetBubble(raceId, url));
  return {
    type: 'flex',
    altText: 'レース一覧',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

function sheetBubble(raceId: string, url: string): FlexBubble {
  return {
    type: 'bubble',
    body: body(url),
    footer: footer(raceId),
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
  const downloadActionPayload: DownloadSheetPostback = {
    type: 'download',
    raceId: raceId,
  };

  const requestDeleteRaceActionPayload: RequestDeleteRacePostback = {
    type: 'reqDelete',
    raceId: raceId,
  };

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
          data: JSON.stringify(requestDeleteRaceActionPayload),
          displayText: '[削除する]',
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
          data: JSON.stringify(downloadActionPayload),
          displayText: '[ダウンロード]',
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
          displayText: '編集',
        },
        justifyContent: 'center',
      },
    ],
    backgroundColor: '#e9eaec',
    justifyContent: 'space-around',
    paddingTop: 'none',
  };
}
