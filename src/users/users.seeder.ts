import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersSeeder implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
    ) {}

    async onApplicationBootstrap() {
        // vérifier admin existe 
        const adminExists = await this.repo.findOne({
            where: { role: UserRole.ADMIN }
        });

        // si admin existe on fait rien
        if (adminExists) return;

        await this.seedAdmin();
    }

    async seedAdmin() {
        // hasher mot de passe
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt('admin123', salt, 32)) as Buffer;
        const password = salt + '.' + hash.toString('hex');

        const admin = this.repo.create({
            email: 'admin@schedulift.com',
            password,
            role: UserRole.ADMIN,
        });

        await this.repo.save(admin);
        console.log('Admin par défaut créé : admin@schedulift.com / admin123');
    }
}