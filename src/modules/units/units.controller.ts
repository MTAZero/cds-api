import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
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
import { UnitDBService } from '../database/services/unitDBService';
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
import { UpdateUnitDto } from './dtos/update-unit.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from '../database/schemas/users.schema';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

@Controller('units')
@UseGuards(PermissionsGuard)
export class UnitsController {
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View])
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

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerUnits)
  async updateUnit(
    @Body(new ValidationPipe()) entity: UpdateUnitDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;

    const ans = await this.unitDBService.updateItem(id, entity);
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

  @Get('/full-tree')
  @UseGuards(JwtAuthGuard)
  async getFullTreeUnit(@Res() res, @CurrentUser() user: User) {
    const id = user?.unit;
    if (!id) throw new NotFoundException();

    const root = await this.unitDBService.getRootOfUnit(id?.toString());
    const ans = await this.unitDBService.getListDescendants(root?._id?.toString());

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
  @ActionsPermission([SystemAction.View])
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
  @ActionsPermission([SystemAction.View])
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
