import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/users.schema';
import { UserDBService } from './services/userDBService';
import { Role, RoleSchema } from './schemas/roles.schema';
import { RoleDBService } from './services/roleDBService';
import { Unit, UnitSchema } from './schemas/units.schema';
import { PermisisonShema, Permission } from './schemas/permissions.schema';
import { UnitDBService } from './services/unitDbService';
import { PermissionDBService } from './services/permissionDbService';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/configs/configuration.config';

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
  providers: [UserDBService, RoleDBService, UnitDBService, PermissionDBService],
  exports: [UserDBService, RoleDBService, UnitDBService, PermissionDBService],
})
export class DatabaseModule {}
