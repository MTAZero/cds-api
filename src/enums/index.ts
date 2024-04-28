export enum SystemFeatures {
  ManagerUsers = 'ManagerUsers',
  ManagerRoles = 'ManagerRoles',
  ManagerUnits = 'ManagerUnits',
  ManagerPermission = 'ManagerPermissions',
  TroopReports = 'TroopReports',
  ManagerRegisterLeave = 'ManagerRegisterLeave',
  ManagerGuardDutty = 'ManagerGuardDutty',
  ManagerDuttySetting = 'ManagerDuttySetting',
  ManagerPositions = 'ManagerPositions',
  ManagerProgresses = 'ManagerProgresses',
  ManagerDocuments = 'ManagerDocuments',
  ManagerTrainnings = 'ManagerTrainings'
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

export enum Rank {
  ThieuUyCN = "Thiếu úy CN",
  TrungUyCN = "Trung úy CN",
  ThuongUyCN = "Thượng úy CN",
  DaiUyCN = "Đại úy CN",
  ThieuTaCN = "Thiếu tá CN",
  TrungTaCN = "Trung tá CN",
  ThuongTaCN = "Thượng tá CN",
  ThieuUy = "Thiếu úy",
  TrungUy = "Trung úy",
  ThuongUy = "Thượng úy",
  DaiUy = "Đại úy",
  ThieuTa = "Thiếu tá",
  TrungTa = "Trung tá",
  ThuongTa = "Thượng tá",
  DaiTa = "Đại tá",
  ThieuTuong = "Thiếu tướng",
  TrungTuong = "Trung tướng",
  ThuongTuong = "Thượng tướng",
  DaiTuong = "Đại tướng"
}

export enum TypePosition {
  SQCH = "SQCH",
  SQTCM = "SQTCM",
  SQTCTT = "SQTCTT",
  SQCNTT = "SQCNTT",
  KTVTCM = "KTVTCM",
  KTVTCTT = "KTVTCTT",
  KTVCNTT = "KTVCNTT",
  NVTCM = "NVTCM",
  NVTCTT = "NVTCTT",
  NVCNTT = "NVCNTT",
  NVCMKT = "NVCMKT" 
}

export enum DayOfWeek {
  ThuHai = "Thứ 2",
  ThuBa = "Thứ 3",
  ThuTu = "Thứ 4",
  ThuNam = "Thứ 5",
  ThuSau = "Thứ 6",
  ThuBay = "Thứ 7",
  ChuNhat = "Chủ nhật"
}