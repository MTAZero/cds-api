import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Query, Req, Res, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { MonthlyPlanDetailService } from '../database/services/monthly-plan-detail.service';
import { PermissionDBService } from '../database/services/permissionDBService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActionsPermission, ModulePermission } from 'src/decorator/module-action.decorator';
import { LoaiNoiDungHuanLuyenThang, SystemAction, SystemFeatures } from 'src/enums';
import { ApiResponse } from 'src/utils';
import { ResponseCode, ResponseMessage } from 'src/const';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { CreateMonthlyPlanDetailDto } from './dtos/CreateMonthlyPlanDetailDto';
import { UpdateMonthlyPlanDetailDto } from './dtos/UpdateMonthlyPlanDetailDto';
import { PaginationType } from 'src/middleware';
import { timestampConfig } from 'src/configs/configuration.config';
import { CommonService } from '../database/services/common.service';
import { MonthlyPlanService } from '../database/services/monthly-plan.service';

@Controller('monthly-plan-detail')
export class MonthlyPlanDetailController {
    @Inject(MonthlyPlanDetailService)
    service: MonthlyPlanDetailService;

    @Inject(CommonService)
    common: CommonService;

    @Inject(PermissionDBService)
    permissionDBService: PermissionDBService;

    @Inject(MonthlyPlanService)
    monthyPlanService: MonthlyPlanService;


    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    @ActionsPermission([SystemAction.Edit])
    // @ModulePermission(SystemFeatures.MonthyPlan)
    async insert(
        @Body(new ValidationPipe()) entity: CreateMonthlyPlanDetailDto,
        @Res() res,
    ) {

        let tong_so_gio = (entity.tuan_1 || 0) + (entity.tuan_2 || 0) + (entity.tuan_3 || 0) + (entity.tuan_4 || 0) + (entity.tuan_5 || 0);
        if (tong_so_gio != 0) {
            if (entity.tong_gio && entity.tong_gio != tong_so_gio) {
                throw new ForbiddenException();
            }
            entity.tong_gio = tong_so_gio;
        } else {
            if (!entity.tong_gio) throw new ForbiddenException();
            entity.tuan_1 = null;
            entity.tuan_2 = null;
            entity.tuan_3 = null;
            entity.tuan_4 = null;
            entity.tuan_5 = null;

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
        let tong_so_gio = (entity.tuan_1 || 0) + (entity.tuan_2 || 0) + (entity.tuan_3 || 0) + (entity.tuan_4 || 0) + (entity.tuan_5 || 0);
        if (tong_so_gio != 0) {
            if (entity.tong_gio && entity.tong_gio != tong_so_gio) {
                throw new ForbiddenException();
            }
            entity.tong_gio = tong_so_gio;
        } else {
            if (!entity.tong_gio) throw new ForbiddenException();
            entity.tuan_1 = null;
            entity.tuan_2 = null;
            entity.tuan_3 = null;
            entity.tuan_4 = null;
            entity.tuan_5 = null;

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

        const ans = await this.monthyPlanService.getDetail(params.id);

        let filter = {
            $and: [
                { ke_hoach_thang: { "$eq": params.id } },
                // { loai_noi_dung: {'$ne': null} }
            ]
        };

        const keyword = '';

        // this.service.getItems

        const data = await this.service.getItems({
            filter,
            sort: { 'thu_tu': 1, _id: 1 },
            skip: 0,
            limit: Number.MAX_SAFE_INTEGER,
            textSearch: keyword,
        });

        let respData = {
            mo_ta: ans,
            noi_dung: {rows: [], headers: []},
            thong_ke: {rows: [], headers: []}
        }
        let thongKe = {};
        let noiDung = respData.noi_dung;
        let dictLoaiNd= [];
        let dictNd= {
            "stt": "TT",
            "noi_dung": 'NỘI DUNG',
            "tham_gia": "Thành phần tham gia",
            "cap_phu_trach": 'Cấp phụ trách',
            "tong_gio": 'Tổng số (giờ)',
            "tuan_1": 'Tuần 1',
            "tuan_2": 'Tuần 2',
            "tuan_3": 'Tuần 3',
            "tuan_4": 'Tuần 4',
            "tuan5": 'Tuần 5',
            "bien_phap_tien_hanh": 'Biện pháp tiến hành'
        }
        respData.noi_dung.headers= Object.values(dictNd)
        data.items.forEach(el => {
            if (el.loai_noi_dung) {
                if(!dictLoaiNd.includes(el.loai_noi_dung)) dictLoaiNd.push(el.loai_noi_dung)
                thongKe[el.tham_gia] = thongKe[el.tham_gia] || {};
                thongKe[el.tham_gia][el.loai_noi_dung] = thongKe[el.tham_gia][el.loai_noi_dung] || 0;
                thongKe[el.tham_gia][el.loai_noi_dung] += el.tong_gio;
            }
            let item= [];
            for(let i of Object.keys(dictNd)){
                // console.log({i})
                item.push(''+ (el[i]|| ''))
            }
            noiDung.rows.push(item);
        });

        let j= 0;
        for(let e in thongKe){
            let item= [], tong= 0;
            for(let i of dictLoaiNd){
                item.push(''+ (thongKe[e][i]|| ''))
                tong+= (thongKe[e][i]||0);
            }
            item= [''+ (++j), e, ''+ tong].concat(item);
            respData.thong_ke.rows.push(item);

        }
        respData.thong_ke.headers= ['STT', 'Đối tượng', 'Tổng'].concat(dictLoaiNd);

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

        let filter = query.ke_hoach_thang ? {
            $and: [
                //{ ts: { "$gte": from } },
                //{ ts: { "$lte": to } }
                { ke_hoach_thang: { "$eq": query.ke_hoach_thang } }
            ]
        } : {}

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
