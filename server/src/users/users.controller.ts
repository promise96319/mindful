import { Controller, Get, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return null;
    return this.usersService.toPublicUser(user);
  }

  @Patch('me/settings')
  async updateSettings(
    @CurrentUser('userId') userId: string,
    @Body() settings: Record<string, unknown>,
  ) {
    const user = await this.usersService.updateSettings(userId, settings);
    if (!user) return null;
    return this.usersService.toPublicUser(user);
  }
}
