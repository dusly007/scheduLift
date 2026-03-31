import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from "@nestjs/common";
import { CoursesService } from "./courses.service";

@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService) {}
    //faire les routes des autres méthode
    
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
