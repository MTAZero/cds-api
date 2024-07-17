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
import { CreateDeliveryBillDto } from './dtos/create-delivery-bill.dto';
import { UpdateDeliveryBillDto } from './dtos/update-delivery-bill.dto';
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
import { DeliveryBillDBService } from '../database/services/deliveryBillDbService';

@Controller('delivery-bill')
@UseGuards(PermissionsGuard)
export class DeliveryBillController {
  @Inject(DeliveryBillDBService)
  deliveryBillDBService: DeliveryBillDBService;

  @Inject(PermissionDBService)
  permissionDBService: PermissionDBService;

  @Get('')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.DeliveryBill)
    async getListBills(
    @Res() res,
    @Req() req,
    @Query() query,
    @CurrentUser() user
  ) {

  const pagination: PaginationType = req.pagination;
  const sort = req.sort;
  
  let filter = {}
  
  const keyword = query.keyword ? query.keyword : '';

  const data = await this.deliveryBillDBService.getList({
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
  @ModulePermission(SystemFeatures.DeliveryBill)
  async insertBill(
    @Body(new ValidationPipe()) entity: CreateDeliveryBillDto,
    @Res() res,
  ) {

    const ans = await this.deliveryBillDBService.insertItem(entity);
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
  @ModulePermission(SystemFeatures.DeliveryBill)
  async updateBill(
    @Body(new ValidationPipe()) entity: UpdateDeliveryBillDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.deliveryBillDBService.updateItem(id, entity);
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
  @ModulePermission(SystemFeatures.DeliveryBill)
  async removeBill(
    @Res() res, 
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.deliveryBillDBService.removeItem(id);
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
  @ModulePermission(SystemFeatures.DeliveryBill)
  async getBillDetail(
    @Res() res, 
    @Param() params
  ) {
    const id = params.id;
    const ans = await this.deliveryBillDBService.getDetail(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
