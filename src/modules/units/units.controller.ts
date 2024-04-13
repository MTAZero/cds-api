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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UnitDBService } from '../database/services/unitDbService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { CreateUnitDto } from './dtos/create-unit.dto';

@Controller('units')
export class UnitsController {
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Get('/')
  async getListUnits(@Res() res, @Req() req, @Query() query) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.unitDBService.getItems({
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
  async insertUnit(
    @Body(new ValidationPipe()) entity: CreateUnitDto,
    @Res() res,
  ) {
    const ans = await this.unitDBService.insertItem(entity);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Delete('/:id')
  async removeUnit(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.unitDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  async getDetailUnit(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.unitDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
