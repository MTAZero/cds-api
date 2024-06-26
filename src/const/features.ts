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
  SystemFeatures.ManagerProgresses,
  SystemFeatures.ManagerPositions,
  SystemFeatures.ManagerProgresses,
  SystemFeatures.ManagerDocuments,
  SystemFeatures.ManagerTrainnings,
  SystemFeatures.ManagerPersonalDiarys,
  SystemFeatures.WorkCalendar,
];

export const ACTIONS_SYSTEM = [
  SystemAction.View,
  SystemAction.Edit,
  SystemAction.Approve,
  SystemAction.Report,
  SystemAction.UnitApprove,
];
