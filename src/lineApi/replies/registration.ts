import { FlexMessage } from '@line/bot-sdk';
import { AcceptTermPostback } from 'types';

export function registration(): FlexMessage {
  const startAsSwimmerPostback: AcceptTermPostback = {
    type: 'acceptTerm',
    mode: 'swimmer',
  };
  const startAsManagerPostback: AcceptTermPostback = {
    type: 'acceptTerm',
    mode: 'manager',
  };
  return {
    type: 'flex',
    altText: 'はじめまして！MiZです',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'モードを選ぶ',
            weight: 'bold',
            color: '#FFFFFF',
            size: '24px',
          },
          {
            type: 'text',
            text: 'どちらかを選択してください\n ※ モードはいつでも変更できます',
            wrap: true,
            weight: 'bold',
            color: '#FFFFFF',
            size: 'xs',
          },
        ],
        backgroundColor: '#3399FF',
        spacing: 'md',
        paddingAll: 'xxl',
        paddingTop: '40px',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'image',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/start_as_swimmer.png',
            size: 'full',
            aspectRatio: '400:104',
            action: {
              type: 'postback',
              label: '-',
              data: JSON.stringify(startAsSwimmerPostback),
              displayText: '[選手として始める]',
            },
          },
          {
            type: 'image',
            url: 'https://miz-assets.s3.ap-northeast-1.amazonaws.com/start_as_manager.png',
            size: 'full',
            aspectRatio: '400:104',
            action: {
              type: 'postback',
              label: '-',
              data: JSON.stringify(startAsManagerPostback),
              displayText: '[マネージャーとして始める]',
            },
          },
        ],
        spacing: 'lg',
        paddingAll: 'xl',
        paddingBottom: '0px',
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'サービスを利用することで、利用規約とプライバシーポリシーに同意したとみなします。',
            color: '#3F3F46',
            size: 'xs',
            offsetTop: '14px',
            wrap: true,
            weight: 'bold',
          },
        ],
        paddingTop: 'none',
        paddingBottom: '30px',
        paddingStart: '20px',
        paddingEnd: '20px',
      },
    },
  };
}
