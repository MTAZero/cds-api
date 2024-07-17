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
import { CreateRoleDto } from './dtos/cud-vehicle.dto';
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
import { ManagerVehicleDBService } from '../database/services/managerVehicleDbService';

@Controller('manager-vehicle')
@UseGuards(PermissionsGuard)
export class ManagerVehicleController {
  @Inject(ManagerVehicleDBService)
  managerVehicleDbService: ManagerVehicleDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerVehicle)
  async getListVehicle(
  @Res() res,
  @Req() req,
  @Query() query,
) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  const filter = {};
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.managerVehicleDbService.getItems({
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
  @ModulePermission(SystemFeatures.ManagerVehicle)
  async CRUDVehicle(
    @Body(new ValidationPipe()) entity: CreateRoleDto,
    @Res() res,
  ) {
    const ans = await this.managerVehicleDbService.CURDVehicle(entity.listVehicle);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
