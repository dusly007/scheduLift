import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from './dtos/create-course.dto'; 

@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService) {}
    //faire les routes des autres méthode
    

  @Post()
  create(@Body() body: CreateCourseDto) {
    return this.coursesService.createCourse(body);
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

    
}
