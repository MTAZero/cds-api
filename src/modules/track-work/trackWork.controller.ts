import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { PermissionDBService } from '../database/services/permissionDBService';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { TrackWorkBookDBService } from '../database/services/track-workDBService';
import { CreateTrackWorkDto } from './dtos/cud-work.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { timestampConfig } from 'src/configs/configuration.config';

@Controller('track-work')
@UseGuards(PermissionsGuard)
export class ManagerTrackWorkController {
  @Inject(TrackWorkBookDBService)
  trackWorkBookDBService: TrackWorkBookDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerTrackWork)
  async getListTrackWork(
  @Res() res,
  @Req() req,
  @Query() query,
  @CurrentUser() user
) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  let from =  Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
  let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;
  let unitId = query.unitId;
  
  let filter = {
    unitId: unitId,
    $or: [
      { created_date: { "$gte": from }},
      { created_date: { "$lte": to }}
    ]
  }
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.trackWorkBookDBService.getTrackWorkBelongUnit
  (
    user.unit,
    unitId,
    {
      filter,
      sort,
      skip: pagination.skip,
      limit: pagination.limit,
      textSearch: keyword
    });

  return ApiResponse(
    res,
    true,
    ResponseCode.SUCCESS,
    ResponseMessage.SUCCESS,
    data,
  );
}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerTrackWork)
  async CRUDTrackWork(
    @Body(new ValidationPipe()) entity: CreateTrackWorkDto,
    @Res() res,
  ) {
    const ans = await this.trackWorkBookDBService.CURDTrackWork(entity.listTrackWork);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
