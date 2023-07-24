import { ContainerModule } from 'inversify';
import { UserService } from '../../services/UserService';
import { AuthService } from '../../services/AuthService';
import { MessageService } from '../../services/MessageService';
import { ContactService } from '../../services/ContactService';

export class ServicesModule extends ContainerModule {
    constructor() {
        super((bind) => {
            bind(AuthService).toSelf();
            bind(UserService).toSelf();
            bind(MessageService).toSelf();
            bind(ContactService).toSelf();
        });
    }
}
