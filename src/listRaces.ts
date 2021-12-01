import { Message } from '@line/bot-sdk';

import { generateURLforDownload, queryAllRaces } from 'aws';
import { BotReply } from 'lineApi';
import { ErrorLog } from 'logger';
import { isSkOnlyArray } from 'typeGuard';
import { RaceSheetBubble } from 'types';

export async function listRaces(userId: string): Promise<Message | Message[]> {
  // とりあえずは選手とマネージャーで表示のさせかたは変わらないのでユーザーをFetchしない
  // 場合によっては表示形式はリクエストによってのみ変えることにするかも
  // つまり一覧なら画像形式、一覧表なら表形式、みたいに
  // 全レースのskのみを取得
  const result = await queryAllRaces(userId, 20);
  if (!result) {
    return BotReply.fetchRacesError();
  }

  const items = result.Items;
  if (!items || items.length === 0) {
    return BotReply.noRaceFound();
  }

  if (!isSkOnlyArray(items)) {
    ErrorLog('Invalid queried race items:', items);
    return BotReply.unExpectedError();
  }

  const raceListData = await Promise.all(items.map(constructDataForBubble));
  return BotReply.listRaceFlex(raceListData);

  // ページングや絞り込み、表示の切り替えはクイックリプライアクションに設定
  // とりあえずはこれらはなしで
}

async function constructDataForBubble(item: {
  sk: string;
}): Promise<RaceSheetBubble> {
  const raceId = item.sk;
  const objectKey = raceId + '.png';
  const url = await generateURLforDownload(objectKey);
  return { url, raceId };
}
