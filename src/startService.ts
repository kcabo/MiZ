import { BotReply } from 'lineApi';
import { updateUser, checkUserExists, putMeetCache } from 'aws';
import { ErrorLog } from 'lib/logger';
import { Meet, UserMode } from 'types';

export async function startService(userId: string, mode: UserMode) {
  // ユーザーの存在を一応確認
  const user = await checkUserExists(userId);

  if (!user) {
    ErrorLog('Cannot find user:', userId);
    return BotReply.failedToIdentifyUser();
  }

  // ユーザー情報の書き換え 規約の同意とモードの設定
  const userStatus = { mode, isTermAccepted: true };
  const updateResult = await updateUser(userId, userStatus);
  if (updateResult instanceof Error) {
    return BotReply.updateUserError();
  }

  // 大会名も入力できることを明示するため、初期状態で大会名が入力されるようにする
  const initialMeet: Meet = {
    meet: '日本サンプル大会長水路',
    place: '東京サンプルプール',
    courseLength: '長水路',
  };

  const putResult = await putMeetCache(userId, initialMeet);
  if (putResult instanceof Error) {
    return BotReply.dbRequestFailed();
  }

  return BotReply.tutorial(mode);
}
