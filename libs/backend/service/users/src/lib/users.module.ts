import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModelModule } from '@single-use-downloads/backend-model-users';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModelModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string | undefined>('AUTH_JWT_SECRET');
        if (!secret) {
          throw Error('AUTH_JWT_SECRET missing');
        }
        return { secret, global: true };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [UsersService, AuthGuard],
  exports: [UsersService, AuthGuard],
})
export class UsersServiceModule {}
