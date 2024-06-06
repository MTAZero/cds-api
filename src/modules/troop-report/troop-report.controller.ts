import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import { TroopDetailDBService } from '../database/services/troopDetailDBService';
import { TroopUnitDBService } from '../database/services/troopUnitDBService';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { TroopUnitReportDto } from './dtos/troop-unit-report';
import { ResponseCode, ResponseMessage } from 'src/const';
import { ApiResponse } from 'src/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from '../database/schemas/users.schema';
import { TroopUnitGetDetailReportDto } from './dtos/troop-unit-get-detail';
import { getTextOfReport } from 'src/utils/troop-report.helper';
import { UnitDBService } from '../database/services/unitDBService';
import { ObjectId } from 'mongoose';
import { Paginate } from 'src/decorator/paginate.decorator';
import { PaginationType } from 'src/middleware';
import { PersonalReportDto } from './dtos/personal-report';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

@Controller('troop-report')
@UseGuards(PermissionsGuard)
export class TroopReportController {
  @Inject(TroopDetailDBService)
  troopDetailDBService: TroopDetailDBService;

  @Inject(TroopUnitDBService)
  troopUnitDBService: TroopUnitDBService;

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  // báo quân số cá nhân
  @Post('/personal-report')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async personalReportTroop(
    @Body(new ValidationPipe()) data: PersonalReportDto,
    @Res() res,
    @CurrentUser() user: User,
  ) {
    const ans = await this.troopDetailDBService.personalReport(
      user,
      data.time,
      data.status,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  // lấy tình hình quân số của cá nhân trong tháng
  @Get('/list-personal-report')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async listPersonalReport(
    @Res() res,
    @Query('time') time: string,
    @CurrentUser() user: User,
  ) {
    if (!time) throw new BadRequestException('Time is required');

    const timeExact = parseInt(time);
    const ans =
      await this.troopDetailDBService.getListPersonalTroopReportPersonal(
        user._id.toString(),
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

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report])
  async unitReportTroop(
    @Body(new ValidationPipe()) data: TroopUnitReportDto,
    @Res() res,
    @CurrentUser() user: User,
  ) {
    const ans = await this.troopUnitDBService.addReportUnit(user, data);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/unit-tree-troop-detail/:unitId')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getUnitTreeTroopDetail(
    @Res() res,
    @CurrentUser() user: User,
    @Query('time') time: string,
    @Param('unitId') unitId: string,
    @Paginate() pagination: PaginationType,
    @Req() req,
    @Query('keyword') keyword,
    @Query('status') status: string,
    @Query('type') type: string,
  ) {
    if (!time) throw new BadRequestException('Time is require');

    const sort = req.sort;
    let filter = { isPersonal: true };

    if (status)
      filter = {
        ...filter,
        ...{
          status,
        },
      };
    if (type)
      filter = {
        ...filter,
        ...{
          type,
        },
      };

    const _keyword = keyword ? keyword : '';

    const _time: number = parseInt(time);

    const ans = await this.troopUnitDBService.getUserTroopStatusOfUnitAndChilds(
      user.unit.toString(),
      unitId,
      _time,
      {
        filter,
        sort,
        skip: pagination.skip,
        limit: pagination.limit,
        textSearch: _keyword,
      },
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/unit-troop-detail/:unitId')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getUnitTroopDetail(
    @Res() res,
    @CurrentUser() user: User,
    @Query('time') time: string,
    @Param('unitId') unitId: string,
    @Paginate() pagination: PaginationType,
    @Req() req,
    @Query('keyword') keyword,
    @Query('status') status: string,
    @Query('type') type: string,
  ) {
    if (!time) throw new BadRequestException('Time is require');

    const sort = req.sort;
    let filter = { isPersonal: true };
    if (status)
      filter = {
        ...filter,
        ...{
          status,
        },
      };
    if (type)
      filter = {
        ...filter,
        ...{
          type,
        },
      };

    const _keyword = keyword ? keyword : '';

    const _time: number = parseInt(time);

    const ans = await this.troopUnitDBService.getUserTroopStatusOfUnit(
      user.unit.toString(),
      unitId,
      _time,
      {
        filter,
        sort,
        skip: pagination.skip,
        limit: pagination.limit,
        textSearch: _keyword,
      },
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/current-unit-troop')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getCurrentUnitTroop(
    @Res() res,
    @CurrentUser() user: User,
    @Query('time') time: string,
  ) {
    if (!user.unit) throw new NotFoundException();

    const _time = parseInt(time);
    const ans = await this.troopUnitDBService.getReportDetail(
      user.unit.toString(),
      {
        unitId: user.unit,
        time: _time,
      },
    );

    const result = {
      ...ans,
      ...{
        text: getTextOfReport(ans),
      },
    };

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      result,
    );
  }

  @Post('/get-troop')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getTroopStatus(
    @Res() res,
    @Body(new ValidationPipe()) data: TroopUnitGetDetailReportDto,
    @CurrentUser() user: User,
  ) {
    if (!user.unit) throw new NotFoundException();
    const ans = await this.troopUnitDBService.getReportDetail(
      user.unit.toString(),
      data,
    );

    const result = {
      ...ans,
      ...{
        text: getTextOfReport(ans),
      },
    };

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      result,
    );
  }

  @Post('/unit-status-report')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getUnitStatusReport(
    @Res() res,
    @Body(new ValidationPipe()) data: TroopUnitGetDetailReportDto,
    @CurrentUser() user: User,
  ) {
    if (
      !this.unitDBService.checkUnitIsDescenants(
        user.unit.toString(),
        data.unitId.toString(),
      )
    )
      throw new ForbiddenException();

    const ans = await this.troopUnitDBService.getUnitReportStatus(
      user.unit.toString(),
      data.unitId.toString(),
      data.time,
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
