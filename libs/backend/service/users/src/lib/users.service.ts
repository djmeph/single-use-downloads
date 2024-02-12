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
      passwordHash,
    });
    console.log(response);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await pbkdf2(password, salt, 1000, 64, 'sha512');
    return hash.toString('hex');
  }
}
