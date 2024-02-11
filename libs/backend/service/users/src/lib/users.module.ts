import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModelModule } from '@single-use-downloads/backend-model-users';

@Module({
  imports: [UsersModelModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersServiceModule {}
