import { Injectable } from '@nestjs/common';
import { CreateUser } from './app.interface';
import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

@Injectable()
export class AppService {
  async createUser({ email, password }: CreateUser) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await pbkdf2(password, salt, 1000, 64, 'sha512');
    
  }
}
