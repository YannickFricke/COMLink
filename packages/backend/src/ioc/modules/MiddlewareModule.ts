import { ContainerModule } from 'inversify';
import { AuthMiddleware } from '../../middleware/AuthMiddleware';

export class MiddlewareModule extends ContainerModule {
    constructor() {
        super(bind => {
            bind(AuthMiddleware).toSelf();
        });
    }
}
