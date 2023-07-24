import { Button, Divider, Form } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FieldState } from '../definitions/FieldState';
import { getEndpoint, isLoggedIn } from '../helper/auth';
import { StyledContainer } from './Container';
import { FieldEntry } from './form/FieldEntry';

export const StyledRegister = styled.div`
    width: 25%;
    background-color: white;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
`;

export const Register: React.FC = () => {
    const [usernameStatus, setUsernameStatus] = useState<FieldState>({
        validateStatus: '',
        help: undefined,
    });
    const [passwordStatus, setPasswordStatus] = useState<FieldState>({
        validateStatus: '',
        help: undefined,
    });

    const endpoint = getEndpoint();
    const history = useHistory();

    if (isLoggedIn()) {
        return <Redirect to="/" />;
    }

    return (
        <StyledContainer>
            <StyledRegister>
                <h1 className="text-3xl">Registration</h1>
                <Form
                    layout={'vertical'}
                    onValuesChange={(changedValue, values) => {
                        if (changedValue['username'] !== undefined) {
                            setUsernameStatus({
                                validateStatus: '',
                                help: undefined,
                            });
                            return;
                        }

                        if (
                            values['password'] === undefined ||
                            values['repeatPassword'] === undefined
                        ) {
                            return;
                        }

                        const { password, repeatPassword } = values;

                        if (password === repeatPassword) {
                            setPasswordStatus({
                                validateStatus: '',
                                help: undefined,
                            });

                            return;
                        }

                        setPasswordStatus({
                            validateStatus: 'error',
                            help: 'Die Passwörter stimmen nicht überein.',
                        });
                    }}
                    onFinish={async ({ username, password }) => {
                        try {
                            await axios.post(`${endpoint}/auth/register`, {
                                username,
                                password,
                            });

                            history.push('/login');
                        } catch (error) {
                            switch (error.response?.status) {
                                case 400:
                                    if (
                                        'usernameTaken' in
                                        error.response?.data.constraints
                                    ) {
                                        setUsernameStatus({
                                            validateStatus: 'error',
                                            help:
                                                'Der Benutzername ist schon vergeben',
                                        });
                                        return;
                                    }
                                    break;
                                default:
                                    alert(
                                        'Es ist ein unbekannter Fehler aufgetreten',
                                    );
                                    break;
                            }
                        }
                    }}
                >
                    <FieldEntry
                        name={'username'}
                        description={'Benutzername'}
                        type={'text'}
                        validateStatus={usernameStatus.validateStatus}
                        help={usernameStatus.help}
                    />
                    <FieldEntry
                        name={'password'}
                        description={'Passwort'}
                        type={'password'}
                        validateStatus={passwordStatus.validateStatus}
                        help={passwordStatus.help}
                    />
                    <FieldEntry
                        name={'repeatPassword'}
                        description={'Passwort wiederholen'}
                        type={'password'}
                    />
                    <Button type={'primary'} htmlType={'submit'} block>
                        Registrieren
                    </Button>
                </Form>
                <Divider>ODER</Divider>
                <Link to={'/login'}>
                    <Button block>Einloggen</Button>
                </Link>
            </StyledRegister>
        </StyledContainer>
    );
};
