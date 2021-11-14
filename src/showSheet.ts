import { Message } from '@line/bot-sdk';
import { generateURLforDownload, checkRaceExists } from 'aws';
import { BotReply } from 'lineApi';

export async function showSheet(
  userId: string,
  raceId: string
): Promise<Message | Message[]> {
  // 念の為対象ユーザーが当該raceIdのデータを保持していることを確認
  // 万が一FlexMessageがクライアント側で書き換えられた場合、意図せず他人のデータを渡してしまう可能性があるため
  if (!checkRaceExists(userId, raceId)) {
    return BotReply.cannotGetRace();
  }

  return await sheetImageMessage(raceId);
}

export async function sheetImageMessage(
  raceId: string
): Promise<Message | Message[]> {
  const sheetObjectKey = raceId + '.png';
  const url = await generateURLforDownload(sheetObjectKey);
  return BotReply.sendSheetImage(url);
}
