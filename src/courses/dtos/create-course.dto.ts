import { IsString, IsNumber, IsUrl, MinLength, Min, IsBoolean, IsOptional } from 'class-validator';

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

  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity: number;

  @IsBoolean()
  @IsOptional() // définit par service
  isActive?: boolean;
  
}