import React from 'react';
import { SocketContext } from './SocketContext';
import { useWebsocket } from '../hooks/useWebsocket';
import { getEndpoint, getJWTToken } from '../helper/auth';

export const SocketContextProvider: React.FC = (props) => {
    const socket = useWebsocket(
        getEndpoint(),
        getJWTToken(),
    );

    return <SocketContext.Provider value={socket}>
        {props.children}
    </SocketContext.Provider>;
};
