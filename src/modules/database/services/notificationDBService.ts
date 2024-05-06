import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { NotificationUser } from '../schemas/notification-users.schema';

@Injectable()
export class NotificationUserDBService extends BaseDBService<NotificationUser> {
  constructor(
    @InjectModel(NotificationUser.name) private readonly entityModel,
  ) {
    super(entityModel);
  }
}
