import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { getEndpoint, isLoggedIn } from '../helper/auth';
import { IStoreState } from '../store/reducer/RootReducer';
import { Contact } from '@comlink/framework/dist/entity/Contact';
import { User } from '@comlink/framework/dist/entity/User';
import { Redirect } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { Button, Card, Form, Input, Popconfirm, Tabs } from 'antd';
import { SubscriptionNames } from '@comlink/framework/dist/definitions/SubscriptionNames';
import { Edit, Trash } from 'react-feather';
import axios from 'axios';
import { ExclamationOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { useForm } = Form;

export const Contacts: React.FC = () => {
    const [form] = useForm();
    const endpoint = getEndpoint();
    const jwtToken = useSelector<IStoreState, string | undefined>(state => state.auth.jwt);
    const user = useSelector<IStoreState, User>(state => state.user.user!);
    const contacts = useSelector<IStoreState, Contact[]>(state => state.contacts.contacts);
    const socket = useContext(SocketContext)!;

    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

    if (!isLoggedIn()) {
        return <Redirect to='/login'/>;
    }

    if (user === undefined) {
        return <div>Lade Daten</div>;
    }

    const contactsByUser = contacts.reduce<Record<string, Contact[]>>((acc, entry) => {
        return {
            ...acc,
            [entry.owner.username]: [
                ...(acc[entry.owner.username] ?? []),
                entry,
            ],
        };
    }, {});

    return <div style={{
        padding: '1rem',
        width: '100%',
    }}>
        <Form layout={'vertical'} form={form} initialValues={{
            'contactName': editingContact?.name ?? '',
        }} onFinish={async (values) => {
            if (editingContact !== undefined) {
                socket.emit(SubscriptionNames.Contacts.Edited, {
                    ...editingContact,
                    name: values.contactName,
                } as Contact);
                form.setFieldsValue({
                    contactName: '',
                });
                setEditingContact(undefined);
            } else {
                try {
                    await axios.post(`${endpoint}/contacts`, {
                        name: values.contactName,
                    }, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    });
                    form.setFieldsValue({
                        contactName: '',
                    });
                } catch (error) {
                    switch (error.response?.status) {
                        case 400:
                            // setFieldError('contactName', 'Es gab ein Problem beim Speichern des neuen Kontaktes');
                            break;
                    }
                }
            }
        }}>
            <Card title='Kontakt erstellen / bearbeiten' style={{
                marginBottom: '1rem',
            }}>
                <Form.Item label={'Name des Kontakts'} name={'contactName'} shouldUpdate={true}>
                    <Input type={'text'} autoComplete={'off'} value={editingContact?.name ?? ''}/>
                </Form.Item>
                <Button type={'primary'} htmlType={'submit'} block>
                    {editingContact !== undefined ? 'Kontakt bearbeiten' : 'Kontakt anlegen'}
                </Button>
            </Card>
            <Card title='Kontakte'>
                {user.isGameMaster && <Tabs tabPosition='left'>
                    {Object.keys(contactsByUser).map(username => <TabPane tab={username} key={username}>
                        {contactsByUser[username].map(contact => <Card style={{
                            marginBottom: '1rem',
                        }} key={contact.id} title={contact.name} extra={<div>
                            <Edit style={{ marginRight: '1rem' }} onClick={() => {
                                form.setFieldsValue({
                                    contactName: contact.name,
                                });
                                setEditingContact(contact);
                            }}/>
                            <Popconfirm title='Soll der Kontakt wirklich gelöscht werden?' okText='Ja'
                                        cancelText='Abbrechen' icon={<ExclamationOutlined style={{ color: 'red' }}/>}
                                        onConfirm={() => {
                                            socket.emit(SubscriptionNames.Contacts.Deleted, contact.id);
                                        }}>
                                <Trash/>
                            </Popconfirm>
                        </div>}/>)}
                    </TabPane>)}
                </Tabs>}
                {!user.isGameMaster && contacts.map(contact => <Card key={contact.id} title={contact.name} style={{
                    marginBottom: '1rem',
                }} extra={(user.isGameMaster || contact.owner.id === user.id) && <div>
                    <Edit style={{ marginRight: '1rem' }} onClick={() => {
                        form.setFieldsValue({
                            contactName: contact.name,
                        });
                        setEditingContact(contact);
                    }}/>
                    <Popconfirm title='Soll der Kontakt wirklich gelöscht werden?' okText='Ja'
                                cancelText='Abbrechen' icon={<ExclamationOutlined style={{ color: 'red' }}/>}
                                onConfirm={() => {
                                    socket.emit(SubscriptionNames.Contacts.Deleted, contact.id);
                                }}>
                        <Trash/>
                    </Popconfirm>
                </div>}/>)}
            </Card>
        </Form>
    </div>;
};
