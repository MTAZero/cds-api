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
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ResponseCode, ResponseMessage } from 'src/const';
  import { ApiResponse } from 'src/utils';
  import { PaginationType } from 'src/middleware';
  import { PermissionsGuard } from '../authentication/guards/permission.guard';
  import {
    ActionsPermission,
    ModulePermission,
  } from 'src/decorator/module-action.decorator';
  import { SystemAction, SystemFeatures } from 'src/enums';
  import { CurrentUser } from 'src/decorator/current-user.decorator';
  import { CreateMeetingBookDto } from './dtos/create-meeting-book.dto';
  import { UpdateMeetingBookDto} from './dtos/update-meeting-book.dto';
  import { MeetingBookDBService } from '../database/services/meetingBookDBService';

  @Controller('meeting-book')
  @UseGuards(PermissionsGuard)
  export class MeetingBookController {
    @Inject(MeetingBookDBService)
    meetingBookService: MeetingBookDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.MeetingBook)
  async getListMeetingBook(
    @Res() res, 
    @Req() req, 
    @Query() query,
    @CurrentUser() user
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    let filter = {};
    const keyword = query.keyword ? query.keyword : '';
    const meetingUnitID = query.unit ? query.unit : '';
    
    filter = {
      unit: meetingUnitID
    }
    const data = await this.meetingBookService.getListMeetingBook(user.unit, meetingUnitID, {
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

  @Get('/:id')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.MeetingBook)
  async getMeetingBookById(
    @Res() res,
    @Param() params,
    @CurrentUser() user
) {

    const id = params.id;
    
    const ans = await this.meetingBookService.getDetail(user.unit, id);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans
    );
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.MeetingBook)
  async insertMeetingBook(
    @Body(new ValidationPipe()) entity: CreateMeetingBookDto,
    @Res() res,
    @CurrentUser() user
) {
    const ans = await this.meetingBookService.insert(user.unit, entity)
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
  @ModulePermission(SystemFeatures.MeetingBook)
  async updateMeetingBook(
    @Body(new ValidationPipe()) entity: UpdateMeetingBookDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.meetingBookService.update(user.unit, id, entity)
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
  @ModulePermission(SystemFeatures.MeetingBook)
  async delete(
    @Res() res,
    @Param() params,
    @CurrentUser() user
) {

    const id = params.id;
    
    const ans = await this.meetingBookService.delete(user.unit, id);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans
    );
  }
}
  