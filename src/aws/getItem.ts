import { DbUserItem } from 'types';
import { isDbUserItem } from '../typeChecker';
import { documentClient, RACE_TABLE_NAME } from './dynamodbClient';

type DbGetResult =
  | {
      [key: string]: any;
    }
  | {
      error: true;
    }
  | undefined;

async function getRequest(userId: string, sk: string): Promise<DbGetResult> {
  try {
    const { Item } = await documentClient.get({
      TableName: RACE_TABLE_NAME,
      Key: {
        userId: userId,
        sk: sk,
      },
    });

    return Item;
  } catch (error) {
    console.error(
      `Get Request Failed on userId=${userId} and sk=${sk}:`,
      JSON.stringify(error, null, 2)
    );
    return { error: true };
  }
}

export async function getUser(userId: string): Promise<DbUserItem | undefined> {
  const sk = 'USER#' + userId;
  const item = await getRequest(userId, sk);

  if (!item) {
    console.error('Cannot find user:', userId);
    return undefined;
  } else if (item.error === true) {
    return undefined;
  } else if (!isDbUserItem(item)) {
    console.error('Invalid User item:', JSON.stringify(item, null, 2));
    return undefined;
  }

  return item;
}
