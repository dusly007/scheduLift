import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { GroupeService } from './groupe.service';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { CoachGuard } from '../users/guards/coach.guard';
import { AdminGuard } from '../users/guards/admin.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReservationsService } from '../reservations/reservations.service';

@Controller('groupes')
export class GroupeController {
    constructor(
        private groupeService: GroupeService,
        @Inject(forwardRef(() => ReservationsService))
        private reservationsService: ReservationsService,
    ) {}

    @Get()
    findAllGroupes() {
        return this.groupeService.findAllGroupes();
    }

    @Get('/course/:courseId')
    findGroupesByCourse(@Param('courseId') courseId: string) {
        return this.groupeService.findGroupesByCourse(parseInt(courseId));
    }

    @Get('/:id')
    findGroupeById(@Param('id') id: string) {
        return this.groupeService.findGroupeById(parseInt(id));
    }

    @UseGuards(CoachGuard)
    @Post()
    createGroupe(@Body() body: CreateGroupeDto, @CurrentUser() user: User) {
        return this.groupeService.createGroupe(body, user);
    }

    // coach ou admin
    @UseGuards(CoachGuard)
    @Patch('/:id')
    updateGroupe(@Param('id') id: string, @Body() body: Partial<CreateGroupeDto>, @CurrentUser() user: User) {
        return this.groupeService.updateGroupe(parseInt(id), body, user);
    }

    // toggle — passer le nombre de réservations pour valider la capacité minimum
    @UseGuards(AdminGuard)
    @Patch('/:id/toggle')
    async toggleValide(@Param('id') id: string) {
        const groupeId = parseInt(id);
        const reservations = await this.reservationsService.findAllReservationsByGroupe(groupeId);
        return this.groupeService.toggleValide(groupeId, reservations.length);
    }

    // coach ou admin
    @UseGuards(CoachGuard)
    @Delete('/:id')
    deleteGroupe(@Param('id') id: string, @CurrentUser() user: User) {
        return this.groupeService.deleteGroupe(parseInt(id), user);
    }
}