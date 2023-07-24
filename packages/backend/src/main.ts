import 'reflect-metadata';
import { authenticateSocket } from '@h.schulz/socketio-auth-typescript/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import { static as staticAssets } from 'express';
import { createServer } from 'http';
import { InversifyExpressServer } from 'inversify-express-utils';
import io from 'socket.io';
import { AuthProvider } from './auth/AuthProvider';
import { getContainer } from './ioc';
import { SocketManager } from './net/SocketManager';
import { AuthService } from './services/AuthService';
import { cwd } from "process";

import './controller/AuthController';
import './controller/ContactController';
import './controller/MessageController';
import './controller/UserController';

console.log(`Starting from: ${cwd()}`);

config();

(async () => {
    const port = process.env.PORT ?? 3000;
    const container = await getContainer();
    const socketManager = container.get(SocketManager);

    const server = new InversifyExpressServer(
        container,
        null,
        null,
        null,
        AuthProvider,
    );

    server.setConfig((app) => {
        app.use(cors());
        app.use(staticAssets('html'));
        app.use(
            bodyParser.urlencoded({
                extended: true,
            }),
        );
        app.use(bodyParser.json());
        app.set('etag', false);
    });

    const app = server.build();
    const http = createServer(app);
    const socketIOServer = io(http);

    socketIOServer.listen(http);

    socketIOServer.on('connection', (socket) => {
        socketManager.onConnect(socket);

        socket.on('disconnect', () => {
            socketManager.onDisconnect(socket);
        });
    });

    authenticateSocket(socketIOServer, {
        onAuthenticate: (socket, data, callback) => {
            if (!data) {
                return callback(new Error('Authentication error - No Data'));
            }

            if (data === 'obsclient:obsclient') {
                socket.isAuthenticated = true;
                return callback(undefined);
            }

            socket.isAuthenticated = false;

            try {
                const authService = container.get(AuthService);
                authService.decodeJWT(data);
                socket.isAuthenticated = true;
                return callback(undefined);
            } catch (error) {
                return callback(error);
            }
        },
    });

    http.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    });
})();
