import { Message } from '@line/bot-sdk';

import { fetchUser } from 'aws';
import { BotReply } from 'lineApi';
import { ItemNotFoundFromDB } from 'exceptions';

export async function lecture(userId: string): Promise<Message | Message[]> {
  const user = await fetchUser(userId);

  if (user instanceof ItemNotFoundFromDB) {
    return BotReply.failedToIdentifyUser();
  } else if (user instanceof Error) {
    return BotReply.dbRequestFailed();
  }

  if (!user.isTermAccepted) {
    return BotReply.pleaseAcceptTerm();
  }

  const isSwimmer = user.mode === 'swimmer';

  return BotReply.howToUseCarousel(isSwimmer);
}
