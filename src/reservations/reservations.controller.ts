import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AdminGuard } from 'src/users/guards/admin.guards';

@Controller('reservations')
export class ReservationsController {

    constructor(private reservationsService: ReservationsService) {}

    @UseGuards(AuthGuard)
    @Post()
    createReservation(@Body() body: CreateReservationDto, @CurrentUser() user: User) {
        return this.reservationsService.createReservation(user.id, body.courseId);
    }

    //sassurer que seulement admin a accès
    @UseGuards(AdminGuard)
    @Get()
    findAllReservations() {
        return this.reservationsService.findAllReservations();
    }

    @UseGuards(AuthGuard)
    @Get('/user')
    findMyReservations(@CurrentUser() user: User) {
        return this.reservationsService.findReservationsByUser(user.id);
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    cancelReservation(@Param('id') id: string) {
        return this.reservationsService.cancelReservation(parseInt(id));
    }


}