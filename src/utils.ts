import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
dayjs.extend(utc);

export function formattedToday() {
  return dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD');
}
