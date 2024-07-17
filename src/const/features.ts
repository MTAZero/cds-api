import { SystemAction, SystemFeatures } from 'src/enums';

export const FEATURES_SYSTEM = [
  SystemFeatures.ManagerUsers,
  SystemFeatures.ManagerRoles,
  SystemFeatures.ManagerUnits,
  SystemFeatures.ManagerPermission,
  SystemFeatures.TroopReports,
  SystemFeatures.ManagerRegisterLeave,
  SystemFeatures.ManagerGuardDutty,
  SystemFeatures.ManagerDuttySetting,
  SystemFeatures.ManagerPositions,
  SystemFeatures.ManagerProgresses,
  SystemFeatures.ManagerDocuments,
  SystemFeatures.ManagerTrainnings,
  SystemFeatures.ManagerPersonalDiarys,
  SystemFeatures.WorkCalendar,
  SystemFeatures.ManagerExperiences,
  SystemFeatures.ManagerVehicle,
  SystemFeatures.RegisterVehicle,
  SystemFeatures.VehicleCommand,
  SystemFeatures.DeliveryBill,
  SystemFeatures.MeetingBook,
  SystemFeatures.ManagerFuel,
  SystemFeatures.ManagerWorkAddress,
  SystemFeatures.ManagerTask,
  SystemFeatures.ManagerTrackDiscipline,
  SystemFeatures.StatisticDocument,
  SystemFeatures.ManagerTrackWork,
  SystemFeatures.AccessControl
];

export const ACTIONS_SYSTEM = [
  SystemAction.View,
  SystemAction.Edit,
  SystemAction.Approve,
  SystemAction.Report,
  SystemAction.UnitApprove,
];
