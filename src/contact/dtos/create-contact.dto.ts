import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  message: string;
}