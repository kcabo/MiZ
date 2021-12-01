import { ErrorLog } from 'logger';
import { DbPrimaryKeys, DbUserItem } from 'types';
import { removeUndefinedFromObject } from 'utils';
import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

type UpdateUserAttributes = Partial<
  Omit<DbUserItem, keyof DbPrimaryKeys | 'createdAt'>
>;

export async function updateUser(
  userId: string,
  attributes: UpdateUserAttributes
) {
  const key: DbPrimaryKeys = {
    userId: userId,
    sk: 'USER#' + userId,
  };

  // インジェクションが怖いのであえて冗長気味に書いてる
  const names = {
    '#mode': 'mode',
    '#isTermAccepted': 'isTermAccepted',
    '#userName': 'userName',
    '#friendship': 'friendship',
  };

  const expression = constructUpdateExpression(attributes);
  const values = constructUpdateAttributeValues(attributes);

  try {
    const output = await documentClient.update({
      TableName: RACE_TABLE_NAME,
      Key: key,
      UpdateExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    });

    if (output.$metadata.httpStatusCode !== 200) {
      ErrorLog(`Failed to update user status on ${userId}:`, attributes);
      ErrorLog('db output:', output);
      return undefined;
    }

    return output;
  } catch (e) {
    ErrorLog(`Invalid update request by ${userId}:`, attributes);
    ErrorLog('Raised Error:', e);
    return undefined;
  }
}

export function constructUpdateExpression({
  mode,
  isTermAccepted,
  userName,
  friendship,
}: UpdateUserAttributes): string {
  const statements = [
    `#mode = ${placeholder(mode)}mode`,
    `#isTermAccepted = ${placeholder(isTermAccepted)}isTermAccepted`,
    `#userName = ${placeholder(userName)}userName`,
    `#friendship = ${placeholder(friendship)}friendship`,
  ].join(', ');
  return 'set ' + statements;
}

export function constructUpdateAttributeValues({
  mode,
  isTermAccepted,
  userName,
  friendship,
}: UpdateUserAttributes) {
  const allValues = {
    ':mode': mode,
    ':isTermAccepted': isTermAccepted,
    ':userName': userName,
    ':friendship': friendship,
  };
  const values = removeUndefinedFromObject(allValues);
  return values;
}

function placeholder(arg: any): ':' | '#' {
  return typeof arg == 'undefined' ? '#' : ':';
}
