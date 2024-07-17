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
import { CreateTaskDto } from './dtos/cud-task.dto';
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
import { ManagerTaskDBService } from '../database/services/managerTaskDBService';

@Controller('manager-task')
@UseGuards(PermissionsGuard)
export class ManagerTaskController {
  @Inject(ManagerTaskDBService)
  managerTaskDbService: ManagerTaskDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerTask)
  async getListTask(
  @Res() res,
  @Req() req,
  @Query() query,
) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  const filter = {};
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.managerTaskDbService.getItems({
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
  @ModulePermission(SystemFeatures.ManagerTask)
  async CRUDVehicle(
    @Body(new ValidationPipe()) entity: CreateTaskDto,
    @Res() res,
  ) {
    const ans = await this.managerTaskDbService.CURDTask(entity.listTask);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
