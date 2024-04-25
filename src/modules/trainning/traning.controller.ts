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
  import { PaginationType } from 'src/middleware';
  import { UpdateTrainingDto } from './dtos/update-training.dto';
  import { PermissionsGuard } from '../authentication/guards/permission.guard';
  import {
    ActionsPermission,
    ModulePermission,
  } from 'src/decorator/module-action.decorator';
  import { SystemAction, SystemFeatures } from 'src/enums';
  import { CurrentUser } from 'src/decorator/current-user.decorator';
  import { UserDBService } from '../database/services/userDbService';
  import { TrainingDBService } from '../database/services/trainingDBService';

  
  @Controller('training')
  @UseGuards(PermissionsGuard)
  export class TrainingController {
    @Inject(TrainingDBService)
    trainingDBService: TrainingDBService;
    
    @Inject(UserDBService)
    userDBService: UserDBService;

    @Get('get-of-month')
    @ActionsPermission([SystemAction.View])
    @ModulePermission(SystemFeatures.ManagerTrainnings)
    async getTrainingOfMonth(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user
  ) {

    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    let unitTraining = query.unit
    const filter = {
      month: Number(query.month),
      year: Number(query.year),
      unit: unitTraining
    };
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.trainingDBService.getTrainingOfMonth(user.unit, unitTraining, {
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

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerTrainnings)
  async insertPermission(
    @Body(new ValidationPipe()) entity: UpdateTrainingDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.trainingDBService.updateTraining(user.unit, id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
  