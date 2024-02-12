import { Module } from '@nestjs/common';
import { UsersControllerModule } from '@single-use-downloads/backend-controller-users';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersControllerModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
