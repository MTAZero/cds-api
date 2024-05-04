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
  import { PersonalDiaryDBService } from '../database/services/PersonalDiaryDBService';
  import { CreatePersonalDiaryDto } from './dtos/create-personal-diary.dto';
  import { UpdatePersonalDiaryDto } from './dtos/update-personal-diary.dto';

  @Controller('personal-diary')
  @UseGuards(PermissionsGuard)
  export class PersonalDiaryController {
    @Inject(PersonalDiaryDBService)
    personalDiaryDBService: PersonalDiaryDBService;

  @Get('/:id')
    @ActionsPermission([SystemAction.View])
    @ModulePermission(SystemFeatures.ManagerPersonalDiarys)
    async getPersonalDiaryByID(
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {

    const id = params.id;

    const ans = await this.personalDiaryDBService.getPersonalBookById(user._id, id);

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
  @ModulePermission(SystemFeatures.ManagerPersonalDiarys)
  async insertPermission(
    @Body(new ValidationPipe()) entity: CreatePersonalDiaryDto,
    @Res() res,
    @CurrentUser() user
  ) {
    const ans = await this.personalDiaryDBService.createPersonalBook(user, entity)
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
  @ModulePermission(SystemFeatures.ManagerPersonalDiarys)
  async updatePersonalDiary(
    @Body(new ValidationPipe()) entity: UpdatePersonalDiaryDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.personalDiaryDBService.updatePersonalBook(user._id, id, entity)
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
  