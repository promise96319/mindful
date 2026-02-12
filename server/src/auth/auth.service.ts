import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash,
      totalPracticeSeconds: 0,
      settings: { theme: 'light', language: 'zh-CN' },
    });

    return this.generateTokens(user);
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async login(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.generateTokens(user);
  }

  async oauthLogin(profile: {
    provider: 'google' | 'github';
    providerId: string;
    email: string;
    displayName: string;
    photoURL: string;
  }) {
    const user = await this.usersService.findOrCreateOAuthUser(profile);
    return this.generateTokens(user);
  }

  async refreshTokens(oldRefreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret')!,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.usersService.toPublicUser(user);
  }

  private async generateTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret')!,
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn')! as '7d',
    });

    await this.usersService.updateRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
      user: this.usersService.toPublicUser(user),
    };
  }
}
