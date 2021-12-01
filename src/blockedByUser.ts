import { ErrorLog } from 'logger';
import { getUser, updateUser } from 'aws';

export async function blockedByUser(userId: string): Promise<void> {
  // ユーザーの存在を一応確認
  const user = await getUser(userId);
  if (!user) {
    ErrorLog('Cannot find user:', userId);
    return;
  }

  // ユーザー情報の書き換え
  const userStatus = { friendship: false };
  await updateUser(userId, userStatus);
  console.warn('Blocked by user:', userId);
}
