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
import { CreateWorkAddressDto } from './dtos/cud-work-address.dto';
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
import { ManagerWorkAddressDBService } from '../database/services/managerWorkAddressDBService';

@Controller('manager-work-address')
@UseGuards(PermissionsGuard)
export class ManagerWorkAddressController {
  @Inject(ManagerWorkAddressDBService)
  managerWorkAddressDbService: ManagerWorkAddressDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerWorkAddress)
  async getListWorkAddress(
  @Res() res,
  @Req() req,
  @Query() query,
) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  const filter = {};
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.managerWorkAddressDbService.getItems({
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
  @ModulePermission(SystemFeatures.ManagerWorkAddress)
  async CRUDWorkAddress(
    @Body(new ValidationPipe()) entity: CreateWorkAddressDto,
    @Res() res,
  ) {
    const ans = await this.managerWorkAddressDbService.CURDWorkAddress(entity.listWorkAddress);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
