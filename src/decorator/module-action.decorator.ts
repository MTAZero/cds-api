import { SetMetadata } from '@nestjs/common';
import { SystemAction, SystemFeatures } from 'src/enums';

export const ModulePermission = (module: SystemFeatures) =>
  SetMetadata('module', module);

export const ActionsPermission = (actions: Array<SystemAction>) =>
  SetMetadata('actions', actions);
