// src/payment/dto/create-payment.dto.ts
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsNumberString, Length, IsInt, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsDateString()
  @IsNotEmpty()
  expiration: string;

  @IsNumberString()
  @Length(3, 3)
  cvv: string;

  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;

  @IsInt()
  groupeId: number;

  @IsInt()
  reservationId: number; 

  @IsNumber()
  @Min(0)
  amount: number; 
}