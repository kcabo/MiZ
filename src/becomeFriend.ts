import { getUserDisplayName, BotReply } from 'lineApi';
import { createUser, updateUser, checkUserExists } from 'aws';
import { ErrorLog } from 'logger';
import { UserMode } from 'types';

export async function becomeFriend(userId: string) {
  // 既にDBに登録しているかどうか確認
  const user = await checkUserExists(userId);

  // 登録済みならブロック解除として扱う
  if (user) {
    const result = await updateUser(userId, { friendship: true });
    if (!result) {
      return BotReply.updateUserError();
    }
    return BotReply.returnFromBlock();
  }

  // 見つからなければ新規ユーザーの友達登録として扱う
  const userName = await getUserDisplayName(userId);
  const result = await createUser(userId, userName);
  if (result instanceof Error) {
    return BotReply.putUserError();
  }
  return BotReply.registration();
}

export async function userAcceptedTerms(userId: string, mode: UserMode) {
  // ユーザーの存在を一応確認
  const user = await checkUserExists(userId);

  if (!user) {
    ErrorLog('Cannot find user:', userId);
    return BotReply.failedToIdentifyUser();
  }

  // ユーザー情報の書き換え 規約の同意とモードの設定
  const userStatus = { mode, isTermAccepted: true };
  const result = await updateUser(userId, userStatus);
  if (!result) {
    return BotReply.updateUserError();
  }

  return BotReply.tutorial();
}
