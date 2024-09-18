import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
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
import { WorkCalendarDBService } from '../database/services/workCalendarDBService';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { PaginationType } from 'src/middleware';
import { ApiResponse } from 'src/utils';
import { CreateWorkCalendarDto } from './dto/create-work-calendar.dto';
import { UpdateWorkCalendarDto } from './dto/update-work-calendar.dto';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import { WorkCalendarAssignDBService } from '../database/services/workCalendarAssignDBService';
import { User } from '../database/schemas/users.schema';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { Paginate } from 'src/decorator/paginate.decorator';
import { UnitDBService } from '../database/services/unitDBService';
import { UserDBService } from '../database/services/userDBService';

@Controller('work-calendar')
@UseGuards(PermissionsGuard)
export class WorkCalendarController {
  @Inject(WorkCalendarDBService)
  workCalendarDBService: WorkCalendarDBService;

  @Inject(WorkCalendarAssignDBService)
  workCalendarAssignDBService: WorkCalendarAssignDBService;

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.WorkCalendar)
  async getList(@Res() res, @Req() req, @Query() query, @CurrentUser() user) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.workCalendarDBService.getItems({
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
  @ModulePermission(SystemFeatures.WorkCalendar)
  async insertUser(
    @Body(new ValidationPipe()) entity: CreateWorkCalendarDto,
    @Res() res,
  ) {
    const ans = await this.workCalendarDBService.insertItem(entity);

    for (let index = 0; index < entity.assigns.length; index++) {
      const assignItem = entity.assigns[index];
      this.workCalendarAssignDBService.insertItem({
        ...assignItem,
        ...{
          work_calendar: ans._id,
        },
      });
    }

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
  @ModulePermission(SystemFeatures.WorkCalendar)
  async update(
    @Body(new ValidationPipe()) entity: UpdateWorkCalendarDto,
    @Res() res,
    @Param() params,
  ) {
    const id = params.id;
    const ans = await this.workCalendarDBService.updateItem(id, entity);
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
  @ModulePermission(SystemFeatures.WorkCalendar)
  async remove(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.workCalendarDBService.removeItem(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/user/:userId')
  async getWorkCalendarOfUser(
    @Res() res,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Param('userId') userId: string,
  ) {
    let start = 0,
      end = 1000000000000000;

    try {
      if (startTime && endTime) {
        start = parseInt(startTime);
        end = parseInt(endTime);
      }
    } catch {}

    const ans = await this.workCalendarDBService.getCalendarOfUser(
      userId,
      start,
      end,
    );
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/unit/:unitId')
  async getWorkCalendarOfUnit(
    @Res() res,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Param('unitId') unitId: string,
  ) {
    let start = 0,
      end = 1000000000000000;

    try {
      if (startTime && endTime) {
        start = parseInt(startTime);
        end = parseInt(endTime);
      }
    } catch {}

    const ans = await this.workCalendarDBService.getCalendarOfUnit(
      unitId,
      start,
      end,
    );
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/my-calendar')
  @UseGuards(JwtAuthGuard)
  async getWorkCalendarOfUserOrUnit(
    @Res() res,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @CurrentUser() user: User,
  ) {
    let start = 0,
      end = 1000000000000000;

    try {
      if (startTime && endTime) {
        start = parseInt(startTime);
        end = parseInt(endTime);
      }
    } catch {}

    const ans = await this.workCalendarDBService.getCalendarOfUserOrUnit(
      user._id.toString(),
      user.unit.toString(),
      start,
      end,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/find-user')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.WorkCalendar)
  async findUser(
    @Res() res,
    @Paginate() pagination: PaginationType,
    @Query('keyword') keyword: string,
  ) {
    const unit = await this.unitDBService.getFirstItem({
      parent: null,
    });
    if (!unit) throw new NotFoundException();

    const ans = await this.userDBService.findUserInUnitTree(
      unit._id.toString(),
      {
        filter: {},
        skip: pagination.skip,
        limit: pagination.limit,
        textSearch: keyword,
      },
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('/:id')
  @ActionsPermission([SystemAction.View, SystemAction.Edit])
  @ModulePermission(SystemFeatures.WorkCalendar)
  async detail(@Res() res, @Param() params) {
    const id = params.id;
    const ans = await this.workCalendarDBService.getItemById(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
