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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { RoleDBService } from '../database/services/roleDBService';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { PermissionDBService } from '../database/services/permissionDbService';

@Controller('roles')
export class RolesController {
  @Inject(RoleDBService)
  roleDbService: RoleDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('/permissions/:id')
  async getPermisisonOfRoles(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.permissionDBService.getPermissionOfRoles(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/')
  async getListRoles(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.roleDbService.getItems({
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
  async insertRole(
    @Body(new ValidationPipe()) entity: CreateRoleDto,
    @Res() res,
  ) {
    const ans = await this.roleDbService.insertItem(entity);
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
  async updateRole(
    @Body(new ValidationPipe()) entity: UpdateRoleDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.roleDbService.updateItem(id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/:id')
  async removeRole(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.roleDbService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  async getDetailRole(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.roleDbService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
