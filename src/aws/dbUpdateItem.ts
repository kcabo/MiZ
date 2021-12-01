import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';
import { dbErrorLog, ErrorLog } from 'lib/logger';
import {
  UserSettings,
  UserSettingsKeys,
  UserStatus,
  UserStatusKeys,
} from 'types';

type AmbiguousObject = { [key: string]: string | number | boolean };
type UpdatableUserData = Partial<UserSettings | UserStatus>;

export async function updateUser(
  userId: string,
  target: UpdatableUserData
): Promise<0 | Error> {
  const sk = 'USER#' + userId;
  const allowedKeys = [...UserSettingsKeys, ...UserStatusKeys];

  try {
    await dbUpdateRequest(userId, sk, target, allowedKeys, 'isTermAccepted'); // 既存のUserItemなら必ずisTermAcceptedのattributeが存在しているはず
    return 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      dbErrorLog('update', { userId, sk, ...target }, error);
      return error;
    } else {
      throw new Error();
    }
  }
}

async function dbUpdateRequest<T extends AmbiguousObject>(
  userId: string,
  sk: string,
  data: T,
  allowedKeys: string[],
  attributeToCheckExists: string
) {
  const output = await documentClient.update({
    TableName: RACE_TABLE_NAME,
    Key: {
      userId: userId,
      sk: sk,
    },
    ...constructUpdateCommand(data, allowedKeys, attributeToCheckExists),
    ConditionExpression: `attribute_exists(#${attributeToCheckExists})`, // 新規作成防止のための確認。対象データにしか存在しないキーを指定
  });

  return output;
}

type Commands = {
  expressions: `#${string} = :${string}`[];
  names: { [key: `#${string}`]: string };
  values: { [key: `:${string}`]: string | number | boolean };
};

function constructUpdateCommand<T extends AmbiguousObject>(
  updateData: T,
  allowedKeys: (keyof T)[],
  additionalAttributeName?: string
) {
  const { expressions, names, values } = Object.entries(updateData).reduce(
    (accumulator: Commands, [key, item]) => {
      // keysには決められた値のリストのいずれかしか入らない
      if (!allowedKeys.includes(key)) {
        ErrorLog('Not allowed key detected:', updateData);
        throw new Error('Not allowed key detected');
      }

      accumulator.expressions.push(`#${key} = :${key}`);
      accumulator.names[`#${key}`] = key;
      accumulator.values[`:${key}`] = item; // ただしitemには任意の値が入る

      return accumulator;
    },
    { expressions: [], names: {}, values: {} }
  );

  if (additionalAttributeName) {
    names[`#${additionalAttributeName}`] = additionalAttributeName;
  }

  return {
    UpdateExpression: 'set ' + expressions.join(', '),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  };
}

// for test only
export const __local__ = {
  constructUpdateCommand,
};
