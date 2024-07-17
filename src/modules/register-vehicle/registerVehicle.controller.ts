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
import { RegisterVehicleDBService } from '../database/services/registerVehicleDBService';
import { CreateRegisterVehicleDto } from './dtos/create-register-vehicle.dto';
import { UpdateRegisterVehicleDto } from './dtos/update-register-vehicle.dto';
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
import { convertTimeStampToDateTime } from 'src/utils/time.helper';
import { timestampConfig } from 'src/configs/configuration.config';

@Controller('register-vehicle')
@UseGuards(PermissionsGuard)
export class RegisterVehicleController {
  @Inject(RegisterVehicleDBService)
  registerVehicleDbService: RegisterVehicleDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.RegisterVehicle)
    async getRegisterVehicle(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user
  ) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  let from =  Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
  let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;

  let filter = {
    unit: user.unit,
    $or: [
      { fromDateTime: { "$gte": from }},
      { fromDateTime: { "$lte": to }}
    ]
  }
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.registerVehicleDbService.getRegisterVehicleBelongUnit({
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

@Get('/plan')
@ActionsPermission([SystemAction.View])
@ModulePermission(SystemFeatures.RegisterVehicle)
  async getPlanRegisterVehicle(
  @Res() res,
  @Req() req,
  @Query() query,
  @CurrentUser() user
) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  let unitRegisterVehicle = query.unit ? query.unit : "";
  let fromDatetime =  Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
  let toDatetime = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;

  let filter = {}

  if(unitRegisterVehicle){
    filter = {
      unit: user.unit,
      $or: [
        { fromDateTime: { "$gte": fromDatetime }},
        { toDateTime: { "$lte": toDatetime  }}
      ]
    }
  } else {
    filter = {
      $or: [
        { fromDateTime: { "$gte": fromDatetime }},
        { toDateTime: { "$lte": toDatetime }}
      ]
    }
  }

  const keyword = query.keyword ? query.keyword : '';

  const data = await this.registerVehicleDbService.getRegisterVehicleBelongUnit({
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
  @ModulePermission(SystemFeatures.RegisterVehicle)
  async insertRegisterVehicle(
    @Body(new ValidationPipe()) entity: CreateRegisterVehicleDto,
    @Res() res,
    @CurrentUser() user
  ) {
    
    const ans = await this.registerVehicleDbService.insert(user.unit, entity);
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
  @ModulePermission(SystemFeatures.RegisterVehicle)
  async updateRegisterVehicle(
    @Body(new ValidationPipe()) entity: UpdateRegisterVehicleDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.registerVehicleDbService.update(user.unit, id, entity);
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
  @ModulePermission(SystemFeatures.RegisterVehicle)
  async removeRegisterVehicle(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.registerVehicleDbService.remove(user.unit, id);
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
  @ModulePermission(SystemFeatures.RegisterVehicle)
  async getDetailRegisterVehicle(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.registerVehicleDbService.getDetail(user.unit, id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
