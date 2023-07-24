import { Button, Divider, Form } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FieldState } from '../definitions/FieldState';
import { getEndpoint, isLoggedIn } from '../helper/auth';
import { SetLoggedIn } from '../store/ducks/auth.duck';
import { StyledContainer } from './Container';
import { FieldEntry } from './form/FieldEntry';

export const StyledLogin = styled.div`
    width: 25%;
    background-color: white;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
`;

export const Login: React.FC = () => {
    const endpoint = getEndpoint();
    const dispatch = useDispatch();
    const history = useHistory();

    const [usernameStatus, setUsernameStatus] = useState<FieldState>({
        validateStatus: '',
        help: undefined,
    });

    if (isLoggedIn()) {
        return <Redirect to="/" />;
    }

    return (
        <StyledContainer>
            <StyledLogin>
                <h1>Login</h1>
                <Form
                    layout={'vertical'}
                    onValuesChange={(changedValue) => {
                        if (changedValue['username'] !== undefined) {
                            return;
                        }

                        setUsernameStatus({
                            validateStatus: '',
                            help: undefined,
                        });
                    }}
                    onFinish={async (values) => {
                        try {
                            const response = await axios.post(
                                `${endpoint}/auth/login`,
                                values,
                            );
                            const jwtToken = response.data;

                            dispatch(SetLoggedIn(jwtToken));
                            history.push('/');
                        } catch (error) {
                            switch (error.response?.status) {
                                case 400:
                                    if (
                                        typeof error.response?.data ===
                                            'string' &&
                                        error.response?.data.startsWith(
                                            'Could not find any entity of type "User" matching',
                                        )
                                    ) {
                                        setUsernameStatus({
                                            validateStatus: 'error',
                                            help: 'Benutzer nicht gefunden',
                                        });
                                    }
                                    break;
                            }
                        }
                    }}
                >
                    <FieldEntry
                        name={'username'}
                        description={'Benutzer'}
                        type={'text'}
                        validateStatus={usernameStatus.validateStatus}
                        help={usernameStatus.help}
                    />
                    <FieldEntry
                        name={'password'}
                        description={'Passwort'}
                        type={'password'}
                    />
                    <Button type={'primary'} htmlType={'submit'} block>
                        Einloggen
                    </Button>
                </Form>
                <Divider>ODER</Divider>
                <Link to={'/register'}>
                    <Button block>Registrieren</Button>
                </Link>
            </StyledLogin>
        </StyledContainer>
    );
};
