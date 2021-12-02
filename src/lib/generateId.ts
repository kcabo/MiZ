import { customAlphabet } from 'nanoid';

// Speed: 1000 IDs per hour
// ~919 years needed, in order to have a 1% probability of at least one collision.
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12
);

export { nanoid as generateId };
