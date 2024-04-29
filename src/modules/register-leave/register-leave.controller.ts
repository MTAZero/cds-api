import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { LeaveRegisterDBService } from '../database/services/leaveRegisterDBService';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import { CreateRegisterDto } from './dtos/create-register-dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from '../database/schemas/users.schema';
import { ResponseCode, ResponseMessage } from 'src/const';
import { ApiResponse } from 'src/utils';
import { RegisterLeaveStatus, SystemAction, SystemFeatures } from 'src/enums';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { TimeRange } from 'src/decorator/time-range.decorator';

@Controller('register-leave')
@UseGuards(PermissionsGuard)
export class RegisterLeaveController {
  @Inject(LeaveRegisterDBService)
  leaveRegisterDBService: LeaveRegisterDBService;

  @Get('/list-register')
  @ModulePermission(SystemFeatures.ManagerRegisterLeave)
  @ActionsPermission([SystemAction.UnitApprove, SystemAction.Approve])
  async getListRegister(
    @Res() res,
    @CurrentUser() user: User,
    @TimeRange() timeRange: { startTime: number; endTime: number },
  ) {
    const ans = await this.leaveRegisterDBService.getRegisterChildUnit(
      user,
      timeRange.startTime,
      timeRange.endTime,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Post('/create-register')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async createRegister(
    @Body(new ValidationPipe()) data: CreateRegisterDto,
    @CurrentUser() user: User,
    @Res() res,
  ) {
    const item = {
      ...data,
      ...{
        time_register: new Date().getTime(),
        user: user._id,
        status: RegisterLeaveStatus.CREATED,
      },
    };

    const ans = await this.leaveRegisterDBService.insertItem(item);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/approve/:id')
  @ModulePermission(SystemFeatures.ManagerRegisterLeave)
  @ActionsPermission([SystemAction.UnitApprove, SystemAction.Approve])
  async approveRegister(
    @Res() res,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const ans = await this.leaveRegisterDBService.approveLeaveReigster(
      user,
      id,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Put('/reject/:id')
  @ModulePermission(SystemFeatures.ManagerRegisterLeave)
  @ActionsPermission([SystemAction.UnitApprove, SystemAction.Approve])
  async rejectRegister(
    @Res() res,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const ans = await this.leaveRegisterDBService.rejectLeaveRegister(user, id);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
