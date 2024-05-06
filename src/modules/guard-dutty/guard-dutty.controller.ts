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
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { GuardDuttyPositionDBService } from '../database/services/guardDuttyPostionDBService';
import { CreateGuardDuttyPositionDto } from './dtos/create-guard-dutty-position.dto';
import { UpdateGuardDuttyPositionDto } from './dtos/update-guard-dutty-position.dto';

@Controller('guard-dutty')
@UseGuards(PermissionsGuard)
export class GuardDuttyController {
  @Inject(GuardDuttyPositionDBService)
  guardDuttyPositionDBService: GuardDuttyPositionDBService;

  @Get('/positions')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getListGuardDuttyPosition(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.guardDuttyPositionDBService.getItems({
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

  @Post('/positions')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async insertGuardDuttyPosition(
    @Body(new ValidationPipe()) entity: CreateGuardDuttyPositionDto,
    @Res() res,
  ) {
    const ans = await this.guardDuttyPositionDBService.insertItem(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/positions/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async updateGuardDuttyPosition(
    @Body(new ValidationPipe()) entity: UpdateGuardDuttyPositionDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.guardDuttyPositionDBService.updateItem(id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/positions/:id')
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async removeGuardDuttyPosition(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.guardDuttyPositionDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/positions/:id')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerGuardDutty)
  async getDetailGuardDuttyPosition(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.guardDuttyPositionDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
