import { TroopStatus, SystemAction, SystemFeatures, UserType } from 'src/enums';

export const FEATURES_SYSTEM = [
  SystemFeatures.ManagerUsers,
  SystemFeatures.ManagerRoles,
  SystemFeatures.ManagerUnits,
  SystemFeatures.ManagerPermission,
];

export const ACTIONS_SYSTEM = [
  SystemAction.View,
  SystemAction.Edit,
  SystemAction.Approve,
];

export const REASON_OFFS = [
  TroopStatus.CoMat,
  TroopStatus.NghiPhep,
  TroopStatus.NghiOm,
  TroopStatus.DiVien,
  TroopStatus.TranhThu,
  TroopStatus.NghiCuoiTuan,
  TroopStatus.CongTac,
  TroopStatus.ChinhSach,
  TroopStatus.Khac,
];

export const ListUserType = [
  UserType.SQ,
  UserType.QNCN,
  UserType.CCQP,
  UserType.HQSCS,
];
