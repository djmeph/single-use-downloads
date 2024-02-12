import { Injectable } from '@nestjs/common';
import { UsersModel } from '@single-use-downloads/backend-model-users';
import * as crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

@Injectable()
export class UsersService {
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

  public async login(email: string, password: string) {
    const user = await this.usersModel.getOneByEmail(email);
    if (user) {
      const passwordHash = await this.hashPassword(password, user.passwordSalt);
      if (user.passwordHash === passwordHash.hash) {
        return user;
      } else {
        throw Error('Password does not match');
      }
    }
  }

  private async hashPassword(
    password: string,
    salt?: string
  ): Promise<{ hash: string; salt: string }> {
    const saltUsed = salt ? salt : crypto.randomBytes(16).toString('hex');
    const hash = await pbkdf2(password, saltUsed, 1000, 64, 'sha512');
    return { hash: hash.toString('hex'), salt: saltUsed };
  }
}
