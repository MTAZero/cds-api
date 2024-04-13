import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionDBService } from '../database/services/permissionDbService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { CreatePermissionDto } from './dtos/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  @Inject(PermissionDBService)
  permisisonDBService: PermissionDBService;

  @Get('/')
  async getListPermissions(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.permisisonDBService.getItems({
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
  async insertPermission(
    @Body(new ValidationPipe()) entity: CreatePermissionDto,
    @Res() res,
  ) {
    const ans = await this.permisisonDBService.insertItem(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/:id')
  async removePermission(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.permisisonDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  async getDetailPermission(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.permisisonDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
