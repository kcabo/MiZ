import { mockClient } from 'aws-sdk-client-mock';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

import { generateSheetImage } from 'aws';
import { __local__ } from 'aws/callLambda';
import { Race } from 'types';
import { PaparazzoError } from 'exceptions';

const { toJsonBuffer } = __local__;

const race: Race = {
  date: '2021-11-11',
  swimmer: 'Test',
  event: '100m 自由形',
  cumulativeTime: [2890, 6109],
};

const validPair = {
  input: { Payload: toJsonBuffer({ raceId: '1', ...race }) },
  output: { Payload: toJsonBuffer({ status: 'ok' }) },
};

const emptyPair = {
  input: { Payload: toJsonBuffer({ raceId: 'Empty', ...race }) },
  output: {},
};

const invalidPair = {
  input: { Payload: toJsonBuffer({ raceId: 'Invalid', ...race }) },
  output: { Payload: toJsonBuffer({ hoge: 'ok' }) },
};

const errorPair = {
  input: { Payload: toJsonBuffer({ raceId: 'Error', ...race }) },
  output: undefined,
};

const lambdaMock = mockClient(LambdaClient);
lambdaMock
  .on(InvokeCommand, validPair.input)
  .resolves(validPair.output)
  .on(InvokeCommand, emptyPair.input)
  .resolves(emptyPair.output)
  .on(InvokeCommand, invalidPair.input)
  .resolves(invalidPair.output)
  .on(InvokeCommand, errorPair.input)
  .rejects('mocked rejection');

afterAll(() => jest.restoreAllMocks());

test('Request to Paparazzo', async () => {
  const res = await generateSheetImage('1', race);
  expect(res).toBe(0);
});

test('Receive empty payload', async () => {
  const res = await generateSheetImage('Empty', race);
  expect(res).toStrictEqual(new PaparazzoError('empty payload'));
});

test('Receive unknown payload', async () => {
  const res = await generateSheetImage('Invalid', race);
  expect(res).toStrictEqual(new PaparazzoError('invalid payload'));
});

test('sdk fails', async () => {
  const res = await generateSheetImage('Error', race);
  expect(res).toStrictEqual(new PaparazzoError('request failed'));
});
