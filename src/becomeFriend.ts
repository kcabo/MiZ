import { fetchLineName, BotReply } from 'lineApi';
import { createUser, updateUser, checkUserExists } from 'aws';

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
  const userName = await fetchLineName(userId);

  const result = await createUser(userId, userName);
  if (result instanceof Error) {
    return BotReply.putUserError();
  }
  return BotReply.registration();
}
