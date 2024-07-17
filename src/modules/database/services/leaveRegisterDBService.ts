import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeaveRegister } from '../schemas/leave-register.schema';
import { User } from '../schemas/users.schema';
import { UnitDBService } from './unitDBService';
import { MAX_ITEM_QUERYS } from 'src/const';
import { RegisterLeaveStatus } from 'src/enums';
import { UserDBService } from './userDBService';

@Injectable()
export class LeaveRegisterDBService extends BaseDBService<LeaveRegister> {
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;

  constructor(@InjectModel(LeaveRegister.name) private readonly entityModel) {
    super(entityModel);
  }

  private async checkCanUpdateStatus(user: User, id: string) {
    const item = await this.getItemById(id);
    if (!item) throw new NotFoundException();

    if (
      item.status !== RegisterLeaveStatus.CREATED &&
      item.status !== RegisterLeaveStatus.WATING_FOR_APPROVE
    )
      throw new BadRequestException();

    if (!item.user) throw new BadRequestException();

    const unit = item.unit_approve;
    const userCreated = await this.userDBService.getItemById(item.user);
    if (!unit && user.unit.toString() !== userCreated.unit.toString())
      return false;

    if (unit) {
      const unitItem = await this.unitDBService.getItemById(unit.toString());
      const canUpdate = await this.unitDBService.checkUnitIsDescenants(
        user.unit.toString(),
        unitItem._id.toString(),
      );

      if (!canUpdate || user.unit.toString() === unitItem._id.toString())
        return false;
    }

    return true;
  }

  async approveLeaveReigster(user: User, id: string, isRoot = false) {
    const item = await this.getItemById(id);
    if (!item) throw new NotFoundException();

    const canUpdate = await this.checkCanUpdateStatus(user, id);
    if (!canUpdate) throw new ForbiddenException();

    const ans = await this.updateItem(item._id.toString(), {
      ...item,
      ...{
        user_approve: user._id,
        unit_approve: user.unit,
        time_approve: new Date().getTime(),
        status: isRoot
          ? RegisterLeaveStatus.APPROVED
          : RegisterLeaveStatus.WATING_FOR_APPROVE,
      },
    });

    return ans;
  }

  async rejectLeaveRegister(user: User, id: string) {
    const item = await this.getItemById(id);
    if (!item) throw new NotFoundException();

    const canUpdate = await this.checkCanUpdateStatus(user, id);
    if (!canUpdate) throw new ForbiddenException();

    const ans = await this.updateItem(item._id.toString(), {
      ...item,
      ...{
        user_approve: user._id,
        unit_approve: user.unit,
        time_approve: new Date().getTime(),
        status: RegisterLeaveStatus.REJECTED,
      },
    });

    return ans;
  }

  async getRegisterChildUnit(user: User, startTime: number, endTime: number) {
    if (!user.unit) return [];

    const unit = await this.unitDBService.getItemById(user.unit.toString());
    const childs = await this.unitDBService.getListChild(unit._id.toString());
    const users = await this.userDBService.getUsersOfUnit(unit._id.toString());
    const userIds = users.map((i) => i._id);

    const ans = {
      ...unit,
    };
    ans.registerLeaves = (
      await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          user: {
            $in: userIds,
          },
          time_register: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      })
    ).items;

    const children = [];
    for (let index = 0; index < childs.length; index++) {
      const child = childs[index];
      const registerLeaves = await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          unit_approve: child._id.toString(),
          time_register: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      });

      const item = {
        ...child,
        ...{
          registerLeave: registerLeaves.items,
        },
      };

      children.push(item);
    }
    ans.childs = children;

    return ans;
  }
}
