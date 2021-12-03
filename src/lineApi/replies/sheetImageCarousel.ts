import { FlexBox, FlexBubble, FlexMessage } from '@line/bot-sdk';

import {
  DownloadSheetPostback,
  ListUpRacePostback,
  QueryStartPoint,
  RequestDeleteRacePostback,
} from 'types';

const RACES_LIFF_ID = process.env.RACES_LIFF_ID || '';
const PAGE_SIZE = Number(process.env.RACE_LIST_PAGE_SIZE) || 10;

export function sheetImageCarousel(
  races: { raceId: string; url: string }[],
  queryStartPoint: QueryStartPoint | undefined
): FlexMessage {
  const listUpActionPayload: ListUpRacePostback = {
    type: 'list',
    start: queryStartPoint || {},
  };

  const bubbles = races.map(({ raceId, url }) => sheetBubble(raceId, url));

  return {
    type: 'flex',
    altText: 'レース一覧',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
    ...(!queryStartPoint
      ? {}
      : {
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl:
                  'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/delete.png',
                action: {
                  type: 'postback',
                  label: `次の${PAGE_SIZE}件`,
                  data: JSON.stringify(listUpActionPayload),
                },
              },
            ],
          },
        }),
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

  const editRaceLiffUrl = `https://liff.line.me/${RACES_LIFF_ID}/${raceId}`;

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
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/icons/edit.png',
            size: 'xxl',
          },
        ],
        width: '50px',
        action: {
          type: 'uri',
          label: '編集',
          uri: editRaceLiffUrl,
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
          label: '保存',
          data: JSON.stringify(downloadActionPayload),
          displayText: '[保存]',
        },
        justifyContent: 'center',
      },

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
          label: '削除',
          data: JSON.stringify(requestDeleteRaceActionPayload),
          displayText: '[削除する]',
        },
        justifyContent: 'center',
      },
    ],
    backgroundColor: '#e9eaec',
    justifyContent: 'space-around',
    paddingTop: 'none',
  };
}
