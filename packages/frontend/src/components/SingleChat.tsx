import { Contact } from '@comlink/framework/dist/entity/Contact';
import { Message } from '@comlink/framework/dist/entity/Message';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IDType } from '../filter/IDType';
import { getPlayers, getUser } from '../helper/auth';
import { IStoreState } from '../store/reducer/RootReducer';
import { Chat } from './Chat';
import { SocketContext } from '../context/SocketContext';
import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';

export interface ISingleChatParams {
    id?: string;
    filter: IDType;
}

export const SingleChat: React.FC = () => {
    const params = useParams<ISingleChatParams>();
    const user = getUser();
    const messages = useSelector<IStoreState, Message[]>(
        (state) => state.messages.messages,
    );
    const contacts = useSelector<IStoreState, Contact[]>(
        (state) => state.contacts.contacts,
    );
    const players = getPlayers();

    const socket = useContext(SocketContext);

    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const [sender, setSender] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');

    useEffect(() => {
        if (user === undefined) {
            return;
        }

        switch (params.filter) {
            case IDType.All:
                setSender(user.username);
                setRecipient('Alle');
                break;
            case IDType.ByContact:
                const foundContact = contacts.find(
                    (contact) => contact.id === params.id,
                );

                if (foundContact === undefined) {
                    break;
                }

                if (user.isGameMaster) {
                    setSender(foundContact.name);
                    setRecipient(foundContact.owner.username);
                    break;
                }
                setSender(user.username);
                setRecipient(foundContact.name);
                break;
            case IDType.ByPlayer:
                const foundPlayer = players.find(
                    (player) => player.id === params.id,
                );

                if (foundPlayer === undefined) {
                    break;
                }

                setSender(user.username);
                setRecipient(foundPlayer.username);
                break;
        }
    }, [user, params, contacts]);

    useEffect(() => {
        switch (params.filter) {
            case IDType.All:
                setFilteredMessages(
                    messages.filter((message) => message.recipient === 'Alle'),
                );
                break;
            default:
                let chatMessages = messages.filter((message) => {
                    return (
                        (message.sender === sender &&
                            message.recipient === recipient) ||
                        (message.sender === recipient &&
                            message.recipient === sender)
                    );
                });

                setFilteredMessages(chatMessages);
                break;
        }
    }, [messages, sender, recipient, params]);

    useEffect(() => {
        if (socket === undefined) {
            return;
        }

        if (user === undefined) {
            return;
        }

        if (!user.isGameMaster) {
            return;
        }

        socket.emit(SubscriptionNames.Admin.SetMessageFilter, filteredMessages.map(message => message.id));
    }, [socket, user, filteredMessages]);

    return (
        <Chat
            messages={filteredMessages}
            recipient={recipient}
            sender={sender}
        />
    );
};
