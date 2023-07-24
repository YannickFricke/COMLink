import { Container } from 'inversify';
import { DatabaseModule } from './modules/DatabaseModule';
import { ServicesModule } from './modules/ServicesModule';
import { AuthModule } from './modules/AuthModule';
import { MiddlewareModule } from './modules/MiddlewareModule';
import { WebsocketModule } from './modules/WebsocketModule';

export const getContainer = async () => {
    const container = new Container();

    container.load(
        new AuthModule(),
        new ServicesModule(),
        new MiddlewareModule(),
        new WebsocketModule(),
    );
    await container.loadAsync(new DatabaseModule());

    return container;
};
