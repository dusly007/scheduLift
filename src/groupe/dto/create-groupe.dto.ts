import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean, Min, MinLength } from 'class-validator';

export class CreateGroupeDto {
    @IsString()
    @MinLength(2)
    nom: string;

    @IsNumber()
    courseId: number;

    @IsDateString()
    dateDebut: string;

    @IsDateString()
    dateFin: string;

    @IsNumber()
    @Min(1)
    dureeEnSemaines: number;

    @IsString()
    @IsOptional()
    horaire: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    ageMin: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    ageMax: number;

    @IsString()
    @IsOptional()
    genre: string;

    @IsNumber()
    @Min(1)
    capaciteMax: number;

    @IsString()
    @IsOptional()
    coachName: string;

    @IsBoolean()
    @IsOptional()
    estValide: boolean;
}