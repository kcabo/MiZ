import { InvokeCommand } from '@aws-sdk/client-lambda';

import { lambdaClient } from './lambdaClient';
import { isPaparazzoResponse } from 'lib/typeGuard';
import { Race, AmbiguousObject } from 'types';
import { ErrorLog } from 'lib/logger';
import { PaparazzoError } from 'exceptions';

const PAPARAZZO_FUNCTION_ARN = process.env.PAPARAZZO_FUNCTION_ARN;

export async function generateSheetImage(raceId: string, race: Race) {
  return await invokeLambda({ raceId, ...race });
}

async function invokeLambda(
  data: AmbiguousObject
): Promise<0 | PaparazzoError> {
  const requestPayload = toJsonBuffer(data);

  const command = new InvokeCommand({
    FunctionName: PAPARAZZO_FUNCTION_ARN,
    Payload: requestPayload,
  });

  try {
    const response = await lambdaClient.send(command);
    const payload = response.Payload;

    if (!payload) {
      ErrorLog('Paparazzo returned empty payload:', response);
      return new PaparazzoError('empty payload');
    }

    const parsed = toObject(payload);

    if (!isPaparazzoResponse(parsed)) {
      ErrorLog('Paparazzo returned invalid payload:', parsed);
      return new PaparazzoError('invalid payload');
    }

    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      ErrorLog('Invoke Paparazzo request failed:', error);
      return new PaparazzoError('request failed');
    } else {
      throw new Error();
    }
  }
}

function toJsonBuffer(payload: AmbiguousObject) {
  const json = JSON.stringify(payload);
  const encoded = Buffer.from(json);
  return encoded;
}

function toObject(payload: Uint8Array) {
  try {
    const decoded = Buffer.from(payload).toString();
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (error) {
    return undefined;
  }
}

// used in tests
export const __local__ = {
  toJsonBuffer,
};
