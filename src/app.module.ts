import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig } from './configs/configuration.config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    MongooseModule.forRoot(databaseConfig().uri),
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
