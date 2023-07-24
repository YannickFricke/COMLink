import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';
import { Message } from '@comlink/framework/dist/entity/Message';
import { User } from '@comlink/framework/dist/entity/User';
import { Button, Card, Empty, Input, Popconfirm } from 'antd';
import format from 'date-fns/format';
import React, { useContext, useEffect, useState } from 'react';
import { Edit, Trash } from 'react-feather';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SocketContext } from '../context/SocketContext';
import { useScroll } from '../hooks/useScroll';
import { IStoreState } from '../store/reducer/RootReducer';
import { ChatHeader } from './Chat/ChatHeader';

export const StyledChat = styled.div`
    height: 100vh;
    width: 80vw;
`;

export const StyledChatMessages = styled.div`
    height: calc(100vh - 6rem);
    overflow-y: scroll;
`;

interface IChatProps {
    messages: Message[];
    sender: string;
    recipient: string;
}

export const Chat: React.FC<IChatProps> = ({ messages, sender, recipient }) => {
    const [message, setMessage] = useState('');
    const [editingMessage, setEditingMessage] = useState<Message | undefined>(
        undefined,
    );

    const user = useSelector<IStoreState, User | undefined>(
        (state) => state.user.user,
    );
    const socket = useContext(SocketContext)!;

    const { ref, scrollToLastItem } = useScroll({
        threshold: 100,
    });

    useEffect(() => {
        scrollToLastItem();
    }, [messages]);

    return (
        <StyledChat>
            <ChatHeader
                chatterName={
                    user?.isGameMaster ? `${sender} an ${recipient}` : recipient
                }
            />
            {messages.length === 0 ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'calc(100vh - 6rem)',
                    }}
                >
                    <Empty description={'Keine Nachrichten vorhanden'} />
                </div>
            ) : (
                <StyledChatMessages ref={ref}>
                    {user !== undefined &&
                        messages.map((message) => {
                            const timestamp = new Date(message.timestamp);

                            return (
                                <Card
                                    size={'small'}
                                    style={{
                                        margin: '1rem',
                                    }}
                                    title={
                                        <div>
                                            {message.sender} an{' '}
                                            {message.recipient} am{' '}
                                            {format(timestamp, 'dd.MM.yyyy')} um{' '}
                                            {format(timestamp, 'HH:mm:ss')}
                                        </div>
                                    }
                                    extra={
                                        user.isGameMaster ||
                                        user.username === message.sender ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: '1rem',
                                                }}
                                            >
                                                <Edit
                                                    onClick={() => {
                                                        setEditingMessage(
                                                            message,
                                                        );
                                                    }}
                                                />
                                                <Popconfirm
                                                    title="Willst du die Nachricht wirklich löschen?"
                                                    onConfirm={() => {
                                                        socket.emit(
                                                            SubscriptionNames
                                                                .Messages
                                                                .Deleted,
                                                            message.id,
                                                        );
                                                    }}
                                                >
                                                    <Trash />
                                                </Popconfirm>
                                            </div>
                                        ) : null
                                    }
                                    key={message.id}
                                >
                                    <div>{message.content}</div>
                                </Card>
                            );
                        })}
                </StyledChatMessages>
            )}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '3rem',
                    bottom: 0,
                    borderTop: '1px solid #ddd',
                    background: 'white',
                    padding: '0 1rem',
                    gap: '1rem',
                }}
            >
                <Input
                    placeholder={'Neue Nachricht schreiben...'}
                    value={
                        editingMessage !== undefined
                            ? editingMessage.content
                            : message
                    }
                    onChange={(event) => {
                        const newContent = event.currentTarget.value;

                        if (editingMessage !== undefined) {
                            setEditingMessage({
                                ...editingMessage,
                                content: newContent,
                            });
                        } else {
                            setMessage(newContent);
                        }
                    }}
                />
                <Button
                    type={'primary'}
                    disabled={!user}
                    onClick={() => {
                        if (editingMessage !== undefined) {
                            if (editingMessage.recipient.length === 0) {
                                return;
                            }

                            if (editingMessage.content.length === 0) {
                                return;
                            }

                            socket.emit(
                                SubscriptionNames.Messages.Edited,
                                editingMessage,
                            );
                            setEditingMessage(undefined);
                        } else {
                            if (message.trim().length === 0) {
                                return;
                            }

                            setMessage('');

                            socket.emit(
                                SubscriptionNames.Messages.Added,
                                sender,
                                recipient,
                                message,
                            );
                        }
                    }}
                >
                    Nachricht{' '}
                    {editingMessage === undefined ? 'senden' : 'bearbeiten'}
                </Button>
            </div>
        </StyledChat>
    );
};
