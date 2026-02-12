import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { UsersModule } from '../users/users.module';

function buildOAuthProviders(): Provider[] {
  const providers: Provider[] = [];
  if (process.env.GOOGLE_CLIENT_ID) {
    providers.push(GoogleStrategy);
  }
  if (process.env.GITHUB_CLIENT_ID) {
    providers.push(GithubStrategy);
  }
  return providers;
}

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret')!,
        signOptions: { expiresIn: config.get<string>('jwt.expiresIn')! as '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, ...buildOAuthProviders()],
})
export class AuthModule {}
