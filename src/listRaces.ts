import { Message } from '@line/bot-sdk';

import { generateURLforDownload, queryAllRaces } from 'aws';
import { BotReply } from 'lineApi';
import { ItemNotFoundFromDB } from 'exceptions';

export async function listRaces(userId: string): Promise<Message | Message[]> {
  // とりあえずは選手とマネージャーで表示のさせかたは変わらないのでユーザーをFetchしない
  // 場合によっては表示形式はリクエストによってのみ変えることにするかも
  // つまり一覧なら画像形式、一覧表なら表形式、みたいに
  // 全レースのskのみを取得
  const result = await queryAllRaces(userId);
  if (result instanceof ItemNotFoundFromDB) {
    return BotReply.noRaceFound();
  } else if (result instanceof Error) {
    return BotReply.unExpectedError();
  }

  const { raceIds } = result;
  const urls = await Promise.all(
    raceIds.map(async ({ sk }) => ({
      raceId: sk,
      url: await generateURLforDownload(sk),
    }))
  );
  return BotReply.sheetImageCarousel(urls);

  // ページングや絞り込み、表示の切り替えはクイックリプライアクションに設定
  // とりあえずはこれらはなしで
}
