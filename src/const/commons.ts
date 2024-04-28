import { TroopStatus, UserType, Rank, TypePosition, DayOfWeek } from 'src/enums';

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

export const RANK = [
  Rank.ThieuUyCN,
  Rank.TrungUyCN,
  Rank.ThuongUyCN,
  Rank.DaiUyCN,
  Rank.ThieuTaCN,
  Rank.TrungTaCN,
  Rank.ThuongTaCN,
  Rank.ThieuUy,
  Rank.TrungUy,
  Rank.ThuongUy,
  Rank.DaiUy,
  Rank.ThieuTa,
  Rank.TrungTa,
  Rank.ThuongTa,
  Rank.DaiTa,
  Rank.ThieuTuong,
  Rank.TrungTuong,
  Rank.ThuongTuong,
  Rank.DaiTuong
]

export const TYPE_POSITION = [
  TypePosition.SQCH,
  TypePosition.SQTCM,
  TypePosition.SQTCTT,
  TypePosition.SQCNTT,
  TypePosition.KTVTCM,
  TypePosition.KTVCNTT,
  TypePosition.KTVTCTT,
  TypePosition.NVTCM,
  TypePosition.NVCNTT,
  TypePosition.NVTCTT,
  TypePosition.NVCMKT
]

export const DAY_OF_WEEK = [
  DayOfWeek.ThuHai,
  DayOfWeek.ThuBa,
  DayOfWeek.ThuTu,
  DayOfWeek.ThuNam,
  DayOfWeek.ThuSau,
  DayOfWeek.ThuBay,
  DayOfWeek.ChuNhat
]
