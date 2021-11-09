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
