import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';
import { SystemAction, SystemFeatures } from 'src/enums';
import { UserDBService } from 'src/modules/database/services/userDbService';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') {
  @Inject(UserDBService)
  userDBService: UserDBService;

  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const passportActive = await super.canActivate(context);

    if (!passportActive) {
      throw new UnauthorizedException();
    }

    const module: SystemFeatures = this.reflector.get<SystemFeatures>(
      'module',
      context.getHandler(),
    );
    const actions: Array<SystemAction> = this.reflector.get<
      Array<SystemAction>
    >('actions', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = await this.userDBService.getItemById(request.user.userId);
    if (!user) return false;
    request.userId = user._id;
    request.user = user;

    if (!module && !actions) return true;

    const result = await this.userDBService.checkPermission(
      user._id,
      module,
      actions,
    );

    return result;
  }
}
