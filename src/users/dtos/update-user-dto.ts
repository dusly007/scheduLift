import { IsEmail, IsString, IsOptional } from "class-validator";
export class UpdateUserDto{
    @IsEmail()    
    @IsOptional()
    @IsString()
    email: string;
    
    @IsEmail()
    @IsOptional()
    @IsString()
    password: string
}