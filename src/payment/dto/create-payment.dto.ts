import { IsNotEmpty, IsString, IsDateString, IsNumber, IsNumberString, Length, IsInt, Min } from 'class-validator';

export class CreatePaymentDto {
    // informations de carte
    @IsString()
    @IsNotEmpty()
    cardNumber: string;

    @IsDateString()
    @IsNotEmpty()
    expiration: string;

    @IsNumberString()
    @Length(3, 3)
    cvv: string;

    // groupeId — pour créer la réservation après paiement
    @IsInt()
    groupeId: number;

    // montant — doit correspondre au prix du cours
    @IsNumber()
    @Min(0)
    amount: number;
}