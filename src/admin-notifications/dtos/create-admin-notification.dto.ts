import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAdminNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  courseId?: number;

  @IsOptional()
  @IsNumber()
  serviceId?: number;

  @IsOptional()
  @IsNumber()
  waitlistCount?: number;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}