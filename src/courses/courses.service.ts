import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User, UserRole } from 'src/users/user.entity';

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course) private repo: Repository<Course>,
    ) {}

    //methode async
    async createCourse(attrs: CreateCourseDto, user: User) {
        //patron stratégie selon le rôle
        if (user.role === UserRole.ADMIN) {
            attrs.isActive = true;
        }
        else if (user.role === UserRole.COACH) {
            attrs.isActive = false;
            // forcer le coachName à l'email du coach connecté
            attrs.coachName = user.email;
        }
        else {
            throw new ForbiddenException('non autorisé')
        }

        const course = this.repo.create(attrs);
        return await this.repo.save(course);
    }

    findAllCourses() {
        return this.repo.find();
    }

    //methode async
    async findCourseById(id: number) {
        const course = await this.repo.findOneBy({ id });

        if (!course) {
            throw new NotFoundException('Cours non trouvé');
        }

        return course;
    }

    //methode async
    async updateCourse(id: number, attrs: Partial<CreateCourseDto>, user: User) {
        const course = await this.repo.findOneBy({ id });

        if (!course) {
            throw new NotFoundException('Cours non trouvé');
        }

        // validation coach — seulement ses propres cours
        if (user.role === UserRole.COACH && course.coachName !== user.email) {
            throw new ForbiddenException('Vous ne pouvez modifier que vos propres cours');
        }

        Object.assign(course, attrs);
        return await this.repo.save(course);
    }

    //methode async
    async deleteCourse(id: number, user: User) {
        const course = await this.repo.findOneBy({ id });

        if (!course) {
            throw new NotFoundException('Cours non trouvé');
        }

        // validation coach — seulement ses propres cours
        if (user.role === UserRole.COACH && course.coachName !== user.email) {
            throw new ForbiddenException('Vous ne pouvez supprimer que vos propres cours');
        }

        await this.repo.remove(course);

        return {
            message: 'course deleted successfully',
        };
    }

    //activer ou désactiver un cours
    async toggleActive(id: number) {
        const course = await this.repo.findOneBy({ id });

        if (!course) {
            throw new NotFoundException('Cours non trouvé');
        }

        course.isActive = !course.isActive;
        return this.repo.save(course);
    }
}
