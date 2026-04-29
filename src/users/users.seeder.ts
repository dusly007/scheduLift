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
        await this.seedCoaches();
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

    async seedCoaches() {
        // 5 coaches pour cours
        const coaches = [
            { email: 'coach.poitrine@schedulift.com', password: 'coach123' },
            { email: 'coach.cardio@schedulift.com',   password: 'coach123' },
            { email: 'coach.yoga@schedulift.com',     password: 'coach123' },
            { email: 'coach.dos@schedulift.com',      password: 'coach123' },
            { email: 'coach.pilates@schedulift.com',  password: 'coach123' },
        ];

        for (const coachInfo of coaches) {
            // hasher mot de passe pour chaque coach
            const salt = randomBytes(8).toString('hex');
            const hash = (await scrypt(coachInfo.password, salt, 32)) as Buffer;
            const password = salt + '.' + hash.toString('hex');

            const coach = this.repo.create({
                email: coachInfo.email,
                password,
                role: UserRole.COACH,
            });

            await this.repo.save(coach);
        }

        console.log('5 coaches créés : coach.xxx@schedulift.com / coach123');
    }
}