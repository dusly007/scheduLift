import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationsController {

    constructor(private reservationsService: ReservationsService) {}

    @Post()
    createReservation(@Body() body: CreateReservationDto, @CurrentUser() user: User) {
        return this.reservationsService.createReservation(user.id, body.courseId);
    }

    //sassurer que seulement admin a accès
    @Get()
    findAllReservations() {
        return this.reservationsService.findAllReservations();
    }

    @Get('/user')
    findMyReservations(@CurrentUser() user: User) {
        return this.reservationsService.findReservationsByUser(user.id);
    }

    @Delete('/:id')
    cancelReservation(@Param('id') id: string) {
        return this.reservationsService.cancelReservation(parseInt(id));
    }


}
