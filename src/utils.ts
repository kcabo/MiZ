import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
dayjs.extend(utc);

export function formattedToday() {
  return dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD');
}

export function nowISO() {
  return dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]');
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export function removeUndefinedFromObject(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => typeof v !== 'undefined')
  );
}
