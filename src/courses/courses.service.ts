import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User, UserRole } from 'src/users/user.entity';

@Injectable()
export class CoursesService {


  constructor (
      @InjectRepository(Course) private repo: Repository <Course>,

      
  ){}

  //methode async
  async createCourse(attrs: CreateCourseDto, user: User) {
    if (attrs.capacity <= 0){
      throw new BadRequestException("capacité doit être supérieur à 0")
    }

    //patron stratégie selon le rôle
    if (user.role === UserRole.ADMIN){
      attrs.isActive = true; 
    }
    else if (user.role === UserRole.COACH){
      attrs.isActive = false;
    }
    else{
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
  async updateCourse(id: number, attrs: Partial<CreateCourseDto>) {
    const course = await this.repo.findOneBy({ id });
  
    if (!course) {
      throw new NotFoundException('Cours non trouvé');
    }
    
    if (attrs.capacity !== undefined && attrs.capacity <=0){
      throw new BadGatewayException("capacité doit être supérieur à 0")
    }
    Object.assign(course, attrs);
    return await this.repo.save(course);
  }
  

  //methode async
  async deleteCourse(id: number) {
    const course = await this.repo.findOneBy({ id });
  
    if (!course) {
      throw new NotFoundException('Cours non trouvé');
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


