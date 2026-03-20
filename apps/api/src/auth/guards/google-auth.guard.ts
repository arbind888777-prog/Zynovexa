import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { encodeFrontendState } from '../../common/utils/frontend-url';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ query?: { frontend?: string | string[] } }>();
    const frontendParam = Array.isArray(request.query?.frontend)
      ? request.query?.frontend[0]
      : request.query?.frontend;
    const state = encodeFrontendState(frontendParam);

    if (!state) {
      return undefined;
    }

    return { state };
  }
}