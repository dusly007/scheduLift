import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GroupeService } from './groupe.service';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { AuthGuard } from '../auth/guards/auth.guards';
import { CoachGuard } from '../users/guards/coach.guard';
import { AdminGuard } from '../users/guards/admin.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('groupes')
export class GroupeController {
    constructor(private groupeService: GroupeService) {}

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
    updateGroupe(@Param('id') id: string, @Body() body: Partial<CreateGroupeDto>) {
        return this.groupeService.updateGroupe(parseInt(id), body);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id/toggle')
    toggleValide(@Param('id') id: string) {
        return this.groupeService.toggleValide(parseInt(id));
    }

    // coach ou admin
    @UseGuards(CoachGuard)
    @Delete('/:id')
    deleteGroupe(@Param('id') id: string) {
        return this.groupeService.deleteGroupe(parseInt(id));
    }
}