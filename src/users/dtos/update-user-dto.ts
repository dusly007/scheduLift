import { IsEmail, IsString, IsOptional, IsDateString, IsEnum } from "class-validator";
import { UserSexe } from "src/users/user.entity";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    prenom?: string;

    @IsOptional()
    @IsString()
    nom?: string;

    @IsOptional()
    @IsDateString()
    dateNaissance?: string;

    @IsOptional()
    @IsEnum(UserSexe)
    sexe?: UserSexe;

    @IsOptional()
    @IsEmail()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}