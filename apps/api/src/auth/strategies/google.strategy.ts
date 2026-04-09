import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

function getDefaultCallbackUrl(config: ConfigService) {
  const configuredApiUrl = config.get<string>('API_URL') || config.get<string>('BACKEND_URL');

  if (configuredApiUrl) {
    const normalizedApiUrl = configuredApiUrl.replace(/\/api\/?$/, '');
    return `${normalizedApiUrl}/api/auth/google/callback`;
  }

  return 'http://localhost:4000/api/auth/google/callback';
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID') || '';
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET') || '';
    super({
      clientID,
      clientSecret,
      callbackURL: config.get('GOOGLE_CALLBACK_URL') || getDefaultCallbackUrl(config),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      googleId: profile.id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      avatar: photos?.[0]?.value || null,
      accessToken,
    };
    done(null, user);
  }
}
