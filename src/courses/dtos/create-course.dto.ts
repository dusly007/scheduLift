import { IsString, IsUrl, MinLength, IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';

// validation pour création de cours POST
export class CreateCourseDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    bodyPart: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsUrl()
    @IsOptional()
    gifUrl: string;

    @IsBoolean()
    @IsOptional() // définit par service
    isActive?: boolean;

    @IsString()
    @IsOptional()
    niveau: string;

    @IsNumber()
    @IsOptional()
    serviceId: number;

    // coachName — assigné automatiquement selon le rôle
    @IsString()
    @IsOptional()
    coachName: string;

    // prix du cours
    @IsNumber()
    @Min(0)
    @IsOptional()
    prix: number;

}