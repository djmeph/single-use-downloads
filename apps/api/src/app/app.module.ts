import { Module } from '@nestjs/common';
import { UsersControllerModule } from '@single-use-downloads/backend-controller-users';

@Module({
  imports: [UsersControllerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
