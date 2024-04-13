import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/users.schema';
import { UserDBService } from './services/userDbService';
import { Role, RoleSchema } from './schemas/roles.schema';
import { RoleDBService } from './services/roleDbService';

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
    ]),
  ],
  providers: [UserDBService, RoleDBService],
  exports: [UserDBService, RoleDBService],
})
export class DatabaseModule {}
