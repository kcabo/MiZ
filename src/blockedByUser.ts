import { updateUser } from 'aws';

export async function blockedByUser(userId: string): Promise<void> {
  // ユーザー情報の書き換え
  const userStatus = { friendship: false };
  await updateUser(userId, userStatus);
  console.warn('Blocked by user:', userId);
}
