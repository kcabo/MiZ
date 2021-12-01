import { updateUser } from 'aws';

export async function blockedByUser(userId: string): Promise<void> {
  // ユーザー情報の書き換え
  await updateUser(userId, { friendship: false });
  console.warn('Blocked by user:', userId);
}
