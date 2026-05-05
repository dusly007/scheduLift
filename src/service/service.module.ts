import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceSeeder } from './service.seeder'; 

@Module({
    imports: [TypeOrmModule.forFeature([Service])],
    providers: [ServiceService, ServiceSeeder],
    controllers: [ServiceController],
    exports: [ServiceService, ServiceSeeder] // pour les seeders
})
export class ServiceModule {}