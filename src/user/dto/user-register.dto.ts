import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  city: string;
}
