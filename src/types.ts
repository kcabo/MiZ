export type RaceTime = {
  reaction?: number;
  cumulativeTime: number[];
};
export type RaceCoreData = {
  swimmer: string;
  event: string;
} & RaceTime;

export type Meet = {
  courseLength?: '長水路' | '短水路';
  meet?: string;
  place?: string;
};

export type RaceData = {
  raceId: string;
  date: string;
} & Meet &
  RaceCoreData;

export type DbPrimaryKeys = {
  userId: string;
  sk: string;
};

export type DbRaceItem = DbPrimaryKeys & {
  createdAt: string;
  updatedAt: string;
} & Omit<RaceData, 'raceId'>;

export type UserMode = 'swimmer' | 'manager';

export type DbUserItem = DbPrimaryKeys & {
  userName: string;
  mode: UserMode;
  isTermAgreed: boolean;
  friendship: boolean;
  createdAt: string;
};

export type PaparazzoResponse = {
  status: 'ok' | 'error';
};

export type RaceSheetBubble = {
  url: string;
  raceId: string;
};

export type PostbackData =
  | AgreeToTermPostback
  | DownloadSheetPostback
  | RequestDeleteRacePostback
  | DeleteRacePostback;

export type AgreeToTermPostback = {
  type: 'agreeToTerm';
  mode: UserMode;
};

export type DownloadSheetPostback = {
  type: 'download';
  raceId: string;
};

export type RequestDeleteRacePostback = {
  type: 'reqDelete';
  raceId: string;
};

export type DeleteRacePostback = {
  type: 'delete';
  raceId: string;
  expiresAt: number; // unix time
};
