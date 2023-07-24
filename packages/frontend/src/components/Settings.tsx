import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { Card, Descriptions, Form, Input, PageHeader, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStoreState } from 'src/store/reducer/RootReducer';

interface IFormValues {
    endpoint: string;
    jwtToken: string;
}

export const Settings: React.FC = () => {
    const endpoint = useSelector<IStoreState, string>(
        (state) => state.auth.endpoint,
    );
    const jwtToken = useSelector<IStoreState, string | undefined>(
        (state) => state.auth.jwt,
    );
    const loggedIn = useSelector<IStoreState, boolean>(
        (state) => state.auth.loggedIn,
    );
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);

    return (
        <PageHeader title="Einstellungen">
            <Card
                title="Server Einstellungen"
                extra={
                    !isEditing ? (
                        <EditOutlined onClick={() => setIsEditing(true)} />
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '1rem',
                            }}
                        >
                            <CheckOutlined />
                            <Popconfirm
                                title="Sollen die Änderungen wirklich verworfen werden?"
                                onConfirm={() => setIsEditing(false)}
                            >
                                <CloseOutlined />
                            </Popconfirm>
                        </div>
                    )
                }
            >
                <Form
                    onFinish={(values: IFormValues) => {
                        console.log({ values });
                    }}
                >
                    <Descriptions>
                        <Descriptions.Item label="Endpunkt" span={3}>
                            {isEditing ? (
                                <Input
                                    name="endpoint"
                                    id="endpoint"
                                    defaultValue={endpoint}
                                />
                            ) : (
                                endpoint
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="JWT Token" span={3}>
                            {jwtToken &&
                                (isEditing ? (
                                    <Input
                                        name="jwtToken"
                                        id="jwtToken"
                                        defaultValue={jwtToken}
                                    />
                                ) : (
                                    <span>{jwtToken?.substr(0, 25)}...</span>
                                ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Eingeloggt">
                            {loggedIn ? 'Ja' : 'Nein'}
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
            </Card>
        </PageHeader>
    );
};
