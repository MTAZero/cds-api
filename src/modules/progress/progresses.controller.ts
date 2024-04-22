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
  import { ProgressDBService } from '../database/services/progressDBService';
  import { PaginationType } from 'src/middleware';
  import { CreateProgressDto } from './dtos/create-progress.dto';
  import { UpdateProgressDto } from './dtos/update-progress.dto';
  import { PermissionsGuard } from './../authentication/guards/permission.guard';
  import {
    ActionsPermission,
    ModulePermission,
  } from 'src/decorator/module-action.decorator';
  import { SystemAction, SystemFeatures } from 'src/enums';
  import { CurrentUser } from 'src/decorator/current-user.decorator';
  import { UserDBService } from '../database/services/userDbService';

  
  @Controller('progresses')
  @UseGuards(PermissionsGuard)
  export class ProgressController {
    @Inject(ProgressDBService)
    progressDBService: ProgressDBService;
    
    @Inject(UserDBService)
    userDBService: UserDBService;

    @Get('get-of-week/:unit/:year/:month/:week')
    @ActionsPermission([SystemAction.View])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async getProgressOfWeek(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user,
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {
      week: Number(req.params.week),
      month: Number(req.params.month),
      year: Number(req.params.year),
      unit: req.params.unit
    };
    const keyword = query.keyword ? query.keyword : '';
    console.log(keyword)
    const data = await this.progressDBService.getProgressOfWeekBelongUnit(user.unit, {
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
    @ActionsPermission([SystemAction.Edit])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async insertProgress(
      @Body(new ValidationPipe()) entity: CreateProgressDto,
      @Res() res,
    ) {
      const ans = await this.progressDBService.insertItem(entity);
      return ApiResponse(
        res,
        true,
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        ans,
      );
    }
  
    @Put('/:id')
    @ActionsPermission([SystemAction.Edit])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async updateProgress(
      @Body(new ValidationPipe()) entity: UpdateProgressDto,
      @Res() res,
      @Param() params,
    ) {
      const id = params.id;
      const ans = await this.progressDBService.updateItem(id, entity);
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
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async removeProgress(@Res() res, @Param() params) {
      const id = params.id;
      const ans = await this.progressDBService.removeItem(id);
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
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async getDetailUnit(
      @Res() res, 
      @Param() params,
      @CurrentUser() user
    ) {
      const id = params.id;
      const ans = await this.progressDBService.getDetailByID(user.unit, id);
      return ApiResponse(
        res,
        true,
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        ans,
      );
    }

  }
  