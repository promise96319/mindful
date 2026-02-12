import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Public, CurrentUser } from '../common/decorators';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    res.json({
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    });
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  async login(
    @Body() _dto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { userId } = req.user as { userId: string };
    const result = await this.authService.login(userId);
    this.setRefreshCookie(res, result.refreshToken);
    res.json({
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    });
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.oauthLogin(
      req.user as {
        provider: 'google';
        providerId: string;
        email: string;
        displayName: string;
        photoURL: string;
      },
    );
    this.setRefreshCookie(res, result.refreshToken);
    const frontendUrl = this.configService.get<string>('frontendUrl');
    res.redirect(
      `${frontendUrl}/auth/callback?token=${result.accessToken}`,
    );
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Passport redirects to GitHub
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.oauthLogin(
      req.user as {
        provider: 'github';
        providerId: string;
        email: string;
        displayName: string;
        photoURL: string;
      },
    );
    this.setRefreshCookie(res, result.refreshToken);
    const frontendUrl = this.configService.get<string>('frontendUrl');
    res.redirect(
      `${frontendUrl}/auth/callback?token=${result.accessToken}`,
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'No refresh token' });
      return;
    }
    const result = await this.authService.refreshTokens(refreshToken);
    this.setRefreshCookie(res, result.refreshToken);
    res.json({
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    });
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @CurrentUser('userId') userId: string,
    @Res() res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    res.json({ success: true, data: { message: 'Logged out' } });
  }

  @Get('me')
  async me(@CurrentUser('userId') userId: string) {
    return this.authService.getMe(userId);
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
