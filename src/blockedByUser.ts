import { deleteAllData, deleteSheetImages } from 'aws';

export async function blockedByUser(userId: string): Promise<void> {
  // ユーザーデータを全て削除する
  const sks = await deleteAllData(userId);
  if (sks instanceof Error) {
    return;
  }

  // USER#hogeとかも含むが問題ない
  const skArray = sks.map(({ sk }) => sk);

  // データベースの削除リクエストでレースデータの所有は確認済みのため、画像削除をしても安全
  const s3Result = await deleteSheetImages(skArray);
  if (s3Result instanceof Error) {
    return;
  }

  console.warn('Blocked by user:', userId);
}
