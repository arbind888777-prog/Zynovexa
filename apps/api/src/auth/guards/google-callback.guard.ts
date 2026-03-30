import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { buildApiCallbackUrl, decodeFrontendState } from '../../common/utils/frontend-url';

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ query?: { state?: string | string[] } }>();
    const frontendUrl = decodeFrontendState(request.query?.state);

    return {
      callbackURL: buildApiCallbackUrl(
        frontendUrl,
        '/api/auth/google/callback',
        this.config.get<string>('API_URL') || this.config.get<string>('BACKEND_URL') || undefined,
      ),
    };
  }
}