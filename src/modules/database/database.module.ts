import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/users.schema';
import { UserDBService } from './services/userDbService';
import { Role, RoleSchema } from './schemas/roles.schema';
import { RoleDBService } from './services/roleDbService';
import { Unit, UnitSchema } from './schemas/units.schema';
import { PermisisonShema, Permission } from './schemas/permissions.schema';
import { UnitDBService } from './services/unitDBService';
import { PermissionDBService } from './services/permissionDBService';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/configs/configuration.config';
import { TroopUnitSchema, TroopUnits } from './schemas/troop-units.schema';
import { TroopDetail, TroopDetailSchema } from './schemas/troop-detail.schema';
import { TroopDetailDBService } from './services/troopDetailDBService';
import { TroopUnitDBService } from './services/troopUnitDBService';
import { PositionDBService } from './services/positionDBService';
import { Position, PositionSchema } from './schemas/position.schema';
import { ProgressDBService } from './services/progressDBService';
import { Progress, ProgressSchema } from './schemas/progress.schema';
import { TrainingDBService } from './services/trainingDBService';
import { Training, TrainingSchema } from './schemas/trainnings.schema';
import {
  LeaveRegister,
  LeaveRegisterSchema,
} from './schemas/leave-register.schema';
import { LeaveRegisterDBService } from './services/leaveRegisterDBService';
import {
  PersonalDiary,
  PersonalDiarySchema,
} from './schemas/personal-diarys.schema';
import { PersonalDiaryDBService } from './services/PersonalDiaryDBService';
import {
  NotificationUser,
  NotificationUserSchema,
} from './schemas/notification-users.schema';
import { NotificationUserDBService } from './services/notificationDBService';
import {
  GuardDuttyPosition,
  GuardDuttyPositionSchema,
} from './schemas/guard-dutty-position.schema';
import {
  GuardDuttyGenerate,
  GuardDuttyGenerateSchema,
} from './schemas/guard_dutty_generate.schema';
import { GuardDutty } from './schemas/guard_duttys.schema';
import { GuardDuttyPositionDBService } from './services/guardDuttyPostionDBService';
import { GuardDuttyGenerateDBService } from './services/guardDuttyGenerateDBService';
import { GuardDuttyDBService } from './services/guardDuttyDBService';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Unit.name,
        schema: UnitSchema,
      },
      {
        name: Permission.name,
        schema: PermisisonShema,
      },
      {
        name: TroopUnits.name,
        schema: TroopUnitSchema,
      },
      {
        name: TroopDetail.name,
        schema: TroopDetailSchema,
      },
      {
        name: LeaveRegister.name,
        schema: LeaveRegisterSchema,
      },
      {
        name: Position.name,
        schema: PositionSchema,
      },
      {
        name: Progress.name,
        schema: ProgressSchema,
      },
      {
        name: Training.name,
        schema: TrainingSchema,
      },
      {
        name: PersonalDiary.name,
        schema: PersonalDiarySchema,
      },
      {
        name: NotificationUser.name,
        schema: NotificationUserSchema,
      },
      {
        name: GuardDuttyPosition.name,
        schema: GuardDuttyPositionSchema,
      },
      {
        name: GuardDuttyGenerate.name,
        schema: GuardDuttyGenerateSchema,
      },
      {
        name: GuardDutty.name,
        schema: GuardDuttyGenerateSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: (await appConfig()).jwt_key,
        signOptions: {
          expiresIn: '10d',
        },
      }),
    }),
  ],
  providers: [
    UserDBService,
    RoleDBService,
    UnitDBService,
    PermissionDBService,
    TroopDetailDBService,
    TroopUnitDBService,
    LeaveRegisterDBService,
    PositionDBService,
    ProgressDBService,
    TrainingDBService,
    PersonalDiaryDBService,
    NotificationUserDBService,
    GuardDuttyPositionDBService,
    GuardDuttyGenerateDBService,
    GuardDuttyDBService,
  ],
  exports: [
    UserDBService,
    RoleDBService,
    UnitDBService,
    PermissionDBService,
    TroopDetailDBService,
    TroopUnitDBService,
    LeaveRegisterDBService,
    PositionDBService,
    ProgressDBService,
    TrainingDBService,
    PersonalDiaryDBService,
    NotificationUserDBService,
    GuardDuttyPositionDBService,
    GuardDuttyGenerateDBService,
    GuardDuttyDBService,
  ],
})
export class DatabaseModule {}
