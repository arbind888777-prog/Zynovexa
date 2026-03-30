import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { buildApiCallbackUrl, encodeFrontendState } from '../../common/utils/frontend-url';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ query?: { frontend?: string | string[] } }>();
    const frontendParam = Array.isArray(request.query?.frontend)
      ? request.query?.frontend[0]
      : request.query?.frontend;
    const state = encodeFrontendState(frontendParam);
    const callbackURL = buildApiCallbackUrl(
      frontendParam,
      '/api/auth/google/callback',
      this.config.get<string>('API_URL') || this.config.get<string>('BACKEND_URL') || undefined,
    );

    return state ? { state, callbackURL } : { callbackURL };
  }
}