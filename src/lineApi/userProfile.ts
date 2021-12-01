import { ErrorLog } from 'logger';
import { client } from './client';

export async function fetchLineName(userId: string) {
  try {
    const profile = await client.getProfile(userId);
    return profile.displayName;
  } catch (error) {
    ErrorLog('Cannot fetch user profile:', userId);
    return '-';
  }
}
