import { Message } from '@comlink/framework/dist/entity/Message';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import { Chat } from './components/Chat';
import { getEndpoint, getJWTToken } from './helper/auth';
import { axiosFetcher } from './net/axiosFetcher';
import { FetchedMessages } from './store/ducks/message.duck';
import { IStoreState } from './store/reducer/RootReducer';

export const App = () => {
    const endpoint = getEndpoint();
    const jwtToken = getJWTToken();
    const dispatch = useDispatch();

    const { data: fetchedMessages } = useSWR(
        [`${endpoint}/messages/all`, jwtToken],
        axiosFetcher,
    );

    useEffect(() => {
        if (fetchedMessages === undefined) {
            return;
        }

        dispatch(FetchedMessages(fetchedMessages));
    }, [fetchedMessages]);

    const messages = useSelector<IStoreState, Message[]>(
        (state) => state.messages.messages,
    );
    const filteredIds = useSelector<IStoreState, string[]>(state => state.messages.filteredIds);

    return <Chat messages={messages.filter(message => filteredIds.includes(message.id))}/>;
};
