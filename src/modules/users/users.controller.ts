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
import { ResponseCode, ResponseMessage } from 'src/const';
import { ApiResponse } from 'src/utils';
import { UserDBService } from '../database/services/userDBService';
import { PaginationType } from 'src/middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { CurrentUser } from 'src/decorator/current-user.decorator';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  @Inject(UserDBService)
  userDBService: UserDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerUsers)
  async getListUsers(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user,
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.userDBService.getItemsByScope(user._id, {
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

  @Get('/unit/:unitId')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerUsers)
  async getListUsersOfUnit(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user,
    @Param('unitId') unitId,
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {
      isPersonal: true,
    };
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.userDBService.getUserOfUnitByScope(
      user._id,
      unitId,
      {
        filter,
        sort,
        skip: pagination.skip,
        limit: pagination.limit,
        textSearch: keyword,
      },
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      data,
    );
  }

  @Get('/unit-tree/:unitId')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerUsers)
  async getListUsersOfUnitTree(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user,
    @Param('unitId') unitId,
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = { isPersonal: true };
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.userDBService.getUserOfUnitTreeByScope(
      user._id,
      unitId,
      {
        filter,
        sort,
        skip: pagination.skip,
        limit: pagination.limit,
        textSearch: keyword,
      },
    );

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
  @ModulePermission(SystemFeatures.ManagerUsers)
  async insertUser(
    @Body(new ValidationPipe()) entity: CreateUserDto,
    @Res() res,
  ) {
    const ans = await this.userDBService.insertItem(entity);
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
  @ModulePermission(SystemFeatures.ManagerUsers)
  async updateUser(
    @Body(new ValidationPipe()) entity: UpdateUserDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.userDBService.updateItem(id, entity);
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
  @ModulePermission(SystemFeatures.ManagerUsers)
  async removeUser(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.userDBService.removeItem(id);
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
  @ModulePermission(SystemFeatures.ManagerUsers)
  async getDetailUser(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.userDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
