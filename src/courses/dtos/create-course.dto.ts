import { IsString, IsNumber, IsUrl, MinLength, Min } from 'class-validator';

// validation pour création de cours POST
export class CreateCourseDto {
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
}