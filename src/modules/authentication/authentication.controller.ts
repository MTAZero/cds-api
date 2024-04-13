import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserDBService } from '../database/services/userDBService';
import { UpdateInfoDto } from './dtos/update-info.dto';
import { ChangeMyPasswordDto } from './dtos/change-my-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseCode, ResponseMessage } from 'src/const';
import { ApiResponse } from 'src/utils';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('authentication')
export class AuthenticationController {
  @Inject(UserDBService)
  userDBService: UserDBService;

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('login')
  async login(@Res() res, @Req() req) {
    let ans = await this.userDBService.signTokenByUser(req.user);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-info')
  async handleGetMyInfo(@Req() req, @Res() res) {
    let userId: any = req.user.userId;
    let ans = await this.userDBService.getFirstItem({ _id: userId });

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-info')
  @UseInterceptors(FileInterceptor('file'))
  async handleUpdateInfo(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) entity: UpdateInfoDto,
    @UploadedFile() file,
  ) {
    const id = req.user.userId;
    const ans = await this.userDBService.updateItem(id, entity);

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      ans,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-my-password')
  @UseInterceptors(FileInterceptor('file'))
  async handleChangeMyPassword(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) entity: ChangeMyPasswordDto,
  ) {
    const id = req.user.userId;

    const result = await this.userDBService.changePassword(
      id,
      entity.password,
      entity.new_password,
    );

    return ApiResponse(
      res,
      true,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      result,
    );
  }
}
