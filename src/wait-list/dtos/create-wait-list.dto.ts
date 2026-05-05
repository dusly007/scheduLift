import { IsNumber } from 'class-validator';

export class CreateWaitListDto {
    @IsNumber()
    groupeId: number;
}