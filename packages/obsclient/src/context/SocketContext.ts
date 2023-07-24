import { createContext } from 'react';

export const SocketContext = createContext<SocketIOClient.Socket | undefined>(undefined);
