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
import { UnitDBService } from '../database/services/unitDbService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';

@Controller('units')
@UseGuards(PermissionsGuard)
export class UnitsController {
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Get('/')
  @ActionsPermission([SystemAction.Edit, SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerUnits)
  async getListUnits(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.unitDBService.getItems({
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
  @ModulePermission(SystemFeatures.ManagerUnits)
  async insertUnit(
    @Body(new ValidationPipe()) entity: CreateUnitDto,
    @Res() res,
  ) {
    const ans = await this.unitDBService.insertItem(entity);
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
  @ModulePermission(SystemFeatures.ManagerUnits)
  async removeUnit(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.unitDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  @ActionsPermission([SystemAction.Edit, SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerUnits)
  async getDetailUnit(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.unitDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/child/:id')
  @ActionsPermission([SystemAction.Edit, SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerUnits)
  async getListChild(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.unitDBService.getListChild(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/descendants/:id')
  @ActionsPermission([SystemAction.Edit, SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerUnits)
  async getDescendantsUnit(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.unitDBService.getListDescendants(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
