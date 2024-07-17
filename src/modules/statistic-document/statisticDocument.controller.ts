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
import { CreateStatisticDocumentDto } from './dtos/create-statistic-document.dto';
import { UpdateStatisticDocumentDto } from './dtos/update-statistic-document.dto';
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
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { timestampConfig } from 'src/configs/configuration.config';
import { StatisticDocumentBookDBService } from '../database/services/statistic-documentDBService';

@Controller('statistic-document')
@UseGuards(PermissionsGuard)
export class StatisticDocumentController {
  @Inject(StatisticDocumentBookDBService)
  statisticDocumentBookDBService: StatisticDocumentBookDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.StatisticDocument)
    async getStatisticDocument(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user
  ) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  let from =  Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
  let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;
  let unitId = query.unitId;

  let filter = {
    unitId: unitId,
    $or: [
      { created_date: { "$gte": from }},
      { created_date: { "$lte": to }}
    ]
  }
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.statisticDocumentBookDBService.getStatisticDocumentBookBelongUnit(
    user.unit,
    unitId,
    {
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
  @ModulePermission(SystemFeatures.StatisticDocument)
  async insertStatisticDocument(
    @Body(new ValidationPipe()) entity: CreateStatisticDocumentDto,
    @Res() res,
    @CurrentUser() user
  ) {
    
    const ans = await this.statisticDocumentBookDBService.insert(user.unit, entity);
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
  @ModulePermission(SystemFeatures.StatisticDocument)
  async updateStatisticDocument(
    @Body(new ValidationPipe()) entity: UpdateStatisticDocumentDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.statisticDocumentBookDBService.update(user.unit, id, entity);
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
  @ModulePermission(SystemFeatures.StatisticDocument)
  async removeStatisticDocument(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.statisticDocumentBookDBService.remove(user.unit, id);
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
  @ModulePermission(SystemFeatures.StatisticDocument)
  async getDetailStatisticDocument(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.statisticDocumentBookDBService.getDetail(user.unit, id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
