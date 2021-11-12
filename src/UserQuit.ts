import { getUser, updateUser } from './aws';

export async function blockedByUser(userId: string) {
  // ユーザーの存在を一応確認
  const user = await getUser(userId);
  if (!user) {
    console.error('Cannot find user:', userId);
  }

  // ユーザー情報の書き換え
  const userStatus = {
    friendship: false,
  };
  const result = await updateUser(userId, userStatus);
  if (result.$metadata.httpStatusCode !== 200) {
    console.error(
      'DB request Failed on updating user friendship status:',
      userId
    );
  } else {
    console.warn('Blocked by user:', userId);
  }
}
