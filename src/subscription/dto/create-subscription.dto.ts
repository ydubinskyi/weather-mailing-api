import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SubscriptionDTO {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(10)
  @MaxLength(20)
  email: string;

  @IsNotEmpty()
  city: string;
}
