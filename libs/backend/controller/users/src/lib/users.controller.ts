import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@single-use-downloads/backend-service-users';
import { UserInputDto } from '@single-use-downloads/type-users';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  async create(@Body() body: UserInputDto) {
    await this.usersService.createUser(body.email, body.password);
  }
}
