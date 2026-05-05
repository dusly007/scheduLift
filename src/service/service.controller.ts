import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AdminGuard } from '../users/guards/admin.guards';

@Controller('services')
export class ServiceController {
    constructor(private serviceService: ServiceService) {}

    // accessible à tous
    @Get()
    findAllServices() {
        return this.serviceService.findAllServices();
    }

    // accessible à tous
    @Get('/:id')
    findServiceById(@Param('id') id: string) {
        return this.serviceService.findServiceById(parseInt(id));
    }

    // admin 
    @UseGuards(AdminGuard)
    @Post()
    createService(@Body() body: CreateServiceDto) {
        return this.serviceService.createService(body);
    }

    // admin 
    @UseGuards(AdminGuard)
    @Patch('/:id')
    updateService(@Param('id') id: string, @Body() body: Partial<CreateServiceDto>) {
        return this.serviceService.updateService(parseInt(id), body);
    }

    // admin 
    @UseGuards(AdminGuard)
    @Delete('/:id')
    deleteService(@Param('id') id: string) {
        return this.serviceService.deleteService(parseInt(id));
    }
}