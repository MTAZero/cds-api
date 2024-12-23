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
import { CreateGiaoAnDto } from './dtos/create-giao-an.dto';
import { UpdateGiaoAnDto } from './dtos/update-giao-an.dto';
import { CreateKeHoachThongQuaGiaoAnDto } from './dtos/create-kehoach-thongqua-giaoan.dto';
import { UpdateKeHoachThongQuaGiaoAnDto } from './dtos/update-kehoach-thongqua-giaoan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { GiaoAnDBService } from '../database/services/huan_luyen/GiaoAnDBService';
import { KeHoachThongQuaGiaoAnDBService } from '../database/services/huan_luyen/KeHoachThongQuaGiaoAnDBService';

@Controller('huan-luyen')
@UseGuards(PermissionsGuard)
export class HuanLuyenController {
  @Inject(GiaoAnDBService)
  giaoAnDbService: GiaoAnDBService;

  @Inject(KeHoachThongQuaGiaoAnDBService)
  keHoachDbService: KeHoachThongQuaGiaoAnDBService;

  // Các hàm liên quan đến GiaoAn
  @Get('/giao-an/:id')
  @ActionsPermission([SystemAction.View])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async getGiaoAnDetail(@Res() res, @Param('id') id: string) {
    const ans = await this.giaoAnDbService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/giao-an')
  @ActionsPermission([SystemAction.View])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async getListGiaoAn(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.giaoAnDbService.getItems({
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

  @Post('/giao-an')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async insertGiaoAn(
    @Body(new ValidationPipe()) entity: CreateGiaoAnDto,
    @Res() res,
  ) {
    const ans = await this.giaoAnDbService.insertItem(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/giao-an/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async updateGiaoAn(
    @Body(new ValidationPipe()) entity: UpdateGiaoAnDto,
    @Res() res,
    @Param('id') id: string,
  ) {
    const ans = await this.giaoAnDbService.updateItem(id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/giao-an/:id')
  @ActionsPermission([SystemAction.Edit])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async removeGiaoAn(@Res() res, @Param('id') id: string) {
    const ans = await this.giaoAnDbService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  // Các hàm liên quan đến KeHoachThongQuaGiaoAn
  @Get('/ke-hoach/:id')
  @ActionsPermission([SystemAction.View])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async getKeHoachDetail(@Res() res, @Param('id') id: string) {
    const ans = await this.keHoachDbService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/ke-hoach')
  @ActionsPermission([SystemAction.View])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async getListKeHoach(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.keHoachDbService.getItems({
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

  @Post('/ke-hoach')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async insertKeHoach(
    @Body(new ValidationPipe()) entity: CreateKeHoachThongQuaGiaoAnDto,
    @Res() res,
  ) {
    const ans = await this.keHoachDbService.insertItem(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/ke-hoach/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async updateKeHoach(
    @Body(new ValidationPipe()) entity: UpdateKeHoachThongQuaGiaoAnDto,
    @Res() res,
    @Param('id') id: string,
  ) {
    const ans = await this.keHoachDbService.updateItem(id, entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/ke-hoach/:id')
  @ActionsPermission([SystemAction.Edit])
  //@ModulePermission(SystemFeatures.ManagerTrainnings)
  async removeKeHoach(@Res() res, @Param('id') id: string) {
    const ans = await this.keHoachDbService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
