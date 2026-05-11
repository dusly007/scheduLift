import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WaitListService } from './wait-list.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateWaitListDto } from './dtos/create-wait-list.dto';
import { CoachGuard } from 'src/users/guards/coach.guard';

@UseGuards(AuthGuard)
@Controller('wait-list')
export class WaitListController {
    constructor(private waitlistService: WaitListService) {}

    // s'inscrire sur la liste d'attente
    @Post()
    addToWaitlist(@Body() body: CreateWaitListDto, @CurrentUser() user: User) {
        return this.waitlistService.addToWaitlist(user.id, body.groupeId);
    }

    // voir la liste d'attente d'un groupe — coach et admin
    @UseGuards(CoachGuard)
    @Get('/groupe/:id')
    findWaitlistByGroupe(@Param('id') id: string) {
        return this.waitlistService.findWaitlistByGroupe(parseInt(id));
    }

    // voir mes listes d'attente
    @Get('/user')
    findMyWaitlist(@CurrentUser() user: User) {
        return this.waitlistService.findWaitlistByUser(user.id);
    }

    // voir sa position dans la liste d'attente d'un groupe
    @Get('/position/:groupeId')
    getPosition(@Param('groupeId') groupeId: string, @CurrentUser() user: User) {
        return this.waitlistService.getPosition(user.id, parseInt(groupeId));
    }

    // se retirer de la liste d'attente
    @Delete('/:id')
    removeFromWaitlist(@Param('id') id: string) {
        return this.waitlistService.removeFromWaitlist(parseInt(id));
    }
}