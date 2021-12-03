import { Message } from '@line/bot-sdk';

import { generateURLforDownload, queryAllRaces } from 'aws';
import { BotReply } from 'lineApi';
import { ItemNotFoundFromDB } from 'exceptions';
import { QueryStartPoint } from 'types';

export async function listRaces(
  userId: string,
  queryStartPoint?: QueryStartPoint
): Promise<Message | Message[]> {
  // とりあえずは選手とマネージャーで表示のさせかたは変わらないのでユーザーをFetchしない
  // 場合によっては表示形式はリクエストによってのみ変えることにするかも
  // つまり一覧なら画像形式、一覧表なら表形式、みたいに
  // 全レースのskのみを取得
  const result = await queryAllRaces(userId, queryStartPoint);

  if (result instanceof ItemNotFoundFromDB) {
    return BotReply.noRaceFound();
  } else if (result instanceof Error) {
    return BotReply.dbRequestFailed();
  }

  const { raceIds, LastEvaluatedKey } = result;

  const urlAndSkArray = await Promise.all(
    raceIds.map(async ({ sk }) => ({
      raceId: sk,
      url: await generateURLforDownload(sk),
    }))
  );

  // 絞り込み、表示の切り替えも実装予定
  return BotReply.sheetImageCarousel(urlAndSkArray, LastEvaluatedKey);
}
