import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const clientID = config.get('GOOGLE_CLIENT_ID') || 'placeholder-client-id';
    const clientSecret = config.get('GOOGLE_CLIENT_SECRET') || 'placeholder-secret';
    super({
      clientID,
      clientSecret,
      callbackURL: config.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/api/auth/google/callback',
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
