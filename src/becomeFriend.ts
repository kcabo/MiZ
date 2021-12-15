import { BotReply } from 'lineApi';
import { createUser } from 'aws';

export async function becomeFriend(userId: string) {
  const defaultUserName = '[ユーザー名は設定から変更できます]';

  const result = await createUser(userId, defaultUserName);
  if (result instanceof Error) {
    return BotReply.putUserError();
  }
  return BotReply.registration();
}
