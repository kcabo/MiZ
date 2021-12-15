import axios from 'axios';
import url from 'url';

import { ErrorLog } from 'lib/logger';

const LINE_NOTIFY_ACCESS_TOKEN = process.env.LINE_NOTIFY_ACCESS_TOKEN;

export function notifyLine(type: 'follow' | 'block' | 'text', payload: string) {
  _notifyLine(`[${type}] ${payload}`);
}

async function _notifyLine(message: string) {
  const params = new url.URLSearchParams({ message });

  try {
    const res = await axios.post(
      'https://notify-api.line.me/api/notify',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + LINE_NOTIFY_ACCESS_TOKEN,
        },
      }
    );

    return res.data;
  } catch (e) {
    ErrorLog('Failed to notify on LINE:', e);
  }
}
