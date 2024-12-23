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
import { CreateIncomingCallDto } from './dtos/create-incoming-call.dto';
import { UpdateIncomingCallDto } from './dtos/update-incoming-call.dto';
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
import { IncomingDBService } from '../database/services/incomingCallDBService';

@Controller('incoming-call')
@UseGuards(PermissionsGuard)
export class IncomingCallController {
  @Inject(IncomingDBService)
  incomingCallDbService: IncomingDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.InComingCall)
    async getIncomingCall(
    @Res() res,
    @Req() req,
    @Query() query,
  ) {
  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  let from =  Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
  let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;

  let filter = {
    $and: [
      { dateRead: { "$gte": from }},
      { dateRead: { "$lte": to }}
    ]
  }
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.incomingCallDbService.getListIncomingCall({
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
  @ModulePermission(SystemFeatures.InComingCall)
  async insertIcomingCall(
    @Body(new ValidationPipe()) entity: CreateIncomingCallDto,
    @Res() res,
  ) {
    
    const ans = await this.incomingCallDbService.insert(entity);
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
  @ModulePermission(SystemFeatures.InComingCall)
  async updateGoingCall(
    @Body(new ValidationPipe()) entity: UpdateIncomingCallDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.incomingCallDbService.update(id, entity);
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
  @ModulePermission(SystemFeatures.InComingCall)
  async removeIncomingCall(
    @Res() res, 
    @Param() params
  ) {
    const id = params.id;
    const ans = await this.incomingCallDbService.remove(id);

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
  @ModulePermission(SystemFeatures.InComingCall)
  async getDetailIncomingCall(
    @Res() res, 
    @Param() params
  ) {
    const id = params.id;
    const ans = await this.incomingCallDbService.getDetail(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
