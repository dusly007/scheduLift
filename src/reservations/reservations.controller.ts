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
    // passer user complet pour validation âge/genre
        return this.reservationsService.createReservation(user.id, body.groupeId, user);
    }


    @UseGuards(AuthGuard)
    @Get('/user')
    findMyReservations(@CurrentUser() user: User) {
        return this.reservationsService.findReservationsByUser(user.id);
    }

    // accessible à tous
    @Get('/places/:groupeId')
    getPlacesRestantes(@Param('groupeId') groupeId: string) {
        return this.reservationsService.getPlacesRestantes(parseInt(groupeId));
    }

    // s'assurer que seulement admin a accès
    @UseGuards(AdminGuard)
    @Get()
    findAllReservations() {
        return this.reservationsService.findAllReservations();
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    cancelReservation(@Param('id') id: string, @CurrentUser() user: User) {
    // passer user pour vérifier si admin
        return this.reservationsService.cancelReservation(parseInt(id), user.id, user);
    }
}