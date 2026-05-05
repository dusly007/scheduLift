import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service) private repo: Repository<Service>,
    ) {}

    // créer un service — admin seulement
    async createService(attrs: CreateServiceDto) {
        const service = this.repo.create(attrs);
        return await this.repo.save(service);
    }

    // tous les services
    findAllServices() {
        return this.repo.find({ relations: ['courses'] });
    }

    // service par id
    async findServiceById(id: number) {
        const service = await this.repo.findOne({
            where: { id },
            relations: ['courses']
        });
        if (!service) {
            throw new NotFoundException('Service non trouvé');
        }
        return service;
    }

    // modifier un service — admin seulement
    async updateService(id: number, attrs: Partial<CreateServiceDto>) {
        const service = await this.repo.findOneBy({ id });
        if (!service) {
            throw new NotFoundException('Service non trouvé');
        }
        Object.assign(service, attrs);
        return await this.repo.save(service);
    }

    // supprimer un service — admin seulement
    async deleteService(id: number) {
        const service = await this.repo.findOneBy({ id });
        if (!service) {
            throw new NotFoundException('Service non trouvé');
        }
        await this.repo.remove(service);
        return { message: 'Service supprimé avec succès' };
    }
}