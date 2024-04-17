export enum SystemFeatures {
  ManagerUsers = 'ManagerUsers',
  ManagerRoles = 'ManagerRoles',
  ManagerUnits = 'ManagerUnits',
  ManagerPermission = 'ManagerPermissions',
  TroopReports = 'TroopReports',
  ManagerRegisterLeave = 'ManagerRegisterLeave',
  ManagerGuardDutty = 'ManagerGuardDutty',
  ManagerDuttySetting = 'ManagerDuttySetting',
}

export enum SystemAction {
  View = 'View',
  Edit = 'Edit',
  Approve = 'Approve',
  Report = 'Report',
  UnitApprove = 'UnitApprove',
}

export enum TroopStatus {
  CoMat = 'CoMat',
  NghiPhep = 'NghiPhep',
  NghiOm = 'NghiOm',
  DiVien = 'DiVien',
  TranhThu = 'TranhThu',
  NghiCuoiTuan = 'NghiCuoiTuan',
  CongTac = 'CongTac',
  ChinhSach = 'ChinhSach',
  DiHoc = 'DiHoc',
  Khac = 'Khac',
}

export enum UserType {
  SQ = 'SQ',
  QNCN = 'QNCN',
  CCQP = 'CCQP',
  HQSCS = 'HSQCS',
}

export enum RegisterLeaveStatus {
  CREATED = 'created',
  WATING_FOR_APPROVE = 'waiting_for_approve',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
