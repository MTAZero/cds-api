import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Query, Req, Res, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { MonthlyPlanDetailService } from '../database/services/monthly-plan-detail.service';
import { PermissionDBService } from '../database/services/permissionDBService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActionsPermission, ModulePermission } from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { ApiResponse } from 'src/utils';
import { ResponseCode, ResponseMessage } from 'src/const';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { CreateMonthlyPlanDetailDto } from './dtos/CreateMonthlyPlanDetailDto';
import { UpdateMonthlyPlanDetailDto } from './dtos/UpdateMonthlyPlanDetailDto';
import { PaginationType } from 'src/middleware';
import { timestampConfig } from 'src/configs/configuration.config';
import { CommonService } from '../database/services/common.service';

@Controller('monthly-plan-detail')
export class MonthlyPlanDetailController {
    @Inject(MonthlyPlanDetailService)
    service: MonthlyPlanDetailService;

    @Inject(CommonService)
    common: CommonService;

    @Inject(PermissionDBService)
    permissionDBService: PermissionDBService;


    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    @ActionsPermission([SystemAction.Edit])
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async insert(
        @Body(new ValidationPipe()) entity: CreateMonthlyPlanDetailDto,
        @Res() res,
    ) {

        let tong_so_gio= (entity.tuan_1||0)+ (entity.tuan_2||0)+ (entity.tuan_3||0)+ (entity.tuan_4||0)+ (entity.tuan_5||0);
        if(tong_so_gio!= 0){
            if(entity.tong_gio && entity.tong_gio!= tong_so_gio) {
                throw new ForbiddenException();
            }
            entity.tong_gio= tong_so_gio;
        } else {
            if(!entity.tong_gio) throw new ForbiddenException();
            entity.tuan_1= null;
            entity.tuan_2= null;
            entity.tuan_3= null;
            entity.tuan_4= null;
            entity.tuan_5= null;

        }
        const ans = await this.service.insertItem(entity);
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
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async update(
        @Body(new ValidationPipe()) entity: UpdateMonthlyPlanDetailDto,
        @Res() res,
        @Param() params,
    ) {
        const id = params.id;
        let tong_so_gio= (entity.tuan_1||0)+ (entity.tuan_2||0)+ (entity.tuan_3||0)+ (entity.tuan_4||0)+ (entity.tuan_5||0);
        if(tong_so_gio!= 0){
            if(entity.tong_gio && entity.tong_gio!= tong_so_gio) {
                throw new ForbiddenException();
            }
            entity.tong_gio= tong_so_gio;
        } else {
            if(!entity.tong_gio) throw new ForbiddenException();
            entity.tuan_1= null;
            entity.tuan_2= null;
            entity.tuan_3= null;
            entity.tuan_4= null;
            entity.tuan_5= null;

        }
        
        const ans = await this.service.updateItem(id, entity);
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
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async remove(
        @Res() res,
        @Param() params,
        @CurrentUser() user
    ) {
        const id = params.id;
        const ans = await this.service.removeItem(id);
        return ApiResponse(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }

    @Get('/of/:id')
    @ActionsPermission([SystemAction.View])
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async getListOfMonthlyPlan(
        @Res() res,
        @Req() req,
        @Param() params,
        @CurrentUser() user
    ) {

        let filter ={
            $and: [
                {ke_hoach_thang: {"$eq": params.id}}
            ]
        };

        const keyword = '';

        // this.service.getItems

        const data = await this.service.getItems({
            filter,
            sort: {'thu_tu': 1, _id: 1},
            skip: 0,
            limit: Number.MAX_SAFE_INTEGER,
            textSearch: keyword,
        });

        let respData= {
            noi_dung: {},
            thong_ke: {}
        }
        let thongKe= respData.thong_ke;
        let noiDung= respData.noi_dung;
        data.items.forEach(el => {
            let k= el.loai_doi_tuong;
            let tmp= this.common.genDynamicObject(thongKe, k);
            tmp[el.loai_noi_dung]= tmp[el.loai_noi_dung]|| 0;
            tmp[el.loai_noi_dung]+= el.tong_gio;
            k= el.type;
            tmp= this.common.genDynamicObject(noiDung, k);
            tmp.items= tmp.items || [];
            tmp.items.push(el);
        });

        return ApiResponse(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            respData,
        );
    }

    @Get('/:id')
    @ActionsPermission([SystemAction.View])
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async getDetail(
        @Res() res,
        @Param() params
    ) {
        const id = params.id;
        const ans = await this.service.getDetail(id);
        return ApiResponse(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }

    @Get('')
    @ActionsPermission([SystemAction.View])
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async getList(
        @Res() res,
        @Req() req,
        @Query() query,
        @CurrentUser() user
    ) {

        const pagination: PaginationType = req.pagination;
        const sort = req.sort;
        // let from = Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
        // let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;

        let filter = query.ke_hoach_thang? {
            $and: [
                //{ ts: { "$gte": from } },
                //{ ts: { "$lte": to } }
                {ke_hoach_thang: {"$eq": query.ke_hoach_thang}}
            ]
        }: {}

        const keyword = query.keyword ? query.keyword : '';

        const data = await this.service.getItems({
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
}
