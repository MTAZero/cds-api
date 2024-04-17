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
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ResponseCode, ResponseMessage } from 'src/const';
  import { ApiResponse } from 'src/utils';
  import { PositionDBService } from '../../database/services/positionDBService';
  import { PaginationType } from 'src/middleware';
  import { CreatePositionDto } from './dtos/create-position.dto';
  import { UpdatePositionDto } from './dtos/update-position.dto';
  import { PermissionsGuard } from '../../authentication/guards/permission.guard';
  import {
    ActionsPermission,
    ModulePermission,
  } from 'src/decorator/module-action.decorator';
  import { SystemAction, SystemFeatures } from 'src/enums';

  
  @Controller('positions')
  @UseGuards(PermissionsGuard)
  export class PositionsController {
    @Inject(PositionDBService)
    positionDBService: PositionDBService;
  
    @Get('/')
    @ActionsPermission([SystemAction.View, SystemAction.Edit])
    @ModulePermission(SystemFeatures.ManagerPositions)
    async getListPosition(@Res() res, @Req() req, @Query() query) {
      const pagination: PaginationType = req.pagination;
      const sort = req.sort;
      const filter = {};
      const keyword = query.keyword ? query.keyword : '';
  
      const data = await this.positionDBService.getItems({
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
    @ModulePermission(SystemFeatures.ManagerPositions)
    async insertPosition(
      @Body(new ValidationPipe()) entity: CreatePositionDto,
      @Res() res,
    ) {
      const ans = await this.positionDBService.insertItem(entity);
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
    @ModulePermission(SystemFeatures.ManagerPositions)
    async updateUser(
      @Body(new ValidationPipe()) entity: UpdatePositionDto,
      @Res() res,
      @Param() params,
    ) {
      const id = params.id;
      const ans = await this.positionDBService.updateItem(id, entity);
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
    @ModulePermission(SystemFeatures.ManagerPositions)
    async removeUser(@Res() res, @Param() params) {
      const id = params.id;
      const ans = await this.positionDBService.removeItem(id);
      return ApiResponse(
        res,
        true,
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        ans,
      );
    }
  }
  