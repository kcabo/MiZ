import { getUserDisplayName, BotReply } from 'lineApi';
import { getUser, putNewUser, updateUser } from 'aws';
import { ErrorLog } from 'logger';
import { UserMode } from 'types';

export async function userRegister(userId: string) {
  // 既にDBに登録しているかどうか確認
  const user = await getUser(userId);
  if (user) {
    const result = await updateUser(userId, { friendship: true });
    if (!result) {
      return BotReply.updateUserError();
    }
    return BotReply.returnFromBlock();
  }

  // デフォルト値で登録
  const userName = await getUserDisplayName(userId);
  const putDataResult = await putNewUser(userId, userName);
  if (putDataResult.$metadata.httpStatusCode !== 200) {
    return BotReply.putUserError();
  }

  // 規約に同意して始めるボタンを返す
  return BotReply.registration();
}

export async function userAcceptedTerms(userId: string, mode: UserMode) {
  // ユーザーの存在を一応確認
  const user = await getUser(userId);
  if (!user) {
    ErrorLog('Cannot find user:', userId);
    return BotReply.failedToIdentifyUser();
  }

  // すでに同意しているか確認
  if (user.isTermAccepted) {
    return BotReply.termsAlreadyAccepted();
  }

  // ユーザー情報の書き換え 規約の同意とモードの設定
  const userStatus = {
    mode: mode,
    isTermAccepted: true,
  };
  const result = await updateUser(userId, userStatus);
  if (!result) {
    return BotReply.updateUserError();
  }

  return BotReply.tutorial();
}
