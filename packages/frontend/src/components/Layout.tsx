import { Contact } from '@comlink/framework/dist/entity/Contact';
import { User } from '@comlink/framework/dist/entity/User';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import { getEndpoint, getJWTToken, isLoggedIn } from '../helper/auth';
import { axiosFetcher } from '../net/axiosFetcher';
import { FetchedContacts } from '../store/ducks/contact.duck';
import { FetchedMessages } from '../store/ducks/message.duck';
import { FetchedPlayers } from '../store/ducks/players.duck';
import { FetchedUser } from '../store/ducks/user.duck';
import { MenuContainer } from './MenuContainer';

export const StyledLayout = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Layout: React.FC = (props) => {
    const dispatch = useDispatch();
    const endpoint = getEndpoint();
    const jwtToken = getJWTToken();

    const { data: user } = useSWR<User>(
        [`${endpoint}/user/me`, jwtToken],
        axiosFetcher,
    );
    const { data: users } = useSWR<User[]>(
        [`${endpoint}/user/`, jwtToken],
        axiosFetcher,
    );
    const { data: contacts } = useSWR<Contact[]>(
        [`${endpoint}/contacts`, jwtToken],
        axiosFetcher,
    );
    const { data: messages } = useSWR(
        [`${endpoint}/messages`, jwtToken],
        axiosFetcher,
    );

    useEffect(() => {
        if (user === undefined) {
            return;
        }

        dispatch(FetchedUser(user));
    }, [user]);

    useEffect(() => {
        if (user === undefined || users === undefined) {
            return;
        }

        dispatch(
            FetchedPlayers(
                users
                    .filter((entry) => !entry.isGameMaster)
                    .filter((entry) => entry.username !== user.username)
                    .map((user) => ({ id: user.id, username: user.username })),
            ),
        );
    }, [user, users]);

    useEffect(() => {
        if (contacts === undefined) {
            return;
        }

        dispatch(FetchedContacts(contacts));
    }, [contacts]);

    useEffect(() => {
        if (messages === undefined) {
            return;
        }

        dispatch(FetchedMessages(messages));
    }, [messages]);

    if (!isLoggedIn()) {
        return <Redirect to="/login" />;
    }

    return (
        <StyledLayout>
            <MenuContainer />
            {props.children}
        </StyledLayout>
    );
};
