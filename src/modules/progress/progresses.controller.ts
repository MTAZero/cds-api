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
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ResponseCode, ResponseMessage, uploadFileOption } from 'src/const';
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

    @Get('get-of-week')
    @ActionsPermission([SystemAction.View])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async getProgressOfWeek(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    let unitProgress = query.unit
    const filter = {
      week: Number(query.week),
      month: Number(query.month),
      year: Number(query.year),
      unit: unitProgress
    };
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.progressDBService.getProgressOfWeekBelongUnit(user.unit, unitProgress, {
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
    @UseInterceptors(FileInterceptor('file', uploadFileOption))
    @ActionsPermission([SystemAction.Edit])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async insertProgress(
      @Body(new ValidationPipe()) entity: CreateProgressDto,
      @Res() res,
      @CurrentUser() user,
      @UploadedFile() file
    ) {

      let obj = {
        ...entity,
        ...{
          week: Number(entity.week),
          month: Number(entity.month),
          year: Number(entity.year),
          sum_time_train: Number(entity.sum_time_train),
          time_train_detail: JSON.parse(entity.time_train_detail)
        }
      }

      obj = {
        ...obj,
        ...{
          url: file ? file.filename : null
        }
      }

      const ans = await this.progressDBService.insertProgress(user.unit, obj);
      return ApiResponse(
        res,
        true,
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        ans,
      );
    }
  
    @Put('/:id')
    @UseInterceptors(FileInterceptor('file', uploadFileOption))
    @ActionsPermission([SystemAction.Edit])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async updateProgress(
      @Body(new ValidationPipe()) entity: UpdateProgressDto,
      @Res() res,
      @Param() params,
      @CurrentUser() user,
      @UploadedFile() file
    ) {
      const id = params.id;
      
      let obj = {
        ...entity,
        ...{
          week: Number(entity.week),
          month: Number(entity.month),
          year: Number(entity.year),
          sum_time_train: Number(entity.sum_time_train),
          time_train_detail: JSON.parse(entity.time_train_detail)
        }
      }

      obj = {
        ...obj,
        ...{
          url: file ? file.filename : null
        }
      }

      const ans = await this.progressDBService.updateProgress(user.unit, id, obj);
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
    async removeProgress(
      @Res() res, 
      @Param() params,
      @CurrentUser() user,
  ) {
      const id = params.id;
      const ans = await this.progressDBService.deleteProgress(user.unit, id);
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
    async getDetailProgress(
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

    @Get('/:id/list-people')
    @ActionsPermission([SystemAction.View])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async getListPeopleJoin(
      @Res() res, 
      @Param() params,
      @CurrentUser() user
    ) {
      const id = params.id;
      const ans = await this.progressDBService.getListPeopleJoin(user.unit, id);
      return ApiResponse(
        res,
        true,
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        ans,
      );
    }

    @Get('/file/:id')
    @ActionsPermission([SystemAction.View])
    @ModulePermission(SystemFeatures.ManagerProgresses)
    async getFile(
      @Res() res, 
      @Param() params,
      @CurrentUser() user
    ) {
      const id = params.id;

      const ans = await this.progressDBService.getContentFile(id, user.unit);
      return ApiResponse(
        res,
        true,
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        ans,
      );
    }
  }
  