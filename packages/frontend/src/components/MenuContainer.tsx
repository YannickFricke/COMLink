import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { Contact } from '@comlink/framework/dist/entity/Contact';
import { User } from '@comlink/framework/dist/entity/User';
import { Menu } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getPlayers, getUser } from '../helper/auth';
import { SetLoggedOut } from '../store/ducks/auth.duck';
import { IStoreState } from '../store/reducer/RootReducer';

const { Item, SubMenu } = Menu;

export const StyledMenu = styled.div`
    width: 20vw;
    height: 100vh;
`;

export const MenuContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = getUser();
    const players = getPlayers();
    const storedContacts = useSelector<IStoreState, Contact[]>(
        (state) => state.contacts.contacts,
    );

    const mappedContacts:
        | Contact[]
        | Record<string, Pick<User, 'id' | 'username'>[]> = user?.isGameMaster
        ? storedContacts.reduce<
              Record<string, Pick<User, 'id' | 'username'>[]>
          >((acc, entry) => {
              return {
                  ...acc,
                  [entry.owner.username]: (
                      acc[entry.owner.username] ?? []
                  ).concat({
                      id: entry.id,
                      username: entry.name,
                  }),
              };
          }, {})
        : storedContacts;

    return (
        <StyledMenu>
            <Menu
                theme={'dark'}
                style={{
                    height: '100vh',
                }}
            >
                <Menu.Item disabled>
                    {user === undefined
                        ? 'Benutzerdaten werden geladen'
                        : `Hallo ${user.username}`}
                </Menu.Item>

                <Item>
                    <Link to="/chats/all">"Alle" Chat</Link>
                </Item>

                {user?.isGameMaster === false &&
                    players.map((player) => (
                        <Item key={player.id} icon={<UserOutlined />}>
                            <Link to={`/chats/byPlayer/${player.id}`}>
                                {player.username}
                            </Link>
                        </Item>
                    ))}

                {user?.isGameMaster &&
                    Object.keys(mappedContacts).map((key) => (
                        <SubMenu key={key} title={key}>
                            {/*// @ts-ignore*/}
                            {mappedContacts[key].map((chatter) => (
                                <Item key={chatter.id} icon={<UserOutlined />}>
                                    <Link to={`/chats/byContact/${chatter.id}`}>
                                        {chatter.username}
                                    </Link>
                                </Item>
                            ))}
                        </SubMenu>
                    ))}

                {user?.isGameMaster === false &&
                    (mappedContacts as Contact[]).map((contact) => (
                        <Item key={contact.id}>
                            <Link to={`/chats/byContact/${contact.id}`}>
                                <div className="p-5 pl-10 flex border-b border-gray-500 hover:bg-purple-300 cursor-pointer">
                                    <MailOutlined className="mr-2" />{' '}
                                    {contact.name}
                                </div>
                            </Link>
                        </Item>
                    ))}

                <Menu.Item>
                    <Link to={'/my-contacts'}>Kontakte</Link>
                </Menu.Item>

                <Menu.Item>
                    <Link to={'/settings'}>Einstellungen</Link>
                </Menu.Item>

                <Menu.Item
                    onClick={() => {
                        dispatch(SetLoggedOut());
                        history.push('/');
                    }}
                >
                    <Link to={'/logout'}>Logout</Link>
                </Menu.Item>
            </Menu>
        </StyledMenu>
    );
};
