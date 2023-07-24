import { ContainerModule } from 'inversify';
import { SocketManager } from '../../net/SocketManager';

export class WebsocketModule extends ContainerModule {
    constructor() {
        super(bind => {
            bind(SocketManager).toSelf().inSingletonScope();
        });
    }
}
