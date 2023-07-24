import { BaseHttpController, controller, httpGet, httpPost, principal, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { SocketManager } from '../net/SocketManager';
import { Principal } from '../auth/Principal';
import { ContactService } from '../services/ContactService';
import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { Contact } from '@comlink/framework/dist/entity/Contact';

@controller('/contacts', AuthMiddleware)
export class ContactController extends BaseHttpController {
    @inject(ContactService)
    private contactService!: ContactService;

    @inject(SocketManager)
    private socketManager!: SocketManager;

    @httpGet('/')
    async getAllContacts(
        @principal() principal: Principal,
    ) {
        let contacts: Contact[];

        if (!principal.details.isGameMaster) {
            contacts = await this.contactService.getContactsForUser(principal.details.id);
        } else {
            contacts = await this.contactService.getAllContacts();
        }

        return this.json(contacts);
    }

    @httpPost('/')
    async createContact(
        @requestBody() { name }: { name: string },
        @principal() principal: Principal,
    ) {

        if (name === undefined || name.trim().length === 0) {
            return this.badRequest('Invalid name');
        }

        if (await this.contactService.getContactByName(name) !== undefined) {
            return this.badRequest('Contact already exists');
        }

        const newContact = await this.contactService.addNewContact(name, principal.details);
        this.socketManager.broadcastEvent(SubscriptionNames.Contacts.Added, newContact);

        return this.json(newContact);
    }
}
