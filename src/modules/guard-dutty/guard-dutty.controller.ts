import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { GuardDuttyPositionDBService } from '../database/services/guardDuttyPostionDBService';
import { CreateGuardDuttyPositionDto } from './dtos/create-guard-dutty-position.dto';
import { UpdateGuardDuttyPositionDto } from './dtos/update-guard-dutty-position.dto';
import { GuardDuttyDBService } from '../database/services/guardDuttyDBService';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { UpdateGuardDuttyDto } from './dtos/update-guard-dutty.dto';
import { UserDBService } from '../database/services/userDbService';
import { UnitDBService } from '../database/services/unitDBService';
import { CurrentUser } from 'src/decorator/current-user.decorator';

@Controller('guard-dutty')
@UseGuards(PermissionsGuard)
export class GuardDuttyController {
  @Inject(GuardDuttyPositionDBService)
  guardDuttyPositionDBService: GuardDuttyPositionDBService;

  @Inject(GuardDuttyDBService)
  guardDuttyDBService: GuardDuttyDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Get('/positions')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getListGuardDuttyPosition(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = { priority_display: -1, last_update: -1 };
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.guardDuttyPositionDBService.getItems({
      filter,
      sort,
      skip: pagination.skip,
      limit: pagination.limit,
      textSearch: keyword,
    });

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      data,
    );
  }

  @Post('/positions')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async insertGuardDuttyPosition(
    @Body(new ValidationPipe()) entity: CreateGuardDuttyPositionDto,
    @Res() res,
  ) {
    const ans = await this.guardDuttyPositionDBService.insertItem(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/positions/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async updateGuardDuttyPosition(
    @Body(new ValidationPipe()) entity: UpdateGuardDuttyPositionDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.guardDuttyPositionDBService.updateItem(id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/positions/:id')
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async removeGuardDuttyPosition(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.guardDuttyPositionDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/positions/:id')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getDetailGuardDuttyPosition(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.guardDuttyPositionDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/pending/:unitId')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getListGuardDuttyPending(
    @Res() res,
    @Param('unitId') unitId: string,
    @Query('time') time: string,
  ) {
    const ans = await this.guardDuttyDBService.getListPendingGuardDuttyMonth(
      unitId,
      parseInt(time),
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/assign/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async assignGuardDutty(
    @Res() res,
    @Param('id') id: string,
    @Body(new ValidationPipe()) entity: UpdateGuardDuttyDto,
  ) {
    let ans;

    const item = await this.guardDuttyDBService.getItemById(id);
    if (!item) throw new NotFoundException();

    if (entity.user) {
      const user = await this.userDBService.getItemById(entity.user);
      if (!user) throw new NotFoundException();

      const canUpdate = await this.userDBService.checkUserInUnit(
        entity.user,
        item.unit,
      );
      if (!canUpdate) throw new ForbiddenException();

      ans = await this.guardDuttyDBService.updateItem(id, {
        user: entity.user,
        is_complete: true,
      });
    } else {
      if (!entity.unit) throw new BadRequestException('unit or user required');

      const unit = await this.unitDBService.getItemById(entity.unit);
      if (!unit) throw new NotFoundException();

      const canUpdate = await this.unitDBService.checkUnitIsDescenants(
        item.unit,
        entity.unit,
        false,
      );
      if (!canUpdate) throw new ForbiddenException();

      ans = await this.guardDuttyDBService.updateItem(id, {
        unit: entity.unit,
        is_complete: false,
      });
    }

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/unit/:unitId')
  async getListGuardDuttyOfUnit(
    @Res() res,
    @Param('unitId') unitId: string,
    @Query('time') time: string,
  ) {
    if (!time) throw new BadRequestException('Time is required');

    const timeExact = parseInt(time);
    const ans = await this.guardDuttyDBService.getListGuardDuttyCompleteByUnit(
      unitId,
      timeExact,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/root/:unitId')
  async getListGuardDuttyOfRootUnit(
    @Res() res,
    @Param('unitId') unitId: string,
    @Query('time') time: string,
  ) {
    if (!time) throw new BadRequestException('Time is required');

    const timeExact = parseInt(time);
    const root = await this.unitDBService.getRootOfUnit(unitId);

    const ans = await this.guardDuttyDBService.getListGuardDuttyCompleteByUnit(
      root._id.toString(),
      timeExact,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/personal/:userId')
  @UseGuards(JwtAuthGuard)
  async getListGuardDuttyOfUser(
    @Res() res,
    @Query('time') time: string,
    @Param('userId') userId: string,
  ) {
    if (!time) throw new BadRequestException('Time is required');

    const user = await this.userDBService.getItemById(userId);
    if (!user) throw new NotFoundException();

    const timeExact = parseInt(time);
    const ans =
      await this.guardDuttyDBService.getListGuardDuttyCompleteByPersonal(
        userId,
        timeExact,
      );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
