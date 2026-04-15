import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dtos/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private repo: Repository<Contact>,
  ) {}

  async createContact(attrs: CreateContactDto) {
    if (!attrs.name || attrs.name.trim().length < 3) {
      throw new BadRequestException('Nom invalide');
    }

    if (!attrs.email || !attrs.email.includes('@')) {
      throw new BadRequestException('Email invalide');
    }

    if (!attrs.message || attrs.message.trim().length < 5) {
      throw new BadRequestException('Message trop court');
    }

    const contact = this.repo.create({
      name: attrs.name.trim(),
      email: attrs.email.trim().toLowerCase(),
      message: attrs.message.trim(),
    });

    return await this.repo.save(contact);
  }

  findAllContacts() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findContactById(id: number) {
    const contact = await this.repo.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    return contact;
  }

  async deleteContact(id: number) {
    const contact = await this.repo.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    await this.repo.remove(contact);

    return {
      message: 'message supprimé avec succès',
    };
  }
}