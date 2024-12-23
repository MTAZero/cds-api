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
  ManagerTrainnings = 'ManagerTrainings',
  ManagerPersonalDiarys = 'ManagerPersonalDiarys',
  WorkCalendar = 'WorkCalendar',
  ManagerExperiences = 'ManagerExperiences',
  ManagerVehicle = 'ManagerVehicle',
  RegisterVehicle = 'RegisterVehicle',
  VehicleCommand = 'VehicleCommand',
  DeliveryBill = 'DeliveryBill',
  MeetingBook = 'MeetingBook',
  ManagerFuel = 'ManagerFuel',
  ManagerTask = 'ManagerTask',
  ManagerWorkAddress = 'ManagerWorkAddress',
  ManagerTrackDiscipline = 'ManagerTrackDiscipline',
  StatisticDocument = 'StatisticDocument',
  ManagerTrackWork = 'ManagerTrackWork',
  AccessControl = 'AccessControl',
  StatisticWebC86 = 'StatisticWebC86',
  GoingCall = 'GoingCall',
  InComingCall = 'InComingCall',
  MonthyPlan = "MonthyPlan",
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

export enum LoaiNoiDungHuanLuyenThang {
  KHAC = 'Khác',
  CN = 'Chuyên ngành',
  CT = 'Chính trị',
  HC = 'Hậu cần',
  KT = 'Kỹ thuật',
  CTBB = 'Chiến thuật BB',
  DLDN = 'ĐLĐN, ĐLQLBĐ',
  THELUC= 'Thể lực',
  PCCN= 'PCCN, CHCN',
  KTCDBB= 'KT Chiến đấu BB',
  PHPT= 'Phòng hóa phổ thông',

}

export enum RegisterLeaveStatus {
  CREATED = 'created',
  WATING_FOR_APPROVE = 'waiting_for_approve',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Rank {
  BinhNhi = 'Binh nhì',
  BinhNhat = 'Binh nhất',
  HaSi = 'Hạ sĩ',
  TrungSi = 'Trung sĩ',
  ThuongSi = 'Thượng sĩ',
  ThieuUyCN = 'Thiếu úy CN',
  TrungUyCN = 'Trung úy CN',
  ThuongUyCN = 'Thượng úy CN',
  DaiUyCN = 'Đại úy CN',
  ThieuTaCN = 'Thiếu tá CN',
  TrungTaCN = 'Trung tá CN',
  ThuongTaCN = 'Thượng tá CN',
  ThieuUy = 'Thiếu úy',
  TrungUy = 'Trung úy',
  ThuongUy = 'Thượng úy',
  DaiUy = 'Đại úy',
  ThieuTa = 'Thiếu tá',
  TrungTa = 'Trung tá',
  ThuongTa = 'Thượng tá',
  DaiTa = 'Đại tá',
  ThieuTuong = 'Thiếu tướng',
  TrungTuong = 'Trung tướng',
  ThuongTuong = 'Thượng tướng',
  DaiTuong = 'Đại tướng',
}

export enum TypePosition {
  SQCH = 'SQCH',
  SQTCM = 'SQTCM',
  SQTCTT = 'SQTCTT',
  SQCNTT = 'SQCNTT',
  KTVTCM = 'KTVTCM',
  KTVTCTT = 'KTVTCTT',
  KTVCNTT = 'KTVCNTT',
  NVTCM = 'NVTCM',
  NVTCTT = 'NVTCTT',
  NVCNTT = 'NVCNTT',
  NVCMKT = 'NVCMKT',
  TL = 'TL',
  TBTC = "TBTC",
  TBNV = "TBNV"
}

export enum DayOfWeek {
  ThuHai = 'Thứ 2',
  ThuBa = 'Thứ 3',
  ThuTu = 'Thứ 4',
  ThuNam = 'Thứ 5',
  ThuSau = 'Thứ 6',
  ThuBay = 'Thứ 7',
  ChuNhat = 'Chủ nhật',
}

export enum TypeBook {
  SoTay = 'Sổ tay',
}

export enum TypeLevelUnit {
  Doi = "01",
  Cum = "02",
  TrungTam = "03" 
}

