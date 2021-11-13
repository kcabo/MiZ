import { DbPrimaryKeys, DbUserItem } from 'types';
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
  const { mode, isTermAgreed, userName, friendship } = attributes;

  let expression = 'set ';
  expression += `#mode = ${placeholder(mode)}mode, `;
  expression += `#isTermAgreed = ${placeholder(isTermAgreed)}isTermAgreed, `;
  expression += `#userName = ${placeholder(userName)}userName, `;
  expression += `#friendship = ${placeholder(friendship)}friendship`;

  const names = {
    '#mode': 'mode',
    '#isTermAgreed': 'isTermAgreed',
    '#userName': 'userName',
    '#friendship': 'friendship',
  };

  const allValues = {
    ':mode': mode,
    ':isTermAgreed': isTermAgreed,
    ':userName': userName,
    ':friendship': friendship,
  };
  const values = removeUndefined(allValues);

  try {
    const output = await documentClient.update({
      TableName: RACE_TABLE_NAME,
      Key: key,
      UpdateExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    });

    if (output.$metadata.httpStatusCode !== 200) {
      console.error(
        `Update request by ${userId} failed:`,
        JSON.stringify(attributes, null, 2)
      );
      return undefined;
    }

    return output;
  } catch (e) {
    console.error(
      `Invalid update request by ${userId}:`,
      JSON.stringify(attributes, null, 2)
    );
    return undefined;
  }
}

function removeUndefined(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => typeof v !== 'undefined')
  );
}

function placeholder(arg: any): ':' | '#' {
  return typeof arg == 'undefined' ? '#' : ':';
}
