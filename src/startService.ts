import { BotReply } from 'lineApi';
import { updateUser, checkUserExists } from 'aws';
import { ErrorLog } from 'lib/logger';
import { UserMode } from 'types';

export async function startService(userId: string, mode: UserMode) {
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
