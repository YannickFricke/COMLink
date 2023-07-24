import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { SocketContextProvider } from './context/SocketContextProvider';
import store from './store';

render(
    <Provider store={store}>
        <SocketContextProvider>
            <App />
        </SocketContextProvider>
    </Provider>,
    document.getElementById('root'),
);
