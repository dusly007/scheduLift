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

    @UseGuards(AuthGuard)
    @Post()
    addToWaitlist(@Body() body: CreateWaitListDto, @CurrentUser() user: User) {
        return this.waitlistService.addToWaitlist(user.id, body.courseId);
    }

    @UseGuards(CoachGuard)
    @Get('/course/:id')
    findWaitlistByCourse(@Param('id') id: string) {
        return this.waitlistService.findWaitlistByCourse(parseInt(id));
    }

    @UseGuards(AuthGuard)
    @Get('/user')
    findMyWaitlist(@CurrentUser() user: User) {
        return this.waitlistService.findWaitlistByUser(user.id);
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    removeFromWaitlist(@Param('id') id: string) {
        return this.waitlistService.removeFromWaitlist(parseInt(id));
    }
}
