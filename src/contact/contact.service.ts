import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dtos/create-contact.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private repo: Repository<Contact>,
    @InjectRepository(User) private userRepo: Repository<User>, 
    private mailerService: MailerService,
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

    const savedContact = await this.repo.save(contact);

    //  récupérer tous les admins et leurs emails
    const admins = await this.userRepo.find({
      where: { role: UserRole.ADMIN },
    });
    
    
    const adminEmails = admins.map(admin => admin.email);
    
    // envoyer à tous les admins
    await this.mailerService.sendMail({
      to: adminEmails, 
      subject: `Nouveau message de ${savedContact.name}`,
      text: `
    Nom: ${savedContact.name}
    Email du client: ${savedContact.email}
    
    Message:
    ${savedContact.message}
      `,
    });
    
    return savedContact;
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