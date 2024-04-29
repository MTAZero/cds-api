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
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import { GuardDuttyDBService } from '../database/services/guardDuttyDBService';
import { DuttySettingDBSerivce } from '../database/services/duttySettingDBService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { CreateGuardDuttyDto } from './dtos/create-guard-dutty.dto';
import { UpdateGuardDuttyDto } from './dtos/update-guard-dutty.dto';

@Controller('guard-dutty')
@UseGuards(PermissionsGuard)
export class GuardDuttyController {
  @Inject(GuardDuttyDBService)
  guardDuttyDBService: GuardDuttyDBService;

  @Inject(DuttySettingDBSerivce)
  duttySettingDBService: DuttySettingDBSerivce;

  @Get('/')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getListGuardDutty(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user,
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.guardDuttyDBService.getItems({
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
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async insertGuardDutty(
    @Body(new ValidationPipe()) entity: CreateGuardDuttyDto,
    @Res() res,
  ) {
    const ans = await this.guardDuttyDBService.insertItem(entity);
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
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async updateGuardDutty(
    @Body(new ValidationPipe()) entity: UpdateGuardDuttyDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.guardDuttyDBService.updateItem(id, entity);
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
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async removeGuardDutty(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.guardDuttyDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getDetailGuardDutty(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.guardDuttyDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
