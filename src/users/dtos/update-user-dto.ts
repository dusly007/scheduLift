import { IsEmail, IsString, IsOptional } from "class-validator";
export class UpdateUserDto{
    @IsEmail()    
    @IsOptional()
    @IsString()
    email: string;
    
    
    @IsOptional()
    @IsString()
    password: string
}