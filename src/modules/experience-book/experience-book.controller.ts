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
  import { CreateExperienceBookDto } from './dtos/create-experience-book.dto';
  import { UpdateExperienceBookDto} from './dtos/update-experience-book.dto';
  import { ExperienceBookDBService } from '../database/services/experienceBookDBService';

  @Controller('experience-book')
  @UseGuards(PermissionsGuard)
  export class ExperienceController {
    @Inject(ExperienceBookDBService)
    experienceBookService: ExperienceBookDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerExperiences)
  async getListExperienceBook(
    @Res() res, 
    @Req() req, 
    @Query() query,
    @CurrentUser() user
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';
    const bookUnitID = query.unit ? query.unit : '';

    const data = await this.experienceBookService.getListExperienceBook(user.unit, bookUnitID,{
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
  @ModulePermission(SystemFeatures.ManagerExperiences)
  async getExperienceBookById(
    @Res() res,
    @Param() params,
    @CurrentUser() user
) {

    const id = params.id;
    
    const ans = await this.experienceBookService.getExperienceBookById(user.unit, id);

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
  @ModulePermission(SystemFeatures.ManagerExperiences)
  async insertExperienceBook(
    @Body(new ValidationPipe()) entity: CreateExperienceBookDto,
    @Res() res,
    @CurrentUser() user
) {
    const ans = await this.experienceBookService.createExprienceBook(user.unit, entity)
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
  @ModulePermission(SystemFeatures.ManagerExperiences)
  async updateExperienceBook(
    @Body(new ValidationPipe()) entity: UpdateExperienceBookDto,
    @Res() res,
    @Param() params,
    @CurrentUser() user
  ) {
    const id = params.id;
    const ans = await this.experienceBookService.updateExperienceBook(user.unit, id, entity)
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
  