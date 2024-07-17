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
import { CreateVehicleCommandDto } from './dtos/create-vehicle-command.dto';
import { UpdateVehicleCommandDto } from './dtos/update-vehicle-command.dto';
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
import { VehicleCommandDBService } from '../database/services/vehicleCommandDBService';

@Controller('vehicle-command')
@UseGuards(PermissionsGuard)
export class VehicleCommandController {
  @Inject(VehicleCommandDBService)
  vehicleComandDBService: VehicleCommandDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.VehicleCommand)
    async getListVehicleCommand(
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
    $and: [
      { performDateTime: { "$gte": from }},
      { performDateTime: { "$lte": to }}
    ]
  }
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.vehicleComandDBService.getVehicleCommandBelongPerfomDate({
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
  @ModulePermission(SystemFeatures.VehicleCommand)
  async insertVehicleCommand(
    @Body(new ValidationPipe()) entity: CreateVehicleCommandDto,
    @Res() res,
  ) {

    const ans = await this.vehicleComandDBService.insertItem(entity);
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
  @ModulePermission(SystemFeatures.VehicleCommand)
  async updateVehicleCommand(
    @Body(new ValidationPipe()) entity: UpdateVehicleCommandDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.vehicleComandDBService.update(id, entity);
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
  @ModulePermission(SystemFeatures.VehicleCommand)
  async removeVehicleCommand(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.vehicleComandDBService.remove(id);
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
  @ModulePermission(SystemFeatures.VehicleCommand)
  async getDetailVehicleCommand(
    @Res() res, 
    @Param() params
  ) {
    const id = params.id;
    const ans = await this.vehicleComandDBService.getDetail(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
