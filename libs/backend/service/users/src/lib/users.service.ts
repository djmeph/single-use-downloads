import { Injectable } from '@nestjs/common';
import { UsersModel } from '@single-use-downloads/backend-model-users';
import { UserItem } from '@single-use-downloads/type-users';
import * as crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

@Injectable()
export class UsersService {
  private maxLoginAttempts = 10;
  private lockTime = 60 * 1; // 1 minute lockout

  constructor(private usersModel: UsersModel) {}

  public async createUser(email: string, password: string) {
    const passwordHash = await this.hashPassword(password);
    const response = await this.usersModel.put({
      displayEmail: email,
      email: email.toLowerCase(),
      passwordHash: passwordHash.hash,
      passwordSalt: passwordHash.salt,
    });
    return response;
  }

  public async login(email: string, password: string): Promise<UserItem> {
    const user = await this.usersModel.getOneByEmail(email);
    if (!user) {
      throw Error('User not found');
    }
    if (user.lockUntil) {
      const now = new Date();
      const lockUntil = new Date(user.lockUntil);
      if (now < lockUntil) {
        throw Error('User locked out');
      }
    }
    const passwordHash = await this.hashPassword(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash.hash) {
      await this.increaseLoginAttempts(user.email);
      throw Error('Password does not match');
    }

    await this.resetLoginAttempts(user.email);

    return user;
  }

  private async hashPassword(
    password: string,
    salt?: string
  ): Promise<{ hash: string; salt: string }> {
    const saltUsed = salt ? salt : crypto.randomBytes(16).toString('hex');
    const hash = await pbkdf2(password, saltUsed, 1000, 64, 'sha512');
    return { hash: hash.toString('hex'), salt: saltUsed };
  }

  private async increaseLoginAttempts(email: string) {
    const user = await this.usersModel.getOneByEmail(email);
    if (!user) return;

    if (user.lockUntil) {
      const now = new Date();
      const lockTime = new Date(user.lockUntil);
      if (lockTime < now) {
        // Lockout expired
        await this.usersModel.update(user.email, {
          loginAttempts: 1,
          lockUntil: null,
        });
        return;
      }
    } else {
      // User not locked out
      const loginAttempts = user.loginAttempts ? user.loginAttempts + 1 : 1;
      let lockUntil: string | null = null;

      if (loginAttempts >= this.maxLoginAttempts) {
        // Set lockout time
        const now = new Date();
        const lockTime = new Date(now);
        lockTime.setSeconds(now.getSeconds() + this.lockTime);
        lockUntil = lockTime.toISOString();
      }

      await this.usersModel.update(user.email, {
        loginAttempts,
        lockUntil,
      });
    }
  }

  private async resetLoginAttempts(email: string) {
    await this.usersModel.update(email, {
      loginAttempts: 0,
      lockUntil: null,
    });
  }
}
