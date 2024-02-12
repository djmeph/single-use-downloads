export interface User {
  email: string;
  displayEmail: string;
  passwordHash: string;
  passwordSalt: string;
}

export enum UserItemKeys {
  BASE = 'base',
}
export interface UserItem extends User {
  itemKey: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

export class LoginInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
