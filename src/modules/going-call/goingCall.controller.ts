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
import { CreateGoingCallDto } from './dtos/create-going-call.dto';
import { UpdateGoingCallDto } from './dtos/update-going-call.dto';
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
import { goingCallDBService } from '../database/services/goingCallDBService';

@Controller('going-call')
@UseGuards(PermissionsGuard)
export class GoingCallController {
  @Inject(goingCallDBService)
  goingCallDbService: goingCallDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.GoingCall)
    async getGoingCall(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user
  ) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  let from =  Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
  let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;

  let filter = {
    $and: [
      { dateTransfer: { "$gte": from }},
      { dateTransfer: { "$lte": to }}
    ]
  }
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.goingCallDbService.getListgoingCall({
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
  @ModulePermission(SystemFeatures.GoingCall)
  async insertGoingCall(
    @Body(new ValidationPipe()) entity: CreateGoingCallDto,
    @Res() res,
  ) {
    
    const ans = await this.goingCallDbService.insert(entity);
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
  @ModulePermission(SystemFeatures.GoingCall)
  async updateGoingCall(
    @Body(new ValidationPipe()) entity: UpdateGoingCallDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.goingCallDbService.update(id, entity);
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
  @ModulePermission(SystemFeatures.GoingCall)
  async removeGoingCall(
    @Res() res, 
    @Param() params
  ) {
    const id = params.id;
    const ans = await this.goingCallDbService.remove(id);

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
  @ModulePermission(SystemFeatures.GoingCall)
  async getDetailGoingCall(
    @Res() res, 
    @Param() params
  ) {
    const id = params.id;
    const ans = await this.goingCallDbService.getDetail(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
