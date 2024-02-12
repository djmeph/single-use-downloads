import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersControllerModule } from '@single-use-downloads/backend-controller-users';

@Module({
  imports: [UsersControllerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
