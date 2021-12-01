import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { validateAndParseRequest } from 'lineApi/validation';

const multipleMessageEvent = {
  destination: 'U',
  events: [
    {
      type: 'message',
      message: {
        type: 'text',
        id: '9999',
        text: 'Hello, world',
      },
      timestamp: 9999,
      source: { type: 'user', userId: 'U' },
      replyToken: 'token',
      mode: 'active',
    },
    {
      type: 'message',
      message: {
        type: 'sticker',
        id: '1',
        stickerId: '2',
        packageId: '3',
        stickerResourceType: 'STATIC',
      },
      timestamp: 9999,
      source: { type: 'user', userId: 'U' },
      replyToken: 'token',
      mode: 'active',
    },
  ],
};
const multipleMessageEventSignature =
  '17Wbb5GtGacoiTKk4bR42zs+Aj1ysmHQRERENpTbfhE=';

const emptyEvent = {
  destination: 'U',
  events: [],
};
const emptyEventSignature = 'DdDe1oX6Q2qhhPO09SCqcPEc5mNOwb2pbxGJmai/OtY=';

const mockErrorConsole = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

beforeAll(() => {
  process.env.LINE_CHANNEL_SECRET = 'mock31kkoz5znfu6b4rfsuloce4q2xbz';
});

afterEach(() => {
  mockErrorConsole.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('valid multiple message request', () => {
  const request: any = {
    headers: {
      'x-line-signature': multipleMessageEventSignature,
    },
    body: JSON.stringify(multipleMessageEvent),
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: true,
    lineEvents: multipleMessageEvent.events,
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(0);
});

test('valid empty event request', () => {
  const request: any = {
    headers: {
      'x-line-signature': emptyEventSignature,
    },
    body: JSON.stringify(emptyEvent),
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: true,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(0);
});

test('wrong signature', () => {
  const request: any = {
    headers: {
      'x-line-signature': 'InVaLiD=',
    },
    body: JSON.stringify(multipleMessageEvent),
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: false,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Failed to validate');
});

test('no signature', () => {
  const request: any = {
    headers: {
      'user-agent': 'LineBotWebhook/2.0',
    },
    body: JSON.stringify(multipleMessageEvent),
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: false,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Failed to validate');
});

test('no header', () => {
  const request: any = {
    body: JSON.stringify(multipleMessageEvent),
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: false,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Failed to validate');
});

test('empty body', () => {
  const request: any = {};
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: false,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain('Request body was empty');
});

test('cannot parse body', () => {
  const request: any = {
    headers: {
      'x-line-signature': 'HbOoI+o3jOJ8ZesytzcTQoM08+4QTVxMpOT9Q+tN9BY=',
    },
    body: '{a}',
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: false,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain(
    'Could not parse the request body'
  );
});

test('cannot parse to WebhookRequestBody', () => {
  const request: any = {
    headers: {
      'x-line-signature': 'G7hPiUcrtkG0oETB/waW3TwHcVtVa9zFFT4yJfdrhKI=',
    },
    body: '{"destination":"U","events":"hello"}',
  };
  expect(
    validateAndParseRequest(request as APIGatewayProxyEventV2)
  ).toStrictEqual({
    valid: false,
    lineEvents: [],
  });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain(
    'Received unknown style of webhook request'
  );
});
