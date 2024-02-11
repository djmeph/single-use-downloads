import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
