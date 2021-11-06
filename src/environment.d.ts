declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINE_CHANNEL_ACCESS_TOKEN: string;
      LINE_CHANNEL_SECRET: string;
      PAPARAZZO_FUNCTION_ARN: string;
      PAPARAZZO_BUCKET_NAME: string;
    }
  }
}

export {};
