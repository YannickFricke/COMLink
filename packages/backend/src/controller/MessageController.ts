import { Message } from '@comlink/framework/dist/entity/Message';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    principal,
} from 'inversify-express-utils';
import { Connection, Repository } from 'typeorm';
import { Principal } from '../auth/Principal';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { SocketManager } from '../net/SocketManager';
import { MessageService } from '../services/MessageService';

@controller('/messages')
export class MessageController extends BaseHttpController {
    private readonly messageRepository: Repository<Message>;

    @inject(MessageService)
    private readonly messageService!: MessageService;

    @inject(SocketManager)
    private readonly socketManager!: SocketManager;

    constructor(@inject(Connection) connection: Connection) {
        super();
        this.messageRepository = connection.getRepository(Message);
    }

    @httpGet('/all')
    async getAllMessages() {
        const messages = await this.messageService.getAllMessages();

        return this.json(messages);
    }

    @httpGet('/', AuthMiddleware)
    async getAllMessagesByUser(@principal() principal: Principal) {
        const messages = await this.messageService.getAllMessagesByUser(
            principal.details.id,
        );

        return this.json(messages);
    }
}
