import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from './store';

render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>,
    document.getElementById('app'),
);
