import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { UserRole, UserSexe } from 'src/users/user.entity';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsDateString()
  @IsNotEmpty()
  dateNaissance: string;

  @IsEnum(UserSexe)
  @IsNotEmpty()
  sexe: UserSexe;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}