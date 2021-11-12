import { client } from './client';

export async function getUserDisplayName(userId: string) {
  try {
    const profile = await client.getProfile(userId);
    return profile.displayName;
  } catch (error) {
    console.error('Cannot fetch user profile. userId =', userId);
    return '-';
  }
}
