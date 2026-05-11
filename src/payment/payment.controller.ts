import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    // seulement les utilisateurs connectés peuvent payer
    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() dto: CreatePaymentDto, @CurrentUser() user: User) {
        return this.paymentService.createPayment(dto, user);
    }
}