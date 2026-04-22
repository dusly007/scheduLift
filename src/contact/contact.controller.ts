import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { AdminGuard } from 'src/users/guards/admin.guards';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(@Body() body: CreateContactDto) {
    return this.contactService.createContact(body);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAllContacts() {
    return this.contactService.findAllContacts();
  }

  @UseGuards(AdminGuard)
  @Get('/:id')
  findContactById(@Param('id') id: string) {
    return this.contactService.findContactById(parseInt(id));
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(parseInt(id));
  }
}