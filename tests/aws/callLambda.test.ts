import { Race } from '../../src/types';
import { requestGenerateSheet } from '../../src/aws';
import { lambdaClient } from '../../src/aws/lambdaClient';

const race: Race = {
  date: '2021-11-11',
  swimmer: 'Test',
  event: '100m 自由形',
  cumulativeTime: [2890, 6109],
};

const validInvokeOutput = {
  Payload: Buffer.from(JSON.stringify({ status: 'ok' })),
} as any;

const emptyInvokeOutput = {
  Payload: undefined,
} as any;

const unknownInvokeOutput = {
  Payload: Buffer.from(JSON.stringify({ status: 'Hello' })),
} as any;

const mockErrorConsole = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

afterEach(() => {
  mockErrorConsole.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Request to Paparazzo', async () => {
  lambdaClient.send = jest.fn(() => validInvokeOutput);
  expect.assertions(1);
  const res = await requestGenerateSheet('1', race);
  expect(res).toStrictEqual({ status: 'ok' });
});

test('Receive empty payload', async () => {
  lambdaClient.send = jest.fn(() => emptyInvokeOutput);
  expect.assertions(3);
  const res = await requestGenerateSheet('1', race);
  expect(res).toStrictEqual({ status: 'error' });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain(
    'Paparazzo returned empty payload'
  );
});

test('Receive unknown payload', async () => {
  lambdaClient.send = jest.fn(() => unknownInvokeOutput);
  expect.assertions(3);
  const res = await requestGenerateSheet('1', race);
  expect(res).toStrictEqual({ status: 'error' });
  expect(mockErrorConsole).toHaveBeenCalledTimes(1);
  expect(mockErrorConsole.mock.calls[0][0]).toContain(
    'Paparazzo returned invalid payload:'
  );
});
