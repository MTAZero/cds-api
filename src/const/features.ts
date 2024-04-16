import { SystemAction, SystemFeatures } from 'src/enums';

export const FEATURES_SYSTEM = [
  SystemFeatures.ManagerUsers,
  SystemFeatures.ManagerRoles,
  SystemFeatures.ManagerUnits,
  SystemFeatures.ManagerPermission,
  SystemFeatures.TroopReports,
];

export const ACTIONS_SYSTEM = [
  SystemAction.View,
  SystemAction.Edit,
  SystemAction.Approve,
  SystemAction.Report,
];
