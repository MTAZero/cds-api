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
    UploadedFile,
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
  import { CreateRelatedDocumentDto } from './dtos/create-document.dto';
  import { RelatedDocumentDBService } from '../database/services/relatedDocumentDBService';
  import { uploadFileOption } from 'src/const';

  @Controller('document')
  @UseGuards(PermissionsGuard)
  export class RelatedDocumentController {
    @Inject(RelatedDocumentDBService)
    relatedDocumentService: RelatedDocumentDBService;

  @Get('/')
  @ActionsPermission([SystemAction.View])
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async getListDocuments(
    @Res() res, 
    @Req() req, 
    @Query() query,
    @CurrentUser() user
  ) {
    const pagination: PaginationType = req.pagination;
    const sort = req.sort;
    const filter = {};
    const keyword = query.keyword ? query.keyword : '';

    const data = await this.relatedDocumentService.getListDocuments({
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
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async getDocumentByID(
    @Res() res,
    @Param() params,
    @CurrentUser() user
) {

    const id = params.id;
    
    const ans = await this.relatedDocumentService.getContentDocument(id);
    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans
    );
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file', uploadFileOption))
  @ActionsPermission([SystemAction.Edit])
  @ModulePermission(SystemFeatures.ManagerDocuments)
  async insertDocument(
    @Body(new ValidationPipe()) entity: CreateRelatedDocumentDto,
    @Res() res,
    @CurrentUser() user,
    @UploadedFile() file,
) {
    const userID = user._id;

    let document = {
      user: userID,
      name: entity.name,
      type: entity.type,
      url: file ? file.filename : null
    }

    const ans = await this.relatedDocumentService.insertItem(document);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }
}
  