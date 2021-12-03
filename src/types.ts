export type CentiSeconds = number;

export type RaceTime = {
  reaction?: CentiSeconds;
  cumulativeTime: CentiSeconds[];
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

export const MeetKeys: (keyof Meet)[] = ['meet', 'courseLength', 'place'];

export type Race = Meet & { date: string } & RaceCoreData;

export type RaceForForm = Omit<Race, 'reaction' | 'cumulativeTime'> & {
  reaction?: string;
  cumulativeTime: CentiSeconds[]; // 未対応
};

export const RaceKeys: (keyof Race)[] = [
  ...MeetKeys,
  'date',
  'event',
  'swimmer',
  'reaction',
  'cumulativeTime',
];

export type DbPrimaryKeys = {
  userId: string;
  sk: string;
};

export type DbItem<T = {}> = DbPrimaryKeys & T;

export type DbRaceItem = DbItem<
  Race & {
    updatedAt: string;
  }
>;

export type UserMode = 'swimmer' | 'manager';

export type UserSettings = {
  userName: string;
  mode: UserMode;
};

export const UserSettingsKeys: (keyof UserSettings)[] = ['userName', 'mode'];

export type UserStatus = {
  isTermAccepted: boolean;
  friendship: boolean;
};

export const UserStatusKeys: (keyof UserStatus)[] = [
  'isTermAccepted',
  'friendship',
];

export type DbUserItem = DbItem<
  UserSettings & UserStatus & { createdAt: string }
>;

export type DbMeetCacheItem = DbItem<
  Meet & {
    ttl: number;
  }
>;

export type PaparazzoResponse = {
  status: 'ok' | 'error';
};

// DBに格納されている可能性のあるデータ型。ネストされていない
export type AmbiguousValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[];

export type AmbiguousObject = { [key: string]: AmbiguousValue };

export type QueryStartPoint = { [key: string]: any };

export type PostbackData =
  | AcceptTermPostback
  | DownloadSheetPostback
  | RerenderSheetPostback
  | ListUpRacePostback
  | RequestDeleteRacePostback
  | DeleteRacePostback;

export type AcceptTermPostback = {
  type: 'acceptTerm';
  mode: UserMode;
};

export type DownloadSheetPostback = {
  type: 'download';
  raceId: string;
};

export type RerenderSheetPostback = {
  type: 'rerender';
  raceId: string;
};

export type ListUpRacePostback = {
  type: 'list';
  start: QueryStartPoint;
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
