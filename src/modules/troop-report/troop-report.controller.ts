import {
  Body,
  Controller,
  ForbiddenException,
  Inject,
  NotFoundException,
  Post,
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
import { TroopUnitGetDetailReportDto } from './dtos/troop-unit-get-detail';
import { getTextOfReport } from 'src/utils/troop-report.helper';
import { UnitDBService } from '../database/services/unitDBService';

@Controller('troop-report')
@UseGuards(PermissionsGuard)
export class TroopReportController {
  @Inject(TroopDetailDBService)
  troopDetailDBService: TroopDetailDBService;

  @Inject(TroopUnitDBService)
  troopUnitDBService: TroopUnitDBService;

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report])
  async unitReportTroop(
    @Body(new ValidationPipe()) data: TroopUnitReportDto,
    @Res() res,
    @CurrentUser() user: User,
  ) {
    const ans = await this.troopUnitDBService.addReportUnit(user, data);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @Post('/get-troop')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getListUsers(
    @Res() res,
    @Body(new ValidationPipe()) data: TroopUnitGetDetailReportDto,
    @CurrentUser() user: User,
  ) {
    if (!user.unit) throw new NotFoundException();
    const ans = await this.troopUnitDBService.getReportDetail(
      user.unit.toString(),
      data,
    );

    const result = {
      ...ans,
      ...{
        text: getTextOfReport(ans),
      },
    };

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      result,
    );
  }

  @Post('/unit-status-report')
  @UseInterceptors(FileInterceptor('file'))
  @ModulePermission(SystemFeatures.TroopReports)
  @ActionsPermission([SystemAction.Report, SystemAction.View])
  async getUnitStatusReport(
    @Res() res,
    @Body(new ValidationPipe()) data: TroopUnitGetDetailReportDto,
    @CurrentUser() user: User,
  ) {
    if (
      !this.unitDBService.checkUnitIsDescenants(
        user.unit.toString(),
        data.unitId.toString(),
      )
    )
      throw new ForbiddenException();

    const ans = await this.troopUnitDBService.getUnitReportStatus(
      data.unitId.toString(),
      data.time,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
