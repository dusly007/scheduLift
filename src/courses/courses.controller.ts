import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dtos/create-course.dto";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/user.entity";

@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService) {}
    //faire les routes des autres méthode

    @Post()
    create(@Body() body: CreateCourseDto, @CurrentUser() user : User) {
      return this.coursesService.createCourse(body, user);
    }

    @Get()
    findAllCourses() {
      return this.coursesService.findAllCourses();
    }
  
    @Get('/:id')
    findCourseById(@Param('id') id: string) {
      return this.coursesService.findCourseById(parseInt(id));
    }
  
    @Patch('/:id')
    updateCourse(@Param('id') id: string, @Body() body: Partial<CreateCourseDto>) {
      return this.coursesService.updateCourse(parseInt(id), body);
    }
  
    @Delete('/:id')
    deleteCourse(@Param('id') id: string) {
      return this.coursesService.deleteCourse(parseInt(id));
    }
    
    //route pour import api
    @Post('/import')
    import() {
        return this.coursesService.importAPi();
    }

    @Patch('/:id/toggle')
    toggleActive(@Param('id') id: string) {
        return this.coursesService.toggleActive(parseInt(id));
    }

    
}
