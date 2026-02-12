import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('github.clientId')!,
      clientSecret: configService.get<string>('github.clientSecret')!,
      callbackURL: configService.get<string>('github.callbackURL')!,
      scope: ['user:email'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      displayName: string;
      username: string;
      emails?: { value: string }[];
      photos?: { value: string }[];
    },
    done: (err: Error | null, user?: Record<string, unknown>) => void,
  ): void {
    done(null, {
      provider: 'github' as const,
      providerId: profile.id,
      email: profile.emails?.[0]?.value || '',
      displayName: profile.displayName || profile.username,
      photoURL: profile.photos?.[0]?.value || '',
    });
  }
}
