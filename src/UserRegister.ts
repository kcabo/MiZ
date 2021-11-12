import { getUserDisplayName } from 'lineApi/userProfile';
import { getUser, putNewUser } from './aws';
import {
  greetAndShowTerm,
  putUserError,
  returnFromBlock,
} from './lineApi/replies';

export async function register(userId: string) {
  // 既にDBに登録しているかどうか確認
  const user = await getUser(userId);
  if (user) {
    return returnFromBlock();
  }

  // デフォルト値で登録
  const userName = await getUserDisplayName(userId);
  const putDataResult = await putNewUser(userId, userName);
  if (putDataResult.$metadata.httpStatusCode !== 200) {
    return putUserError();
  }

  // 規約に同意して始めるボタンを返す
  return greetAndShowTerm();
}

export async function agreeToTerms(userId: string) {
  // すでに同意しているか？
  // していたら二重で押しただけ、すでに同意していますよ
  // してなかったら同意→サンプルボタンを返す
}
