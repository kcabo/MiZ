import { getUserDisplayName } from 'lineApi/userProfile';
import { getUser, putNewUser, updateUser } from './aws';
import {
  greetAndShowTerm,
  putUserError,
  returnFromBlock,
  failedToIdentifyUser,
  alreadyAgreedToTerm,
  updateUserError,
  tutorial,
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
  // ユーザーの存在を一応確認
  const user = await getUser(userId);
  if (!user) {
    console.error('Cannot find user:', userId);
    return failedToIdentifyUser();
  }

  // すでに同意しているか確認
  if (user.isTermAgreed) {
    return alreadyAgreedToTerm();
  }

  // ユーザー情報の書き換え 規約の同意とモードの設定
  const userStatus = {
    mode: 'swimmer' as const,
    isTermAgreed: true,
  };
  const result = await updateUser(userId, userStatus);
  if (result.$metadata.httpStatusCode !== 200) {
    return updateUserError();
  }

  return tutorial();
}
