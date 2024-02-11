import { Module } from '@nestjs/common';
import { UsersModel } from './users.model';

@Module({
  controllers: [],
  providers: [UsersModel],
  exports: [UsersModel],
})
export class UsersModelModule {}
