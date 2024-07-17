import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { CreateAccessControlDto } from './dtos/create-access-control.dto';
import { UpdateAccessControlDto } from './dtos/update-access-control.dto';
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
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { timestampConfig } from 'src/configs/configuration.config';
import { AccessControlDBService } from '../database/services/accessControlDBService';

@Controller('access-control')
@UseGuards(PermissionsGuard)
export class AccessControlController {
  @Inject(AccessControlDBService)
  accessControlDBService: AccessControlDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.AccessControl)
    async getAccessControl(
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
  let filter = {}

  if(unitId){
    filter = {
      unitId: unitId,
      $or: [
        { created_date: { "$gte": from }},
        { created_date: { "$lte": to }}
      ]
    }
  } else {
    filter = {
      $or: [
        { created_date: { "$gte": from }},
        { created_date: { "$lte": to }}
      ]
  }}
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.accessControlDBService.getAccessControlBelongUnit(
    {
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
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.AccessControl)
  async insertAccessControl(
    @Body(new ValidationPipe()) entity: CreateAccessControlDto,
    @Res() res,
    @CurrentUser() user
  ) {
    
    const ans = await this.accessControlDBService.insert(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.AccessControl)
  async updateAccessControl(
    @Body(new ValidationPipe()) entity: UpdateAccessControlDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.accessControlDBService.update(id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/:id')
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.AccessControl)
  async removeStatisticDocument(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.accessControlDBService.remove(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.AccessControl)
  async getDetailStatisticDocument(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.accessControlDBService.getDetail(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
