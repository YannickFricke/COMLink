import { EntityRepository, Repository } from 'typeorm';
import { Message } from '../Message';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
    async postNewMessage(
        sender: string,
        recipient: string,
        messageContents: string,
    ): Promise<Message> {
        const message = new Message();

        message.sender = sender;
        message.recipient = recipient;
        message.content = messageContents;

        return this.save(message);
    }
}
