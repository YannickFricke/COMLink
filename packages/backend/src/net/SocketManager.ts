import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';
import { Contact } from '@comlink/framework/dist/entity/Contact';
import { Message } from '@comlink/framework/dist/entity/Message';
import { inject, injectable } from 'inversify';
import { Socket } from 'socket.io';
import { ContactService } from '../services/ContactService';
import { MessageService } from '../services/MessageService';
import { UserService } from '../services/UserService';

@injectable()
export class SocketManager {
    private readonly connectedClients: Record<string, Socket>;

    @inject(UserService)
    private readonly userService!: UserService;

    @inject(MessageService)
    private readonly messageService!: MessageService;

    @inject(ContactService)
    private readonly contactService!: ContactService;

    constructor() {
        this.connectedClients = {};
    }

    public onConnect(socket: Socket) {
        this.connectedClients[socket.id] = socket;

        socket.on(
            SubscriptionNames.Contacts.Edited,
            async (contact: Contact) => {
                const editedContact = await this.contactService.editContact(
                    contact.id,
                    contact.name,
                );
                this.broadcastEvent(
                    SubscriptionNames.Contacts.Edited,
                    editedContact,
                );
            },
        );

        socket.on(
            SubscriptionNames.Contacts.Deleted,
            async (contactId: string) => {
                await this.contactService.deleteContact(contactId);
                this.broadcastEvent(
                    SubscriptionNames.Contacts.Deleted,
                    contactId,
                );
            },
        );

        socket.on(
            SubscriptionNames.Messages.Added,
            async (sender: string, recipient: string, content: string) => {
                const createdMessage = await this.messageService.insertMessage(
                    sender,
                    recipient,
                    content,
                );

                this.broadcastEvent(
                    SubscriptionNames.Messages.Added,
                    createdMessage,
                );
            },
        );

        socket.on(
            SubscriptionNames.Messages.Edited,
            async (message: Message) => {
                try {
                    const updatedMessage = await this.messageService.editMessage(
                        message,
                    );
                    this.broadcastEvent(
                        SubscriptionNames.Messages.Edited,
                        updatedMessage,
                    );
                } catch (e) {
                }
            },
        );

        socket.on(
            SubscriptionNames.Messages.Deleted,
            async (messageId: string) => {
                if (await this.messageService.removeMessageById(messageId)) {
                    this.broadcastEvent(
                        SubscriptionNames.Messages.Deleted,
                        messageId,
                    );
                }
            },
        );

        socket.on(
            SubscriptionNames.Admin.SetMessageFilter,
            async (filterOptions: string[]) => {
                this.broadcastEvent(SubscriptionNames.Admin.SetMessageFilter, filterOptions);
            },
        );
    }

    public onDisconnect(socket: Socket) {
        delete this.connectedClients[socket.id];
    }

    public async broadcastEvent(eventName: string, ...payload: any[]) {
        Object.keys(this.connectedClients)
              .map((id) => this.connectedClients[id])
              .forEach((socket) => {
                  socket.emit(eventName, payload);
              });
    }
}
