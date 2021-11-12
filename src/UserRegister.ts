import { getUserDisplayName, BotReply } from 'lineApi';
import { getUser, putNewUser, updateUser } from 'aws';

export async function register(userId: string) {
  // 既にDBに登録しているかどうか確認
  const user = await getUser(userId);
  if (user) {
    const result = await updateUser(userId, { friendship: true });
    if (result.$metadata.httpStatusCode !== 200) {
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
  return BotReply.greetAndShowTerm();
}

export async function agreeToTerms(userId: string) {
  // ユーザーの存在を一応確認
  const user = await getUser(userId);
  if (!user) {
    console.error('Cannot find user:', userId);
    return BotReply.failedToIdentifyUser();
  }

  // すでに同意しているか確認
  if (user.isTermAgreed) {
    return BotReply.alreadyAgreedToTerm();
  }

  // ユーザー情報の書き換え 規約の同意とモードの設定
  const userStatus = {
    mode: 'swimmer' as const,
    isTermAgreed: true,
  };
  const result = await updateUser(userId, userStatus);
  if (result.$metadata.httpStatusCode !== 200) {
    return BotReply.updateUserError();
  }

  return BotReply.tutorial();
}
