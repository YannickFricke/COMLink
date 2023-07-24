import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IStoreState } from '../store/reducer/RootReducer';
import { Message } from '@comlink/framework/dist/entity/Message';
import format from 'date-fns/format';
import { User } from '@comlink/framework/dist/entity/User';
import { ArrowRight, Edit, Trash } from 'react-feather';
import { SocketContext } from '../context/SocketContext';
import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';
import Select from 'react-select';
import { useScroll } from '../hooks/useScroll';
import { Contact } from '@comlink/framework/dist/entity/Contact';

export const ChatOld: React.FC = (props) => {
    const [selectedContact, setSelectedContact] = useState('');
    const [message, setMessage] = useState('');
    const [editingMessage, setEditingMessage] = useState<Message | undefined>(undefined);

    const user = useSelector<IStoreState, User | undefined>(state => state.user.user);
    const messages = useSelector<IStoreState, Message[]>(state => state.messages.messages);
    const contacts = useSelector<IStoreState, Contact[]>(state => state.contacts.contacts).map(contact => ({
        value: contact.name,
        label: user?.isGameMaster ? `${contact.name} (${contact.owner.username})` : contact.name,
    })).concat([
        {
            value: 'Alle',
            label: 'Alle',
        }]);
    const socket = useContext(SocketContext)!;

    console.log({
        messages,
        contacts,
    });

    const { ref, scrollToLastItem } = useScroll({
        threshold: 100,
    });

    useEffect(() => {
        // scrollToLastItem();
    }, [messages]);

    return <div className='w-full h-full'>
        <div className='overflow-y-scroll' style={{ height: '80%' }} ref={ref}>
            {user !== undefined && messages.map(message => {
                const timestamp = new Date(message.timestamp);

                return <div className='border border-gray-500 rounded m-4 bg-white' key={message.id}>
                    <div className="border-b border-gray-500 bg-purple-200 p-2 flex justify-between">
                        <div className='flex'>
                            <span className='px-2 rounded border border-black bg-white'>{message.sender}</span>
                            <ArrowRight
                                className='mx-1'/>
                            <span
                                className='px-2 rounded border border-black bg-white mr-2'>{message.recipient}</span>am {format(timestamp, 'dd.MM.yyyy')} um {format(timestamp, 'HH:mm:ss')}
                        </div>
                        {(user.isGameMaster || user.username === message.sender) &&
                        <div className="flex gap-3">
                            <Edit onClick={() => {
                                setEditingMessage(message);
                            }}/>
                            <Trash onClick={() => {
                                if (!confirm('Willst du die Nachricht wirklich löschen?')) {
                                    return;
                                }

                                socket.emit(SubscriptionNames.Messages.Deleted, message.id);
                            }}/>
                        </div>}
                    </div>
                    <div className='p-2'>
                        {message.content}
                    </div>
                </div>;
            })}
        </div>
        <div className='border-t border-gray-500 p-3 bg-white' style={{
            height: '20%',
        }}>
            <div className='w-full px-3 py-1'>
                <Select placeholder='Kontakt auswählen...'
                        menuPlacement={'auto'}
                        value={editingMessage !== undefined ? {
                            value: editingMessage.recipient,
                            label: editingMessage.recipient,
                        } : {
                            value: selectedContact,
                            label: selectedContact,
                        }}
                        onChange={(value: any) => {
                            setSelectedContact(value.value);
                        }} options={contacts}/>
            </div>
            <div className='flex justify-between w-full p-3 items-center'>
                <div className='w-full'>
                    <input className='w-full p-2 rounded border border-gray-500 focus:border-purple-900'
                           placeholder={'Neue Nachricht schreiben...'}
                           value={editingMessage !== undefined ? editingMessage.content : message}
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
                           }}/>
                </div>
                <div>
                    <button className='bg-purple-900 text-white rounded p-3 ml-3' disabled={!user} onClick={() => {
                        if (editingMessage !== undefined) {
                            if (editingMessage.recipient.length === 0) {
                                return;
                            }

                            if (editingMessage.content.length === 0) {
                                return;
                            }

                            socket.emit(SubscriptionNames.Messages.Edited, editingMessage);
                            setEditingMessage(undefined);
                        } else {
                            if (selectedContact.trim().length === 0) {
                                return;
                            }

                            if (message.trim().length === 0) {
                                return;
                            }

                            setMessage('');

                            socket.emit(SubscriptionNames.Messages.Added, user?.username, selectedContact, message);
                        }
                    }}>
                        Nachricht {editingMessage === undefined ? 'senden' : 'bearbeiten'}
                    </button>
                </div>
            </div>
        </div>
    </div>;
};
