import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';
import { Contact } from '@comlink/framework/dist/entity/Contact';
import { Message } from '@comlink/framework/dist/entity/Message';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { getUser, isLoggedIn } from '../helper/auth';
import { SetLoggedOut } from '../store/ducks/auth.duck';
import {
    AddContact,
    DeleteContact,
    EditContact,
} from '../store/ducks/contact.duck';
import {
    AddMessage,
    DeleteMessage,
    EditMessage,
} from '../store/ducks/message.duck';

export const useWebsocket = (
    endpointUrl: string,
    jwtToken?: string,
): SocketIOClient.Socket | undefined => {
    const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>(
        undefined,
    );
    const dispatch = useDispatch();
    const loggedIn = isLoggedIn();
    const user = getUser();

    useEffect(() => {
        if (jwtToken === undefined) {
            return;
        }

        let createdSocket = io(endpointUrl, {
            reconnection: true,
            autoConnect: true,
        });

        createdSocket.on('connect', () => {
            createdSocket.emit('authentication', jwtToken);

            createdSocket.on('unauthorized', (message: string) => {
                if (!loggedIn) {
                    return;
                }

                dispatch(SetLoggedOut());
            });

            createdSocket.on(
                SubscriptionNames.Contacts.Added,
                ([contact]: Contact[]) => {
                    if (
                        user?.isGameMaster === false ||
                        contact.owner.id !== user?.id
                    ) {
                        return;
                    }

                    dispatch(AddContact(contact));
                },
            );

            createdSocket.on(
                SubscriptionNames.Contacts.Edited,
                ([{ contact, updatedMessages }]: {
                    contact: Contact;
                    updatedMessages: Message[];
                }[]) => {
                    if (
                        user?.isGameMaster === false &&
                        contact.owner.id !== user?.id
                    ) {
                        return;
                    }

                    dispatch(EditContact(contact));

                    updatedMessages.forEach((entry) =>
                        dispatch(EditMessage(entry)),
                    );
                },
            );

            createdSocket.on(
                SubscriptionNames.Contacts.Deleted,
                ([contactId]: string[]) => {
                    dispatch(DeleteContact(contactId));
                },
            );

            createdSocket.on(
                SubscriptionNames.Messages.Added,
                ([message]: Message[]) => {
                    dispatch(AddMessage(message));
                },
            );

            createdSocket.on(
                SubscriptionNames.Messages.Edited,
                ([message]: Message[]) => {
                    dispatch(EditMessage(message));
                },
            );

            createdSocket.on(
                SubscriptionNames.Messages.Deleted,
                ([messageId]: string[]) => {
                    console.log({ messageId });

                    dispatch(DeleteMessage(messageId));
                },
            );
        });

        setSocket(createdSocket);

        return () => {
            createdSocket.disconnect();
        };
    }, [endpointUrl, jwtToken, user]);

    return socket;
};
