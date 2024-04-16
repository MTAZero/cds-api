import { TroopStatus, UserType } from 'src/enums';

export type TroopEachType = {
  type: UserType;
  total: number;
  totalLeft: number;
  totalAttendance: number;
};

export type TroopLeftReasonType = {
  status: TroopStatus;
  number: number;
};

export type TroopReportType = {
  total: number;
  totalReport: number;
  time: number;
  totalAttendance: number;
  totalLeft: number;
  name: string;
  troopEachTypes: Array<TroopEachType>;
  leftReasons: Array<TroopLeftReasonType>;
};
