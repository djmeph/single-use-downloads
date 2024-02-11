import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServiceModule } from '@single-use-downloads/backend-service-users';

@Module({
  imports: [UsersServiceModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}
