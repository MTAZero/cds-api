import { TroopStatus, UserType } from 'src/enums';

export const API_VERSION = '1.0';
export const DEFAULT_PAGE_SIZE = process.env['DEFAULT_PAGE_SIZE']
  ? process.env['DEFAULT_PAGE_SIZE']
  : 10;
export const DEFAULT_PAGE_INDEX = 1;
export const BCRYPT_SALT = 10;
export const MAX_ITEM_QUERYS = 1000;

export const LIST_TROOP_STATUS = [
  // TroopStatus.CoMat,
  TroopStatus.NghiPhep,
  TroopStatus.NghiOm,
  TroopStatus.DiVien,
  TroopStatus.TranhThu,
  TroopStatus.NghiCuoiTuan,
  TroopStatus.CongTac,
  TroopStatus.ChinhSach,
  TroopStatus.Khac,
  TroopStatus.DiHoc,
];

export const LIST_USER_TYPES = [
  UserType.SQ,
  UserType.QNCN,
  UserType.CCQP,
  UserType.HQSCS,
];
