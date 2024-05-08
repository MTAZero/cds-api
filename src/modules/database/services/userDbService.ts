import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/users.schema';
import { BaseDBService } from './base';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  BCRYPT_SALT,
  MAX_ITEM_QUERYS,
  ResponseCode,
  ResponseMessage,
} from 'src/const';
import { JwtService } from '@nestjs/jwt';
import { Permission } from '../schemas/permissions.schema';
import { PermissionDBService } from './permissionDBService';
import { SystemAction, SystemFeatures, UserType } from 'src/enums';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';

@Injectable()
export class UserDBService extends BaseDBService<User> {
  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  constructor(
    @InjectModel(User.name) private readonly entityModel,
    private readonly jwtService: JwtService,
  ) {
    super(entityModel);
  }

  async insertItem(entity: any): Promise<any> {
    const cnt = await this.countByFilter({ username: entity.username });
    if (cnt > 0)
      throw new HttpException(
        ResponseMessage.ALREADY_EXIST,
        ResponseCode.BAD_REQUEST,
      );

    entity.password = await bcrypt.hash(entity.password, BCRYPT_SALT);
    return super.insertItem(entity);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<{
    isValidate: boolean;
    user: User | null;
  }> {
    try {
      const dataRequest = await this.entityModel
        .find({ username })
        .limit(1)
        .lean()
        .exec();
      const user = dataRequest[0];

      if (!user)
        return {
          isValidate: false,
          user: null,
        };

      if (await bcrypt.compare(password, user.password))
        return {
          isValidate: true,
          user,
        };
    } catch (ex) {}

    return {
      isValidate: false,
      user: null,
    };
  }

  async signTokenByUser(user: User) {
    const payload = {
      username: user.username,
      sub: user._id,
    };

    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    id: string,
    old_password = '',
    new_password = '',
  ): Promise<boolean> {
    const user = await this.getItemById(id);
    if (!user) throw new HttpException('Not Found', ResponseCode.ERROR);

    const res = await bcrypt.compare(old_password, user.password);
    if (!res) throw new HttpException('Password incorrect', ResponseCode.ERROR);

    try {
      user.password = await bcrypt.hash(new_password, 10);

      await this.updateItem(id, user);
      return true;
    } catch (ex) {
      console.log('User ChangePassword Error : ', ex.message);
      return false;
    }
  }

  async getPermisisonOfUser(id: string): Promise<Array<Permission>> {
    const user = await this.getItemById(id);

    if (!user)
      throw new HttpException(
        ResponseMessage.NOT_FOUND,
        ResponseCode.NOT_FOUND,
      );
    if (!user.role) return [];

    const ans = await this.permissionDBService.getPermissionOfRoles(user.role);

    return ans;
  }

  async checkPermission(
    id: string,
    module: SystemFeatures,
    actions: Array<SystemAction>,
  ) {
    const permisisons = await this.getPermisisonOfUser(id);

    for (let index = 0; index < permisisons.length; index++)
      if (
        (permisisons[index].module as SystemFeatures) === module &&
        actions.includes(permisisons[index].action as SystemAction)
      )
        return true;

    return false;
  }

  async getItemsByScope(
    userID: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const res = {
      items: [],
      total: 0,
      size: limit,
      page: pageIndex,
      offset: skip,
    };

    const user = await this.getItemById(userID);
    if (!user.unit) return res;

    const unit = await this.unitDBService.getItemById(user.unit);
    if (!unit) return res;

    const units = await this.unitDBService.getAllDescendants(user.unit);

    filter = {
      ...filter,
      ...{
        unit: {
          $in: units.map((i) => i._id.toString()),
        },
      },
    };

    const ans = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });
    return ans;
  }

  async getUserOfUnitByScope(
    userID: string,
    unitId: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const res = {
      items: [],
      total: 0,
      size: limit,
      page: pageIndex,
      offset: skip,
    };

    const user = await this.getItemById(userID);
    if (!user?.unit) return res;

    const unit = await this.unitDBService.getItemById(user.unit);
    if (!unit) return res;

    const canGet = await this.unitDBService.checkUnitIsDescenants(
      unit._id.toString(),
      unitId,
    );
    if (!canGet) throw new ForbiddenException();

    filter = {
      ...filter,
      ...{
        unit: unitId,
      },
    };

    const ans = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });
    return ans;
  }

  async getUserOfUnitTreeByScope(
    userID: string,
    unitId: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const res = {
      items: [],
      total: 0,
      size: limit,
      page: pageIndex,
      offset: skip,
    };

    const user = await this.getItemById(userID);
    if (!user.unit) return res;

    const unit = await this.unitDBService.getItemById(user.unit);
    if (!unit) return res;

    const canGet = await this.unitDBService.checkUnitIsDescenants(
      unit._id.toString(),
      unitId,
    );
    if (!canGet) throw new ForbiddenException();

    const units = await this.unitDBService.getAllDescendants(unitId);

    filter = {
      ...filter,
      ...{
        unit: {
          $in: units.map((i) => i._id.toString()),
        },
      },
    };

    const ans = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });
    return ans;
  }

  async getUsersOfUnit(unit: string): Promise<Array<User>> {
    const requestData = await this.getItems({
      filter: {
        unit: unit,
        isPersonal: true,
      },
      skip: 0,
      limit: MAX_ITEM_QUERYS,
    });

    return requestData.items;
  }

  async getUsersTypeOfUnit(unit: string, type: UserType): Promise<Array<User>> {
    const requestData = await this.getItems({
      filter: {
        unit: unit,
        type,
        isPersonal: true,
      },
      skip: 0,
      limit: MAX_ITEM_QUERYS,
    });

    return requestData.items;
  }

  async checkUserInUnit(userId: string, unitId: string) {
    const user = await this.getItemById(userId);
    if (!user) throw new NotFoundException();

    const ans = await this.unitDBService.checkUnitIsDescenants(
      unitId,
      user.unit.toString(),
    );
    return ans;
  }
}
