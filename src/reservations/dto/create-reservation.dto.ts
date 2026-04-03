import { IsNumber } from 'class-validator';

export class CreateReservationDto {
    @IsNumber()
    courseId: number;
}