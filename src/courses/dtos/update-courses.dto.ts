import { IsString, IsNumber, IsUrl, MinLength, Min, IsBoolean, IsOptional } from 'class-validator';

// validation pour création de cours POST
export class UpdateCoursesDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  bodyPart: string;

  @IsString()
  description: string;

  @IsUrl()
  gifUrl: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsBoolean()
  @IsOptional() // définit par service
  isActive?: boolean;
  
}