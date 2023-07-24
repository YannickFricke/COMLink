import { inject, injectable } from 'inversify';
import { BaseService } from './BaseService';
import { Contact } from '@comlink/framework/dist/entity/Contact';
import { Connection, Repository } from 'typeorm';
import { User } from '@comlink/framework/dist/entity/User';
import { UserService } from './UserService';
import { MessageRepository } from '@comlink/framework/dist/entity/repositories/MessageRepository';
import { Message } from '@comlink/framework/dist/entity/Message';

@injectable()
export class ContactService extends BaseService<Contact> {
    private contactRepository: Repository<Contact>;

    @inject(UserService)
    private userService!: UserService;

    private messageRepository!: MessageRepository;

    constructor(
        @inject(Connection) connection: Connection,
    ) {
        super();
        this.contactRepository = connection.getRepository(Contact);
        this.messageRepository = connection.getCustomRepository(MessageRepository);
    }

    async getAllContacts() {
        return this.contactRepository.find({
            relations: [
                'owner',
            ],
        });
    }

    async getContactsForUser(userId: string) {
        return this.contactRepository.find({
            where: {
                owner: {
                    id: userId,
                },
            },
            relations: [
                'owner',
            ],
        });
    }

    async getContactByName(name: string) {
        return this.contactRepository.findOne({
            where: {
                name,
            },
            relations: [
                'owner',
            ],
        });
    }

    async addNewContact(name: string, owner: User) {
        const user = await this.userService.getSingleUser(owner.id);

        const contact = new Contact();
        contact.name = name;
        contact.owner = user;

        await this.contactRepository.insert(contact);

        return contact;
    }

    async editContact(
        contactId: string,
        contactName: string,
    ): Promise<{
        contact: Contact,
        updatedMessages: Message[],
    }> {
        const contact = await this.contactRepository.findOne({
            where: {
                id: contactId,
            },
            relations: [
                'owner',
            ],
        });

        if (contact === undefined) {
            throw new Error('Contact not found');
        }

        const { name: oldName } = contact;

        contact.name = contactName;

        const savedContact = await this.contactRepository.save(contact);

        const updatedMessages = await this.setNewName(oldName, contactName);

        return {
            contact: savedContact,
            updatedMessages,
        };
    }

    async deleteContact(contactId: string) {
        const contact = await this.contactRepository.findOne({
            where: {
                id: contactId,
            },
        });

        if (contact === undefined) {
            throw new Error('Contact not found');
        }

        await this.contactRepository.remove(contact);
    }

    async setNewName(oldName: string, newName: string) {
        const allMessages = await this.messageRepository.find();

        const byRecipient = allMessages.filter(message => message.recipient === oldName);
        const bySender = allMessages.filter(message => message.sender === oldName);

        const newRecipients = byRecipient.map(message => ({
            ...message,
            recipient: newName,
        }));
        const newSenders = bySender.map(message => ({
            ...message,
            sender: newName,
        }));

        return await this.messageRepository.save(
            newRecipients.filter(
                entry => !bySender.includes(entry)).concat(
                newSenders.filter(
                    entry => !byRecipient.includes(entry),
                ),
            ),
        );
    }
}
