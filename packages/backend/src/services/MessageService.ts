import { Message } from '@comlink/framework/dist/entity/Message';
import { inject, injectable } from 'inversify';
import knex from 'knex';
import { Connection, Repository } from 'typeorm';
import { ContactService } from './ContactService';
import { UserService } from './UserService';

@injectable()
export class MessageService {
    private readonly messageRepository: Repository<Message>;

    @inject(ContactService)
    private contactService!: ContactService;

    @inject(UserService)
    private userService!: UserService;

    constructor(@inject(Connection) connection: Connection) {
        this.messageRepository = connection.getRepository(Message);
    }

    async getAllMessages(): Promise<Message[]> {
        return await this.messageRepository.find();
    }

    async getAllMessagesByUser(userId: string): Promise<Message[]> {
        const user = await this.userService.getSingleUser(userId);
        const all = user.contacts
            .map((contact) => contact.name)
            .concat(user.username);

        let queryBuilder = knex<Message>('').from('message');

        if (!user.isGameMaster) {
            queryBuilder = queryBuilder
                .whereIn('recipient', all.concat('Alle'))
                .or.whereIn('sender', all);
        }

        return await this.messageRepository.query(queryBuilder.toQuery());
    }

    async insertMessage(
        sender: string,
        recipient: string,
        messageContents: string,
    ): Promise<Message> {
        const message = new Message();
        message.sender = sender;
        message.recipient = recipient;
        message.content = messageContents;
        message.timestamp = new Date();

        return await this.messageRepository.save(message);
    }

    async editMessage(message: Message): Promise<Message> {
        const foundMessage = await this.messageRepository.findOne(message.id);

        if (foundMessage === undefined) {
            throw new Error('Message not found');
        }

        foundMessage.sender = message.sender;
        foundMessage.recipient = message.recipient;
        foundMessage.content = message.content;

        await this.messageRepository.save(foundMessage);

        return foundMessage;
    }

    async removeMessageById(messageId: string): Promise<boolean> {
        await this.messageRepository.delete({
            id: messageId,
        });

        return (await this.messageRepository.findOne(messageId)) === undefined;
    }
}
