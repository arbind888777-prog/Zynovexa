import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID') || '';
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET') || '';

    // Always read GOOGLE_CALLBACK_URL explicitly from .env
    // Dev:  http://localhost:4000/api/auth/google/callback
    // Prod: https://zynovexa.com/api/auth/google/callback
    const callbackURL =
      config.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:4000/api/auth/google/callback';

    super({ clientID, clientSecret, callbackURL, scope: ['email', 'profile'] });
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
