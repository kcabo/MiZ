import { FlexMessage } from '@line/bot-sdk';
import { AgreeToTermPostback } from 'types';

export function registration(): FlexMessage {
  const startAsSwimmerPostback: AgreeToTermPostback = {
    type: 'agreeToTerm',
    mode: 'swimmer',
  };
  const startAsManagerPostback: AgreeToTermPostback = {
    type: 'agreeToTerm',
    mode: 'manager',
  };
  return {
    type: 'flex',
    altText: 'はじめまして！MiZです',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
                size: 'lg',
                aspectMode: 'cover',
                action: {
                  type: 'postback',
                  label: '-',
                  data: JSON.stringify(startAsSwimmerPostback),
                  displayText: '[選手として始める]',
                },
              },
              {
                type: 'text',
                text: '選手',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
                size: 'lg',
                aspectMode: 'cover',
                action: {
                  type: 'postback',
                  label: '-',
                  data: JSON.stringify(startAsManagerPostback),
                  displayText: '[マネージャーとして始める]',
                },
              },
              {
                type: 'text',
                text: 'マネージャー',
              },
            ],
          },
        ],
      },
    },
  };
}
