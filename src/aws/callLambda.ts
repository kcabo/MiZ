import { InvokeCommand } from '@aws-sdk/client-lambda';

import { lambdaClient } from './lambdaClient';
import { isPaparazzoResponse } from 'typeChecker';
import { Race, PaparazzoResponse } from 'types';
import ErrorLog from 'logger';

const PAPARAZZO_FUNCTION_ARN = process.env.PAPARAZZO_FUNCTION_ARN;

export async function requestGenerateSheet(
  raceId: string,
  race: Race
): Promise<PaparazzoResponse> {
  const request = JSON.stringify({ raceId, ...race });

  const params = {
    FunctionName: PAPARAZZO_FUNCTION_ARN,
    Payload: Buffer.from(request),
  };

  const command = new InvokeCommand(params);
  const response = await lambdaClient.send(command);
  const payload = response.Payload;

  if (!payload) {
    ErrorLog('Paparazzo returned empty payload:', response);
    return { status: 'error' as const };
  }

  const parsedResponse = JSON.parse(Buffer.from(payload).toString());
  if (!isPaparazzoResponse(parsedResponse)) {
    ErrorLog('Paparazzo returned invalid payload:', parsedResponse);
    return { status: 'error' as const };
  }
  return parsedResponse;
}
