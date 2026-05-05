import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @MinLength(3)
    nom: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsUrl()
    @IsOptional()
    imageUrl: string;
}