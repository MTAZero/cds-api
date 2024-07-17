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
import { CreateFuelDto } from './dtos/cud-fuel.dto';
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
import { ManagerFuelDBService } from '../database/services/managerFuelDBService';

@Controller('manager-fuel')
@UseGuards(PermissionsGuard)
export class ManagerFuelController {
  @Inject(ManagerFuelDBService)
  managerFuelDbService: ManagerFuelDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerFuel)
  async getListFuel(
  @Res() res,
  @Req() req,
  @Query() query,
) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  const filter = {};
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.managerFuelDbService.getItems({
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
  async CRUDFuel(
    @Body(new ValidationPipe()) entity: CreateFuelDto,
    @Res() res,
  ) {
    const ans = await this.managerFuelDbService.CURDFuel(entity.listFuel);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
