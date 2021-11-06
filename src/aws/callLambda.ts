import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { RaceData } from 'types';

const PAPARAZZO_FUNCTION_ARN = process.env.PAPARAZZO_FUNCTION_ARN;
const lambda = new LambdaClient({ region: 'ap-northeast-1' });

type Response = {
  status: 'ok' | 'error';
};

export async function requestGenerateSheet(
  raceData: RaceData
): Promise<Response> {
  const params = {
    FunctionName: PAPARAZZO_FUNCTION_ARN,
    Payload: Buffer.from(JSON.stringify(raceData)),
  };
  const command = new InvokeCommand(params);
  const response = await lambda.send(command);
  const payload = response.Payload;

  if (!payload) {
    console.error('Paparazzo returned empty payload');
    return { status: 'error' as const };
  }

  const parsedResponse = JSON.parse(
    Buffer.from(payload).toString()
  ) as Response;
  return parsedResponse;
}
