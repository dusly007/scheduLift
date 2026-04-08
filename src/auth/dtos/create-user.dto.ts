import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/users/user.entity';

export class CreateUserDto {
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string; 

    @IsEnum(UserRole)
    @IsOptional()
    role : UserRole; 
}