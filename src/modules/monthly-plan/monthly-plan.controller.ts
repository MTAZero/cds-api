import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, Res, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { MonthlyPlanService } from '../database/services/monthly-plan.service';
import { ActionsPermission, ModulePermission } from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { PermissionDBService } from '../database/services/permissionDBService';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { PaginationType } from 'src/middleware';
import { timestampConfig } from 'src/configs/configuration.config';
import { ApiResponse } from 'src/utils';
import { ResponseCode, ResponseMessage } from 'src/const';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMonthlyPlanDto } from './dtos/CreateMonthlyPlanDto';
import { UpdateMonthlyPlanDto } from './dtos/UpdateMonthlyPlanDto';

@Controller('monthly-plan')
export class MonthlyPlanController {
    @Inject(MonthlyPlanService)
    service: MonthlyPlanService;

    @Inject(PermissionDBService)
    permissionDBService: PermissionDBService;

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
        let from = Number(query.fromDateTime) ? Number(query.fromDateTime) : timestampConfig().timestamp_2000;
        let to = Number(query.toDateTime) ? Number(query.toDateTime) : timestampConfig().timestamp_2100;

        let filter = {
            // $and: [
            //     { ts: { "$gte": from } },
            //     { ts: { "$lte": to } }
            // ]
        }

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

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    @ActionsPermission([SystemAction.Edit])
    @ModulePermission(SystemFeatures.MonthyPlan)
    async insert(
        @Body(new ValidationPipe()) entity: CreateMonthlyPlanDto,
        @Res() res,
    ) {

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
        @Body(new ValidationPipe()) entity: UpdateMonthlyPlanDto,
        @Res() res,
        @Param() params,
    ) {
        const id = params.id;
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

}
