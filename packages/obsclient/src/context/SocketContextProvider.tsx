import React from 'react';
import { useWebsocket } from '../hooks/useWebsocket';
import { SocketContext } from './SocketContext';
import { getEndpoint } from '../helper/auth';

export const SocketContextProvider: React.FC = (props) => {
    const socket = useWebsocket(
        getEndpoint(),
        'obsclient:obsclient',
    );

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};
