import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(10)
  @MaxLength(20)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
