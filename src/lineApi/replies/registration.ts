import {
  FlexMessage,
  ImageMapMessage,
  Message,
  TextMessage,
} from '@line/bot-sdk';
import { AcceptTermPostback } from 'types';

const ORIGIN = process.env.PUBLIC_ASSETS_ORIGIN;
const TERM_URL = process.env.TERM_URL;

export function registration(): Message[] {
  return [helloText(), adImageMap(), selectMode()];
}

export function pleaseAcceptTerm(): Message[] {
  return [youCannotUseText(), selectMode()];
}

function helloText(): TextMessage {
  return {
    type: 'text',
    text: 'はじめまして！MiZです。友達登録ありがとうございます😊',
  };
}

function youCannotUseText(): TextMessage {
  return {
    type: 'text',
    text: '利用規約とプライバシーポリシーに同意してからご利用いただけます。',
  };
}

function adImageMap(): ImageMapMessage {
  return {
    type: 'imagemap',
    baseUrl: ORIGIN + '/ads',
    altText: 'あなたのレースを、デジタルに',
    baseSize: {
      width: 1040,
      height: 780,
    },
    actions: [],
  };
}

function selectMode(): FlexMessage {
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
    altText: 'モードを選択',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'モードを選択',
            color: '#FFFFFF',
            size: '24px',
            weight: 'bold',
          },
          {
            type: 'text',
            text: '利用規約をよくお読みいただき、ご同意の上でどちらかをお選びください。モードはメニューの「設定」からいつでも変更できます。',
            color: '#FFFFFF',
            size: '14px',
            wrap: true,
            weight: 'bold',
          },
        ],
        backgroundColor: '#3399FF',
        spacing: 'lg',
        paddingTop: '30px',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: ORIGIN + '/swimmer.png',
                    aspectRatio: '100:94',
                    size: '50px',
                  },
                ],
                justifyContent: 'center',
                width: '110px',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: 'おすすめ',
                        size: '12px',
                        color: '#FFFFFF',
                        weight: 'bold',
                        align: 'center',
                      },
                    ],
                    backgroundColor: '#EF4444',
                    width: '70px',
                    cornerRadius: 'xl',
                    paddingAll: 'xs',
                  },
                  {
                    type: 'text',
                    text: '-',
                    contents: [
                      {
                        type: 'span',
                        text: '選手',
                        size: '24px',
                        color: '#3399FF',
                        weight: 'bold',
                      },
                      {
                        type: 'span',
                        text: 'モード',
                        size: '20px',
                        weight: 'bold',
                      },
                    ],
                  },
                  {
                    type: 'text',
                    text: '自分のレースだけを\n記録する方向け',
                    wrap: true,
                    color: '#71717A',
                    size: '12px',
                    weight: 'bold',
                  },
                ],
                spacing: 'md',
              },
            ],
            borderWidth: '2px',
            borderColor: '#3399FF',
            cornerRadius: 'xl',
            paddingTop: '16px',
            paddingBottom: '16px',
            height: '135px',
            action: {
              type: 'postback',
              label: '-',
              data: JSON.stringify(startAsSwimmerPostback),
              displayText: '[選手として始める]',
            },
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: ORIGIN + '/watch.png',
                    aspectRatio: '100:94',
                    size: '52px',
                  },
                ],
                justifyContent: 'center',
                width: '110px',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '-',
                    contents: [
                      {
                        type: 'span',
                        text: 'マネージャー\n',
                        size: '23px',
                        color: '#3399FF',
                        weight: 'bold',
                      },
                      {
                        type: 'span',
                        text: 'モード',
                        size: '18px',
                        weight: 'bold',
                      },
                    ],
                    wrap: true,
                  },
                  {
                    type: 'text',
                    text: '複数人のレースを\n記録する方向け',
                    wrap: true,
                    color: '#71717A',
                    size: '12px',
                    weight: 'bold',
                  },
                ],
                spacing: 'md',
                paddingTop: '6px',
              },
            ],
            borderWidth: '2px',
            borderColor: '#71717A44',
            cornerRadius: 'xl',
            paddingTop: '16px',
            paddingBottom: '16px',
            height: '135px',
            action: {
              type: 'postback',
              label: '-',
              data: JSON.stringify(startAsManagerPostback),
              displayText: '[マネージャーとして始める]',
            },
          },
        ],
        spacing: 'xl',
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'サービスを利用することで、利用規約とプライバシーポリシーに同意したとみなします。',
            wrap: true,
            color: '#71717A',
            size: '12px',
            weight: 'bold',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '利用規約・プライバシーポリシー',
                color: '#71717A',
                weight: 'bold',
                align: 'center',
                size: '12px',
              },
            ],
            borderColor: '#71717A',
            borderWidth: '1px',
            cornerRadius: 'none',
            paddingTop: '10px',
            paddingBottom: '10px',
            action: {
              type: 'uri',
              label: 'action',
              uri: TERM_URL,
            },
          },
        ],
        paddingAll: 'xxl',
        spacing: 'lg',
        paddingTop: 'md',
      },
    },
  };
}
