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
import { CreateTypeBookDto } from './dtos/create-type-book.dto';
import { UpdateTypeBookDto } from './dtos/update-type-book.dto';
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
import { TypeBookDBService } from '../database/services/typeBookDBService';

@Controller('type-book')
@UseGuards(PermissionsGuard)
export class TypeBookController {
  @Inject(TypeBookDBService)
  typeBookDbService: TypeBookDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async getListTypeBook(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.typeBookDbService.getItems({
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
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async insertTypeBook(
    @Body(new ValidationPipe()) entity: CreateTypeBookDto,
    @Res() res,
  ) {
    const ans = await this.typeBookDbService.insertItem(entity);
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
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async updateTypeBook(
    @Body(new ValidationPipe()) entity: UpdateTypeBookDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.typeBookDbService.updateItem(id, entity);
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
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async removeTypeBook(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.typeBookDbService.removeItem(id);
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
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async getDetailTypeBook(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.typeBookDbService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
