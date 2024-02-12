import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  UsersService,
} from '@single-use-downloads/backend-service-users';
import { LoginInputDto, UserInputDto } from '@single-use-downloads/type-users';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() body: UserInputDto) {
    try {
      const user = await this.usersService.createUser(
        body.email,
        body.password
      );
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('login')
  async login(@Body() body: LoginInputDto) {
    try {
      const user = await this.usersService.login(body.email, body.password);
      return user;
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }
  }
}
