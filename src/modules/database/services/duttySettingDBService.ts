import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DuttySetting } from '../schemas/dutty-setting.schema';
import { ResponseMessage } from 'src/const';

@Injectable()
export class DuttySettingDBSerivce extends BaseDBService<DuttySetting> {
  constructor(@InjectModel(DuttySetting.name) private readonly entityModel) {
    super(entityModel);
  }

  async checkExist(entity: DuttySetting): Promise<boolean> {
    const count = await this.countByFilter({
      user: entity.user.toString(),
      guard_setting: entity.guard_dutty.toString(),
    });

    return count > 0;
  }

  async insertItem(entity: any): Promise<any> {
    if (await this.checkExist(entity))
      throw new BadRequestException(ResponseMessage.ALREADY_EXIST);
    return super.insertItem(entity);
  }
}
