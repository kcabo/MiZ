import { Message } from '@line/bot-sdk';
import { generateURLforDownload, checkRaceExists } from 'aws';
import { BotReply } from 'lineApi';

export async function showSheet(
  userId: string,
  raceId: string
): Promise<Message | Message[]> {
  // 他人のraceIdになりすましている可能性があるため、ユーザーが当該raceIdのデータを保持していることを確認
  const isUserOwnsRace = await checkRaceExists(userId, raceId);

  if (!isUserOwnsRace) {
    return BotReply.noRaceFound();
  }

  const url = await generateURLforDownload(raceId);
  return BotReply.sheetImage(raceId, url, { imageOnly: true }); // 画像だけを単体で送信する
}
