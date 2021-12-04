import { FlexMessage, Message, TextMessage } from '@line/bot-sdk';
import { UserMode } from 'types';

export function tutorial(mode: UserMode): Message[] {
  const isSwimmer = mode === 'swimmer';
  return [
    thankYouText(isSwimmer),
    howToUseCarousel(isSwimmer),
    sampleDataBubble(isSwimmer),
  ];
}

function thankYouText(isSwimmer: boolean): TextMessage {
  return {
    type: 'text',
    text: `[${
      isSwimmer ? '選手' : 'マネージャー'
    }モードに設定しました]\n\nご利用いただきありがとうございます！MiZはレース結果を画像化するサービスです。使い方をご紹介します。`,
  };
}

function howToUseCarousel(isSwimmer: boolean): FlexMessage {
  return {
    type: 'flex',
    altText: 'はじめまして！MiZです',
    contents: {
      type: 'carousel',
      contents: [
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/intro/intro1.png',
            size: 'full',
            aspectRatio: '800:885',
          },
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: `https://miz-assets.s3.ap-northeast-1.amazonaws.com/intro/intro2${
              isSwimmer ? '' : '-manager'
            }.png`,
            size: 'full',
            aspectRatio: '800:885',
          },
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: `https://miz-assets.s3.ap-northeast-1.amazonaws.com/intro/intro3${
              isSwimmer ? '' : '-manager'
            }.png`,
            size: 'full',
            aspectRatio: '800:885',
          },
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/intro/intro4.png',
            size: 'full',
            aspectRatio: '800:885',
          },
        },
      ],
    },
  };
}

function sampleDataBubble(isSwimmer: boolean): FlexMessage {
  return {
    type: 'flex',
    altText: 'サンプルデータ',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'まずはサンプルデータで\nお試しください',
            color: '#18181B',
            size: '20px',
            weight: 'bold',
            align: 'center',
            wrap: true,
          },
        ],
        offsetTop: '10px',
        offsetBottom: '20px',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '200m自由形サンプル',
                align: 'center',
                weight: 'bold',
                color: '#FFFFFF',
              },
            ],
            backgroundColor: '#27272A',
            paddingAll: 'xl',
            action: {
              type: 'message',
              text: [
                'サンプルデータ',
                'にふり',
                '59',
                '2721',
                '5695',
                '12775',
                '15843',
              ]
                .slice(isSwimmer ? 1 : 0)
                .join('\n'),
              label: '200m自由形サンプル',
            },
            cornerRadius: 'md',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '100m平泳ぎ決勝サンプル',
                align: 'center',
                weight: 'bold',
                color: '#FFFFFF',
              },
            ],
            backgroundColor: '#27272A',
            paddingAll: 'xl',
            action: {
              type: 'message',
              text: ['サンプルデータ', 'いちぶれ決勝', '3345', '10987']
                .slice(isSwimmer ? 1 : 0)
                .join('\n'),
              label: '100m平泳ぎ決勝サンプル',
            },
            cornerRadius: 'md',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '400m個人メドレーサンプル',
                align: 'center',
                weight: 'bold',
                color: '#FFFFFF',
              },
            ],
            backgroundColor: '#27272A',
            paddingAll: 'xl',
            action: {
              type: 'message',
              text: [
                'サンプルデータ',
                'よんこめ',
                '65',
                '2918',
                '10284',
                '14079',
                '21767',
                '25611',
                '33504',
                '40831',
                '43916',
              ]
                .slice(isSwimmer ? 1 : 0)
                .join('\n'),
              label: '400m個人メドレーサンプル',
            },
            cornerRadius: 'md',
          },
        ],
        paddingAll: 'xxl',
        spacing: 'xl',
      },
    },
  };
}
