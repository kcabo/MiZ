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

export type DbUserItem = DbPrimaryKeys & {
  userName: string;
  mode: 'swimmer' | 'manager';
  isTermAgreed: boolean;
  friendship: boolean;
  createdAt: string;
};

export type PaparazzoResponse = {
  status: 'ok' | 'error';
};
