import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionsGuard } from '../authentication/guards/permission.guard';
import { TroopDetailDBService } from '../database/services/troopDetailDBService';
import { TroopUnitDBService } from '../database/services/troopUnitDBService';
import {
  ActionsPermission,
  ModulePermission,
} from 'src/decorator/module-action.decorator';
import { SystemAction, SystemFeatures } from 'src/enums';
import { TroopUnitReportDto } from './dtos/troop-unit-report';
import { ResponseCode, ResponseMessage } from 'src/const';
import { ApiResponse } from 'src/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from '../database/schemas/users.schema';

@Controller('troop-report')
@UseGuards(PermissionsGuard)
export class TroopReportController {
  @Inject(TroopDetailDBService)
  troopDetailDBService: TroopDetailDBService;

  @Inject(TroopUnitDBService)
  troopUnitDBService: TroopUnitDBService;

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report])
  async unitReportTroop(
    @Body(new ValidationPipe()) data: TroopUnitReportDto,
    @Res() res,
    @CurrentUser() user: User,
  ) {
    const ans = await this.troopUnitDBService.addReportUnit(
      user,
      data,
    );
    // const ans = data;
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Get('')
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getListUsers(@Res() res, @Req() req, @Query() query) {
    const ans = 'ok';
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
