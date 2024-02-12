import { Module } from '@nestjs/common';
import { UsersModel } from './users.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [UsersModel],
  exports: [UsersModel],
})
export class UsersModelModule {}
