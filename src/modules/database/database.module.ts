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
import { PersonalDiaryDBService } from './services/personalDiaryDBService';
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
import { GuardDutty, GuardDuttySchema } from './schemas/guard_duttys.schema';
import { GuardDuttyPositionDBService } from './services/guardDuttyPostionDBService';
import { GuardDuttyGenerateDBService } from './services/guardDuttyGenerateDBService';
import { GuardDuttyDBService } from './services/guardDuttyDBService';
import {
  WorkCalendar,
  WorkCalendarSchema,
} from './schemas/work-calendar.schema';
import {
  WorkCalendarAssign,
  WorkCalendarAssignSchema,
} from './schemas/work-calendar-assign.schema';
import { WorkCalendarDBService } from './services/workCalendarDBService';
import { WorkCalendarAssignDBService } from './services/workCalendarAssignDBService';
import { cProvinces, cProvinces_schema } from './schemas/c_provinces';
import { cDistricts, cDistricts_schema } from './schemas/c_districts';
import { cWards, cWards_schema } from './schemas/c_wards';
import { ProvincesDBService } from './services/cProvincesDBService';
import { DistrictDBService } from './services/cDistrictsDBService';
import { WardsDBService } from './services/cWardsDBServicets';
import { ExperienceBook, ExperienceBookSchema } from './schemas/experience-book.schema';
import { ExperienceBookDBService } from './services/experienceBookDBService';
import { RelatedDocument, RelatedDocumentSchema } from './schemas/related-documents.schema';
import { RelatedDocumentDBService } from './services/relatedDocumentDBService';
import { SSODBService } from './services/SSODBService';

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
        schema: GuardDuttySchema,
      },
      {
        name: WorkCalendar.name,
        schema: WorkCalendarSchema,
      },
      {
        name: WorkCalendarAssign.name,
        schema: WorkCalendarAssignSchema,
      },
      {
        name: cProvinces.name,
        schema: cProvinces_schema,
      },
      {
        name: cDistricts.name,
        schema: cDistricts_schema,
      },
      {
        name: cWards.name,
        schema: cWards_schema,
      },
      {
        name: ExperienceBook.name,
        schema: ExperienceBookSchema
      },
      {
        name: RelatedDocument.name,
        schema: RelatedDocumentSchema
      }
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
    WorkCalendarDBService,
    WorkCalendarAssignDBService,
    ProvincesDBService,
    DistrictDBService,
    WardsDBService,
    ExperienceBookDBService,
    RelatedDocumentDBService,
    SSODBService
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
    WorkCalendarDBService,
    WorkCalendarAssignDBService,
    ProvincesDBService,
    DistrictDBService,
    WardsDBService,
    ExperienceBookDBService,
    RelatedDocumentDBService,
    SSODBService
  ],
})
export class DatabaseModule {}
