import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig, archiveConfig, databaseConfig } from './configs/configuration.config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './modules/database/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { PaginationMiddleware, SortMiddleware } from './middleware';
import { RolesModule } from './modules/roles/roles.module';
import { UnitsModule } from './modules/units/units.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TroopReportModule } from './modules/troop-report/troop-report.module';
import { RegisterLeaveModule } from './modules/register-leave/register-leave.module';
import { GuardDuttyModule } from './modules/guard-dutty/guard-dutty.module';
import { PositionsModule } from './modules/category/positions/positions.module';
import { ProgressesModule } from './modules/progress/progresses.module';
import { TrainingModule } from './modules/trainning/training.module';
import { PersonalDiaryModule } from './modules/personal-diarys/personal-diarys.module';
import { ExperienceModule } from './modules/experience-book/experience-book.module';
import { WorkCalendarModule } from './modules/work-calendar/work-calendar.module';
import { AdministrativeUnitsModule } from './modules/administrative-units/administrative-units.module';
import { RelatedDocumentModule } from './modules/RelatedDocuments/relatedDocuments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ManagerVehicleModule } from './modules/manager-vehicle/managerVehicle.module';
import { RegisterVehicleModule } from './modules/register-vehicle/registerVehicle.module';
import { VehicleCommandModule } from './modules/vehicle command/vehicleCommand.module';
import { DeliveryBillModule } from './modules/delivery-bill/deliveryBill.module';
import { MeetingBookModule } from './modules/meeting-book/meeting-book.module';
import { ManagerFuelModule } from './modules/manager-fuel/managerFuel.module';
import { ManagerTaskModule } from './modules/manager-task/managerVehicle.module';
import { ManagerWorkAddressModule } from './modules/manager-work-address/managerWorkAddress.module';
import { StatisticDocumentModule } from './modules/statistic-document/statisticDocument.module';
import { ManagerTrackDisciplineModule } from './modules/track-discipline/trackDiscipline.module';
import { ManagerTrackWorkModule } from './modules/track-work/trackWork.module';
import { AccessControlModule } from './modules/access control/AccessControl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [databaseConfig, appConfig, archiveConfig ],
    }),
    MongooseModule.forRoot(databaseConfig().uri),
    ServeStaticModule.forRoot({
      rootPath: archiveConfig().folder_saved,
    }),
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
    RolesModule,
    UnitsModule,
    PermissionsModule,
    TroopReportModule,
    RegisterLeaveModule,
    GuardDuttyModule,
    PositionsModule,
    ProgressesModule,
    TrainingModule,
    PersonalDiaryModule,
    WorkCalendarModule,
    AdministrativeUnitsModule,
    ExperienceModule,
    RelatedDocumentModule,
    ManagerVehicleModule,
    RegisterVehicleModule,
    VehicleCommandModule,
    DeliveryBillModule,
    MeetingBookModule,
    ManagerFuelModule,
    ManagerTaskModule,
    ManagerWorkAddressModule,
    StatisticDocumentModule,
    ManagerTrackDisciplineModule,
    ManagerTrackWorkModule,
    AccessControlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('/');
    consumer.apply(SortMiddleware).forRoutes('/');
  }
}

