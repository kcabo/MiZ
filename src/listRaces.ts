import { Message } from '@line/bot-sdk';

import {
  generateURLforDownload,
  getSheetImageMetadata,
  queryAllRaces,
} from 'aws';
import { BotReply } from 'lineApi';
import { ItemNotFoundFromDB } from 'exceptions';
import { QueryStartPoint, SheetImageBubbleProps } from 'types';

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

  const { sks, LastEvaluatedKey } = result;

  const props = await Promise.all(sks.map(generateProps));

  // 絞り込み、表示の切り替えも実装予定
  return BotReply.sheetImageCarousel(props, LastEvaluatedKey);
}

async function generateProps({
  sk,
}: {
  sk: string;
}): Promise<SheetImageBubbleProps> {
  const raceId = sk;
  const url = await generateURLforDownload(raceId);
  const { width, height } = await getSheetImageMetadata(raceId);

  return {
    raceId,
    url,
    width: parseInt(width),
    height: parseInt(height),
  };
}
