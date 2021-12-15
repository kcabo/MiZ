import { FlexBox, FlexBubble, FlexMessage } from '@line/bot-sdk';

import {
  DownloadSheetPostback,
  ListUpRacePostback,
  QueryStartPoint,
  RequestDeleteRacePostback,
  RerenderSheetPostback,
  SheetImageBubbleProps,
} from 'types';

const RACES_LIFF_ID = process.env.RACES_LIFF_ID || '';
const PAGE_SIZE = Number(process.env.RACE_LIST_PAGE_SIZE) || 10;
const ORIGIN = process.env.PUBLIC_ASSETS_ORIGIN;

export function sheetImageCarousel(
  bubblePropsArray: SheetImageBubbleProps[],
  queryStartPoint: QueryStartPoint | undefined
): FlexMessage {
  const listUpActionPayload: ListUpRacePostback = {
    type: 'list',
    start: queryStartPoint || {},
  };

  const bubbles = bubblePropsArray.map(sheetBubble);

  return {
    type: 'flex',
    altText: '📚レース一覧',
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
                imageUrl: ORIGIN + '/icons/right.png',
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

function sheetBubble(props: SheetImageBubbleProps): FlexBubble {
  const aspectRatio = generateAspectRatio(props);

  return {
    type: 'bubble',
    body: body(props.url, aspectRatio),
    footer: footer(props.raceId),
    styles: {
      body: {
        backgroundColor: '#E9EAEC',
      },
      footer: {
        backgroundColor: '#E9EAEC',
      },
    },
  };
}

function generateAspectRatio({
  width,
  height,
}: SheetImageBubbleProps): `${number}:${number}` | undefined {
  const norNan = !!(width && height);
  const validRatio = !!(height / width < 3);
  if (norNan && validRatio) {
    return `${width}:${height}`;
  } else {
    return undefined;
  }
}

function body(
  url: string,
  aspectRatio: `${number}:${number}` = '750:1000'
): FlexBox {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'image',
        url: url,
        aspectRatio: aspectRatio,
        size: 'full',
      },
    ],
    paddingAll: '0px',
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

  const rerenderActionPayload: RerenderSheetPostback = {
    type: 'rerender',
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
            url: ORIGIN + '/icons/download.png',
            size: '24px',
          },
        ],
        backgroundColor: '#3399FF',
        cornerRadius: 'md',
        paddingStart: '16px',
        paddingEnd: '16px',
        paddingTop: '6px',
        flex: 0,
        height: '36px',
        action: {
          type: 'postback',
          label: '保存',
          data: JSON.stringify(downloadActionPayload),
          displayText: '[保存]',
        },
      },
      {
        type: 'filler',
        flex: 0,
      },
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: ORIGIN + '/icons/edit-dark.png',
            size: '24px',
          },
        ],
        backgroundColor: '#FFFFFF',
        cornerRadius: 'md',
        flex: 0,
        paddingTop: '6px',
        paddingStart: '14px',
        paddingEnd: '14px',
        action: {
          type: 'uri',
          label: '編集',
          uri: editRaceLiffUrl,
        },
      },
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: ORIGIN + '/icons/refresh-dark.png',
            size: '24px',
          },
        ],
        backgroundColor: '#FFFFFF',
        cornerRadius: 'md',
        flex: 0,
        paddingTop: '6px',
        paddingStart: '14px',
        paddingEnd: '14px',
        action: {
          type: 'postback',
          label: '更新',
          data: JSON.stringify(rerenderActionPayload),
          displayText: '[更新]',
        },
      },
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'icon',
            url: ORIGIN + '/icons/delete-dark.png',
            size: '24px',
          },
        ],
        backgroundColor: '#FFFFFF',
        cornerRadius: 'md',
        flex: 0,
        paddingTop: '6px',
        paddingStart: '14px',
        paddingEnd: '14px',
        action: {
          type: 'postback',
          label: '削除',
          data: JSON.stringify(requestDeleteRaceActionPayload),
          displayText: '[削除する]',
        },
      },
    ],
    paddingTop: '0px',
    paddingAll: '20px',
    justifyContent: 'space-between',
    paddingBottom: '14px',
  };
}
