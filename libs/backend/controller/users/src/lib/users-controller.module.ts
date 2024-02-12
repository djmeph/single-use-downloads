import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServiceModule } from '@single-use-downloads/backend-service-users';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersServiceModule,
    ConfigModule.forRoot(),
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
  controllers: [UsersController],
})
export class UsersControllerModule {}
