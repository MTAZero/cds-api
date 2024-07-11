import { Controller, Get, Inject, Param, Req, Res } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from 'src/const';
import { ApiResponse } from 'src/utils';
import { ProvincesDBService } from '../database/services/cProvincesDBService';
import { DistrictDBService } from '../database/services/cDistrictsDBService';
import { WardsDBService } from '../database/services/cWardsDBServicets';
import { PaginationType } from 'src/middleware';

@Controller('administrative-units')
export class AdministrativeUnitsController {
  @Inject(ProvincesDBService)
  provineFactoryService: ProvincesDBService;

  @Inject(DistrictDBService)
  districtFactoryService: DistrictDBService;

  @Inject(WardsDBService)
  wardFactoryService: WardsDBService;

  @Get('/get-provinces')
  async getProvines(@Res() res, @Req() req) {
    let keyword = req.query.keyword ? req.query.keyword.trim() : '';
    const pagination: PaginationType = req.pagination;

    const data = await this.provineFactoryService.getItems({
      filter: {},
      sort: {},
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

  @Get('/get-districts-by-province/:code')
  async getDistrictsByProvince(@Res() res, @Req() req, @Param() params) {
    let keyword = req.query.keyword ? req.query.keyword.trim() : '';
    let code = params.code;
    const pagination: PaginationType = req.pagination;

    const data = await this.districtFactoryService.getItems({
      filter: {
        parent_code: code,
      },
      sort: {},
      skip: pagination.skip,
      limit: pagination.limit,
      textSearch: keyword,
    });

    // let data = await this.districtFactoryService.getItemsByFilter(
    //   {
    //     parent_code: code,
    //   },
    //   0,
    //   100,
    //   {},
    //   textSearch,
    // );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      data,
    );
  }

  @Get('/get-wards-by-district/:code')
  async getWardsByDistrict(@Res() res, @Req() req, @Param() params) {
    let keyword = req.query.keyword ? req.query.keyword.trim() : '';
    let code = params.code;
    const pagination: PaginationType = req.pagination;

    const data = await this.wardFactoryService.getItems({
      filter: {
        parent_code: code,
      },
      sort: {},
      skip: pagination.skip,
      limit: pagination.limit,
      textSearch: keyword,
    });

    // let data = await this.wardFactoryService.getItemsByFilter(
    //   {
    //     parent_code: code,
    //   },
    //   0,
    //   100,
    //   {},
    //   textSearch,
    // );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      data,
    );
  }
}
