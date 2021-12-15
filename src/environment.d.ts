declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      LINE_CHANNEL_ACCESS_TOKEN: string;
      LINE_CHANNEL_SECRET: string;
      PAPARAZZO_FUNCTION_ARN: string;
      PAPARAZZO_BUCKET_NAME: string;
      DYNAMODB_RACE_TABLE_NAME: string;
      PRESIGN_EXPIRES_IN: string;
      RACES_LIFF_ID: string;
      SETTINGS_LIFF_ID: string;
      RACE_LIST_PAGE_SIZE: string;
      PUBLIC_ASSETS_ORIGIN: string;
      TERM_URL: string;
      LINE_NOTIFY_ACCESS_TOKEN: string;
    }
  }
}

export {};
