import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Contacts } from './components/Contacts';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Settings } from './components/Settings';
import { SingleChat } from './components/SingleChat';
import { SocketContextProvider } from './context/SocketContextProvider';

export const App: React.FC = () => {
    return (
        <SocketContextProvider>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/">
                    <Layout>{/*<ChatOld/>*/}</Layout>
                </Route>
                <Route path="/chats/:filter/:id?">
                    <Layout>
                        <SingleChat />
                    </Layout>
                </Route>
                <Route exact path="/my-contacts">
                    <Layout>
                        <Contacts />
                    </Layout>
                </Route>
                <Route exact path="/settings">
                    <Layout>
                        <Settings />
                    </Layout>
                </Route>
            </Switch>
        </SocketContextProvider>
    );
};
